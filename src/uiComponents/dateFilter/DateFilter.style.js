import {StyleSheet} from 'react-native';
import {themes} from "../../theme/colors";

export default StyleSheet.create({
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
});
