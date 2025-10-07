import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({

    savingContainer: {
        marginTop: 15,
        flexDirection: 'row',
        padding: 25,
        backgroundColor: theme['light'].colors.secondary8,
        borderRadius: 15,
        shadowColor: theme['light'].colors.secondary6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        position: 'relative',
        overflow: 'hidden'
    },
    savingContainerLoading: {
        backgroundColor: theme['light'].colors.secondary8,
        color: 'white'
    },
    savingContainerContent: {
        flex: 1,
        marginRight: 25,
        justifyContent: 'center'

    },
    savingContainerTitle: {
        fontSize: 14,
        color: themes['light'].colors.gray2,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        textAlign: 'left',
        marginBottom: 15,
        lineHeight: 22
    },
    savingContainerAmount: {
        fontSize: 16,
        color: themes['light'].colors.tertiary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },
    savingContainerVector: {
        width: 82,
        height: 82
    },

    subscriptionBannerContainer: {
        marginTop: 15,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: theme['light'].colors.secondary8,
        borderRadius: 15,
        shadowColor: theme['light'].colors.secondary6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        position: 'relative',
        overflow: 'hidden'
    },
    subscriptionBannerTopLeftVector: {
        width: 100,
        height: 50,
        position: 'absolute',
        top: -3,
        left: -5,
        transform: [
            { scaleX: getLayoutDirection() ? -1 : 0 }
        ]
    },
    subscriptionBannerBottomRightVector: {
        width: 200,
        height: 50,
        position: 'absolute',
        bottom: 0,
        right: -3,
        transform: [
            { scaleX: getLayoutDirection() ? -1 : 0 }
        ]
    },
    subscriptionBannerContent: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 10,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    subscriptionBannerTitle: {
        fontSize: 12,
        color: themes['light'].colors.gray2,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: 5,
        lineHeight: 16
    },
    subscriptionBannerSubTitle: {
        fontSize: 8,
        color: themes['light'].colors.gray2,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left',
    },
    subscriptionBannerButtonStyle: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themes['light'].colors.tertiary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginTop: 10
    },
    subscriptionBannerButtonTextStyle: {
        fontSize: 10,
        color: themes['light'].colors.gray2,
        fontFamily: themes.font.medium,
        fontWeight: '500',
        textAlign: 'center',
    },
    subscriptionBannerVector: {
        width: 91,
        height: 100,
        marginLeft: 15,
        position: 'relative',
        bottom: -15
    },

    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1
    },
    bannerContainer: {
        marginTop: 15
    },
    bannerContainerSlide: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    bannerContainerImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover'
    },


    popularCategoryList: {
        marginHorizontal: -30,
        marginTop: 25
    },

    categoriesScrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        marginBottom: 5
    },
    categoryListTitle: {
        marginHorizontal: 0,
        marginBottom: 25
    },
    category: {
        minWidth: 150,
        height: 150,
        flex: 1,
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 15,
        padding: 15,
        position: 'relative',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: theme['light'].colors.gray6,
        margin: 5,
        shadowColor: theme['light'].colors.secondary6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    categoryHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        flex: 1
    },
    categoryHeaderImage: {
        width: 62,
        height: 62,
    },
    categoryBody: {},
    categoryBodyText: {
        fontSize: 12,
        color: themes['light'].colors.gray4,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'center'
    },
    categoryBodySubText: {
        fontSize: 12,
        marginTop: 10,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray7,
        textAlign: 'left'
    },

    vendorList: {},
    vendorListItem: {
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: themes['light'].colors.lighten,
        paddingVertical: 15,
    },
    vendorListItemBorderNone: {
        borderTopWidth: 0,
    },
    vendorListItemLogoContainer: {
        width: 62,
        height: 62,
        marginRight: 15,
        borderRadius: 5,
        overflow: 'hidden'
    },
    vendorListItemLogo: {
        width: 62,
        height: 62
    },
    vendorListItemContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    vendorListItemName: {
        fontSize: 14,
        fontFamily: theme.font.bold,
        color: themes['light'].colors.dark,
        fontWeight: '700',
        marginBottom: 5
    },
    vendorListItemSubTitle: {
        fontSize: 14,
        fontFamily: theme.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginBottom: 5
    },
    vendorListItemAddress: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        lineHeight: 15,
        textAlign: 'left'
    },
    vendorListItemTag: {
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        backgroundColor: themes['light'].colors.error,
        color: themes['light'].colors.tertiary,
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 5,
        lineHeight: 20,
        overflow: 'hidden',
    },
    vendorListItemRightContent: {
        marginLeft: 5,
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderColor: themes['light'].colors.lighten,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 60
    },
    vendorListItemRightContentIcon: {
        fontSize: 18,
        fontFamily: theme.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary,
        marginBottom: 10
    },
    vendorListItemRightContentText: {
        fontSize: 12,
        fontFamily: theme.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark
    },
    vendorListItemRightContentIconImage: {
        width: 25,
        height: 29,
        marginBottom: 10
    },

    skuItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    skuItemContent: {
        marginLeft: 15
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
        fontWeight: '400',
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
        fontWeight: '400',
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
        fontWeight: '400',
        color: themes['light'].colors.gray7,
        textAlign: 'left'
    },

    qrAndPinContainer: {
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingVertical: 15,
        flex: 1
    },
    savingsLogoContainer: {
        alignItems: 'center'
    },
    savingsLogo: {
        margin: 0,
        width: 200,
        height: 50,
    },
    qrAndPinTop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    qrAndPinTopTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        textAlign: 'center',
        marginBottom: 15
    },
    qrAndPinTopImageContainer: {
        padding: 10,
        borderRadius: 15,
        borderWidth:1,
        borderColor: themes['light'].colors.secondary7,
    },
    qrAndPinTopImage: {
        width: 200,
        height: 200,

    },
    qrAndPinBottom: {
        flex: 1,
        justifyContent: 'center'
    },

    headerView: {
        position: 'relative'
    },

    headerUpperView: {
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        zIndex: 1,
        alignItems: 'flex-end'
    },
    headerUpperViewButton: {
        backgroundColor: themes['light'].colors.tertiary,
        padding: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems:'center',
        shadowColor: theme['light'].colors.dark,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    headerUpperViewButtonIcon: {
        fontSize: 24,
        color: themes['light'].colors.gray4
    },
    headerUpperViewButtonIconActive: {
        color: themes['light'].colors.error
    },
    headerViewImage: {
        width: '100%',
        height: 205
    },

    headerDescription: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray7,
        marginHorizontal: 30,
        marginVertical: 15,
        textAlign: 'left'
    },

    modalVectorContainer: {
        width: 130,
        height: 130,
        backgroundColor: themes['light'].colors.tertiary,
        borderRadius: 130/2,
        marginTop: -80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalVector: {
        width: 100,
        height: 100,
    },

    modalTitle: {
        color: themes['light'].colors.primary,
    },

    modalSubText: {
        fontSize: 12,
        color: themes['light'].colors.dark,
        lineHeight: 20,
        marginVertical: 5
    },
    rates: {
        fontSize: 10,
        lineHeight: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        textAlign: 'left',
        marginTop: 20
    }
});
