import {StyleSheet} from "react-native";
import {BOX_SIZE, CORNER, height, THICK, width} from "./helper";
import {themes} from "../../theme/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes['light'].colors.dark
    },
    camera: {
        flex: 1
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: "#1677ff",
        padding: 12,
        borderRadius: 6,
        marginTop: 10
    },
    buttonText: {
        color: themes['light'].colors.tertiary,
        fontWeight: "bold"
    },
    centerWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    mask: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.55)"
    },
    corner: {
        position: "absolute",
        width: CORNER,
        height: CORNER,
        borderColor: themes['light'].colors.tertiary
    },
    topLeft: {
        top:(height-BOX_SIZE)/2,
        left:(width-BOX_SIZE)/2,
        borderLeftWidth:THICK,
        borderTopWidth:THICK,
        borderTopLeftRadius:6
    },
    topRight: {
        top:(height-BOX_SIZE)/2,
        right:(width-BOX_SIZE)/2,
        borderRightWidth:THICK,
        borderTopWidth:THICK,
        borderTopRightRadius:6
    },
    bottomLeft: {
        bottom:(height-BOX_SIZE)/2,
        left:(width-BOX_SIZE)/2,
        borderLeftWidth:THICK,
        borderBottomWidth:THICK,
        borderBottomLeftRadius:6
    },
    bottomRight: {
        bottom:(height-BOX_SIZE)/2,
        right:(width-BOX_SIZE)/2,
        borderRightWidth:THICK,
        borderBottomWidth:THICK,
        borderBottomRightRadius:6
    },
    scanLine: {
        position:"absolute",
        width:BOX_SIZE-8,
        height:2,
        backgroundColor:"#00ff99",
        top:"50%",
        left:(width-(BOX_SIZE-8))/2
    },
    instruction: {
        position:"absolute",
        bottom:(height-BOX_SIZE)/2-48,
        alignSelf:"center",
        fontSize:15,
        textAlign:"center",
        fontFamily: themes.font.regular,
        fontWeight: '400',
        color: themes['light'].colors.tertiary,
    },
    bottomBar: {
        position:"absolute",
        bottom:40,
        flexDirection:"row",
        alignSelf:"center"
    },
    pill: {
        backgroundColor:"rgba(22,119,255,0.9)",
        paddingVertical:10,
        paddingHorizontal:14,
        borderRadius:999
    },
    pillText: {
        color: themes['light'].colors.tertiary,
        fontWeight:"600"
    },
});
