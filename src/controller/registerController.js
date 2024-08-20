// controllers/registerController.js
const db = require('../dbconfig');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const {
    phone,
    countryCode,
    email,
    password,
    confirmPassword,
    invitationCode
  } = req.body;

  // Validate inputs
  if (!phone && !email) {
    return res.status(400).json({
      message: 'Phone number or email is required.'
    });
  }
  if (!password) {
    return res.status(400).json({
      message: 'Password is required.'
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Password and confirm password do not match.'
    });
  }
  if (!invitationCode) {
    return res.status(400).json({
      message: 'Referral code is required.'
    });
  }

  try {
    // Check if there are any users in the database
    const userCountQuery = `SELECT COUNT(*) AS userCount FROM users`;
    db.query(userCountQuery, (err, countResult) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      const userCount = countResult[0].userCount;

      // If no users exist, allow registration without a referral code
      if (userCount === 0) {
        registerFirstUser();
      } else {
        // Validate the referral code for subsequent users
        const referralCodeCheckQuery = `SELECT * FROM referral_codes WHERE code = ?`;
        db.query(referralCodeCheckQuery, [invitationCode], (err, referralResults) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });

          if (referralResults.length === 0) {
            return res.status(400).json({ message: 'Invalid referral code.' });
          }

          const referrerId = referralResults[0].user_id;

          // Get the referrer's level
          const referrerLevelQuery = `SELECT level FROM users WHERE id = ?`;
          db.query(referrerLevelQuery, [referrerId], (err, referrerResults) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });

            const referrerLevel = referrerResults[0].level;
            const userLevel = referrerLevel < 3 ? referrerLevel + 1 : 3;

            registerUserWithReferral(referrerId, userLevel);
          });
        });
      }
    });

    function registerFirstUser() {
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: 'Error hashing password', error: err });

        const insertUserQuery = `
          INSERT INTO users (phone, country_code, email, password, level, username)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertUserQuery, [phone || null, countryCode || null, email || null, hashedPassword, 1, null], (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });

          const userId = result.insertId;
          const referralCode = userId.toString(); // Use user ID as referral code and username

          const updateUserQuery = `UPDATE users SET username = ? WHERE id = ?`;
          db.query(updateUserQuery, [userId, userId], (err) => {
            if (err) return res.status(500).json({ message: 'Error updating username', error: err });
          });

          const insertReferralCodeQuery = `INSERT INTO referral_codes (user_id, code) VALUES (?, ?)`;
          db.query(insertReferralCodeQuery, [userId, referralCode], (err, referralResult) => {
            if (err) return res.status(500).json({ message: 'Error inserting referral code', error: err });

            return res.status(201).json({
              message: 'First user registered successfully.',
              userId: userId,
              referralCode: referralCode
            });
          });
        });
      });
    }

    function registerUserWithReferral(referrerId, userLevel) {
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: 'Error hashing password', error: err });

        const insertUserQuery = `
          INSERT INTO users (phone, country_code, email, password, referrer_id, level, username)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertUserQuery, [phone || null, countryCode || null, email || null, hashedPassword, referrerId, userLevel, null], (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });

          const userId = result.insertId;
          const referralCode = userId.toString(); // Use user ID as referral code and username

          const updateUserQuery = `UPDATE users SET username = ? WHERE id = ?`;
          db.query(updateUserQuery, [userId, userId], (err) => {
            if (err) return res.status(500).json({ message: 'Error updating username', error: err });
          });

          const insertReferralCodeQuery = `INSERT INTO referral_codes (user_id, code) VALUES (?, ?)`;
          db.query(insertReferralCodeQuery, [userId, referralCode], (err, referralResult) => {
            if (err) return res.status(500).json({ message: 'Error inserting referral code', error: err });

            return res.status(201).json({
              message: 'User registered successfully.',
              userId: userId,
              referralCode: referralCode
            });
          });
        });
      });
    }

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  registerUser
};
