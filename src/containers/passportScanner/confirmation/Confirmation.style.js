import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        flexGrow: 1,
        paddingBottom: 10
    },

    headerInfoContainer: {
        backgroundColor: theme['light'].colors.primary,
        justifyContent: 'space-between',
        minHeight: 50,
        position: 'relative',
        zIndex: 1
    },

    listItem: {
        marginVertical: 10
    },
    listItemLabel: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        marginBottom: 10,
        textAlign: 'left'
    },
    listItemValue: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.primary,
        textAlign: 'left'
    },
    listItemValueRed: {
        color: theme['light'].colors.error,
    },
    userAndBalance: {
        marginHorizontal: 30,
        minHeight: 65,
    },

    userInfo: {
        flex: 1,
        marginRight: 15,
    },
    userInfoTitle: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        marginBottom: 7,
    },
    userInfoName: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark
    },

    balanceInfo: {
        justifyContent: 'space-between',
    },
    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    balanceHeaderButton: {
        marginRight: 5,
    },
    balanceHeaderButtonIcon: {
        fontSize: 18,
        color: theme['light'].colors.primary,
    },
    balanceInfoTitle: {
        fontSize: 9,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
    },
    balanceInfoBalance: {
        fontSize: 20,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.primary,
        flexDirection: 'row',
        textAlign: 'right',
        marginVertical: 3
    },
    balanceInfoBalanceTime: {
        fontSize: 9,
        textAlign: 'right',
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
    },
    balanceInfoBalanceCurrency: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginLeft: 10
    },

    section: {
        marginHorizontal: 30,
    },
    sectionHeader: {
        paddingTop: 15,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
    },
    sectionBody: {
        paddingTop: 20,
        position: 'relative'
    },

    cardStyle: {
        padding: 20,
        backgroundColor: theme['light'].colors.tertiary,
        shadowColor: theme['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 3,
        borderRadius: 10
    },
    cardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    cardButton2: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        flex: 1
    },
    cardButtonText: {
        fontSize: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
    },
    cardButtonImage: {
        width: 54,
        height: 54,
    },
    cardContent : {
        marginLeft: 20,
        flex: 1
    },
    cardContent2: {
        marginLeft: 0,
        marginTop: 10
    },
    cardContentImage: {
        width: 120,
        height: 15,
        marginTop: 5
    },

    cardSlider: {
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    seeBalance: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingLeft: 10,
    },
    seeBalanceIcon: {
        fontSize: 14,
        color: theme['light'].colors.primary,
    },
    seeBalanceText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
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
        width: 11,
        height: 6,
        backgroundColor: theme['light'].colors.primary
    },
    promotion: {
        backgroundColor: '#D7F1FF',
        borderRadius: 10,
        position: 'relative',
        marginHorizontal: 30,
        overflow: 'hidden',
        justifyContent: 'center',
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
        // backgroundColor: 'red',
        marginTop: 0,
        marginBottom: -10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    completeVerificationContainerVector: {
        width: 400,
        height: 200,
        marginBottom: 30
    },
    completeVerificationContainerTitle: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.primary,
        marginBottom: 10
    },
    completeVerificationContainerSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.primaryLight,
        marginBottom: 30
    },

    bottomButton: {
        paddingHorizontal: 30
    }

});
