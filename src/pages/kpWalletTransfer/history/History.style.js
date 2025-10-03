import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";

export default StyleSheet.create({

    list: {
        paddingBottom: 30,
        marginTop: 10
    },

    listItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
        paddingHorizontal: 30,
    },
    rowListItem: {
        flexDirection: 'row'
    },
    listItemCardVectorContainer: {
        alignItems: 'center',
        marginRight: 10,
    },
    listItemCardVector: {
        width: 30,
        height: 20,
    },

    listItemContain: {
        flexDirection: 'row',
        flex: 1,
    },
    listItemLeft: {
        flex: 1,
        marginRight: 15
    },
    listItemTitle: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
        marginBottom: 10
    },
    listItemAmount: {
        fontSize: 14,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.primary,
        marginBottom: 10,
        textAlign: 'left'
    },
    listItemDate: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray11,
        textAlign: 'left'
    },

    listItemRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },

    listItemTag: {
        backgroundColor: themes['light'].colors.lightBorderColor,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemTagText: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.primary,
    },

    countryView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    countryViewText: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
    },
    countryViewIcon: {
        fontSize: 12,
        color: themes['light'].colors.secondary,
        marginHorizontal: 5,
        // marginTop: -3
    },

    ticketNumberTitle: {
        fontSize: 12,
        color: themes['light'].colors.secondary,
        fontFamily: theme.font.bold,
        fontWeight: '700',
        marginBottom: 5,
    },
    ticketNumbers: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: theme.font.bold,
        color: themes['light'].colors.dark,
        fontWeight: '700',
    },

    date:{
        fontSize: 12,
        fontFamily: theme.font.bold,
        color: themes['light'].colors.gray9,
        fontWeight: '700',
        marginTop: 8
    }

});
