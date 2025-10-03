import {handleError, isLightUser, post} from "../../utils/methods";
import USER_SUBSCRIPTIONS from "../constants/UserSubscriptions.constant";
import AUTH from "../constants/Auth.constant";
import {updateCard} from "./Global.action";

const checkIsUserSubscribe = (data) => {
    // let data = []
    if (
        data?.length && data.some(a => ['ALL_IN_ONE', 'BALANCE_TRANSACTION_CHECK'].includes(a.type)) &&
        data.filter(a => ['ALL_IN_ONE', 'BALANCE_TRANSACTION_CHECK'].includes(a.type)).every(a => a.isExpired)
    ) {
        // Tala dikhado
        // console.log('Tala dikhado', data)
       return false
    } else {
        // console.log('Tala hatao', data)
        return true
        // Balance or transactions dekhne do
    }
};

export const getUserSubscriptions = (payload, CB) => async (dispatch, getState) => {
    const {auth, global} = getState();
    const {user} = auth;
    const {selectedCard, activeCardIndex} = global;
    dispatch({ type: USER_SUBSCRIPTIONS.GET_USER_SUBSCRIPTIONS, loading: true});
    let updatedUser = user ? {...user} : {};
    isLightUser(user,
        () => {
            dispatch({ type: USER_SUBSCRIPTIONS.GET_USER_SUBSCRIPTIONS, loading: false});
        },
        async () => {
            try {

                let response = await post('userSubscription/getAll', payload);
                if(response?.data?.error) {
                    dispatch({type: USER_SUBSCRIPTIONS.GET_USER_SUBSCRIPTIONS, loading: false});
                    handleError(response?.data?.data?.message || '');
                } else {
                    CB && CB(response?.data?.data, payload);
                    dispatch({
                        type: USER_SUBSCRIPTIONS.GET_USER_SUBSCRIPTIONS,
                        loading: false,
                        data: response?.data?.data?.filteredSubscription,
                    });
                    if(updatedUser) {
                        let updatedCard = {isEligibleForCheckBalanceAndTransaction: checkIsUserSubscribe(response?.data?.data?.filteredSubscription)};
                        updatedUser.cards = updatedUser?.cards.map(acc => {
                            if(acc._id === payload.cardId) {
                                acc = Object.assign(acc, updatedCard);
                            }
                            return acc
                        });
                        dispatch({type: AUTH.UPDATE_USER, user: updatedUser});
                        if(selectedCard?.length){
                            dispatch(updateCard(Object.assign(selectedCard, updatedCard), activeCardIndex, 'GetUserSubscriptionsApi'))
                        }
                    }
                }
            } catch (error) {
                handleError(error?.data?.error || error?.message, {autoHide: false});
                dispatch({ type: USER_SUBSCRIPTIONS.GET_USER_SUBSCRIPTIONS, loading: false, isLoggedIn: false });
            }
        }
    );

};

export const createSubscription = (payload, CB) => async (dispatch) => {
    dispatch({ type: USER_SUBSCRIPTIONS.CREATE_USER_SUBSCRIPTION, loading: true});
    try {
        let response = await post('userSubscription/create', payload);
        console.log('response', response);
        if(response?.data?.error) {
            dispatch({type: USER_SUBSCRIPTIONS.CREATE_USER_SUBSCRIPTION, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            console.log('response?.data?.data?.data', response?.data);
            dispatch({
                type: USER_SUBSCRIPTIONS.CREATE_USER_SUBSCRIPTION,
                loading: false,
            });
            CB && CB(response?.data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: USER_SUBSCRIPTIONS.CREATE_USER_SUBSCRIPTION, loading: false, isLoggedIn: false });
    }
};

export const unsubscribeSubscription = (payload, CB) => async (dispatch) => {
    dispatch({ type: USER_SUBSCRIPTIONS.UNSUBSCRIBE_USER_SUBSCRIPTION, loading: true});
    try {
        let response = await post('userSubscription/unSubscribe', payload);
        console.log('unsubscribeSubscription response', response, payload);
        if(response?.data?.error) {
            dispatch({type: USER_SUBSCRIPTIONS.UNSUBSCRIBE_USER_SUBSCRIPTION, loading: false});
            handleError(response?.data?.data?.message || '');
        } else {
            console.log('response?.data?.data?.data', response?.data);
            dispatch({
                type: USER_SUBSCRIPTIONS.UNSUBSCRIBE_USER_SUBSCRIPTION,
                loading: false,
            });
            CB && CB(response?.data.data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: USER_SUBSCRIPTIONS.UNSUBSCRIBE_USER_SUBSCRIPTION, loading: false, isLoggedIn: false });
    }
};
