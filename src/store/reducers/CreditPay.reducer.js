import CREDIT_PAY from "../constants/CreditPay.constant";

const initialState = {
    requestCreditPayLoading: false,
    creditPayEligibility: {},
    checkCreditPayEligibilityLoading: false
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case CREDIT_PAY.CHECK_CREDIT_PAY_ELIGIBILITY:
            return {
                ...state,
                creditPayEligibility: action.data,
                checkCreditPayEligibilityLoading: action.loading,
            };

        case CREDIT_PAY.REQUEST_CREDIT_PAY:
            return {
                ...state,
                requestCreditPayLoading: action.loading,
            };

        default:
            return state;
    }
};
