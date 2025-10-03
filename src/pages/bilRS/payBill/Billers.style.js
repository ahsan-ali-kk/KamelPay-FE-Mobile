import {StyleSheet} from "react-native";
import {themes} from "../../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        flexGrow: 1,
    },
    formContainer : {
        flexGrow: 1,
        paddingHorizontal: 30,
        // marginTop: 15,
    },


    billerInfo: {
        paddingTop: 15,
        paddingBottom: 20,
        justifyContent:'center',
        alignItems:'center',
    },
    billerInfoImage: {
        width: 64,
        height: 64,
        marginBottom: 15
    },
    billerInfoName: {
        fontSize: 14,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        // marginHorizontal: 35,
        textAlign:'center',
        marginBottom: 15
    },

    container: {
        paddingHorizontal: 30,
        flexGrow: 1,
        marginTop: 15
    },
    listPay: {},
    listPayItem: {
        flexDirection: 'row',
        marginBottom: 15
    },
    listPayItemText: {
        flex: 1,
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left'
    },
    textBold: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    mr_10: {
        marginRight: 10
    },
    textRight: {
        textAlign: 'right',
    },
    listPayItemTitle: {
        flex: 1,
        marginRight: 10,
        fontSize: 16,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left'
    },
    listPayItemValue: {
        fontSize: 16,
        color: themes['light'].colors.secondary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },

    listPayItemCenter: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 35
    },
    listPayItemCenterLabel: {
        fontSize: 14,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginBottom: 10
    },
    listPayItemCenterValue: {
        fontSize: 24,
        color: themes['light'].colors.secondary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },

    bottomButtonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginVertical: 20
    },
    bottomButton: {
        flex: 1,
        marginHorizontal: 10
    },
    error: {
        color: 'red',
    },

    skuListContainer: {
        paddingVertical: 10,
        // marginHorizontal: -20,
        marginTop: -10,
        // paddingHorizontal: 30
    },
    skuList: {
        // flexGrow: 1,
        // flex: 1,
        marginHorizontal: -10,
        // backgroundColor: 'red'
    },
    skuListMainContainer: {
        // flexDirection: 'row',
        // width: '100%',
        // height: 300,
        // marginBottom: 15,
        // flex: 1,
        flexGrow: 1,
    },
    skuItem: {
        backgroundColor: themes['light'].colors.tertiary,
        borderRadius: 11,
        // alignItems: 'center',
        // justifyContent: 'center',
        shadowColor: themes['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
        paddingVertical: 15,
        paddingHorizontal: 10,
        // marginLeft: 30,
        // width: 200,
        // maxWidth: 200,
        margin: 10,
        height: 'auto',
        position: 'relative',
        flexDirection: 'row',
        flex: 1,
    },
    skuItemImage: {
        width: 32,
        height: 32,
        // marginTop: 5,
        marginRight: 10,
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
        // textAlign: 'center',
        marginBottom: 5,
        textAlign: 'left'
    },
    skuItemText: {
        fontSize: 12,
        color: themes['light'].colors.primaryLight,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        // textAlign: 'center',
        marginBottom: 5,
        textAlign: 'left'
    },
    skuItemListItemText: {
        fontSize: 12,
        color: themes['light'].colors.primaryLight,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginBottom: 5,
        textAlign: 'left'
    },

    skuItemCheck: {
        width: 18,
        height: 18,
        borderRadius: 18,
        backgroundColor: themes['light'].colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: -5,
        top: -5
    },
    skuItemCheckIcon: {
        fontSize: 9,
        color: themes['light'].colors.tertiary,
    },

    sectionHeader: {
        marginBottom: 15
    },
    sectionHeaderText: {
        fontSize: 16,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },
});
