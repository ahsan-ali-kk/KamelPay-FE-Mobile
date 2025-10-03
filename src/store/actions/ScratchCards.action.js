import SCRATCH_CARDS from "../constants/ScratchCards.constant";
import {handleError, post} from "../../utils/methods";

export const getScratchCards = (payload) => async (dispatch) => {

    let dispatchType = SCRATCH_CARDS.GET_SCRATCH_CARDS;

    if (payload.page > 1) {
        dispatchType = SCRATCH_CARDS.LOAD_MORE_SCRATCH_CARDS;
    }

    dispatch({ type: dispatchType, loading: true, data: []});

    try {

        let response = await post("userScratchCard/getScratchCardsList", payload);

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

export const scratchACard = (payload, CB) => async (dispatch) => {

    let dispatchType = SCRATCH_CARDS.SCRATCH_A_CARD;

    dispatch({ type: dispatchType, loading: true });

    try {

        let response = await post("userScratchCard/scratchCard", payload);

        if(response?.data?.error) {

            handleError(response?.data?.data?.message || '');

            dispatch({ type: dispatchType, loading: false });

        } else {

            CB && CB(response?.data?.data);
            dispatch({ type: dispatchType, loading: false });

        }

    } catch (error) {

        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: dispatchType, loading: false});

    }
};
