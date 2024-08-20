const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const upload = require('./src/uploadConfig');

const { registerUser } = require('./src/controller/registerController');
const { loginUser } = require('./src/controller/loginController');
const { getInviteData } = require('./src/controller/inviteController');
const { getAnnouncements, getAnnouncementDetails } = require('./src/controller/announcementController');
const { subscribeUser } = require('./src/controller/subscriptionController');
const referralController = require('./src/controller/referralController');
const subscriptionStatusController = require('./src/controller/subscriptionStatusController');
const { updateUserBalances } = require('./src/controller/transferController');
const { getUserData, updateUserData  } = require('./src/controller/userController');
const { transferCommissions, getTotalCommissions } = require('./src/controller/commissionController');
const { processWithdrawal } = require('./src/controller/withdrawalController');
const { createTransaction } = require('./src/controller/coinPaymentController');
const { getDepositRecords, getWithdrawalRecords  } = require('./src/controller/depositWithdrawalRecord');



const app = express();
const db = require('./src/dbconfig');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send("NAJARIBU");
});

// Register route
app.post('/register', registerUser);

// login route
app.post('/login', loginUser);

// invite
app.get('/invite/:userId', getInviteData);

// anouncement
app.get('/announcements', getAnnouncements);
app.get('/announcements/:id', getAnnouncementDetails);  

// subscribe
app.post('/subscribe', subscribeUser);

// REFERAL
app.get('/referral/:userId', referralController.getReferralCode);

// Subscription Status
app.get('/subscriptions/active/:userId', subscriptionStatusController.getActiveSubscriptions);
app.get('/profits/completed/:userId', subscriptionStatusController.getCompletedProfits);

// Transfer route
app.post('/transfer', updateUserBalances)

// User Data route
app.get('/user/:userId', getUserData); 
app.put('/user/update/:userId', upload.single('profilePicture'), updateUserData);

// TRANSFER COMMISION
app.post('/transfer-commissions', transferCommissions);
app.get('/get-commissions/:userId', getTotalCommissions);

// coinpayment make
app.post('/create-transaction', createTransaction);

// WITHDRAWAL
app.post('/withdrawal/:userId', processWithdrawal);


// deposit withdr records
app.get('/transactions/deposit/:userId', getDepositRecords);
app.get('/transactions/withdrawal/:userId', getWithdrawalRecords);

app.listen(2000, (e) => {
  if (e) console.log("ytyty", e);
  else console.log("server imkua started FRESh");
});
