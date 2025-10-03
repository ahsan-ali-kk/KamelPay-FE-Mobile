import { StyleSheet } from "react-native"
import {themes} from "../../theme/colors";

export default StyleSheet.create({

    container: {
        backgroundColor: 'red',
        flexDirection: 'row'

    },
    item: {
        height: 2,
        flex: 1,
        backgroundColor: '#D9D9D9'
    },

    activeItem: {
        backgroundColor: themes['light'].colors.primary
    }

})
