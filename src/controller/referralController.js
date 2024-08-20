const db = require('../dbconfig');

const getReferralCode = (req, res) => {
  const userId = req.params.userId;

  db.query(
    'SELECT code FROM referral_codes WHERE user_id = ?',
    [userId],
    (error, results) => {
      if (error) {
        console.error('Error fetching referral code:', error);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Referral code not found' });
      }

      res.json({ referralCode: results[0].code });
    }
  );
};

module.exports = {
  getReferralCode,
};
