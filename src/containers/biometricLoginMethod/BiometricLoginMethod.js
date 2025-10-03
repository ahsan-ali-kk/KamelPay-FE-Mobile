import React, {useEffect, useState} from "react";
import {View} from "react-native";
import Styles from './BiometricLoginMethod.style';
import AuthStyles from '../../pages/auth/Auth.style';
import {CButton, CModal, ProgressiveImage, CText} from "../../uiComponents";
import DeviceInfo from "react-native-device-info";
import {registerDevice, toggleEnableBiometric} from "../../store/actions/Auth.action";
import {setUpBiometricLogin} from "../../utils/methods";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";

function BiometricLoginMethod(props) {
    const { t, i18n } = useTranslation();

    const {onClose} = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isOpen, updateIsOpen] = useState(false);

    const reduxState = useSelector(({auth}) => {
        return {
            registerDeviceLoading: auth.registerDeviceLoading,
            biometricAvailable: auth.biometricAvailable,
            biometricEnable: auth.biometricEnable,
            toggleBiometricModalIsOpen: auth.toggleBiometricModalIsOpen,
        }
    });

    useEffect(() => {
        if(isOpen !== reduxState?.toggleBiometricModalIsOpen){
            updateIsOpen(reduxState?.toggleBiometricModalIsOpen)
        }
    }, [reduxState?.toggleBiometricModalIsOpen]);

    const registerBiometric = async (value) => {
        let payload = { hash: value, type: "BIOMETRIC" };
        let id = await DeviceInfo.getUniqueId();
        payload.deviceId = id;
        dispatch(registerDevice(payload, () => {
            if(!reduxState?.biometricEnable?.includes('PIN')) {
                close();
                navigation.navigate('Settings', { screen: 'set_pin',  initial: false, params: {
                        isBackFalse: true
                    }});
            } else {
                close();
            }
        }))
    };


    const setUpBiometricLoginCB = (res) => {
        if(!res.success){
            navigateSetPinAndClose()
        }
    };

    const biometricLogin = async () => {
        const publicKey  = await setUpBiometricLogin(setUpBiometricLoginCB);
        if (publicKey) {
            await registerBiometric(publicKey)
        }
    };

    const navigateSetPinAndClose = () => {
        if(!reduxState?.biometricEnable?.includes('PIN')) {
            navigation.navigate('Settings', { screen: 'set_pin',  initial: false, params: {
                    isBackFalse: true
                }});
        }
        // navigation.navigate('set_pin');
        close();
    };

    const allow = async () => {
        if(reduxState?.biometricAvailable && !reduxState?.biometricEnable?.includes('BIOMETRIC')) {
            await biometricLogin()
        } else {
            navigateSetPinAndClose()
        }
    };

    const close = () => {
        // dispatch(toggleEnableBiometric(!reduxState?.toggleBiometricModalIsOpen));
        dispatch(toggleEnableBiometric(false));
        onClose && onClose()
    };

    const headerProps = {
        hideBackButton: true,
        showCenterLogo: false,
        headerRight: true,
        hideSetting: false,
        hideLogout: false,
        backOnPress:() => reduxState.registerDeviceLoading ? null : navigateSetPinAndClose()
    };

    return (
        <CModal
            isOpen={isOpen}
            transparent={false}
            headerProps={headerProps}>
            <View style={[Styles.container]}>

                <View style={Styles.innerContainer}>

                    <View style={Styles.vectorContainer}>
                        <ProgressiveImage
                            style={Styles.vectorContainerImage}
                            source={require('../../assets/images/biometric.png')}
                        />
                    </View>
                    <View style={AuthStyles.titleAndText}>
                        <CText style={Styles.title}> {t('BIOMETRIC_MODAL.TITLE')} </CText>
                        <CText style={Styles.text}> {t('BIOMETRIC_MODAL.SUB_TITLE')} </CText>
                    </View>

                </View>

                <CButton
                    loading={reduxState.registerDeviceLoading}
                    onPress={() => allow()}
                    buttonStyle={{marginBottom: 10}}
                    title={t('BIOMETRIC_MODAL.BUTTON2')} />

                <CButton
                    type="without_outline"
                    disabled={reduxState.registerDeviceLoading}
                    onPress={() => navigateSetPinAndClose()}
                    title={t('BIOMETRIC_MODAL.SECOND_BUTTON')} />

            </View>

        </CModal>
    )
}

export default React.memo(BiometricLoginMethod)
