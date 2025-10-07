import GLOBAL from "../constants/Global.constant";
import {topupAndPaybillmentVendor} from "../actions/Global.action";

const initialState = {
    countries: [],
    currentCountry: {},
    nationalCountry: {},
    getCountriesLoading: true,

    activeCardIndex: 0,
    selectedCard: {},
    cardSelectionModalIsOpen: false,

    promotionRequestFormLoading: false,

    getMasterDetailLoading: false,
    masterDetails: {},

    getApplicationVersionsLoading: true,
    applicationVersions: {},

    uuid: '',
    sendOtpLoading: false,
    reSendOtpLoading: false,
    verifyOtpLoading: false,
    popularsLoading: false,
    populars: {},
    isDashboardReady: false,
    editBeneficiaryLoading: false,
    deleteBeneficiaryLoading: false,
    termAndConditions: {},
    currentLocation: {},
    isOpenLanguagePicker: false,
    selectedCurrentPromotion: {},

    generateTaxInvoiceLoading: false,

    topupAndBillpaymentCurrentVendor: topupAndPaybillmentVendor["PAYKII"],

    getPromotionsLoading: false,
    promotions: [],

    preserveNotification: null,

    currentScreen: '',
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case GLOBAL.GET_COUNTRIES:
            return { ...state,
                countries: action.countries.sort((a, b) => a.name.common.localeCompare(b.name.common)),
                currentCountry: action.currentCountry,
                getCountriesLoading: action.loading
            };
        case GLOBAL.SET_NATIONAL_COUNTRY:
            return { ...state, nationalCountry: action.data };

        case GLOBAL.CARD_SELECTION_MODAL_IS_OPEN:
            return { ...state, cardSelectionModalIsOpen: action.data };
        case GLOBAL.UPDATE_CARD:
            return { ...state, selectedCard: action.data, activeCardIndex: action.index  };

        case GLOBAL.GET_MASTER_DETAIL:
            return { ...state, masterDetails: action.data, getMasterDetailLoading: action.loading };

        case GLOBAL.APPLICATION_VERSIONS:
            return { ...state, applicationVersions: action.data, getApplicationVersionsLoading: action.loading };

        case GLOBAL.PROMOTION_FORM_REQUEST:
            return { ...state, promotionRequestFormLoading: action.loading };
        case GLOBAL.SET_UUID:
            return { ...state, uuid: action.id };
        case GLOBAL.SEND_OTP:
            return { ...state, sendOtpLoading: action.loading };
        case GLOBAL.RESEND_OTP:
            return { ...state, reSendOtpLoading: action.loading };
        case GLOBAL.VERIFY_OTP:
            return { ...state, verifyOtpLoading: action.loading };
        case GLOBAL.GET_POPULARS_DATA:
            return { ...state, popularsLoading: action.loading, populars: action.data, isDashboardReady: action.isDashboardReady };

        case GLOBAL.EDIT_BENEFICIARY:
            return { ...state, editBeneficiaryLoading: action.loading };
        case GLOBAL.DELETE_BENEFICIARY:
            return { ...state, deleteBeneficiaryLoading: action.loading };

        case GLOBAL.VIEW_TERMS_AND_CONDITIONS:
            return { ...state, termAndConditions: action.data };

        case GLOBAL.CURRENT_LOCATION:
            return { ...state, currentLocation: action.data };

        case GLOBAL.TOGGLE_LANGUAGE_MODAL:
            return { ...state, isOpenLanguagePicker: action.data };

        case GLOBAL.SELECTED_CURRENT_PROMOTION:
            return { ...state, selectedCurrentPromotion: action.data };

        case GLOBAL.GENERATE_TAX_INVOICE:
            return { ...state, generateTaxInvoiceLoading: action.loading };

        case GLOBAL.TOPUP_AND_BILLPAYMENT_CURRENT_VENDOR:
            return { ...state, topupAndBillpaymentCurrentVendor: action.data };

        case GLOBAL.GET_PROMOTIONS:
            return { ...state, getPromotionsLoading: action.loading, promotions: action.data };

        case GLOBAL.PRESERVE_NOTIFICATION:
            return { ...state, preserveNotification: action.data };

        case GLOBAL.SET_CURRENT_SCREEN:
            return { ...state, currentScreen: action.data };

        default:
            return state;
    }
};
