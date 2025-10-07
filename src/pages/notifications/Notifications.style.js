import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";
// import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    list: {
        marginHorizontal: -30,
        paddingTop: 10
    },
    listItem: {
        flexDirection: 'row',
        alignItems:'flex-start',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten
    },
    unReadItem: {
        backgroundColor: theme['light'].colors.secondary4,
    },
    lastListItem: {
        borderBottomWidth: 0,
    },
    avatarText: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.secondary,
        // marginTop: 3
    },
    listItemIconContainer: {
        marginRight: 15,
        width: 'auto',
        height: 'auto',
        backgroundColor: 'transparent'
    },
    listItemIcon: {
        fontSize: 20
    },
    listItemContent: {
      flex: 1
    },
    listItemContentHeader: {
        flexDirection: 'row'
    },
    listItemTitle: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        // lineHeight: 28,
        textAlign: 'left',
        flex: 1,
        marginRight: 15
    },
    listItemDate: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.secondary,
    },
    listItemParagraph: {
        fontSize: 13,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray9,
        marginTop: 5,
        lineHeight: 18,
        textAlign: 'left'
    },
});
