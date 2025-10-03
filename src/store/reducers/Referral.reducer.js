import REFERRAL from "../constants/Referral.constant";

const initialState = {
    addReferralLoading: false,

    checkReferralLoading: false,
    hasReferred: false,

    getUserReferralsLoading: false,
    userReferralsIsLoadMoreLoading: false,
    userReferralsIsLoadMore: true,
    userReferralsMetaData: {},
    userReferrals: [],
    totalEarned: 0,
    totalPaid: 0,

};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case REFERRAL.ADD_USER_REFERRAL:
            return {
                ...state,
                addReferralLoading: action.loading,
                hasReferred: action.hasReferred || state.hasReferred
            };

        case REFERRAL.CHECK_USER_REFERRAL:
            return {
                ...state,
                checkReferralLoading: action.loading,
                hasReferred: action.hasReferred
            };



        case REFERRAL.GET_USER_REFERRALS:
            return {
                ...state,
                getUserReferralsLoading: action.loading,
                userReferrals: action.data,
                totalPaid: action.totalPaid,
                totalEarned: action.totalEarned,
                userReferralsMetaData: action.metaData,
                userReferralsIsLoadMore: true,
                userReferralsIsLoadMoreLoading: false,
            };

        case REFERRAL.LOAD_MORE_USER_REFERRALS:
            let userReferrals = [...state.userReferrals, ...action.data];
            return {
                ...state,
                userReferrals: userReferrals,
                // totalPaid: action.totalPaid,
                // totalEarned: action.totalEarned,
                userReferralsMetaData: action.metaData,
                userReferralsIsLoadMore: userReferrals?.length < action?.metaData?.totalDocuments,
                userReferralsIsLoadMoreLoading: action.loading
            };


        default:
            return state;
    }
};
