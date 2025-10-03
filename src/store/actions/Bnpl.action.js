import BNPL from "../constants/Bnpl.constant";
import {handleError, post} from "../../utils/methods";


export const checkBNPLEligibility = (payload) => async (dispatch) => {
    dispatch({ type: BNPL.CHECK_BNPL_ELIGIBILITY, loading: true});
    try {
        let response = await post("advanceSalary/checkBNPLEligibility", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: BNPL.CHECK_BNPL_ELIGIBILITY, loading: false});
        } else {
            let data = response?.data?.data;
            dispatch({type: BNPL.CHECK_BNPL_ELIGIBILITY, loading: false, data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: BNPL.CHECK_BNPL_ELIGIBILITY, loading: false });
    }
};

export const clearBNPLEligibility = () => async (dispatch) => {
    dispatch({ type: BNPL.CHECK_BNPL_ELIGIBILITY, data: {}, loading: false});
};

export const getLatestCategories = (payload) => async (dispatch) => {

    let dispatchType = BNPL.GET_LATEST_CATEGORIES;

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/categories/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({ type: dispatchType, loading: false, data: [] });

        } else {

            dispatch({ type: dispatchType, loading: false, data: response?.data?.data?.data });

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const updateLatestCategory = (payload) => async (dispatch) => {

    let dispatchType = BNPL.SELECTED_LATEST_CATEGORY;

    dispatch({ type: dispatchType, data: payload});

};
export const updateLatestSubCategory = (payload) => async (dispatch) => {

    let dispatchType = BNPL.SELECTED_LATEST_SUB_CATEGORY;

    dispatch({ type: dispatchType, data: payload});

};

export const getCategories = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.GET_CATEGORIES;

    if (payload.page > 1) {
        dispatchType = BNPL.LOAD_MORE_GET_CATEGORIES;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/categories/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });

            CB && CB(response?.data?.data?.data);

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const getLatestSubCategories = (payload) => async (dispatch) => {

    let dispatchType = BNPL.GET_LATEST_SUB_CATEGORIES;

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/subCategories/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({ type: dispatchType, loading: false, data: [] });

        } else {

            dispatch({ type: dispatchType, loading: false, data: response?.data?.data?.data });

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const getSubCategories = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.GET_SUB_CATEGORIES;

    if (payload.page > 1) {
        dispatchType = BNPL.LOAD_MORE_GET_SUB_CATEGORIES;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/subCategories/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });

            CB && CB(response?.data?.data?.data);

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};


export const getLatestProducts = (payload) => async (dispatch) => {

    let dispatchType = BNPL.GET_LATEST_PRODUCTS;

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/products/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({ type: dispatchType, loading: false, data: [] });

        } else {

            dispatch({ type: dispatchType, loading: false, data: response?.data?.data?.data });

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const getProducts = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.GET_PRODUCTS;

    if (payload.page > 1) {
        dispatchType = BNPL.LOAD_MORE_GET_PRODUCTS;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/products/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });

            CB && CB(response?.data?.data?.data);

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const getProductDetail = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.GET_PRODUCT_DETAIL;

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/products/getProductDetails`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                data: [],
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.product,
            });

            CB && CB();

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const getCart = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.GET_CART;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post(`ecommerce/carts/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                data: {},
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.products,
            });

            CB && CB();

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const addProductIntoCart = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.UPDATE_CART;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post(`ecommerce/carts/update`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                data: {},
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.products,
            });

            CB && CB();
            dispatch(getCart())

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const addAddress = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.ADD_ADDRESS;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post(`ecommerce/addresses/create`, payload);

        dispatch({type: dispatchType, loading: false});

        CB && CB(response.data);

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const updateAddress = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.UPDATE_ADDRESS;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post(`ecommerce/addresses/update`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({type: dispatchType, loading: false});

        } else {

            dispatch({type: dispatchType, loading: false});

            CB && CB();

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};
export const deleteAddress = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.DELETE_ADDRESS;

    dispatch({ type: dispatchType, loading: true});

    try {

        let response = await post(`ecommerce/addresses/delete`, payload);

        dispatch({type: dispatchType, loading: false});

        CB && CB(response?.data);

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};
export const getAddresses = (payload, CB) => async (dispatch) => {

    let dispatchType = BNPL.GET_ADDRESSES;

    if (payload.page > 1) {
        dispatchType = BNPL.LOAD_MORE_ADDRESSES;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post(`ecommerce/addresses/get`, payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

        } else {

            if(response?.data?.data?.data?.length){
                // dispatch(setSelectedAddress(response?.data?.data?.data[0]))
            }

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });

            CB && CB(response?.data?.data?.data);

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};

export const setSelectedAddress = (payload) => async (dispatch) => {

    dispatch({ type: BNPL.SET_SELECTED_ADDRESS, data: payload});

};

export const getFeesAndVat = (payload, CB) => async (dispatch) => {
    dispatch({ type: BNPL.GET_FEES_VAT, loading: true});
    try {
        let response = await post(`ecommerce/orders/getFeesAndVat`, payload);
        if(response?.data?.error) {
            dispatch({type: BNPL.GET_FEES_VAT, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            dispatch({ type: BNPL.GET_FEES_VAT, loading: false, data: response?.data?.data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: BNPL.GET_FEES_VAT, loading: false});
    }
};

export const getProductInstallmentInfo = (payload, CB) => async (dispatch) => {
    dispatch({ type: BNPL.GET_PRODUCT_INSTALLMENT_INFO, loading: true, data: {} });
    try {
        let response = await post(`ecommerce/products/checkBnplPrice`, payload);
        if(response?.data?.error) {
            dispatch({type: BNPL.GET_PRODUCT_INSTALLMENT_INFO, loading: false, data: {}});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            dispatch({ type: BNPL.GET_PRODUCT_INSTALLMENT_INFO, loading: false, data: response?.data?.data?.data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: BNPL.GET_PRODUCT_INSTALLMENT_INFO, loading: false, data: {}});
    }
};

export const requestBNPL = (payload, CB) => async (dispatch) => {
    dispatch({ type: BNPL.REQUEST_BNPL, loading: true});
    try {
        let response = await post(`ecommerce/orders/requestBnpl`, payload);
        dispatch({type: BNPL.REQUEST_BNPL, loading: false});
        CB && CB(response?.data, payload);
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: BNPL.REQUEST_BNPL, loading: false});
    }
};


export const verifyBNPL = (payload, CB) => async (dispatch) => {
    dispatch({ type: BNPL.VERIFY_BNPL, loading: true});
    try {
        let response = await post(`ecommerce/orders/verifyBnpl`, payload);
        dispatch({ type: BNPL.VERIFY_BNPL, loading: false });
        CB && CB(response?.data, payload);
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: BNPL.VERIFY_BNPL, loading: false});
    }
};

export const getTransactionHistory = (payload) => async (dispatch) => {

    let dispatchType = BNPL.GET_TRANSACTION_HISTORY;

    if (payload.page > 1) {
        dispatchType = BNPL.LOAD_MORE_TRANSACTION_HISTORY;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("transaction/trackEcommerceTransactions", payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });

        } else {

            dispatch({
                type: dispatchType,
                loading: false,
                data: response?.data?.data?.data,
                metaData: response?.data?.data?.metaData,
            });

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};
