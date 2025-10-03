import { StyleSheet } from 'react-native';
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({
    // buttonStyle: {
    //     borderColor: theme['light'].colors.primary,
    //     borderWidth: 1,
    //     backgroundColor: theme['light'].colors.primary,
    //     padding: 5,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderRadius: 12,
    //     position: 'relative',
    //     height: 45,
    //     flexDirection: 'row',
    // },
    // buttonText: {
    //     color: theme['light'].colors.tertiary,
    //     fontSize: 15,
    //     fontFamily: themes.font.bold,
    // },
    // buttonIcon: {
    //     color: theme['light'].colors.primary,
    //     fontSize: 10,
    //     marginLeft: 10,
    // },
    view: {
        backgroundColor: theme['light'].colors.secondary7,
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    viewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        // backgroundColor: 'red'
    },
    viewIcon: {
        fontSize: 24,
        color: theme['light'].colors.secondary,
        marginRight: 15
    },
    viewTitle: {
        color: theme['light'].colors.secondary,
        fontSize: 14,
        fontFamily: themes.font.bold,
        lineHeight: 16,
        textAlign: 'left',
        marginRight: 10
    },
    viewText: {
        color: theme['light'].colors.secondary,
        fontSize: 12,
        fontFamily: themes.font.medium,
        flex: 1,
        lineHeight: 16,
        textAlign: 'left',
    },
    viewTextBold: {
        fontFamily: themes.font.bold,
        fontWeight: '700',
    },
    viewButton: {
        backgroundColor: 'transparent',
        width: 'auto',
        // borderColor: theme['light'].colors.secondary,
        padding: 10,
        borderRadius: 5,
        height: 'auto'
    },
    viewButtonText: {
        fontSize: 12
    },
    buttonContainer: {
        flexDirection: 'row',
        marginHorizontal: -15,
        marginTop: 5
    },
    buttonStyle: {
        marginHorizontal: 15,
    },
    descriptionTextStyle: {
        fontFamily: themes.font.regular,
        fontWeight: '400',
        fontSize: 12,
        marginTop: 5
    },
    infoListContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
    infoListItem: {
        flexDirection: 'row',
    }
})
