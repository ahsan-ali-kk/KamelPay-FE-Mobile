import REFERRAL from "../constants/Referral.constant";
import {handleError, post, get, handleSuccess} from "../../utils/methods";


export const checkUserReferral = (payload, CB) => async (dispatch) => {
    dispatch({ type: REFERRAL.CHECK_USER_REFERRAL, loading: true, hasReferred: true});
    try {
        let response = await post("referral/getReferralDetails", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: REFERRAL.CHECK_USER_REFERRAL, loading: false});
        } else {
            CB && CB(response?.data);
            dispatch({type: REFERRAL.CHECK_USER_REFERRAL, loading: false, hasReferred: response?.data?.data?.hasRefered});
        }
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error || error?.message);
        dispatch({ type: REFERRAL.CHECK_USER_REFERRAL, loading: false, hasReferred: true });
    }
};


export const updateReferral = () => async (dispatch) => {
    dispatch({ type: REFERRAL.CHECK_USER_REFERRAL, loading: false, hasReferred: true});
};


export const getUserReferral = (payload) => async (dispatch) => {

    let dispatchType = REFERRAL.GET_USER_REFERRALS;

    if (payload.page > 1) {
        dispatchType = REFERRAL.LOAD_MORE_USER_REFERRALS;
    }

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post("referral/getRefferedList", payload);
console.log('response', response?.data?.data)
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
                totalEarned: response?.data?.data?.totalEarned,
                totalPaid: response?.data?.data?.totalPaid,
            });

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message);
        dispatch({ type: dispatchType, loading: false});

    }
};

export const addReferral = (payload, CB) => async (dispatch) => {
    dispatch({ type: REFERRAL.ADD_USER_REFERRAL, loading: true});
    try {
        let response = await post("referral/add", payload);
        if(response?.data?.error) {
            // handleError(response?.data?.data?.message || '');
            dispatch({type: REFERRAL.ADD_USER_REFERRAL, loading: false});
        } else {
            dispatch({type: REFERRAL.ADD_USER_REFERRAL, loading: false, hasReferred: true });
            // handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: REFERRAL.ADD_USER_REFERRAL, loading: false });

        CB && CB(response?.data);
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error || error?.message);
        dispatch({ type: REFERRAL.ADD_USER_REFERRAL, loading: false });
    }
};
