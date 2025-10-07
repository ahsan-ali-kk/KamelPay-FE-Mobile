import {DdSdkReactNative} from "@datadog/mobile-react-native";
import moment from "moment";
import {getCardIsActivatedOrStatus} from "../../uiComponents/creditCardUi/CreditCardUi";


export const logOutUser = (user) => {
    // DdSdkReactNative.setUser({});
}
export const loginUser = (user) => {
    let payload = {};

    // if(user?.fullName){
    //     payload.name = user.fullName;
    // }

    if(user?.userId){
        payload.id = user.userId.toString();
    }

    DdSdkReactNative.setUserInfo(payload);
};


export const singleCardStatus = (card) => {
    DdSdkReactNative.addUserExtraInfo( {
        [card?.cardType]:  {
            status: getCardIsActivatedOrStatus(card, true).id,
            walletID: card?.walletID,
        },
    });
};
export const setUserDetails = (user) => {
    let payload = {};

    if(user?.cards?.length){
        user?.cards.forEach(card => {
            payload[card?.cardType] = {
                status: getCardIsActivatedOrStatus(card, true).id,
                walletID: card?.walletID,
            }
        })
    }

    // if(user?.fullName){
    //     payload.name = user.fullName;
    // }

    // if(user?.phone){
    //     payload.phone = user.phone;
    // }

    // if(user?.gender){
    //     payload.gender = user?.gender === 'F' ? "Female" : "Male";
    // }

    if(user?.occupation){
        payload.occupation = user.occupation;
    }

    if(user?.employerName){
        payload.employerName = user.employerName;
    }

    // if(user?.passportNumber){
    //     payload.passportNumber = user.passportNumber;
    // }

    if(user?.companyId){
        payload.companyId = user.companyId;
    }

    // if(user?.emirateID){
    //     payload.emirateID = user?.emirateID;
    // }

    if(user?.status){
        payload.status = user.status;
    }

    // if(user?.expiryDate){
    //     payload.emirateIDExpiryDate = moment(user?.expiryDate).format('DD/MM/YYYY');
    // }

    if(user?.nationality){
        payload.nationality = user.nationality;
    }

    // if(user?.dateOfBirth) {
    //     payload.dateOfBirth = moment(user?.dateOfBirth).format('DD/MM/YYYY');
    // }

    if(user?.isLightUser) {
        payload.isLightUser = user.isLightUser;
    }

    if(user?.isPortalUser) {
        payload.isPortalUser = user?.isPortalUser?.status;
    }

    if(user?.isSuperStar) {
        payload.isSuperStar = user.isSuperStar;
    }

    console.log('addUserExtraInfo', payload);
    DdSdkReactNative.addUserExtraInfo(payload);
}
