import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        flexGrow: 1,
        // paddingBottom: 10,
    },

    cardContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center'
    },

    cardSection: {
      marginTop: 0
    },

    actionList: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginBottom: 20,
    },
    actionListItem: {
        backgroundColor: theme['light'].colors.tertiary,
        shadowColor: theme['light'].colors.primaryLight,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 15,
        flex: 1,
        alignItems: 'center'
    },
    actionListItemIcon: {
        fontSize: 28,
        color: themes['light'].colors.primary,
        marginBottom: 5
    },
    actionListItemTitle: {
        fontSize: 10,
        color: themes['light'].colors.primaryLight,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'center',
    },
    actionColumnList: {
        flexDirection: 'column',
        marginTop: 20,
        paddingHorizontal: 15,
        marginHorizontal: 15,
    },
    actionColumnListItem: {
        marginHorizontal: 0,
        paddingHorizontal: 25,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    actionColumnListItemIcon: {
        marginBottom: 0,
        fontSize: 22,
    },
    actionColumnListItemText: {
        flex: 1,
        textAlign: 'left',
        marginHorizontal: 15,
        fontSize: 14,
        color: themes['light'].colors.secondary,
    },
    cardsViewContainer: {
        alignItems: 'center',
        paddingVertical: 25
    },
    cardsViewContainerItem: {
        marginVertical: 25
    },

    content: {
        marginTop: 25
    },
    contentTitle: {
        fontSize: 14,
        color: themes['light'].colors.text,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginBottom: 10
    },
    contentDescription: {
        fontSize: 12,
        color: themes['light'].colors.primaryLight,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
});
