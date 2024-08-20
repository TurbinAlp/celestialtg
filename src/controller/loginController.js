const db = require('../dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'bsfx';

// Controller to handle login requests
const loginUser = (req, res) => {
  const {
    loginType,
    phone,
    email,
    password,
  } = req.body;

  if (loginType === 'phone') {
    if (!phone || !password) {
      return res.status(400).json({
        error: 'Phone number and password are required'
      });
    }

    // Query the database for the user with the provided phone
    const query = 'SELECT * FROM users WHERE phone = ? ';
    db.query(query, [phone], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: 'Server error'
        });
      }

      if (result.length === 0) {
        return res.status(400).json({
          error: 'User does not exist'
        });
      }

      const user = result[0];
      console.log(user.phone)

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({
            error: 'server error'
          });
        }

        if (!isMatch) {
          return res.status(400).json({
            error: 'Invalid password'
          });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Success
        res.json({
          message: 'Login successful',
          user,
          token 
        });
      });
    });

  } else if (loginType === 'email') {
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Query the database for the user with the provided email
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: 'Server error'
        });
      }

      if (result.length === 0) {
        return res.status(400).json({
          error: 'Invalid email'
        });
      }

      const user = result[0];

      // Compare the password using bcrypt
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({
            error: 'Server error'
          });
        }

        if (!isMatch) {
          return res.status(400).json({
            error: 'Invalid password'
          });
        }

        // Success
        res.json({
          message: 'Login successful',
          user: {
            id: user.id,
            phone: 'user.phone'
          }
        },
        token 
        );
      });
    });
  } else {
    return res.status(400).json({
      error: 'Invalid login type'
    });
  }
};

module.exports = {
  loginUser
};
