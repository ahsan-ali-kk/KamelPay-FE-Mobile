import {StyleSheet} from "react-native";
import {themes} from "../../../theme/colors";
import {getLayoutDirection} from "../../../utils/methods";

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 15
    },

    vectorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 35
    },
    vector: {
        width: 160.96,
        height: 160.96,
    },

    pageTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        marginBottom: 10,
        textAlign: 'left'
    },
    pageParagraph: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        textAlign: 'left'
    },

    referralCodeContainer: {
        alignItems: 'center',
    },
    referralCodeInnerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderWidth:1,
        borderStyle: 'dashed',
        borderColor: themes['light'].colors.gray3,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30
    },
    referralCode: {
        marginRight: 15
    },
    referralCodeText: {
        fontSize: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.secondary,
    },
    referralCodeCopyButton: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        height: 'auto',
        width: 'auto',
        backgroundColor: 'transparent',
        borderRadius: 0
    },
    referralCodeCopyButtonIcon: {
        fontSize: 18
    },

    referralApplicableContainer: {},
    referralApplicableListTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.gray4,
        textAlign: 'left',
        marginBottom: 10
    },
    referralApplicableList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 5
    },

    referralApplicableListItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },

    referralApplicableListItemIcon: {
        width: 50,
        marginRight: 15,
        height: 50
    },
    referralApplicableListItemTitle: {
        flex: 1,
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.gray4,
        textAlign: 'left'

    },


    transactionCards: {
        paddingHorizontal: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        paddingVertical: 10,
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

    referralListItem: {},
    referralListItemIconContainer: {},
    referralListItemIconText: {},
    referralListItemContent: {},
    referralListItemTitle: {},
    referralListItemAmount: {},

});
