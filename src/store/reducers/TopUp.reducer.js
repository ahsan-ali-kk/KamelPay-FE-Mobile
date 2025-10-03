import TOP_UP from "../constants/TopUp.constant";

const initialState = {

    mobileCarriersLoading: false,
    mobileCarriers: [],
    getTopUpBeneficiaryLoading: false,
    topUpBeneficiary: [],
    topUpBeneficiaryIsLoadMoreLoading: false,
    topUpBeneficiaryIsLoadMore: true,
    topUpBeneficiaryMetaData: {},
    getFeesAndVatLoading: false,
    feesAndVat: {},

    getTransactionHistoryLoading: false,
    transactionHistoryIsLoadMoreLoading: false,
    transactionHistoryIsLoadMore: true,
    transactionHistoryMetaData: {},
    transactionHistory: [],

    getSingleTransactionHistoryLoading: false,

    topBillers: [],
    getTopBillers: false,

    billersByCountry: [],
    getBillersByCountry: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case TOP_UP.GET_PAYKII_MOBILE_CARRIER_LOOKUP:
            return {...state, mobileCarriersLoading: action.loading, mobileCarriers: action.data };

        case TOP_UP.GET_TOP_UP_BENEFICIARY:
            return {
                ...state,
                getTopUpBeneficiaryLoading: action.loading,
                topUpBeneficiary: action.data,
                topUpBeneficiaryMetaData: action.metaData,
                topUpBeneficiaryIsLoadMore: true,
                topUpBeneficiaryIsLoadMoreLoading: false,
            };

        case TOP_UP.LOAD_MORE_TOP_UP_BENEFICIARY:
            let topUpBeneficiary = [...state.topUpBeneficiary, ...action.data];
            return {
                ...state,
                topUpBeneficiaryIsLoadMoreLoading: action.loading,
                topUpBeneficiary: topUpBeneficiary,
                topUpBeneficiaryMetaData: action.metaData,
                topUpBeneficiaryIsLoadMore: topUpBeneficiary?.length < action?.metaData?.totalDocuments
            };

        case TOP_UP.GET_PAYKII_FEES_VAT:
            return {...state, getFeesAndVatLoading: action.loading, feesAndVat: action.data };


        case TOP_UP.GET_TRANSACTION_HISTORY:
            return {
                ...state,
                getTransactionHistoryLoading: action.loading,
                transactionHistory: action.data,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: true,
                transactionHistoryIsLoadMoreLoading: false,
            };

        case TOP_UP.LOAD_MORE_TRANSACTION_HISTORY:
            let transactionHistory = [...state.transactionHistory, ...action.data];
            return {
                ...state,
                transactionHistory: transactionHistory,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: transactionHistory?.length < action?.metaData?.totalDocuments,
                transactionHistoryIsLoadMoreLoading: action.loading
            };

        case TOP_UP.GET_TOPUP_SINGLE_TRANSACTION_HISTORY:
            return {
                ...state,
                getSingleTransactionHistoryLoading: action.loading
            };

        case TOP_UP.GET_TOPUP_BILLERS:
            return {
                ...state,
                getTopBillers: action.loading,
                topBillers: action.data
            };

        case TOP_UP.GET_BILLERS_BY_COUNTRY:
            return {
                ...state,
                getBillersByCountry: action.loading,
                billersByCountry: action.data
            };

        default:
            return state;
    }
};
