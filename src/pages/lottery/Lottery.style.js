import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    list: {
        paddingHorizontal: 30
    },

    campaignItem: {
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 15,
        position: 'relative',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: theme['light'].colors.gray6,
        shadowColor: theme['light'].colors.secondary6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginVertical: 15

    },
    campaignItemImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        position: 'relative'
    },
    campaignItemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    campaignItemContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    campaignItemTitleHeader: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    campaignItemTitle: {
        fontSize: 14,
        fontFamily: themes.font.medium,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        flex: 1,
        lineHeight: 20,
        textAlign: 'left',
        marginRight: 15
    },
    campaignItemPrice: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary,
        lineHeight: 20,
        textAlign: 'right',
    },
    campaignItemSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        flex: 1,
        lineHeight: 20,
        textAlign: 'left',
        marginBottom: 10
    },
    campaignItemTag: {
        backgroundColor: themes['light'].colors.error,
        paddingTop: 8,
        paddingBottom: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        position: 'absolute',
        right: 0,
        bottom: 15,
        zIndex: 1
    },
    campaignItemTagText: {
        fontSize: 10,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.tertiary,
    },

    campaignItem2: {
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 15,
        position: 'relative',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: theme['light'].colors.gray6,
        shadowColor: theme['light'].colors.secondary6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginVertical: 15,
        padding: 15
    },
    campaignItem2CountDown: {
        backgroundColor: themes['light'].colors.error,
        paddingTop: 8,
        paddingBottom: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        position: 'absolute',
        right: 0,
        top: 15,
        zIndex: 1
    },
    campaignItem2CountDownText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.tertiary,
    },
    campaignItem2Alert: {
        borderRadius: 7,
    },
    campaignItem2AlertText: {
        textAlign:'center',
        fontFamily: themes.font.bold,
    },
    campaignItem2ImageContainer: {
        width: '100%',
        height: 163,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        marginVertical: 10,
    },
    campaignItem2Image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    poweredBy: {
        // backgroundColor: themes['light'].colors.tertiary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        // borderRadius: 100,
        // borderTopRightRadius: 0,
        // borderBottomRightRadius: 0,
        // position: 'absolute',
        // right: 0,
        // bottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    poweredByImage: {
        width: 148,
        height: 24
    },
    campaignItem2Content: {
        flex: 1,
        alignItems: 'flex-start',
    },
    campaignItem2Tag: {
        backgroundColor: themes['light'].colors.lightYellow,
        paddingTop: 8,
        paddingBottom: 5,
        paddingHorizontal: 10,
        borderRadius: 11,
        zIndex: 1,
    },
    campaignItem2TagText: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '800',
        color: themes['light'].colors.dark,
    },
    campaignItem2Title: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.primary,
        flex: 1,
        lineHeight: 24,
        textAlign: 'left',
        marginTop: 10
    },
    campaignItem2SubTitle: {
        marginTop: 0,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        marginBottom: 10
    },
    campaignItem2TitlePrice: {
        color: '#1FC407',
        fontFamily: themes.font.bold,
        fontWeight: '600',
    },
    campaignItem2TitleHeader: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    campaignItem2Price: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary,
        lineHeight: 20,
        textAlign: 'right',
    },
    campaignItem2CounterWithButton: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 20
    },
    campaignItem2CounterWithButtonLeft: {
        flex: 1
    },


    progressBarContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    progressBarText: {
        fontSize: 11,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        marginTop: 8,
        textAlign: 'left'
    },
    progressBarBoldText: {
        fontFamily: themes.font.bold,
        fontWeight: '600',
    },
    progressBar: {
        width: '100%',
        backgroundColor: themes['light'].colors.lightBlue,
        height: 11,
        borderRadius: 11,
    },
    progressBarInnerContainer: {
        backgroundColor: themes['light'].colors.secondary,
        height: 11,
        borderRadius: 11
    },

    detailContainer: {
        flexGrow: 1,
        padding: 30
    },
    detailInnerContainer: {
        alignItems: 'flex-start',
        marginBottom: 10
    },

    detailImageSection: {
        width: '100%',
        height: 200,
        marginVertical: 10,
    },
    detailImageSectionImage:{
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden'
    },
    tabContainer: {},

    detailTitle: {},
    detailSubTitle: {
        marginBottom: 5,
    },

    tabBottomFooter: {
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    tabBottomFooterTitle: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        textAlign: 'left',
        marginBottom: 5
    },
    tabBottomFooterSubTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.green,
        textAlign: 'left',
        marginBottom: 5
    },
    tabBottomFooterLowerTitle: {
        fontSize: 8,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray7,
        textAlign: 'left',
    },

    winnerList: {
        marginVertical: 15
    },
    winnerListHeader: {
        marginBottom: 5,
        paddingVertical: 10
    },
    winnerListHeaderTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },
    noTopBorder: {
        borderColor: 'transparent',
    },
    winnerListItem: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: themes['light'].colors.lighten,
        paddingVertical: 10
    },
    winnerListItemContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 15
    },
    winnerListItemText: {
        fontSize: 13,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
        lineHeight: 16
    },
    winnerListItemTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.secondary,
        fontWeight: '700',
        marginBottom: 5
    },
    winnerListItemName: {
        fontSize: 13,
        marginBottom: 3
    },
    winnerListItemTicketNumber: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
    },

    liveDrawSection: {
        marginHorizontal: 30,
    },
    liveDrawSectionTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.secondary,
        fontWeight: '700',
        flex: 1,
        marginRight: 15
    },

    videoWrapper: {
        height: '100%',
        width: '100%',
        borderRadius: 0
    },
    video: {
        height: '100%',
        width: '100%',
    }
});
