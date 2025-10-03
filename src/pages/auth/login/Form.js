import React, {useRef, useState, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CButton, CInput, CText} from '../../../uiComponents';
import Styles from '../Auth.style';
import {useTranslation} from "react-i18next";
import {currentEnvironment} from "../../../utils/intercepter";
import ResumeSignupJourney from "../signUp/resumeSignupJourney";

function CForm(props) {
    const { t, i18n } = useTranslation();

    const {submit, forgotRoute, signUpRoute, loading, selectedCountry, toggleCountryModal} = props;

    const form = useRef(null);
    const phone = useRef(null);
    const password = useRef(null);
    const [showPassword, togglePassword] = useState(false);

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit({...values, type:'PASSWORD'})}
            initialValues={{
                ...(currentEnvironment ? {
                    phone: '505636092',
                    // phone: '567054100',
                    password: 'Password123!',
                } : {
                    password: '',
                    phone: '',
                }),
            }}
            validationSchema={Validations(selectedCountry)}
        >
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                    <View style={Styles.formContainer}>
                        <View style={Styles.formInnerContainer}>
                            <CInput
                                ref={phone}
                                type="number"
                                disabled={true}
                                selectedCountry={selectedCountry}
                                onPress={() => null}
                                keyboardType={'numeric'}
                                inputSubLabel={t('FIELDS_LABELS.PHONE_NUMBER')}
                                value={values.phone}
                                onChangeText={(val) => {
                                    let phone = val;
                                    let reg = /^0+/gi;
                                    if (phone.match(reg)) {
                                        phone = phone.replace(reg, '');
                                    }
                                    handleChange('phone')(phone)
                                }}
                                error={t(errors.phone)}
                                returnKeyType="next"
                                onSubmitEditing={() => password.current.focus()}
                                // mask={masks.phone}
                            />

                            <CInput
                                ref={password}
                                inputSubLabel={t('FIELDS_LABELS.PASSWORD')}
                                placeholder={t('FIELDS_LABELS.PASSWORD_PLACEHOLDER')}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                error={t(errors.password)}
                                rightIconName={showPassword ? "hide" : "show"}
                                leftIconName={'password-lock'}
                                secureTextEntry={!showPassword}
                                toggleRightIconFunc={() => togglePassword(!showPassword)}
                                onSubmitEditing={() => handleSubmit()}
                            />

                            <View style={Styles.textContainer}>
                                <TouchableOpacity style={Styles.textContainerButton} onPress={forgotRoute}>
                                    <CText style={[Styles.textContainerButtonText, Styles.linkText]}>
                                        {t('GLOBAL.FORGOT_PASSWORD')}
                                    </CText>
                                </TouchableOpacity>
                            </View>

                            <ResumeSignupJourney />
                        </View>

                        <CButton title={t('GLOBAL.LOGIN')} loading={loading} onPress={() => handleSubmit()}/>

                        <View style={Styles.bottomTextContainer}>
                            <CText style={Styles.textContainerButtonText}>{t('GLOBAL.DONT_NOT_HAVE_AN_ACCOUNT')}</CText>
                            <TouchableOpacity style={Styles.textContainerButton} onPress={signUpRoute}>
                                <CText style={[Styles.textContainerButtonText, Styles.linkText]}>{t('GLOBAL.SIGN_UP')}</CText>
                            </TouchableOpacity>
                        </View>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
