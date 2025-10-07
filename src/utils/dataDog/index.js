import {
    BatchSize,
    DatadogProviderConfiguration,
    DdSdkReactNative,
    SdkVerbosity,
    UploadFrequency
} from "@datadog/mobile-react-native";
import {currentEnvironment} from "../intercepter";
import {
    ImagePrivacyLevel,
    SessionReplay,
    TextAndInputPrivacyLevel,
    TouchPrivacyLevel
} from "@datadog/mobile-react-native-session-replay";

const config = new DatadogProviderConfiguration(
    "pubfb24e309ae3553594d6d1bd455aa9655",
    currentEnvironment ? `${currentEnvironment.replace(".", "")}-1` : "production",
    "414702d3-f429-41bc-b0d1-dbcdd288f55e",
    true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
    true, // track XHR Resources
    true // track Errors
);

// Add this function as onInitialization prop to DatadogProvider
const onSDKInitialized = async () => {
    await SessionReplay.enable({
        replaySampleRate: 100,
        textAndInputPrivacyLevel: TextAndInputPrivacyLevel.MASK_SENSITIVE_INPUTS,
        imagePrivacyLevel: ImagePrivacyLevel.MASK_NONE,
        touchPrivacyLevel: TouchPrivacyLevel.SHOW,
    });
};

DdSdkReactNative.initialize(config)
    .then(() => SessionReplay.enable())
    .catch((error) => { /* handle error */ });

config.site = "US1"
// Optional: Enable JavaScript long task collection
config.longTaskThresholdMs = 100
// Optional: enable or disable native crash reports
config.nativeCrashReportEnabled = true
// Optional: sample RUM sessions (here, 100% of session will be sent to Datadog. Default = 100%. Only tracked sessions send RUM events.)
config.sessionSamplingRate = 100

if (__DEV__) {
    // Optional: Send data more frequently
    config.uploadFrequency = UploadFrequency.FREQUENT
    // Optional: Send smaller batches of data
    config.batchSize = BatchSize.SMALL
    // Optional: Enable debug logging
    config.verbosity = SdkVerbosity.DEBUG
}
export {
    config,
    onSDKInitialized
}
