import {StyleSheet} from "react-native";
import {themes as theme, themes} from "../../theme/colors";

const Styles = StyleSheet.create({

    tabContainer: {
        backgroundColor: themes['light'].colors.tertiary,
        shadowColor: theme['light'].colors.dark2,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: .2,
        shadowRadius: 6,
        elevation: 6,
        position: 'relative',
    },
    absoluteFillObject: {
        // backgroundColor: 'red',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    },
    tabInnerContainer: {
        flexDirection: 'row',
        height: 55,
    },
    spotLight: {
        height: '100%',
        alignItems: 'center'
    },
    spotLightInner: {
        height: 45,
        width: 45,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: themes['light'].colors.secondary7
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabIcon: {
        fontSize: 20,
        color: themes['light'].colors.gray8
    },
});
export default Styles
