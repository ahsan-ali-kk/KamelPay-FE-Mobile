import {StyleSheet} from "react-native";
import {themes} from "../../theme/colors";

export default StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: themes['light'].colors.secondary4,
        borderRadius: 8,
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
    },
    animatedIndicator: {
        position: "absolute",
        top: 0,
        bottom: 0,
        backgroundColor: themes['light'].colors.secondary,
        borderRadius: 5,
        zIndex: 0,
        marginVertical: 5
    },
    itemContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        padding: 5,
        paddingVertical: 10,
        marginVertical: 5,
        flexDirection: "row"
    },
    icon: {
        fontSize: 18,
        marginHorizontal: 5,
        color: themes['light'].colors.dark,
    },
    activeIcon: {
        color: themes['light'].colors.tertiary
    },
    text: {
        color: themes['light'].colors.dark,
        fontSize: 14,
        fontFamily: themes.font.regular,
        textAlign: 'center',
    },
    activeText: {
        color: themes['light'].colors.tertiary,
        fontFamily: themes.font.bold,
        fontWeight: '700'
    }
});
