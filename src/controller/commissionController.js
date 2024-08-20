const db = require('../dbconfig');

const transferCommissions = (req, res) => {
    const { userId, amount } = req.body;

    // Fetch user commissions and wallet balance
    const commissionsQuery = `
        SELECT SUM(amount) AS totalCommissions
        FROM commissions
        WHERE uplineId = ? AND isUsed = FALSE
    `;
    const walletQuery = `
        SELECT wallet
        FROM users
        WHERE id = ?
    `;
    
    db.query(commissionsQuery, [userId], (err, commissionsResult) => {
        if (err) {
            console.error('Error fetching commissions:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        db.query(walletQuery, [userId], (err, walletResult) => {
            if (err) {
                console.error('Error fetching wallet balance:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            const commissions = commissionsResult[0];
            const wallet = walletResult[0];

            // Check if the amount to transfer is valid
            if (amount > commissions.totalCommissions) {
                return res.status(400).json({ success: false, message: 'Amount exceeds available commissions.' });
            }

            // Mark relevant commissions as used
            const updateCommissionsQuery = `
                UPDATE commissions
                SET isUsed = TRUE
                WHERE uplineId = ? AND isUsed = FALSE
                LIMIT ?
            `;
            db.query(updateCommissionsQuery, [userId, Math.ceil(amount / 10)], (err) => {
                if (err) {
                    console.error('Error updating commissions:', err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                // Update wallet balance
                const updateWalletQuery = `
                    UPDATE users
                    SET wallet = wallet + ?
                    WHERE id = ?
                `;
                db.query(updateWalletQuery, [amount, userId], (err) => {
                    if (err) {
                        console.error('Error updating wallet balance:', err);
                        return res.status(500).json({ success: false, message: 'Server error' });
                    }

                    // Fetch updated wallet balance
                    const updatedWalletQuery = `
                        SELECT wallet
                        FROM users
                        WHERE id = ?
                    `;
                    db.query(updatedWalletQuery, [userId], (err, updatedWalletResult) => {
                        if (err) {
                            console.error('Error fetching updated wallet balance:', err);
                            return res.status(500).json({ success: false, message: 'Server error' });
                        }

                        const updatedWallet = updatedWalletResult[0];

                        // Return updated balances
                        res.json({
                            success: true,
                            newCommissionsBalance: commissions.totalCommissions - amount,
                            newWalletBalance: updatedWallet.balance
                        });
                    });
                });
            });
        });
    });
};

const getTotalCommissions = (req, res) => {
    const userId  = req.params.userId;

    // Fetch user commissions
    const query = `
        SELECT SUM(amount) AS totalCommissions
        FROM commissions
        WHERE uplineId = ? AND isUsed = FALSE
    `;
    
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching total commissions:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const commissions = result[0];

        console.log('TOTALIIIII: ', userId)
        console.log('TOTALIIIII: ', commissions.totalCommissions)
        res.json({
            success: true,
            totalCommissions: commissions.totalCommissions
        });
    });
};

module.exports = { transferCommissions, getTotalCommissions };
