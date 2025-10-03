import { StyleSheet } from "react-native";
import {themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    checkBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        paddingVertical: 8
    },
    checkBoxView: {
        width: 16,
        height: 16,
        borderColor: themes['light'].colors.lightBorderColor,
        borderWidth: 0.5,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: themes['light'].colors.primary,
        marginRight: 10
    },
    checkedBoxView: {
        backgroundColor: themes['light'].colors.primary,
    },
    checkBoxViewFill: {
        width: 10.5,
        height: 10.5,
        backgroundColor: themes['light'].colors.primary,
        borderRadius: 3
    },
    checkBoxCheck: {
        fontSize: 10,
        color: themes['light'].colors.tertiary,
    },
    checkBoxTitleContainer: {
        flex: 1,
        // marginLeft: false ? 0 : 10,
        // marginRight: false ? 10 : 0,
        // flexDirection: 'row',
        alignItems: 'center',
        flexDirection: 'row',
    },
    checkBoxTitle: {
        fontSize: 12,
        lineHeight: 18,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },
    checkBoxSecondTitle: {
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textDecorationLine: 'underline',
        marginTop: 0,
    }
});
