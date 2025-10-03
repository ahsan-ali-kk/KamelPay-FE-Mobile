import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        flexGrow: 1,
        // paddingBottom: 10,
    },

    submittedSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submittedSectionVector: {
        width: 115,
        height: 115,
        marginBottom: 50
    },
    submittedSectionTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.dark,
        marginBottom: 20
    },
    submittedSectionSubTitle: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: theme['light'].colors.dark,
        lineHeight: 25,
        paddingHorizontal: 50,
    },

    eligibleAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30
    },
    eligibleAmountTitle: {
        flex: 1,
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.dark,
        textAlign: 'left'
    },
    eligibleAmountSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.secondary,
    },
    eligibleAmount: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.secondary,
    },
    takeAdvanceButton: {
        marginTop: -15,
        paddingVertical: 15,
        marginBottom: 15
    },
    takeAdvanceButtonText: {
        fontSize: 13,
        fontFamily: themes.font.semiBold,
        fontWeight: '600',
        color: theme['light'].colors.secondary,
    },

    installmentList: {
        marginTop: -15,
    },
    installmentListItem: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
        paddingVertical: 10,
    },
    installmentListItemLeft: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        marginRight: 15,
    },

    installmentListItemSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.primary,
    },
    installmentListItemRight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    installmentListItemTextContainer: {
        flexDirection: 'row',
        marginTop: 5
    },
    installmentListItemText: {
        fontSize: 12,
        fontFamily: themes.font.semiBold,
        fontWeight: '600',
        color: theme['light'].colors.gray11,
    },
    marginLeft_10: {
        marginLeft: 10,
    },
    boldText: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    installmentListItemIcon: {
        fontSize: 18,
        marginLeft: 15,
        color: theme['light'].colors.dark,
    },
    flex_1: {
        flex: 1
    },
    primaryText: {
        color: theme['light'].colors.primary,
    },
    darkText: {
        color: theme['light'].colors.dark,
    },
    dangerText: {
        color: theme['light'].colors.error,
    },

    repaymentContainer: {
        backgroundColor: theme['light'].colors.secondary4,
        padding: 5,
        borderRadius: 5
    },
    repaymentContainerItem: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        borderRadius: 5,
        marginBottom: 5
    },
    activeItem: {
        backgroundColor: theme['light'].colors.tertiary,
    },
    collectedItemBackground: {
        backgroundColor: theme['light'].colors.success,
    },
    collectedItemText: {
        color: theme['light'].colors.tertiary,
    },
    activeItemDot: {
        backgroundColor: theme['light'].colors.secondary,
    },
    repaymentContainerItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    repaymentContainerItemRight: {
        flex: 1,
        paddingHorizontal: 10,
        flexDirection: 'column'
    },
    repaymentDotContainer: {},
    repaymentDot: {
        width: 10,
        height: 10,
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 5,
        zIndex: 1
    },
    repaymentDotTopLine: {
        width: 1,
        height: '100%',
        backgroundColor: theme['light'].colors.gray8,
        position: 'absolute',
        bottom: 0,
        left: 4
    },
    repaymentDotBottomLine: {
        width: 1,
        height: '100%',
        backgroundColor: theme['light'].colors.gray8,
        position: 'absolute',
        top: 0,
        left: 4
    },
    repaymentDateContainer: {
        paddingHorizontal: 15,
        minWidth: 80
    },
    repaymentDateText: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.gray14,
        marginVertical: 2.5
    },
    repaymentTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.gray14,
        marginBottom: 5
    },
    repaymentSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.gray14,
    },
    margin_bottom_zero: {
        marginBottom: 0,
    }
});
