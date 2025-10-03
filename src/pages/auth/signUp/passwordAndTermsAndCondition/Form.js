import React, {useRef, useState, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CheckBox, CInput, CText} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KampayIcons from "../../../../assets/icons/KamelPayIcon";
import {viewTermsAndConditions} from "../../../../store/actions/Global.action";
import {useDispatch} from "react-redux";
import {generatePassword, generatePasswordTips} from "../../../../utils/methods";

function CForm({submit, loading}) {

    const { t, i18n } = useTranslation();
    const form = useRef();
    const dispatch = useDispatch();

    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);

    const [showPassword, togglePassword] = useState(false);
    const randomPassword = generatePassword()

    const viewTermAndConditions = () => {
        dispatch(viewTermsAndConditions({
            isOpen: true,
            type: 'CARDHOLDER_AGREEMENT',
        }))
    };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                phone: "",
                termsAndCondition: true,
                password: randomPassword,
                confirmPassword: randomPassword
            }}
            validationSchema={Validations}
        >
            {({handleChange, values, handleSubmit, errors, setFieldValue, touched, submitCount, setFieldTouched}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={[Styles.formInnerContainer, {marginBottom: 25}]}>

                            <CInput
                                isShow={false}
                                ref={email}
                                inputSubLabel={`${t('FIELDS_LABELS.EMAIL_ADDRESS')} (${t("GLOBAL.OPTIONAL")})`}
                                placeholder={t('FIELDS_LABELS.EMAIL_ADDRESS_PLACEHOLDER')}
                                value={values.email}
                                onChangeText={handleChange('email')}
                                leftIconName={'email'}
                                error={(errors.email && touched.email) && t(errors.email)}
                                returnKeyType="next"
                                onSubmitEditing={() => referralCode.current.focus()}
                            />


                            <CInput
                                ref={password}
                                inputSubLabel={t('FIELDS_LABELS.PASSWORD')}
                                placeholder={t('FIELDS_LABELS.PASSWORD_PLACEHOLDER')}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                error={(errors.password && touched.password) && t(errors.password)}
                                leftIconName={"password-lock"}
                                rightIconName={showPassword ? "hide" : "show"}
                                secureTextEntry={!showPassword}
                                toggleRightIconFunc={() => togglePassword(!showPassword)}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmPassword.current.focus()}
                                rightButton={() => {
                                    return (
                                        <KampayIcons
                                            style={[Styles.tipSectionItemIcon, {marginRight: 15}, !(errors.password) ? Styles.success : Styles.error]}
                                            name={!(errors.password) ? 'correct' :'error'}
                                        />
                                    )
                                }}
                            />

                            <CInput
                                ref={confirmPassword}
                                inputSubLabel={t('FIELDS_LABELS.CONFIRM_PASSWORD')}
                                placeholder={t('FIELDS_LABELS.CONFIRM_PASSWORD_PLACEHOLDER')}
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                error={(errors.confirmPassword && touched.confirmPassword) && t(errors.confirmPassword)}
                                leftIconName={"password-lock"}
                                rightIconName={showPassword ? "hide" : "show"}
                                secureTextEntry={!showPassword}
                                toggleRightIconFunc={() => togglePassword(!showPassword)}
                                onSubmitEditing={() => handleSubmit()}
                                rightButton={() => {
                                    return (
                                        <KampayIcons
                                            style={[Styles.tipSectionItemIcon, {marginRight: 15}, !(errors.confirmPassword) ? Styles.success : Styles.error]}
                                            name={!(errors.confirmPassword) ? 'correct' :'error'}
                                        />
                                    )
                                }}
                            />

                            {generatePasswordTips(t, values, errors)}

                            <View>
                                <CheckBox
                                    value={values.termsAndCondition}
                                    onChange={() => setFieldValue('termsAndCondition', !values.termsAndCondition)}
                                    title={t('GLOBAL.AGREE') + ' '}
                                    clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                                    clickAbleTextFunc={() => viewTermAndConditions()}
                                />
                                {errors.termsAndCondition && touched.termsAndCondition ? <CText style={[GlobalStyle.errorTextStyle, {marginTop: 0}]}>
                                    {t(errors.termsAndCondition)}
                                </CText> : null}
                            </View>

                        </View>

                        <CButton title={t('GLOBAL.REGISTER')}
                                 loading={loading}
                                 disabled={!values.termsAndCondition}
                                 onPress={() => handleSubmit()}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
