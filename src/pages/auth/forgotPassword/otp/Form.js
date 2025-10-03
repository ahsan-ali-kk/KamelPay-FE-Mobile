import React, {Fragment} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CButton, CText} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {themes} from "../../../../theme/colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import OTPInputView from '../../../../uiComponents/OTPInputView';

function CForm({submit, loginRoute, loading, resendCode, isLoggedIn}) {
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
                                {errors.otp ? <CText style={GlobalStyle.errorTextStyle}> {errors.otp} </CText>  : null}
                            </View>

                            <View style={Styles.centerView}>
                                <TouchableOpacity style={Styles.linkButtonWithIcon} onPress={resendCode}>
                                    <CText style={Styles.linkButtonText}>Resend code</CText>
                                    <Ionicons name="reload" style={Styles.linkButtonIcon}/>
                                </TouchableOpacity>
                            </View>


                        </View>

                        {!isLoggedIn ? <Fragment>
                                <CButton title="Next" loading={loading} onPress={() => handleSubmit()}/>
                            <View style={Styles.bottomTextContainer}>
                                <CText style={Styles.textContainerButtonText}>Already have an account?</CText>
                                <TouchableOpacity style={Styles.textContainerButton} onPress={loginRoute}>
                                    <CText style={[Styles.textContainerButtonText, Styles.linkText]}>Login</CText>
                                </TouchableOpacity>
                            </View>
                        </Fragment> :   <View style={Styles.bottomButton}>
                            <CButton title="Next" loading={loading} onPress={() => handleSubmit()}/>
                        </View>}
                    </View>
                );
            }}
        </Formik>
    );
}
export default CForm;
