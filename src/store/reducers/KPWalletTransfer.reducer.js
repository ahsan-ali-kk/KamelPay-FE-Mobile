import KP_WALLET_TRANSFER_CONSTANT from "../constants/KPWalletTransfer.constant";

const initialState = {
    eligibility: {},
    checkEligibilityLoading: false,

    getKpWalletTransferBeneficiaryLoading: false,
    kpWalletTransferBeneficiaryIsLoadMoreLoading: false,
    kpWalletTransferBeneficiaryIsLoadMore: true,
    kpWalletTransferBeneficiaryMetaData: {},
    kpWalletTransferBeneficiary: [],

    findUserByWalletIDLoading: false,
    processPaymentLoading: false,

    editBeneficiaryLoading: false,
    deleteBeneficiaryLoading: false,

    getTransactionHistoryLoading: false,
    transactionHistoryIsLoadMoreLoading: false,
    transactionHistoryIsLoadMore: true,
    transactionHistoryMetaData: {},
    transactionHistory: [],
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
         case KP_WALLET_TRANSFER_CONSTANT.GET_KP_WALLET_TRANSFER_BENEFICIARY:
            return {
                ...state,
                getKpWalletTransferBeneficiaryLoading: action.loading,
                kpWalletTransferBeneficiary: action.data,
                kpWalletTransferBeneficiaryMetaData: action.metaData,
                kpWalletTransferBeneficiaryIsLoadMore: true,
                kpWalletTransferBeneficiaryIsLoadMoreLoading: false,
            };
        case KP_WALLET_TRANSFER_CONSTANT.LOAD_MORE_KP_WALLET_TRANSFER_BENEFICIARY:
            let kpWalletTransferBeneficiary = [...state.kpWalletTransferBeneficiary, ...action.data];
            return {
                ...state,
                kpWalletTransferBeneficiaryIsLoadMoreLoading: action.loading,
                kpWalletTransferBeneficiary: kpWalletTransferBeneficiary,
                kpWalletTransferBeneficiaryMetaData: action.metaData,
                kpWalletTransferBeneficiaryIsLoadMore: kpWalletTransferBeneficiary?.length < action?.metaData?.totalDocuments
            };

        case KP_WALLET_TRANSFER_CONSTANT.CHECK_ELIGIBILITY:
            return {
                ...state,
                eligibility: action.data,
                checkEligibilityLoading: action.loading,
            };

        case KP_WALLET_TRANSFER_CONSTANT.FIND_USER:
            return { ...state, findUserByWalletIDLoading: action.loading };

        case KP_WALLET_TRANSFER_CONSTANT.PROCESS_PAYMENT:
            return { ...state, processPaymentLoading: action.loading };

        case KP_WALLET_TRANSFER_CONSTANT.EDIT_BENEFICIARY:
            return { ...state, editBeneficiaryLoading: action.loading };
        case KP_WALLET_TRANSFER_CONSTANT.DELETE_BENEFICIARY:
            return { ...state, deleteBeneficiaryLoading: action.loading };


        case KP_WALLET_TRANSFER_CONSTANT.GET_KP_WALLET_TRANSFER_HISTORY:
            return {
                ...state,
                getTransactionHistoryLoading: action.loading,
                transactionHistory: action.data,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: true,
                transactionHistoryIsLoadMoreLoading: false,
            };

        case KP_WALLET_TRANSFER_CONSTANT.LOAD_MORE_KP_WALLET_TRANSFER_HISTORY:
            let transactionHistory = [...state.transactionHistory, ...action.data];
            return {
                ...state,
                transactionHistory: transactionHistory,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: transactionHistory?.length < action?.metaData?.totalDocuments,
                transactionHistoryIsLoadMoreLoading: action.loading
            };

        case KP_WALLET_TRANSFER_CONSTANT.GET_SINGLE_KP_WALLET_TRANSFER_HISTORY:
            return {
                ...state,
                getSingleTransactionHistoryLoading: action.loading
            };
        default:
            return state;
    }
};
