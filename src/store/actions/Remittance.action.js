import REMITTANCE from "../constants/Remittance.constant";
import {encodeQueryData, get, handleError, handleSuccess, post} from "../../utils/methods";

export const getRemittanceBeneficiary = (payload, type) => async (dispatch) => {

    let dispatchType = REMITTANCE.GET_REMITTANCE_BENEFICIARY;

    if(type === 'initial') {
        dispatchType = REMITTANCE.GET_INITIAL_REMITTANCE_BENEFICIARY
    }

    if (payload.page > 1) {
        dispatchType = REMITTANCE.LOAD_MORE_REMITTANCE_BENEFICIARY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("beneficiary/get", payload);
        console.log('response', response)
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

export const getHelloPaisaCountries = (payload, CB) => async (dispatch) => {

    let dispatchType = REMITTANCE.GET_HELLO_PAISA_COUNTRIES;

    if (payload.page > 1) {
        dispatchType = REMITTANCE.LOAD_MORE_HELLO_PAISA_COUNTRIES;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {
        let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

        let response = await get(`hellopaisa/getCountries${queryParams}`);

        if(response?.data?.error) {

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

            handleError(response?.data?.data?.message || '');

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                ...(response?.data?.data?.specialCountries?.length && {specialCountries: response?.data?.data?.specialCountries}),
                metaData: response?.data?.data?.metaData,
            });

            CB && CB(response?.data?.data);

        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false });
    }
};

export const gethelloPaisaRemittanceType = (payload, CB) => async (dispatch) => {
    dispatch({ type: REMITTANCE.GET_HELLO_PAISA_TYPES, loading: true});

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    try {
        let response = await get(`hellopaisa/getType${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: REMITTANCE.GET_HELLO_PAISA_TYPES, loading: false, helloPaisaTypes: [], helloPaisaSpecialBanks: [] });
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data?.data);
            // dispatch({type: REMITTANCE.GET_HELLO_PAISA_TYPES, loading: false, data: response?.data?.data});
            dispatch({
                type: REMITTANCE.GET_HELLO_PAISA_TYPES,
                loading: false,
                helloPaisaTypes: response?.data?.data?.BankType || [],
                helloPaisaSpecialBanks: response?.data?.data?.SpecialBanks || [],
            });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: REMITTANCE.GET_HELLO_PAISA_TYPES, loading: false, helloPaisaTypes: [], helloPaisaSpecialBanks: [] });
    }
};

export const gethelloPaisaBanks = (payload, CB) => async (dispatch) => {

    let dispatchType = REMITTANCE.GET_HELLO_PAISA_BANKS;

    if (payload.page > 1) {
        dispatchType = REMITTANCE.LOAD_MORE_HELLO_PAISA_BANKS;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    try {
        let response = await get(`hellopaisa/getBanks${queryParams}`);

        if(response?.data?.error) {

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

            handleError(response?.data?.data?.message || '');

        } else {

            CB && CB(response?.data?.data);

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });

        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false, data: []});
    }
};
export const gethelloPaisaBankBranches = (payload, CB) => async (dispatch) => {

    let dispatchType = REMITTANCE.GET_HELLO_PAISA_BANK_BRANCHES;

    if (payload.page > 1) {
        dispatchType = REMITTANCE.LOAD_MORE_HELLO_PAISA_BANK_BRANCHES;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    try {
        let response = await get(`hellopaisa/getBranches${queryParams}`);

        if(response?.data?.error) {

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

            handleError(response?.data?.data?.message || '');

        } else {

            CB && CB(response?.data?.data?.data);

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });

        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false, data: []});
    }
};

export const gethelloPaisaCurrencyRate = (payload, CB) => async (dispatch) => {
    dispatch({ type: REMITTANCE.GET_HELLO_PAISA_CURRENCY_RATES, loading: true, data: []});

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    try {
        let response = await get(`hellopaisa/getCurrencyRate${queryParams}`);

        if(response?.data?.error) {
            dispatch({type: REMITTANCE.GET_HELLO_PAISA_CURRENCY_RATES, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data?.data);
            dispatch({type: REMITTANCE.GET_HELLO_PAISA_CURRENCY_RATES, loading: false, data: response?.data?.data});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: REMITTANCE.GET_HELLO_PAISA_CURRENCY_RATES, loading: false, data: [] });
    }
};

// PROCESS_PAYMENT
export const processPayment = (payload, CB) => async (dispatch) => {
    dispatch({ type: REMITTANCE.PROCESS_PAYMENT, loading: true});
    try {
        let response = await post(`hellopaisa/processPayment`, payload, {
            timeout: 120000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        });
        if(response?.data?.error) {
            dispatch({type: REMITTANCE.PROCESS_PAYMENT, loading: false});
        } else {
            dispatch({
                type: REMITTANCE.PROCESS_PAYMENT,
                loading: false,
            });
        }
        CB && CB(response?.data, payload);
    } catch (error) {
        // if(error?.code === "ECONNABORTED" || error?.code === "ERR_NETWORK") {
        // if(error?.code) {
            CB && CB({}, payload, true);
        // } else {
            handleError(error?.data?.error || error?.message, {autoHide: false});
        // }
        dispatch({type: REMITTANCE.PROCESS_PAYMENT, loading: false});
    }
};

export const getTransactionHistory = (payload) => async (dispatch) => {

    let dispatchType = REMITTANCE.GET_TRANSACTION_HISTORY;

    if (payload.page > 1) {
        dispatchType = REMITTANCE.LOAD_MORE_TRANSACTION_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("transaction/trackRemittance", payload);

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

    let dispatchType = REMITTANCE.GET_HELLO_PAISA_SINGLE_TRANSACTION_HISTORY;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post("transaction/trackRemittanceDetails", payload);

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

export const cancelTransaction = (payload, CB) => async (dispatch) => {

    dispatch({ type: REMITTANCE.CANCEL_HELLO_PAISA_TRANSACTION, loading: true});

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    try {
        let response = await get(`hellopaisa/cancelTransaction${queryParams}`);
        if(response?.data?.error) {
            dispatch({type: REMITTANCE.CANCEL_HELLO_PAISA_TRANSACTION, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            dispatch({ type: REMITTANCE.CANCEL_HELLO_PAISA_TRANSACTION, loading: false });
            handleSuccess(response?.data?.data?.message);
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: REMITTANCE.CANCEL_HELLO_PAISA_TRANSACTION, loading: false});
    }

};

export const addBeneficiary = (payload, CB) => async (dispatch) => {

    dispatch({ type: REMITTANCE.ADD_HELLO_PAISA_BENEFICIARY, loading: true});
    try {
        let response = await post("beneficiary/createHellopaisa", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            CB && CB(response?.data);
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data?.data)
        }
        dispatch({type: REMITTANCE.ADD_HELLO_PAISA_BENEFICIARY, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: REMITTANCE.ADD_HELLO_PAISA_BENEFICIARY, loading: false });
    }
};
export const getBankOrBranch = (payload, CB) => async (dispatch) => {
    dispatch({ type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IFSC_CODE, loading: true});
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
    try {
        let response = await get(`hellopaisa/getBranchByIFSC${queryParams}`);
        if(response?.data?.error) {
            CB && CB(response?.data);
            dispatch({type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IFSC_CODE, loading: false});
        } else {
            CB && CB(response?.data?.data);
            dispatch({
                type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IFSC_CODE,
                loading: false,
                data: response?.data?.data?.data
            });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IFSC_CODE, loading: false });
    }
};

export const getBankOrBranchWithIban = (payload, CB) => async (dispatch) => {
    dispatch({ type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IBAN, loading: true});
    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';
    try {
        let response = await get(`hellopaisa/getBranchByIban${queryParams}`);
        if(response?.data?.error) {
            CB && CB(response?.data);
            dispatch({type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IBAN, loading: false});
        } else {
            CB && CB(response?.data?.data);
            dispatch({
                type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IBAN,
                loading: false,
                data: response?.data?.data?.data
            });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IBAN, loading: false });
    }
};
