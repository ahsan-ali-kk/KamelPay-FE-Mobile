import TRANSACTION_HISTORY from "../constants/TransactionHistory.constant";

const initialState = {
    loading: false,
    isLoadMoreLoading: false,
    isLoadMore: true,
    data: [],
    initialData: [],
    metaData: {},
    uploadReceiptLoading: false,
    getSingleTransactionLoading: false,
    transaction: {},
    addTransactionNoteLoading: false,
    syncTransactionLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case TRANSACTION_HISTORY.GET_TRANSACTION_HISTORY:
            return {
                ...state,
                loading: action.loading,
                data: action.data,
                metaData: action.metaData,
                isLoadMore: true,
                isLoadMoreLoading: false,
            };

        case TRANSACTION_HISTORY.GET_INITIAL_TRANSACTION_HISTORY:
            return {
                ...state,
                loading: action.loading,
                initialData: action.data,
            };

        case TRANSACTION_HISTORY.LOAD_MORE_TRANSACTION_HISTORY:
            let data = [...state.data, ...action.data];
            return {
                ...state,
                isLoadMoreLoading: action.loading,
                data: data,
                metaData: action.metaData,
                isLoadMore: data?.length < action?.metaData?.totalDocuments
            };

         case TRANSACTION_HISTORY.UPLOAD_RECEIPT:
            return {
                ...state,
                uploadReceiptLoading: action.loading,
            };

        case TRANSACTION_HISTORY.ADD_TRANSACTION_NOTE:
            return {
                ...state,
                addTransactionNoteLoading: action.loading,
            };

        case TRANSACTION_HISTORY.SYNC_TRANSACTION:
            return {
                ...state,
                syncTransactionLoading: action.loading,
            };

        case TRANSACTION_HISTORY.GET_SINGLE_TRANSACTION:
            return {
                ...state,
                getSingleTransactionLoading: action.loading,
                transaction: action.data,
            };

        default:
            return state;
    }
};
