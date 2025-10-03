import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        flexGrow: 1,
        // paddingBottom: 10,
    },

    submittedSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submittedSectionVector: {
        width: 115,
        height: 115,
        marginBottom: 50
    },
    submittedSectionTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        marginBottom: 20
    },
    submittedSectionSubTitle: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: theme['light'].colors.dark,
        lineHeight: 25,
        paddingHorizontal: 50,
    },

    eligibleAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30
    },
    eligibleAmountTitle: {
        flex: 1,
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        textAlign: 'left'
    },
    eligibleAmount: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.secondary,
    },
    takeAdvanceButton: {
        marginTop: -15,
        paddingVertical: 15,
        marginBottom: 15
    },
    takeAdvanceButtonText: {
        fontSize: 13,
        fontFamily: themes.font.semiBold,
        fontWeight: '600',
        color: theme['light'].colors.secondary,
    },
});
