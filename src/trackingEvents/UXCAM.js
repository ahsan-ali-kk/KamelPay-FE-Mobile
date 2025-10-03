import {getCardIsActivatedOrStatus} from "../uiComponents/creditCardUi/CreditCardUi";
import * as DeviceInfo from "react-native-device-info";
import {formatAmount} from "../utils/methods";
// import RNUxcam from 'react-native-ux-cam';
import moment from "moment";
import _ from "lodash";

// RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
// const configuration = {
//     userAppKey: 's5vuubqv9lj47zn',
//     enableAutomaticScreenNameTagging: false,
//     // enableAdvancedGestureRecognition?: boolean, // default is true
//     enableImprovedScreenCapture: true, // for improved screen capture on Android
//     // occlusions?: UXCamOcclusion[],
// }
// RNUxcam.startWithConfiguration(configuration);

const version = DeviceInfo.getVersion();

export const isBeneficiaryConstant = ['EXISTING', 'NEW', 'DIRECT'];
export const transactionStatus = ['EXISTING', 'NEW', 'DIRECT'];


export const taggingScreenName = (screenName) => {
    // if(screenName) {
        // RNUxcam.tagScreenName(screenName);
    // }
};

export const loginUser = (user) => {
    // if(user?.userId){
        // RNUxcam.setUserIdentity(user?.userId.toString());
    // }
};

export const logoutUser = () => {

};

export const singleCardStatus = (card) => {
    // RNUxcam.setUserProperty(card?.cardType, getCardIsActivatedOrStatus(card, true).id)
};

export const setUserDetails = (user) => {
    // if(user?.cards?.length){
    //     user?.cards.forEach(card => singleCardStatus(card))
    // }

    // if(user?.fullName){
        // RNUxcam.setUserProperty('Full Name', user?.fullName)
    // }

    // if(user?.phone){
        // RNUxcam.setUserProperty("Phone", user?.phone)
    // }

    // if(user?.gender){
        // RNUxcam.setUserProperty("Gender",user?.gender === 'F' ? "Female" : "Male")
    // }

    // if(user?.occupation){
        // RNUxcam.setUserProperty("Occupation", user?.occupation)
    // }

    // if(user?.employerName){
        // RNUxcam.setUserProperty("Employer Name", user?.employerName)
    // }

    // if(user?.passportNumber){
        // RNUxcam.setUserProperty("Passport Number", user?.passportNumber)
    // }

    // if(user?.companyId){
        // RNUxcam.setUserProperty("Company Id", user?.companyId)
    // }

    // if(user?.emirateID){
        // RNUxcam.setUserProperty("Emirate ID", user?.emirateID)
    // }

    // if(user?.status){
        // RNUxcam.setUserProperty("Status", user?.status)
    // }

    // if(user?.expiryDate){
        // RNUxcam.setUserProperty("Emirate ID Expiry", moment(user?.expiryDate).format('DD/MM/YYYY'));
    // }

    // if(user?.nationality){
        // RNUxcam.setUserProperty("Nationality", user?.nationality);
    // }

    // if(user?.dateOfBirth) {
        // RNUxcam.setUserProperty("Date Of Birth", moment(user?.dateOfBirth).format('DD/MM/YYYY'));
    // }

    // if(user?.isLightUser) {
        // RNUxcam.setUserProperty("Light User", user?.isLightUser);
    // }

    // if(user?.isPortalUser) {
        // RNUxcam.setUserProperty("Portal User", user?.isPortalUser?.status);
    // }

    // if(user?.isSuperStar) {
    //     RNUxcam.setUserProperty("Super Star User", user?.isSuperStar);
    // }
};

export const setNotificationToken = (id) => {
    // if(id) {
        // RNUxcam.setPushNotificationToken(id);
    // }
};

export const topUpEvent = (payload) => {
    // let data = {
    //     ...(payload?.status && {"Status": payload?.status}),
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
    //     ...(payload?.feeAndVat?.referenceNo && {referenceNo: payload?.feeAndVat?.referenceNo}),
    //     ...(payload?.feeAndVat?.vendor && {vendor: payload?.feeAndVat?.vendor}),
    //     ...(payload?.feeAndVat?.moduleType && {moduleType: payload?.feeAndVat?.moduleType}),
    //     isCreditPay: payload?.feeAndVat?.isCreditPay,
    //     // "Date And Time" : new Date().toISOString()
    //     "Date And Time" : moment().format('DD/MM/YYYY, h:mm:ss a')
    // };
    // RNUxcam.logEvent("Transactions", data);
};

export const payBillEvent = (payload) => {
    // let data = {
    //     ...(payload?.status && {"Status": payload?.status}),
    //     ...(payload?.transactionType && {"Type": payload?.transactionType}),
    //     ...(payload?.alias && {"Beneficiary Name": payload?.alias}),
    //     ...(payload?.biller?.BillerType && {"Biller Type": payload?.biller?.BillerType}),
    //     ...(payload?.biller?.BillerName && {"Biller Name": payload?.biller?.BillerName}),
    //     ...(payload?.card?.cardType && {"Card": payload?.card?.cardType}),
    //     ...(payload?.feeAndVat?.message && {"Message": payload?.feeAndVat?.message}),
    //     ...(payload?.feeAndVat?.amountInAED && {"Bill Amount": Number(payload?.feeAndVat?.amountInAED).toFixed(2)}),
    //     ...(payload?.feeAndVat?.totalFee && {"Fee": Number(payload?.feeAndVat?.totalFee)}),
    //     ...(payload?.feeAndVat?.totalVat && {"VAT": Number(payload?.feeAndVat?.totalVat)}),
    //     ...(payload?.feeAndVat?.mode && {[_.camelCase(payload?.feeAndVat?.mode)]: formatAmount(payload?.feeAndVat?.discountAmount)}),
    //     ...(payload?.feeAndVat?.mode && { 'Promo Mode': _.camelCase(payload?.feeAndVat?.mode)}),
    //     ...(payload?.feeAndVat?.promoDetails?.promo && {"Promo": payload?.feeAndVat?.promoDetails?.promo}),
    //     ...(payload?.feeAndVat?.totalAmount && {"Total Amount": Number(payload?.feeAndVat?.totalAmount)}),
    //     ...(payload?.currency && {"Currency": payload?.currency}),
    //     ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
    //     ...(payload?.feeAndVat?.referenceNo && {referenceNo: payload?.feeAndVat?.referenceNo}),
    //     ...(payload?.feeAndVat?.vendor && {vendor: payload?.feeAndVat?.vendor}),
    //     ...(payload?.feeAndVat?.moduleType && {moduleType: payload?.feeAndVat?.moduleType}),
    //     isCreditPay: payload?.feeAndVat?.isCreditPay,
    //     // "Date And Time" : new Date().toISOString(),
    //     "Date And Time" : moment().format('DD/MM/YYYY, h:mm:ss a')
    // };
    // if(payload?.inputs.length){
    //     let inputs;
    //     payload?.inputs?.forEach((input) => {
    //         if(input?.Name) {
    //             inputs = {
    //                 ...inputs,
    //                 [_.startCase(input?.Name)]: input?.value
    //             }
    //         }
    //     });
    //     data = {
    //         ...data,
    //         ...inputs
    //     }
    // }
    // console.log('data', data)
    // RNUxcam.logEvent("Transactions", data);
};

export const remittanceEvent = (payload) => {
    // console.log(payload);
    // let data = {
    //     ...(payload?.status && {"Status": payload?.status}),
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
    //     ...(payload?.feeAndVat?.mode && {[_.camelCase(payload?.feeAndVat?.mode)]: formatAmount(payload?.feeAndVat?.discountAmount)}),
    //     ...(payload?.feeAndVat?.mode && { 'Promo Mode': _.camelCase(payload?.feeAndVat?.mode)}),
    //     ...(payload?.feeAndVat?.promoDetails?.promo && {"Promo": payload?.feeAndVat?.promoDetails?.promo}),
    //     ...(payload?.feeAndVat?.totalAmount && {"Total Amount": Number(payload?.feeAndVat?.totalAmount)}),
    //     ...(payload?.feeAndVat?.countryFee && {"Country Fee": Number(payload?.feeAndVat?.countryFee)}),
    //     ...(payload?.feeAndVat?.tat && {"Turn Around Time": payload?.feeAndVat?.tat}),
    //     ...(payload?.feeAndVat?.payoutPartnerRef && {"Payout Partner Ref.": payload?.feeAndVat?.payoutPartnerRef}),
    //     ...(payload?.feeAndVat?.singleAmountUnit && {"Conversion Rate": Number(payload?.feeAndVat?.singleAmountUnit)}),
    //     ...(payload?.isBeneficiary && {"Beneficiary": payload?.isBeneficiary}),
    //     ...(payload?.country?.Currency && {"Currency": payload?.country?.Currency}),
    //     ...(payload?.feeAndVat?.referenceNo && {"ReferenceNo": payload?.feeAndVat?.referenceNo}),
    //     vendor: "HELLOPAISA",
    //     // "Date And Time" : new Date().toISOString(),
    //     "Date And Time" : moment().format('DD/MM/YYYY, h:mm:ss a')
    // };
    // RNUxcam.logEvent("Transactions", data);
};

export const addBeneficiaryEvent = (payload) => {
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
    // RNUxcam.logEvent("Beneficiaries", data);
};
