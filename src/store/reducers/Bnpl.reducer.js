import BNPL from "../constants/Bnpl.constant";

const initialState = {

    bnplEligibility: {},
    checkBnplEligibilityLoading: false,

    getLatestCategoriesLoading: false,
    latestCategories: [],

    selectedLatestCategory: null,

    getCategoriesLoading: false,
    categoriesIsLoadMoreLoading: false,
    categoriesIsLoadMore: true,
    categoriesMetaData: {},
    categories: [],

    getLatestSubCategoriesLoading: false,
    latestSubCategories: [],

    selectedLatestSubCategory: null,

    getSubCategoriesLoading: false,
    subCategoriesIsLoadMoreLoading: false,
    subCategoriesIsLoadMore: true,
    subCategoriesMetaData: {},
    subCategories: [],


    getLatestProductsLoading: false,
    latestProducts: [],
    getProductsLoading: false,

    productsIsLoadMoreLoading: false,
    productsIsLoadMore: true,
    productsMetaData: {},
    products: [],

    getProductDetailLoading: false,
    productDetail: {},

    getCartProductsLoading: false,
    getCartProducts: {},

    updateCartLoading: false,

    addAddressLoading: false,
    updateAddressLoading: false,
    deleteAddressLoading: false,

    getAddressesLoading: false,
    addressesIsLoadMoreLoading: false,
    addressesIsLoadMore: true,
    addressesMetaData: {},
    addresses: [],

    selectedAddress: {},

    getFeesAndVatLoading: false,
    feesAndVat: {},

    getProductInstallmentInfoLoading: false,
    getProductInstallmentInfo: {},

    requestLoading: false,
    verifyLoading: false,

    getTransactionHistoryLoading: false,
    transactionHistoryIsLoadMoreLoading: false,
    transactionHistoryIsLoadMore: true,
    transactionHistoryMetaData: {},
    transactionHistory: [],
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case BNPL.CHECK_BNPL_ELIGIBILITY:
            return {
                ...state,
                bnplEligibility: action.data,
                checkBnplEligibilityLoading: action.loading,
            };

        case BNPL.GET_LATEST_CATEGORIES:
            return {
                ...state,
                getLatestCategoriesLoading: action.loading,
                latestCategories: action.data,
            };

        case BNPL.SELECTED_LATEST_CATEGORY:
            return {
                ...state,
                selectedLatestCategory: action.data,
            };

        case BNPL.GET_CATEGORIES:
            return {
                ...state,
                getCategoriesLoading: action.loading,
                categories: action.data,
                categoriesMetaData: action.metaData,
                categoriesIsLoadMore: true,
                categoriesIsLoadMoreLoading: false,
            };

        case BNPL.LOAD_MORE_GET_CATEGORIES:
            let categories = [...state.categories, ...action.data];
            return {
                ...state,
                categories: categories,
                categoriesMetaData: action.metaData,
                categoriesIsLoadMore: categories?.length < action?.metaData?.totalDocuments,
                categoriesIsLoadMoreLoading: action.loading
            };

        case BNPL.GET_LATEST_SUB_CATEGORIES:
            return {
                ...state,
                getLatestSubCategoriesLoading: action.loading,
                latestSubCategories: action.data,
            };

        case BNPL.SELECTED_LATEST_SUB_CATEGORY:
            return {
                ...state,
                selectedLatestSubCategory: action.data,
            };

        case BNPL.GET_SUB_CATEGORIES:
            return {
                ...state,
                getSubCategoriesLoading: action.loading,
                subCategories: action.data,
                subCategoriesMetaData: action.metaData,
                subCategoriesIsLoadMore: true,
                subCategoriesIsLoadMoreLoading: false,
            };

        case BNPL.LOAD_MORE_GET_SUB_CATEGORIES:
            let subCategories = [...state.subCategories, ...action.data];
            return {
                ...state,
                subCategories: subCategories,
                subCategoriesMetaData: action.metaData,
                subCategoriesIsLoadMore: subCategories?.length < action?.metaData?.totalDocuments,
                subCategoriesIsLoadMoreLoading: action.loading
            };


        case BNPL.GET_LATEST_PRODUCTS:
            return {
                ...state,
                getLatestProductsLoading: action.loading,
                latestProducts: action.data,
            };

        case BNPL.GET_PRODUCTS:
            return {
                ...state,
                getProductsLoading: action.loading,
                products: action.data,
                productsMetaData: action.metaData,
                productsIsLoadMore: true,
                productsIsLoadMoreLoading: false,
            };

        case BNPL.LOAD_MORE_GET_PRODUCTS:
            let products = [...state.products, ...action.data];
            return {
                ...state,
                products: products,
                productsMetaData: action.metaData,
                productsIsLoadMore: products?.length < action?.metaData?.totalDocuments,
                productsIsLoadMoreLoading: action.loading
            };

        case BNPL.GET_PRODUCT_DETAIL:
            return {
                ...state,
                productDetail: action.data,
                getProductDetailLoading: action.loading,
            };

        case BNPL.GET_CART:
            return {
                ...state,
                getCartProducts: action.data,
                getCartProductsLoading: action.loading,
            };

        case BNPL.UPDATE_CART:
            return {
                ...state,
                updateCartLoading: action.loading,
            };

        case BNPL.ADD_ADDRESS:
            return {
                ...state,
                addAddressLoading: action.loading,
            };
        case BNPL.UPDATE_ADDRESS:
            return {
                ...state,
                updateAddressLoading: action.loading,
            };
        case BNPL.DELETE_ADDRESS:
            return {
                ...state,
                deleteAddressLoading: action.loading,
            };

        case BNPL.GET_ADDRESSES:
            return {
                ...state,
                getAddressesLoading: action.loading,
                addresses: action.data,
                addressesMetaData: action.metaData,
                addressesIsLoadMore: true,
                addressesIsLoadMoreLoading: false,
            };

        case BNPL.LOAD_MORE_ADDRESSES:
            let addresses = [...state.addresses, ...action.data];
            return {
                ...state,
                addresses: addresses,
                addressesMetaData: action.metaData,
                addressesIsLoadMore: products?.length < action?.metaData?.totalDocuments,
                addressesIsLoadMoreLoading: action.loading
            };

        case BNPL.SET_SELECTED_ADDRESS:
            return {
                ...state,
                selectedAddress: action.data
            };

        case BNPL.GET_FEES_VAT:
            return {...state, getFeesAndVatLoading: action.loading, feesAndVat: action.data };

        case BNPL.GET_PRODUCT_INSTALLMENT_INFO:
            return {
                ...state,
                getProductInstallmentInfoLoading: action.loading,
                getProductInstallmentInfo: action.data
            };

        case BNPL.REQUEST_BNPL:
            return {
                ...state,
                requestLoading: action.loading,
            };

        case BNPL.VERIFY_BNPL:
            return {
                ...state,
                verifyLoading: action.loading,
            };

        case BNPL.GET_TRANSACTION_HISTORY:
            return {
                ...state,
                getTransactionHistoryLoading: action.loading,
                transactionHistory: action.data,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: true,
                transactionHistoryIsLoadMoreLoading: false,
            };

        case BNPL.LOAD_MORE_TRANSACTION_HISTORY:
            let transactionHistory = [...state.transactionHistory, ...action.data];
            return {
                ...state,
                transactionHistory: transactionHistory,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: transactionHistory?.length < action?.metaData?.totalDocuments,
                transactionHistoryIsLoadMoreLoading: action.loading
            };

        default:
            return state;
    }
};
