// import ReactMoE, { MoEAppStatus,  MoEGeoLocation, MoEProperties } from "react-native-moengage";
// import {getCardIsActivatedOrStatus} from "../uiComponents/creditCardUi/CreditCardUi";
import * as DeviceInfo from "react-native-device-info";
import {formatAmount} from "../utils/methods";
// import RNUxcam from 'react-native-ux-cam';
// import moment from 'moment';
// import {renderFlatOrPercentage} from "../pages/savings/Savings";

const version = DeviceInfo.getVersion();

export const isBeneficiaryConstant = ['EXISTING', 'NEW', 'DIRECT'];

export const loginUser = (user) => {
    // if(user?.userId){
    //     // RNUxcam.setUserIdentity(user?.userId.toString());
    //     // console.log('user?.userId', user?.userId?.toString())
    //     // ReactMoE.setUserIdentity(user?.userId?.toString());
    //     // ReactMoE.setUserAttribute('App Version', version)
    // }
};

export const logoutUser = () => {
    // ReactMoE.logout();
};

export const singleCardStatus = (card) => {
    // RNUxcam.setUserProperty(card?.cardType, getCardIsActivatedOrStatus(card, true).id)
    // ReactMoE.setUserAttribute(card?.cardType, getCardIsActivatedOrStatus(card, true).id)
};

export const setUserDetails = (user) => {
    // console.log('user', user);
    //
    // if(user?.cards?.length){
    //     user?.cards.forEach(card => singleCardStatus(card))
    // }

    // if(user?.fullName){
    //     // RNUxcam.setUserProperty('Full Name', user?.fullName)
    //     ReactMoE.setUserAttribute("USER_ATTRIBUTE_USER_NAME", user?.fullName);
    // }
    //
    // if(user?.phone){
    //     // RNUxcam.setUserProperty("Phone", user?.phone)
    //     ReactMoE.setUserContactNumber(user?.phone);
    // }
    //
    // if(user?.gender){
    //     // RNUxcam.setUserProperty("Gender",user?.gender === 'F' ? "Female" : "Male")
    //     ReactMoE.setUserGender(user?.gender === 'F' ? "Female" : "Male");
    // }
    //
    // if(user?.emirateID){
    //     // RNUxcam.setUserProperty("Emirate ID", user?.emirateID)
    //     ReactMoE.setUserAttribute("Emirate ID", user?.emirateID);
    // }
    //
    // if(user?.status){
    //     // RNUxcam.setUserProperty("Status", user?.status)
    //     ReactMoE.setUserAttribute("Status", user?.status);
    // }
    //
    // if(user?.expiryDate){
    //     let modify = new Date(user?.expiryDate);
    //     modify.setHours(0, 0, 0, 0);
    //     // RNUxcam.setUserProperty("Emirate ID Expiry", moment(user?.expiryDate).format('DD/MM/YYYY'));
    //     ReactMoE.setUserAttributeISODateString("Emirate ID Expiry", modify.toISOString());
    // }
    //
    // if(user?.nationality){
    //     // RNUxcam.setUserProperty("Nationality", user?.nationality);
    //     ReactMoE.setUserAttribute("Nationality", user?.nationality);
    // }
    //
    // if(user?.dateOfBirth) {
    //     let modify = new Date(user?.dateOfBirth);
    //     modify.setHours(0, 0, 0, 0);
    //     // RNUxcam.setUserProperty("Date Of Birth", moment(user?.dateOfBirth).format('DD/MM/YYYY'));
    //     ReactMoE.setUserBirthday(modify.toISOString());
    // }

};

export const topUpEvent = (payload) => {

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
    // console.log('Transactions data', data)
    // RNUxcam.logEvent("Transactions", data);


    // let properties = new MoEProperties();
    // payload?.transactionType && properties.addAttribute("Type", payload?.transactionType);
    // payload?.alias && properties.addAttribute("Beneficiary Name", payload?.alias);
    // payload?.number && properties.addAttribute("Mobile Number", payload?.number);
    // payload?.biller?.BillerType && properties.addAttribute("Biller Type", payload?.biller?.BillerType);
    // payload?.biller?.BillerName && properties.addAttribute("Biller Name", payload?.biller?.BillerName);
    // payload?.card?.cardType && properties.addAttribute("Card", payload?.card?.cardType);
    // payload?.feeAndVat?.message && properties.addAttribute("Message", payload?.feeAndVat?.message);
    // payload?.feeAndVat?.amountInAED && properties.addAttribute("Top-up Amount", Number(payload?.feeAndVat?.amountInAED));
    // payload?.feeAndVat?.totalFee && properties.addAttribute("Fee", Number(payload?.feeAndVat?.totalFee));
    // payload?.feeAndVat?.totalVat && properties.addAttribute("VAT", Number(payload?.feeAndVat?.totalVat));
    // payload?.feeAndVat?.totalAmount && properties.addAttribute("Total Amount", Number(payload?.feeAndVat?.totalAmount));
    // payload?.currency && properties.addAttribute("Currency", payload?.currency);
    // payload?.isBeneficiary && properties.addAttribute("Beneficiary", payload?.isBeneficiary);
    // properties.addDateAttribute("Date And Time",  new Date().toISOString());
    // ReactMoE.trackEvent("Transactions", properties);
};

export const payBillEvent = (payload) => {
    // let properties = new MoEProperties();
    // payload?.transactionType && properties.addAttribute("Type", payload?.transactionType);
    // payload?.alias && properties.addAttribute("Beneficiary Name", payload?.alias);
    // payload?.biller?.BillerType && properties.addAttribute("Biller Type", payload?.biller?.BillerType);
    // if(payload?.inputs.length){
    //     payload?.inputs?.forEach((input) => input?.Name && properties.addAttribute(input?.Name, input?.value))
    // }
    // payload?.biller?.BillerName && properties.addAttribute("Biller Name", payload?.biller?.BillerName);
    // payload?.card?.cardType && properties.addAttribute("Card", payload?.card?.cardType);
    // payload?.feeAndVat?.message && properties.addAttribute("Message", payload?.feeAndVat?.message);
    // payload?.feeAndVat?.totalAmount && properties.addAttribute("Bill Amount", Number(payload?.feeAndVat?.amountInAED).toFixed(2));
    // payload?.feeAndVat?.totalFee && properties.addAttribute("Fee", Number(payload?.feeAndVat?.totalFee));
    // payload?.feeAndVat?.totalVat && properties.addAttribute("VAT", Number(payload?.feeAndVat?.totalVat));
    // payload?.feeAndVat?.mode && properties.addAttribute(payload?.feeAndVat?.mode, `${payload?.feeAndVat?.mode === 'DISCOUNT' ? '-' : ''}`+formatAmount(payload?.feeAndVat?.discountAmount));
    // payload?.feeAndVat?.promoDetails?.promo && properties.addAttribute('Promo', payload?.feeAndVat?.promoDetails?.promo);
    // payload?.feeAndVat?.totalAmount && properties.addAttribute("Total Amount", Number(payload?.feeAndVat?.totalAmount));
    // payload?.currency && properties.addAttribute("Currency", payload?.currency);
    // payload?.isBeneficiary && properties.addAttribute("Beneficiary", payload?.isBeneficiary);
    // properties.addDateAttribute("Date And Time",  new Date().toISOString());
    // ReactMoE.trackEvent("Transactions", properties);
};

export const remittanceEvent = (payload) => {
    // let properties = new MoEProperties();
    // payload?.transactionType && properties.addAttribute("Type", payload?.transactionType);
    // payload?.alias && properties.addAttribute("Beneficiary Name", payload?.alias);
    // payload?.bank?.BankName && properties.addAttribute("Bank Name", payload?.bank?.BankName);
    // payload?.bank?.BankTypeName && properties.addAttribute("Bank Type", payload?.bank?.BankTypeName);
    // payload?.bank?.BranchName && properties.addAttribute("Branch Name", payload?.bank?.BranchName);
    // payload?.bank?.Country && properties.addAttribute("Country", payload?.bank?.Country);
    // payload?.card?.cardType && properties.addAttribute("Card", payload?.card?.cardType);
    // payload?.otherDetails?.AccountTitle && properties.addAttribute("Account Title", payload?.otherDetails?.AccountTitle);
    // payload?.otherDetails?.BeneficiaryAccountNo && properties.addAttribute("Account No.", payload?.otherDetails?.BeneficiaryAccountNo);
    // payload?.otherDetails?.BeneficiaryFirstName && properties.addAttribute("First Name", payload?.otherDetails?.BeneficiaryFirstName);
    // payload?.otherDetails?.BeneficiaryLastName && properties.addAttribute("Last Name", payload?.otherDetails?.BeneficiaryLastName);
    // payload?.otherDetails?.BeneficiaryMSISDN && properties.addAttribute("Phone Number", payload?.otherDetails?.BeneficiaryMSISDN);
    // payload?.otherDetails?.BeneficiaryNationalityCountryISOCode && properties.addAttribute("Nationality Country", payload?.otherDetails?.BeneficiaryNationalityCountryISOCode);
    // payload?.otherDetails?.RemitPurpose && properties.addAttribute("Remit Purpose", payload?.otherDetails?.RemitPurpose);
    // payload?.feeAndVat?.message && properties.addAttribute("Message", payload?.feeAndVat?.message);
    // payload?.feeAndVat?.amountInAED && properties.addAttribute("Transfer Amount", Number(payload?.feeAndVat?.amountInAED).toFixed(2));
    // payload?.feeAndVat?.totalFee && properties.addAttribute("Fee", Number(payload?.feeAndVat?.totalFee));
    // payload?.feeAndVat?.totalVat && properties.addAttribute("VAT", Number(payload?.feeAndVat?.totalVat));
    // payload?.feeAndVat?.mode && properties.addAttribute(payload?.feeAndVat?.mode, `${payload?.feeAndVat?.mode === 'DISCOUNT' ? '-' : ''}`+formatAmount(payload?.feeAndVat?.discountAmount));
    // payload?.feeAndVat?.promoDetails?.promo && properties.addAttribute('Promo', payload?.feeAndVat?.promoDetails?.promo);
    // payload?.feeAndVat?.totalAmount && properties.addAttribute("Total Amount", Number(payload?.feeAndVat?.totalAmount));
    // payload?.feeAndVat?.countryFee && properties.addAttribute("Country Fee", Number(payload?.feeAndVat?.countryFee));
    // payload?.feeAndVat?.tat && properties.addAttribute("Turn Around Time", payload?.feeAndVat?.tat);
    // payload?.feeAndVat?.payoutPartnerRef && properties.addAttribute("Payout Partner Ref.", payload?.feeAndVat?.payoutPartnerRef);
    // payload?.feeAndVat?.singleAmountUnit && properties.addAttribute("Conversion Rate", Number(payload?.feeAndVat?.singleAmountUnit));
    // payload?.isBeneficiary && properties.addAttribute("Beneficiary", payload?.isBeneficiary);
    // payload?.country?.Currency && properties.addAttribute("Currency", payload?.country?.Currency);
    // properties.addDateAttribute("Date And Time",  new Date().toISOString());
    // ReactMoE.trackEvent("Transactions", properties);
};

export const addBeneficiaryEvent = (payload) => {
    // let properties = new MoEProperties();
    // properties.addAttribute("Type", 'REMITTANCE');
    // payload?.alias && properties.addAttribute("Beneficiary Name", payload?.alias);
    // payload?.card?.cardType && properties.addAttribute("Card", payload?.card?.cardType);
    // payload?.bank?.BankName && properties.addAttribute("Bank Name", payload?.bank?.BankName);
    // payload?.bank?.BankTypeName && properties.addAttribute("Bank Type", payload?.bank?.BankTypeName);
    // payload?.bank?.BranchName && properties.addAttribute("Branch Name", payload?.bank?.BranchName);
    // payload?.bank?.Country && properties.addAttribute("Country", payload?.bank?.Country);
    // payload?.otherDetails?.AccountTitle && properties.addAttribute("Account Title", payload?.otherDetails?.AccountTitle);
    // payload?.otherDetails?.BeneficiaryAccountNo && properties.addAttribute("Account No.", payload?.otherDetails?.BeneficiaryAccountNo);
    // payload?.otherDetails?.BeneficiaryFirstName && properties.addAttribute("First Name", payload?.otherDetails?.BeneficiaryFirstName);
    // payload?.otherDetails?.BeneficiaryLastName && properties.addAttribute("Last Name", payload?.otherDetails?.BeneficiaryLastName);
    // payload?.otherDetails?.BeneficiaryMSISDN && properties.addAttribute("Phone Number", payload?.otherDetails?.BeneficiaryMSISDN);
    // payload?.otherDetails?.BeneficiaryNationalityCountryISOCode && properties.addAttribute("Nationality Country", payload?.otherDetails?.BeneficiaryNationalityCountryISOCode);
    // payload?.otherDetails?.RemitPurpose && properties.addAttribute("Remit Purpose", payload?.otherDetails?.RemitPurpose);
    // properties.addDateAttribute("Date And Time",  new Date().toISOString());
    // ReactMoE.trackEvent("Beneficiaries", properties);
};

export const savingsRedeem = (payload) => {
    // let properties = new MoEProperties();
    // properties.addAttribute("Type", 'SAVINGS');
    // properties.addAttribute("Redemption Type", 'MERCHANT');
    // payload?.data?.outletName && properties.addAttribute("Vendor", payload?.data?.outletName);
    // payload?.data?.details && properties.addAttribute("Offer", payload?.data?.details);
    // payload?.data?.billAmount && properties.addAttribute("Amount", Number(payload?.data?.billAmount));
    // payload?.data?.discountType && properties.addAttribute("Discount", renderFlatOrPercentage(payload?.data));
    // payload?.data?.discountAmount && properties.addAttribute("Total Amount", payload?.data?.discountAmount);
    // payload?.data?.status && properties.addAttribute("Status", payload?.data?.status);
    // payload?.message && properties.addAttribute("Message", payload?.message);
    // payload?.data?.tranDate && properties.addDateAttribute("Date And Time",  new Date(payload?.data?.tranDate).toISOString());
    // ReactMoE.trackEvent("Subscriptions", properties);
};
