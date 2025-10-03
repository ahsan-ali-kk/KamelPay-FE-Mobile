import {StyleSheet} from "react-native";
import {isIOS} from "../../utils/deviceInfo";
import {themes as theme} from "../../theme/colors";
export const headerHeight = isIOS ? 44 : 56;

const styles = StyleSheet.create({
    headerLogo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLogoImage: {
        width: 133,
        height: 33.7
    },
    container: {
        height: headerHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: theme['light'].colors.tertiary,

    },
    headerStyle: {
        backgroundColor: theme['light'].colors.tertiary,
        paddingVertical: 10,
        position: 'relative',
        zIndex: 1
    },
    headerTitleStyle: {
        color: theme['light'].colors.dark,
        fontFamily: theme.font.medium,
        fontWeight: '500',
        fontSize: 16,
        marginHorizontal: 15,
        flex: 1,
        textAlign: 'center',
    },
    headerButton: {
        paddingVertical: 5,
        paddingHorizontal: 2.4
    },
    headerButtonIcon: {
        fontSize: 20
    },
    otherOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    otherOptionsButtonSpace: {
        marginRight: 20
    },
    lightColor: {
        color: theme['light'].colors.tertiary
    },
    lightBackgroundColor: {
        backgroundColor: theme['light'].colors.tertiary
    },

    whatsAppCallButton : {
        backgroundColor: '#25D366',
        width: 30,
        height: 30,
        borderRadius: 52,
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme['light'].colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 5,
    },
    whatsAppCallButtonImage: {
        width: 14,
        height: 14
    }
});

export default styles
