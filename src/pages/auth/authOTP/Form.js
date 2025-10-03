import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CButton, CText, CountDownTimer} from '../../../uiComponents';
import Styles from '../Auth.style';
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {themes} from "../../../theme/colors";
import {useTranslation} from "react-i18next";
import OTPInputView from '../../../uiComponents/OTPInputView';

function CForm(props) {
    const { t, i18n } = useTranslation();

    const {submit, loading, resendCode, otp = '', changeNumber, hideChangeNumber} = props;

    const ref = useRef();

    const again = () => {
        resendCode();
    };

    return (
        <Formik
            innerRef={ref}
            onSubmit={(values) => submit(values)}
            initialValues={{
                otp: otp
            }}
            validationSchema={Validations}>
            {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

                            <View style={[Styles.otpContainer, {marginBottom: 20}]}>
                                <OTPInputView
                                    code={values?.otp}
                                    onCodeChanged={handleChange('otp')}
                                    codeInputFieldStyle={[Styles.codeInputFieldStyle, {maxWidth: 40}]}
                                    // codeInputFieldStyle={Styles.codeInputFieldStyle}
                                    codeInputHighlightStyle={Styles.codeInputHighlightStyle}
                                    placeholderCharacter={"0"}
                                    placeholderTextColor={themes['light'].colors.primaryLighten}
                                    style={Styles.otpInputView}
                                    onCodeFilled = {(code => {
                                        setFieldValue('otp', code);
                                    })}
                                    pinCount={6} />
                                {errors.otp ? <CText style={GlobalStyle.errorTextStyle}>
                                    {t(errors.otp)}
                                </CText>  : null}
                            </View>

                            <View style={Styles.centerView}>
                                {hideChangeNumber ? <TouchableOpacity style={Styles.linkButtonWithIcon} onPress={() => changeNumber()}>
                                    <CText style={Styles.linkButtonText}>{t('GLOBAL.CHANGE_PHONE_NUMBER')}</CText>
                                </TouchableOpacity> : null}
                            </View>

                        </View>
                          {/*<View style={Styles.bottomButton}>*/}
                              <CountDownTimer text={t('GLOBAL.REQUEST_A_NEW_CODE_IN')}>
                                  <TouchableOpacity style={Styles.linkButtonWithIcon} onPress={() => again()}>
                                      <CText style={Styles.linkButtonText}>{t('GLOBAL.RESEND_A_NEW_CODE')}</CText>
                                  </TouchableOpacity>
                              </CountDownTimer>
                            <CButton title={t('GLOBAL.VERIFY')} loading={loading} onPress={() => handleSubmit()}/>
                        {/*</View>*/}
                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
