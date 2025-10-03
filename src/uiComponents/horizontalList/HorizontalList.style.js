import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    horizontalList: {
        marginTop: 15,
        marginBottom: -10,
    },
    horizontalListTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginHorizontal: 30,
        marginBottom: 15,
        textAlign: 'left'
    },
    horizontalListScroll: {
        paddingHorizontal: 25
    },
    horizontalListItem: {
        alignItems: 'center',
        flex: 1,
        marginVertical: 10,
        minWidth: 120,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        position: 'relative',
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 15,
        shadowColor: theme['light'].colors.secondary6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    horizontalListItemIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    horizontalListItemIcon: {
        width: 40,
        height: 40,
    },
    horizontalListItemTitle: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        textAlign: 'center'
    },

});
