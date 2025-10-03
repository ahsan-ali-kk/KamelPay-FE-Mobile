import {Platform, StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    listPay: {
        marginTop: 20
    },
    listPayItem: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        borderBottomWidth: 0.5,
        borderBottomColor: themes['light'].colors.gray3,
        paddingVertical: 15,
    },
    listPayItemTitle: {
        flex: 1,
        marginRight: 15,
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left'
    },
    listPayItemValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: 14,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },

    listHeader: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listHeaderIconContainer: {
        width: 67,
        height: 67,
        marginVertical: 20,
    },
    listHeaderImage: {
        width: 67,
        height: 67,
        marginVertical: 20,
    },
    listHeaderIcon: {
        fontSize: 30,
    },
    listHeaderText: {
        fontSize: 16,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left'
    },

    skuList: {
        marginHorizontal: -5,
        marginBottom: 15,
        flex: 1,
    },
    skuInnerList: {
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skuInnerList2: {
        flexGrow: 1,
        paddingHorizontal: 25
    },
    skuScrollContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    skuItemContainer: {
        width: '100%',
    },
    skuItem: {
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 15,
        padding: 15,
        height: 'auto',
        position: 'relative',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: theme['light'].colors.gray8,
        margin: 5,
        alignItems: 'center'
    },
    skuItemIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 15
    },
    skuItemImage: {
        width: 30,
        height: 30,
    },
    skuItemIcon: {
        fontSize: 16
    },
    skuItemContent: {
        flex: 1,
        flexDirection: 'column'
    },
    skuItemTitle: {
        fontSize: 12,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        lineHeight: 20,
        textAlign: 'left'
    },

    confirmHeader: {
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 35,
        paddingBottom: 50,
        backgroundColor: themes['light'].colors.tertiary,
    },
    confirmHeaderIconContainer: {
      marginBottom: 15,
        width: 52,
        height: 52
    },
    confirmHeaderImage: {
        width: 67,
        height: 67,
        marginBottom: 15,
        borderRadius: 10
    },
    confirmHeaderTitle: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'center'
    },

    confirmSafeAreaViewStyle: {
        backgroundColor: themes['light'].colors.tertiary,
    },

    //not using//
    confirmScroll: {
        flexGrow: 1,
        backgroundColor: themes['light'].colors.gray10,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingVertical: 0,
        marginVertical: 0,
    },
    //not using//
    confirmInfoScrollView: {
        flexGrow: 1,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: themes['light'].colors.gray10,
    },
    confirmInfoListHeaderText: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginVertical: 20,
        textAlign: 'left'
    },
    confirmInfoList: {},
    confirmInfoListItem: {
        flexDirection: 'row',
        marginBottom: 15
    },
    confirmInfoLastListItem: {
        marginBottom: 0
    },
    confirmInfoListItemText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 15,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left'
    },
    textRight: {
        textAlign: 'right'
    },
    primaryText: {
        color: themes['light'].colors.primary,
    },
    textBold: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },

    confirmInfoListSeparator: {
        height: 0.5,
        borderStyle: 'dashed',
        borderRadius: 1,
        borderWidth: 1,
        borderColor: themes['light'].colors.gray2,
        marginTop: 15,
        marginBottom: 30
    },
    confirmInfoListNormalSeparator: {
        height: 0.5,
        borderRadius: 1,
        borderBottomWidth: 1,
        borderColor: themes['light'].colors.gray2,
        marginTop: 15,
        marginBottom: 15,
        marginHorizontal: -30
    },

    bottomButtonContainer: {
        flexDirection: 'column',
        paddingHorizontal: 30,
        marginVertical: 20
    },
    grayBottomButtonContainer: {
        flexDirection: 'column',
        paddingHorizontal: 30,
        backgroundColor: themes['light'].colors.gray10,
    },

    shortInfoModalContainer: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginVertical: 20

    },
    shortInfoModalIconContainer: {
        width: 67,
        height: 67
    },
    shortInfoModalIcon: {
        fontSize: 34
    },
    shortInfoModalText: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginTop: 25,
        lineHeight: 20,
        textAlign: 'center'
    },
    boldText: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },

    overviewContainer: {
        flex: 1
    },
    overviewBackgroundLayer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 0
    },
    overviewBackgroundLayerTop: {
        flex: 1,
        backgroundColor: themes['light'].colors.tertiary
    },
    overviewBackgroundLayerBottom: {
        flex: 1,
        backgroundColor: themes['light'].colors.gray10,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    overviewScroll: {
        flexGrow: 1,
        zIndex: 2
    },
    overviewScrollContent: {
        flexGrow: 1
    },

    checkBox: {
        flexDirection: 'column',
        alignItems:'flex-start',
        marginBottom: 30,
        // flex: 1
    },

});
