import React, {
    forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState
} from "react";
import {
    View, TouchableOpacity, StyleSheet, Animated, Easing
} from "react-native";
import { CText, CModal, CButton } from "../../uiComponents";
import { useTranslation } from "react-i18next";
import { useCameraPermissions, CameraView } from "expo-camera";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {height, width, BOX_SIZE, DEFAULT_TYPES} from "./helper";
import styles from "./QrBarcodeScanner.style";


const QrBarcodeScanner = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const { onScan, autoCloseOnScan = true, hapticOnScan = true, throttleMs = 900 } = props;

    const [isOpen, setOpen] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [torch, setTorch] = useState("off");
    const lastScanAtRef = useRef(0);

    // scan-line animation
    const translateY = useRef(new Animated.Value(-BOX_SIZE / 2)).current;
    const loopRef = useRef(null);

    const startLine = useCallback(() => {
        translateY.setValue(-BOX_SIZE / 2); // reset to top on every open
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, { toValue: BOX_SIZE / 2, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                Animated.timing(translateY, { toValue: -BOX_SIZE / 2, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            ])
        );
        loopRef.current = loop;
        loop.start();
    }, [translateY]);

    const stopLine = useCallback(() => {
        loopRef.current?.stop?.();
        loopRef.current = null;
    }, []);

    useImperativeHandle(ref, () => ({
        open: () => { setScanned(false); setOpen(true); },
        close: () => { internalClose(); },
    }));

    // ask for permission once when unknown
    useEffect(() => {
        (async () => {
            if (!permission) await requestPermission();
        })();
    }, [permission, requestPermission]);

    // start/stop the scan line strictly with modal visibility
    useEffect(() => {
        if (isOpen) startLine(); else stopLine();
    }, [isOpen, startLine, stopLine]);

    // cleanup on unmount (safety)
    useEffect(() => () => { stopLine(); }, [stopLine]);

    const internalClose = useCallback(() => {
        setOpen(false);
        setScanned(false);
        setTorch("off");
        translateY.setValue(-BOX_SIZE / 2); // ensure fresh position next open
    }, [translateY]);

    const handleBarcodeScanned = useCallback(({ type, data }) => {
        // ignore if modal closed (camera might still be tearing down)
        if (!isOpen) return;

        const now = Date.now();
        if (now - lastScanAtRef.current < throttleMs) return;
        lastScanAtRef.current = now;

        if (!scanned) {
            setScanned(true);
            if (hapticOnScan) {
                ReactNativeHapticFeedback.trigger("impactLight", {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                });
            }
            if (autoCloseOnScan) internalClose();
            onScan?.({ type, data });
        }
    }, [isOpen, scanned, throttleMs, hapticOnScan, autoCloseOnScan, internalClose, onScan]);

    // ---- Permission UI ----
    if (!permission) return <View />;

    if (!permission.granted) {
        return null
        // return (
        //     <CModal isOpen={true} close={() => {}}>
        //         <View style={styles.center}>
        //             <CText style={{ textAlign: "center", marginBottom: 12 }}>
        //                 We need your permission to use the camera
        //             </CText>
        //             <TouchableOpacity onPress={requestPermission} style={styles.button}>
        //                 <CText style={styles.buttonText}>Grant Permission</CText>
        //             </TouchableOpacity>
        //             <CButton
        //                 chableOpacity
        //                 title={"Open Settings"}
        //                 onPress={() => Linking.openSettings()}
        //             />
        //         </View>
        //     </CModal>
        // );
    }

    const headerProps = {
        headerTitle:  t('GLOBAL.SCAN'),
        headerRight: true,
        showWhatsApp: false,
        flashIcon: true,
        flashIconName: torch === "on" ? "flash-on" : "flash-off",
        flashOnPress: () => setTorch(p => p === "on" ? "off" : "on"),
        backOnPress: () => internalClose(),
    };

    return (
        <CModal isOpen={isOpen}
                headerProps={headerProps}
                close={internalClose}>
            <View style={styles.container}>
                {/* Camera mounts ONLY when modal is open */}
                {isOpen && (
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        enableTorch={torch === "on"}
                        barcodeScannerSettings={{ barcodeTypes: DEFAULT_TYPES }}
                        onBarcodeScanned={handleBarcodeScanned}
                    />
                )}

                {/* Overlays */}
                <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                    <View style={styles.centerWrap}>
                        <View style={[styles.mask, {top:0,left:0,right:0,height:(height-BOX_SIZE)/2}]} />
                        <View style={[styles.mask, {bottom:0,left:0,right:0,height:(height-BOX_SIZE)/2}]} />
                        <View style={[styles.mask, {top:(height-BOX_SIZE)/2,left:0,width:(width-BOX_SIZE)/2,height:BOX_SIZE}]} />
                        <View style={[styles.mask, {top:(height-BOX_SIZE)/2,right:0,width:(width-BOX_SIZE)/2,height:BOX_SIZE}]} />
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                        {/* Scan-line renders ONLY when modal open & not scanned */}
                        {isOpen && !scanned && (
                            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
                        )}
                        <CText style={styles.instruction}>Align QR/Barcode inside the box</CText>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.bottomBar}>
                    {!autoCloseOnScan && (
                        <TouchableOpacity onPress={() => setScanned(false)} style={[styles.pill, { marginLeft: 8 }]}>
                            <CText style={styles.pillText}>{t('GLOBAL.SCAN_AGAIN')}</CText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </CModal>
    );
});

export default QrBarcodeScanner;

