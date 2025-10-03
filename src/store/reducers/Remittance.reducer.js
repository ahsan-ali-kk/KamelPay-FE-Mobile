import REMITTANCE from "../constants/Remittance.constant";

const initialState = {

    helloPaisaCountriesLoading: false,
    helloPaisaCountries: [],
    helloPaisaSpecialCountries: [],
    helloPaisaCountriesMetaData: {},
    helloPaisaCountriesIsLoadMoreLoading: false,
    helloPaisaCountriesIsLoadMore: true,

    helloPaisaTypes: [],
    helloPaisaSpecialBanks: [],
    helloPaisaTypesLoading: false,

    helloPaisaBanksLoading: false,
    helloPaisaBanks: [],
    helloPaisaBanksMetaData: {},
    helloPaisaBanksIsLoadMoreLoading: false,
    helloPaisaBanksIsLoadMore: true,

    helloPaisaBankBranches: [],
    helloPaisaBankBranchesLoading: false,
    helloPaisaBankBranchesMetaData: {},
    helloPaisaBankBranchesIsLoadMoreLoading: false,
    helloPaisaBankBranchesIsLoadMore: true,

    helloPaisaGetCurrencyLoading: false,
    helloPaisaGetCurrency: {},

    getRemittanceBeneficiaryLoading: false,
    remittanceBeneficiaryIsLoadMoreLoading: false,
    remittanceBeneficiaryIsLoadMore: true,
    remittanceBeneficiaryMetaData: {},
    remittanceBeneficiary: [],
    remittanceInitialBeneficiary: [],

    processPaymentLoading: false,

    getTransactionHistoryLoading: false,
    transactionHistoryIsLoadMoreLoading: false,
    transactionHistoryIsLoadMore: true,
    transactionHistoryMetaData: {},
    transactionHistory: [],

    getSingleTransactionHistoryLoading: false,

    cancelTransaction: false,

    addBeneficiaryLoading: false,

    bankAndBranch: {},
    getBankAndBranchLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case REMITTANCE.GET_HELLO_PAISA_COUNTRIES:
            return {
                ...state,
                helloPaisaCountriesLoading: action.loading,
                helloPaisaCountries: action.data,
                helloPaisaSpecialCountries: action.specialCountries,
                helloPaisaCountriesMetaData: action.metaData,
                helloPaisaCountriesIsLoadMore: true,
                helloPaisaCountriesIsLoadMoreLoading: false,
            };
        case REMITTANCE.LOAD_MORE_HELLO_PAISA_COUNTRIES:

            let helloPaisaCountries = [...state.helloPaisaCountries, ...action.data];

            return {
                ...state,
                helloPaisaCountriesIsLoadMoreLoading: action.loading,
                helloPaisaCountries: helloPaisaCountries,
                helloPaisaCountriesMetaData: action.metaData,
                helloPaisaCountriesIsLoadMore: helloPaisaCountries?.length < action?.metaData?.totalDocuments
            };


        case REMITTANCE.GET_HELLO_PAISA_TYPES:
            return {
                ...state,
                helloPaisaTypesLoading: action.loading,
                helloPaisaTypes: action.helloPaisaTypes,
                helloPaisaSpecialBanks: action.helloPaisaSpecialBanks,
            };

        case REMITTANCE.GET_HELLO_PAISA_BANKS:
            return {
                ...state,
                helloPaisaBanksLoading: action.loading,
                helloPaisaBanks: action.data,
                helloPaisaBanksMetaData: action.metaData,
                helloPaisaBanksIsLoadMore: true,
                helloPaisaBanksIsLoadMoreLoading: false,
            };
        case REMITTANCE.LOAD_MORE_HELLO_PAISA_BANKS:
            let helloPaisaBanks = [...state.helloPaisaBanks, ...action.data];
            return {
                ...state,
                helloPaisaBanksIsLoadMoreLoading: action.loading,
                helloPaisaBanks: helloPaisaBanks,
                helloPaisaBanksMetaData: action.metaData,
                helloPaisaBanksIsLoadMore: helloPaisaBanks?.length < action?.metaData?.totalDocuments
            };

        case REMITTANCE.GET_HELLO_PAISA_BANK_BRANCHES:
            return {
                ...state,
                helloPaisaBankBranchesLoading: action.loading,
                helloPaisaBankBranches: action.data,
                helloPaisaBankBranchesMetaData: action.metaData,
                helloPaisaBankBranchesIsLoadMore: true,
                helloPaisaBankBranchesIsLoadMoreLoading: false,
            };
        case REMITTANCE.LOAD_MORE_HELLO_PAISA_BANK_BRANCHES:
            let helloPaisaBankBranches  = [...state.helloPaisaBankBranches, ...action.data]
            return {
                ...state,
                helloPaisaBankBranchesIsLoadMoreLoading: action.loading,
                helloPaisaBankBranches: helloPaisaBankBranches,
                helloPaisaBankBranchesMetaData: action.metaData,
                helloPaisaBankBranchesIsLoadMore: helloPaisaBankBranches?.length < action?.metaData?.totalDocuments
            };

        case REMITTANCE.GET_HELLO_PAISA_CURRENCY_RATES:
            return {...state, helloPaisaGetCurrencyLoading: action.loading, helloPaisaGetCurrency: action.data };

        case REMITTANCE.GET_REMITTANCE_BENEFICIARY:
            return {
                ...state,
                getRemittanceBeneficiaryLoading: action.loading,
                remittanceBeneficiary: action.data,
                remittanceBeneficiaryMetaData: action.metaData,
                remittanceBeneficiaryIsLoadMore: true,
                remittanceBeneficiaryIsLoadMoreLoading: false,
            };
        case REMITTANCE.GET_INITIAL_REMITTANCE_BENEFICIARY:
            return {
                ...state,
                getRemittanceBeneficiaryLoading: action.loading,
                remittanceInitialBeneficiary: action.data,
            };

        case REMITTANCE.LOAD_MORE_REMITTANCE_BENEFICIARY:
            let remittanceBeneficiary = [...state.remittanceBeneficiary, ...action.data];
            return {
                ...state,
                remittanceBeneficiaryIsLoadMoreLoading: action.loading,
                remittanceBeneficiary: remittanceBeneficiary,
                remittanceBeneficiaryMetaData: action.metaData,
                remittanceBeneficiaryIsLoadMore: remittanceBeneficiary?.length < action?.metaData?.totalDocuments
            };

        case REMITTANCE.PROCESS_PAYMENT:
            return {
                ...state,
                processPaymentLoading: action.loading,
            };

        case REMITTANCE.GET_TRANSACTION_HISTORY:
            return {
                ...state,
                getTransactionHistoryLoading: action.loading,
                transactionHistory: action.data,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: true,
                transactionHistoryIsLoadMoreLoading: false,
            };

        case REMITTANCE.LOAD_MORE_TRANSACTION_HISTORY:
            let transactionHistory = [...state.transactionHistory, ...action.data];
            return {
                ...state,
                transactionHistory: transactionHistory,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: transactionHistory?.length < action?.metaData?.totalDocuments,
                transactionHistoryIsLoadMoreLoading: action.loading
            };

        case REMITTANCE.GET_HELLO_PAISA_SINGLE_TRANSACTION_HISTORY:
            return {
                ...state,
                getSingleTransactionHistoryLoading: action.loading
            };

        case REMITTANCE.CANCEL_HELLO_PAISA_TRANSACTION:
            return { ...state, cancelTransaction: action.loading };

        case REMITTANCE.ADD_HELLO_PAISA_BENEFICIARY:
            return { ...state, addBeneficiaryLoading: action.loading };

        case REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IFSC_CODE:
            return { ...state, getBankAndBranchLoading: action.loading, bankAndBranch: action.data };

        case REMITTANCE.GET_HELLO_PAISA_BANK_AND_BRANCH_WITH_IBAN:
            return { ...state, getBankAndBranchLoading: action.loading, bankAndBranch: action.data };

        default:
            return state;
    }
};
