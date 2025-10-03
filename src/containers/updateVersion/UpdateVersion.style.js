import { StyleSheet } from 'react-native'
import {themes} from "../../theme/colors";

export default StyleSheet.create({

    viewContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'white',
    },
    viewInnerContainer: {
        paddingHorizontal: 30,
        paddingVertical: 25,
        flex: 1
    },

    contentVector: {
        width: 100,
        height: 100,
        marginBottom: 25,
    },

    contentContainer: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal: 15,
    },

    title : {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginBottom: 25,
        textAlign: 'center'
    },
    paragraph : {
        fontSize: 16,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray4,
        textAlign: 'center',
        lineHeight: 20
    },
});
