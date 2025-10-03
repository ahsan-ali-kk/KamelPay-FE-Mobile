import {handleError, get, post, encodeQueryData} from "../../utils/methods";
import PAY_BILL from "../constants/PayBill.constant";
import _ from "lodash";
import {store} from "../index";

const getCurrenVendor = () => {
    const {global} = store.getState();
    return global.topupAndBillpaymentCurrentVendor.api
}

export const getBillersByCountry = (payload, CB) => async (dispatch) => {
    dispatch({ type: PAY_BILL.GET_PAYKII_BILLERS, loading: true});
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
    try {
        let response = await get(`${getCurrenVendor()}/getBillersByCountry${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: PAY_BILL.GET_PAYKII_BILLERS, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data?.data);
            console.log('response?.data', response?.data)
            dispatch({type: PAY_BILL.GET_PAYKII_BILLERS, loading: false, data: response?.data?.data});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PAY_BILL.GET_PAYKII_BILLERS, loading: false, isLoggedIn: false });
    }
};

export const getSKUOfBiller = (biller, search, CB) => async (dispatch) => {
    dispatch({ type: PAY_BILL.GET_PAYKII_BILLER_SKU, loading: true});
    let payload = {
        BillerID: biller?.BillerID,
        ...(search && { search: search }),
    };
    try {
        let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
        let response = await get(`${getCurrenVendor()}/getSKUOfBiller${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: PAY_BILL.GET_PAYKII_BILLER_SKU, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            let sku = response?.data?.data?.sku;
            let io = response?.data?.data.io;
            dispatch({
                type: PAY_BILL.GET_PAYKII_BILLER_SKU,
                loading: false,
                sku: sku,
                io: io,
            });
            CB && CB({biller, sku, io});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PAY_BILL.GET_PAYKII_BILLER_SKU, loading: false, isLoggedIn: false });
    }
};

export const getBillerSkuIo = (payload, CB) => async (dispatch) => {
    dispatch({ type: PAY_BILL.GET_PAYKII_BILLER_SKU_IO, loading: true});
    try {
        let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
        let response = await get(`${getCurrenVendor()}/getIOOfBiller${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: PAY_BILL.GET_PAYKII_BILLER_SKU_IO, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            console.log('getBillerSkuIo response?.data?.data', response?.data?.data)
            dispatch({
                type: PAY_BILL.GET_PAYKII_BILLER_SKU_IO,
                loading: false,
                data: response?.data?.data || [],
            });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PAY_BILL.GET_PAYKII_BILLER_SKU_IO, loading: false, isLoggedIn: false });
    }
};

export const clearBillerSkuIo = () => async (dispatch) => {
    dispatch({ type: PAY_BILL.GET_PAYKII_BILLER_SKU_IO, data: [], loading: false});
};

export const checkAmountBiller = (payload, CB) => async (dispatch) => {
    let updatedPayload = _.omit(payload, ['AddBeneficiary', 'Alias', 'type', 'beneficiaryId']);
    dispatch({ type: PAY_BILL.PAYKII_BILLER_CHECK_AMOUNT_DETAILS, loading: true});
    try {
        let response = await post(`${getCurrenVendor()}/checkAmountDetails`, updatedPayload);
        if(response?.data?.error) {
            dispatch({type: PAY_BILL.PAYKII_BILLER_CHECK_AMOUNT_DETAILS, loading: false});
            if(response?.data?.data?.message === "Invalid reference") {
                CB && CB(response?.data?.data, payload, true);
            } else {
                handleError(response?.data?.data?.message || '');
            }
        } else {
            CB && CB(response?.data?.data, payload);
            dispatch({
                type: PAY_BILL.PAYKII_BILLER_CHECK_AMOUNT_DETAILS,
                loading: false,
            });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: PAY_BILL.PAYKII_BILLER_CHECK_AMOUNT_DETAILS, loading: false});
    }
};

export const processPayment = (payload, CB, headers) => async (dispatch) => {
    dispatch({ type: PAY_BILL.PAYKII_PROCESS_PAYMENT, loading: true});
    try {
        let response = await post(`${getCurrenVendor()}/processPayment`, payload, {
            headers: headers
        });
        if(response?.data?.error) {
            dispatch({type: PAY_BILL.PAYKII_PROCESS_PAYMENT, loading: false});
        } else {
            dispatch({
                type: PAY_BILL.PAYKII_PROCESS_PAYMENT,
                loading: false,
            });
        }
        CB && CB(response?.data, payload);
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: PAY_BILL.PAYKII_PROCESS_PAYMENT, loading: false});
    }
};

export const getPayBillBeneficiary = (payload) => async (dispatch) => {

    let dispatchType = PAY_BILL.GET_PAY_BILL_BENEFICIARY;

    if (payload.page > 1) {
        dispatchType = PAY_BILL.LOAD_MORE_PAY_BILL_BENEFICIARY;
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
    dispatch({ type: PAY_BILL.GET_PAYKII_FEES_VAT, loading: true});
    try {
        let response = await post(`${getCurrenVendor()}/getFeesAndVat`, payload);
        if(response?.data?.error) {
            dispatch({type: PAY_BILL.GET_PAYKII_FEES_VAT, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            dispatch({ type: PAY_BILL.GET_PAYKII_FEES_VAT, loading: false, data: response?.data?.data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: PAY_BILL.GET_PAYKII_FEES_VAT, loading: false});
    }
};

export const getTransactionHistory = (payload) => async (dispatch) => {

    let dispatchType = PAY_BILL.GET_TRANSACTION_HISTORY;

    if (payload.page > 1) {
        dispatchType = PAY_BILL.LOAD_MORE_TRANSACTION_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("transaction/trackBillPayment", payload);

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

    let dispatchType = PAY_BILL.GET_PAY_BILL_SINGLE_TRANSACTION_HISTORY;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post("transaction/trackBillPaymentDetails", payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({type: dispatchType, loading: false});

        } else {

            dispatch({type: dispatchType, loading: false});
            CB && CB(response?.data?.data)

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};
