import TRANSACTION_HISTORY from "../constants/TransactionHistory.constant";
import {handleError, handleSuccess, post} from "../../utils/methods";

export const getTransaction = (payload, type) => async (dispatch) => {

    let dispatchType = TRANSACTION_HISTORY.GET_TRANSACTION_HISTORY;

    if(type === 'initial') {
        dispatchType = TRANSACTION_HISTORY.GET_INITIAL_TRANSACTION_HISTORY
    }

    if (payload.page > 1) {
        dispatchType = TRANSACTION_HISTORY.LOAD_MORE_TRANSACTION_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: [], metaData: {}});

    try {

        let response = await post("transaction/get", payload);

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

export const uploadReceipt = (payload, CB) => async (dispatch) => {
    dispatch({ type: TRANSACTION_HISTORY.UPLOAD_RECEIPT, loading: true});
    try {
        let response = await post("transaction/uploadSlip", payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        });
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data);
        }
        dispatch({type: TRANSACTION_HISTORY.UPLOAD_RECEIPT, loading: false});
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: TRANSACTION_HISTORY.UPLOAD_RECEIPT, loading: false });
    }
};


export const getSingleTransaction = (payload) => async (dispatch) => {
    dispatch({ type: TRANSACTION_HISTORY.GET_SINGLE_TRANSACTION, loading: true});
    try {
        let response = await post("transaction/getById", payload);
        console.log('response', response)
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: TRANSACTION_HISTORY.GET_SINGLE_TRANSACTION, loading: false});

        } else {
            dispatch({type: TRANSACTION_HISTORY.GET_SINGLE_TRANSACTION, loading: false, data: response?.data?.data?.transaction});
        }
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: TRANSACTION_HISTORY.GET_SINGLE_TRANSACTION, loading: false });
    }
};


export const addTransactionNote = (payload, CB) => async (dispatch) => {
    dispatch({ type: TRANSACTION_HISTORY.ADD_TRANSACTION_NOTE, loading: true});
    try {
        let response = await post("transaction/addNote", payload);
        console.log('payload', payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB();
        }
        dispatch({type: TRANSACTION_HISTORY.ADD_TRANSACTION_NOTE, loading: false});
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: TRANSACTION_HISTORY.ADD_TRANSACTION_NOTE, loading: false });
    }
};
export const syncTransaction = (payload, CB) => async (dispatch) => {
    dispatch({ type: TRANSACTION_HISTORY.SYNC_TRANSACTION, loading: true});
    try {
        let response = await post("transaction/checkTransactionSync", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            // handleSuccess(response?.data?.data?.message);
            CB && CB();
        }
        dispatch({type: TRANSACTION_HISTORY.SYNC_TRANSACTION, loading: false});
    } catch (error) {
        console.log('error', error);
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: TRANSACTION_HISTORY.SYNC_TRANSACTION, loading: false });
    }
};
