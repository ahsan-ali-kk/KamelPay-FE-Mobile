import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
// import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({

    scrollContainer : {
        paddingHorizontal: 15,
        position: 'relative',
        flexGrow: 1,
    },

    logoHeader: {
        alignItems: 'center',
        marginVertical: 50,
    },
    logoHeaderImage: {
        width: 230,
        height: 58,
    },

    titleAndText: {
        marginBottom: 50,
    },
    title: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'left',
    },
    secondTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'left',
    },
    thirdTitle: {
        fontSize: 20,
        textAlign: 'left',
    },
    text: {
        marginTop: 20,
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        lineHeight: 18,
        textAlign: 'left',
    },

    phoneNumberView: {
        flexDirection: 'row',
        marginTop: 20,
    },
    phoneNumber: {
        fontSize: 18,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.secondary,
        flex: 1,
        textAlign: 'left',
    },

    formContainer: {
        paddingHorizontal: 0,
        flex: 1,
        marginBottom: 20
    },
    formInnerContainer : {
        flexGrow: 1
    },
    textContainer: {
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    textContainerButton: {
        padding: 5
    },
    textContainerButtonText:  {
        color: theme['light'].colors.gray1,
        fontSize: 13,
        textAlign: 'left',
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        // marginBottom: 20,
    },
    linkText: {
        color: theme['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },

    otpContainer: {
        alignItems:'center',
        marginBottom: 40,
    },
    otpTitle: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginBottom: 20
    },
    otpInputView : {
        flex: 0,
        height: 52,
        marginBottom: 10,
        width: '100%',
    },
    smallOtpInputView: {
        width: 280,
    },
    codeInputFieldStyle: {
        borderWidth: 1,
        borderColor: themes['light'].colors.lighten,
        position: 'relative',
        fontSize: 18,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        borderRadius: 8,
        backgroundColor:  themes['light'].colors.tertiary,
        height: 50,
        marginHorizontal: 5,
        maxWidth: 50,
    },

    codeInputHighlightStyle: {
        borderColor: themes['light'].colors.secondary,
        borderWidth: 2,
        color: themes['light'].colors.secondary
    },

    centerView: {
        alignItems: 'center',
        marginBottom: 35
    },
    linkButtonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    linkButtonText: {
        fontSize: 14,
        color: themes['light'].colors.secondary5,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginRight: 10
    },
    linkButtonIcon: {
        fontSize: 18,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    bottomButton: {
        marginBottom: 30
    },

    optionItem: {
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: theme['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 6,
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginBottom: 25
    },
    optionItemIcon: {
        fontSize: 22,
        color: themes['light'].colors.primary,
        marginRight: 20
    },
    optionItemText: {
        fontSize: 14,
        color: themes['light'].colors.text,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },


    methodListTitle: {
        fontSize: 14,
        color: themes['light'].colors.lightText,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 20
    },
    methodList: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    methodItem: {
        marginHorizontal: 15,
        alignItems: 'center'
    },
    methodItemIconContainer: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes['light'].colors.primaryLighten,
        borderRadius: 10
    },
    methodItemIcon: {
        fontSize: 24,
        color: themes['light'].colors.primary,
    },
    methodItemTitle: {
        fontSize: 12,
        color: themes['light'].colors.primary,
        marginTop: 5,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },

    vectorContainer: {
        alignItems:'center',
    },
    confirmationVector: {
        width: 224,
        height: 166
    },

    bottomCard: {
        borderRadius: 15,
        borderWidth: 1,
        marginHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        marginBottom: 25,
        borderColor: themes['light'].colors.secondary2,
        backgroundColor: themes['light'].colors.gray6,
        height: 65
    },
    bottomCardImage: {
        width: 34,
        height: 25.87,
    },
    bottomCardText: {
        color: themes['light'].colors.secondary3,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginHorizontal: 20,
        flex: 1,
        textAlign: 'left',
    },
    bottomCardIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 14,
        transform: [
            { scaleX: false ? -1 : 1 }
        ]
    },

    cardContainer: {
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center'
    },
    cardContainerImage: {
        flex: 0,
        width: 300,
        height: 195,
        flexDirection: 'column',
        position: 'relative',
    },

    cardDetail: {
        marginTop: 50,
        marginBottom: 25
    },
    cardDetailBody: {
        marginTop: 30
    },
    cardDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardDetailHeaderIcon: {
        width: 57,
        height: 57,
        borderRadius: 57/2,
        backgroundColor: themes['light'].colors.secondary4,
        marginRight:  18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardDetailHeaderIconImage: {
        width: 33,
        height: 36.08,
    },
    cardDetailContent: {},
    cardDetailContentTitle: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'left',
    },
    cardDetailContentText: {
        fontSize: 12,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left',
    },

    separator: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 30
    },
    separatorText: {
        fontSize: 12,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        paddingHorizontal: 5
    },
    separatorLine: {
        flex: 1,
        backgroundColor: themes['light'].colors.gray3,
        height: 1
    },

    tipSection: {},
    tipSectionTitle: {
        fontSize: 12,
        color: themes['light'].colors.gray7,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left',
    },
    tipSectionSubTitle: {
        fontSize: 12,
        color: themes['light'].colors.gray4,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginVertical: 20,
        textAlign: 'left',
    },
    tipSectionItem: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center'
    },
    tipSectionItemIcon: {
        fontSize: 14,
        color: themes['light'].colors.gray4,
    },
    tipSectionItemText: {
        fontSize: 12,
        color: themes['light'].colors.gray4,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        flex: 1,
        marginLeft: 15,
        textAlign: 'left',
    },
    success: {
        color: themes['light'].colors.success,
    },
    error: {
        color: themes['light'].colors.error,
    },

    separateSection: {
        borderTopWidth: 1,
        borderColor: themes['light'].colors.lighten,
        paddingTop: 30,
        marginHorizontal: -30,
        paddingHorizontal: 30
    },
    separateSectionBorderHide: {
        borderColor: 'transparent',
    },
    separateSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    separateSectionHeaderTitle: {
        flex: 1,
        marginRight: 15,
        fontSize: 16
    },
    separateSectionHeaderButton: {
        paddingHorizontal: 15,
        height: 30,
        borderRadius: 8
    },
    separateSectionHeaderButtonText: {
        fontSize: 12
    },
    separateSectionHeaderButtonIcon: {
        fontSize: 12
    },

    inputView: {
        flex: 1,
        paddingLeft: 15,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        fontSize: 16,
        textAlign: false ? 'right' : 'left',
        minHeight: 50
    },

    scanBox: {
        borderWidth: 2,
        borderColor: theme['light'].colors.gray8,
        borderStyle: 'dashed',
        borderRadius: 8,
        backgroundColor: theme['light'].colors.gray10,
        paddingVertical: 35,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    scanBoxIcon: {
        color: themes['light'].colors.secondary,
        marginBottom: 10,
    },
    scanBoxText: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        fontSize: 16,
        marginBottom: 5,
        textAlign:'center'
    },
    scanBoxDescription: {
        marginTop: 5,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.gray1,
        fontSize: 12,
        textAlign:'center'
    },
});
