import {I18nManager, StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";
// import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({
    listContainer: {
        flex: 1,
        position: 'relative'
    },
    listItem: {
        flexDirection: 'row',
        alignItems:'center',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten
    },
    lastListItem: {
        borderBottomWidth: 0,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 42,
        backgroundColor: theme['light'].colors.secondary7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
    },
    avatarText: {
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: theme['light'].colors.secondary,
        // marginTop: 3
    },

    listItemIcon: {
        width: 26,
        height: 26,
        borderRadius: 26,
        overflow: 'hidden',
        marginLeft: I18nManager.isRTL? 20 : 0,
        marginRight: I18nManager.isRTL? 0 : 20,
    },
    listItemIconImage: {
        width: '100%',
        height: '100%'
    },
    listItemContent: {
      flex: 1
    },
    listItemText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        lineHeight: 20,
        textAlign: 'left'
    },
    listItemSubText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray9,
        marginTop: 5,
        lineHeight: 18,
        textAlign: 'left'
    },

    listFooter: {
        paddingTop: 20,
        paddingBottom: 0,
    },

    listItemRightIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 10,
        marginLeft: 10,
        transform: [
            { scaleX: false ? -1 : 1 }
        ]
    },
    listItemLeftIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 18,
        marginRight: 10,
    }
});
