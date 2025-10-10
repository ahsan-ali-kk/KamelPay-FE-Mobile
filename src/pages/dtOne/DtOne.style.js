import {I18nManager, StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    categoryList: {},
    category: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        paddingHorizontal: 30,
        height: 'auto',
        position: 'relative',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: theme['light'].colors.lighten,
    },
    categoryHeader: {
        alignItems: 'center',
        overflow: 'hidden',
        width: 52,
        height: 52,
        borderRadius: 5,
        marginRight: 15
    },
    categoryHeaderImage: {
        width: '100%',
        height: '100%',
    },
    categoryBody: {
        flex: 1,
        justifyContent: 'center'
    },
    categoryBodyText: {
        fontSize: 12,
        lineHeight: 16,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },
    categoryBodySubText: {
        fontSize: 12,
        lineHeight: 16,
        marginTop: 5,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray7,
        textAlign: 'left'
    },

    skuItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    skuItemContent: {
        marginLeft: I18nManager.isRTL ? 0 : 15,
        marginRight: I18nManager.isRTL ? 15 : 0,
    },

    listItem: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
        paddingHorizontal: 30,
    },
    listItemContent: {
        flex: 1,
        marginLeft: 15
    },
    listItemTop: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    listItemTitle: {
        flex: 1,
        fontSize: 14,
        fontFamily: theme.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginRight: 15,
        textAlign: 'left'
    },
    listItemStatus: {
        backgroundColor: themes['light'].colors.lightBorderColor,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemStatusText: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        color: themes['light'].colors.primary,
        textAlign: 'left'
    },
    listItemBottom: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'flex-end',
    },
    listItemBottomCode: {
        flex: 1,
        marginRight: 15,
    },
    listItemLabel: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        color: themes['light'].colors.gray4,
        marginBottom: 10,
        textAlign: 'left'
    },
    listItemValue: {
        fontSize: 14,
        fontFamily: theme.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.primary,
        textAlign: 'left'
    },
    listItemDate: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray7,
        textAlign: 'left'
    },

});
