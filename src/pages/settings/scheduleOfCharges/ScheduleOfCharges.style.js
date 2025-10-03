import {StyleSheet} from "react-native";
import {themes} from "../../../theme/colors";

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 15
    },

    tableContainer: {
    },
    borderTop: {
        borderTopWidth: 1,
        borderColor: themes['light'].colors.gray2
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderColor: themes['light'].colors.gray2
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: themes['light'].colors.gray2
    },
    flex_02: {
        flex: 0.2
    },
    flex_06: {
        flex: 0.6
    },

    tableHeader: {
        textAlign: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: themes['light'].colors.gray2
    },
    tableHeaderText: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.secondary,
    },
    tableBody: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: themes['light'].colors.gray2
    },
    tableInnerHeaderContainer: {
        flexDirection: 'row'
    },

    tableInnerHeader: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: themes['light'].colors.gray2,
        justifyContent: 'center'
    },

    tableInnerHeaderText: {
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        fontSize: 11,
        lineHeight: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
    },

    textBold: {
        fontFamily: themes.font.bold,
        fontWeight: '600',
    },

    tableInnerBodyContainer: {
        flexDirection: 'column'
    },
    tableInnerBodyRow: {
        flexDirection: 'row'
    }
});
