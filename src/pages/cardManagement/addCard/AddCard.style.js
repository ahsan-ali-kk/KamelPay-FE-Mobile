import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";

export default StyleSheet.create({

    vectorWithContent: {
        marginTop: 35,
        marginBottom: 35,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    vector: {
        width: 90,
        height: 75,
    },
    content: {
        flex: 1,
        marginBottom: 0,
        marginTop: 35

    },

    addNewCardContainer : {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    addNewCardContainerVector: {
        width: 200,
        height: 150,
        marginBottom: 30
    },
    addNewCardContainerTitle: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        marginBottom: 20,
        textAlign: 'center'
    },
    addNewCardContainerSubTitle: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        marginBottom: 50,
        textAlign: 'center'
    },

});
