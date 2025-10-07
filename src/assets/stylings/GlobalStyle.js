import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";
// import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({

    fullContainer: {
        flex: 1,
        backgroundColor: themes['light'].colors.tertiary,
    },

    //input style
    inputContainer: {
        marginBottom: 25,
    },
    inputLabel: {
        fontSize: 14,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: 15
    },
    inputSubLabel: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        marginBottom: 15,
        marginTop: -5,
        textAlign: 'left',
    },
    inputStyle: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        textAlign: false ? 'right' : 'left',
        fontFamily: themes.font.regular,
        fontWeight: '400',
        flex: 1,
        paddingHorizontal: 12,
        minHeight: 50,
    },
    inputTextStyle: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left'
    },
    inputInnerContainer: {
        position: 'relative',
        borderWidth: 0.5,
        borderColor: themes['light'].colors.gray3,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 50,
    },

    inputRightIconButton: {
        padding: 5,
        borderRadius: 100,
        marginRight: 10
    },

    inputLeftIconButton: {
        padding: 5,
        borderRadius: 100,
        marginLeft: 10,
        // marginLeft: getLayoutDirection() ? 0 : 10,
        // marginRight: getLayoutDirection() ? 10 : 0,
    },

    inputIconButton: {
        zIndex: 1,
        padding: 5,
        marginLeft: 10,
        // marginLeft: getLayoutDirection() ? 0 : 10,
        // marginRight: getLayoutDirection() ? 10 : 0,
    },
    inputIcon: {
        fontSize: 16,
        color: themes['light'].colors.gray3
    },

    inputRightButton: {
        paddingHorizontal: 15,
        marginRight: 3,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    inputRightButtonText: {
        fontSize: 12
    },

    errorTextStyle: {
        color: themes['light'].colors.danger,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginTop: 10,
        fontSize: 12,
        textAlign: 'left'
    },
    lastInput: {
        marginBottom: 10
    },

    countryView: {
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderRightWidth: 1,
        // borderRightWidth: getLayoutDirection() ? 0 : 1,
        // borderLeftWidth: getLayoutDirection() ? 1 : 0,
        borderColor: themes['light'].colors.primaryLighten,
        paddingRight: 15,
    },
    countryViewLoading: {
        color: theme['light'].colors.primary,
    },
    countryViewImage: {
        width: 24,
        height: 12,
        borderRadius: 2,
        resizeMode: 'contain',
    },
    countryViewText: {
        color: theme['light'].colors.dark,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        fontSize: 14,
        marginLeft: 15,
        // marginLeft: getLayoutDirection() ? 0 : 15,
        // marginRight: getLayoutDirection() ? 15 : 0,
    },

    countryCurrencyText: {
        color: theme['light'].colors.dark,
        fontFamily: theme.font.bold,
        fontWeight: '400',
        fontSize: 12,
        marginLeft: 15,
        marginTop: 2
    },

    listHeader: {
        marginHorizontal: 30,
    },

    listHeaderInputContainer: {
        marginTop: 20,
        marginBottom: 10
    },

    listHeaderInputStyle: {
        backgroundColor: themes['light'].colors.tertiary
    },
    listHeaderInputInnerContainer: {
        backgroundColor: themes['light'].colors.tertiary,
        borderColor: themes['light'].colors.gray3
    },
    listHeaderButtonContainer: {
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: themes['light'].colors.lighten,
        marginHorizontal: -30,
        paddingHorizontal: 30,
        alignItems: 'flex-start'
    },
    listHeaderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    listHeaderButtonIcon: {
        fontSize: 12,
        color: themes['light'].colors.primary,
        marginRight: 10
    },
    listHeaderButtonText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.primary,
    },
    listHeaderButtonSecondary: {
        backgroundColor: themes['light'].colors.secondary7,
    },
    listHeaderButtonSecondaryColor: {
        color: themes['light'].colors.secondary
    },

    list: {
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themes['light'].colors.gray3,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 20
    },
    listItemIconContainer: {},
    listItemIcon: {},
    listItemText: {
        flex: 1,
        marginLeft: 20,
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left'
    },

    pageTitle: {
        fontSize: 20,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary,
        marginVertical: 15,
        marginHorizontal: 30,
        paddingRight: 30,
        textAlign: 'left'
    },
    listSecondHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        marginTop: 20,
        marginBottom: 20
    },

    listSecondHeaderRightImage: {
        width: 100,
        height: 12,
        marginRight: 30,
    },

    listTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginTop: 30,
        marginBottom: 10,
        marginHorizontal: 30,
        textAlign: 'left'
    },
    listSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        marginBottom: 10,
        marginHorizontal: 30,
        textAlign: 'left'
    },

    listFooterButton: {
        marginHorizontal: 30,
        marginVertical: 20
    },

    headerInfoContainer: {
        backgroundColor: theme['light'].colors.primary,
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
    },

    paddingHorizontal_30: {marginHorizontal: 30},
    marginHorizontal_0: {marginHorizontal: 0},
    paddingHorizontal_0: {paddingHorizontal: 0},
    errorBorder: {
        borderColor: themes['light'].colors.danger,
    },


    cardListTitle: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        fontSize: 18,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.secondary,
    },
    cardListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginVertical: 15,
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: theme['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 5
    },
    cardListItemIcon: {
        fontSize: 28,
        marginRight: 15,
        color: themes['light'].colors.primary,
    },
    cardListItemText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.text,
        textAlign: 'left'
    },

    twoInputsView: {
        flexDirection: 'row',
        marginHorizontal: -15
    },
    twoInputsViewContainer: {
        flex: 1,
        marginHorizontal: 15
    },

    listItemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemActionButton: {
        padding: 5,
        marginLeft: 10,
        backgroundColor: themes['light'].colors.tertiary,
    },
    listItemActionButtonIcon: {
        fontSize: 16,
        color: themes['light'].colors.secondary,
    },

    // redButton: {
    //     backgroundColor: 'rgba(238, 59, 53, 0.2)',
    // },
    // redButtonIcon: {
    //     color: 'red',
    // },


    bottomHalfModalSafeArea: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingHorizontal: 0
    },

    bottomHalfModal: {
        justifyContent: 'flex-end',
        paddingHorizontal: 0
        // marginBottom: -20,
        // marginHorizontal: -20,
    },
    bottomHalfModalContainer: {
        borderRadius: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 40
    },
    bottomHalfModalTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginTop: 15,
    },
    bottomHalfModalSubTitle: {
        fontSize: 14,
        marginTop: 10,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
    },
    bottomHalfModalLoadingView: {
        paddingVertical: 15
    },

    listSecondHeader2: {
        marginBottom: 15
    },
    listSecondHeaderTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary,
    },

    bottomView: {
        paddingVertical: 25,
    },

    toggleView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30
    },
    toggleViewText: {
        flex: 1,
        // marginLeft: getLayoutDirection() ? 15 : 0,
        // marginRight: getLayoutDirection() ? 0 : 15,
        marginRight: 15,
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left'
    },

    margin_top_15: {
        marginTop: 15
    },
    margin_bottom_15: {
        marginBottom: 15
    },

    margin_horizontal_0: {
        marginHorizontal: 0
    },
    margin_horizontal_minus_30: {
        marginHorizontal: -30
    },
    margin_horizontal_minus_15: {
        marginHorizontal: -15
    },
    margin_bottom_0: {
        marginBottom: 0
    },
    margin_horizontal_minus_25: {
        marginHorizontal: -25
    },
    margin_horizontal_30: {
        marginHorizontal: 30
    },
    padding_horizontal_30: {
        paddingHorizontal: 30
    },
    padding_vertical_30: {
        paddingVertical: 30
    },
    padding_vertical_20: {
        paddingVertical: 20
    },
    padding_vertical_15: {
        paddingVertical: 15
    },
    padding_vertical_10: {
        paddingVertical: 10
    },
    padding_vertical_0: {
        paddingVertical: 0
    },

    padding_bottom_15: {
        paddingBottom: 15
    },
    padding_bottom_20: {
        paddingBottom: 20
    },
    padding_bottom_25: {
        paddingBottom: 25
    },
    padding_bottom_30: {
        paddingBottom: 30
    },


    countryName: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
    },

    swipeUpView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    swipeUpViewText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary5,
    },
    swipeUpViewIcon: {
        fontSize: 12,
        color: themes['light'].colors.secondary5,
        marginLeft: 10
    },

    centerModalLogoKSContainer: {
        alignItems: 'center',
        marginBottom: 15
    },
    centerModalLogoKS: {
        width: 200,
        height: 50
    },
    centerModalCenterView : {
        backgroundColor: themes['light'].colors.overlay,
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    centerModalCenterViewContainerScroll: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    centerModalCenterVectorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerModalCenterVector: {
        width: 100,
        height: 100
    },

    centerModalCenterViewTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        textAlign: 'center',
        marginBottom: 25,
        marginTop: 15,
        lineHeight: 22
    },
    centerModalCenterViewSubTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'center',
    },
    centerModalCenterViewBody: {
        marginBottom: 30
    },
    centerModalCenterViewContainer: {
        padding: 30,
        borderRadius: 15,
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: theme['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
        position: 'relative'
    },
    centerModalCenterViewButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1
    },
    centerModalCenterViewButtonIcon: {
        fontSize: 20,
        color: themes['light'].colors.gray8,
    },
    topTabMainContainer: {
        flex: 1
    },
    topTabBarLabelStyle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    topTabBarStyle: {
        borderTopWidth: 1,
        borderColor: theme['light'].colors.gray2,
    },
    topTabBarIndicatorStyle: {
        backgroundColor: themes['light'].colors.secondary,
    },

    flex_1: {
        flex: 1
    },
    flex_grow_1: {
        flexGrow: 1,
    },

    customTabContainer: {
        flexDirection: 'row',
        backgroundColor: themes['light'].colors.tertiary,
        borderTopWidth: 1,
        borderColor: theme['light'].colors.gray2,
    },
    customTabItem: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: theme['light'].colors.gray2,
    },
    activeCustomTabItem: {
        borderBottomWidth: 2,
        borderColor: theme['light'].colors.secondary,
    },
    customTabItemText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
    },
    activeCustomTabItemText: {
        color: themes['light'].colors.secondary,
    },

    promotionModalContainer: {},
    promotionModalContainerHeader: {
        margin: -30,
    },
    promotionModalContainerHeaderImage: {
        width: '100%',
        minHeight: 350,

    },
    promotionModalContainerBody: {
        paddingTop: 25
    },
    promotionModalContainerBodyTitle: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginBottom: 15
    },
    promotionModalContainerBodyParagraph: {
        fontSize: 12,
        lineHeight: 20,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    promotionModalContainerFooter: {
        marginTop: 30
    },

    bottomButtonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginVertical: 20
    },
    bottomButton: {
        flex: 1,
        marginHorizontal: 10
    },


    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 52,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes['light'].colors.secondary,
    },
    avatarContainerText: {
        fontSize: 9,
        fontFamily: themes.font.bold,
        fontWeight: '500',
        color: themes['light'].colors.tertiary,
        textAlign: 'center',
    },

    itemTextStyle: {
        fontFamily: themes.font.bold,
        fontWeight: '500',
        fontSize: 12,
    },
    cardVector: {
        width: 37.36,
        height: 23.91,
        borderRadius: 3,
        overflow: 'hidden',
    },



    cardView: {
        flexDirection: 'row',
        paddingVertical: 23,
        paddingHorizontal: 20,
        marginHorizontal: 30,
        marginVertical: 15,
        borderRadius: 10,
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: themes['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 5,
    },
    cardViewLeft: {
    },
    cardViewCenter: {
        flex: 1,
        marginHorizontal: 15,
        justifyContent: 'center',
    },
    cardViewCenterTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },

    cardViewCenterSubTitle: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: themes.font.regular,
        fontWeight: '500',
        color: themes['light'].colors.gray4,
        textAlign: 'left',
        marginTop: 10,
    },
    cardViewRight: {},

    section: {
        borderTopWidth: 1,
        borderTopColor: themes['light'].colors.gray2,
        paddingVertical: 10
    },
    sectionHeader: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        // backgroundColor: 'red'
    },
    sectionHeader2: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        // backgroundColor: 'red'
    },
    sectionHeaderText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },
    sectionBody: {
        paddingHorizontal: 30,
    },
    sectionBodyList: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    sectionBodyListItem: {
        flexDirection: 'column',
        marginVertical: 5,
        paddingRight: 10,
        width: '50%'
    },
    sectionBodyListItemFile: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sectionBodyListItemFileTitle: {
        flex: 1,
        marginBottom: 0,
        marginHorizontal: 15
    },
    sectionBodyListItemFileButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
    },
    sectionBodyListItemTitle: {
        fontSize: 13,
        fontFamily: themes.font.regular,
        fontWeight: '500',
        color: themes['light'].colors.gray4,
        textAlign: 'left',
        marginBottom: 10
    },
    sectionBodyListItemText: {
        fontFamily: themes.font.regular,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        lineHeight: 16
    },

    breakItem: {
        flexBasis: '100%',
        height: 0,
    },
    fullView: {
        width: '100%'
    },
    borderNone: {
        borderTopWidth: 0,
    },

    topBorder: {
        borderTopWidth: 1,
        borderColor: themes['light'].colors.gray2,
    },


    shortInfoModalContainer: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginVertical: 20

    },
    shortInfoModalIconContainer: {
        width: 67,
        height: 67
    },
    shortInfoModalIcon: {
        fontSize: 34
    },
    shortInfoModalTitle: {
        fontSize: 16,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        lineHeight: 20,
        textAlign: 'center'
    },
    shortInfoModalText: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginTop: 25,
        lineHeight: 20,
        textAlign: 'center'
    },
    boldText: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },

    shortInfoModalButtons: {
        flexDirection: 'row'
    },
    shortInfoModalButton: {
        flex: 1,
    },
    shortInfoModalContainerBody: {
        width: '100%',
        marginTop: 30
    },

    coolingOffPeriodContainer: {
        marginTop: 40
    },
    coolingOffPeriodText: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    }
});
