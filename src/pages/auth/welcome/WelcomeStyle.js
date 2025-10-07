import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../../theme/colors";
// import {getLayoutDirection} from "../../../utils/methods";

export default StyleSheet.create({
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        backgroundColor:'transparent',
        paddingHorizontal: 20,
    },
    slideImage: {
        width: 300,
        height: 250,
        marginBottom: 50
    },
    slideTitle: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'center',
        color: theme['light'].colors.dark,
        marginHorizontal: 20,
        marginBottom: 20
    },
    slideContent: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'center',
        color: theme['light'].colors.gray1,
        marginHorizontal: 20,
        lineHeight: 20
    },
    sliderDot: {
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: theme['light'].colors.gray2
    },
    sliderActiveDot: {
        width: 15,
        height: 8,
        borderRadius: 8,
        backgroundColor: theme['light'].colors.secondary
    },
    sliderDotContainer: {
        justifyContent: 'center',
        paddingVertical: 15,
        position: 'relative',
        top: 0
    },

    skipHeader: {
        alignItems: 'flex-end',
        zIndex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor:'transparent'
    },
    skipHeaderButton: {
        backgroundColor: 'transparent',
        minHeight: 'auto',
        paddingVertical: 0,
        marginTop: 0,
        flex: 0,
        borderWidth: 0
    },

    globalButtonText: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
        fontSize: 18,
        color: theme['light'].colors.primary
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor:'transparent',
        alignItems: 'flex-end',
        marginTop: 40
    },
    iconStyle: {
        transform: [
            { scaleX: false ? -1 : 1 }
        ]
    }
});
