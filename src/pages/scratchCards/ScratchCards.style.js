import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";
// import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    listContainer: {
        flex: 1,
        position: 'relative'
    },

    listItem: {
        flexDirection: 'row',
        alignItems:'center',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten
    },
    lastListItem: {
        borderBottomWidth: 0,
    },
    listItemWon: {
        backgroundColor: themes['light'].colors.successLight
    },
    listItemTryAgain: {
        backgroundColor: themes['light'].colors.errorLight
    },
    listItemContent: {
        flex: 1
    },
    listItemText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.dark,
        lineHeight: 20,
        textAlign: 'left'
    },
    listItemSubText: {
        fontSize: 14,
        fontFamily: themes.font.medium,
        color: themes['light'].colors.success,
        marginTop: 5,
        lineHeight: 18,
        textAlign: 'left'
    },
    tryAgain: {
        color: themes['light'].colors.error,
    },
    success: {
        color: themes['light'].colors.success,
    },
    listItemDate: {
        fontSize: 12,
        fontFamily: themes.font.medium,
        color: themes['light'].colors.gray9,
        marginTop: 5,
        lineHeight: 18,
        textAlign: 'left'
    },
    listItemTag: {
        backgroundColor: themes['light'].colors.successLight,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemTagText: {
        fontSize: 12,
        fontFamily: theme.font.bold,
        fontWeight: '400',
        color: themes['light'].colors.success,
    },
    listFooter: {
        paddingTop: 20,
        paddingBottom: 0,
    },

    listItemRightIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 10,
        marginLeft: 10,
        transform: [
            { scaleX: false ? -1 : 1 }
        ]
    },
    listItemLeftIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 18,
        marginRight: 10,
    },

    maxHeight_300: {
        maxHeight: 300,
    },
    scratchCardContainer: {
        minHeight: 300,
        borderRadius: 10,
        overflow: 'hidden',
        margin: -30,
    },
    scratchCardBackgroundContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: themes['light'].colors.secondary,
        alignSelf: 'center',
        borderRadius: 16,
        zIndex: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scratchCardBackgroundImage: {
        width: 155,
        height: 147
    },
    scratchCardForegroundContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 2
    },
    scratchCardTryAgainContainer: {

    },
    scratchCardContentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    scratchCardContentContainerIcon: {
        width: 100,
        height: 100,
        marginBottom: 15
    },
    scratchCardContentContainerProductImage: {
        width: 150,
        height: 150,
        marginBottom: 15
    },
    scratchCardContentContainerText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.tertiary,
        textAlign: 'center',
        marginTop: 10
    },


    container: {
        padding: 30,
    },
    detailPageHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailPageHeaderImage: {
        width: 132,
        height: 110,
        marginVertical: 30
    },
    detailPageHeaderText: {
        fontSize: 14,
        fontFamily: themes.font.medium,
        color: themes['light'].colors.gray4,
        lineHeight: 20,
        textAlign: 'left'
    },

    prizeListContainer: {
        marginTop: 25
    },

    prizeListHeader: {
        // backgroundColor: 'red',
        paddingVertical: 10,
        marginVertical: 15
    },
    prizeListHeaderText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.black,
        lineHeight: 20,
        textAlign: 'left'
    },

    prizeList: {
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    prizeListItem: {
        width: '50%',
    },
    prizeListItemContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: themes['light'].colors.gray3,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        flex: 1
    },
    prizeListItemIcon: {
        width: 82,
        height: 82,
        marginBottom: 15
    },
    prizeListItemText: {
        fontSize: 12,
        fontFamily: themes.font.medium,
        color: themes['light'].colors.black,
        lineHeight: 20,
        textAlign: 'center'
    },
});
