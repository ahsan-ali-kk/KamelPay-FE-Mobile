import React, {useRef, useState, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CButton, CheckBox, CInput, CText, Dropdown} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KampayIcons from "../../../../assets/icons/KamelPayIcon";
import {viewTermsAndConditions} from "../../../../store/actions/Global.action";
import {useDispatch} from "react-redux";
import {masks, NATIONALITY} from "../../../../utils/methods";

function CForm({submit, loginRoute, loading, selectedCountry}) {

    const { t, i18n } = useTranslation();
    const form = useRef();
    const dispatch = useDispatch();

    const referralCode = useRef(null);
    const email = useRef(null);
    const eid = useRef(null);
    const passport = useRef(null);
    const phone = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);

    const [numberError, updateNumberError] = useState(false);
    const [lengthError, updateLengthError] = useState(false);
    const [lowerError, updateLowerError] = useState(false);

    const [showPassword, togglePassword] = useState(false);
    const [acceptTermsAndCondition, updateAcceptTermsAndCondition] = useState(false);

    const checkLengthError = (error, value) => {
        let errorText = 'VALIDATION.PASSWORD.MIN';
        let regex = /^.{6,}$/;
        if(error !== 'VALIDATION.PASSWORD.REQUIRED') {
            if(error === errorText){
                updateLengthError(false)
            } else {
                if(value && regex.test(value)) {
                    updateLengthError(true)
                }
            }

        }
        return error === errorText
    };
    const checkLowerAlphabetError = (error, value) => {
        let errorText = 'VALIDATION.PASSWORD.LOWERCASE';
        let regex = /(.*[a-z].*)/;
        if(error !== 'VALIDATION.PASSWORD.REQUIRED') {
            if(error === errorText){
                updateLowerError(false)
            } else {
                if(value && regex.test(value)) {
                    updateLowerError(true)
                }
            }

        }
        return error === errorText
    };

    const checkNumberError = (error, value) => {
        let errorText = 'VALIDATION.PASSWORD.DIGIT';
        let regex = /(.*\d.*)/;
        if(error !== 'VALIDATION.PASSWORD.REQUIRED') {
            if(error === errorText){
                updateNumberError(false)
            } else {
                if(value && regex.test(value)) {
                    updateNumberError(true)
                }
            }

        }
        return error === errorText
    };

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
                termsAndCondition: true
            }}
            validationSchema={Validations(selectedCountry)}
        >
            {({handleChange, values, handleSubmit, errors, setFieldValue, touched, submitCount, setFieldTouched}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={[Styles.formInnerContainer, {marginBottom: 25}]}>

                            <CInput
                                isShow={false}
                                ref={email}
                                inputSubLabel={t('FIELDS_LABELS.EMAIL_ADDRESS')}
                                placeholder={t('FIELDS_LABELS.EMAIL_ADDRESS_PLACEHOLDER')}
                                value={values.email}
                                onChangeText={handleChange('email')}
                                leftIconName={'email'}
                                error={(errors.email && touched.email) && t(errors.email)}
                                returnKeyType="next"
                                onSubmitEditing={() => phone.current.focus()}
                            />

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
                                error={(errors.phone && touched.phone) && t(errors.phone)}
                                returnKeyType="next"
                                onSubmitEditing={() => passport.current.focus()}
                            />

                            <Dropdown
                                dropdownProps={{
                                    options: NATIONALITY,
                                    showCloseButton: false,
                                    modalViewContentContainerStyle:{
                                        elevation: 0,
                                        borderRadius: 0,
                                        shadowOpacity: 0,
                                        backgroundColor: 'transparent',
                                        padding: 0,
                                    },
                                    modalContentContainerStyle: {
                                        paddingHorizontal: 30
                                    },
                                    headerProps: {
                                        headerTitle: t('VALIDATION.NATIONALITY.LABEL')
                                    },
                                    showSearch: true
                                }}
                                bindingKey={'name'}
                                findingKey={'_id'}
                                displayValue={'selected'}
                                inputProps={{
                                    inputSubLabel: t('VALIDATION.NATIONALITY.LABEL'),
                                    value: values.nationality,
                                    placeholder: t('VALIDATION.NATIONALITY.PLACEHOLDER'),
                                }}
                                error={t(errors.nationality)}
                                touched={touched.nationality}
                                onBlur={() => setFieldTouched('nationality', true, true)}
                                submitCount={submitCount}
                                onChange={(val) => handleChange('nationality')(val?._id)}
                            />

                            <CInput
                                ref={passport}
                                inputSubLabel={t('VALIDATION.PASSPORT.NUMBER_LABEL')}
                                placeholder={t('VALIDATION.PASSPORT.NUMBER_PLACEHOLDER')}
                                value={values.passport}
                                onChangeText={handleChange('passport')}
                                error={(errors.passport) && t(errors.passport)}
                                returnKeyType="next"
                                onSubmitEditing={() => eid.current.focus()}
                            />

                            <CInput
                                ref={eid}
                                mask={masks.eid}
                                inputSubLabel={t('FIELDS_LABELS.EMIRATES_ID')}
                                placeholder={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                value={values.emirateID}
                                onChangeText={handleChange('emirateID')}
                                leftIconName={'emirates-ID'}
                                error={t(errors.emirateID)}
                                returnKeyType="next"
                                onSubmitEditing={() => referralCode.current.focus()}
                            />

                            <CInput
                                isShow={true}
                                ref={referralCode}
                                inputSubLabel={`${t('VALIDATION.REFERRAL_CODE.LABEL')} (${t("GLOBAL.OPTIONAL")})`}
                                placeholder={t('VALIDATION.REFERRAL_CODE.PLACEHOLDER')}
                                value={values.referralCode}
                                onChangeText={handleChange('referralCode')}
                                // leftIconName={'referralCode'}
                                error={(errors.referralCode && touched.referralCode) && t(errors.referralCode)}
                                returnKeyType="next"
                                onSubmitEditing={() => password.current.focus()}
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

                            <View style={Styles.tipSection}>
                                <CText style={Styles.tipSectionTitle}>{t('GLOBAL.PASSWORD_VALIDATION_TIPS')}</CText>
                                <CText style={Styles.tipSectionSubTitle}>{t('GLOBAL.PASSWORD_VALIDATION_TIPS_SUB_TITLE')}</CText>
                                <View style={Styles.tipSectionItem}>
                                    <KampayIcons
                                        style={[Styles.tipSectionItemIcon, checkLengthError(errors?.password, values?.password) ? checkLengthError(errors?.password, values?.password) && Styles.error : (values?.password && lengthError) && Styles.success]}
                                        name={checkLengthError(errors?.password, values?.password) ? 'error' : 'correct'}/>
                                    <CText style={[Styles.tipSectionItemText, checkLengthError(errors?.password) && Styles.error]}>
                                        {t('GLOBAL.PASSWORD_VALIDATION_TIPS_ONE')}
                                    </CText>
                                </View>
                                <View style={Styles.tipSectionItem}>
                                    <KampayIcons
                                        style={[Styles.tipSectionItemIcon, checkLowerAlphabetError(errors?.password, values?.password) ? checkLowerAlphabetError(errors?.password, values?.password) && Styles.error : (values?.password && lowerError) && Styles.success]}
                                        name={checkLowerAlphabetError(errors?.password, values?.password) ? 'error' : 'correct'}/>
                                    <CText style={[Styles.tipSectionItemText, checkLowerAlphabetError(errors?.password, values?.password) && Styles.error]}>
                                        {t('GLOBAL.PASSWORD_VALIDATION_TIPS_THREE')}
                                    </CText>
                                </View>
                                <View style={Styles.tipSectionItem}>
                                    <KampayIcons
                                        style={[Styles.tipSectionItemIcon, checkNumberError(errors?.password, values?.password) ? checkNumberError(errors?.password, values?.password) && Styles.error : (values?.password && numberError) && Styles.success]}
                                        name={checkNumberError(errors?.password, values?.password) ? 'error' : 'correct'}/>
                                    <CText style={[Styles.tipSectionItemText, checkNumberError(errors?.password, values?.password) && Styles.error]}>
                                        {t('GLOBAL.PASSWORD_VALIDATION_TIPS_FOUR')}
                                    </CText>
                                </View>
                            </View>

                            <View>
                                <CheckBox
                                    value={values.termsAndCondition}
                                    onChange={() => setFieldValue('termsAndCondition', !values.termsAndCondition)}
                                    title={t('GLOBAL.AGREE')}
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
                                 onPress={() => handleSubmit()}/>

                        <View style={Styles.bottomTextContainer}>
                            <CText style={Styles.textContainerButtonText}>{t('GLOBAL.ALREADY_HAVE_AN_ACCOUNT')}</CText>
                            <TouchableOpacity style={Styles.textContainerButton} onPress={loginRoute}>
                                <CText style={[Styles.textContainerButtonText, Styles.linkText]}>{t('GLOBAL.LOGIN')}</CText>
                            </TouchableOpacity>
                        </View>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
