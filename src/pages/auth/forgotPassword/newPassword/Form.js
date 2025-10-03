import React, {useRef, useState, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CButton, CInput, CText} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import {useTranslation} from "react-i18next";
import {generatePasswordTips} from "../../../../utils/methods";

function CForm({submit, loginRoute, loading}) {
    const { t, i18n } = useTranslation();

    const password = useRef(null);
    const confirmPassword = useRef(null);
    const [showPassword, togglePassword] = useState(false);

    return (
        <Formik
            onSubmit={(values) => submit(values)}
            initialValues={{}}
            validationSchema={Validations}>
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

                            <CInput
                                ref={password}
                                inputSubLabel={t('FIELDS_LABELS.NEW_PASSWORD')}
                                placeholder={t('FIELDS_LABELS.NEW_PASSWORD_PLACEHOLDER')}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                error={t(errors.password)}
                                leftIconName={"password-lock"}
                                rightIconName={showPassword ? "hide" : "show"}
                                secureTextEntry={!showPassword}
                                toggleRightIconFunc={() => togglePassword(!showPassword)}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmPassword.current.focus()}
                            />

                            <CInput
                                ref={confirmPassword}
                                inputSubLabel={t('FIELDS_LABELS.NEW_CONFIRM_PASSWORD')}
                                placeholder={t('FIELDS_LABELS.NEW_CONFIRM_PASSWORD_PLACEHOLDER')}
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                error={t(errors.confirmPassword)}
                                leftIconName={"password-lock"}
                                rightIconName={showPassword ? "hide" : "show"}
                                secureTextEntry={!showPassword}
                                toggleRightIconFunc={() => togglePassword(!showPassword)}
                                onSubmitEditing={() => handleSubmit()}
                            />

                            {generatePasswordTips(t, values, errors)}

                        </View>

                        <CButton title={t('GLOBAL.CHANGE')} loading={loading} onPress={() => handleSubmit()}/>

                        <View style={Styles.bottomTextContainer}>
                            <CText style={Styles.textContainerButtonText}>{t('GLOBAL.DONT_NOT_HAVE_AN_ACCOUNT')}</CText>
                            <TouchableOpacity style={Styles.textContainerButton} onPress={loginRoute}>
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
