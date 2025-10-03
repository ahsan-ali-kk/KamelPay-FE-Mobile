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
    listItemHeader: {
        flexDirection: 'row',
    },
    listItemHeaderContent: {
        flex: 1,
        marginRight: 10
    },
    listItemHeaderText: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        textAlign: 'left',
        color: themes['light'].colors.gray9,
    },
    listItemHeaderTitle: {
        fontFamily: theme.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        marginBottom: 5
    },
    listItemHeaderSubTitle: {},
    listItemLeft: {},
    listItemHeaderButton: {
        paddingHorizontal: 0,
        paddingVertical: 10,
        borderRadius: 0,
        height: 'auto',
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    listItemHeaderButtonText: {
        color: themes['light'].colors.secondary,
    },
    listItemHeaderButtonIcon: {
        color: themes['light'].colors.secondary,
    },

    listItemBody: {
        borderTopWidth: 1,
        borderTopColor: themes['light'].colors.lighten,
        marginTop: 15,
        paddingTop: 15,
    },
    listItemBodyProducts: {
        marginHorizontal: -30,
        marginBottom: 0
    },
    listItemBodyProductsContainer: {
        paddingHorizontal: 30,
    },
    margin_left_0: {
        marginLeft: 0
    },
    listItemBodyProductItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginLeft: 20
    },
    listItemBodyProductItemImage: {
        width: 42,
        height: 42,
        marginRight: 10
    },
    listItemBodyProductContent: {
        flex: 1,
        alignItems: 'flex-start'
    },
    listItemBodyProductText: {
        fontSize: 10,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        textAlign: 'left',
        color: themes['light'].colors.gray9,
    },
    listItemBodyProductTitle: {
        fontFamily: theme.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        marginBottom: 5
    },
    listItemBodyProductStatus: {
        backgroundColor: themes['light'].colors.secondary2,
        marginTop: 5,
        paddingVertical: 7,
        paddingHorizontal: 7,
        borderRadius: 5,
    },
    listItemBodyProductStatusText: {
        fontSize: 11,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        textAlign: 'left',
        color: themes['light'].colors.secondary,
    },

    fontBold: {
        fontFamily: theme.font.bold,
        fontWeight: '600',
        fontSize: 14
    },


    productList: {
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
    },
    productListFirstItem: {
        borderTopWidth: 0,
    },
    productListItem: {
        paddingTop: 20,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: themes['light'].colors.lighten,
    },
    productListItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productListItemHeaderContainer: {
        flexDirection: 'row',
        flex:1
    },
    productListItemHeaderIcon: {
        fontSize: 14,
        color: themes['light'].colors.gray12,
        marginRight: 10
    },
    productListItemHeaderText: {
        fontSize: 13,
        fontFamily: theme.font.bold,
        fontWeight: '600',
        textAlign: 'left',
        color: themes['light'].colors.dark,
    },

    productListItemProduct: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        marginTop: 10
    },
    productListItemProductImage: {
        width: 72,
        height: 72,
        marginRight: 15
    },
    productListItemContent: {
        flex: 1,
    },
    grayText: {
        color: themes['light'].colors.gray12,
    },
    qtyAndAmount: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    qty: {
        flex: 1,
        marginRight: 10
    },
    productListItemContentTextBold: {
        fontFamily: theme.font.bold,
        fontWeight: '600',
    },
    productListItemContentText: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        textAlign: 'left',
        color: themes['light'].colors.dark,
        marginVertical: 4
    },
});
