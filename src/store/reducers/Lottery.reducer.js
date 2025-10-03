import LOTTERY from "../constants/Lottery.constant";

const initialState = {
    getHistoryLoading: false,
    historyIsLoadMoreLoading: false,
    historyIsLoadMore: true,
    historyMetaData: {},
    history: [],
    getCampaignsLoading: false,
    campaigns: [],
    processPaymentLoading: false,
    singleCampaignLoading: false,
    singleCampaign: {},
    getFeesAndVatLoading: false,
    feesAndVat: {},
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case LOTTERY.GET_CAMPAIGNS:
            return {
                ...state,
                getCampaignsLoading: action.loading,
                campaigns: action.data,
            };

        case LOTTERY.GET_HISTORY:
            return {
                ...state,
                getHistoryLoading: action.loading,
                history: action.data,
                historyMetaData: action.metaData,
                historyIsLoadMore: true,
                historyIsLoadMoreLoading: false,
            };

        case LOTTERY.LOAD_MORE_HISTORY:
            let history = [...state.history, ...action.data];
            return {
                ...state,
                history: history,
                historyMetaData: action.metaData,
                historyIsLoadMore: history?.length < action?.metaData?.totalDocuments,
                historyIsLoadMoreLoading: action.loading
            };

        case LOTTERY.PROCESS_PAYMENT:
            return {
                ...state,
                processPaymentLoading: action.loading,
            };

        case LOTTERY.GET_SINGLE_CAMPAIGN:
            return {
                ...state,
                singleCampaignLoading: action.loading,
                singleCampaign: action.data,
            };

        case LOTTERY.GET_LOTTERY_FEES_VAT:
            return {...state, getFeesAndVatLoading: action.loading, feesAndVat: action.data };

        default:
            return state;
    }
};
