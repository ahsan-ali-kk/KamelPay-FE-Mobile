import React, {useEffect, useRef} from "react";
import {AppRegistry, LogBox, StatusBar, AppState} from 'react-native';
import {name as appName} from './app.json';
import {store} from "./src/store";
import {Provider, useDispatch} from "react-redux";
import {initialWindowMetrics, SafeAreaProvider} from "react-native-safe-area-context";
import {interceptor} from "./src/utils/intercepter";
import App from './App';
import Toast from "react-native-toast-message";
import {PopupRoot} from "./src/uiComponents";
import {navigationRef} from "./src/routing/Ref";
import { NavigationContainer } from '@react-navigation/native';
import 'intl-pluralrules';
import "./src/i18n/i18n.config";
import "./src/utils/firebase";
import {taggingScreenName} from "./src/trackingEvents/UXCAM";
import {BiometricLoginMethod} from "./src/containers";
import {checkActiveSession} from "./src/store/actions/Auth.action";
import LanguageModal from "./src/uiComponents/languagePicker/LanguageModal";
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {getApplicationVersions} from "./src/store/actions/Global.action";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    setLocalStorageDataIntoNewKeyAndRemoveOldKey
} from "./src/utils/asyncStorage/Functions";
import {USER_BIO_KEY, USER_BIOMETRICS} from "./src/utils/asyncStorage/Constants";
import {DatadogProvider} from "@datadog/mobile-react-native";
import { DdRumReactNavigationTracking } from "@datadog/mobile-react-navigation";
import {config as dataDogConfig, onSDKInitialized} from './src/utils/dataDog';
import './src/utils/notification/notifee.background';
import { requestUserPermission, notificationListener, getFcmTokenFromLocalStorage } from './src/utils/notification/notifications';
import { showSplash } from "react-native-splash-view";
LogBox.ignoreAllLogs();

showSplash();


const theme = {
    colors: {
        background: "transparent",
    },
};

const Container = () => {

    const routeNameRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const appStateListener = AppState.addEventListener(
            'change',
            nextAppState => {
                if(nextAppState && nextAppState === 'active') {
                    dispatch(getApplicationVersions());
                    dispatch(checkActiveSession(true));
                    (async () => {
                        await setLocalStorageDataIntoNewKeyAndRemoveOldKey('BIO_KEY', USER_BIO_KEY);
                        await setLocalStorageDataIntoNewKeyAndRemoveOldKey('BIOMETRICS', USER_BIOMETRICS);
                    })();
                }
            },
        );
        return () => {
            appStateListener.remove();
        };
    }, []);

    useEffect(() => {
        (async () => {
            await interceptor();
            await requestUserPermission(); // permissions + channel
            await getFcmTokenFromLocalStorage();
        })();
        dispatch(getApplicationVersions());
        const unsub = notificationListener(); // no save, no consume
        return () => unsub?.();
    }, []);

    return (
        <NavigationContainer theme={theme}
                             ref={navigationRef}
                             onReady={() => {
                                 DdRumReactNavigationTracking.startTrackingViews(navigationRef?.current)
                             }}
                             onStateChange={async () => {
                                 const previousRouteName = routeNameRef.current;
                                 const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;
                                 if (previousRouteName !== currentRouteName) {
                                     // console.log('currentRouteName', currentRouteName);
                                     taggingScreenName(currentRouteName);
                                     dispatch(checkActiveSession())
                                 }
                                 routeNameRef.current = currentRouteName;
                             }}>

            <GestureHandlerRootView style={{ flex: 1 }}>
                <PopupRoot>

                    <BottomSheetModalProvider>
                        <App />
                    </BottomSheetModalProvider>

                </PopupRoot>

                <BiometricLoginMethod />
                <LanguageModal/>

            </GestureHandlerRootView>
            {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
        </NavigationContainer>
    )
};

function Kamelpay() {
    return (
        <DatadogProvider configuration={dataDogConfig} onInitialization={onSDKInitialized}>
            <Provider store={store}>
                <StatusBar translucent backgroundColor="white" barStyle={'dark-content'}/>
                <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <Container />
                </SafeAreaProvider>
            </Provider>
        </DatadogProvider>

        
    )
}

AppRegistry.registerComponent(appName, () => Kamelpay);
