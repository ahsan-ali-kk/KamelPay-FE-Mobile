import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({

    homeContainer: {
        flexGrow: 1,
        position: 'relative',
    },

    cardSection: {
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 35,
        position: 'relative',

    },
    card: {
        borderRadius: 15,
        backgroundColor: theme['light'].colors.tertiary,
        shadowColor: theme['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 5,
        paddingVertical: 20,
        paddingHorizontal: 10,
        // position: 'relative',
    },
    cardTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        paddingHorizontal: 10,
        marginBottom: 10,
        textAlign: 'left'
    },
    cardTwoItem: {
        flexDirection: 'row'
    },
    flex_1: {
        flex: 1
    },
    cardItem: {
        marginVertical: 8,
        paddingHorizontal: 10,
    },
    cardItemLabel: {
        marginBottom: 6,
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.gray4,
        textAlign: 'left'
    },
    cardItemValue: {
        color: theme['light'].colors.dark,
        marginBottom: 0
    },
    collapsedButton: {
        width: 42,
        height: 42,
        borderRadius: 42,
        backgroundColor: theme['light'].colors.tertiary,
        shadowColor: theme['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -15
    },
    collapsedButtonIcon: {
        fontSize: 14,
        color: theme['light'].colors.secondary,
    },
    homeItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    homeItem: {
        alignItems: 'center',
        // minWidth: 80,
        minWidth: 90,
        // maxWidth: '33.33%',
        flex: 1,
        marginVertical: 10,
        paddingHorizontal: 5,
        position: 'relative'
    },
    homeItemBadgeNew: {
        backgroundColor: theme['light'].colors.error,
        paddingVertical: 3,
        paddingHorizontal: 3,
        borderRadius: 3,
        position:'absolute',
        zIndex: 1,
        top: -7,
        right: 10
    },
    homeItemBadgeNewText: {
        fontSize: 10,
        color: theme['light'].colors.tertiary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    homeItemIconContainer: {
        marginBottom: 10,
    },
    homeItemImageContainer: {
        width: 42,
        height: 42,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme['light'].colors.secondary7,
    },
    homeItemImage: {
        width: 30,
        height: 30,
    },
    homeItemTitle: {
        fontSize: 10,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.gray9,
        textAlign: 'center'
    },

    homeItemsFullView: {
        flexDirection: 'column',
    },
    homeItemFullView: {
        minWidth: '50%',
        width: '50%',
        flexDirection: 'row',
    },
    homeItemIconContainerFullView: {
        marginBottom: 0,
    },
    homeItemTitleFullView: {
        fontSize: 14,
        marginLeft: 15
    },

    sectionContainer: {
        borderTopWidth: 1,
        borderColor: theme['light'].colors.gray2,
    },
    sectionContainerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 30,
        paddingBottom: 15,
    },
    sectionContainerHeaderContent: {
        flex: 1,
        marginRight: 15
    },
    sectionContainerHeaderTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'left'
    },
    sectionContainerHeaderSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.gray4,
        textAlign: 'left',
        marginTop: 5
    },
    sectionContainerHeaderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },
    sectionContainerHeaderButtonText: {
        fontSize: 12,
        color: theme['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    sectionContainerHeaderButtonIcon: {
        fontSize: 10,
        color: theme['light'].colors.secondary,
        marginLeft: 5,
        transform: [
            { scaleX: false ? -1 : 1 }
        ]
    },
    sectionContainerBody: {
        paddingBottom: 15
    },

    sectionContainerBodyLoading: {
        position: 'relative',
        padding: 30
    },

    whatsAppButton : {
        backgroundColor: '#25D366',
        borderWidth: 1,
        borderColor: 'white',
        width: 52,
        height: 52,
        borderRadius: 52,
        bottom: 25,
        right: 25,
        position: 'absolute',
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 5,
    },
    whatsAppButtonIcon: {
        color: 'white',
        fontSize: 24
    },

    completeVerificationContainer : {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    completeVerificationContainerVector: {
        width: 400,
        height: 200,
        marginBottom: 30
    },
    completeVerificationContainerTitle: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        marginBottom: 20,
        textAlign: 'center'
    },
    completeVerificationContainerSubTitle: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        marginBottom: 50,
        textAlign: 'center'
    },

    pullToRefreshToCardStatus: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    pullToRefreshToCardStatusIcon: {
        fontSize: 18,
        color: theme['light'].colors.dark,
        marginRight: 10
    },
    pullToRefreshToCardStatusText: {
        fontSize: 12,
        lineHeight: 18,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: theme['light'].colors.dark,
        textAlign: 'center'
    },

    sendMoneyList: {
        paddingHorizontal: 30,
        marginTop: 5,
        marginBottom: 10
    },
    sendMoneyListItem: {
        minWidth: 100,
        maxWidth: 120,
        alignItems: 'center',
        marginHorizontal: 5
    },
    sendMoneyListItemIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 42,
        backgroundColor: theme['light'].colors.secondary7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendMoneyListItemIcon: {
        fontSize: 16,
        color: theme['light'].colors.secondary,

    },
    sendMoneyListItemIconText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.secondary,
        // marginTop: 3
    },
    sendMoneyListItemTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.gray9,
        marginTop: 15,
        textAlign: 'center'
    },
    sendMoneyListItemAmount: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: theme['light'].colors.gray9,
        marginTop: 5,
        textAlign: 'center'
    },


    promotionContainer: {
        marginHorizontal: 0
    },
    promotionContainerHeader: {
        paddingHorizontal: 30
    },
    sliderDotContainer: {
        position: 'relative',
        top: 0,
        justifyContent: 'flex-end',
        paddingHorizontal: 30,
        marginTop: 10
    },
    sliderDot: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: theme['light'].colors.lighten
    },
    sliderActiveDot: {
        width: 12,
        height: 6,
        backgroundColor: theme['light'].colors.secondary
    },
    promotion: {
        // backgroundColor: '#D7F1FF',
        borderRadius: 10,
        position: 'relative',
        marginHorizontal: 30,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    promotionBackgroundLayer: {
        borderRadius: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    promotionSlider: {
        marginTop: 10,
        marginBottom: 20,
    },

    keyFeatureList: {},
    keyFeatureItemContainer: {
        paddingHorizontal: 30,
        // flexDirection: 'column'
    },
    keyFeatureItemBottomContainer: {
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 15,
        paddingTop: 15,
        paddingHorizontal: 15,
        marginHorizontal: 15,
        marginTop: -15,
        zIndex: -1,
        shadowColor: theme['light'].colors.gray4,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    keyFeatureItemBottomText: {
        flex: 1,
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.gray9,
        textAlign: 'left',
    },
    keyFeatureItemBottomButton: {
        // backgroundColor: 'green',
        paddingVertical: 10,
        borderRadius: 15,
    },
    keyFeatureItemBottomButtonText: {
       textAlign: 'center',
        textDecorationLine: 'underline'
    },
    keyFeature: {
        borderRadius: 15,
        backgroundColor: theme['light'].colors.tertiary,
        shadowColor: theme['light'].colors.gray4,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 5,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        position: 'relative',
        minHeight: 125
    },

    keyFeatureBackgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        opacity: 0.5
    },

    keyFeatureIconMainContainer: {},
    keyFeatureRightIconMainContainer: {},
    keyFeatureIconContainer: {
        marginRight: 15,
    },
    keyFeatureContent: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'flex-start'
    },
    keyFeatureTitle: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.gray9,
        textAlign: 'left'
    },
    keyFeatureSubTitle: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: themes.font.semiBold,
        fontWeight: '500',
        color: theme['light'].colors.dark,
        marginTop: 10,
        textAlign: 'left'
    },
    keyFeatureThirdTitle: {
        fontSize: 12,
        lineHeight: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.secondary8,
        marginTop: 10,
        textAlign: 'left',
    },
    keyFeaturePoweredBy: {
        paddingVertical: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        zIndex: 1,
        marginBottom: -10

    },
    keyFeaturePoweredByImage: {
        width: 128,
        height: 20,
    },

    keyFeatureItemCounterContainer: {
        paddingRight: 10
    },
    keyFeatureItemCounterInnerContainer: {
        flexDirection: 'row',
        marginVertical: 10
    },
    keyFeatureItemCounterImageContainer: {
        width: 26,
        height: 26,
        marginRight: 5
    },
    keyFeatureItemCounterImage: {
        width: '100%',
        height: '100%'
    },
    keyFeatureItemCounterText: {
        fontSize: 11,
        color: theme['light'].colors.dark,
        fontFamily: themes.font.medium,
        fontWeight: '600',
    },

    keyFeatureButton: {
        flex: 0,
        height: 30,
        paddingHorizontal: 15,
        marginTop: 15,
        borderRadius: 100
    },
    keyFeatureButtonText: {
        fontSize: 12
    },
    keyFeatureButtonIcon: {
        fontSize: 14
    },
    keyFeatureButtonInverse: {
        backgroundColor: theme['light'].colors.tertiary,
        borderColor: theme['light'].colors.tertiary,
    },
    keyFeatureButtonTextInverse: {
        color: theme['light'].colors.dark
    },
    keyFeatureButtonIconInverse: {
        color: theme['light'].colors.gray1
    },
    keyFeatureBadge: {
        backgroundColor: theme['light'].colors.error,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        position: 'absolute',
        right: 10,
        top: -10
    },
    keyFeatureBadgeText: {
        fontSize: 10,
        color: theme['light'].colors.tertiary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },

    keyFeatureInverse: {
        // backgroundColor: theme['light'].colors.secondary,
        // shadowColor: theme['light'].colors.tertiary,
    },
    keyFeatureIconMainContainerInverse: {},
    keyFeatureIconContainerInverse: {
        backgroundColor: theme['light'].colors.tertiary,
    },
    keyFeatureTitleInverse: {
        color: theme['light'].colors.dark,
    },
    keyFeatureSubTitleInverse: {
        color: theme['light'].colors.gray9,
    },
    keyFeatureThirdTitleInverse: {
        color: theme['light'].colors.gray9,
    },
    keyFeatureRightImageMainContainer: {
        marginLeft: 10
    },
    keyFeatureRightImage: {
        width: 65,
        height: 50,
    },


    homeList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        marginBottom: 30
    },
    homeListItemContainer: {
        width: "50%",
        paddingHorizontal: 15,

    },
    homeListItem: {
        borderRadius: 15,
        backgroundColor: theme['light'].colors.tertiary,
        shadowColor: theme['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        flex: 1,
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 5,
        padding: 15,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        position: 'relative',
        overflow: 'hidden',
    },
    homeListItemImageContainer: {
        marginBottom: 20
    },
    homeListItemImage: {
        width: 65,
        height: 50,
    },
    homeListItemContent: {
        // flex: 1
    },
    homeListItemText: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'center'
    },
    textBold: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    dark: {
        color: theme['light'].colors.dark,
    },
});
