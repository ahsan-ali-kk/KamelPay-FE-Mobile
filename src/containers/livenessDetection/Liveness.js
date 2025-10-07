import * as React from "react"
// import * as FaceDetector from "expo-face-detector"
import { Camera, FaceDetectionResult } from "expo-camera"
import {Dimensions, Platform, StyleSheet, View} from "react-native"
import { AnimatedCircularProgress } from "react-native-circular-progress"
import { contains } from "./contains"
import MaskedView from "@react-native-masked-view/masked-view"
import {Fragment} from "react";
import {CText} from "../../uiComponents";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {useRef} from "react";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const { width: windowWidth } = Dimensions.get("window");

const PREVIEW_SIZE = windowWidth / 1.2;
const PREVIEW_RECT = {
    minX: (windowWidth - PREVIEW_SIZE) / 2,
    minY: 25,
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE
};

const instructionsText = {
    initialPrompt: "LIVENESS.INITIAL_PROMPT",
    performActions: "LIVENESS.PERFORM_ACTIONS",
    tooClose: "LIVENESS.TOO_CLOSE"
};

const BLINK_INITIAL_VALUE = Platform.OS === 'ios' ? 0.3 : 0.4;
const TURN_HEAD_LEFT_MAX_INITIAL_VALUE = Platform.OS === 'ios' ? -15 : 150;
const TURN_HEAD_RIGHT_MIN_INITIAL_VALUE = Platform.OS === 'ios' ? 15 : 200;
const NOD_INITIAL_VALUE = Platform.OS === 'ios' ? 1.5 : 1;
const SMILE_INITIAL_VALUE = Platform.OS === 'ios' ? 0.7 : 0.8;

const detections = {
    BLINK: { instruction: "LIVENESS.BLINK", minProbability: BLINK_INITIAL_VALUE },
    TURN_HEAD_LEFT: { instruction: "LIVENESS.TURN_HEAD_LEFT", maxAngle: TURN_HEAD_LEFT_MAX_INITIAL_VALUE },
    TURN_HEAD_RIGHT: { instruction: "LIVENESS.TURN_HEAD_RIGHT", minAngle: TURN_HEAD_RIGHT_MIN_INITIAL_VALUE },
    NOD: { instruction: "LIVENESS.NOD", minDiff: NOD_INITIAL_VALUE },
    SMILE: { instruction: "LIVENESS.SMILE", minProbability: SMILE_INITIAL_VALUE },
    CAPTURE: {
        instruction: "LIVENESS.CAPTURE",
        time: 700,
        smileMinProbability: 0.07,
        eyesOpenProbability: 0.7,
    }
};

let detectionsList = [
    "BLINK",
    "TURN_HEAD_LEFT",
    "TURN_HEAD_RIGHT",
    "NOD",
    "SMILE",
    "CAPTURE",
];

const initialState = {
    faceDetected: "no",
    faceTooBig: "no",
    detectionsList,
    currentDetectionIndex: 0,
    progressFill: 0,
    processComplete: false,
};

const detectionReducer = (state, action) => {
    switch (action.type) {
        case "FACE_DETECTED":
            if (action.payload === "yes") {
                return {
                    ...state,
                    faceDetected: action.payload,
                    progressFill: 100 / (state.detectionsList.length + 1),
                }
            } else {
                // Reset
                return initialState
            }
        case "FACE_TOO_BIG":
            return { ...state, faceTooBig: action.payload };
        case "NEXT_DETECTION":
            // next detection index
            const nextDetectionIndex = state.currentDetectionIndex + 1;

            // skip 0 index
            const progressMultiplier = nextDetectionIndex + 1;

            const newProgressFill = (100 / (state.detectionsList.length + 1)) * progressMultiplier;

            if (nextDetectionIndex === state.detectionsList.length) {
                // success
                return {
                    ...state,
                    processComplete: true,
                    progressFill: newProgressFill
                }
            }
            // next
            return {
                ...state,
                currentDetectionIndex: nextDetectionIndex,
                progressFill: newProgressFill
            }
    }

    return state
};

export default function Liveness(props) {
    const { t } = useTranslation();

    const [hasPermission, setHasPermission] = React.useState(false);
    const [state, dispatch] = React.useReducer(detectionReducer, initialState);
    const [captureStatus, setCaptureStatus] = React.useState('');
    const rollAngles = React.useRef([]);
    const cameraRef = React.useRef(null);
    const screenShotRef = useRef(null);

    const requestPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted")
    };

    React.useEffect(() => {
        state.detectionsList = props?.detectionsList || detectionsList;
        (async () => {
            await requestPermissions()
        })()
    }, []);

    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
    };

    const triggerVibration = () => {
        ReactNativeHapticFeedback.trigger("rigid", options);
    };

    const onFacesDetected = async (result) => {
        // 1. There is only a single face in the detection results.
        if (result.faces.length !== 1) {
            dispatch({ type: "FACE_DETECTED", payload: "no" });
            return
        }

        //@ts-ignore
        const face = result.faces[0];

        const faceRect = {
            minX: face.bounds.origin.x,
            minY: face.bounds.origin.y,
            width: face.bounds.size.width,
            height: face.bounds.size.height
        };

        // 2. The face is almost fully contained within the camera preview.
        const edgeOffset = 50;
        const faceRectSmaller = {
            width: faceRect.width - edgeOffset,
            height: faceRect.height - edgeOffset,
            minY: faceRect.minY + edgeOffset,
            minX: faceRect.minX + edgeOffset / 2
        };
        const previewContainsFace = contains({
            outside: PREVIEW_RECT,
            inside: faceRectSmaller
        });
        if (!previewContainsFace) {
            dispatch({ type: "FACE_DETECTED", payload: "no" });
            return
        }

        // if (state.faceDetected === "no") {
            // 3. The face is not as big as the camera preview.
            const faceMaxSize = PREVIEW_SIZE - 135;
            if (faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize) {
                dispatch({ type: "FACE_TOO_BIG", payload: "yes" });
                return
            }

            if (state.faceTooBig === "yes") {
                dispatch({ type: "FACE_TOO_BIG", payload: "no" })
            }
        // }

        if (state.faceDetected === "no") {
            dispatch({ type: "FACE_DETECTED", payload: "yes" })
        }

        const detectionAction = state.detectionsList[state.currentDetectionIndex];

        let rightEyePosition = face?.RIGHT_EYE?.x;
        let leftEyePosition = face?.LEFT_EYE?.x;

        switch (detectionAction) {
            case "BLINK":
                setCaptureStatus('');
                // Lower probabiltiy is when eyes are closed
                const leftEyeClosed = face.leftEyeOpenProbability <= detections.BLINK.minProbability;
                const rightEyeClosed = face.rightEyeOpenProbability <= detections.BLINK.minProbability;

                if (leftEyeClosed && rightEyeClosed) {

                    triggerVibration();
                    dispatch({ type: "NEXT_DETECTION", payload: null })
                }
                return;
            case "NOD":
                setCaptureStatus('');
                // Collect roll angle data
                rollAngles.current.push(face.rollAngle);

                // Don't keep more than 10 roll angles (10 detection frames)
                if (rollAngles.current.length > 10) {
                    rollAngles.current.shift()
                }

                // If not enough roll angle data, then don't process
                if (rollAngles.current.length < 10) return;

                // Calculate avg from collected data, except current angle data
                const rollAnglesExceptCurrent = [...rollAngles.current].splice(
                    0,
                    rollAngles.current.length - 1
                );

                // Summation
                const rollAnglesSum = rollAnglesExceptCurrent.reduce((prev, curr) => {
                    return prev + Math.abs(curr)
                }, 0);

                // Average
                const avgAngle = rollAnglesSum / rollAnglesExceptCurrent.length;

                // If the difference between the current angle and the average is above threshold, pass.
                const diff = Math.abs(avgAngle - Math.abs(face.rollAngle));

                if (diff >= detections.NOD.minDiff) {
                    triggerVibration();
                    dispatch({ type: "NEXT_DETECTION", payload: null })
                }
                return;
            case "TURN_HEAD_LEFT":
                setCaptureStatus('');
                // Negative angle is the when the face turns left
                if(Platform.OS === 'ios'){
                    if (face.yawAngle <= detections.TURN_HEAD_LEFT.maxAngle) {
                        triggerVibration();
                        dispatch({ type: "NEXT_DETECTION", payload: null })
                    }
                } else {
                    if (leftEyePosition <= detections.TURN_HEAD_LEFT.maxAngle) {
                        triggerVibration();
                        dispatch({ type: "NEXT_DETECTION", payload: null })
                    }
                }
                return;
            case "TURN_HEAD_RIGHT":
                setCaptureStatus('');
                // Positive angle is the when the face turns right
                if(Platform.OS === 'ios'){
                    if (face.yawAngle >= detections.TURN_HEAD_RIGHT.minAngle) {
                        triggerVibration();
                        dispatch({ type: "NEXT_DETECTION", payload: null })
                    }
                } else {
                    if (rightEyePosition >= detections.TURN_HEAD_RIGHT.minAngle) {
                        triggerVibration();
                        dispatch({ type: "NEXT_DETECTION", payload: null })
                    }
                }

                return;
            case "SMILE":
                setCaptureStatus('');
                // Higher probabiltiy is when smiling
                if (face.smilingProbability >= detections.SMILE.minProbability) {
                    triggerVibration();
                    dispatch({ type: "NEXT_DETECTION", payload: null })
                }
                return;

            case "CAPTURE":

                const leftEyeOpen = face.leftEyeOpenProbability <= detections.CAPTURE.eyesOpenProbability;
                const rightEyeOpen = face.rightEyeOpenProbability <= detections.CAPTURE.eyesOpenProbability;

                //smiling condition
                if(face.smilingProbability >= detections.CAPTURE.smileMinProbability) {
                    setCaptureStatus('Please do not smile');
                } else {
                    setCaptureStatus('');
                    if(leftEyeOpen && rightEyeOpen) {
                        setCaptureStatus('Please Open Both Eyes');
                    } else {
                        setCaptureStatus('');
                        // triggerVibration();

                        dispatch({ type: "NEXT_DETECTION", payload: null });
                    }
                }

                return;
        }
    };

    React.useEffect(() => {
        (async () => {
            setTimeout(async () => {
                if (state.processComplete) {
                    // if(Platform.OS === 'ios') {
                        let options = { skipProcessing: false, imageType: 'jpg', quality: 1 };
                        let picture = await cameraRef?.current?.takePictureAsync(options);
                        let updatePicture =  await manipulateAsync(
                            picture.localUri || picture.uri,
                            [],
                            {compress: 0.5, format: SaveFormat.JPEG }
                        );
                    props?.onTestComplete && props?.onTestComplete(updatePicture)
                }
            }, 750)
        })()
    }, [state.processComplete]);

    return (
        <View style={styles.container}>
            {!hasPermission ? <View style={styles.hasNoCameraContainer}>
                <CText style={styles.hasNoCameraContainerText}>No access to camera</CText>
            </View> : <Fragment>
                <MaskedView
                    style={[StyleSheet.absoluteFill, {
                        alignItems:'center',
                    }]}
                    maskElement={<View style={styles.mask} />}
                >
                    {/* <Camera
                        ref={cameraRef}
                        style={{marginTop: PREVIEW_RECT.minY, height: PREVIEW_SIZE + 100, width: PREVIEW_SIZE}}
                        type={Camera.Constants.Type.front}
                        onFacesDetected={onFacesDetected}
                        faceDetectorSettings={{
                            mode: FaceDetector.FaceDetectorMode.accurate,
                            detectLandmarks: FaceDetector.FaceDetectorLandmarks[Platform.OS === 'ios' ? 'none' : 'all'],
                            runClassifications: FaceDetector.FaceDetectorClassifications.all,
                            minDetectionInterval: 125,
                            tracking: true,
                        }}
                    >
                        <AnimatedCircularProgress
                            style={styles.circularProgress}
                            size={PREVIEW_SIZE}
                            width={5}
                            backgroundWidth={7}
                            fill={state.progressFill}
                            tintColor={themes['light'].colors.secondary}
                            backgroundColor={themes['light'].colors.secondary4}
                        />
                    </Camera> */}
                </MaskedView>
                <View style={styles.instructionsContainer}>
                    <CText style={styles.instructions}>
                        {state.faceDetected === "no" && state.faceTooBig === "no" && t(instructionsText.initialPrompt)}

                        {state.faceTooBig === "yes" && t(instructionsText.tooClose)}

                        {state.faceDetected === "yes" && state.faceTooBig === "no" && t(instructionsText.performActions)}
                    </CText>
                    {state.faceDetected === "yes" && state.faceTooBig === "no" ? <CText style={styles.action}>
                        {state.faceDetected === "yes" && state.faceTooBig === "no" && captureStatus ? captureStatus : t(detections[state.detectionsList[state.currentDetectionIndex]]?.instruction)}
                    </CText> : null}
                </View>
            </Fragment>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    hasNoCameraContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    hasNoCameraContainerText: {
        color: themes['light'].colors.dark,
        fontFamily: themes.font.medium,
        fontWeight: '500',
        fontSize: 16,
        marginHorizontal: 15,
        textAlign: 'center',
    },
    mask: {
        borderRadius: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        width: PREVIEW_SIZE,
        marginTop: PREVIEW_RECT.minY,
        alignSelf: "center",
        backgroundColor: "white"
    },
    circularProgress: {
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
    },

    instructionsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: PREVIEW_RECT.minY + PREVIEW_SIZE,
        paddingHorizontal: 25
    },
    instructions: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 15
        // top: 25,
        // position: "absolute"
    },
    action: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: themes.font.bold,
        color: themes['light'].colors.dark,
    }
});
