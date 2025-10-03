import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";

export default StyleSheet.create({

    container: {
        flexGrow: 1,
        paddingHorizontal: 30
    },

    selectedList: {
        paddingHorizontal: 30,
        marginTop: -15
    },
    selectedListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: theme['light'].colors.gray3,
    },
    selectedListFirstItem: {
        borderTopWidth: 0,
    },
    selectedListItemImageContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectedListItemRemoveButton: {
        padding: 5,
        backgroundColor: theme['light'].colors.errorLight,
        borderRadius: 100,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedListItemRemoveButtonIcon: {
        fontSize: 12,
        color: theme['light'].colors.error,
    },
    selectedListItemImage: {
        width: 55,
        height: 55,
    },
    selectedListItemContent: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    selectedListItemText: {
        fontSi: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
        marginBottom: 8
    },
    selectedListItemTitle: {},
    selectedListItemCategory: {
        fontSize: 12,
    },
    selectedListItemAmount: {
        marginBottom: 0,
        color: themes['light'].colors.secondary,
    },

    selectedListItemDeleteButtonContainer: {
        margin: 0,
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        // width: 70,
    },

    selectedListItemCounter: {},

    counterInnerContainerStyle: {
        borderWidth: 0,
        borderRadius: 0,
        minHeight: 'auto',
        minWidth: 'auto',
    },
    counterContainerStyle: {
        marginRight: 0,
    },
    counterStyle: {
        flexDirection: 'column',
        backgroundColor: themes['light'].colors.secondary,
        paddingHorizontal: 0,
        borderRadius: 100,
    },
    counterButtonStyle: {
        backgroundColor: 'transparent',
        height: 30,
        width: 24,
        borderRadius: 0,
    },
    counterButtonIconStyle: {
        color: themes['light'].colors.secondary6,
        fontSize: 14
    },
    counterDisableButtonIconStyle: {
        color: themes['light'].colors.secondary8,
    },
    counterValueContainerStyle: {
        backgroundColor: 'transparent',
        minHeight: 15,
        justifyContent: 'center',
        minWidth: 25
    },
    counterValueStyle: {
        color: themes['light'].colors.tertiary,
        fontSize: 12
    },


});
