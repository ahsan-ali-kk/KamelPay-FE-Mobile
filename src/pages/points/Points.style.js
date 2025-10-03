import {StyleSheet} from 'react-native';
import {themes} from "../../theme/colors";

export default StyleSheet.create({

    innerContainer: {
        flex:1,
        overflow: 'hidden'
    },

    list:  {
        paddingTop: 15,
        flexGrow: 1
    },


    listItem: {
        flexDirection: 'row',
        paddingHorizontal: 0,
        borderTopWidth: 1,
        borderColor: themes['light'].colors.gray2,
        paddingVertical: 15,
        alignItems: 'center'
    },
    listItemIcon: {
        marginRight: 15,
    },
    listItemTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        lineHeight: 19,
        textAlign: 'left',
        marginBottom: 5
    },
    listItemDate: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        marginTop: 5,
        textAlign: 'left'
    },
    listItemContent: {
        flex: 1,
        marginRight: 15
    },
    listItemRightContent: {
        alignItems: 'flex-end'
    },
    listItemTag: {
        backgroundColor: themes['light'].colors.errorLight,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemTagText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.error,
    },
    listItemTagUploaded: {
        backgroundColor: themes['light'].colors.successLight,
    },
    listItemTagUploadedText: {
        color: themes['light'].colors.success,
    },

    listItemAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15
    },
    listItemAmountIcon: {
        fontSize: 8,
        marginRight: 10,
        color: themes['light'].colors.green
    },
    listItemAmount: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left'
    },
    listItemBorderNone: {
        borderTopWidth: 0,
    },

    redIcon: {
        color: themes['light'].colors.error
    },

    transactionAmount: {
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginBottom: 0,
        marginRight: 10,
    },

    filterContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        flex: 0,
        flexGrow: 0,
    },
    filterScrollContainer: {
        paddingHorizontal: 30,
    },
    filterTag: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: themes['light'].colors.secondary4,
        borderColor: themes['light'].colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        marginRight: 15
    },
    filterTagText: {
        fontSize: 12,
        color: themes['light'].colors.secondary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    activeFilterTag: {
        backgroundColor: themes['light'].colors.secondary,
        borderColor: themes['light'].colors.secondary,

    },
    activeFilterTagText: {
        color: themes['light'].colors.tertiary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },

    blueColor: {
        color: themes['light'].colors.primary
    },

    viewContainer: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        flexGrow: 1
    },
    viewInnerContainer: {
        flex: 1
    },

    viewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25
    },
    viewHeaderIcon: {
        width: 52,
        height: 52
    },
    viewHeaderContent: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
        marginTop: 8
    },
    viewHeaderText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        lineHeight: 20,
    },
    viewHeaderSubText: {
        fontSize: 12,
        color: themes['light'].colors.gray4,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        lineHeight: 22,
    },

    viewAmount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        // marginVertical: 25,
        flex: 1
    },
    viewAmountText: {
        fontSize: 20,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
    },
    viewAmountIcon: {
        fontSize: 12,
        marginBottom: 6
    },

    receiptSection: {
        alignItems: 'center',
        marginTop: 15
    },
    receiptSectionImage: {
        width: '100%',
        height: 256
    },

    section: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: themes['light'].colors.lighten,
        paddingVertical: 20,
        marginHorizontal: -30,
        paddingHorizontal: 30
    },
    sectionHeading: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        fontWeight: '400',
        minWidth: 65,
        marginRight: 15
    },
    sectionText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.dark,
        fontWeight: '700',
        flex: 1,
        textAlign: 'right'
    },


    transactionCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginTop: -8,
        paddingBottom: 10,
    },
    transactionCard: {
        flex: 1,
        padding: 8,
        flexDirection: 'row'
    },
    transactionCardContainer: {
        backgroundColor: themes['light'].colors.secondary9,
        flexDirection: 'column',
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center'
    },
    transactionCardDark: {
        backgroundColor: themes['light'].colors.secondary10,
    },
    transactionCardTitle: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        fontWeight: '400',
        marginBottom: 10
    },
    transactionCardNumber: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
    },
    transactionCardFull: {
        flex: 1,
        flexBasis: '100%',
    },
    transactionCardFullTitle: {},
    transactionCardFullNumberPrefix: {
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    transactionCardFullNumber: {
        fontSize: 18,
    },
});
