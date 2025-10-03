import {StyleSheet} from "react-native";
import {themes} from "../../theme/colors";

export default StyleSheet.create({

    container: {
        flexGrow: 1,
    },

    sectionContainer: {
        flexDirection: 'column',
    },
    sectionContainerHeader: {
        paddingHorizontal: 30,
        paddingVertical: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionContainerHeaderText: {
        fontSi: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        textAlign: 'left',
        flex: 1,
        marginRight: 15
    },
    sectionContainerHeaderButton: {
        borderRadius: 0,
        backgroundColor: 'transparent',
        borderWidth: 0,
        width: 'auto',
        height: 'auto',
    },
    sectionContainerHeaderButtonText: {
        fontSize: 12,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.dark,
        textAlign: 'center',
    },
    sectionContainerHeaderButtonIcon: {
        fontSize: 10,
        marginLeft: 5,
        color: themes['light'].colors.secondary,
    },
    sectionContainerBody: {
        marginBottom: 30,
        position: 'relative'
    },
    brandListMainContainer: {
        // minHeight: 'auto',
        marginBottom: 0
    },
    brandList: {
        flexGrow: 0,
    },
    brandListContainer: {
        paddingHorizontal: 25,
    },
    brandListItem: {
        width: 100,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C9DCFD',
        backgroundColor: '#FBFCFF',
        marginHorizontal: 5,
        borderRadius: 10
    },
    selectedBrandListItem: {
        borderColor: themes['light'].colors.primary,
    },
    brandListItemImage: {
        width: 60,
        height: 60,
    },

    borderLine: {
        borderBottomWidth: 1,
        borderColor: themes['light'].colors.gray3,
    },


    bannerContainer: {
        marginHorizontal: 30,
        marginTop: 15,
        marginBottom: 10,
        position: 'relative',
        flexDirection: 'row',
    },
    bannerContainerOverlay: {
        position: 'absolute',
        top: 0,
        bottom: -8,
        left: 0,
        right: 0,
        zIndex: 0,
        borderRadius: 20,
        marginHorizontal: 12,
        backgroundColor: themes['light'].colors.secondary6,
        opacity: 0.20,
    },
    bannerContentContainer: {
        backgroundColor: themes['light'].colors.secondary,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        position: 'relative',
        minHeight: 112,
        flex: 1,
        flexDirection: 'row',
    },
    bannerContentContainerLeft: {
        flex: 1,
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 0,
    },
    bannerContentContainerTitle: {
        fontSi: 18,
        fontFamily: themes.font.bold,
        fontWeight: '700',
        color: themes['light'].colors.tertiary,
        textAlign: 'left',
        lineHeight: 18
    },
    bannerContentContainerText: {
        fontSize: 12,
        lineHeight: 18,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.tertiary,
        textAlign: 'left',
        marginTop: 5,
    },
    bannerContentContainerText2: {
        marginTop: 0,
        fontFamily: themes.font.bold,
        color: themes['light'].colors.lightYellow,
        fontWeight: '600',
    },
    bannerContainerImageContainer: {
        justifyContent: 'flex-end',
        marginVertical: -20,
    },
    bannerContainerImage: {
        width: 100,
        height: 73,
        position: 'relative',
    },

    productItem: {
        flex: 0.5,
    },
    productItemContainer: {
        margin: 5,
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: themes['light'].colors.gray3,
        borderRadius: 10,
        flex: 1
    },
    productItemHeader: {
        marginBottom: 20
    },
    productItemHeaderImage: {
        width: '100%',
        height: 116.69,
    },
    productItemBody: {},
    productItemText: {
        fontSize: 12,
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.dark,
        textAlign: 'left',
    },
    productItemBodyTitle: {
        color: themes['light'].colors.dark,
        marginTop: 5
    },
    productItemBodyAmount: {
        color: themes['light'].colors.gray9,
        marginTop: 5
    },
    productItemFooter: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    productItemFooterText: {
        color: themes['light'].colors.secondary,
        flex: 1
    },
    productItemFooterIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 16
    },

    fabButton: {
        width: 55,
        height: 55,
        borderRadius: 55,
        backgroundColor: themes['light'].colors.secondary,
        shadowColor: themes['light'].colors.secondary,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.20,
        shadowRadius: 6,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        marginBottom: 32,
        right: 30
    },
    without_safeArea: {
        bottom: 55,
    },
    fabButtonIcon: {
        color: themes['light'].colors.tertiary,
        fontSize: 22
    },

    fabButtonBadge: {
        position: 'absolute',
        top: 0,
        right: -5,
        minWidth: 17,
        minHeight: 17,
        borderRadius: 17,
        backgroundColor: themes['light'].colors.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3
    },
    fabButtonBadgeText: {
        color: themes['light'].colors.secondary,
        fontSize: 10,
        fontFamily: themes.font.bold,
        fontWeight: '600',
        textAlign: 'center',
    },

});
