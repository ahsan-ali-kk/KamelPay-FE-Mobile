import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        flexGrow: 1,
        paddingBottom: 10,
        paddingHorizontal: 15
    },
    textContent: {
        marginTop: 25,
        marginBottom: 30,
    },
    list: {},
    listItem: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        borderColor: themes['light'].colors.gray3
    },

    listItemContent: {
        flex: 1,
        marginRight: 15,
        alignItems: 'flex-start'
    },
    listItemTitle: {
        marginVertical: 3,
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        textAlign: 'left'
    },
    listItemText: {
        marginVertical: 5,
        fontSize: 12,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray1,
        textAlign: 'left'
    },

    listItemContentEnd: {
        alignItems: 'flex-end'
    },
    listItemTag: {
        backgroundColor: themes['light'].colors.lightBlue,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
        // marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemTagText: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.secondary,
    },

    redTag: {
        backgroundColor: themes['light'].colors.errorLight,
    },
    redTagText: {
        color: themes['light'].colors.error,
        fontFamily: themes.font.bold,
    },

    margin_top_10: {
        marginTop: 10
    },
    margin_bottom_10: {
        marginBottom: 10
    },

});
