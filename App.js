import React, {Fragment, useEffect} from 'react';
import {I18nManager, Platform} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {Auth, Root} from "./src/routing";
import {
  getCountries,
  toggleLanguageModal
} from "./src/store/actions/Global.action";
import {getValueIntoAsyncStorage} from "./src/utils/asyncStorage/Functions";
import {LANGUAGE} from "./src/utils/asyncStorage/Constants";
import {UpdateVersion, TermsAndConditions} from "./src/containers";
import {checkBiometricAvailable, getProfile} from "./src/store/actions/Auth.action";
import {CLoading} from "./src/uiComponents";
import {useTranslation} from "react-i18next";
import SplashScreen from "react-native-splash-view";
// import {UqudoIdSDK} from "uqudosdk-react-native";
// import {OneKycSDK} from "react-native-onekyc";
import ManageCards from "./src/pages/cardManagement/manageCards/ManageCards";
import Location from "./src/utils/location";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://72ab4ca51fd1c744b5c53e316d56b8b0@o4510120699822080.ingest.us.sentry.io/4510120713256960',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});



const NewApp = () => {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(); //i18n instance

  const reduxState = useSelector(({auth, global}) => {
    return {
      getUserProfileLoading: auth.getUserProfileLoading || auth.logoutLoading,
      isLoggedIn: auth.isLoggedIn || false,
      biometricEnable: auth.biometricEnable,
      user: auth.user,
      applicationVersions: global.applicationVersions,
      getApplicationVersionsLoading: global.getApplicationVersionsLoading,
      loadingLayer: auth.checkActiveSessionLoading || global.getApplicationVersionsLoading,
    }
  });

  const initOneKyc = () => {
    // if(Platform.OS === 'android') {
    //   const sdk = new OneKycSDK(); // Create an instance
    //   sdk.init()
    //       .then((result) => {
    //         console.log('SDK initialized:', result); // Handle success
    //       })
    //       .catch((error) => {
    //         console.log('SDK initialization failed:', error.message); // Handle errors
    //       });
    // }
  };

  useEffect(() => {

    (async () => {
      let language = await getValueIntoAsyncStorage(LANGUAGE);
      language = JSON.parse(language);
      if(Platform.OS === 'ios') {
        I18nManager.allowRTL(language ? language?.direction !== 'ltr' : false);
        I18nManager.forceRTL(language ? language?.direction !== 'ltr' : false);
        I18nManager.swapLeftAndRightInRTL(language ? language?.direction !== 'ltr' : false);
      }
      if(language && Object.keys(language).length){
        await i18n.changeLanguage(language?.name); //changes the app language
      } else {
        dispatch(toggleLanguageModal(true))
      }

      // new UqudoIdSDK().init();

      initOneKyc();

      SplashScreen.hide();
    })();

    dispatch(getCountries());
    dispatch(checkBiometricAvailable());
    dispatch(getProfile());
  }, []);

  const renderRouting = (value) => {
    switch (value) {
      case true:
        return  <Root />;
      case false:
        return <Auth />;
      default:
        return null
    }
  };

  return (
      <Fragment>

        <CLoading showAnimation={true} loading={reduxState?.loadingLayer}/>

        {reduxState?.getUserProfileLoading ?
            <CLoading
                showAnimation={true}
                loading={reduxState?.getUserProfileLoading}/> : renderRouting(reduxState?.isLoggedIn)}

        {/* <UpdateVersion
            {...Platform.select({
              ios: {
                dbBuildNumber: reduxState.applicationVersions?.minimumIOSAppVersion,
                dbVersionName: reduxState.applicationVersions?.currentIOSVersionName,
                url: reduxState.applicationVersions?.IOSAppUrl,
              },
              default: {
                dbBuildNumber: reduxState.applicationVersions?.minimumAndroidAppVersion,
                dbVersionName: reduxState.applicationVersions?.currentAndroidVersionName,
                url: reduxState.applicationVersions?.androidAppUrl,
              },
            })}
        /> */}

        <ManageCards />

        <TermsAndConditions />

        <Location />

      </Fragment>
  );
};


export default Sentry.wrap(NewApp);