import {StyleSheet} from 'react-native';
import {themes as theme, themes} from "../../theme/colors";

export default StyleSheet.create({

   container: {
       flexDirection: 'row',
       paddingHorizontal: 25,
       alignItems: 'flex-start',
       // backgroundColor: 'red'
   },
    containerItem: {
        flex: 1,
        marginHorizontal: 5,
        marginBottom: 0
    },
    button: {
       // backgroundColor: themes['light'].colors.secondary,
       //  borderWidth: 1,
        // borderColor: themes['light'].colors.secondary,
        // width: 50,
        // height: 50,
        borderRadius: 10,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    buttonIcon: {
        color: themes['light'].colors.secondary,
        fontSize: 18,
    }
});
