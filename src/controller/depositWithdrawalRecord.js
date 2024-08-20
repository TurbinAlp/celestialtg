const db = require('../dbconfig');

const getDepositRecords = (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM deposits WHERE user_id = ?';

  db.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

const getWithdrawalRecords = (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM withdrawals WHERE user_id = ?';
  
    db.query(query, [userId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  };

module.exports = { getDepositRecords, getWithdrawalRecords }