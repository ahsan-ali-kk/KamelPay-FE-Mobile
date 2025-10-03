import {StyleSheet} from 'react-native';
import {themes} from "../../theme/colors";

export default StyleSheet.create({
    listContainer: {
        flex: 1,
        position: 'relative'
    },
    listItem: {
        flexDirection: 'row',
        alignItems:'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.lighten
    },
    lastListItem: {
        borderBottomWidth: 0,
    },
    listItemIcon: {
        width: 26,
        height: 26,
        borderRadius: 26,
        overflow: 'hidden',
        marginRight: 20
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
        color: themes['light'].colors.primaryLight,
        textAlign: 'left'
        // flex: 1
    },
    listItemSubText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.primaryLight,
    },

    listFooter: {
        paddingVertical: 20
    }
});
