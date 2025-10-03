import SAVINGS from "../constants/Savings.constant";

const initialState = {

    toggleSubscription: {
        isOpen: false,
        otp_verified: false
    },

    categoriesLoading: false,
    categories: [],
    popularSubCategories: [],
    categoriesBanners: [],
    profileInfo: {},

    subCategoriesLoading: false,
    subCategories: [],

    vendorsLoading: false,
    vendors: [],
    getVendorDetailsLoading: false,
    vendorDetails: {},
    vendorOffers: [],
    vendorDeals: [],

    subscriptionCreateLoading: false,

    qrCode: '',
    generateQrCodeLoading: false,

    vendorVerifyPinLoading: false,

    payBillAmount: {},
    getPayBillAmountLoading: false,

    redeemOfferLoading: false,

    redeemHistory: [],
    getRedeemHistoryLoading: false,

    setFavouriteVendorLoading: false,

    favouriteVendors: [],
    getFavouriteVendorsLoading: false,

    getHistoryLoading: false,
    history: [],
    historyIsLoadMoreLoading: false,
    historyIsLoadMore: true,
    historyMetaData: {},

    subscriptionCancelLoading: false,

    savingsStatusLoading: false,
    savingsStatus: {}
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case SAVINGS.GET_CATEGORIES:
            return { ...state,
                categoriesLoading: action.loading,
                categories: action.categories,
                popularSubCategories: action.popularSubCategories,
                categoriesBanners: action.categoriesBanners,
                profileInfo: action.profileInfo || {},
            };

        case SAVINGS.TOGGLE_SUBSCRIPTION_MODAL:
            return { ...state, toggleSubscription: action.data };

        case SAVINGS.GET_SUB_CATEGORIES:
            return { ...state, subCategoriesLoading: action.loading, subCategories: action.data };

        case SAVINGS.GET_VENDORS:
            return { ...state, vendorsLoading: action.loading, vendors: action.data };

        case SAVINGS.GET_VENDOR_DETAIL_WITH_OFFERS:
            return { ...state,
                getVendorDetailsLoading: action.loading,
                vendorDetails: action.vendorDetails || state.vendorDetails,
                vendorOffers: action.vendorOffers
            };

        case SAVINGS.SUBSCRIPTION_CREATE:
            return { ...state, subscriptionCreateLoading: action.loading };
        case SAVINGS.SUBSCRIPTION_CANCEL:
            return { ...state, subscriptionCancelLoading: action.loading };

        case SAVINGS.GENERATE_QR_CODE:
            return { ...state, generateQrCodeLoading: action.loading, qrCode: action.data };

        case SAVINGS.VENDOR_VERIFY_PIN:
            return { ...state, vendorVerifyPinLoading: action.loading };

        case SAVINGS.GET_PAY_BILL_AMOUNT:
            return { ...state, getPayBillAmountLoading: action.loading,  payBillAmount: action.data};

        case SAVINGS.REDEEM_OFFER:
            return { ...state, redeemOfferLoading: action.loading };

         case SAVINGS.GET_REDEEM_HISTORY:
            return { ...state, getRedeemHistoryLoading: action.loading, redeemHistory: action.data };

        case SAVINGS.SET_FAVOURITE_VENDOR:
            return { ...state, setFavouriteVendorLoading: action.loading,  vendorDetails: action.vendorDetails || state.vendorDetails };

        case SAVINGS.GET_FAVOURITE_VENDORS:
            return { ...state, getFavouriteVendorsLoading: action.loading, favouriteVendors: action.data };

        case SAVINGS.TRACK_HISTORY:
            return {
                ...state,
                getHistoryLoading: action.loading,
                history: action.data,
                historyMetaData: action.metaData,
                historyIsLoadMore: true,
                historyIsLoadMoreLoading: false,
            };
        case SAVINGS.LOAD_MORE_TRACK_HISTORY:
            let history = [...state.history, ...action.data];
            return {
                ...state,
                historyIsLoadMoreLoading: action.loading,
                history: history,
                historyMetaData: action.metaData,
                historyIsLoadMore: history?.length < action?.metaData?.totalDocuments
            };

        case SAVINGS.GET_SAVINGS_STATUS:
            return {
                ...state,
                savingsStatusLoading: action.loading,
                savingsStatus: action.data,
            };

        default:
            return state;
    }
};
