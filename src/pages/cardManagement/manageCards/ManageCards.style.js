import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";

export default StyleSheet.create({

    scrollContainer : {
        flexGrow: 1,
        paddingBottom: 10,
        paddingHorizontal: 15
    },
    textContent: {
        marginTop: 25,
        marginBottom: 30,
    },
    list: {},
    listItem: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        borderColor: themes['light'].colors.gray3
    },
    activeListItem: {
        borderColor: themes['light'].colors.secondary,
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: theme['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 6,
    },
    listItemVector: {
        width: 68.24,
        height: 43.67,
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: 20
    },
    listItemContent: {
        flex: 1
    },
    listItemText: {
        marginVertical: 3,
        fontSize: 12,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray4,
        textAlign: 'left'
    },
    listItemTextBlack: {
        color: themes['light'].colors.dark,
    },

});
