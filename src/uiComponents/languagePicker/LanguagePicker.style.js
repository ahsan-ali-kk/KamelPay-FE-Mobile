import { StyleSheet } from "react-native"
import {themes} from "../../theme/colors";

const style = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 30,
        backgroundColor: 'red'
    },
    pinView: {
        alignItems: "center",
    },
    buttonAreaContainer: {
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    buttonContainer: {
        marginBottom: 12,
        width: "33.33%",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonView: {
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 24,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    inputContainer: {
        flexDirection: "row",
        marginBottom: 25,
        alignItems: 'center',
    },
    inputView: {
        margin: 5,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    inputText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
    },

    inputFilledStyle: {
        backgroundColor: themes['light'].colors.primary,
    },
    inputEmptyStyle: {
        backgroundColor: themes['light'].colors.lightBorderColor,
        // backgroundColor: 'red',
        height: 5
    },
})
export default style
