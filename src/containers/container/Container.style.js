import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";
import {HEADER_HEIGHT} from "./Container";

export default StyleSheet.create({
    background: {
        position: 'relative',
        backgroundColor: theme['light'].colors.tertiary,
        overflow: 'hidden',
        flex: 1
    },
    backgroundVector: {
        width: 190.81,
        height: 313.43,
        position: 'absolute',
        zIndex: 1,
        left:  -81.81,
        bottom: -100,
        transform: [
            { scaleX: false ? -1 : 1 }
        ]
    },
    backgroundContainer: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        zIndex: 1
    },

    container: {
        flexGrow: 1,
        backgroundColor: 'transparent',
    },

    homeHeader: {
        paddingHorizontal: 30,
        paddingTop: 25,
        paddingBottom: 20,
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: HEADER_HEIGHT,
        backgroundColor: theme['light'].colors.tertiary,
        shadowColor: theme['light'].colors.dark,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0,
        shadowRadius: 4,
        elevation: 6,
        zIndex: 1
    },
    homeHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    homeHeaderContent: {
        flex: 1,
    },
    homeHeaderContentTitle: {
        fontSize: 20,
        fontFamily: themes.font.regular,
        color: theme['light'].colors.dark,
        marginTop: 15,
        textAlign: 'left'
    },
    homeHeaderContentSubTitle: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: theme['light'].colors.gray1,
        textAlign: 'left'
    },
    homeHeaderButtons: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },

    starUserContainer: {
        alignItems: 'flex-start'
    },
    starUser: {
        borderRadius: 20,
        backgroundColor: theme['light'].colors.starColor,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nonStarUser: {
        backgroundColor: theme['light'].colors.success,
    },
    starUserIcon: {
        width: 16,
        height: 16,
        marginRight: 5
    },
    starUserText: {
        fontSize: 10,
        fontFamily: themes.font.bold,
        color: theme['light'].colors.tertiary,
        textAlign: 'left'
    },
    underLineText: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: themes['light'].colors.tertiary,
        fontWeight: '600',
        marginLeft: 5
    },
    starUserTextContent: {
        flexDirection: 'row',
    }
});
