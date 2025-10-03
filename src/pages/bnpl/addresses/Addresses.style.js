import {Dimensions, StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";
const window = Dimensions.get('window');
const { width, height }  = window;

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },

    mapMarkerFixedContainer: {
        position: 'absolute',
        zIndex: 0,
    },

    markerImage: {
        width: 32,
        height: 37,
    },

    locationButtonContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30
    },

    fabButton: {
        width: 42,
        height: 42,
        borderRadius: 42,
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: theme['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    fabButtonIcon: {
        fontSize: 22,
        color: theme['light'].colors.secondary,
    },

    formContainer: {
        paddingHorizontal: 30,
        paddingVertical: 30,
        position: 'relative',
    },



    list: {},
    firstListItem: {
        borderTopWidth: 0,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: themes['light'].colors.lighten
    },
    listItemButton: {
        flexDirection: 'row',
        flex: 1
    },
    listItemCircle: {
        width: 16,
        height: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme['light'].colors.secondary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemActiveCircle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: theme['light'].colors.secondary,
    },
    listItemContent: {
        flex: 1,
        marginLeft: 15,
        marginRight: 5
    },
    listItemTitle: {
        // fontFamily: themes.font.bold,
        // fontWeight: '600',
        color: themes['light'].colors.dark,
        fontSize: 14,
        marginBottom: 5
    },
    listItemText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray9,
        textAlign: 'left',
        lineHeight: 16
    },

    listItemActions: {
        flexDirection: 'row'
    },
    listItemActionsButton: {
        marginLeft: 5,
        padding: 7
    },
    listItemActionsButtonIcon: {
        fontSize: 16
    }

});
