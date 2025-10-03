import { StyleSheet } from "react-native"
import {themes as theme, themes} from '../../theme/colors';

const style = StyleSheet.create({
    videoWrapper: {
        position: 'relative',
        // backgroundColor: 'yellow',
        borderRadius: 10/2,
        overflow: 'hidden',
        height: 287,
        justifyContent: 'center',
        alignItems: 'center',
    },

    videoWrapperLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoWrapperButton: {
        // backgroundColor: 'red',
        position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        // backgroundColor: 'ligh'
    },
    videoWrapperButtonImage: {
        width: 100,
        height: 100,
        color: themes['light'].colors.secondary
    },

    playButton: {
        position: 'absolute',
        zIndex: 1,
        margin: 'auto'
    },
    playButtonIcon: {
        fontSize: 62,
        color: themes['light'].colors.secondary,
    },

    muteButton: {
        width: 32,
        height: 32,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: themes['light'].colors.secondary,
        shadowColor: theme['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    muteButtonIcon: {
        fontSize: 18,
        color: themes['light'].colors.primary,
    },

    bufferingView: {
        position: 'absolute',
        zIndex: 1,
        margin: 'auto'
    }
});
export default style
