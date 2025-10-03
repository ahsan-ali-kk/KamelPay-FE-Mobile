import { StyleSheet } from 'react-native';
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({
    buttonContainer: {
        position: 'relative'
    },
    buttonStyle: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        flexDirection: 'row',
    },
    buttonIcon: {
        color: theme['light'].colors.secondary,
        fontSize: 20,
    },

    buttonWithBackground: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: theme['light'].colors.secondary7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonWithBackgroundIcon: {
        fontSize: 24,
        color: theme['light'].colors.secondary,
    },
    badge: {
        width: 7,
        height: 7,
        borderRadius: 10,
        backgroundColor: theme['light'].colors.error,
        position: 'absolute',
        right: 1
    }
})
