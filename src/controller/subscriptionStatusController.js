// src/controller/subscriptionStatusController.js
const db = require('../dbconfig');

// Get active subscriptions for a specific user
const getActiveSubscriptions = (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const sql = 'SELECT * FROM subscriptions WHERE userId = ? AND endDate >= NOW() AND status = "Active"';
    db.query(sql, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json(results);
    });
};

// Get completed profits for a specific user
const getCompletedProfits = (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const sql = 'SELECT * FROM earnings WHERE userId = ? ';
    db.query(sql, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json(results);
    });
};

module.exports = { getActiveSubscriptions, getCompletedProfits };
