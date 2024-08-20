const db = require('../dbconfig'); // Adjust the path if necessary

const updateUserBalances = (req, res) => {
    const { fromAccount, toAccount, amount, userId } = req.body;
    console.log('from account:', fromAccount);
    console.log('to account:', toAccount);
    console.log('amount:', amount);
    console.log('USER ID:', userId);

    // Validate the input
    if (!fromAccount || !toAccount || !amount || !userId) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    // Fetch the current balances
    const sqlFetch = 'SELECT wallet, asset FROM users WHERE id = ?';
    db.query(sqlFetch, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching user data:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const user = results[0];

        // Ensure there are sufficient funds in the 'from' account
        const fromBalance = fromAccount === 'Wallet' ? user.wallet : user.asset;
        if (amount > fromBalance) {
            return res.status(400).json({ success: false, message: 'Insufficient funds' });
        }

        // Calculate new balances
        const newFromBalance = fromBalance - amount;
        const newToBalance = (toAccount === 'Wallet' ? user.wallet : user.asset) + amount;

        // Update the balances in the database
        const sqlUpdate = `
            UPDATE users
            SET wallet = CASE 
                            WHEN ? = 'Wallet' THEN ? 
                            WHEN ? = 'Wallet' THEN ? 
                            ELSE wallet 
                        END,
                asset = CASE 
                            WHEN ? = 'Asset' THEN ? 
                            WHEN ? = 'Asset' THEN ? 
                            ELSE asset 
                        END
            WHERE id = ?
        `;
        db.query(sqlUpdate, [
            fromAccount, newFromBalance,
            toAccount, newToBalance,
            fromAccount, newFromBalance,
            toAccount, newToBalance,
            userId
        ], (updateError, updateResults) => {
            if (updateError) {
                console.error('Error updating user balances:', updateError);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            if (updateResults.affectedRows === 0) {
                return res.status(500).json({ success: false, message: 'Failed to update balances' });
            }

            // Mark all earnings with transferred = 0 to transferred = 1 after transfer
            const sqlUpdateEarnings = `UPDATE earnings SET transferred = 1 WHERE userId = ? AND transferred = 0`;
            db.query(sqlUpdateEarnings, [userId], (err) => {
                if (err) {
                    console.error('Error updating earnings:', err);
                    return res.status(500).json({ success: false, message: 'Failed to update earnings' });
                }

                res.json({ 
                    success: true, 
                    newWalletBalance: fromAccount === 'Wallet' ? newFromBalance : newToBalance,
                    newAssetBalance: fromAccount === 'Asset' ? newFromBalance : newToBalance 
                });
            });
        });
    });
};

module.exports = { updateUserBalances };
