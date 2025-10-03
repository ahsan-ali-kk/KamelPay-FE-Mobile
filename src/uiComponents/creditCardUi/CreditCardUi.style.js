import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    cardContainer: {
        position: 'relative',
        paddingBottom: 20,
    },
    card: {
        // minWidth: 340,
        // maxWidth: 370,
        minHeight: 156,
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: themes['light'].colors.secondary,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        shadowColor: theme['light'].colors.secondary6,
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 1,
    },
    cardOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 13,
        left: 0,
        right: 0,
        zIndex: 0,
        borderRadius: 20,
        marginHorizontal: 12,
        backgroundColor: theme['light'].colors.secondary6,
        opacity: 0.20,
    },

    cardHeader: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    cardHeaderCompanyLogo: {
        flex: 1
    },
    cardHeaderCompanyLogoImage: {
     width: 125,
     height: 25,
    },
    cardHeaderTitle: {
        flex: 1,
        color: themes['light'].colors.tertiary,
        fontSize: 16,
        fontFamily: themes.font.regular,
        marginRight: 10,
        // marginLeft: false ? 10 : 0,
        // marginRight: false ? 0 : 10,
        textAlign: 'left'
    },
    cardHeaderImage: {
        width: 32.83,
        height: 20.4,
    },
    cardHeaderBottomBorder: {
        height: 1,
        backgroundColor: themes['light'].colors.tertiary,
        opacity: .20,
        marginTop: 20,
        marginBottom: 20,
    },
    cardBody: {
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
    cardBodyLeft: {
        flex: 1,
        marginRight: 5,
        justifyContent: 'flex-end',
    },
    cardBodyLoadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 15
    },

    cardBodyLeftTitleContainer: {
        flexDirection: 'column',
    },
    cardBodyLeftCurrencyContainer: {
      flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardBodyLeftTitleCurrency: {
        color: themes['light'].colors.tertiary,
        fontSize: 16,
        fontFamily: themes.font.regular,
        textAlign: 'left'
    },
    cardBodyLeftTitleCurrencyIcon: {
        color: themes['light'].colors.tertiary,
        fontSize: 14,
        marginTop: -3
    },
    cardBodyLeftTitle: {
        color: themes['light'].colors.tertiary,
        fontSize: 22,
        fontFamily: themes.font.regular,
        textAlign: 'left'
    },
    cardBodyRight: {
        flex: 1,
        marginLeft: 5,
        alignItems: 'flex-end'
    },
    seeBalance: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    seeBalanceText: {
        color: themes['light'].colors.tertiary,
        fontSize: 12,
        fontFamily: themes.font.regular,
        marginRight: 10,
        textDecorationLine: 'underline'
    },
    seeBalanceIcon: {
        color: themes['light'].colors.tertiary,
        fontSize: 14,
    },

    checkBalance: {
        // backgroundColor: 'transparent',
        paddingHorizontal: 15,
        borderRadius: 10
    },
    checkBalanceText: {
        fontSize: 12,
        // fontFamily: themes.font.regular,
        // fontWeight: '400',
    },

    reloadBalanceView: {
        flexDirection: 'row',
        marginBottom: 10
    },
    reloadBalanceViewContent: {},
    reloadBalanceViewContentTitle: {
        color: themes['light'].colors.tertiary,
        fontSize: 10,
        textAlign: 'right',
        fontFamily: themes.font.regular,
        marginVertical: 2
    },
    reloadBalanceViewContentSubTitle: {},
    reloadBalanceButton: {
        padding: 0
    },
    reloadBalanceButtonIcon: {
        color: themes['light'].colors.tertiary,
        fontSize: 14,
    },

    cardInfoContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        flex: 1,
    },
    cardInfoInnerContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    cardInfo: {
        flexDirection: 'column',
        marginRight: 15
    },
    cardInfoText: {
        fontSize: 12,
        color: themes['light'].colors.tertiary,
        fontFamily: themes.font.regular,
        flex: 1,
        marginTop: 6,
        textAlign: 'left'
    },
    flex_1: {
        flex: 1
    },
    large_font_size: {
        fontSize: 18
    },
    mr_0: {
      marginRight: 0
    },

    cardStatus: {
        minWidth: 104.48,
        backgroundColor: themes['light'].colors.green,
        padding: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        // marginTop: -15,
        marginBottom: 15,
        marginRight: -20,
    },
    cardStatusText: {
        fontSize: 12,
        color: themes['light'].colors.tertiary,
        fontFamily: themes.font.regular,
        textAlign: 'center'
    },

    naqadPointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    naqadPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flex: 1
    },
    naqadPointsNumber: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        textAlign: 'left',
        fontWeight: '600',
        marginRight: 5,
        // flex: 1
    },
    naqadPointsText: {
        fontSize: 12,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.medium,
        textAlign: 'right',
        fontWeight: '500',
    },
    naqadPointsButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: -10,
        marginVertical: -6,
        borderTopRightRadius: 15
    },
    naqadPointsButtonText: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        // textDecorationColor: "#000",
    }
});
