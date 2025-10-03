import LOTTERY from "../constants/Lottery.constant";
import {encodeQueryData, get, handleError, post} from "../../utils/methods";

export const getCampaigns = (payload, CB) => async (dispatch) => {
    dispatch({ type: LOTTERY.GET_CAMPAIGNS, loading: true});
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
    try {
        let response = await get(`idealz/getCampaigns${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: LOTTERY.GET_CAMPAIGNS, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data?.data?.data);
            dispatch({type: LOTTERY.GET_CAMPAIGNS, loading: false, data: response?.data?.data?.data});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: LOTTERY.GET_CAMPAIGNS, loading: false, isLoggedIn: false });
    }
};

export const getHistory = (payload) => async (dispatch) => {

    let dispatchType = LOTTERY.GET_HISTORY;

    if (payload.page > 1) {
        dispatchType = LOTTERY.LOAD_MORE_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("transaction/trackLottery", payload);

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

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const processPayment = (payload, CB) => async (dispatch) => {
    dispatch({ type: LOTTERY.PROCESS_PAYMENT, loading: true});
    try {
        let response = await post(`idealz/processPayment`, payload);
        console.log('response', response);
        if(response?.data?.error) {
            dispatch({type: LOTTERY.PROCESS_PAYMENT, loading: false});
        } else {
            dispatch({type: LOTTERY.PROCESS_PAYMENT, loading: false});
        }
        CB && CB(response?.data, payload);
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: LOTTERY.PROCESS_PAYMENT, loading: false});
    }
};

export const getSingleCampaignDetails = (payload, CB) => async (dispatch) => {
    dispatch({ type: LOTTERY.GET_SINGLE_CAMPAIGN, loading: true});
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
    try {
        let response = await get(`idealz/getCampaignDetails${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: LOTTERY.GET_SINGLE_CAMPAIGN, loading: false});
        } else {
            dispatch({type: LOTTERY.GET_SINGLE_CAMPAIGN, loading: false, data: response?.data?.data?.data});
        }
        CB && CB(response?.data, payload);
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: LOTTERY.GET_SINGLE_CAMPAIGN, loading: false});
    }
};

export const getFeesAndVat = (payload, CB) => async (dispatch) => {
    dispatch({ type: LOTTERY.GET_LOTTERY_FEES_VAT, loading: true});
    try {
        let response = await post(`idealz/getFeesAndVat`, payload);
        if(response?.data?.error) {
            dispatch({type: LOTTERY.GET_LOTTERY_FEES_VAT, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            // handleSuccess(response?.data?.data?.message);
            dispatch({ type: LOTTERY.GET_LOTTERY_FEES_VAT, loading: false, data: response?.data?.data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: LOTTERY.GET_LOTTERY_FEES_VAT, loading: false});
    }
};
