import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({
    timeContainer : {
        marginBottom: 25,
        alignItems: 'center'
    },
    timeInnerContainer : {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    timeContainerText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: theme['light'].colors.gray1
    },
    timeContainerTextBlue: {
        color: theme['light'].colors.secondary5,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    }
});
