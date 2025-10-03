// import ReactMoE, { MoEAppStatus,  MoEGeoLocation, MoEProperties } from "react-native-moengage";
import * as DeviceInfo from "react-native-device-info";
// import {formatAmount} from "../utils/methods";
// import {renderFlatOrPercentage} from "../pages/savings/Savings";
// import {getCardIsActivatedOrStatus} from "../uiComponents/creditCardUi/CreditCardUi";
// import {_setDataToAsyncStorage, getValueIntoAsyncStorage} from "../utils/asyncStorage/Functions";
// import {IS_REGISTER_USER_IN_MOENGAGE} from "../utils/asyncStorage/Constants";
// import _ from 'lodash';

const version = DeviceInfo.getVersion();

export const isBeneficiaryConstant = ['EXISTING', 'NEW', 'DIRECT'];


export const taggingScreenName = (screenName) => {
    if(screenName) {
    }
};
export const logout = () => {
    // ReactMoE.logout();
};

export const registerUser = async (user) => {
    // let isRegister = await getValueIntoAsyncStorage(IS_REGISTER_USER_IN_MOENGAGE);
    // if(!isRegister){
    //     let id = await DeviceInfo.getUniqueId();
    //     let userId = `GUEST_${id}`;
    //     ReactMoE.setUserUniqueID(userId);
    // }
};

export const loginUser = async (user) => {
    // if(user?.userId){
    //     ReactMoE.setAlias(user?.userId.toString());
    //     await _setDataToAsyncStorage(IS_REGISTER_USER_IN_MOENGAGE, 'true');
    // }
};

export const logoutUser = () => {
    // ReactMoE.logout();
};

export const singleCardStatus = (card, user) => {
    // ReactMoE.setUserAttribute(card?.cardType, getCardIsActivatedOrStatus(card, true).id);
};

export const setUserDetails = (user) => {
    // console.log('user', user);

    // if(user?.userId){
    //     ReactMoE.setAlias(user?.userId.toString());
    //     _setDataToAsyncStorage(IS_REGISTER_USER_IN_MOENGAGE, 'true');
    // }
    //
    // if(user?.cards?.length){
    //     user?.cards.forEach(card => singleCardStatus(card))
    // }
    // if(user?.fullName){
    //     ReactMoE.setUserAttribute("USER_ATTRIBUTE_USER_NAME", user?.fullName);
    // }
    // if(user?.phone){
    //     ReactMoE.setUserContactNumber(user?.phone);
    // }
    // if(user?.gender){
    //     ReactMoE.setUserGender(user?.gender === 'F' ? "Female" : "Male");
    // }
    //
    // if(user?.emirateID){
    //     ReactMoE.setUserAttribute("Emirate ID", user?.emirateID);
    // }
    //
    // if(user?.status){
    //     ReactMoE.setUserAttribute("Status", user?.status);
    // }
    // if(user?.expiryDate){
    //     let modify = new Date(user?.expiryDate);
    //     modify.setHours(0, 0, 0, 0);
    //     ReactMoE.setUserAttributeISODateString("Emirate ID Expiry", modify.toISOString());
    // }
    // if(user?.nationality){
    //     ReactMoE.setUserAttribute("Nationality", user?.nationality);
    // }
    // if(user?.dateOfBirth) {
    //     let modify = new Date(user?.dateOfBirth);
    //     modify.setHours(0, 0, 0, 0);
    //     ReactMoE.setUserBirthday(modify.toISOString());
    // }
    //
    // ReactMoE.setUserAttribute('App Version', version)

};

export const manageSavingsSubscriptionStatusInUserProperties = (payload, user) => {
    // if(user) {
    //     if(payload) {
    //         ReactMoE.setUserAttribute("Savings Subscription Status", payload?.status);
    //         ReactMoE.setUserAttribute("Savings Subscription Remaining", `${payload?.isSubscriptionRemaining}`)
    //     }
    // }
};

export const setNotificationToken = (id) => {

};


export const topUpEvent = (payload) => {
    // let properties = new MoEProperties();
    //
    // let data = {
    //     ...(payload?.transactionType && {"Type": payload?.transactionType}),
    //     ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
    //     ...(payload?.number && {"Mobile Number": payload?.number}),
    //     ...(payload?.biller?.BillerType && {"Biller Type": payload?.biller?.BillerType}),
    //     ...(payload?.biller?.BillerName && {"Biller Name": payload?.biller?.BillerName}),
    //     ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
    //     ...(payload?.feeAndVat?.message && {"Message": payload?.feeAndVat?.message}),
    //     ...(payload?.feeAndVat?.amountInAED && {"Top-up Amount": payload?.feeAndVat?.amountInAED}),
    //     ...(payload?.feeAndVat?.totalFee && {"Fee": payload?.feeAndVat?.totalFee}),
    //     ...(payload?.feeAndVat?.totalVat && {"VAT": payload?.feeAndVat?.totalVat}),
    //     ...(payload?.feeAndVat?.totalAmount && {"Total Amount": payload?.feeAndVat?.totalAmount}),
    //     ...(payload?.currency && {"Currency": payload?.currency}),
    //     ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
    //     "Date And Time" : new Date().toISOString()
    // };
    // for (const [key, value] of Object.entries(data)) {
    //     if(key === 'Date And Time') {
    //         properties.addDateAttribute(key, value)
    //     } else {
    //         properties.addAttribute(key, value)
    //     }
    // }
    // ReactMoE.trackEvent("Transactions", properties);
};

export const payBillEvent = (payload) => {
//     let properties = new MoEProperties();
// console.log('payload', payload)
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
//         ...(payload?.feeAndVat?.mode && {[_.capitalize(payload?.feeAndVat?.mode)]: formatAmount(payload?.feeAndVat?.discountAmount)}),
//         ...(payload?.feeAndVat?.mode && { 'Promo Mode': _.capitalize(payload?.feeAndVat?.mode)}),
//         ...(payload?.feeAndVat?.promoDetails?.promo && {"Promo": payload?.feeAndVat?.promoDetails?.promo}),
//         ...(payload?.feeAndVat?.totalAmount && {"Total Amount": Number(payload?.feeAndVat?.totalAmount)}),
//         ...(payload?.currency && {"Currency": payload?.currency}),
//         ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
//         "Date And Time" : new Date().toISOString()
//     };
//     if(payload?.inputs.length){
//         console.log('payload?.inputs', payload?.inputs)
//         let inputs;
//         payload?.inputs?.forEach((input) => {
//             if(input?.Name) {
//                 // let objKey = _.startCase(`${input?.Name}`);
//                 let objKey = input?.Name;
//                 inputs = {
//                     ...inputs,
//                     [objKey]: input?.value
//                 }
//             }
//         });
//         data = {
//             ...data,
//             ...inputs
//         }
//     }
//
//     for (const [key, value] of Object.entries(data)) {
//         if(key === 'Date And Time') {
//             properties.addDateAttribute(key, value)
//         } else {
//             properties.addAttribute(key, value)
//         }
//     }
//
//     ReactMoE.trackEvent("Transactions", properties);
};

export const remittanceEvent = (payload) => {
    // let properties = new MoEProperties();
    //
    // let data = {
    //     ...(payload?.transactionType && {"Type": payload?.transactionType}),
    //     ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
    //     ...(payload?.bank?.BankName && {"Bank Name": payload?.bank?.BankName}),
    //     ...(payload?.bank?.BankTypeName && {"Bank Type": payload?.bank?.BankTypeName}),
    //     ...(payload?.bank?.BranchName && {"Branch Name": payload?.bank?.BranchName}),
    //     ...(payload?.bank?.Country && {"Country": payload?.bank?.Country}),
    //     ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
    //     ...(payload?.otherDetails?.AccountTitle && {"Account Title": payload?.otherDetails?.AccountTitle}),
    //     ...(payload?.otherDetails?.BeneficiaryAccountNo && {"Account No.": payload?.otherDetails?.BeneficiaryAccountNo}),
    //     ...(payload?.otherDetails?.BeneficiaryFirstName && {"First Name": payload?.otherDetails?.BeneficiaryFirstName}),
    //     ...(payload?.otherDetails?.BeneficiaryLastName && {"Last Name": payload?.otherDetails?.BeneficiaryLastName}),
    //     ...(payload?.otherDetails?.BeneficiaryMSISDN && {"Mobile Number": payload?.otherDetails?.BeneficiaryMSISDN}),
    //     ...(payload?.otherDetails?.BeneficiaryNationalityCountryISOCode && {"Nationality Country": payload?.otherDetails?.BeneficiaryNationalityCountryISOCode}),
    //     ...(payload?.otherDetails?.RemitPurpose && {"Remit Purpose": payload?.otherDetails?.RemitPurpose}),
    //     ...(payload?.feeAndVat?.message && {"Message": payload?.feeAndVat?.message}),
    //     ...(payload?.feeAndVat?.amountInAED && {"Transfer Amount": Number(payload?.feeAndVat?.amountInAED)}),
    //     ...(payload?.feeAndVat?.totalFee && {"FEE": Number(payload?.feeAndVat?.totalFee)}),
    //     ...(payload?.feeAndVat?.totalVat && {"VAT": Number(payload?.feeAndVat?.totalVat)}),
    //     ...(payload?.feeAndVat?.mode && {[_.capitalize(payload?.feeAndVat?.mode)]: formatAmount(payload?.feeAndVat?.discountAmount)}),
    //     ...(payload?.feeAndVat?.mode && { 'Promo Mode': _.capitalize(payload?.feeAndVat?.mode)}),
    //     ...(payload?.feeAndVat?.promoDetails?.promo && {"Promo": payload?.feeAndVat?.promoDetails?.promo}),
    //     ...(payload?.feeAndVat?.totalAmount && {"Total Amount": Number(payload?.feeAndVat?.totalAmount)}),
    //     ...(payload?.feeAndVat?.countryFee && {"Country Fee": Number(payload?.feeAndVat?.countryFee)}),
    //     ...(payload?.feeAndVat?.tat && {"Turn Around Time": payload?.feeAndVat?.tat}),
    //     ...(payload?.feeAndVat?.payoutPartnerRef && {"Payout Partner Ref.": payload?.feeAndVat?.payoutPartnerRef}),
    //     ...(payload?.feeAndVat?.singleAmountUnit && {"Conversion Rate": Number(payload?.feeAndVat?.singleAmountUnit)}),
    //     ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
    //     ...(payload?.country?.Currency && {"Currency": payload?.country?.Currency}),
    //     "Date And Time" : new Date().toISOString()
    // };
    //
    // for (const [key, value] of Object.entries(data)) {
    //     if(key === 'Date And Time') {
    //         properties.addDateAttribute(key, value)
    //     } else {
    //         properties.addAttribute(key, value)
    //     }
    // }
    //
    // ReactMoE.trackEvent("Transactions", properties);
};

export const addBeneficiaryEvent = (payload) => {
    // let properties = new MoEProperties();
    //
    // let data = {
    //     "Type": "REMITTANCE",
    //     ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
    //     ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
    //     ...(payload?.bank?.BankName && {"Bank Name": payload?.bank?.BankName}),
    //     ...(payload?.bank?.BankTypeName && {"Bank Type": payload?.bank?.BankTypeName}),
    //     ...(payload?.bank?.BranchName && {"Branch Name": payload?.bank?.BranchName}),
    //     ...(payload?.bank?.Country && {"Country": payload?.bank?.Country}),
    //     ...(payload?.otherDetails?.AccountTitle && {"Account Title": payload?.otherDetails?.AccountTitle}),
    //     ...(payload?.otherDetails?.BeneficiaryAccountNo && {"Account No.": payload?.otherDetails?.BeneficiaryAccountNo}),
    //     ...(payload?.otherDetails?.BeneficiaryFirstName && {"First Name": payload?.otherDetails?.BeneficiaryFirstName}),
    //     ...(payload?.otherDetails?.BeneficiaryLastName && {"Last Name": payload?.otherDetails?.BeneficiaryLastName}),
    //     ...(payload?.otherDetails?.BeneficiaryMSISDN && {"Mobile Number": payload?.otherDetails?.BeneficiaryMSISDN}),
    //     ...(payload?.otherDetails?.BeneficiaryNationalityCountryISOCode && {"Nationality Country": payload?.otherDetails?.BeneficiaryNationalityCountryISOCode}),
    //     ...(payload?.otherDetails?.RemitPurpose && {"Remit Purpose": payload?.otherDetails?.RemitPurpose}),
    //     "Date And Time" : new Date().toISOString()
    // };
    //
    // for (const [key, value] of Object.entries(data)) {
    //     if(key === 'Date And Time') {
    //         properties.addDateAttribute(key, value)
    //     } else {
    //         properties.addAttribute(key, value)
    //     }
    // }
    //
    // ReactMoE.trackEvent("Beneficiaries", properties);
};

export const useSubscriptions = (payload) => {
    // let properties = new MoEProperties();
    //
    // let data = {
    //     "Subscription": "SAVINGS",
    //     "Redemption Type": "MERCHANT",
    //     ...(payload?.data?.outletName && {"Vendor": payload?.data?.outletName}),
    //     ...(payload?.data?.details && {"Offer": payload?.data?.details}),
    //     ...(payload?.data?.billAmount && {"Amount": Number(payload?.data?.billAmount)}),
    //     ...(payload?.data?.discountType && {"Discount": renderFlatOrPercentage(payload?.data)}),
    //     ...(payload?.data?.discountAmount && {"Total Amount": Number(payload?.data?.discountAmount)}),
    //     ...(payload?.data?.status && {"Status": payload?.data?.status}),
    //     ...(payload?.message && {"Message": payload?.message}),
    //     ...(payload?.data?.tranDate && {"Date And Time": new Date(payload?.data?.tranDate).toISOString()}),
    // };
    //
    // for (const [key, value] of Object.entries(data)) {
    //     if(key === 'Date And Time') {
    //         properties.addDateAttribute(key, value)
    //     } else {
    //         properties.addAttribute(key, value)
    //     }
    // }
    //
    // ReactMoE.trackEvent("Subscriptions", properties);
};

export const subscribeSubscriptions = (payload) => {
    // let properties = new MoEProperties();

    // let data = {
    //     "Subscription": "SAVINGS",
    //     "Date And Time" : new Date().toISOString()
    // };
    // properties.addAttribute('')
    // ReactMoE.trackEvent("Subscriptions", properties);
};
