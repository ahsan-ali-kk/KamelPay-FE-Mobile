import {StyleSheet} from 'react-native';
import {themes as theme} from "../../theme/colors";

export default StyleSheet.create({
    wrapper:  {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: theme['light'].colors.tertiary,
        zIndex: 3,
    },
    loading: {
        color: theme['light'].colors.secondary
    },
    loadingText: {
        fontSize: 16,
        color: theme['light'].colors.primary,
        fontFamily: theme.font.medium,
        marginTop: 15
    },
    animation: {
        width: 100,
        height: 100
    }
});
