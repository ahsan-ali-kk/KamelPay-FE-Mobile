import {StyleSheet} from "react-native";
import {themes} from "../../../theme/colors";

export default StyleSheet.create({

    container: {
        flexGrow: 1,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    sectionHeaderLeft: {
        flex: 1,
        marginRight: 15
    },

    addressItem: {
        paddingHorizontal: 30,
    },
    addressItemText: {
        fontSize: 13,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray9,
        textAlign: 'left',
        lineHeight: 16,
        marginVertical: 2.5
    },
    addressItemTitle: {
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        marginBottom: 5
    },

    addAddressButtonContainer: {
        alignItems: 'flex-start',
        paddingTop: 10,
        marginBottom: 10
    },
    addAddressButton: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        borderWidth: 0,
        height: 'auto',
        paddingVertical: 10,
    },
    addAddressButtonIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 12,
    },
    addAddressButtonText: {
        color: themes['light'].colors.secondary,
        fontSize: 12,
    },

    orderSummeryItem: {
        paddingHorizontal: 30,
        flexDirection: 'row',
    },
    orderSummeryItemText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray9,
        textAlign: 'left',
        lineHeight: 16,
        marginVertical: 2.5,
        flex: 1,
        marginRight: 15
    },
    orderSummeryItemLeftText: {
        flex: 0,
        marginRight: 0
    },

});
