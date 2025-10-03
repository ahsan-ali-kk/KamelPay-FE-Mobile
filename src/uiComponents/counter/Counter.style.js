import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    counterContainer: {
        marginBottom: 0,
        marginRight: 10
    },
    counterInnerContainer: {
        minHeight: 45
    },
    counterLabel: {
        marginBottom: 5
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,

    },
    counterButton: {
        width: 24,
        height: 24,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes['light'].colors.primary
    },
    counterButtonIcon: {
        color: themes['light'].colors.tertiary,
        fontSize: 18
    },
    counterValueContainer: {
        minWidth: 50,
        alignItems: 'center'
    },
    counterValue: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        fontWeight: '400',
    },
});
