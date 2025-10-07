import AUTH from "../constants/Auth.constant";

const initialState = {
    registerDeviceLoading: false,
    loginLoading: false,
    userValidateLoading: false,
    newUserValidateLoading: false,
    verifyOtpLoading: false,
    resendOtpLoading: false,
    generateTokenLoading: false,
    signUpLoading: false,
    isLoggedIn: false,
    user: {},
    getCardByIdLoading: false,
    changePasswordLoading: false,
    newPasswordLoading: false,

    forgotPasswordLoading: false,
    getOcrTokenForgotPasswordLoading: false,

    inquiryBalanceLoading: false,
    biometricEnable: [],
    getBiometricLoading: false,
    saveAdditionalInfoLoading: false,
    forgotUsernameLoading: false,
    sendUsernameLoading: false,
    getOcrTokenLoading: false,
    getUserProfileLoading: false,
    updatePhoneNumberLoading: false,
    toggleBiometricModalIsOpen: false,
    biometricAvailable: false,

    getAllNotificationsLoading: false,
    allNotifications: [],
    notificationsIsLoadMoreLoading: false,
    notificationsIsLoadMore: true,
    notificationsMetaData: {},

    notificationApprovalLoading: false,

    updateEmiratesIDLoading: false,

    getUnreadNotificationLoading: false,
    unreadNotificationCount: 0,

    changePhoneNumberVerifyOcrTokenLoading: false,
    changePhoneNumberRequestLoading: false,
    changePhoneNumberRequestVerifyLoading: false,
    changePhoneNumberLoading: false,

    logoutLoading: false,

    checkActiveSessionLoading: false,

    newDeviceRegisterLoading: false,

    validateUserLoading: false,

    alternateVerifyLogin: false,

    userContactLogLoading: false,

    userCardIdentificationLoading: false,

    getOcrTokenSignupLoading: false,

    userDocumentIdentificationLoading: false,

    userLivenessLoading: false,

    detectImagePassportLoading: false,

    userMobileDetectionLoading: false,

    userSignupLoading: false,

    resumeSignupJourneyLoading: false,

    updateUserTypeLoading: false
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case AUTH.LOGIN_USER_API:
            return { ...state, loginLoading: action.loading};

        case AUTH.TOGGLE_BIOMETRIC:
            return { ...state, toggleBiometricModalIsOpen: action.value};

        case AUTH.VALIDATE_USER:
            return { ...state, userValidateLoading: action.loading };

        case AUTH.VERIFY_OTP:
            return { ...state, verifyOtpLoading: action.loading };

        case AUTH.RESEND_OTP:
            return { ...state, resendOtpLoading: action.loading };

        case AUTH.LOGOUT_USER_API:
            return { ...state, logoutLoading: action.loading, isLoggedIn: action.isLoggedIn };

        case AUTH.GET_USER_PROFILE:
            return { ...state, getUserProfileLoading: action.loading || false, user: action.user || {}, isLoggedIn: action.isLoggedIn || false };

        case AUTH.SIGN_UP_USER_API:
            return { ...state, signUpLoading: action.loading };

        case AUTH.TOGGLE_AUTH:
            return { ...state, isLoggedIn: action.isLoggedIn, user: action.user };

        case AUTH.GET_CARD_BY_ID:
            return { ...state, getCardByIdLoading: action.loading, user: action.user || state.user };

        case AUTH.UPDATE_USER:
            return { ...state, user: action.user };

        case AUTH.CHANGE_PASSWORD:
            return { ...state, changePasswordLoading: action.loading };

        case AUTH.NEW_PASSWORD:
            return { ...state, newPasswordLoading: action.loading };

        case AUTH.FORGOT_PASSWORD:
            return { ...state, forgotPasswordLoading: action.loading };
        case AUTH.GET_OCR_TOKEN_FORGOT_PASSWORD:
            return { ...state, getOcrTokenForgotPasswordLoading: action.loading };

        case AUTH.USER_INQUIRY_BALANCE:
            return { ...state, inquiryBalanceLoading: action.loading };

        case AUTH.TOGGLE_CARD_BALANCE:
            return { ...state, user: action.user  };

        case AUTH.REGISTER_DEVICE:
            return { ...state, registerDeviceLoading: action.loading, biometricEnable: action.data };

        case AUTH.GET_BIOMETRIC:
            return { ...state, biometricEnable: action.data || [], getBiometricLoading: action.loading };

        case AUTH.SAVE_USER_ADDITIONAL_INFO:
            return { ...state, saveAdditionalInfoLoading: action.loading, user: action?.data };

        case AUTH.FORGOT_USERNAME:
            return { ...state, forgotUsernameLoading: action.loading };

        case AUTH.SEND_USERNAME:
            return { ...state, sendUsernameLoading: action.loading };

        case AUTH.GET_OCR_TOKEN:
            return { ...state, getOcrTokenLoading: action.loading };

        case AUTH.NEW_VALIDATE_USER:
            return { ...state, getOcrTokenLoading: action.loading, validateUserLoading: action.loading };

        case AUTH.UPDATE_PHONE_NUMBER:
            return { ...state, updatePhoneNumberLoading: action.loading };

        case AUTH.CHECK_BIOMETRIC_AVAILABLE:
            return { ...state, biometricAvailable: action.value };

        case AUTH.GET_ALL_NOTIFICATIONS:
            return {
                ...state,
                getAllNotificationsLoading: action.loading,
                allNotifications: action.data,
                notificationsMetaData: action.metaData,
                notificationsIsLoadMore: true,
                notificationsIsLoadMoreLoading: false,
            };

        case AUTH.LOAD_MORE_NOTIFICATIONS:
            let allNotifications = [...state.allNotifications, ...action.data];
            return {
                ...state,
                notificationsIsLoadMoreLoading: action.loading,
                allNotifications: allNotifications,
                notificationsMetaData: action.metaData,
                notificationsIsLoadMore: allNotifications?.length < action?.metaData?.totalDocuments
            };

        case AUTH.NOTIFICATION_APPROVAL:
            return { ...state, notificationApprovalLoading: action.loading };

        case AUTH.UPDATE_EMIRATES_ID:
            return { ...state, updateEmiratesIDLoading: action.loading };

        case AUTH.CHECK_UNREAD_NOTIFICATION:
            return { ...state, getUnreadNotificationLoading: action.loading, unreadNotificationCount: action?.count };

        case AUTH.CHANGE_PHONE_NUMBER_VERIFY_OCR_TOKEN:
            return { ...state, changePhoneNumberVerifyOcrTokenLoading: action.loading };
        case AUTH.CHANGE_PHONE_NUMBER_REQUEST:
            return { ...state, changePhoneNumberRequestLoading: action.loading };
        case AUTH.CHANGE_PHONE_NUMBER_REQUEST_VERIFY:
            return { ...state, changePhoneNumberRequestVerifyLoading: action.loading };
        case AUTH.CHANGE_PHONE_NUMBER:
            return { ...state, changePhoneNumberLoading: action.loading };

      case AUTH.CHECK_ACTIVE_SESSION:
          return { ...state, checkActiveSessionLoading: action.loading };

        case AUTH.NEW_DEVICE_REGISTER:
            return { ...state, newDeviceRegisterLoading: action.loading };

        case AUTH.ALTERNATE_VERIFY:
            return { ...state, alternateVerifyLogin: action.loading };

        case AUTH.USER_CONTACT_LOG:
            return { ...state, userContactLogLoading: action.loading };

        case AUTH.USER_CARD_IDENTIFICATION:
            return { ...state, userCardIdentificationLoading: action.loading };

        case AUTH.GET_OCR_TOKEN_SIGNUP:
            return { ...state, getOcrTokenSignupLoading: action.loading };

        case AUTH.USER_DOCUMENT_IDENTIFICATION:
            return { ...state, userDocumentIdentificationLoading: action.loading };

        case AUTH.USER_LIVENESS:
            return { ...state, userLivenessLoading: action.loading };

        case AUTH.DETECT_IMAGE_PASSPORT:
            return { ...state, detectImagePassportLoading: action.loading };

        case AUTH.USER_MOBILE_IDENTIFICATION:
            return { ...state, userMobileDetectionLoading: action.loading };

        case AUTH.SIGN_UP_USER:
            return { ...state, userSignupLoading: action.loading };

        case AUTH.RESUME_SIGN_UP_JOURNEY:
            return { ...state, resumeSignupJourneyLoading: action.loading };

        case AUTH.UPDATE_USER_TYPE:
            return { ...state, updateUserTypeLoading: action.loading };

        default:
            return state;
    }
};
