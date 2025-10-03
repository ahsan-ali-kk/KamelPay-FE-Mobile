import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

    scrollContainer: {
        paddingHorizontal: 30,
        paddingVertical: 15
    },

    questionsAndAnswerList: {},
    questionsAndAnswerListItem: {
        marginBottom: 30
    },
    questionsAndAnswerListItemTitle: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.dark,
        textAlign: 'left',
        marginBottom: 10
    },
    questionsAndAnswerListItemSubTitle: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray7,
        textAlign: 'left'
    },

    sectionList: {},
    sectionListItem: {
        marginBottom: 30
    },
    sectionListItemTitle: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.dark,
        textAlign: 'left',
        marginBottom: 10
    },
    sectionListItemSubTitle: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.dark,
        textAlign: 'left',
        marginTop: 15,
    },
    boldText: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    darkText: {
        color: themes['light'].colors.dark,
    },
    sectionListItemChildTitle: {
        fontSize: 12,
        lineHeight: 20,
        fontFamily: themes.font.regular,
        color: themes['light'].colors.gray7,
        textAlign: 'left',
        marginTop: 10,
        marginLeft: 15
    },


    kfcTitle: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginBottom: 15
    },
    kfcParagraph: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },

    tableSection: {
        borderWidth: 1,
        borderColor: themes['light'].colors.dark,
    },
    tableSectionHeader: {
        backgroundColor: 'red'
    },
    tableSectionHeaderText: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.tertiary,
        padding: 5
    },

    tableSectionBody: {},
    tableSectionBodyItem: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: themes['light'].colors.dark,
    },
    rowReverse: {
        flexDirection: 'row-reverse',
    },
    rowReverseTableSectionBodyItemLeft: {
        borderLeftWidth: 1,
        borderRightWidth: 0,
        borderColor: themes['light'].colors.dark,
    },
    tableSectionBodyItemLeft: {
        flex: 0.4,
        padding: 5,
        borderRightWidth: 1,
        borderColor: themes['light'].colors.dark,
    },
    tableSectionBodyItemRight: {
        flex: 0.6,
        padding: 5
    },
    space: {
        padding: 5
    },
    column: {
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row',
    },
    alignItems_flexStart: {
        alignItems: 'flex-start'
    },
    flex_1: {
        flex: 1
    },
    border_right_none: {
        borderRightWidth: 0
    },
    border_right: {
        borderRightWidth: 1,
        borderColor: themes['light'].colors.dark
    },
    border_left: {
        borderLeftWidth: 1,
        borderColor: themes['light'].colors.dark
    },
    border_top_none: {
        borderTopWidth: 0
    },
    border_bottom_none: {
        borderBottomWidth: 0
    },
    border_bottom: {
        borderBottomWidth: 1
    },
    margin_bottom: {
        marginBottom: 5
    },
    dot: {
        width: 5,
        height: 5,
        backgroundColor: themes['light'].colors.dark,
        borderRadius: 5,
        marginTop: 4,
        marginHorizontal: 5
    },
    warning: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: 'red',
    },
    kfcParagraphTitle:{
        fontSize: 14,
        lineHeight: 16,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
    },
    spaceHorizontal: {
        paddingHorizontal: 10
    },
    margin_top: {
        marginTop: 5
    },
    infoViewItem: {
        flex: 1,
        minHeight: 50,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    infoViewItemText: {

    },


    feeTable: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: 1,
        borderColor: themes['light'].colors.dark,
    },
    feeTableContainer: {
        flexDirection: 'column',
        flex: 1
    },
    feeTableHeaderContainer: {
        flexDirection: 'row',
        flex: 1
    },
    feeTableHeader: {
        padding: 5,
        backgroundColor: '#ffe3d3',
        flex: 1
    },
    feeTableHeaderText: {
        fontSize: 10,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        textAlign: 'center'
    },
    feeTableBody: {
        padding: 5,
    },
    feeTableBodyText: {
        fontSize: 10,
        marginVertical: 1.5,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'center'
    },

    blue: {
        color: '#0065c9',
    },
    tacListItem: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 10
    },
    tacListItemCount: {
        marginRight: 5
    },
    margin_left_10: {
        marginLeft: 10,
        // marginTop: 10
    },
    margin_bottom_10: {
        marginBottom: 10,
    },

    checkBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    checkBoxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    checkBox: {
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: themes['light'].colors.dark,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkBoxFill: {
        width: 6,
        height: 6,
        backgroundColor: themes['light'].colors.dark
    },
    checkBoxText: {
        fontSize: 10,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        marginTop: 3,
    },

    lightGray: {
        backgroundColor: '#e6e7e9'
    },
    lightGrayContentColor: {
        color: themes['light'].colors.tertiary,
    },
    darkGray: {
        backgroundColor: '#636366'
    },
    darkGrayContentColor: {
        color: themes['light'].colors.tertiary,
    },
    paddingVertical: {
        paddingVertical: 5
    },
    textCenter: {
        textAlign: 'center'
    },
    alignItemsCenter: {
        alignItems: 'center'
    }
});
