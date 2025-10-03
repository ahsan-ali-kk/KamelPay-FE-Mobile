import {Dimensions, Platform} from "react-native";
const { width: windowWidth } = Dimensions.get("window");



//ANDROID AND IOS BOTH
const PREVIEW_MARGIN_TOP = 50;
const PREVIEW_SIZE = Platform.OS === 'ios' ? 400 : 300;
const BLINK_INITIAL_VALUE = Platform.OS === 'ios' ? 0.3 : 0.4;
const TURN_HEAD_LEFT_MAX_INITIAL_VALUE = Platform.OS === 'ios' ? -15 : 310;
const TURN_HEAD_RIGHT_MIN_INITIAL_VALUE = Platform.OS === 'ios' ? 15 : 50;
const NOD_INITIAL_VALUE = Platform.OS === 'ios' ? 1.5 : 1;
const SMILE_INITIAL_VALUE = Platform.OS === 'ios' ? 0.7 : 0.7;

const detections = {
    BLINK: { instruction: "Blink both eyes", minProbability: BLINK_INITIAL_VALUE },
    TURN_HEAD_LEFT: { instruction: "Turn head left", maxAngle: TURN_HEAD_LEFT_MAX_INITIAL_VALUE },
    TURN_HEAD_RIGHT: { instruction: "Turn head right", minAngle: TURN_HEAD_RIGHT_MIN_INITIAL_VALUE },
    NOD: { instruction: "Nod", minDiff: NOD_INITIAL_VALUE },
    SMILE: { instruction: "Smile", minProbability: SMILE_INITIAL_VALUE }
};

let detectionsList = [
    "BLINK",
    "TURN_HEAD_LEFT",
    "TURN_HEAD_RIGHT",
    "NOD",
    "SMILE"
];

//IOS
const PREVIEW_RECT = {
    minX: (windowWidth - PREVIEW_SIZE) / 2,
    minY: 50,
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE
};
const instructionsText = {
    initialPrompt: "Position your face in the circle",
    performActions: "Keep the device still and perform the following actions:",
    tooClose: "You're too close. Hold the device further."
};
const initialStateIOS = {
    faceDetected: 'no',
    faceTooBig: 'no',
    detectionsList,
    currentDetectionIndex: 0,
    progressFill: 0,
    processComplete: false,
};
const detectionReducerIOS = (state = initialStateIOS, action) => {
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
                return initialStateIOS
            }
        case "FACE_TOO_BIG":
            return { ...state, faceTooBig: action.payload };
        case "NEXT_DETECTION":
            // next detection index
            const nextDetectionIndex = state.currentDetectionIndex + 1;

            // skip 0 index
            const progressMultiplier = nextDetectionIndex + 1;

            const newProgressFill =
                (100 / (state.detectionsList.length + 1)) * progressMultiplier;

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


//ANDROID
const promptsText = {
    noFaceDetected: "No face detected",
    performActions: "Perform the following actions:"
};
const initialStateAndroid = {
    faceDetected: false,
    promptText: promptsText.noFaceDetected,
    detectionsList,
    currentDetectionIndex: 0,
    progressFill: 0,
    processComplete: false
};
const detectionReducerAndroid = (state = initialStateAndroid, action) => {
    const numDetections = state.detectionsList.length;
    // +1 for face detection
    const newProgressFill =
        (100 / (numDetections + 1)) * (state.currentDetectionIndex + 1);

    switch (action.type) {
        case "FACE_DETECTED":
            if (action.value === "yes") {
                return { ...state, faceDetected: true, progressFill: newProgressFill }
            } else {
                // Reset
                return initialStateAndroid
            }
        case "NEXT_DETECTION":
            const nextIndex = state.currentDetectionIndex + 1;
            if (nextIndex === numDetections) {
                // success
                return { ...state, processComplete: true, progressFill: 100 }
            }
            // next
            return {
                ...state,
                currentDetectionIndex: nextIndex,
                progressFill: newProgressFill
            };
        default:
            throw new Error("Unexpeceted action type.")
    }
};

export default {
    PREVIEW_MARGIN_TOP: PREVIEW_MARGIN_TOP,
    PREVIEW_SIZE: PREVIEW_SIZE,
    PREVIEW_RECT: PREVIEW_RECT,
    instructionsText: instructionsText,
    detections: detections,
    detectionsList: detectionsList,
    initialState: Platform.OS === 'ios' ? initialStateIOS : initialStateAndroid,
    detectionReducer: Platform.OS === 'ios' ? detectionReducerIOS :  detectionReducerAndroid,
    promptsText: promptsText,
    Platform: Platform.OS,
    windowWidth
}
