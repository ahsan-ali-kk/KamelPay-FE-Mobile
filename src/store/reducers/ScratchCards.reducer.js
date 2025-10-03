import SCRATCH_CARDS from "../constants/ScratchCards.constant";

const initialState = {


    getScratchCardsLoading: false,
    scratchCards: [],
    scratchCardsIsLoadMoreLoading: false,
    scratchCardsIsLoadMore: true,
    scratchCardsMetaData: {},

    scratchACardLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case SCRATCH_CARDS.GET_SCRATCH_CARDS:
            return {
                ...state,
                getScratchCardsLoading: action.loading,
                scratchCards: action.data,
                scratchCardsMetaData: action.metaData,
                scratchCardsIsLoadMore: true,
                scratchCardsIsLoadMoreLoading: false,
            };

        case SCRATCH_CARDS.LOAD_MORE_SCRATCH_CARDS:
            let scratchCards = [...state.scratchCards, ...action.data];
            return {
                ...state,
                scratchCardsIsLoadMoreLoading: action.loading,
                scratchCards: scratchCards,
                scratchCardsMetaData: action.metaData,
                scratchCardsIsLoadMore: scratchCards?.length < action?.metaData?.totalDocuments
            };

        case SCRATCH_CARDS.SCRATCH_A_CARD:
            return { ...state, scratchACardLoading: action.loading };

        default:
            return state;
    }
};
