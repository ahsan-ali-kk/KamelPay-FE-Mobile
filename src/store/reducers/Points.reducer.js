import POINTS from "../constants/Points.constants";

const initialState = {
    getPointsStatsLoading: false,
    pointsStats: {},

    getPointsListLoading: false,
    pointsListIsLoadMoreLoading: false,
    pointsListIsLoadMore: true,
    pointsListMetaData: {},
    pointsList: [],

    redeemPointsLoading: false,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case POINTS.GET_STATS:
            return {...state, getPointsStatsLoading: action.loading, pointsStats: action.data };

        case POINTS.GET_LIST:
            return {
                ...state,
                getPointsListLoading: action.loading,
                pointsList: action.data,
                pointsListMetaData: action.metaData,
                pointsListIsLoadMore: true,
                pointsListIsLoadMoreLoading: false,
            };

        case POINTS.GET_LOAD_MORE_LIST:
            let pointsList = [...state.pointsList, ...action.data];
            return {
                ...state,
                pointsList: pointsList,
                pointsListMetaData: action.metaData,
                pointsListIsLoadMore: pointsList?.length < action?.metaData?.totalDocuments,
                pointsListIsLoadMoreLoading: action.loading
            };

        case POINTS.REDEEM_POINTS:
            return {
                ...state,
                redeemPointsLoading: action.loading
            };


        default:
            return state;
    }
};
