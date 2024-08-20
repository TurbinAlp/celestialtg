const db = require('../dbconfig'); 

const getUserData = (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching user data:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = results[0];
        res.json({ success: true, data: userData });
    });
};

const updateUserData = (req, res) => {
    const { userId } = req.params;
    const { nickname, email } = req.body;
    const profilePicture = req.file; // File uploaded with key 'profilePicture'
  
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
  
    // Check if the email is already in use by another user
    const checkEmailSql = 'SELECT * FROM users WHERE email = ? AND id != ?';
    db.query(checkEmailSql, [email, userId], (error, results) => {
      if (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Email is already in use' });
      }
  
      // Update user data
      let sql = 'UPDATE users SET userName = ?, email = ?';
      const params = [nickname, email];
  
      if (profilePicture) {
        sql += ', profile_picture = ?';
        params.push(profilePicture.path); // Store the file path
      }
  
      sql += ' WHERE id = ?';
      params.push(userId);
  
      db.query(sql, params, (error, results) => {
        if (error) {
          console.error('Error updating user data:', error);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
  
        res.json({ success: true, message: 'User data updated successfully' });
      });
    });
  };
  
  

module.exports = { getUserData, updateUserData };
