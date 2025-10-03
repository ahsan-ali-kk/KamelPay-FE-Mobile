import {StyleSheet} from "react-native";
import {themes} from "../../theme/colors";

export default StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerImage: {
        width: 32,
        height: 37
    },
    dropdownContainer: {
        backgroundColor: themes['light'].colors.tertiary,
        marginHorizontal: 30,
        marginTop: 15
    },

    locationList: {
        // flex: 1,
        // flexDirection: 'column',
        paddingHorizontal: 30,

    },
    locationListItem: {
    },
    locationListItemContent: {},
});
