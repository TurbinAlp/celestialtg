const db = require('../dbconfig');

const getInviteData = (req, res) => {
  const userId = req.params.userId;

  // Recursive query to fetch the user's referral tree
  const query = `
    WITH RECURSIVE referral_tree AS (
        SELECT id, userName, phone, email, referrer_id, 1 AS level
        FROM users
        WHERE referrer_id = ? -- Start with users referred by the selected user

        UNION ALL

        SELECT u.id, u.userName, u.phone, u.email, u.referrer_id, rt.level + 1
        FROM users u
        INNER JOIN referral_tree rt ON u.referrer_id = rt.id
        WHERE rt.level < 4 -- Limit to 3 levels
    )
    SELECT id, userName, phone, email, level
    FROM referral_tree
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found.' });
    }

    // Calculate team members and commissions
    const teamMembers = results.length;
    const level1Members = results.filter(person => person.level === 1).length;
    const level2Members = results.filter(person => person.level === 2).length;
    const level3Members = results.filter(person => person.level === 3).length;

    // Query to get pending commissions for each level
    const commissionQuery = `
      SELECT 
        SUM(CASE WHEN level = 1 THEN amount ELSE 0 END) AS level1Commission,
        SUM(CASE WHEN level = 2 THEN amount ELSE 0 END) AS level2Commission,
        SUM(CASE WHEN level = 3 THEN amount ELSE 0 END) AS level3Commission
      FROM commissions
      WHERE uplineId = ? AND isUsed = 'FALSE' -- Modify this condition based on your actual column and value for pending status
    `;

    db.query(commissionQuery, [userId], (commissionsErr, commissionsResults) => {
      if (commissionsErr) {
        console.error('Database error (commissions):', commissionsErr);
        return res.status(500).json({ message: 'Database error', error: commissionsErr });
      }

      const { level1Commission = 0, level2Commission = 0, level3Commission = 0 } = commissionsResults[0];

      // Assuming you have another table for earnings
      const earningsQuery = `
        SELECT IFNULL(SUM(amount), 0) AS totalEarnings
        FROM earnings 
        WHERE userId = ?
      `;

      db.query(earningsQuery, [userId], (earningsErr, earningsResults) => {
        if (earningsErr) {
          console.error('Database error (earnings):', earningsErr);
          return res.status(500).json({ message: 'Database error', error: earningsErr });
        }

        const totalEarnings = earningsResults[0].totalEarnings;

        // Fetch the user's invitation code
        const userQuery = `
          SELECT invitation_code
          FROM users
          WHERE id = ?
        `;

        db.query(userQuery, [userId], (userErr, userResults) => {
          if (userErr) {
            console.error('Database error (user):', userErr);
            return res.status(500).json({ message: 'Database error', error: userErr });
          }

          if (userResults.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
          }

          const invitationCode = userResults[0].invitation_code;
          const totalCommission = level1Commission+level2Commission+level3Commission
          console.log('COMISION1: ', level1Commission)
          console.log('COMISION2: ', level2Commission)
          console.log('COMISION3: ', level3Commission)
          console.log('Total commission: ', totalCommission)

          res.json({
            invitationCode: invitationCode,
            teamMembers: level1Members + level2Members + level3Members,
            level1Members: level1Members,
            level2Members: level2Members,
            level3Members: level3Members,
            totalEarnings: totalEarnings,
            level1Commission: level1Commission,
            level2Commission: level2Commission,
            level3Commission: level3Commission,
            totalCommission: totalCommission,
            people: results, // Return all referral users with levels
            levels: {
              level1: level1Members,
              level2: level2Members,
              level3: level3Members
            }
          });
        });
      });
    });
  });
};

module.exports = {
  getInviteData
};
