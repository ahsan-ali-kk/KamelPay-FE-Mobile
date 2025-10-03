import React from "react";
import Styles from "./UpdateVersion.style";
import {ProgressiveImage, CButton, CText} from "../../uiComponents";
import {View, Linking} from "react-native";
import {Container} from "../index";
import * as DeviceInfo from "react-native-device-info";
import {useTranslation} from "react-i18next";

const UpdateVersion = ({url, dbBuildNumber, dbVersionName}) => {

    const { t } = useTranslation();

    const currentCode = DeviceInfo.getBuildNumber();
    const currentVersion = DeviceInfo.getVersion();

    const headerProps = {
        hideBackButton: false,
        showCenterLogo: true,
        headerRight: true,
    };

    const handleClick = () => {
        Linking.canOpenURL(url).then(async supported => {
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    };

    return (dbBuildNumber > currentCode) || (dbVersionName > currentVersion) ? (
        <Container headerProps={headerProps}
                   style={Styles.viewContainer}>
            <View style={Styles.viewInnerContainer}>
                <View style={Styles.contentContainer}>
                    <ProgressiveImage style={Styles.contentVector}
                                       source={require('../../assets/images/update-app-vector.png')}/>
                    <CText style={Styles.title}>{t('UPDATE_VERSION.TITLE')}</CText>
                    <CText style={Styles.paragraph}>
                        {t('UPDATE_VERSION.SUB_TITLE')}
                    </CText>
                    <CText style={[Styles.paragraph, {marginTop: 15}]}>
                        {`Current App Version : ${currentVersion} - ${currentCode}`}
                    </CText>
                </View>
                <CButton title={t('GLOBAL.UPDATE')} onPress={() => handleClick()} />
            </View>
        </Container>
    ) : null
};

export default UpdateVersion;
