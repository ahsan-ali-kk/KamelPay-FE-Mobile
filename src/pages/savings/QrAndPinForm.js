import React, {Fragment} from 'react';
import {Formik} from 'formik';
import Validations from './QrAndPinValidation';
import {View} from 'react-native';
import {CButton, CText} from '../../uiComponents';
import Styles from '../auth/Auth.style';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {themes} from "../../theme/colors";
import OTPInputView from '../../lib/react-native-otp-input';
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
                        <View style={[Styles.formContainer, {flex: 0}]}>
                            <View style={[Styles.otpContainer, {marginBottom: 0}]}>
                                <CText style={Styles.otpTitle}>{t('FIELDS_LABELS.ENTER_MERCHANT_PIN')}</CText>
                                <OTPInputView
                                    code={values?.pin}
                                    onCodeChanged={handleChange('pin')}
                                    autoFocusOnLoad={false}
                                    codeInputFieldStyle={[Styles.codeInputFieldStyle, {maxWidth: 40}]}
                                    codeInputHighlightStyle={Styles.codeInputHighlightStyle}
                                    placeholderCharacter={"0"}
                                    placeholderTextColor={themes['light'].colors.primaryLighten}
                                    style={[Styles.otpInputView, {marginHorizontal: -5}]}
                                    onCodeFilled = {(code => setFieldValue('pin', code))}
                                    pinCount={6}
                                />
                                {errors.pin ? <CText style={GlobalStyle.errorTextStyle}> {t(errors.pin)} </CText>  : null}
                            </View>
                        </View>
                        <View style={Styles.bottomButton}>
                            <CButton title={t('GLOBAL.VERIFY')} loading={loading} onPress={() => handleSubmit()}/>
                        </View>
                    </Fragment>
                );
            }}
        </Formik>
    );
}
export default CForm;
