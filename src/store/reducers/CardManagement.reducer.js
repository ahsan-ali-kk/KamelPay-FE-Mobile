import CARD_MANAGEMENT from "../constants/CardManagement.constant";

const initialState = {
    changePinRequestLoading: false,
    setPinLoading: false,
    changeCardStatusLoading: false,
    activateCardLoading: false,
    requestActivateCardLoading: false,
    verifyActivateCardLoading: false,
    linkCardLoading: false,
    checkCardSubscriptionStatusLoading: false,
    updateCardSubscriptionLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case CARD_MANAGEMENT.CHANGE_PIN_REQUEST:
            return { ...state, changePinRequestLoading: action.loading };

        case CARD_MANAGEMENT.LINK_CARD:
            return { ...state, linkCardLoading: action.loading };

        case CARD_MANAGEMENT.SET_NEW_PIN:
            return { ...state, setPinLoading: action.loading };

        case CARD_MANAGEMENT.CHANGE_CARD_STATUS:
            return { ...state, changeCardStatusLoading: action.loading };

        case CARD_MANAGEMENT.ACTIVATE_CARD:
            return { ...state, activateCardLoading: action.loading };

        case CARD_MANAGEMENT.REQUEST_ACTIVATE_CARD:
            return { ...state, requestActivateCardLoading: action.loading };

        case CARD_MANAGEMENT.VERIFY_ACTIVATE_CARD:
            return { ...state, verifyActivateCardLoading: action.loading };

        case CARD_MANAGEMENT.CHECK_CARD_SUBSCRIPTION_STATUS:
            return { ...state, checkCardSubscriptionStatusLoading: action.loading };

         case CARD_MANAGEMENT.UPDATE_CARD_SUBSCRIPTION_STATUS:
            return { ...state, updateCardSubscriptionLoading: action.loading };

        default:
            return state;
    }
};
