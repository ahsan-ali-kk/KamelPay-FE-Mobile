// import * as DeviceInfo from "react-native-device-info";
// import {formatAmount} from "../utils/methods";
// import {renderFlatOrPercentage} from "../pages/savings/Savings";
// import {getCardIsActivatedOrStatus} from "../uiComponents/creditCardUi/CreditCardUi";
// import Smartlook from 'smartlook-react-native-wrapper';
//
// const version = DeviceInfo.getVersion();
//
// export const isBeneficiaryConstant = ['EXISTING', 'NEW', 'DIRECT'];
//
//
// export const sl_taggingScreenName = (screenName) => {
//     if(screenName) {
//         Smartlook.trackNavigationEvent(screenName);
//     }
// };
// export const logout = () => {
//     // ReactMoE.logout();
// };
//
// export const sl_loginUser = (user) => {
//     if(user?.userId){
//         console.log('user?.userId.toString()', user?.userId.toString());
//         // ReactMoE.setAlias(user?.userId.toString());
//         // ReactMoE.setUserAttribute('App Version', version)
//     }
// };
//
// export const sl_logoutUser = () => {
//     // ReactMoE.logout();
// };
//
// export const sl_singleCardStatus = (card, user) => {
//     Smartlook.setUserIdentifier(
//         user?.userId.toString(),
//         { [card?.cardType] : getCardIsActivatedOrStatus(card, true).id}
//     );
// };
//
// export const sl_setUserDetails = (user) => {
//     // console.log('user', user);
//
//     let data = {
//         ...(user?.fullName && {"Full Name": user?.fullName}),
//         ...(user?.phone && {"Mobile Number": user?.phone}),
//         ...(user?.gender && {"Gender": user?.gender === 'F' ? "Female" : "Male"}),
//         ...(user?.emirateID && {"Emirate ID": user?.emirateID}),
//         ...(user?.status && {"Status": user?.status}),
//         ...(user?.expiryDate && {"Emirate ID Expiry": `${new Date(user?.expiryDate)?.toISOString()}`}),
//         ...(user?.nationality && {"Nationality": user?.nationality}),
//         ...(user?.dateOfBirth && {"Date Of Birth": `${new Date(user?.dateOfBirth).toISOString()}`}),
//     };
//
//     if(user?.cards?.length){
//         user?.cards.forEach(card => {
//             data = {
//                 ...data,
//                 [card?.cardType]: getCardIsActivatedOrStatus(card, true).id
//             }
//         })
//     }
//
//     if(user?.userId) {
//         Smartlook.setUserIdentifier(user?.userId?.toString(), data);
//     }
// };
//
// export const sl_manageSavingsSubscriptionStatusInUserProperties = (payload, user) => {
//     if(payload) {
//
//         let data = {
//             "Savings Subscription Status": payload?.status,
//             "Savings Subscription Remaining": `${payload?.isSubscriptionRemaining}`,
//         };
//
//         Smartlook.setUserIdentifier(user?.userId?.toString(), data);
//
//     }
// };
//
// export const sl_setNotificationToken = (id) => {
//     // if(id) {
//     //     RNUxcam.setPushNotificationToken(id);
//     // }
// };
//
//
// export const sl_topUpEvent = (payload) => {
//
//     let data = {
//         ...(payload?.transactionType && {"Type": payload?.transactionType}),
//         ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
//         ...(payload?.number && {"Mobile Number": payload?.number}),
//         ...(payload?.biller?.BillerType && {"Biller Type": payload?.biller?.BillerType}),
//         ...(payload?.biller?.BillerName && {"Biller Name": payload?.biller?.BillerName}),
//         ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
//         ...(payload?.feeAndVat?.message && {"Message": payload?.feeAndVat?.message}),
//         ...(payload?.feeAndVat?.amountInAED && {"Top-up Amount": payload?.feeAndVat?.amountInAED}),
//         ...(payload?.feeAndVat?.totalFee && {"Fee": payload?.feeAndVat?.totalFee}),
//         ...(payload?.feeAndVat?.totalVat && {"VAT": payload?.feeAndVat?.totalVat}),
//         ...(payload?.feeAndVat?.totalAmount && {"Total Amount": payload?.feeAndVat?.totalAmount}),
//         ...(payload?.currency && {"Currency": payload?.currency}),
//         ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
//         "Date And Time" : new Date().toISOString()
//     };
//
//     Smartlook.trackCustomEvent("Transactions", data);
// };
//
// export const sl_payBillEvent = (payload) => {
//
//     let data = {
//         ...(payload?.transactionType && {"Type": payload?.transactionType}),
//         ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
//         ...(payload?.biller?.BillerType && {"Biller Type": payload?.biller?.BillerType}),
//         ...(payload?.biller?.BillerName && {"Biller Name": payload?.biller?.BillerName}),
//         ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
//         ...(payload?.feeAndVat?.message && {"Message": payload?.feeAndVat?.message}),
//         ...(payload?.feeAndVat?.amountInAED && {"Bill Amount": Number(payload?.feeAndVat?.amountInAED).toFixed(2)}),
//         ...(payload?.feeAndVat?.totalFee && {"Fee": Number(payload?.feeAndVat?.totalFee)}),
//         ...(payload?.feeAndVat?.totalVat && {"VAT": Number(payload?.feeAndVat?.totalVat)}),
//         ...(payload?.feeAndVat?.mode && {[_.camelCase(payload?.feeAndVat?.mode)]: formatAmount(payload?.feeAndVat?.discountAmount)}),
//         ...(payload?.feeAndVat?.mode && { 'Promo Mode': _.camelCase(payload?.feeAndVat?.mode)}),
//         ...(payload?.feeAndVat?.promoDetails?.promo && {"Promo": payload?.feeAndVat?.promoDetails?.promo}),
//         ...(payload?.feeAndVat?.totalAmount && {"Total Amount": Number(payload?.feeAndVat?.totalAmount)}),
//         ...(payload?.currency && {"Currency": payload?.currency}),
//         ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
//         "Date And Time" : new Date().toISOString()
//     };
//     if(payload?.inputs.length){
//         let inputs;
//         payload?.inputs?.forEach((input) => {
//             if(input?.Name) {
//                 inputs = {
//                     ...inputs,
//                     [_.startCase(input?.Name)]: input?.value
//                 }
//             }
//         });
//         data = {
//             ...data,
//             ...inputs
//         }
//     }
//
//     Smartlook.trackCustomEvent("Transactions", data);
//
// };
//
// export const sl_remittanceEvent = (payload) => {
//
//     let data = {
//         ...(payload?.transactionType && {"Type": payload?.transactionType}),
//         ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
//         ...(payload?.bank?.BankName && {"Bank Name": payload?.bank?.BankName}),
//         ...(payload?.bank?.BankTypeName && {"Bank Type": payload?.bank?.BankTypeName}),
//         ...(payload?.bank?.BranchName && {"Branch Name": payload?.bank?.BranchName}),
//         ...(payload?.bank?.Country && {"Country": payload?.bank?.Country}),
//         ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
//         ...(payload?.otherDetails?.AccountTitle && {"Account Title": payload?.otherDetails?.AccountTitle}),
//         ...(payload?.otherDetails?.BeneficiaryAccountNo && {"Account No.": payload?.otherDetails?.BeneficiaryAccountNo}),
//         ...(payload?.otherDetails?.BeneficiaryFirstName && {"First Name": payload?.otherDetails?.BeneficiaryFirstName}),
//         ...(payload?.otherDetails?.BeneficiaryLastName && {"Last Name": payload?.otherDetails?.BeneficiaryLastName}),
//         ...(payload?.otherDetails?.BeneficiaryMSISDN && {"Mobile Number": payload?.otherDetails?.BeneficiaryMSISDN}),
//         ...(payload?.otherDetails?.BeneficiaryNationalityCountryISOCode && {"Nationality Country": payload?.otherDetails?.BeneficiaryNationalityCountryISOCode}),
//         ...(payload?.otherDetails?.RemitPurpose && {"Remit Purpose": payload?.otherDetails?.RemitPurpose}),
//         ...(payload?.feeAndVat?.message && {"Message": payload?.feeAndVat?.message}),
//         ...(payload?.feeAndVat?.amountInAED && {"Transfer Amount": Number(payload?.feeAndVat?.amountInAED)}),
//         ...(payload?.feeAndVat?.totalFee && {"FEE": Number(payload?.feeAndVat?.totalFee)}),
//         ...(payload?.feeAndVat?.totalVat && {"VAT": Number(payload?.feeAndVat?.totalVat)}),
//         ...(payload?.feeAndVat?.mode && {[_.camelCase(payload?.feeAndVat?.mode)]: formatAmount(payload?.feeAndVat?.discountAmount)}),
//         ...(payload?.feeAndVat?.mode && { 'Promo Mode': _.camelCase(payload?.feeAndVat?.mode)}),
//         ...(payload?.feeAndVat?.promoDetails?.promo && {"Promo": payload?.feeAndVat?.promoDetails?.promo}),
//         ...(payload?.feeAndVat?.totalAmount && {"Total Amount": Number(payload?.feeAndVat?.totalAmount)}),
//         ...(payload?.feeAndVat?.countryFee && {"Country Fee": Number(payload?.feeAndVat?.countryFee)}),
//         ...(payload?.feeAndVat?.tat && {"Turn Around Time": payload?.feeAndVat?.tat}),
//         ...(payload?.feeAndVat?.payoutPartnerRef && {"Payout Partner Ref.": payload?.feeAndVat?.payoutPartnerRef}),
//         ...(payload?.feeAndVat?.singleAmountUnit && {"Conversion Rate": Number(payload?.feeAndVat?.singleAmountUnit)}),
//         ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
//         ...(payload?.country?.Currency && {"Currency": payload?.country?.Currency}),
//         "Date And Time" : new Date().toISOString()
//     };
//
//     Smartlook.trackCustomEvent("Transactions", data);
//
// };
//
// export const sl_addBeneficiaryEvent = (payload) => {
//
//     let data = {
//         "Type": "REMITTANCE",
//         ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
//         ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
//         ...(payload?.bank?.BankName && {"Bank Name": payload?.bank?.BankName}),
//         ...(payload?.bank?.BankTypeName && {"Bank Type": payload?.bank?.BankTypeName}),
//         ...(payload?.bank?.BranchName && {"Branch Name": payload?.bank?.BranchName}),
//         ...(payload?.bank?.Country && {"Country": payload?.bank?.Country}),
//         ...(payload?.otherDetails?.AccountTitle && {"Account Title": payload?.otherDetails?.AccountTitle}),
//         ...(payload?.otherDetails?.BeneficiaryAccountNo && {"Account No.": payload?.otherDetails?.BeneficiaryAccountNo}),
//         ...(payload?.otherDetails?.BeneficiaryFirstName && {"First Name": payload?.otherDetails?.BeneficiaryFirstName}),
//         ...(payload?.otherDetails?.BeneficiaryLastName && {"Last Name": payload?.otherDetails?.BeneficiaryLastName}),
//         ...(payload?.otherDetails?.BeneficiaryMSISDN && {"Mobile Number": payload?.otherDetails?.BeneficiaryMSISDN}),
//         ...(payload?.otherDetails?.BeneficiaryNationalityCountryISOCode && {"Nationality Country": payload?.otherDetails?.BeneficiaryNationalityCountryISOCode}),
//         ...(payload?.otherDetails?.RemitPurpose && {"Remit Purpose": payload?.otherDetails?.RemitPurpose}),
//         "Date And Time" : new Date().toISOString()
//     };
//
//     Smartlook.trackCustomEvent("Beneficiaries", data);
//
// };
//
// export const sl_useSubscriptions = (payload) => {
//
//     let data = {
//         "Subscription": "SAVINGS",
//         "Redemption Type": "MERCHANT",
//         ...(payload?.data?.outletName && {"Vendor": payload?.data?.outletName}),
//         ...(payload?.data?.details && {"Offer": payload?.data?.details}),
//         ...(payload?.data?.billAmount && {"Amount": Number(payload?.data?.billAmount)}),
//         ...(payload?.data?.discountType && {"Discount": renderFlatOrPercentage(payload?.data)}),
//         ...(payload?.data?.discountAmount && {"Total Amount": Number(payload?.data?.discountAmount)}),
//         ...(payload?.data?.status && {"Status": payload?.data?.status}),
//         ...(payload?.message && {"Message": payload?.message}),
//         ...(payload?.data?.tranDate && {"Date And Time": new Date(payload?.data?.tranDate).toISOString()}),
//     };
//
//     Smartlook.trackCustomEvent("Beneficiaries", data);
// };
//
// export const sl_subscribeSubscriptions = (payload) => {
//     // let properties = new MoEProperties();
//
//     // let data = {
//     //     "Subscription": "SAVINGS",
//     //     "Date And Time" : new Date().toISOString()
//     // };
//     // properties.addAttribute('')
//     // ReactMoE.trackEvent("Subscriptions", properties);
// };
