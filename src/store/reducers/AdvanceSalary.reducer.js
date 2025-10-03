import ADVANCE_SALARY from "../constants/AdvanceSalary.constant";

const initialState = {
    requestLoading: false,
    verifyLoading: false,
    getPromoCodeAndOfferLoading: false,
    promoCodeAndOffer: {},
    advanceSalaryEligibility: {},
    checkAdvanceSalaryEligibilityLoading: false,

    getAdvanceSalaryTransactionHistoryLoading: false,
    advanceSalaryTransactionHistoryIsLoadMoreLoading: false,
    advanceSalaryTransactionHistoryIsLoadMore: true,
    advanceSalaryTransactionHistoryMetaData: {},
    advanceSalaryTransactionHistory: [],

    getSingleAdvanceSalaryTransactionHistoryLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case ADVANCE_SALARY.CHECK_ADVANCE_SALARY_ELIGIBILITY:
            return {
                ...state,
                advanceSalaryEligibility: action.data,
                checkAdvanceSalaryEligibilityLoading: action.loading,
            };

        case ADVANCE_SALARY.REQUEST_ADVANCE_SALARY:
            return {
                ...state,
                requestLoading: action.loading,
            };

        case ADVANCE_SALARY.VERIFY_ADVANCE_SALARY:
            return {
                ...state,
                verifyLoading: action.loading,
            };
        case ADVANCE_SALARY.GET_PROMO_CODE_AND_OFFER:
            return {
                ...state,
                getPromoCodeAndOfferLoading: action.loading,
                promoCodeAndOffer: action.data,
            };

        case ADVANCE_SALARY.GET_ADVANCE_SALARY_TRANSACTION_HISTORY:
            return {
                ...state,
                getAdvanceSalaryTransactionHistoryLoading: action.loading,
                advanceSalaryTransactionHistory: action.data,
                advanceSalaryTransactionHistoryMetaData: action.metaData,
                advanceSalaryTransactionHistoryIsLoadMore: true,
                advanceSalaryTransactionHistoryIsLoadMoreLoading: false,
            };

        case ADVANCE_SALARY.LOAD_MORE_ADVANCE_SALARY_TRANSACTION_HISTORY:
            let advanceSalaryTransactionHistory = [...state.advanceSalaryTransactionHistory, ...action.data];
            return {
                ...state,
                advanceSalaryTransactionHistory: advanceSalaryTransactionHistory,
                advanceSalaryTransactionHistoryMetaData: action.metaData,
                advanceSalaryTransactionHistoryIsLoadMore: advanceSalaryTransactionHistory?.length < action?.metaData?.totalDocuments,
                advanceSalaryTransactionHistoryIsLoadMoreLoading: action.loading
            };

        case ADVANCE_SALARY.GET_ADVANCE_SALARY_SINGLE_TRANSACTION_HISTORY:
            return {
                ...state,
                getSingleAdvanceSalaryTransactionHistoryLoading: action.loading
            };


        default:
            return state;
    }
};
