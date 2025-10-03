import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        paddingHorizontal: 15,
        flexGrow: 1,
        paddingBottom: 10
    },

    userImagePContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    userImageContainer: {
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: theme['light'].colors.dark,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 2,
        borderColor: themes['light'].colors.tertiary,
        borderRadius: 82/2,
    },
    userImage: {
        width: 82,
        height: 82,
        borderRadius: 82/2,
    },

    list: {
        marginTop: 5,
        marginHorizontal: -15,
    },

    twoListItem: {
        flexDirection: 'row',
    },

    listItem: {
        paddingVertical: 15,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
        flex: 1,
        marginHorizontal: 15,
        marginBottom: 10
    },

    noBorder: {
        borderBottomWidth: 0
    },

    listItemTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        marginBottom: 15,
        textAlign: 'left'
    },

    listItemValue: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left'
    },

    listHeader: {
        paddingVertical: 10,
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    listHeaderText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        flex: 1,
        textAlign: 'left'
    },

    listHeaderButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    listHeaderButtonText: {
        fontSize: 13,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary,
        textDecorationLine: 'underline'
    },


    bottomButton: {
        marginHorizontal: 30,
        marginVertical: 20
    }

});
