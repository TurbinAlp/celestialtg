const db = require('../dbconfig');

const processWithdrawal = (req, res) => {
  const { userId } = req.params;
  const { amount, address } = req.body;

  if (!userId || !amount || amount < 5 || !address) {
    return res.status(400).json({ success: false, message: 'Invalid request.' });
  }

  // Fetch the current wallet balance
  const getBalanceSql = 'SELECT wallet FROM users WHERE id = ?';
  db.query(getBalanceSql, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentBalance = results[0].wallet;

    if (amount > currentBalance) {
      return res.status(400).json({ success: false, message: 'Insufficient funds.' });
    }

    // Record the withdrawal in the database
    const recordWithdrawalSql = 'INSERT INTO withdrawals (user_id, amount, address) VALUES (?, ?, ?)';
    db.query(recordWithdrawalSql, [userId, amount, address], (error, results) => {
      if (error) {
        console.error('Error recording withdrawal:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      // Update the user's wallet balance
      const newBalance = currentBalance - amount;
      const updateBalanceSql = 'UPDATE users SET wallet = ? WHERE id = ?';
      db.query(updateBalanceSql, [newBalance, userId], (error, results) => {
        if (error) {
          console.error('Error updating wallet balance:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        res.json({ success: true, message: 'Withdrawal processed successfully.' });
      });
    });
  });
};

module.exports = { processWithdrawal };
