import {StyleSheet} from "react-native";
import {themes} from "../../../../theme/colors";

export default StyleSheet.create({
    list: {
        marginBottom: 30
    },
    listItem: {
        paddingVertical: 20,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
        flex: 1,
    },
    listItemTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray1,
        marginBottom: 15,
        textAlign: 'left'
    },
    listItemValue: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left'
    },

    bottomButtonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginVertical: 20
    },
    bottomButton: {
        flex: 1,
        marginHorizontal: 10
    },
});
