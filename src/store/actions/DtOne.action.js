import DT_ONE from "../constants/DtOne.constant";
import {handleError, post, get, encodeQueryData} from "../../utils/methods";

export const getCards = (payload, CB) => async (dispatch) => {

    let dispatchType = DT_ONE.GET_CARDS;

    if (payload.page > 1) {
        dispatchType = DT_ONE.LOAD_MORE_GET_CARDS;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    try {

        let response = await get(`dtOne/getCards${queryParams}`);

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

            CB && CB(response?.data?.data?.data);

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const processPayment = (payload, CB) => async (dispatch) => {
    dispatch({ type: DT_ONE.PROCESS_PAYMENT, loading: true});
    try {
        let response = await post(`dtOne/processPayment`, payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: DT_ONE.PROCESS_PAYMENT, loading: false});
        } else {
            dispatch({type: DT_ONE.PROCESS_PAYMENT, loading: false});
            CB && CB(response?.data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: DT_ONE.PROCESS_PAYMENT, loading: false });
    }
};

export const trackHistory = (payload, CB) => async (dispatch) => {

    let dispatchType = DT_ONE.TRACK_HISTORY;

    if (payload.page > 1) {
        dispatchType = DT_ONE.LOAD_MORE_TRACK_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("transaction/trackEntertainmentCard", payload);

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

            CB && CB(response?.data?.data?.data);

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }

};

export const getFeesAndVat = (payload, CB) => async (dispatch) => {
    dispatch({ type: DT_ONE.GET_FEES_VAT, loading: true});
    try {
        let response = await post(`dtOne/getFeesAndVat`, payload);
        if(response?.data?.error) {
            dispatch({type: DT_ONE.GET_FEES_VAT, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            // handleSuccess(response?.data?.data?.message);
            dispatch({ type: DT_ONE.GET_FEES_VAT, loading: false, data: response?.data?.data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: DT_ONE.GET_FEES_VAT, loading: false});
    }
};
