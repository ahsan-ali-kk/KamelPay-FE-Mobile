import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";

/**
 * Dim whole screen with a smooth rounded-rect "hole"
 * and draw a white border around the hole.
 */
export default function RoundedHoleOverlay({ x, y, w, h, r, border = 3 }) {
    return (
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Defs>
                {/* White = visible (dim), Black = hole */}
                <Mask id="hole">
                    <Rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <Rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="black" />
                </Mask>
            </Defs>

            {/* Dimmer with hole */}
            <Rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#hole)" />

            {/* Soft outer plate (optional, like mock) */}
            <Rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={r + 8} ry={r + 8} fill="rgba(255,255,255,0.18)" />

            {/* White border around hole */}
            <Rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="transparent" stroke="#fff" strokeWidth={border} />
        </Svg>
    );
}
