import DT_ONE from "../constants/DtOne.constant";

const initialState = {

    getCardsLoading: false,
    cards: [],
    cardsIsLoadMoreLoading: false,
    cardsIsLoadMore: true,
    cardsMetaData: {},

    processPaymentLoading: false,

    getHistoryLoading: false,
    history: [],
    historyIsLoadMoreLoading: false,
    historyIsLoadMore: true,
    historyMetaData: {},
    getFeesAndVatLoading: false,
    feesAndVat: {},

};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case DT_ONE.GET_CARDS:
            return {
                ...state,
                getCardsLoading: action.loading,
                cards: action.data,
                cardsMetaData: action.metaData,
                cardsIsLoadMore: true,
                cardsIsLoadMoreLoading: false,
            };

        case DT_ONE.LOAD_MORE_GET_CARDS:
            let cards = [...state.cards, ...action.data];
            return {
                ...state,
                cardsIsLoadMoreLoading: action.loading,
                cards: cards,
                cardsMetaData: action.metaData,
                cardsIsLoadMore: cards?.length < action?.metaData?.totalDocuments
            };

        case DT_ONE.PROCESS_PAYMENT:
            return { ...state, processPaymentLoading: action.loading };

        case DT_ONE.TRACK_HISTORY:
            return {
                ...state,
                getHistoryLoading: action.loading,
                history: action.data,
                historyMetaData: action.metaData,
                historyIsLoadMore: true,
                historyIsLoadMoreLoading: false,
            };

        case DT_ONE.LOAD_MORE_TRACK_HISTORY:
            let history = [...state.history, ...action.data];
            return {
                ...state,
                historyIsLoadMoreLoading: action.loading,
                history: history,
                historyMetaData: action.metaData,
                historyIsLoadMore: history?.length < action?.metaData?.totalDocuments
            };
        case DT_ONE.GET_FEES_VAT:
            return {...state, getFeesAndVatLoading: action.loading, feesAndVat: action.data };

        default:
            return state;
    }
};
