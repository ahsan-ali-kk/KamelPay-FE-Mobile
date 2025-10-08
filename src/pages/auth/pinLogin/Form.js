import React, {useEffect, useRef, useState, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CPinView, ProgressiveImage, CText} from '../../../uiComponents';
import Styles from '../Auth.style';
import {themes} from "../../../theme/colors";
import DeviceInfo from "react-native-device-info";
import {login} from "../../../store/actions/Auth.action";
import {getBioKey} from "../../../utils/methods";
import {useDispatch} from "react-redux";
import KamelPayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";
import ReactNativeBiometrics from "@sbaiahmed1/react-native-biometrics";

function PinCodeForm({loginRoute, biometricEnable}) {

    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();
    const form = useRef(null);
    const pinView = useRef(null);
    const [enteredPin, setEnteredPin] = useState("");

    const renderLeftButton = () => {
        if(biometricEnable && biometricEnable?.includes('BIOMETRIC')) {
            return <KamelPayIcon name={"face-recog"} size={40} color={themes['light'].colors.secondary} />
        }
        return null
    };


    const submit = async (values) => {
        let id = await DeviceInfo.getUniqueId();
        values.deviceId = id;
        values.type = 'PIN';
        await loginAction(values)
    };

    const loginAction = async (payload) => {
        dispatch(login(payload, (res) => {
            if(res?.error) {
                pinView.current.clearAll()
            }
        }))
    };

    const loginWithBiometrics = async (prePayload) => {
        let payload = {
            type: 'BIOMETRIC',
            // isClient: true,
            ...prePayload
        };

        let key = await getBioKey();
        if (key) {
            const signatureResponse = await ReactNativeBiometrics.createSignature({
                promptMessage: 'Face or fingerprint ID for NaqaD',
                payload: key,
            });
            let id = await DeviceInfo.getUniqueId();
            if (id) payload.deviceId = id;
            if (signatureResponse.signature) {
                payload.password = signatureResponse.signature;
                await loginAction(payload)
            }
        }
    };

    const biometricLogin = () => loginWithBiometrics({});

    useEffect(() => {
        if (enteredPin.length === 4) {
            form?.current?.handleSubmit();
        }
    }, [enteredPin]);

    return (
        <Formik
            innerRef={form}
            onSubmit={submit}
            initialValues={{}}
            validationSchema={Validations}>
            {({values, handleChange}) => {
                return (
                    <View style={Styles.formContainer}>
                        <View style={[Styles.formInnerContainer, {justifyContent: 'center'}]}>
                            {biometricEnable?.includes('PIN') || biometricEnable?.includes('BIOMETRIC') && biometricEnable?.includes('PIN') ?  <CPinView
                                ref={pinView}
                                pinLength={4}
                                onValueChange={(value) => {
                                    setEnteredPin(value);
                                    handleChange('password')(value);
                                }}
                                onButtonPress={async (key) => {
                                    if (key === "custom_left") {
                                       await biometricLogin();
                                    }
                                    if (key === "custom_right") {
                                        pinView.current.clear()
                                    }
                                }}
                                customLeftButton={renderLeftButton()}
                                customRightButton={<KamelPayIcon
                                        style={{  transform: [
                                                { scaleX: false ? -1 : 1 }
                                            ]}}
                                    name={"erase"} size={28} color={themes['light'].colors.secondary} />}
                            /> :
                                <TouchableOpacity
                                onPress={() => biometricLogin()}
                                style={{justifyContent:'center', alignItems: 'center', flexGrow: 1, marginTop: -50}}>
                                <ProgressiveImage
                                    style={{width: 115, height: 115}}
                                    source={require('../../../assets/images/biometric.png')}/>
                            </TouchableOpacity>
                             }
                        </View>

                        <View style={Styles.bottomTextContainer}>
                            <CText style={Styles.textContainerButtonText}>{t('GLOBAL.CANNOT')}</CText>
                            <TouchableOpacity style={Styles.textContainerButton} onPress={() => loginRoute()}>
                                <CText style={[Styles.textContainerButtonText, Styles.linkText]}>{t('GLOBAL.LOGIN')}</CText>
                            </TouchableOpacity>
                        </View>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(PinCodeForm);
