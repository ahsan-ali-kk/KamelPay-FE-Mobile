import {StyleSheet} from "react-native";
import {themes} from "../../theme/colors";

export default StyleSheet.create({
    rangeSliderParentContainer: {},
    rangeSliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },

    inputLabelHeader: {
      flexDirection: 'row'
    },
    inputLabelRight: {},

    inputSubLabelHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputSubLabel: {
        flex: 1
    },
    inputSubLabelRight: {
        fontFamily: themes.font.bold,
        color: themes['light'].colors.secondary,
        marginLeft: 15,
    },

    rangeSlider: {
        height: 40,
        flex: 1,
        marginHorizontal: 15,
    },
    rangeSliderText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },

});
