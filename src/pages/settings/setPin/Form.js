import React, {Fragment} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CText} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {themes} from "../../../theme/colors";
import OTPInputView from '../../../lib/react-native-otp-input'
import {useTranslation} from "react-i18next";

function CForm({submit, loading}) {
    const { t } = useTranslation();

    return (
        <Formik
            onSubmit={(values) => submit(values)}
            initialValues={{}}
            validationSchema={Validations}>
            {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                return (
                    <Fragment>
                        <View style={Styles.formContainer}>

                            <View style={Styles.formInnerContainer}>

                                <View style={Styles.otpContainer}>
                                    <CText style={Styles.otpTitle}>{t('VALIDATION.LOGIN_CODE.LABEL')}</CText>
                                    <OTPInputView
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
                                    <CText style={Styles.otpTitle}>{t('VALIDATION.CONFIRM_LOGIN_CODE.LABEL')}</CText>
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
                        </View>
                        <View style={Styles.bottomButton}>
                            <CButton title={t('GLOBAL.SUBMIT')} loading={loading} onPress={() => handleSubmit()}/>
                        </View>
                    </Fragment>
                );
            }}
        </Formik>
    );
}
export default CForm;
