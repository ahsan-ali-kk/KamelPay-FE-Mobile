import ADVANCE_SALARY from "../constants/AdvanceSalary.constant";
import {handleError, post} from "../../utils/methods";

export const checkAdvanceSalaryEligibility = (payload, CB) => async (dispatch) => {
    dispatch({ type: ADVANCE_SALARY.CHECK_ADVANCE_SALARY_ELIGIBILITY, loading: true});
    try {
        let response = await post("advanceSalary/checkAdvanceSalaryEligibility", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: ADVANCE_SALARY.CHECK_ADVANCE_SALARY_ELIGIBILITY, loading: false});
        } else {
            let data = response?.data?.data;
            dispatch({type: ADVANCE_SALARY.CHECK_ADVANCE_SALARY_ELIGIBILITY, loading: false, data });
            CB && CB(data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: ADVANCE_SALARY.CHECK_ADVANCE_SALARY_ELIGIBILITY, loading: false });
    }
};

export const clearAdvanceSalaryEligibility = () => async (dispatch) => {
    dispatch({ type: ADVANCE_SALARY.CHECK_ADVANCE_SALARY_ELIGIBILITY, data: {}, loading: false});
};

export const requestAdvanceSalary = (payload, CB) => async (dispatch) => {
    dispatch({ type: ADVANCE_SALARY.REQUEST_ADVANCE_SALARY, loading: true});
    try {
        let response = await post("advanceSalary/requestAdvanceSalary", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data);
        }
        dispatch({type: ADVANCE_SALARY.REQUEST_ADVANCE_SALARY, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: ADVANCE_SALARY.REQUEST_ADVANCE_SALARY, loading: false });
    }
};

export const verifyAdvanceSalary = (payload, cardId, CB) => async (dispatch) => {
    dispatch({ type: ADVANCE_SALARY.VERIFY_ADVANCE_SALARY, loading: true});
    try {
        let response = await post("advanceSalary/verifyAdvanceSalary", payload);
        CB && CB(response?.data);
        dispatch({type: ADVANCE_SALARY.VERIFY_ADVANCE_SALARY, loading: false});
        if(response?.data?.error) {
        } else {
            dispatch(checkAdvanceSalaryEligibility({cardId}))
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: ADVANCE_SALARY.VERIFY_ADVANCE_SALARY, loading: false });
    }
};

export const getPromoAndOffer = (payload, CB) => async (dispatch) => {
    dispatch({ type: ADVANCE_SALARY.GET_PROMO_CODE_AND_OFFER, loading: true});
    try {
        let response = await post(`advanceSalary/applyPromocodeAndOffer`, payload);
        if(response?.data?.error) {
            dispatch({type: ADVANCE_SALARY.GET_PROMO_CODE_AND_OFFER, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            let data = response?.data?.data;
            dispatch({
                type: ADVANCE_SALARY.GET_PROMO_CODE_AND_OFFER,
                data: data,
                loading: false
            });
        }
        CB && CB(response?.data)
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: ADVANCE_SALARY.GET_PROMO_CODE_AND_OFFER, loading: false });
    }
};

export const getTransactionHistory = (payload) => async (dispatch) => {

    let dispatchType = ADVANCE_SALARY.GET_ADVANCE_SALARY_TRANSACTION_HISTORY;

    if (payload.page > 1) {
        dispatchType = ADVANCE_SALARY.LOAD_MORE_ADVANCE_SALARY_TRANSACTION_HISTORY;
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

    let dispatchType = ADVANCE_SALARY.GET_ADVANCE_SALARY_SINGLE_TRANSACTION_HISTORY;

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
