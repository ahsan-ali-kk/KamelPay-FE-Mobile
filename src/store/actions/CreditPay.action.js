import CREDIT_PAY from "../constants/CreditPay.constant";
import {handleError, post} from "../../utils/methods";

export const checkCreditPayEligibility = (payload, CB) => async (dispatch) => {
    dispatch({ type: CREDIT_PAY.CHECK_CREDIT_PAY_ELIGIBILITY, loading: true});
    try {
        let response = await post("advanceSalary/checkEFEligibility", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: CREDIT_PAY.CHECK_CREDIT_PAY_ELIGIBILITY, loading: false});
        } else {
            let data = response?.data?.data;
            dispatch({type: CREDIT_PAY.CHECK_CREDIT_PAY_ELIGIBILITY, loading: false, data });
            CB && CB(data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CREDIT_PAY.CHECK_CREDIT_PAY_ELIGIBILITY, loading: false });
    }
};

export const clearCreditPayEligibility = () => async (dispatch) => {
    dispatch({ type: CREDIT_PAY.CHECK_CREDIT_PAY_ELIGIBILITY, data:{}, loading: false});
};


export const requestCreditPay = (payload, CB) => async (dispatch) => {
    dispatch({ type: CREDIT_PAY.REQUEST_CREDIT_PAY, loading: true});
    try {
        let response = await post("advanceSalary/requestEmbeddedFinance", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            CB && CB(response?.data);
        }
        dispatch({type: CREDIT_PAY.REQUEST_CREDIT_PAY, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: CREDIT_PAY.REQUEST_CREDIT_PAY, loading: false });
    }
};
