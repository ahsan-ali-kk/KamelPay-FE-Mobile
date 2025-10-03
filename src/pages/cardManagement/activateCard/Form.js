import React, {useRef} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CText} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {themes} from "../../../theme/colors";
import {useTranslation} from "react-i18next";
import OTPInputView from '../../../uiComponents/OTPInputView';

function CForm({submit, loading}) {
    const { t } = useTranslation();

    const one  = useRef();

    return (
        <Formik
            onSubmit={(values) => submit(values)}
            initialValues={{}}
            validationSchema={Validations}>
            {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

                            <View style={Styles.otpContainer}>
                                <CText style={Styles.otpTitle}>{t('FIELDS_LABELS.ENTER_NEW_PIN')}</CText>
                                <OTPInputView
                                    ref={one}
                                    code={values?.pin}
                                    onCodeChanged={handleChange('pin')}
                                    autoFocusOnLoad={false}
                                    codeInputFieldStyle={Styles.codeInputFieldStyle}
                                    codeInputHighlightStyle={Styles.codeInputHighlightStyle}
                                    placeholderCharacter={"0"}
                                    placeholderTextColor={themes['light'].colors.primaryLighten}
                                    style={[Styles.otpInputView, Styles.smallOtpInputView]}
                                    onCodeFilled = {(code => {
                                        setFieldValue('pin', code);
                                    })}
                                    pinCount={4} />
                                {errors.pin ? <CText style={GlobalStyle.errorTextStyle}> {t(errors.pin)} </CText>  : null}
                            </View>

                            <View style={Styles.otpContainer}>
                                <CText style={Styles.otpTitle}>{t('FIELDS_LABELS.ENTER_CONFIRM_NEW_PIN')}</CText>
                                <OTPInputView
                                    code={values?.confirmPin}
                                    onCodeChanged={handleChange('confirmPin')}
                                    autoFocusOnLoad={false}
                                    codeInputFieldStyle={Styles.codeInputFieldStyle}
                                    codeInputHighlightStyle={Styles.codeInputHighlightStyle}
                                    placeholderCharacter={"0"}
                                    placeholderTextColor={themes['light'].colors.primaryLighten}
                                    style={[Styles.otpInputView, Styles.smallOtpInputView]}
                                    onCodeFilled = {(code => {
                                        setFieldValue('confirmPin', code);
                                    })}
                                    pinCount={4} />
                                {errors.confirmPin ? <CText style={GlobalStyle.errorTextStyle}> {t(errors.confirmPin)} </CText>  : null}
                            </View>

                        </View>

                            <CButton title={t('GLOBAL.NEXT')} loading={loading} onPress={() => handleSubmit()}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default CForm;
