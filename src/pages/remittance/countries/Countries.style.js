import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../../theme/colors";
import {getLayoutDirection} from "../../../utils/methods";

export default StyleSheet.create({
    listItemContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5
    },
    listItemTitle: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },
    listItemText: {
        fontSize: 12,
        flex: 1,
        textAlign: 'left',
        marginRight: 10,
        color: theme['light'].colors.gray9,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    rateTitle: {
        color: theme['light'].colors.secondary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 12,
        textAlign: 'center',
    },

    specialCountries: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten,
        paddingBottom: 20
    },
    specialCountriesHeader: {
        paddingHorizontal: 30
    },
    specialCountriesHeaderText: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginBottom: 15,
        textAlign: 'left'

    },
    specialList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 30,
        marginHorizontal: -5,
    },
    specialListItem: {
        width: "30%",
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginVertical: 10,
        marginHorizontal: 5,
    },
    specialListItemImage: {
        width: 30,
        height: 30,
    },
    specialListItemContent: {
        marginTop: 10
    },
    specialListItemSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: theme['light'].colors.gray12,
        textAlign: 'left'
    },
    specialListItemRateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    specialListItemRate: {
        color: theme['light'].colors.dark,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 14,
        textAlign: 'left'
    },
    specialListItemRateIcon: {
        fontSize: 12,
        transform: [
            { scaleX: false ? 1 : -1 }
        ],
        color: theme['light'].colors.secondary,
        marginLeft: 3
    },
    specialListItemTitle: {
        color: theme['light'].colors.secondary,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 12,
        textAlign: 'left'
    },
});
