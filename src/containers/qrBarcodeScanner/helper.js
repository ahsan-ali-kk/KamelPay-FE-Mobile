import {Dimensions} from "react-native";
import {headerHeight} from "../header/Header.style";

// window dims
export const { width, height: fullHeight } = Dimensions.get("window");

// space available below the header
export const height = Math.max(0, fullHeight - (headerHeight ?? 0));

// scanner box size based on usable area
export const BOX_SIZE = Math.min(width * 0.72, height * 0.42);

export const CORNER = 28;
export const THICK = 4;

export const DEFAULT_TYPES = [
    "qr",
    "ean13",
    "ean8",
    "code128",
    "code39",
    "pdf417",
    "upc_a",
    "upc_e",
];
