import USER_SUBSCRIPTIONS from "../constants/UserSubscriptions.constant";

const initialState = {
    subscriptions: [],
    getSubscriptionsLoading: true,
    createSubscriptionLoading: false,
    unsubscribeSubscriptionLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case USER_SUBSCRIPTIONS.GET_USER_SUBSCRIPTIONS:
            return {
                ...state,
                getSubscriptionsLoading: action.loading,
                subscriptions: action.data,
            };

        case USER_SUBSCRIPTIONS.CREATE_USER_SUBSCRIPTION:
            return {
                ...state,
                createSubscriptionLoading: action.loading,
            };

        case USER_SUBSCRIPTIONS.UNSUBSCRIBE_USER_SUBSCRIPTION:
            return {
                ...state,
                unsubscribeSubscriptionLoading: action.loading,
            };

        default:
            return state;
    }
};
