import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    billingList: {
        paddingHorizontal: 25,
    },
    billingListItem: {
        backgroundColor: theme['light'].colors.tertiary,
        borderRadius: 15,
        padding: 15,
        height: 'auto',
        position: 'relative',
        flexDirection: 'column',
        width: '47.3%',
        borderWidth: 1,
        borderColor: theme['light'].colors.gray8,
        margin: 5,
    },
    billingListItemIconContainer: {
        width: 38,
        height: 38,
        padding: 0,
        marginBottom: 10,
        marginTop: 3,
    },
    billingListItemIcon: {
        // fontSize: 18,
        width: 20,
        height: 20
    },
    billingListItemText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        flex: 1,
        lineHeight: 20,
        textAlign: 'left'
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

});
