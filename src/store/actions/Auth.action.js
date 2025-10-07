import AUTH from "../constants/Auth.constant";
import {
    handleError,
    handleSuccess,
    loginWithBiometrics,
    get,
    post,
    setUpBiometricLogin,
    setHours
} from "../../utils/methods";
import {
    getValueIntoAsyncStorage,
    _setDataToAsyncStorage,
    getTokenAndSetIntoHeaders,
    removeUserDetail,
    removeItemIntoAsyncStorage
} from "../../utils/asyncStorage/Functions";
import {
    USER_BIO_KEY,
    TOKEN,
    FCM_TOKEN,
    USER_BIOMETRICS
} from "../../utils/asyncStorage/Constants";
import ReactNativeBiometrics from "react-native-biometrics";
import Popup from "../../uiComponents/popup/Popup";
import {navigate, navigationReset} from "../../routing/Ref";
import {getMasterDetail, updateCard} from "./Global.action";
import {logoutUser} from "../../trackingEvents/UXCAM";
import {setUserDetails, loginUser, singleCardStatus} from "../../utils/dataDog/events";
import {connectionSocket} from "../../utils/socket";
import _ from 'lodash';

export const enableLoginMethodAlert = () => {
    Popup.show({
        isVisible: true,
        type: 'Custom',
        imageSize: 'normal',
        customVector: require('../../assets/images/bio-and-pin-login-vector.png'),
        title: 'Login Methods!',
        text: 'Do you want to enable biometric and pin code login?',
        actions: [
            {
                text: 'Enable',
                callback: async  () => {
                    const publicKey  = await setUpBiometricLogin();
                    if (publicKey) {
                        await registerBiometric(publicKey)
                    }
                    Popup.hide();
                    navigate('Settings')
                }
            },
            {
                text: 'Go to Setting',
                callback: () => {
                    Popup.hide();
                    navigate('Settings')
                }
            }
        ]
    })
};

export const toggleEnableBiometric = (value) => async (dispatch) => {
    dispatch({ type: AUTH.TOGGLE_BIOMETRIC, value: value});
};

export const checkBiometricAvailable = () => async (dispatch) => {
    ReactNativeBiometrics.isSensorAvailable()
        .then((resultObject) => {
            const { available } = resultObject;
            dispatch({ type: AUTH.CHECK_BIOMETRIC_AVAILABLE, value: available});
        })
};

export const login = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.LOGIN_USER_API, loading: true, isLoggedIn: false});
    try {
        let notificationToken = await getValueIntoAsyncStorage(FCM_TOKEN);
        if(notificationToken) {
            payload = {
                ...payload,
                notificationToken: notificationToken,
                notificationService: "FCM"
            }
        }
        let response = await post("user/login", payload);
        if(response?.data?.error) {
            if(response?.data?.data?.removeRegisteredDevice){
                dispatch(removeAllBiometricsTypes())
            }
            handleError(response?.data?.data?.message || '');
        }
        else {
            if(response?.data?.data?.data?.status === 'OTP_NOT_VERIFIED') {
                CB && CB();
                navigate('authOTP', {
                    user: {
                        ...response?.data?.data?.data,
                        isDeviceRegistered: response?.data?.data?.isDeviceRegistered,
                    },
                    token: response?.data?.data?.token,
                    screen: 'checkStatus',
                    hideChangeNumber: true
                })
            } else {
                if(response?.data?.data?.removeRegisteredDevice){
                    dispatch(removeAllBiometricsTypes())
                }
                await _setDataToAsyncStorage(TOKEN, response?.data?.data?.token);
                await getTokenAndSetIntoHeaders(response?.data?.data?.token);
                dispatch(toggleAuth({
                    ...response?.data?.data?.data,
                    isDeviceRegistered: response?.data?.data?.isDeviceRegistered,
                }));
                await connectionSocket();
                loginUser(response?.data?.data?.data);
                CB && CB();
            }
        }
        dispatch({type: AUTH.LOGIN_USER_API, loading: false});
        CB && CB(response?.data);
    } catch (error) {
        handleError(error?.response?.data?.message || error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.LOGIN_USER_API, loading: false});
    }
};

export const getCurrentBiometrics = async () => {
    let currentBiometrics = await getValueIntoAsyncStorage(USER_BIOMETRICS);
    return JSON.parse(currentBiometrics) || []
};

const setCurrentBiometrics = async (data) => {
    await _setDataToAsyncStorage(
        USER_BIOMETRICS,
        JSON.stringify(data)
    );
};

export const removeAllBiometricsTypes = () => async (dispatch) => {
    await removeItemIntoAsyncStorage(USER_BIOMETRICS);
    await removeItemIntoAsyncStorage(USER_BIO_KEY);

    await deleteReactNativeBiometricsKeys();

    dispatch({ type: AUTH.GET_BIOMETRIC, data: [], loading: false});
};

const deleteReactNativeBiometricsKeys = async () => {
    let biometrics = await getCurrentBiometrics();
    if(!biometrics?.includes('BIOMETRIC')) {
        await ReactNativeBiometrics.deleteKeys()
    }
};

export const removeBiometricsType = (val) => async (dispatch) => {

    let currentBiometrics = await getCurrentBiometrics();

    if(val === 'BIOMETRIC'){
        await removeItemIntoAsyncStorage(USER_BIO_KEY);
    }

    let array = currentBiometrics;

    if(array){
        currentBiometrics = array.filter(o => o !== val)
    }

    await setCurrentBiometrics(currentBiometrics);


   await deleteReactNativeBiometricsKeys();

    dispatch({ type: AUTH.GET_BIOMETRIC, data: currentBiometrics});

};

export const addBiometricTypeInLocalStorage = (val) => async (dispatch) => {
    let currentBiometrics = await getCurrentBiometrics();

    if(currentBiometrics && currentBiometrics.length){
        currentBiometrics = [...currentBiometrics, val]
    } else {
        currentBiometrics = [val]
    }

    await setCurrentBiometrics(currentBiometrics);

    dispatch({ type: AUTH.GET_BIOMETRIC, data: currentBiometrics});

    return currentBiometrics

};

export const getAndUpdateBiometricType = (CB) => async (dispatch) => {
    let currentBiometrics = await getCurrentBiometrics();
    dispatch({ type: AUTH.GET_BIOMETRIC, data: currentBiometrics, loading: false});
    CB && CB(currentBiometrics)

};

export const registerDevice = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.REGISTER_DEVICE, loading: true});
    try {
        let response = await post("user/registerDevice", payload);
        if(response?.data?.error) {
            dispatch({type: AUTH.REGISTER_DEVICE, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
           let currentBiometrics = await dispatch(addBiometricTypeInLocalStorage(payload.type));
            handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data?.data?.message);
            dispatch({type: AUTH.REGISTER_DEVICE, loading: false, data: currentBiometrics});
        }
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.REGISTER_DEVICE, loading: false});
    }
};

export const validateUser = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.VALIDATE_USER, loading: true});
    try {
        let response = await post("user/validate", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB({...response?.data?.data, ...payload, screen: 'userCreation'})
        }
        dispatch({type: AUTH.VALIDATE_USER, loading: false});
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.VALIDATE_USER, loading: false });
    }
};

export const verifyOtp = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.VERIFY_OTP, loading: true});
    try {
        let response = await post("user/verifyOtp", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            CB && CB(response?.data);
        } else {
            CB && CB({...payload, ...response?.data?.data})
        }
        dispatch({type: AUTH.VERIFY_OTP, loading: false});
    } catch (error) {
        handleError(error?.response?.data?.message || error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.VERIFY_OTP, loading: false });
    }
};

export const resendOtp = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.RESEND_OTP, loading: true});
    try {
        let response = await post("user/resendOtp", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            CB && CB(response?.data);
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB({...payload, ...response?.data?.data})
        }
        dispatch({type: AUTH.RESEND_OTP, loading: false});
    } catch (error) {
        handleError(error?.response?.data?.message || error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.RESEND_OTP, loading: false });
    }
};

export const toggleAuth = (user) => async (dispatch) => {
    let biometricEnable = await getCurrentBiometrics();
    // if(auth?.biometricAvailable && !biometricEnable?.includes('BIOMETRIC') || !biometricEnable?.includes('PIN')){
    if(user?.isDeviceRegistered && (!biometricEnable || !biometricEnable?.includes('PIN'))){
        dispatch(toggleEnableBiometric(true))
    }
    setUserDetails(user);
    dispatch({type: AUTH.TOGGLE_AUTH, isLoggedIn: true, user: user});
};

export const signUp = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.SIGN_UP_USER_API, loading: true});
    try {
        let notificationToken = await getValueIntoAsyncStorage(FCM_TOKEN);
        if(notificationToken) {
            payload = {
                ...payload,
                notificationToken: notificationToken,
                notificationService: "FCM"
            }
        }
        let response = await post("user/createUser", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: AUTH.SIGN_UP_USER_API, loading: false});
        } else {
            CB && CB({
                ...response?.data,
                phone: response?.data?.data?.data.phone
            });
            dispatch({type: AUTH.SIGN_UP_USER_API, loading: false});
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error?.data?.error);
        dispatch({ type: AUTH.SIGN_UP_USER_API, loading: false });
    }
};

export const getProfile = (payload, CB) => async (dispatch) => {
    let token = await getValueIntoAsyncStorage(TOKEN);
    if(token) {
        await getTokenAndSetIntoHeaders(token);
        await connectionSocket();
        dispatch({type: AUTH.GET_USER_PROFILE, loading: true});
        try {
            let response = await post("user/profile", payload);
            if (response?.data?.error) {
                handleError(response?.data?.data?.message || '');
                dispatch({type: AUTH.GET_USER_PROFILE});
                CB && CB({type: 'ERROR'})
            } else {
                let user = {
                    ...response?.data?.data?.data,
                    isDeviceRegistered: response?.data?.data?.isDeviceRegistered,
                }
                dispatch({
                    type: AUTH.GET_USER_PROFILE,
                    user: {
                        ...response?.data?.data?.data,
                        isDeviceRegistered: response?.data?.data?.isDeviceRegistered,
                    },
                    isLoggedIn: true});
                dispatch(getUnreadNotificationCount());
                setUserDetails(response?.data?.data?.data);
                CB && CB({type: 'SUCCESS', user})
            }
            dispatch(getAndUpdateBiometricType())
        } catch (error) {
            handleError(error?.response?.data?.message || error?.data?.error);
            dispatch({ type: AUTH.GET_USER_PROFILE, loading: false});
            CB && CB({ type: 'ERROR' })
        }
    } else {
        console.log('TOKEN_NOT_FOUND');
        CB && CB({ type: 'TOKEN_NOT_FOUND' });
        dispatch({type: AUTH.GET_USER_PROFILE, loading: false});
    }
};

export const logout =  (showToast = true, type, message = 'Successfully logout!') => async (dispatch) => {
    // if(showToast) {
    //     if(type === 'expire') {
    //         // handleError(message);
    //     } else {
    //         // handleSuccess(message);
    //     }
    // }
    dispatch({ type: AUTH.LOGOUT_USER_API, loading: false, isLoggedIn: false});
    await removeUserDetail();
    dispatch(getMasterDetail());
    logoutUser();
};

export const getCardById = (payload, CB) => async (dispatch, getState) => {

    const {auth, global} = getState();
    const {user} = auth;
    const {activeCardIndex} = global;

    let updatedUser = user ? {...user} : {};

    dispatch({ type: AUTH.GET_CARD_BY_ID, loading: true});
    try {
        let response = await post("card/getById", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({ type: AUTH.GET_CARD_BY_ID, loading: false});
        } else {
            if(updatedUser) {
                let updatedCard = response?.data?.data?.data;
                CB && CB(updatedCard)
                singleCardStatus(updatedCard, user);
                if (updatedCard?.isDeleted) {
                    updatedUser.cards = updatedUser.cards.filter(acc => acc._id !== payload.id);
                } else {
                    updatedUser.cards = updatedUser?.cards.map(acc => {
                        if(acc._id === payload.id) {
                            acc = Object.assign(acc, updatedCard)
                        }
                        return acc
                    });
                }
                dispatch(updateCard(updatedCard, activeCardIndex))
            }
            dispatch({ type: AUTH.GET_CARD_BY_ID, loading: false, user: updatedUser });
        }
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.GET_CARD_BY_ID, loading: false });
    }
};

export const inquiryBalance = (payload, CB, justCheckStatus) => async (dispatch, getState) => {

    const {auth, global} = getState();
    const {user} = auth;
    const {activeCardIndex} = global;

    let updatedUser = user;

    dispatch({ type: AUTH.USER_INQUIRY_BALANCE, loading: true});
    try {
        let response = await post("user/inquiryBalance", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({ type: AUTH.USER_INQUIRY_BALANCE, loading: false});
        } else {
            if(updatedUser) {
                let updatedCard = response?.data?.data?.data;
                updatedUser.cards = updatedUser?.cards.map(acc => {
                    if(acc.walletID === payload.walletID) {
                        acc = Object.assign(acc, {
                            ...updatedCard,
                            ...(!justCheckStatus && {
                                hasBalanced: true,
                                showBalance: !acc.showBalance
                            })
                        })
                        if(!justCheckStatus){
                            dispatch(updateCard(acc, activeCardIndex));
                        }
                        dispatch({ type: AUTH.USER_INQUIRY_BALANCE });
                    }
                    return acc
                });
            }
            dispatch({ type: AUTH.USER_INQUIRY_BALANCE, loading: false, user: updatedUser });
            CB && CB()
        }
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.USER_INQUIRY_BALANCE, loading: false });
    }
};

export const toggleCardBalance = (payload, CB) => async (dispatch, getState) => {
    const {auth} = getState();
    const {user} = auth;

    let updatedUser = user;

    if(updatedUser) {
        updatedUser.cards = updatedUser?.cards.map(acc => {
            if(acc.walletID === payload.walletID) {
                acc = Object.assign(acc, {
                    showBalance: !acc.showBalance
                })
            }
            return acc
        });
    }
    dispatch({ type: AUTH.TOGGLE_CARD_BALANCE, loading: false, user: updatedUser });
};

export const newPassword = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.NEW_PASSWORD, loading: true});
    let path = payload?.ocrToken ? 'user/setPasswordOcr' : 'user/setPassword';
    try {
        let response = await post(path, payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: AUTH.NEW_PASSWORD, loading: false});
            CB && CB(response?.data);
        } else {
            dispatch(removeAllBiometricsTypes());
            handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data?.data);
            dispatch({type: AUTH.NEW_PASSWORD, loading: false});
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.NEW_PASSWORD, loading: false });
    }
};

export const forgotPassword = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.FORGOT_PASSWORD, loading: true});
    try {
        let response = await post("user/forgetPassword", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: AUTH.FORGOT_PASSWORD, loading: false});
        } else {
            CB && CB({...response?.data?.data, screen: 'newPassword'});
            dispatch({type: AUTH.FORGOT_PASSWORD, loading: false});
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.FORGOT_PASSWORD, loading: false });
    }
};

export const getOcrTokenForgotPassword = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.GET_OCR_TOKEN_FORGOT_PASSWORD, loading: true});
    try {
        let response = await post("user/getOcrTokenForgetPassword", payload);
        CB && CB(response?.data);
        dispatch({type: AUTH.GET_OCR_TOKEN_FORGOT_PASSWORD, loading: false});
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.GET_OCR_TOKEN_FORGOT_PASSWORD, loading: false });
    }
};

export const changePassword = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.CHANGE_PASSWORD, loading: true});
    try {
        let response = await post("user/changePassword", payload);
        if(response?.data?.error) {
            dispatch({type: AUTH.CHANGE_PASSWORD, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data?.data);
            dispatch({type: AUTH.CHANGE_PASSWORD, loading: false});
        }
    } catch (error) {
        handleError(error?.response?.data?.message || error?.data?.error);
        dispatch({ type: AUTH.CHANGE_PASSWORD, loading: false });
    }
};

export const saveAdditionalInfo = (payload, CB) => async (dispatch, getState) => {
    const {auth} = getState();
    let userProfile = auth.user;
    dispatch({ type: AUTH.SAVE_USER_ADDITIONAL_INFO, loading: true, data: userProfile});
    try {
        let response = await post("user/addAdditionalInfo", payload);

        if(response?.data?.error) {
            dispatch({type: AUTH.SAVE_USER_ADDITIONAL_INFO, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            handleSuccess(response?.data?.data?.message);
            userProfile = {
                ...userProfile,
                additionalInfo: payload
            };
            CB && CB(response?.data?.data);
            dispatch({type: AUTH.SAVE_USER_ADDITIONAL_INFO, loading: false, data: userProfile});
        }
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.SAVE_USER_ADDITIONAL_INFO, loading: false});
    }
};

export const forgotUsername = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.FORGOT_USERNAME, loading: true});
    try {
        let response = await post("user/forgetUsername", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: AUTH.FORGOT_USERNAME, loading: false});
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB({...response?.data?.data, screen: 'login'});
            dispatch({type: AUTH.FORGOT_USERNAME, loading: false});
        }
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.FORGOT_USERNAME, loading: false });
    }
};

export const sendUsername = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.SEND_USERNAME, loading: true});
    try {
        let response = await post("user/sendUsername", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: AUTH.SEND_USERNAME, loading: false});
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data?.data);
            dispatch({type: AUTH.SEND_USERNAME, loading: false});
        }
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.SEND_USERNAME, loading: false });
    }
};

export const getOcrToken = (payload, CB, errorCB) => async (dispatch) => {
    dispatch({ type: AUTH.GET_OCR_TOKEN, loading: true});
    try {
        let response = await post("user/getOcrToken", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: AUTH.GET_OCR_TOKEN, loading: false});
            errorCB && errorCB({
                error: true,
                title: 'Error',
                message: response?.data?.data?.message
            })
        } else {
            CB && CB(response?.data?.data);
            dispatch({type: AUTH.GET_OCR_TOKEN, loading: false});
        }
    } catch (error) {
        errorCB && errorCB({
            error: true,
            title: 'Error',
            message: error?.data?.error
        });
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.GET_OCR_TOKEN, loading: false });
    }
};

export const newValidateUser = (payload, CB, isShowToast = true, headers = {}) => async (dispatch) => {
    dispatch({ type: AUTH.NEW_VALIDATE_USER, loading: true});
    try {
        if(!(headers && Object.keys(headers).length > 0)) {
            if(payload?.cardExpiry){
                payload.cardExpiry = setHours(payload?.cardExpiry, 'to');
            }
        }
        let response = await post("user/validateUser", payload, {headers});
        if(response?.data?.error) {
            if(isShowToast){
                handleError(response?.data?.data?.message || '');
            }
        } else {
            if(isShowToast) {
                handleSuccess(response?.data?.data?.message);
            }
        }
        CB && CB(response?.data);
        dispatch({type: AUTH.NEW_VALIDATE_USER, loading: false});
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: AUTH.NEW_VALIDATE_USER, loading: false });
    }
};

export const updatePhoneNumber = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.UPDATE_PHONE_NUMBER, loading: true});
    try {
        let response = await post("user/updatePhoneNumber", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data);
        }
        dispatch({type: AUTH.UPDATE_PHONE_NUMBER, loading: false});
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.UPDATE_PHONE_NUMBER, loading: false });
    }
};

export const getNotifications = (payload, CB) => async (dispatch) => {

    let dispatchType = AUTH.GET_ALL_NOTIFICATIONS;

    if (payload.page > 1) {
        dispatchType = AUTH.LOAD_MORE_NOTIFICATIONS;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("userNotification/get", payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });
            dispatch(getUnreadNotificationCount());

            CB && CB(response?.data?.data?.data);

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});
    }
};

export const notificationsApproval = (payload, CB) => async (dispatch) => {
    let dispatchType = AUTH.NOTIFICATION_APPROVAL;
    dispatch({ type: dispatchType, loading: true });
    try {
        let response = await post("user/notificationApproval", payload);
        dispatch({type: dispatchType, loading: false });
        CB && CB(response?.data);
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};

export const checkActiveSession = (initialLoading = false) => async (dispatch, getState) => {
    const {auth} = getState();
    if(auth?.isLoggedIn){
        dispatch({ type: AUTH.CHECK_ACTIVE_SESSION, loading: initialLoading});
        try {
            let response = await get("user/activeSession");
            if (response?.data?.error) {
                handleError(response?.data?.data?.message || '');
            } else {

            }
            dispatch({ type: AUTH.CHECK_ACTIVE_SESSION, loading: false});
        } catch (error) {
            handleError(error?.data?.error || error?.message, {autoHide: false});
            dispatch({ type: AUTH.CHECK_ACTIVE_SESSION, loading: false});
        }
    }
};

export const updateEmiratesID = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.UPDATE_EMIRATES_ID, loading: true});
    try {
        let response = await post("user/uploadNewEid", payload);
        CB && CB(response?.data);
        dispatch({type: AUTH.UPDATE_EMIRATES_ID, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.UPDATE_EMIRATES_ID, loading: false });
    }
};

export const getUnreadNotificationCount = () => async (dispatch) => {
    let token = await getValueIntoAsyncStorage(TOKEN);
    if(token) {
        await getTokenAndSetIntoHeaders(token);
        dispatch({type: AUTH.CHECK_UNREAD_NOTIFICATION, loading: true, count: 0});
        try {
            let response = await post("userNotification/getUnreadCount");
            if (response?.data?.error) {
                dispatch({type: AUTH.CHECK_UNREAD_NOTIFICATION, loading: false, count: 0});
            } else {
                dispatch({
                    type: AUTH.CHECK_UNREAD_NOTIFICATION,
                    loading: false,
                    count: response?.data?.data?.unreadNotificationCount || 0
                });
            }
        } catch (error) {
            dispatch({type: AUTH.CHECK_UNREAD_NOTIFICATION, loading: false, count: 0});
        }
    }
};

export const changePhoneNumberRequestApi = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.CHANGE_PHONE_NUMBER_REQUEST, loading: true});
    try {
        let response = await post("user/changePhoneNumberRequest", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(payload, response?.data);
        }
        dispatch({type: AUTH.CHANGE_PHONE_NUMBER_REQUEST, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.CHANGE_PHONE_NUMBER_REQUEST, loading: false });
    }
};
export const changePhoneNumberRequestVerifyApi = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.CHANGE_PHONE_NUMBER_REQUEST_VERIFY, loading: true});
    try {
        let response = await post("user/changePhoneNumberVerify", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        }
        CB && CB(response?.data);
        dispatch({type: AUTH.CHANGE_PHONE_NUMBER_REQUEST_VERIFY, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.CHANGE_PHONE_NUMBER_REQUEST_VERIFY, loading: false });
    }
};
export const changePhoneNumberApi = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.CHANGE_PHONE_NUMBER, loading: true});
    try {
        let response = await post("user/changePhoneNumber", payload);
        CB && CB(response?.data);
        if(response?.data?.error) {

        } else {
            await removeItemIntoAsyncStorage(USER_BIOMETRICS);
        }
        dispatch({type: AUTH.CHANGE_PHONE_NUMBER, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.CHANGE_PHONE_NUMBER, loading: false });
    }
};

export const changePhoneNumberVerifyOcrToken = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.CHANGE_PHONE_NUMBER_VERIFY_OCR_TOKEN, loading: true});
    try {
        let response = await post("user/changePhoneNumberVerifyOcr", payload);
        CB && CB(response?.data);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        }
        dispatch({type: AUTH.CHANGE_PHONE_NUMBER_VERIFY_OCR_TOKEN, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message
            }
        });
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.CHANGE_PHONE_NUMBER_VERIFY_OCR_TOKEN, loading: false });
    }
};

export const newDeviceRegister = (payload, CB, headers = {}) => async (dispatch) => {
    dispatch({ type: AUTH.NEW_DEVICE_REGISTER, loading: true});
    try {
        let response = await post("user/registerNewDevice", payload, (Object.keys(headers).length && {headers}));
        CB && CB(response?.data);
        if(response?.data?.error) {

        } else {

        }
        dispatch({type: AUTH.NEW_DEVICE_REGISTER, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.NEW_DEVICE_REGISTER, loading: false });
    }
};

export const alternateVerify = (payload, CB) => async (dispatch) => {
    dispatch({ type: AUTH.ALTERNATE_VERIFY, loading: true});
    try {
        let response = await post("user/verifyPortalOtp", payload);
        // console.log('response', response);
        CB && CB(response?.data, payload);
        // if(response?.data?.error) {
        //
        // } else {
        //
        // }
        dispatch({type: AUTH.ALTERNATE_VERIFY, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: AUTH.ALTERNATE_VERIFY, loading: false });
    }
};

export const userContactLog = (payload, CB) => async (dispatch) => {
    const dispatchType = AUTH.USER_CONTACT_LOG;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("user/contactLog", payload);
        CB && CB(response?.data, payload);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false });
    }
};


export const userCardIdentification = (payload, CB) => async (dispatch) => {
    const dispatchType = AUTH.USER_CARD_IDENTIFICATION;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("user/cardIdentification", payload);
        CB && CB(response?.data, payload);
        setTimeout(() => dispatch({type: dispatchType, loading: false}), 500)
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false });
    }
};

export const getOcrTokenSignup = (payload, CB) => async (dispatch) => {
    const dispatchType = AUTH.GET_OCR_TOKEN_SIGNUP;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("user/getOcrTokenSignUp", payload);
        CB && CB(response?.data);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        handleError(error?.data?.error, {autoHide: false});
        dispatch({ type: dispatchType, loading: false });
    }
};

export const detectImagePassport = (payload, CB, headers, isAuth) => async (dispatch) => {
    const dispatchType = AUTH.DETECT_IMAGE_PASSPORT;
    dispatch({ type: dispatchType, loading: true});
    try {
        let path = isAuth ? 'detectImagePassportAuth' : 'detectImagePassport'
        let response = await post(`user/${path}`, payload, {headers});
        CB && CB(response?.data);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message,
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};

export const userDocumentIdentification = (payload, CB) => async (dispatch) => {
    const dispatchType = AUTH.USER_DOCUMENT_IDENTIFICATION;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("user/documentIdentification", payload);
        CB && CB(response?.data, payload);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message,
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};

export const userLivness = (payload, CB, headers) => async (dispatch) => {
    const dispatchType = AUTH.USER_LIVENESS;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("user/uploadLivenessCheck", payload, {headers});
        CB && CB(response?.data, payload);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message,
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};

export const userMobileIdentification = (payload, CB) => async (dispatch) => {
    const dispatchType = AUTH.USER_MOBILE_IDENTIFICATION;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("user/mobileIdentification", payload);
        CB && CB(response?.data, payload);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message,
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};

export const userSignUp = (payload, CB) => async (dispatch) => {
    const dispatchType = AUTH.SIGN_UP_USER;
    dispatch({ type: dispatchType, loading: true});
    try {
        let notificationToken = await getValueIntoAsyncStorage(FCM_TOKEN);
        if(notificationToken) {
            payload = {
                ...payload,
                notificationToken: notificationToken,
                notificationService: "FCM"
            }
        }
        let response = await post("user/signup", payload);
        CB && CB(response?.data, payload);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message,
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};

export const resumeSignupJourney = (payload, CB) => async (dispatch) => {
    const dispatchType = AUTH.RESUME_SIGN_UP_JOURNEY;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("user/getUser", payload);
        CB && CB(response?.data, payload);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message,
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};

export const updateUserType = (payload, CB, headers) => async (dispatch) => {
    const dispatchType = AUTH.UPDATE_USER_TYPE;
    dispatch({ type: dispatchType, loading: true});
    try {
        let pay = payload?.formData ? payload?.formData : _.omit(payload, ['formData']);
        let response = await post("user/updateMobileUserType", pay, {headers});
        console.log('updateUserType', response?.data);
        CB && CB(response?.data);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        CB && CB({
            error: true,
            data: {
                message: error?.data?.error || error?.message,
            }
        });
        dispatch({ type: dispatchType, loading: false });
    }
};
