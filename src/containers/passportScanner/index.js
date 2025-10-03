import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import {
    View,
    StyleSheet,
    Platform
} from "react-native";
import { useCameraPermissions, CameraView } from "expo-camera";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {CText, CModal, CButton, ProgressiveImage, CLoading} from "../../uiComponents";
import {cropToBox, computeHole} from "./helper";
import styles from "./PassportScanner.style";
import RoundedHoleOverlay from "./RoundedHoleOverlay";
import {useDispatch} from "react-redux";
import {detectImagePassport} from "../../store/actions/Auth.action";
import mime from "mime";
import Confirmation from "./confirmation";
import jwt_decode from "jwt-decode";
import {useTranslation} from "react-i18next";
import {themes} from "../../theme/colors";
import PassportController from "./Controller";
import {KYC_VENDORS} from "../../pages/home/UpdateEmiratesID";

export const TOKEN_TYPE_CONSTANTS = {
    ACCOUNT_VERIFICATION: "ACCOUNT_VERIFICATION",
    PORTAL_USER_VERIFICATION: "PORTAL_USER_VERIFICATION",
    NEW_DEVICE_REGISTERED: "NEW_DEVICE_REGISTERED",
    CHANGE_PHONE_NUMBER_REQUEST: "CHANGE_PHONE_NUMBER_REQUEST",
    CHANGE_PASSWORD: "CHANGE_PASSWORD"
};

const PassportScanner = forwardRef((props, ref) => {
    const {
        onOcrResult,
        onUploadError,
        autoCloseOnCapture = false,
        hapticOnCapture = true,
        token = '',
        confirm,
        close,
        loading,
        isAuth = true
    } = props;

    const { t } = useTranslation();

    const [isOpen, setOpen] = useState(false);
    const [ready, setReady] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const [torch, setTorch] = useState("off");
    const [busy, setBusy] = useState(false);
    const cameraRef = useRef(null);
    const dispatch = useDispatch();
    const [viewImage, setViewImage] = useState(null); // { uri, width, height }
    const [passportInfo, updatePassportInfo] = useState(null);
    const [passportScanRes, updatePassportScanRes] = useState(null);
    const [loadingText, updateLoadingText] = useState('');
    const [type, updateType] = useState('');
    const [vendor, setVendor] = useState(KYC_VENDORS.UQUDO);

    const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
    const [hole, setHole] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const onPreviewLayout = useCallback((e) => {
        const { width, height } = e.nativeEvent.layout;
        setPreviewSize({ width, height });
        setHole(computeHole({ width, height }));  // <-- runtime hole
    }, []);

    useLayoutEffect(() => {
        PassportController.setModalRef(ref)
    }, [ref]);

    useImperativeHandle(ref, () => ({
        open: (obj) => {
            setOpen(true);
            if(obj?.type === 'MINIMAL_USER_VERIFICATION'){
                updateType(TOKEN_TYPE_CONSTANTS.ACCOUNT_VERIFICATION);
                setVendor(obj?.vendor);
            }
        },
        clearStates: () => internalClose(),
    }));

    useEffect(() => {
        (async () => {
            if (!permission) await requestPermission();
        })();
    }, [permission, requestPermission]);

    const internalClose = useCallback(() => {
        setOpen(false);
        setTorch("off");
        setBusy(false);
        updateLoadingText('');
        setViewImage(null);
        updatePassportInfo(null);
        updatePassportScanRes(null);
    }, []);

    const uploadCropped = (fileUri) =>
        new Promise((resolve, reject) => {
            const form = new FormData();

            if (token) form.append("token", token);

            const normalized = Platform.OS === "android" ? fileUri : fileUri.replace("file://", "");

            form.append("passport", {
                uri: normalized,
                name: `passport_${Date.now()}.jpg`,
                type: mime.getType(normalized) || "image/jpeg",
            });

            const cb = (res) => {
                if (res?.error) {
                    return reject(res);
                }
                onOcrResult?.(res);
                let decoded = jwt_decode(res?.data?.ocrToken);
                updatePassportInfo(decoded || null);
                updatePassportScanRes(res?.data)
                if (autoCloseOnCapture) internalClose();
                resolve(res);
            };

            dispatch(detectImagePassport(form, cb, {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }, isAuth));
        });

    const handleCapture = useCallback(async () => {
        if (busy) return;
        try {
            updateLoadingText("GLOBAL.HOLD_ON");
            setBusy(true);
            if (hapticOnCapture) {
                ReactNativeHapticFeedback.trigger("impactLight", {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                });
            }

            const photo = await cameraRef?.current?.takePictureAsync({
                quality: 0.9,
                base64: false,
                skipProcessing: false,
            });
            if (!photo?.uri) throw new Error("Failed to capture image");

            // exact crop using measured preview + hole
            const cropped = await cropToBox(
                photo.uri,
                photo.width,
                photo.height,
                previewSize,
                hole
            );

            // preview
            setViewImage({ uri: cropped.uri, width: cropped.width, height: cropped.height });
            updateLoadingText("GLOBAL.PLEASE_WAIT");
            // upload
            await uploadCropped(cropped.uri);
        } catch (e) {
            console.log(e);
            onUploadError?.(e);
        } finally {
            setBusy(false);
            updateLoadingText('');
        }
    }, [busy, hapticOnCapture, autoCloseOnCapture, onOcrResult, onUploadError, internalClose, previewSize, hole]);

    const handleTryAgain = useCallback(async () => {
        setBusy(false);
        setViewImage(null);
        updateLoadingText('');
    }, []);

    if (!permission) return <View />;
    if (!permission.granted) {
        return null;
        // return (
        //     <CModal isOpen={true} close={() => {}}>
        //         <View style={styles.center}>
        //             <CText style={{ textAlign: "center", marginBottom: 12 }}>
        //                 We need your permission to use the camera
        //             </CText>
        //             <TouchableOpacity onPress={requestPermission} style={styles.button}>
        //                 <CText style={styles.buttonText}>Grant Permission</CText>
        //             </TouchableOpacity>
        //             <CButton title={"Open Settings"} onPress={() => Linking.openSettings()} />
        //         </View>
        //     </CModal>
        // );
    }

    const headerProps = {
        headerTitle: passportInfo ? t("PAGE_TITLE.CONFIRMATION") : t("PASSPORT_SCAN.SCAN_PASSPORT"),
        headerRight: !passportInfo,
        showWhatsApp: false,
        flashIcon: !passportInfo,
        flashIconName: torch === "on" ? "flash-on" : "flash-off",
        flashOnPress: () => setTorch(p => (p === "on" ? "off" : "on")),
        backOnPress: () => passportInfo ? close() : internalClose()
    };

    const reScan = () => {
        setBusy(false);
        updateLoadingText('');
        setViewImage(null);
        updatePassportInfo(null);
        updatePassportScanRes(null);
    }

    return (
        <CModal isOpen={isOpen}
                headerProps={headerProps}
                close={internalClose}
                {...((busy || !ready) || !passportInfo && {})}
        >
            {passportInfo ? <Confirmation
                data={passportInfo}
                reScan={reScan}
                value={!!Object.keys(passportInfo).length}
                confirm={() => confirm({
                    ...passportScanRes,
                    ...(type && {docType: type}),
                    ...(type && {vendor: vendor}),
                })}
                onClose={close}
                loading={loading}
            /> : <View style={styles.container}>
                <View style={styles.preview} onLayout={onPreviewLayout}>
                    {isOpen && (
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing="back"
                            enableTorch={torch === "on"}
                            autofocus="on"
                            onCameraReady={() => setReady(true)}
                        />
                    )}
                </View>

                {/* Overlay */}
                <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
                    <RoundedHoleOverlay
                        x={hole.x}
                        y={hole.y}
                        w={hole.width}
                        h={hole.height}
                        r={18}
                    />
                    <View style={styles.captionWrap}>
                        <CText style={styles.captionTitle}>
                            {t('PASSPORT_SCAN.TITLE')}
                        </CText>
                        <CText style={styles.captionHint}>
                            {t('PASSPORT_SCAN.SUB_TITLE')}
                        </CText>
                    </View>
                </View>

                {/* Cropped image preview */}
                {viewImage && (
                    <View style={[styles.previewCard, {
                        width: hole.width,
                        height: hole.height,
                        left: hole.x,
                        top: hole.y
                    }]}>
                        <ProgressiveImage
                            source={{ uri: viewImage.uri }}
                            style={styles.previewImg}
                            resizeMode="contain"
                        />
                    </View>
                )}

                {/* Loading View */}
                {busy ? <View style={[styles.loadingView, {
                    width: hole.width,
                    height: hole.height,
                    left: hole.x,
                    top: hole.y
                }]}>
                    <CLoading loading={true}
                              transparent={true}
                              color={themes['light'].colors.tertiary}
                              textStyle={{
                                  color: themes['light'].colors.tertiary
                              }}
                              text={t(loadingText)}
                    />
                </View> : null}

                {!busy || !ready ? <View style={[styles.bottomBar]}>
                    <CButton
                        title={(!busy && viewImage) ? t('GLOBAL.TRY_AGAIN') : t("PASSPORT_SCAN.CAPTURE_AND_SCAN")}
                        loading={busy}
                        disabled={busy || !ready}
                        onPress={(!busy && viewImage) ? handleTryAgain : handleCapture}
                    />
                </View> : null}

            </View>}
        </CModal>
    );
});

export default PassportScanner;
