import SAVINGS from "../constants/Savings.constant";
import {handleError, handleSuccess, post} from "../../utils/methods";
import {manageSavingsSubscriptionStatusInUserProperties} from "../../trackingEvents/UXCAM";

export const getCategories = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.GET_CATEGORIES, loading: true});
    try {
        let response = await post("savings/getCategories", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.GET_CATEGORIES, loading: false});
        } else {
            dispatch({
                type: SAVINGS.GET_CATEGORIES,
                loading: false,
                categories: response?.data?.data?.categories?.data,
                popularSubCategories: response?.data?.data?.subCategories,
                categoriesBanners: response?.data?.data?.categories?.bannerData,
                profileInfo: response?.data?.data?.categories?.profileInfo
            });
            // handleSuccess(response?.data?.data?.message);
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GET_CATEGORIES, loading: false });
    }
};

export const getSubCategories = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.GET_SUB_CATEGORIES, loading: true});
    try {
        let response = await post("savings/getSubCategories", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.GET_SUB_CATEGORIES, loading: false});
        } else {
            dispatch({type: SAVINGS.GET_SUB_CATEGORIES, loading: false, data: response?.data?.data?.data});
            // handleSuccess(response?.data?.data?.message);
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GET_SUB_CATEGORIES, loading: false });
    }
};

export const getVendors = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.GET_VENDORS, loading: true});
    try {
        let response = await post("savings/getOutlets", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.GET_VENDORS, loading: false});
        } else {
            dispatch({type: SAVINGS.GET_VENDORS, loading: false, data: response?.data?.data});
            // handleSuccess(response?.data?.data?.message);
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GET_VENDORS, loading: false });
    }
};

export const getVendorDetails = (payload, CB, vendor) => async (dispatch) => {
    dispatch({ type: SAVINGS.GET_VENDOR_DETAIL_WITH_OFFERS, loading: true, vendorOffers: [], vendorDeals: []});
    try {
        let response = await post("savings/getOutletDetails", payload);
        if(response?.data?.error) {
            // if(response?.data?.data?.isUserSubscribed) {
                handleError(response?.data?.data?.message || '');
            // }
            dispatch({type: SAVINGS.GET_VENDOR_DETAIL_WITH_OFFERS, loading: false});
        } else {
            dispatch({type: SAVINGS.GET_VENDOR_DETAIL_WITH_OFFERS, loading: false,
                data: response?.data?.data,
                vendorDetails: {
                    ...response?.data?.data?.outletDetails[0],
                    isFavourite:response?.data?.data?.isFavourite
                },
                vendorOffers: response?.data?.data?.offers || [],
                vendorDeals: response?.data?.data?.deals || [],
            });
            CB && CB(response?.data, payload, vendor);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GET_VENDOR_DETAIL_WITH_OFFERS, loading: false });
    }
};

export const subscriptionCreate = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.SUBSCRIPTION_CREATE, loading: true});
    try {
        let response = await post("userSubscription/create", payload);
        if(response?.data?.error) {
            // handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.SUBSCRIPTION_CREATE, loading: false});
        } else {
            dispatch({type: SAVINGS.SUBSCRIPTION_CREATE, loading: false});
            dispatch(getSavingsStatus());
        }
        CB && CB(response?.data);
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.SUBSCRIPTION_CREATE, loading: false });
    }
};

export const generateQRCode = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.GENERATE_QR_CODE, loading: true});
    try {
        let response = await post("savings/generateQrCode", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.GENERATE_QR_CODE, loading: false});
        } else {
            dispatch({type: SAVINGS.GENERATE_QR_CODE, loading: false, data: response?.data?.data});
        }
        CB && CB();
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GENERATE_QR_CODE, loading: false });
    }
};

export const verifyPin = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.VENDOR_VERIFY_PIN, loading: true});
    try {
        let response = await post("savings/verifyPin", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.VENDOR_VERIFY_PIN, loading: false});
        } else {
            dispatch({type: SAVINGS.VENDOR_VERIFY_PIN, loading: false});
            // handleSuccess(response?.data?.data?.message);
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.VENDOR_VERIFY_PIN, loading: false });
    }
};

export const getPayBillAmount = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.GET_PAY_BILL_AMOUNT, loading: true});
    try {
        let response = await post("savings/getPayableAmount", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.GET_PAY_BILL_AMOUNT, loading: false});
        } else {
            dispatch({type: SAVINGS.GET_PAY_BILL_AMOUNT, loading: false, data: response?.data?.data});
            // handleSuccess(response?.data?.data?.message);
            CB && CB(payload?.billAmount);
        }

    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GET_PAY_BILL_AMOUNT, loading: false });
    }
};

export const redeemOffer = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.REDEEM_OFFER, loading: true});
    try {
        let response = await post("savings/redeem", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.REDEEM_OFFER, loading: false});
        } else {
            dispatch({type: SAVINGS.REDEEM_OFFER, loading: false, data: response?.data?.data});
            // handleSuccess(response?.data?.data?.message);
            CB && CB(response?.data?.data);
        }

    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.REDEEM_OFFER, loading: false });
    }
};

export const getRedeemHistory = (payload) => async (dispatch) => {
    dispatch({ type: SAVINGS.GET_REDEEM_HISTORY, loading: true});
    try {
        let response = await post("savings/getRedeemHistory", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.GET_REDEEM_HISTORY, loading: false});
        } else {
            dispatch({type: SAVINGS.GET_REDEEM_HISTORY, loading: false, data: response?.data?.data});
        }

    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GET_REDEEM_HISTORY, loading: false });
    }
};

export const getFavouriteVendors = (payload) => async (dispatch) => {
    dispatch({ type: SAVINGS.GET_FAVOURITE_VENDORS, loading: true});
    try {
        let response = await post("savings/allFavourites", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.GET_FAVOURITE_VENDORS, loading: false});
        } else {
            dispatch({type: SAVINGS.GET_FAVOURITE_VENDORS, loading: false, data: response?.data?.data});
        }

    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.GET_FAVOURITE_VENDORS, loading: false });
    }
};

export const setFavouriteVendor = (payload) => async (dispatch, getState) => {
    let {savings} = getState();
    dispatch({ type: SAVINGS.SET_FAVOURITE_VENDOR, loading: true});
    try {
        let response = await post("savings/favourite", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: SAVINGS.SET_FAVOURITE_VENDOR, loading: false});
        } else {
            let vendor = savings?.vendorDetails;
            if(vendor) {
                vendor.isFavourite =  savings?.vendorDetails?.isFavourite === 0 ? 1 : 0
            }
            handleSuccess(response?.data?.data?.message);
            dispatch({type: SAVINGS.SET_FAVOURITE_VENDOR, loading: false, vendorDetails: vendor});
            dispatch(getFavouriteVendors())
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.SET_FAVOURITE_VENDOR, loading: false });
    }
};

export const toggleSubscriptionModal = (payload) => (dispatch) => {
    dispatch({ type: SAVINGS.TOGGLE_SUBSCRIPTION_MODAL, data: payload});
};

export const subscriptionCancel = (payload, CB) => async (dispatch) => {
    dispatch({ type: SAVINGS.SUBSCRIPTION_CANCEL, loading: true});
    try {
        let response = await post("userSubscription/unSubscribe", payload);

        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
        } else {
            dispatch(getSavingsStatus());
            CB && CB(response?.data?.data);
        }

        dispatch({type: SAVINGS.SUBSCRIPTION_CANCEL, loading: false});

    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: SAVINGS.SUBSCRIPTION_CANCEL, loading: false });
    }
};

export const toggleSubscribeUser = (data) => async (dispatch) => {
    dispatch({ type: SAVINGS.IS_USER_SUBSCRIBE, data: data});
};


export const getSavingsStatus = () => async (dispatch, getState) => {

    const {auth} = getState();
    const {user} = auth;

    dispatch({ type: SAVINGS.GET_SAVINGS_STATUS, loading: true});

    try {

        let response = await post("savings/status");

        if(response?.data?.error) {

            dispatch({type: SAVINGS.GET_SAVINGS_STATUS, loading: false});

            handleError(response?.data?.data?.message || '');

        } else {

            if(response?.data?.data?.viewSubscriptionModal && response?.data?.data?.subscriptionId) {
                setTimeout(() => {
                    if(auth?.isLoggedIn) {
                        dispatch(toggleSubscriptionModal({
                            isOpen: true,
                            otp_verified: false,
                        }))
                    }
                }, 2000)
            }

            manageSavingsSubscriptionStatusInUserProperties(response?.data?.data, user);

            dispatch({type: SAVINGS.GET_SAVINGS_STATUS, loading: false, data: response?.data?.data});

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});

        dispatch({ type: SAVINGS.GET_SAVINGS_STATUS, loading: false });

    }

};
