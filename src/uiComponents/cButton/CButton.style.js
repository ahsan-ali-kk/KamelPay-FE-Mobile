import { StyleSheet } from 'react-native';
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({
    buttonStyle: {
        borderColor: theme['light'].colors.primary,
        borderWidth: 1,
        backgroundColor: theme['light'].colors.primary,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        position: 'relative',
        height: 45,
        flexDirection: 'row',
    },
    buttonText: {
        color: theme['light'].colors.tertiary,
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    buttonIcon: {
        color: theme['light'].colors.primary,
        fontSize: 10,
        marginLeft: 10,
    },
    buttonRightIcon: {
        marginRight: 10,
        marginLeft: 0,
    },
})
