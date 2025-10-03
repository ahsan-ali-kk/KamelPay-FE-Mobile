import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";
import {getLayoutDirection} from "../../../utils/methods";

export default StyleSheet.create({

    formContainer: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        flex: 1,
    },
    formInnerContainer: {
    },
    scrollContainer: {
        flexGrow: 1,
    },

    title: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'left',
        marginBottom: 30
    },

    inputStyle: {},
    inputInnerContainerStyle: {},
    inputLabel: {},
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
    inputCountryView: {
        alignItems: 'center'
    },
    subTitle: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 5,
    },

    separatorView: {
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
        marginHorizontal: -30,
        paddingHorizontal: 30,
    },

    rateTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 25,
        marginBottom: 10,

    },
    rateTitle: {
        color: theme['light'].colors.secondary5,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 14,
        // textAlign: 'center'
    },
    rateSubTitle: {
        fontSize: 13,
        color: theme['light'].colors.gray9,
        marginRight: 10
    },
    bottomFooterImage: {
        alignItems: 'center',
        marginTop: 15
    },

    bottomView: {
        paddingVertical: 25,
        paddingHorizontal: 30
    },
    inputsContainer: {
        flexDirection: 'row',
        alignItems:'center',
    },
    inputsContainerLeft: {
        flex: 1,
        // marginLeft: 15,
    },
    inputsCenterIconContainer: {
        // marginBottom: 25,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        width: 52,
        height: 52,
        borderRadius: 52/2,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        // backgroundColor: theme['light'].colors.tertiary,
        // shadowColor: theme['light'].colors.secondary,
        // shadowOffset: {
        //     width: 0,
        //     height: 3,
        // },
        // shadowOpacity: 0.10,
        // shadowRadius: 6,
        // elevation: 6,
        marginLeft: -45,
        marginRight: -15,
    },
    inputsCenterIcon: {
        color: theme['light'].colors.gray4,
        fontSize: 14
    },


    promoCodeView: {
        flexDirection: 'row'
    },
    sendingLimitContainerSubTitle: {
        fontSize: 13,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray7,
        textAlign: 'center',
        lineHeight: 20
    },
    sendingLimitContainer: {
        marginTop: 20,
        // marginBottom: 15
    },
    sendingLimitContainerTitle: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 15,
        marginTop: 10
    },
    sendingLimitContainerList: {
        borderWidth: 1,
        borderColor: themes['light'].colors.gray8,
        borderRadius: 10
    },
    sendingLimitContainerListItem: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.gray8,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    borderNone: {
        borderBottomWidth: 0
    },
    sendingLimitContainerListItemTitle: {
        color: theme['light'].colors.gray7,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 10,
        // minWidth: 0,
        flex: 1,
        textAlign: 'center',
        // marginRight: 15
    },
    sendingLimitContainerListItemValue: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 10,
        textAlign: 'center',
        flex: 1,
    },

    textButtonContainer: {
        alignItems: 'flex-end'
    },
    textButton: {
        padding: 5,
        marginTop: 10
    },
    textButtonText: {
        color: theme['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        fontSize: 14,
    },

    countryViewContainer: {
        paddingHorizontal: 30,
        marginTop: 15
    },
    countryViewHeader: {
        flexDirection: 'row'
    },
    countryViewHeaderTitle: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        fontSize: 16,
        flex: 1
    },
    countryViewHeaderButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        height: 'auto'
    },
    countryView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15
    },
    countryViewImage: {
        width: 42,
        height: 36,
    },
    countryViewContent: {
        flex: 1,
        marginLeft: 15
    },
    countryViewContentTitle: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 8
    },
    specialListItemRateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryViewContentSubTitle: {},
    countryViewContentRate: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 14,
        textAlign: 'left'
    },
    blueColor:{
        color: theme['light'].colors.secondary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    counterStyle: {
        // marginBottom: 30,
        marginBottom: 20,
        marginTop: -10,
        flexDirection: 'column-reverse'
    },
    counterInnerContainerStyle: {
        // marginBottom: 20,
        marginTop: 20,
        marginHorizontal: -10
    },
    counterIconItemStyle: {
        marginHorizontal: 10,
        alignItems: 'flex-start',
        width: 32,
        // flex: 1
    },
    counterIconStyle: {
        width: 32
    },
    counterTextStyle: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.medium,
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'left'
    },
    offerTextStyle: {
        marginBottom: 15
    }

});
