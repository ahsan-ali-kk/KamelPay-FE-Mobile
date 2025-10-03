import React, {useEffect, useState, memo, Fragment} from 'react';
import {View, ScrollView, TouchableOpacity} from "react-native";
import {Container} from "../../../containers";
import {checkIsAppUserOrRegisterDevice, setUpBiometricLogin} from "../../../utils/methods";
import Styles from "../Settings.style";
import {CText, IconButton, CToggleSwitch} from "../../../uiComponents";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {useDispatch, useSelector} from "react-redux";
import {registerDevice, removeBiometricsType} from "../../../store/actions/Auth.action";
import ReactNativeBiometrics from "react-native-biometrics";
import DeviceInfo from "react-native-device-info";
import {useTranslation} from "react-i18next";

function PasswordsAndBiometrics(props) {
    const { t } = useTranslation();


    const {navigation} = props;
    const dispatch = useDispatch();

    const [isSetPin, setIsSetPin] = useState(false);
    const [isSetBiometric, setIsSetBiometric] = useState(false);
    const [biometricAvailable, setBiometricAvailable] = useState(false);

    const reduxState = useSelector(({global, auth, savings}) => {
        return {
            biometricEnable: auth.biometricEnable,
            registerDeviceLoading: auth.registerDeviceLoading,
            user: auth.user,
        }
    });

    const headerProps = {
        headerTitle: t('SETTINGS.OPTIONS_TWO'),
        headerRight: true,
    };

    useEffect(() => {
        if(reduxState?.biometricEnable){
            setIsSetPin(reduxState?.biometricEnable.includes('PIN'));
            setIsSetBiometric(reduxState?.biometricEnable.includes('BIOMETRIC'))
        }

        ReactNativeBiometrics.isSensorAvailable()
            .then((resultObject) => {
                const { available, biometryType } = resultObject;
                // console.log('resultObject', resultObject);
                setBiometricAvailable(available)
            })
    }, [reduxState.biometricEnable]);

    const toggleIsSetPin = () => {
        if(!isSetPin) {
            navigation.navigate('set_pin');
        } else {
            setIsSetPin(false);
            dispatch(removeBiometricsType('PIN'))
        }
    };

    const registerBiometric = async (value) => {
        let payload = { hash: value, type: "BIOMETRIC" };
        let id = await DeviceInfo.getUniqueId();
        payload.deviceId = id;
        dispatch(registerDevice(payload))
    };

    const biometricLogin = async () => {
        const publicKey  = await setUpBiometricLogin();
        if (publicKey) {
            await registerBiometric(publicKey)
        }
    };

    const toggleIsSetBiometric = async () => {
        if(!isSetBiometric) {
            await biometricLogin()
        } else {
            setIsSetBiometric(false);
            dispatch(removeBiometricsType('BIOMETRIC'))
        }
    };


    return (
        <Container headerProps={headerProps}
                   loading={reduxState?.registerDeviceLoading || reduxState?.subscriptionCancelLoading}
        >
            <ScrollView contentContainerStyle={Styles.listContainer}>
                <View style={Styles.list}>

                    <TouchableOpacity onPress={() => navigation.navigate('change_password')} style={Styles.listItem}>
                        <IconButton
                            buttonStyle={Styles.listItemButton}
                            buttonIconStyle={Styles.listItemButtonIcon}
                            buttonType='normal'
                            type="icon-with-background"
                            iconName={'password'} />
                        <CText style={Styles.listItemText} numberOfLines={1}>{t('GLOBAL.CHANGE_PASSWORD')}</CText>
                        <KamelpayIcon style={Styles.listItemRightIcon} name={"arrow-up"}/>
                    </TouchableOpacity>
                    {checkIsAppUserOrRegisterDevice(reduxState?.user, () => {
                        return (
                            <Fragment>
                                <View style={Styles.listItem}>
                                    <IconButton
                                        buttonStyle={Styles.listItemButton}
                                        buttonIconStyle={Styles.listItemButtonIcon}
                                        buttonType='normal'
                                        type="icon-with-background"
                                        iconName={'password'} />
                                    <CText style={Styles.listItemText} numberOfLines={1}>{t('GLOBAL.SETUP_PIN_LOGIN')}</CText>
                                    <CToggleSwitch style={{}} onToggle={() => toggleIsSetPin()} isOn={isSetPin} />
                                </View>

                                {biometricAvailable ?  <View style={Styles.listItem}>
                                    <IconButton
                                        buttonStyle={Styles.listItemButton}
                                        buttonIconStyle={Styles.listItemButtonIcon}
                                        buttonType='normal'
                                        type="icon-with-background"
                                        iconName={'face-recog'} />
                                    <CText style={Styles.listItemText} numberOfLines={1}>{t('GLOBAL.SETUP_BIO_LOGIN')}</CText>
                                    <CToggleSwitch style={{}} onToggle={() => toggleIsSetBiometric()} isOn={isSetBiometric} />
                                </View> : null}
                            </Fragment>
                        )
                    })}
                </View>
            </ScrollView>
        </Container>
    )
}

export default memo(PasswordsAndBiometrics);
