import auth from './Auth.reducer';
import global from './Global.reducer';
import transactionHistory from './TransactionHistory.reducer';
import topUp from './TopUp.reducer';
import payBill from './PayBill.reducer';
import cardManagement from './CardManagement.reducer';
import remittance from './Remittance.reducer';
import dtOne from './DtOne.reducer';
import savings from './Savings.reducer';
import advanceSalary from './AdvanceSalary.reducer';
import lottery from './Lottery.reducer';
import userSubscriptions from './UserSubscriptions.reducer';
import referral from './Referral.reducer';
import bnpl from './Bnpl.reducer';
import scratchCards from './ScratchCards.reducer';
import points from './Points.reducer';
import personalLoan from './PersonalLoan.reducer';
import creditPay from './CreditPay.reducer';
import kpWalletTransfer from './KPWalletTransfer.reducer';

export default {
    auth,
    global,
    transactionHistory,
    topUp,
    cardManagement,
    payBill,
    remittance,
    savings,
    advanceSalary,
    lottery,
    dtOne,
    userSubscriptions,
    referral,
    bnpl,
    scratchCards,
    points,
    personalLoan,
    creditPay,
    kpWalletTransfer
}
