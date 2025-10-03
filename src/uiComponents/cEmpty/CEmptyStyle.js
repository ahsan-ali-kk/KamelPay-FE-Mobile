import { StyleSheet } from "react-native";
import {themes} from "../../theme/colors";

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 25,
        // backgroundColor:'red'
    },
    icon: {
        width: 92,
        height: 92,
    },
    text: {
        marginTop: 25,
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.gray3,
        textAlign: 'center'
    },
    subText: {
        marginTop: 15,
        fontSize: 12,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.secondary,
        textAlign: 'center'
    },
});
