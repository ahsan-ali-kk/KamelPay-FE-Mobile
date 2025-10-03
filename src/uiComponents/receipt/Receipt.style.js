import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    fullContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flex: 1
    },

    view: {
        backgroundColor: themes['light'].colors.tertiary,
        borderRadius: 23/2,
        width: '100%',
        maxWidth: 360,
    },
    viewContainer: {
        // paddingVertical: 30,
        paddingBottom: 30,
        paddingHorizontal: 30,
        borderRadius: 23/2,
        width: '100%',
        backgroundColor: themes['light'].colors.tertiary,
    },
    popupHeaderButton: {
        padding: 5,
        alignItems: 'flex-end',
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1
    },
    popupHeaderButtonIcon: {
        fontSize: 20,
        color: themes['light'].colors.gray8,
    },
    popupHeader: {
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        paddingTop: 30
    },
    popupHeaderImage: {
        width: 145,
        height: 145,
        marginBottom: 20,
        marginTop: 15
    },

    title: {
        fontSize: 16,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 14,
        color: themes['light'].colors.primaryLight,
        fontFamily: themes.font.regular,
        fontWeight: '400',
    },
    amountTitle: {
        fontSize: 16,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 5
    },
    amountText: {
        fontSize: 20,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        marginBottom: 10
    },
    secondAmount: {
        fontSize: 14,
        color: themes['light'].colors.primary,
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    list: {
        marginTop: 15
    },
    listHeader: {
        marginBottom: 15
    },
    listHeaderText: {
        fontSize: 16,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 10
    },
    listItem2: {
        // flexDirection: 'column',
        // alignItems: 'center'
    },
    listItemText: {
        flex: 1,
        fontSize: 12,
        color: themes['light'].colors.gray4,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        textAlign: 'left'
    },
    listItemImage: {
        height: 12,
        width: 90,
    },
    listItemText2: {
        color: themes['light'].colors.dark,
    },
    listItemLastText: {
        textAlign: 'right',
        color: themes['light'].colors.dark,
        flex: 1,
        marginLeft: 10
    },
    listItemLastText2: {
        fontSize: 14,
        textAlign: 'right',
        color: themes['light'].colors.primary,
        textDecorationLine: 'underline'
    },

    popupFooter: {
        flexDirection: 'row',
        // backgroundColor: 'transparent',
        // backgroundColor: 'red',
        paddingVertical: 12,
        marginTop: -15,
        paddingBottom: 30,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35
    },

    popupFooterButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    popupFooterButtonIcon: {
        fontSize: 18,
        color: themes['light'].colors.secondary,
        marginBottom: 10
    },

    popupFooterButtonText: {
        fontSize: 12,
        color: themes['light'].colors.gray7,
        fontFamily: themes.font.regular,
    },


    fontBold: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },

    separatorContainer: {
        position:'relative'
    },
    confirmInfoListSeparator: {
        height: 0.5,
        borderStyle: 'dashed',
        borderRadius: 1,
        borderWidth: 1,
        backgroundColor: themes['light'].colors.tertiary,
        borderColor: themes['light'].colors.gray2,
        marginTop: 5,
        marginBottom: 15
    },

    circle: {
        width: 18,
        height: 20,
        backgroundColor: themes['light'].colors.gray4,
        // backgroundColor: 'red',
        position: 'absolute',
        zIndex: 1,
        top: -4
    },
    circleLeft: {
        left: -30,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
    },
    circleRight: {
        right: -30,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
    },
});
