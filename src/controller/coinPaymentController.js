const Coinpayments = require('coinpayments');
const fetch = require('node-fetch');
const crypto = require('crypto');
const db = require('../dbconfig');

const client = new Coinpayments({
  key: '12005643604066a9979c8479d3ed70f77b05fb25be2b481f7eaa3d14c95e4121',
  secret: 'eBf5C3579B08e7316A69EC243871097ddD30c17aa390c94F048eaD95edd6d44e'
});

const COINPAYMENTS_IPN_SECRET = 'erewtetwwetwewet'; // Set this in your CoinPayments account

const createTransaction = async (req, res) => {
  try {
    const { amount, currency, userId, email } = req.body;

    console.log('UserIDIIIII: ', userId)
    console.log('Emailiii: ', email)
    console.log('CURENCIII: ', currency)

    const transaction = await client.createTransaction({
      amount: amount,
      currency1: 'USD',
      currency2: currency,
      buyer_email: email
    });

    // Store transaction details in your database
    const query = 'INSERT INTO deposits (user_id, txn_id, amount, currency, status) VALUES (?, ?, ?, ?, ?)';
    await db.query(query, [userId, transaction.txn_id, amount, currency, 'pending']);

    res.json({
      success: true,
      transaction: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const handleIPN = async (req, res) => {
  const hmac = crypto.createHmac('sha512', COINPAYMENTS_IPN_SECRET);
  const calculatedHmac = hmac.update(req.body).digest('hex');
  
  if (req.headers['hmac'] !== calculatedHmac) {
    return res.status(403).send('Invalid HMAC');
  }

  const ipnData = new URLSearchParams(req.body.toString());

  const txnId = ipnData.get('txn_id');
  const status = parseInt(ipnData.get('status'));
  const amount = parseFloat(ipnData.get('amount'));

  try {
    if (status >= 100 || status == 2) {
      // Transaction is complete, update your database
      await db.query('UPDATE deposits SET status = ?, amount_received = ? WHERE txn_id = ?', ['completed', amount, txnId]);

      // Get user ID from deposits table
      const [depositResult] = await db.query('SELECT user_id FROM deposits WHERE txn_id = ?', [txnId]);
      const userId = depositResult[0].user_id;

      // Update user's balance
      await db.query('UPDATE users SET wallet = wallet + ? WHERE id = ?', [amount, userId]);
    } else if (status < 0) {
      // Transaction failed, update your database
      await db.query('UPDATE deposits SET status = ? WHERE txn_id = ?', ['failed', txnId]);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing IPN:', error);
    res.sendStatus(500);
  }
};

module.exports = { createTransaction, handleIPN}