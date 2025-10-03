import PERSONAL_FINANCE from "../constants/PersonalLoan.constant";
import {handleError, post} from "../../utils/methods";

export const checkPersonalLoanEligibility = (payload, CB) => async (dispatch) => {
    dispatch({ type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_ELIGIBILITY, loading: true});
    try {
        let response = await post("advanceSalary/checkPLEligibility", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_ELIGIBILITY, loading: false});
        } else {
            let data = response?.data?.data;
            dispatch({type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_ELIGIBILITY, loading: false, data });
            CB && CB(data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_ELIGIBILITY, loading: false });
    }
};


export const checkPersonalFinancePreEligibility = (payload, CB) => async (dispatch) => {
    dispatch({ type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_PRE_ELIGIBILITY, loading: true});
    try {
        let response = await post("advanceSalary/checkPersonalFinancePreEligibility", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_PRE_ELIGIBILITY, loading: false});
        } else {
            let data = response?.data?.data;
            dispatch({type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_PRE_ELIGIBILITY, loading: false });
            CB && CB(data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_PRE_ELIGIBILITY, loading: false });
    }
};

export const clearPersonalLoanEligibility = () => async (dispatch) => {
    dispatch({ type: PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_ELIGIBILITY, data: {}, loading: false});
};

export const requestPersonalLoan = (payload, CB, headers) => async (dispatch) => {
    dispatch({ type: PERSONAL_FINANCE.REQUEST_PERSONAL_FINANCE, loading: true});
    try {
        let response = await post("advanceSalary/requestPersonalLoan", payload, {
            headers: headers
        });
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data);
        }
        dispatch({type: PERSONAL_FINANCE.REQUEST_PERSONAL_FINANCE, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PERSONAL_FINANCE.REQUEST_PERSONAL_FINANCE, loading: false });
    }
};

export const verifyPersonalLoan = (payload, cardId, CB) => async (dispatch) => {
    dispatch({ type: PERSONAL_FINANCE.VERIFY_PERSONAL_FINANCE, loading: true});
    try {
        let response = await post("advanceSalary/verifyPersonalLoan", payload);
        CB && CB(response?.data);
        dispatch({type: PERSONAL_FINANCE.VERIFY_PERSONAL_FINANCE, loading: false});
        if(response?.data?.error) {
        } else {
            dispatch(checkPersonalLoanEligibility({cardId}))
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PERSONAL_FINANCE.VERIFY_PERSONAL_FINANCE, loading: false });
    }
};

export const getPersonalLoanPromoAndOffer = (payload, CB) => async (dispatch) => {
    dispatch({ type: PERSONAL_FINANCE.GET_PERSONAL_FINANCE_PROMO_CODE_AND_OFFER, loading: true});
    try {
        let response = await post(`advanceSalary/applyPromocodeAndOffer`, payload);
        if(response?.data?.error) {
            dispatch({type: PERSONAL_FINANCE.GET_PERSONAL_FINANCE_PROMO_CODE_AND_OFFER, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            let data = response?.data?.data;
            dispatch({
                type: PERSONAL_FINANCE.GET_PERSONAL_FINANCE_PROMO_CODE_AND_OFFER,
                data: data,
                loading: false
            });
        }
        CB && CB(response?.data)
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: PERSONAL_FINANCE.GET_PERSONAL_FINANCE_PROMO_CODE_AND_OFFER, loading: false });
    }
};

export const getTransactionHistory = (payload) => async (dispatch) => {

    let dispatchType = PERSONAL_FINANCE.GET_PERSONAL_FINANCE_TRANSACTION_HISTORY;

    if (payload.page > 1) {
        dispatchType = PERSONAL_FINANCE.LOAD_MORE_PERSONAL_FINANCE_TRANSACTION_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("advanceSalary/trackAdvanceSalary", payload);

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

    let dispatchType = PERSONAL_FINANCE.GET_PERSONAL_FINANCE_SINGLE_TRANSACTION_HISTORY;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post("advanceSalary/advanceSalaryDetails", payload);

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
