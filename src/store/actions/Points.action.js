import {handleError, post} from "../../utils/methods";
import POINTS from "../constants/Points.constants";

export const getPointsStats = (payload, CB) => async (dispatch) => {
    let dispatchType = POINTS.GET_STATS;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post(`userNaqadPoints/getNaqadPointsStats`, payload);
        if(response?.data?.error) {
            dispatch({type: dispatchType, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            dispatch({ type: dispatchType, loading: false, data: response?.data?.data });
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: dispatchType, loading: false});
    }
};

export const getPointsList = (payload, CB) => async (dispatch) => {

    let dispatchType = POINTS.GET_LIST;

    if (payload.page > 1) {
        dispatchType = POINTS.GET_LOAD_MORE_LIST;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {
        let response = await post(`userNaqadPoints/getNaqadPointsList`, payload);
        if(response?.data?.error) {
            dispatch({
                type: dispatchType,
                loading: false,
                isLoadMore: false,
                data: [],
                metaData: {},
            });
            handleError(response?.data?.data?.message || '', {autoHide: false});
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

export const redeemPoints = (payload, CB) => async (dispatch) => {
    let dispatchType = POINTS.REDEEM_POINTS;
    dispatch({ type: dispatchType, loading: true});
    try {
        let response = await post(`userNaqadPoints/redeemNaqadPoints`, payload);
        if(response?.data?.error) {
            dispatch({type: dispatchType, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            dispatch({ type: dispatchType, loading: false});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: dispatchType, loading: false});
    }
};
