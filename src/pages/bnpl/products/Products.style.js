import {StyleSheet} from "react-native";
import {themes} from "../../../theme/colors";

export default StyleSheet.create({

    container: {
        flexGrow: 1,
        paddingHorizontal: 30
    },

    productImageSlider: {
        padding: 20,
        height: 270,
        backgroundColor: themes['light'].colors.white,
        borderRadius: 10,
        marginVertical: 20
    },
    productImageSlide: {},
    productImageSlideImage: {
        height: 200,
    },
    sliderDotContainer: {
        bottom: 0,
    },
    sliderDot: {},

    productTitleAndPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    productTitleContainer: {
        flex: 1,
        marginRight: 15,
    },
    productTitle: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },
    productPrice: {
        fontSize: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.secondary,
        textAlign: 'right',
    },

    sectionContainer: {
        borderTopWidth: 1,
        borderColor: themes['light'].colors.gray3,
        marginHorizontal: -30
    },
    sectionContainerHeader: {
        paddingVertical: 20,
        paddingHorizontal: 30

    },
    sectionContainerHeaderText: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },
    sectionContainerBody: {

    },
    sectionContainerContainScroll: {
        marginHorizontal: -5,
        paddingHorizontal: 30,
        marginBottom: 20
    },
    productVariantButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themes['light'].colors.gray3,
        marginHorizontal: 5
    },
    productVariantButtonText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },

    productVariantActiveButton: {
        borderColor: themes['light'].colors.secondary,
        backgroundColor: themes['light'].colors.secondary4
    },

    productVariantActiveButtonText: {
        color: themes['light'].colors.secondary,
    },

    infoItemList: {
        marginHorizontal: -30,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: themes['light'].colors.gray3,
        paddingHorizontal: 30
    },
    infoItemText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
        flex: 1,
        marginHorizontal: 15
    },
    infoItemTitle: {},
    infoItemTextBold: {
        fontFamily: themes.font.bold,
        fontWeight: '600',
    },
    infoItemValue: {
        color: themes['light'].colors.secondary,
    },

    border_top_0: {
        borderTopWidth: 0
    }

});
