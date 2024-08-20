import MarketPage from '../pages/marketPage.vue'
import DashBoard from '../pages/dashboardPage.vue'
import TradePage from '../pages/tradePage.vue'
import NewsPage from '../pages/newsPage.vue'
import newsdetail from '../pages/newsViewPage.vue'
import ProfilePage from '../pages/profilePage.vue'
import withdraw from '../pages/WithdrawalfORM.vue'
import withdrawAddress from '../pages/withdrawDetails.vue'
import balancetransfer from '../pages/transferFund.vue'
import traderecords from '../pages/tradeRecords.vue'
import currentPosition from '../pages/currentPositions.vue'
import refferal from '../pages/refferalPage.vue'
import quantify from '../pages/quantifyPage.vue'
import contract from '../pages/contractPage.vue'
import rebate from '../pages/rebatePage.vue'
import deposit from '../pages/depositPage.vue'
import loginPage from '../pages/loginPage.vue'
import recordMiamala from '../pages/fundRecords.vue'
import Countries from '../pages/selectCountry.vue'
import registerPage from '../pages/registerPage.vue'
import resetpassword from '../pages/resetPassword.vue'
import wallet from '../pages/walletPage.vue'
import onareferal from '../pages/onaReferal.vue'
import edituser from '../pages/editUser.vue'
import transferCommissions from '../pages/transferCommissions.vue'
import depositform from '../pages/depositForm.vue'

const routes = [{
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: loginPage, name: 'login'},
      { path: 'dashboard', component: DashBoard, name: 'dashboard', meta: { requiresAuth: true } },
      { path: 'market', component: MarketPage, name:'market', meta: { requiresAuth: true } },
      { path: 'register', component: registerPage, name: 'register' },
      { path: 'resetpassword', component: resetpassword,  name: 'resetpassword' },
      { path: 'Countries', component: Countries, name: 'country' },
      { path: 'trade', component: TradePage, name:'trade', meta: { requiresAuth: true } },
      { path: 'news', component: NewsPage, name:'news', meta: { requiresAuth: true } },
      { path: 'newsdetail/:id', component: newsdetail, name:'newsdetail', meta: { requiresAuth: true } },
      { path: 'profile', component: ProfilePage, name:'profile', meta: { requiresAuth: true } },
      { path: 'profile/withdraw', component: withdraw, name: 'withdraw', meta: { requiresAuth: true } },
      { path: 'profile/withdraw-address', component: withdrawAddress, name: 'withdraw-address', meta: { requiresAuth: true } },
      { path: 'profile/balancetransfer',  component: balancetransfer, name: 'balancetransfer', meta: { requiresAuth: true } },
      { path: 'profile/records',  component: recordMiamala, name: 'records', meta: { requiresAuth: true } },
      { path: 'traderecords', component: traderecords, name:'', meta: { requiresAuth: true } },
      { path: 'currentPosition', component: currentPosition, name:'currentPosition', meta: { requiresAuth: true } },
      { path: 'quantify', component: quantify, name:'', meta: { requiresAuth: true } },
      { path: 'contract', component: contract, name: 'contract', meta: { requiresAuth: true } },
      { path: 'refferal', component: refferal, name:'refferal', meta: { requiresAuth: true } },
      { path: 'rebate', component: rebate, name:'rebate', meta: { requiresAuth: true } },
      { path: 'deposit1', component: deposit, name:'deposit', meta: { requiresAuth: true } },
      { path: 'deposit', component: depositform, name:'deposit', meta: { requiresAuth: true } },
      { path: 'wallet', component: wallet, name:'wallet', meta: { requiresAuth: true } },
      { path: 'onareferal', component: onareferal, name:'onareferal', meta: { requiresAuth: true } },
      { path: 'account', component: edituser, name:'edituser', meta: { requiresAuth: true } },
      { path: 'trcommissions', component: transferCommissions, name:'trcommissions', meta: { requiresAuth: true } },
    ]
  },



  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]


export default routes
