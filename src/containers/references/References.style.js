import {themes} from "../../theme/colors";
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    referencesContainer: {},
    referencesHeader: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten
    },
    referencesHeaderTitle: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
    },
    referencesHeaderSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        marginTop: 10
    },
    references: {
        paddingHorizontal: 20
    },
    reference: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten
    },
    referenceBorderNone: {},
    referenceContent: {},
    referenceContentText: {
        marginVertical: 2.5,
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.secondary,
        textAlign: 'left',
    },
    referenceContentSubText: {
        marginVertical: 2.5,
        fontSize: 12,
        fontFamily: themes.font.medium,
        fontWeight: '500',
        color: themes['light'].colors.gray1,
        textAlign: 'left',
    },
});
