import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    pageTitle: {
        marginTop: 25
    },
    offerList: {
        flexDirection: 'row',
        backgroundColor: themes['light'].colors.secondary4,
        marginHorizontal: -30
    },
    offerListItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    separator: {
        width: 1,
        backgroundColor: themes['light'].colors.gray2,
    },
    offerListItemIcon: {
        fontSize: 18,
        marginRight: 15,
        color: themes['light'].colors.secondary,
    },
    offerListItemText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
    },
    codeView: {
        marginVertical: 35,
        flexDirection: 'column',
    },
    codeViewText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        textAlign: 'center',
        marginBottom: 20
    },
    codeViewButton: {
        borderWidth: 1,
        borderColor: themes['light'].colors.secondary,
        backgroundColor: themes['light'].colors.secondary,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: 'auto'
    },
    codeViewButtonText: {
        flex: 1,
        fontSize: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.tertiary,
        textAlign: 'center'
    },
    codeViewButtonIcon: {
        fontSize: 18,
        color: themes['light'].colors.tertiary,
    },

    termsView: {},
    termsViewTitle: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        textAlign: 'center',
        marginBottom: 15
    },
    termsViewText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'center',
        lineHeight: 20
    },

});
