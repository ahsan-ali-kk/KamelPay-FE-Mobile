import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {Text, View} from 'react-native';
import {CButton, CText, DateTimePicker, Dropdown, ProgressiveImage} from '../../uiComponents';
import Styles from '../../pages/auth/Auth.style';
import {useTranslation} from "react-i18next";
import {expiryStringToDate, NATIONALITY} from "../../utils/methods";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import OTPInputView from "../../lib/react-native-otp-input";
import {themes} from "../../theme/colors";
import LivenessDetection from "../livenessDetection";

function CForm(props) {
    const { t } = useTranslation();
    const {submit, loading, masterDetails, preValidationValues} = props;

    const form = useRef(null);

    const livenessDetectionFlowRef = useRef();

    const captureImageAndSubmit = (values) => {
        submit(values)
    };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => captureImageAndSubmit(values)}
            initialValues={{
                cardNo: preValidationValues?.cardNo || '',
                cardExpiry: preValidationValues?.cardExpiry ? expiryStringToDate(preValidationValues?.cardExpiry) : null,
                nationality: preValidationValues?.nationality || ''
            }}
            validationSchema={Validations}
        >
            {({handleChange, values, handleSubmit, errors, setFieldValue, submitCount, setFieldTouched, touched}) => {
                return (
                    <View style={Styles.formContainer}>
                        <View style={Styles.formInnerContainer}>

                            <View style={[Styles.cardContainer, {marginBottom: 40}]}>
                                <ProgressiveImage
                                    style={Styles.cardContainerImage}
                                    source={require('../../assets/images/card-last-4-digit.png')}
                                />
                            </View>

                            <View style={Styles.otpContainer}>
                                <CText style={Styles.otpTitle}>{t('FIELDS_LABELS.ENTER_LAST_4_DIGIT_CARD')}</CText>
                                <OTPInputView
                                    code={values?.cardNo}
                                    autoFocusOnLoad={false}
                                    onCodeChanged={handleChange('cardNo')}
                                    codeInputFieldStyle={Styles.codeInputFieldStyle}
                                    codeInputHighlightStyle={Styles.codeInputHighlightStyle}
                                    placeholderCharacter={"0"}
                                    placeholderTextColor={themes['light'].colors.primaryLighten}
                                    style={[Styles.otpInputView, Styles.smallOtpInputView]}
                                    onCodeFilled = {(code => {
                                        // eid?.current?.focus()
                                        setFieldValue('cardNo', code);
                                    })}
                                    pinCount={4} />

                                {errors.cardNo ? <Text style={GlobalStyle.errorTextStyle}>
                                    {t(errors.cardNo)}
                                </Text>  : null}

                            </View>

                            <DateTimePicker
                                type="MONTH_AND_YEAR"
                                subLabel={t('VALIDATION.CARD_EXPIRY.TITLE')}
                                placeHolder={'MM/YYYY'}
                                displayFormat="MM/YYYY"
                                minimumDate={new Date()}
                                value={values.cardExpiry}
                                textStyle={GlobalStyle.inputTextStyle}
                                onChange={(date) => setFieldValue('cardExpiry', date)}
                                error={submitCount ? submitCount ? t(errors.cardExpiry) : setFieldTouched('cardExpiry', true, true) && t(errors.cardExpiry) : ''}
                            />

                            <DateTimePicker
                                subLabel={t('VALIDATION.DOB.TITLE')}
                                placeHolder={'DD/MM/YYYY'}
                                maximumDate={new Date()}
                                value={values.dob}
                                textStyle={GlobalStyle.inputTextStyle}
                                onChange={(date) => setFieldValue('dob', date)}
                                error={submitCount ? submitCount ? t(errors.dob) : setFieldTouched('dob', true, true) && t(errors.dob) : ''}
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


                        </View>

                        <CButton title={t('GLOBAL.SUBMIT')}
                                 loading={loading}
                                 disabled={!(values?.cardNo && values?.cardExpiry && values?.dob && values?.nationality)}
                                 onPress={() => livenessDetectionFlowRef?.current?.toggleModal()}/>

                        <LivenessDetection
                            ref={livenessDetectionFlowRef}
                            detectionsList={masterDetails?.livenessChecks}
                            onComplete={(picture) => {
                                if(picture && Object.keys(picture).length) {
                                    setFieldValue('selfie', picture);
                                    // newPay(picture);
                                    handleSubmit();
                                    livenessDetectionFlowRef?.current?.toggleModal(false);
                                }
                            }}

                        />

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
