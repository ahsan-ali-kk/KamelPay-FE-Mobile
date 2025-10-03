import { StyleSheet } from "react-native";
import {MASK_OPACITY, RADIUS} from "./helper";
import {themes} from "../../theme/colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes['light'].colors.dark
    },
    preview: {
        flex: 1
    },
    camera: {
        ...StyleSheet.absoluteFillObject
    },
    centerWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    mask: {
        position: "absolute",
        backgroundColor: `rgba(0,0,0,${MASK_OPACITY})`
    },

    captionWrap: {
        position: "absolute",
        top: 24,
        left: 24,
        right: 24
    },
    captionTitle: {
        color: themes['light'].colors.tertiary,
        fontSize: 18,
        fontFamily: themes.font.bold,
        fontWeight: "700",
        marginBottom: 10
    },
    captionHint: {
        color: themes['light'].colors.tertiary,
        fontSize: 14,
        fontFamily: themes.font.regular,
        fontWeight: "400",
        marginBottom: 10
    },

    bottomBar: {
        position: "absolute",
        left: 15,
        right: 15,
        bottom: 30
    },

    center: { alignItems: "center", justifyContent: "center", padding: 16 },

    previewCard: {
        position: "absolute",
        borderRadius: RADIUS,
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        // width: FRAME_W,
        // height: FRAME_H,
        // left: holeX,
        // top: holeY
    },
    previewImg: {
        width: '100%',
        height: '100%',
        borderRadius: RADIUS,
    },


    loadingView: {
        position: "absolute",
        // width: FRAME_W,
        // height: FRAME_H,
        borderRadius: RADIUS,
        // top: holeY,
        // left: holeX,
        backgroundColor: "rgba(0,0,0,0.5)",
    }
});
