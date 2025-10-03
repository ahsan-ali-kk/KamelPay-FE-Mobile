import KP_WALLET_TRANSFER_CONSTANT from "../constants/KPWalletTransfer.constant";
import {handleError, handleSuccess, post, encodeQueryData} from "../../utils/methods";

export const getKpWalletTransferBeneficiary = (payload, type) => async (dispatch) => {
    let dispatchType = KP_WALLET_TRANSFER_CONSTANT.GET_KP_WALLET_TRANSFER_BENEFICIARY;
    if (payload.page > 1) {
        dispatchType = dispatchType.LOAD_MORE_KP_WALLET_TRANSFER_BENEFICIARY;
    }
    dispatch({ type: dispatchType, loading: true, data: []});
    try {
        let response = await post("kpWalletBeneficiary/get", payload);
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

export const checkKPWalletTransferEligibility = (payload, CB) => async (dispatch) => {
    const dispatchType = KP_WALLET_TRANSFER_CONSTANT.CHECK_ELIGIBILITY
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("kpWalletTransfer/checkEligibility", payload);
        if(response?.data?.error) {
            // handleError(response?.data?.data?.message || '');
            dispatch({type: dispatchType, loading: false});
        } else {
            let data = response?.data?.data?.data;
            dispatch({type: dispatchType, loading: false, data });
            CB && CB(data, payload);
        }

    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false });
    }
};

export const clearKPWalletTransferEligibility = () => async (dispatch) => {
    dispatch({ type: KP_WALLET_TRANSFER_CONSTANT.CHECK_ELIGIBILITY, data: {}, loading: false});
};

export const findUserByWalletID = (payload, CB) => async (dispatch) => {
    const dispatchType = KP_WALLET_TRANSFER_CONSTANT.FIND_USER
    dispatch({type: dispatchType, loading: true});
    let updatePayload = {...payload};
    delete updatePayload.beneficiaryId;
    delete updatePayload.beneficiaryAlias;
    try {
        let response = await post("kpWalletTransfer/getUserByWallet", updatePayload);
        CB && CB(response?.data, payload);
        dispatch({type: dispatchType, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: dispatchType, loading: false});
    }
};


// PROCESS_PAYMENT
export const kpWalletTransferProcessPayment = (payload, CB) => async (dispatch) => {
    const dispatchType = KP_WALLET_TRANSFER_CONSTANT.PROCESS_PAYMENT
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post(`kpWalletTransfer/processTransfer`, payload, {
            timeout: 120000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        });
        if(response?.data?.error) {
            dispatch({type: dispatchType, loading: false});
        } else {
            dispatch({
                type: dispatchType,
                loading: false,
            });
        }
        CB && CB(response?.data, payload);
    } catch (error) {
        CB && CB({}, payload, true);
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: dispatchType, loading: false});
    }
};


export const kpWalletTransferDeleteBeneficiary = (payload, CB) => async (dispatch) => {
    const dispatchType = KP_WALLET_TRANSFER_CONSTANT.DELETE_BENEFICIARY
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post(`kpWalletBeneficiary/delete`, payload);
        if(response?.data?.error) {
            dispatch({type: dispatchType, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            handleSuccess(response?.data?.data?.message);
            dispatch({ type: dispatchType, loading: false });
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: dispatchType, loading: false});
    }

};

export const kpWalletTransferEditBeneficiary = (payload, CB) => async (dispatch) => {
    const dispatchType = KP_WALLET_TRANSFER_CONSTANT.EDIT_BENEFICIARY
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post(`kpWalletBeneficiary/edit`, payload);
        if(response?.data?.error) {
            dispatch({type: dispatchType, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            handleSuccess(response?.data?.data?.message);
            dispatch({ type: dispatchType, loading: false});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: dispatchType, loading: false});
    }
};

export const getKpWalletTransferHistory = (payload) => async (dispatch) => {
    let dispatchType = KP_WALLET_TRANSFER_CONSTANT.GET_KP_WALLET_TRANSFER_HISTORY;
    if (payload.page > 1) {
        dispatchType = KP_WALLET_TRANSFER_CONSTANT.LOAD_MORE_KP_WALLET_TRANSFER_HISTORY;
    }
    dispatch({ type: dispatchType, loading: true, data: []});
    try {
        let response = await post("kpWalletTransfer/trackWalletTransferHistory", payload);
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

export const getSingleKpWalletTransferHistory = (payload, CB) => async (dispatch) => {
    let dispatchType = KP_WALLET_TRANSFER_CONSTANT.GET_SINGLE_KP_WALLET_TRANSFER_HISTORY;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post("kpWalletTransfer/getWalletTransferDetails", payload);
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
