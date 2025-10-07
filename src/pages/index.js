import Welcome  from "./auth/welcome/Welcome";
import ELogin from './auth/pinLogin/PinLogin';
import Login from './auth/login/Login';
import CardConfirmation from './auth/signUp/cardConfirmation/CardConfirmation';
import UserCreation from './auth/signUp/userCreation/UserCreation';
import AuthOTP from './auth/authOTP/AuthOTP';
import ChangePhoneNumber from './auth/changePhoneNumber/ChangePhoneNumber';
import SignupFindUser from './auth/signUp/findUser';
import SignupKyc from './auth/signUp/kyc';
import SignupLiveness from './auth/signUp/liveness';
import SignupEnterPhone from './auth/signUp/enterPhone';
import SignupPasswordAndTermsAndCondition from './auth/signUp/passwordAndTermsAndCondition';

import ForgotPassword from './auth/forgotPassword/ForgotPassword';
import ForgotPasswordEmiratesId from './auth/forgotPassword/emiratesId/EmiratesId';
import OTP from './auth/forgotPassword/otp/Otp';
import NewPassword from './auth/forgotPassword/newPassword/NewPassword';

import Home from './home/Home';
import BiometricLoginMethod from '../containers/biometricLoginMethod/BiometricLoginMethod';
import PromotionForm from './home/promotions/PromotionForm';
import Populars from './home/populars/Populars';

import TransactionHistory from './transactionHistory/TransactionHistory';
import TransactionView from './transactionHistory/view/View';

import TopUp from './topUp/TopUp';
import TopUpHistory from './topUp/History';
import AddTopUp from './topUp/AddTopUp';
import TopUpBillers from './topUp/Billers';
import TopUpPay from './topUp/Pay';
import TopUpOverview from './topUp/Overview';

import BilRSTopUp from './bilRS/topUp/TopUp';
import BilRSTopUpHistory from './bilRS/topUp/History';
import BilRSAddTopUp from './bilRS/topUp/AddTopUp';
import BilRSTopUpBillers from './bilRS/topUp/Billers';
import BilRSTopUpPay from './bilRS/topUp/Pay';
import BilRSTopUpOverview from './bilRS/topUp/Overview';

import PayBill from './payBill/PayBill';
import PayBillHistory from './payBill/History';
import BillerTypes from './payBill/BillerTypes';
import Billers from './payBill/Billers';
import BillerSku from './payBill/BillerSku';
import BillerSkuIo from './payBill/BillerSkuIo';
import Pay from './payBill/Pay';
import PayBillOverview from './payBill/Overview';

import BilRSPayBill from './bilRS/payBill/PayBill';
import BilRSPayBillHistory from './bilRS/payBill/History';
import BilRSBillerTypes from './bilRS/payBill/BillerTypes';
import BilRSBillers from './bilRS/payBill/Billers';
import BilRSBillerSku from './bilRS/payBill/BillerSku';
import BilRSBillerSkuIo from './bilRS/payBill/BillerSkuIo';
import BilRSPay from './bilRS/payBill/Pay';
import BilRSPayBillOverview from './bilRS/payBill/Overview';

import Settings from './settings/Settings';
import Referral from './settings/referral/Referral';
import ReferralTransaction from './settings/referral/ReferralTransactions';
import PasswordsAndBiometrics from './settings/passwordsAndBiometrics/PasswordsAndBiometrics';
import ChangePassword from './settings/changePassword/ChangePassword';
import SetPin from './settings/setPin/SetPin';
import Profile from './settings/profile/Profile';
import PrivacyPolicy from './settings/privacyPolicy/PrivacyPolicy';
import AboutUs from './settings/aboutUs/AboutUs';
import TermsAndConditions from './settings/termsAndConditions/TermsAndConditions';
import Faqs from './settings/faqs/Faqs';
import ChangePhoneNumberRequest from './settings/changePhoneNumberRequest/ChangePhoneNumberRequest';
import ChangePhoneNumberRequestOverview from './settings/changePhoneNumberRequest/Overview';
import ChangePhoneNumberOTP from './settings/changePhoneNumberRequest/Otp';
import ScheduleOfCharges from './settings/scheduleOfCharges/ScheduleOfCharges';
import Notifications from './notifications/Notifications';
import NotificationsApproval from './notifications/Approval';

import CardManagement from './cardManagement/CardManagement';
// import CardSubscriptions from './cardManagement/subscriptions/Subscriptions';
import CardSubscriptions from './cardManagement/otherSubscriptions/OtherSubscriptions';
import CardSubscriptionsOverview from './cardManagement/subscriptions/Overview';
import ChangePin from './cardManagement/changePin/ChangePin';
import CardStatus from './cardManagement/cardStatus/CardStatus';
import ActivateCard from './cardManagement/activateCard/ActivateCard';
import AddCard from './cardManagement/addCard/AddCard';


import Remittance from './remittance/Remittance';
import RemittanceHistory from './remittance/history/History';
import HelloPaisaCountries from './remittance/countries/Countries';
import RemittanceType from './remittance/remittanceType/RemittanceType';
import HelloPaisaIFSCCodeBanks from './remittance/banks/ifscCode/IFSCCode';
import HelloPaisaIban from './remittance/banks/iban/Iban';
import HelloPaisaBanks from './remittance/banks/Banks';
import HelloPaisaBankBranches from './remittance/banks/branches/Branches';
import CurrencyExchange from './remittance/currencyExchange/CurrencyExchange';
import UserAdditionalInfo from './remittance/userAdditionalInfo/UserAdditionalInfo';
import RemittanceBeneficiaryDetails from './remittance/remittanceBeneficiaryDetails/RemittanceBeneficiaryDetails';
import RemittanceConfirmation from './remittance/remittanceConfirmation/RemittanceConfirmation';

import DtOneCards from './dtOne/Cards';
import DtOneHistory from './dtOne/History';
import DtOneOverview from './dtOne/Overview';

import Savings from './savings/Savings';
import SavingsFavourites from './savings/Favourites';
import SavingsCategories from './savings/Categories';
import SavingsSubCategories from './savings/SubCategories';
import SavingsVendors from './savings/Vendors';
import SavingsVendorDetails from './savings/VendorDetails';
import SavingsQrAndPin from './savings/QrAndPin';
import SavingsOverview from './savings/Overview';

import AdvanceSalary from './advanceSalary/AdvanceSalary';
import AdvanceSalaryHistory from './advanceSalary/History';
import AdvanceSalaryOtherInformation from './advanceSalary/request/otherInformation/OtherInformation.js';
import AdvanceSalaryRequestOverview from './advanceSalary/Overview';

import Lottery from './lottery/Lottery';
import LotteryDetail from './lottery/Detail';
import LotteryHistory from './lottery/History';
import LotteryOverview from './lottery/Overview';
import LotteryCheck from './lottery/Check';

import ATMLocator from './atmLocator/ATMLocator';

import Bnpl from './bnpl/Bnpl';
import BnplCategories from './bnpl/categories/Categories';
import BnplSubCategories from './bnpl/subCategories/SubCategories';
import BnplProducts from './bnpl/products/Products';
import BnplProductDetail from './bnpl/products/ProductDetail';
import BnplCart from './bnpl/cart/Cart';
import BnplCheckout from './bnpl/checkOut/CheckOut';
import BnplAddresses from './bnpl/addresses/Addresses';
import BnplAddAddress from './bnpl/addresses/add/Add';
import BnplHistory from './bnpl/history/History';
import BnplHistoryView from './bnpl/history/HistoryView';

import GlobalOtp from './otp/Otp';

import ScratchCards from './scratchCards/ScratchCards';
import ScratchCardDetail from './scratchCards/ScratchCardDetail';

import Points from './points/Points';

import PersonalLoan from './personalLoan/PersonalLoan';
import PersonalLoanAdditionalQuestion from './personalLoan/additionalQuestion/AdditionalQuestion';
import PersonalLoanRequestOverview from './personalLoan/Overview';
import PersonalLoanHistory from './personalLoan/History';
import PersonalLoanHistoryView from './personalLoan/history/View';

import KPWalletTransfer from './kpWalletTransfer';
import KPWalletTransferFind from './kpWalletTransfer/find';
import KPWalletTransferRate from './kpWalletTransfer/rate';
import KPWalletTransferConfirmation from './kpWalletTransfer/confirmation';
import KPWalletTransferHistory from './kpWalletTransfer/history';

export {
    Welcome,
    ELogin,
    Login,
    CardConfirmation,
    UserCreation,
    AuthOTP,
    ChangePhoneNumber,
    ForgotPassword,
    ForgotPasswordEmiratesId,
    OTP,
    NewPassword,
    SignupFindUser,
    SignupKyc,
    SignupLiveness,
    SignupEnterPhone,
    SignupPasswordAndTermsAndCondition,

    TransactionHistory,
    TransactionView,

    Home,
    BiometricLoginMethod,
    PromotionForm,
    Populars,

    Settings,
    Referral,
    ReferralTransaction,
    ChangePassword,
    SetPin,
    Profile,
    PasswordsAndBiometrics,
    AboutUs,
    TermsAndConditions,
    PrivacyPolicy,
    Faqs,
    ChangePhoneNumberRequest,
    ChangePhoneNumberRequestOverview,
    ChangePhoneNumberOTP,
    ScheduleOfCharges,
    Notifications,
    NotificationsApproval,

    TopUp,
    AddTopUp,
    TopUpBillers,
    TopUpPay,
    TopUpOverview,
    TopUpHistory,

    BilRSTopUp,
    BilRSAddTopUp,
    BilRSTopUpBillers,
    BilRSTopUpPay,
    BilRSTopUpOverview,
    BilRSTopUpHistory,

    PayBill,
    PayBillHistory,
    BillerTypes,
    Billers,
    BillerSku,
    BillerSkuIo,
    Pay,
    PayBillOverview,

    BilRSPayBill,
    BilRSPayBillHistory,
    BilRSBillerTypes,
    BilRSBillers,
    BilRSBillerSku,
    BilRSBillerSkuIo,
    BilRSPay,
    BilRSPayBillOverview,

    CardManagement,
    ChangePin,
    CardSubscriptions,
    CardSubscriptionsOverview,
    CardStatus,
    ActivateCard,
    AddCard,

    Remittance,
    HelloPaisaCountries,
    RemittanceType,
    HelloPaisaBanks,
    HelloPaisaIFSCCodeBanks,
    HelloPaisaIban,
    HelloPaisaBankBranches,
    CurrencyExchange,
    UserAdditionalInfo,
    RemittanceBeneficiaryDetails,
    RemittanceHistory,
    RemittanceConfirmation,

    DtOneCards,
    DtOneHistory,
    DtOneOverview,

    Savings,
    SavingsFavourites,
    SavingsCategories,
    SavingsSubCategories,
    SavingsVendors,
    SavingsVendorDetails,
    SavingsQrAndPin,
    SavingsOverview,

    GlobalOtp,


    AdvanceSalary,
    AdvanceSalaryHistory,
    AdvanceSalaryOtherInformation,
    AdvanceSalaryRequestOverview,

    Lottery,
    LotteryDetail,
    LotteryHistory,
    LotteryOverview,
    LotteryCheck,

    ATMLocator,

    Bnpl,
    BnplCategories,
    BnplSubCategories,
    BnplProducts,
    BnplProductDetail,
    BnplCart,
    BnplCheckout,
    BnplAddresses,
    BnplAddAddress,
    BnplHistory,
    BnplHistoryView,

    ScratchCards,
    ScratchCardDetail,

    Points,

    PersonalLoan,
    PersonalLoanAdditionalQuestion,
    PersonalLoanRequestOverview,
    PersonalLoanHistory,
    PersonalLoanHistoryView,

    KPWalletTransfer,
    KPWalletTransferFind,
    KPWalletTransferRate,
    KPWalletTransferConfirmation,
    KPWalletTransferHistory
}


