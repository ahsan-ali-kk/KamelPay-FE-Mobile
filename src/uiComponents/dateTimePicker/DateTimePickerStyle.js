import {StyleSheet} from "react-native";
import {themes as theme} from "../../theme/colors";

export default StyleSheet.create({
    selectContainer: {
        height: 50,
    },
    selectButtonText: {
        flex: 1,
        marginLeft: 10,
        color: theme['light'].colors.dark,
        fontFamily: theme.font.regular,
    },
    buttonLoading : {
        marginRight: 15
    },

    actionSheetTitle : {
        fontFamily: theme.font.semiBold,
        fontWeight: '600',
        color:  theme['light'].colors.primary,
        fontSize: 14,
        paddingTop: 15,
        paddingBottom: 5,
        paddingHorizontal: 25,
    },
    actionSheetButtonIcon: {
        color:  theme['light'].colors.lightenSecondary,
        fontSize: 16,
        marginRight: 15
    }
});
