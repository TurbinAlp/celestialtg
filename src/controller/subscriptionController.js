const db = require('../dbconfig');
const schedule = require('node-schedule');

const subscribeUser = (req, res) => {
    const { amount, userId } = req.body;

    console.log('Amount entered: ', amount);
    console.log('User ID: ', userId);

    // Step 1: Validate minimum subscription amount
    if (amount < 10) {
        return res.status(400).json({ success: false, message: 'Minimum subscription amount is 10' });
    }

    // Step 2: Check if the user's asset balance is sufficient and matches the subscription amount
    const checkBalanceSql = 'SELECT asset FROM users WHERE id = ?';
    db.query(checkBalanceSql, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error fetching user data', error });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userAsset = results[0].asset;

        // Step 3: Verify if the user is placing the entire asset amount for subscription
        if (userAsset !== amount) {
            return res.status(400).json({ success: false, message: 'You must place the entire asset amount for subscription' });
        }

        // Proceed with subscription
        const subscriptionSql = `INSERT INTO subscriptions (userId, amount, startDate, endDate, status) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 'Active')`;
        
        db.query(subscriptionSql, [userId, amount], (subError, subResults) => {
            if (subError) {
                return res.status(500).json({ success: false, message: 'Subscription failed', error: subError });
            }

            const subscriptionId = subResults.insertId;

            // Step 4: Update the user's asset to 0 since all of it is subscribed
            const updateAssetSql = 'UPDATE users SET asset = 0 WHERE id = ?';
            db.query(updateAssetSql, [userId], (updateError) => {
                if (updateError) {
                    return res.status(500).json({ success: false, message: 'Failed to update user asset', error: updateError });
                }

                // Step 5: Schedule daily earnings calculation, excluding weekends
                const job = schedule.scheduleJob(new Date(Date.now() + 5000), () => {
                    calculateDailyEarnings(subscriptionId, amount, userId);
                });

                // Schedule a job to mark subscription as finished when the subscription period ends
                schedule.scheduleJob(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), () => {
                    updateSubscriptionStatus(subscriptionId);
                });

                return res.status(200).json({ success: true, message: 'Subscription successful' });
            });
        });
    });
};

const updateSubscriptionStatus = (subscriptionId) => {
    const sql = `UPDATE subscriptions SET status = 'Finished' WHERE id = ?`;

    db.query(sql, [subscriptionId], (error) => {
        if (error) {
            console.error('Failed to update subscription status:', error);
        } else {
            console.log('Subscription status updated to Finished');
        }
    });
};

const calculateDailyEarnings = (subscriptionId, amount, userId) => {
    const dailyROI = getDailyROI(amount);
    const dailyEarnings = (amount * dailyROI) / 100;

    // Check if the earnings have already been transferred
    const checkEarningsSql = 'SELECT transferred FROM earnings WHERE subscriptionId = ? AND date = CURDATE()';
    db.query(checkEarningsSql, [subscriptionId], (checkError, results) => {
        if (checkError) {
            console.error('Failed to check earnings transfer status:', checkError);
            return;
        }

        if (results.length > 0 && results[0].transferred) {
            console.log('Earnings already transferred, skipping asset update');
            return;
        }

        // Insert daily earnings into the earnings table
        const insertEarningsSql = `INSERT INTO earnings (subscriptionId, userId, amount, date, transferred) VALUES (?, ?, ?, NOW(), false)`;
        db.query(insertEarningsSql, [subscriptionId, userId, dailyEarnings], (error) => {
            if (error) {
                console.error('Failed to record earnings:', error);
            } else {
                console.log('Earnings recorded');

                // Update the user's asset if the earnings haven't been transferred
                const updateAssetSql = 'UPDATE users SET asset = asset + ? WHERE id = ?';
                db.query(updateAssetSql, [dailyEarnings, userId], (updateError) => {
                    if (updateError) {
                        console.error('Failed to update user asset:', updateError);
                    } else {
                        console.log('User asset updated with daily earnings');
                        distributeCommissions(userId, amount); // Pass the subscription amount here
                    }
                });
            }
        });
    });
};

const getDailyROI = (amount) => {
    if (amount < 50) return 2.5;
    if (amount < 100) return 2.5;
    return 2.5;
};

const distributeCommissions = (userId, amount) => {
    const recursiveQuery = `
        WITH RECURSIVE referral_tree AS (
            SELECT u.id, u.userName, u.phone, u.email, u.referrer_id, 1 AS level
            FROM users u
            WHERE u.id = (SELECT referrer_id FROM users WHERE id = ${db.escape(userId)})
            
            UNION ALL
            
            SELECT u.id, u.userName, u.phone, u.email, u.referrer_id, rt.level + 1
            FROM users u
            INNER JOIN referral_tree rt ON u.id = rt.referrer_id
            WHERE rt.level < 3
        )
        
        SELECT id, userName, phone, email, level
        FROM referral_tree
        ORDER BY level ASC
    `;

    db.query(recursiveQuery, (error, results) => {
        if (error) {
            console.error('Failed to fetch upline details:', error);
            return;
        }

        results.forEach(row => {
            let commissionPercentage = 0;

            switch (row.level) {
                case 1:
                    commissionPercentage = 10;
                    break;
                case 2:
                    commissionPercentage = 5;
                    break;
                case 3:
                    commissionPercentage = 1;
                    break;
                default:
                    console.warn(`Skipping upline with level ${row.level}`);
                    return;
            }

            const commission = (amount * commissionPercentage) / 100;
            const commissionSql = `INSERT INTO commissions (uplineId, amount, level, date) VALUES (?, ?, ?, NOW())`;

            db.query(commissionSql, [row.id, commission, row.level], (err) => {
                if (err) {
                    console.error(`Failed to record commission for level ${row.level}:`, err);
                }
            });
        });
    });
};

module.exports = { subscribeUser };
