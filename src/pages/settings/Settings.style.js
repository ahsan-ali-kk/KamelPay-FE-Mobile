import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";
// import {getLayoutDirection} from "../../utils/methods";

export default StyleSheet.create({

    listContainer : {
        paddingHorizontal: 30,
        paddingBottom: 25,
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 25,
        borderBottomWidth: 1,
        borderBottomColor: themes['light'].colors.gray2,
        marginHorizontal: 30
    },
    headerImage: {
        width: 42,
        height: 42,
        borderRadius: 24,
        marginRight: 22,
    },
    headerContent: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContentTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        textAlign: 'left'
    },
    headerContentSubTitle: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        marginTop: 10,
        textAlign: 'left'
    },
    list: {
        marginTop: 20,
        marginBottom: 20
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    listItemButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        backgroundColor: theme['light'].colors.secondary7,
    },
    errorListItemButton: {
        backgroundColor: theme['light'].colors.errorLight,
    },
    errorListItemButtonIcon: {
        color: theme['light'].colors.error,
    },
    listItemButtonIcon: {
        fontSize: 18,
        color: themes['light'].colors.secondary,
    },
    listItemText: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        flex: 1,
        marginRight: 15,
        textAlign: 'left'
    },
    listItemRightIcon: {
        transform: [{ rotate: false ? '270deg' : '90deg'}],
        color: themes['light'].colors.secondary,
        fontSize: 12,
    },
    listFooterUpperText : {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        paddingTop: 10,
        textAlign: 'left',
        marginTop: 20
    },
    listFooter : {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: themes['light'].colors.gray2,
        marginTop: 12
    },

    headerVector: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    headerVectorImage: {
        width: 245.18,
        height: 224.05
    },

    heading: {
        fontSize: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        marginBottom: 20,
        textAlign: 'left'
    },
    subParagraph: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        marginBottom: 20,
        lineHeight: 20,
        textAlign: 'left'
    },
    paragraph: {
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        marginBottom: 20,
        lineHeight: 20,
        textAlign: 'left'
    },

    mainFocusListItem: {
        flexDirection: 'row',
        marginVertical: 13,

    },
    mainFocusListItemContent: {
        flex: 1,
        marginLeft: 15
    },
    mainFocusListItemContentTitle: {
        fontSize: 14,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.primary,
        marginBottom: 5,
        textAlign: 'left'
    },
    mainFocusListItemContentText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.gray4,
        textAlign: 'left'
    },

    buttonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonIcon: {
        color: theme['light'].colors.secondary,
        fontSize: 24,
    },
    buttonText: {
        fontSize: 10,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        color: themes['light'].colors.dark,
        textAlign: 'left',
        marginLeft: 3,
        marginTop: 3.5
    },

});
