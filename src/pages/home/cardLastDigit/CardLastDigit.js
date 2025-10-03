import React, {useRef} from "react";
import {Text, View} from "react-native";
import {ViewContainer} from "../../../containers";
import AuthStyles from '../../auth/Auth.style';
import {CButton, CModal, CText, ProgressiveImage, CInput, DateTimePicker} from "../../../uiComponents";
import Validations from "./Validations";
import {Formik} from "formik";
import {themes} from "../../../theme/colors";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import {applyMask, expiryStringToDate, masks} from "../../../utils/methods";
import OTPInputView from "../../../uiComponents/OTPInputView";

export const CardLastDigitForm = (props) => {
    const { t } = useTranslation();
    const eid = useRef(null);

    const {submit, loading, scrolled, isEid = true, preValidationValues = null} = props;

    return (
        <ViewContainer scrolled={scrolled} contentContainerStyle={AuthStyles.scrollContainer}>

            <View style={[AuthStyles.cardContainer, {marginBottom: 40}]}>
                <ProgressiveImage
                    style={AuthStyles.cardContainerImage}
                    source={require('../../../assets/images/card-last-4-digit.png')}
                />
            </View>

            <Formik
                onSubmit={submit}
                initialValues={{
                    cardNo: preValidationValues?.cardNo || '',
                    cardExpiry: preValidationValues?.cardExpiry ? expiryStringToDate(preValidationValues?.cardExpiry) : null,
                    ...(isEid && {emirateID: preValidationValues?.emirateID ? applyMask(preValidationValues?.emirateID, masks.eid) : '784'})
                }}
                validationSchema={Validations(isEid)}>
                {({handleChange, values, handleSubmit, errors, setFieldValue, submitCount, setFieldTouched}) => {
                    return (
                        <View style={AuthStyles.formContainer}>

                            <View style={AuthStyles.formInnerContainer}>

                                <View style={AuthStyles.otpContainer}>
                                    <CText style={AuthStyles.otpTitle}>{t('FIELDS_LABELS.ENTER_LAST_4_DIGIT_CARD')}</CText>
                                    <OTPInputView
                                        code={values?.cardNo}
                                        autoFocusOnLoad={false}
                                        onCodeChanged={handleChange('cardNo')}
                                        codeInputFieldStyle={AuthStyles.codeInputFieldStyle}
                                        codeInputHighlightStyle={AuthStyles.codeInputHighlightStyle}
                                        placeholderCharacter={"0"}
                                        placeholderTextColor={themes['light'].colors.primaryLighten}
                                        style={[AuthStyles.otpInputView, AuthStyles.smallOtpInputView]}
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
                                    value={(values.cardExpiry)}
                                    textStyle={GlobalStyle.inputTextStyle}
                                    onChange={(date) => setFieldValue('cardExpiry', date)}
                                    error={submitCount ? submitCount ? t(errors.cardExpiry) : setFieldTouched('cardExpiry', true, true) && t(errors.cardExpiry) : ''}
                                />

                                {isEid ?  <View>
                                    <CInput
                                        ref={eid}
                                        mask={masks.eid}
                                        inputSubLabel={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                        placeholder={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                        value={values.emirateID}
                                        onChangeText={handleChange('emirateID')}
                                        leftIconName={'emirates-ID'}
                                        error={submitCount ? submitCount ? t(errors.emirateID) : setFieldTouched('emirateID', true, true) && t(errors.emirateID) : ''}
                                        returnKeyType="next"
                                        onSubmitEditing={() => handleSubmit()}
                                    />
                                </View> : null}
                            </View>

                            <CButton title={t('GLOBAL.PROCEED')} loading={loading} onPress={() => handleSubmit()}/>

                        </View>
                    )
                }}
            </Formik>

        </ViewContainer>
    )
};

function CardLastDigit(props) {
    const { t } = useTranslation();

    const {submit, loading, onClose, scrolled = true, isEid = true, preValidationValues = null} = props;

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CARD_NUMBER'),
        headerRight: true,
        backOnPress:() => onClose()
    };

    return (
        <CModal
            edges={['top', 'left', 'right', 'bottom']}
            isOpen={props?.value}
            transparent={false}
            headerProps={headerProps}>
            <CardLastDigitForm
                submit={submit}
                loading={loading}
                scrolled={scrolled}
                isEid={isEid}
                preValidationValues={preValidationValues}
            />
        </CModal>
    )
}

export default React.memo(CardLastDigit)
