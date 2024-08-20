const db = require('../dbconfig');

exports.getAnnouncements = (req, res) => {
  const sql = "SELECT id, title FROM announcements"; 

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Failed to fetch announcements:', err);
      return res.status(500).json({ error: 'Failed to fetch announcements' });
    }

    res.json(results);
  });
};

// Fetch details of a specific announcement
exports.getAnnouncementDetails = (req, res) => {
  const announcementId = req.params.id; 
  const sql = "SELECT * FROM announcements WHERE id = ?";  

  db.query(sql, [announcementId], (err, result) => {
    if (err) {
      console.error('Failed to fetch announcement details:', err);
      return res.status(500).json({ error: 'Failed to fetch announcement details' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(result[0]); 
    console.log(result[0])
  });
};
