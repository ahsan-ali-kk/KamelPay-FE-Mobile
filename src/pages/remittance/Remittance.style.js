import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    listHeaderView: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        alignItems: 'center'
    },
    listHeaderViewTitle: {
        flex: 1,
        marginLeft: 0
    },
    listHeaderViewButton: {
        // borderColor: theme['light'].colors.lightBorderColor,
        // borderWidth: 1,
        backgroundColor: theme['light'].colors.lightBorderColor,
        // paddingVertical: 15,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        position: 'relative',
        flexDirection: 'row',
        height: 35
    },
    listHeaderViewButtonTitle: {
        color: theme['light'].colors.primary,
        fontSize: 12,
        fontFamily: theme.font.regular,
        fontWeight: '400',
        textAlign: 'left'
    },

    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 15
        // flex: 1
    },

    confirmationReceiptIcon: {
        width: 52,
        height: 52,
        // marginBottom: 30,
        resizeMode: 'cover'
    },

    totalAmount: {
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',

    },
    totalAmountTitle: {
        fontSize: 16,
        color: themes['light'].colors.primaryLight,
        fontFamily: themes.font.regular,
    },
    totalAmountValue: {
        fontSize: 20,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },

    confirmationList: {},
    confirmationListItem: {
        flexDirection: 'row',
        marginBottom: 10
    },
    confirmationListItemText: {
        flex: .5,
        marginRight: 25,
        fontSize: 14,
        color: themes['light'].colors.primaryLight,
        fontFamily: themes.font.regular,
        textAlign: 'left'
        // backgroundColor: 'red'
    },
    confirmationListItemLastText: {
        flex: .5,
        flexWrap: 'wrap',
        marginRight: 0,
        textAlign: 'right'
    },

    bottomView: {
        backgroundColor: theme['light'].colors.tertiary,
        paddingVertical: 25,
        paddingHorizontal: 30
    },

    formTopSpace: {
        marginTop: 30
    },

    addBeneficiaryView: {
        marginBottom: 0,
        marginTop: 15,
        paddingBottom: 20,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: theme['light'].colors.lighten

    }

});
