import PERSONAL_FINANCE from "../constants/PersonalLoan.constant";

const initialState = {
    requestLoading: false,
    verifyLoading: false,
    getPersonalLoanPromoCodeAndOfferLoading: false,
    personalLoanPromoCodeAndOffer: {},
    personalLoanEligibility: {},
    checkPersonalLoanEligibilityLoading: false,

    getPersonalLoanTransactionHistoryLoading: false,
    personalLoanTransactionHistoryIsLoadMoreLoading: false,
    personalLoanTransactionHistoryIsLoadMore: true,
    personalLoanTransactionHistoryMetaData: {},
    personalLoanTransactionHistory: [],

    getSinglePersonalLoanTransactionHistoryLoading: false,

    checkPreEligibilityLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_ELIGIBILITY:
            return {
                ...state,
                personalLoanEligibility: action.data,
                checkPersonalLoanEligibilityLoading: action.loading,
            };

        case PERSONAL_FINANCE.REQUEST_PERSONAL_FINANCE:
            return {
                ...state,
                requestLoading: action.loading,
            };

        case PERSONAL_FINANCE.VERIFY_PERSONAL_FINANCE:
            return {
                ...state,
                verifyLoading: action.loading,
            };
        case PERSONAL_FINANCE.GET_PERSONAL_FINANCE_PROMO_CODE_AND_OFFER:
            return {
                ...state,
                getPersonalLoanPromoCodeAndOfferLoading: action.loading,
                personalLoanPromoCodeAndOffer: action.data,
            };

        case PERSONAL_FINANCE.GET_PERSONAL_FINANCE_TRANSACTION_HISTORY:
            return {
                ...state,
                getPersonalLoanTransactionHistoryLoading: action.loading,
                personalLoanTransactionHistory: action.data,
                personalLoanTransactionHistoryMetaData: action.metaData,
                personalLoanTransactionHistoryIsLoadMore: true,
                personalLoanTransactionHistoryIsLoadMoreLoading: false,
            };

        case PERSONAL_FINANCE.LOAD_MORE_PERSONAL_FINANCE_TRANSACTION_HISTORY:
            let personalLoanTransactionHistory = [...state.personalLoanTransactionHistory, ...action.data];
            return {
                ...state,
                personalLoanTransactionHistory: personalLoanTransactionHistory,
                personalLoanTransactionHistoryMetaData: action.metaData,
                personalLoanTransactionHistoryIsLoadMore: personalLoanTransactionHistory?.length < action?.metaData?.totalDocuments,
                personalLoanTransactionHistoryIsLoadMoreLoading: action.loading
            };

        case PERSONAL_FINANCE.GET_PERSONAL_FINANCE_SINGLE_TRANSACTION_HISTORY:
            return {
                ...state,
                getSinglePersonalLoanTransactionHistoryLoading: action.loading
            };

        case PERSONAL_FINANCE.CHECK_PERSONAL_FINANCE_PRE_ELIGIBILITY:
            return {
                ...state,
                checkPreEligibilityLoading: action.loading
            };


        default:
            return state;
    }
};
