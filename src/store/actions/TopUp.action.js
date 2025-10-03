import {encodeQueryData, get, handleError, post} from "../../utils/methods";
import TOP_UP from "../constants/TopUp.constant";
import _ from "lodash";
import {store} from "../index";

const getCurrenVendor = () => {
    const {global} = store.getState();
    return global.topupAndBillpaymentCurrentVendor.api
}

export const getMobileCarrierLookup = (payload, CB) => async (dispatch) => {
    let updatedPayload = _.omit(payload, ['AddBeneficiary', 'Alias', 'beneficiaryId']);
    dispatch({ type: TOP_UP.GET_PAYKII_MOBILE_CARRIER_LOOKUP, loading: true});
    try {
        let response = await post(`${getCurrenVendor()}/mobileCarrierLookup`, updatedPayload);
        if(response?.data?.error) {
            dispatch({type: TOP_UP.GET_PAYKII_MOBILE_CARRIER_LOOKUP, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data?.data, payload);
            dispatch({
                type: TOP_UP.GET_PAYKII_MOBILE_CARRIER_LOOKUP,
                loading: false,
                data: !response?.data?.data?.billerFound ? response?.data?.data?.data : []
            });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: TOP_UP.GET_PAYKII_MOBILE_CARRIER_LOOKUP, loading: false, isLoggedIn: false });
    }
};

export const getTopUpBeneficiary = (payload) => async (dispatch) => {

    let dispatchType = TOP_UP.GET_TOP_UP_BENEFICIARY;

    if (payload.page > 1) {
        dispatchType = TOP_UP.LOAD_MORE_TOP_UP_BENEFICIARY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("beneficiary/get", payload);

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

export const getFeesAndVat = (payload, CB) => async (dispatch) => {
    dispatch({ type: TOP_UP.GET_PAYKII_FEES_VAT, loading: true});
    try {
        let response = await post(`${getCurrenVendor()}/getFeesAndVat`, payload);

        if(response?.data?.error) {
            dispatch({type: TOP_UP.GET_PAYKII_FEES_VAT, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            // handleSuccess(response?.data?.data?.message);
            dispatch({ type: TOP_UP.GET_PAYKII_FEES_VAT, loading: false, data: response?.data?.data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: TOP_UP.GET_PAYKII_FEES_VAT, loading: false});
    }
};

export const getTransactionHistory = (payload) => async (dispatch) => {

    let dispatchType = TOP_UP.GET_TRANSACTION_HISTORY;

    if (payload.page > 1) {
        dispatchType = TOP_UP.LOAD_MORE_TRANSACTION_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {
        //transaction/trackTopup //old api path
        let response = await post("transaction/trackBillPaymentAndTopup", payload);

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

export const getSingleTransactionHistory = (payload, CB) => async (dispatch) => {

    let dispatchType = TOP_UP.GET_TOPUP_SINGLE_TRANSACTION_HISTORY;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post("transaction/trackBillPaymentAndTopupDetails", payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({type: dispatchType, loading: false});

        } else {

            dispatch({type: dispatchType, loading: false});
            CB && CB(response?.data?.data)

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: dispatchType, loading: false});

    }
};

export const billerConstant = ['Top-Up', 'Mobile Prepaid', 'Mobile Postpaid'];

export const getPostpaidBillers = (payload, CB) => async (dispatch) => {
    dispatch({ type: TOP_UP.GET_TOPUP_BILLERS, loading: true});
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
    try {
        let response = await get(`${getCurrenVendor()}/getBillersByCountry${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: TOP_UP.GET_TOPUP_BILLERS, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            let data = response?.data?.data?.filter(o => billerConstant?.includes(o?._id));
            console.log('data', JSON.stringify(data));
            dispatch({type: TOP_UP.GET_TOPUP_BILLERS, data: data?.length ? data : [], loading: false});
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: TOP_UP.GET_TOPUP_BILLERS, loading: false, isLoggedIn: false });
    }
};

const billersByCountryConstant = ['Mobile Postpaid'];
export const getBillersByCountry = (payload, CB) => async (dispatch) => {
    dispatch({ type: TOP_UP.GET_BILLERS_BY_COUNTRY, loading: true});
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
    try {
        let response = await get(`${getCurrenVendor()}/getBillersByCountry${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: TOP_UP.GET_BILLERS_BY_COUNTRY, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            let data = response?.data?.data?.filter(o => billersByCountryConstant?.includes(o?._id));
            dispatch({type: TOP_UP.GET_BILLERS_BY_COUNTRY, data: data?.length ? data[0] : [], loading: false});
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: TOP_UP.GET_BILLERS_BY_COUNTRY, loading: false, isLoggedIn: false });
    }
};
