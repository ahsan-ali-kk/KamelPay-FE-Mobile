import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";
import {getLayoutDirection} from "../../../utils/methods";

export default StyleSheet.create({

    section: {},
    sectionHeader: {
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'left'
    },
    sectionBody: {},
    innerSection: {
        borderTopWidth: 1,
        borderColor: themes['light'].colors.lighten,
    },
    innerSectionHeader: {
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    innerSectionHeaderText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'left',
        flex: 1
    },
    innerSectionHeaderLeftText : {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.gray4,
        maxWidth: 100,
        textAlign: 'right',
    },
    innerSectionBody: {
        paddingVertical: 15,
    },
    innerSectionBodyScroll: {
        paddingHorizontal: 20,
        flexGrow: 0,
        flex: 0,
        // backgroundColor: 'yellow',
    },
    innerChildItem: {
        width: 150,
        flexDirection: 'column',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderColor: themes['light'].colors.gray10,
        // backgroundColor: 'green'
    },
    innerChildItemAvatar: {
        marginBottom: 15
    },
    innerChildItemAvatarContent: {
        width: '100%',
        height: '100%'
    },
    innerChildItemText: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        textAlign: 'center',
        flex: 1,
    },

    countryView: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    countryFlagContainer: {
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: theme['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
        marginBottom: 25
    },
    countryFlag: {
        width: 70,
        height: 47,
    },
    countryTitle: {
        fontSize: 16,
        lineHeight: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'left',
    },
    countrySubTitle: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        textAlign: 'left',
        marginTop: 15
    },

    rateView: {
        backgroundColor: theme['light'].colors.secondary,
        // borderColor: theme['light'].colors.secondary,
        // borderWidth: 1,
        padding: 20,
        marginHorizontal: 30,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rateViewLeft: {
        flex: 1,
        marginRight: 15
    },
    rateViewLeftTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.tertiary,
        textAlign: 'left',
        marginBottom: 15
    },
    rateViewLeftText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.tertiary,
        textAlign: 'left',
    },
    rateViewIcon: {
        // fontSize: 45,
        // color: theme['light'].colors.tertiary,
        width: 72,
        height: 72
    },
});
