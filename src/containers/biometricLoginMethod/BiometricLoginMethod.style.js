import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

const Styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingBottom: 30
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vectorContainer: {},
    vectorContainerImage: {
        width: 115,
        height: 115,
        marginBottom: 50
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        marginBottom: 20
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: themes.font.regular,
        color: theme['light'].colors.dark,
        lineHeight: 30,
        paddingHorizontal: 50,
    }

});
export default Styles
