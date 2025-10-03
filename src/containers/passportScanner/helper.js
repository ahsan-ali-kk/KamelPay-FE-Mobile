import * as ImageManipulator from "expo-image-manipulator";

export const PASSPORT_AR = 1.42;

// // styling constants
export const RADIUS = 18;
export const BORDER = 3;
export const MASK_OPACITY = 0.55;

// preview ke hisab se hole compute
export function computeHole(preview) {
    const MAX_W = preview.width * 0.86;
    const MAX_H = preview.height * 0.34;

    const w0 = Math.min(MAX_W, PASSPORT_AR * MAX_H);
    const h0 = Math.min(MAX_H, w0 / PASSPORT_AR);

    const w = Math.round(w0);
    const h = Math.round(h0);
    const x = Math.round((preview.width - w) / 2);
    const y = Math.round((preview.height - h) / 2);

    return { x, y, width: w, height: h };
}

// hole (preview coords) → original photo crop
export async function cropToBox(
    photoUri,
    photoW,
    photoH,
    preview,
    hole
) {
    // "cover" scaling just like camera preview
    const s = Math.max(preview.width / photoW, preview.height / photoH);
    const scaledW = photoW * s;
    const scaledH = photoH * s;

    const dx = (scaledW - preview.width) / 2;
    const dy = (scaledH - preview.height) / 2;

    let originX = Math.floor((hole.x + dx) / s);
    let originY = Math.floor((hole.y + dy) / s);
    let cw = Math.floor(hole.width / s);
    let ch = Math.floor(hole.height / s);

    // clamp
    originX = Math.max(0, Math.min(originX, photoW - 1));
    originY = Math.max(0, Math.min(originY, photoH - 1));
    cw = Math.max(1, Math.min(cw, photoW - originX));
    ch = Math.max(1, Math.min(ch, photoH - originY));

    return ImageManipulator.manipulateAsync(
        photoUri,
        [{ crop: { originX, originY, width: cw, height: ch } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
}


export async function normalizeOrientation(uri) {
    const out = await ImageManipulator.manipulateAsync(uri, [{ rotate: 0 }], { compress: 1, format: ImageManipulator.SaveFormat.JPEG });
    return out.uri;
}
