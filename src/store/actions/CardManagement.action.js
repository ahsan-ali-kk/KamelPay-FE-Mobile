import CARD_MANAGEMENT from "../constants/CardManagement.constant";
import {
    handleError,
    handleSuccess,
    post,
} from "../../utils/methods";
import {getProfile, registerDevice} from "./Auth.action";
import DeviceInfo from "react-native-device-info";


export const changePinRequest = (payload, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.CHANGE_PIN_REQUEST, loading: true});
    try {
        let response = await post("card/changePin", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data);
            handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.CHANGE_PIN_REQUEST, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.CHANGE_PIN_REQUEST, loading: false });
    }
};
export const setNewPin = (payload, pin, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.SET_NEW_PIN, loading: true});
    try {
        let response = await post("card/setPin", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            if(pin) {
                let otherPayload = { hash: pin, type: "PIN" };
                let id = await DeviceInfo.getUniqueId();
                otherPayload.deviceId = id;
                dispatch(registerDevice(otherPayload));
            }
            CB && CB();
            // handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.SET_NEW_PIN, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.SET_NEW_PIN, loading: false });
    }
};
export const changeCardStatus = (payload, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.CHANGE_CARD_STATUS, loading: true});
    try {
        let response = await post("card/changeStatus", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB();
            handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.CHANGE_CARD_STATUS, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.CHANGE_CARD_STATUS, loading: false });
    }
};
export const activateCard = (payload, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.ACTIVATE_CARD, loading: true});
    try {
        let response = await post("card/activateCard", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            dispatch(getProfile());
            CB && CB();
            // handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.ACTIVATE_CARD, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.ACTIVATE_CARD, loading: false });
    }
};

export const requestActivateCard = (payload, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.REQUEST_ACTIVATE_CARD, loading: true});
    try {
        let response = await post("card/requestActivateCard", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data);
            handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.REQUEST_ACTIVATE_CARD, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.REQUEST_ACTIVATE_CARD, loading: false });
    }
};
export const verifyActivateCard = (payload, pin, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.VERIFY_ACTIVATE_CARD, loading: true});
    try {
        let response = await post("card/verifyActivateCard", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            if(pin) {
                let otherPayload = { hash: pin, type: "PIN" };
                let id = await DeviceInfo.getUniqueId();
                otherPayload.deviceId = id;
                dispatch(registerDevice(otherPayload));
            }
            CB && CB();
            // handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.VERIFY_ACTIVATE_CARD, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.VERIFY_ACTIVATE_CARD, loading: false });
    }
};

export const linkAnotherCard = (payload, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.LINK_CARD, loading: true});
    try {
        let response = await post("user/addAnotherCard", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB();
            handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.LINK_CARD, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.LINK_CARD, loading: false });
    }
};

export const checkCardSubscriptionStatus = (payload, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.CHECK_CARD_SUBSCRIPTION_STATUS, loading: true});
    try {
        let response = await post("card/subscriptionStatus", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data?.data);
        }
        dispatch({type: CARD_MANAGEMENT.CHECK_CARD_SUBSCRIPTION_STATUS, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.CHECK_CARD_SUBSCRIPTION_STATUS, loading: false });
    }
};
export const updateCardSubscriptionStatus = (payload, CB) => async (dispatch) => {
    dispatch({ type: CARD_MANAGEMENT.UPDATE_CARD_SUBSCRIPTION_STATUS, loading: true});
    try {
        let response = await post("card/subscriptionUpdate", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB();
            handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: CARD_MANAGEMENT.UPDATE_CARD_SUBSCRIPTION_STATUS, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CARD_MANAGEMENT.UPDATE_CARD_SUBSCRIPTION_STATUS, loading: false });
    }
};
