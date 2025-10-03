import React, {useRef} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, ProgressiveImage, CText, DateTimePicker, CInput} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import CStyles from './AddCard.style';
import {ViewContainer} from "../../../containers";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {themes} from "../../../theme/colors";
import {useTranslation} from "react-i18next";
import {masks} from "../../../utils/methods";
import OTPInputView from '../../../uiComponents/OTPInputView';

function CForm(props) {

    const { t } = useTranslation();

    const eid = useRef(null);
    const passport = useRef(null);

    const {submit, loading, isLightUser = false} = props;

    return (
        <Formik
            onSubmit={submit}
            initialValues={{}}
            validationSchema={Validations(isLightUser)}
        >
            {({touched, handleChange, values, handleSubmit, errors, setFieldValue, submitCount, setFieldTouched}) => {
                return (
                    <ViewContainer scrolled={true}
                                   renderFooter={() => {
                                       return (
                                           <View style={GlobalStyle.listFooterButton}>
                                               <CButton title={t("GLOBAL.LINK_NOW")}
                                                        loading={loading}
                                                        onPress={() => handleSubmit()}/>
                                           </View>
                                       )
                                   }}
                                   contentContainerStyle={Styles.scrollContainer}>

                       <View style={[CStyles.vectorWithContent, {alignItems: 'center', marginBottom: 50}]}>
                           <ProgressiveImage
                               style={CStyles.vector}
                               source={require('../../../assets/images/new-card-vector.png')}
                           />
                       </View>

                        <View style={Styles.formContainer}>

                            <View style={Styles.formInnerContainer}>

                                <View style={Styles.otpContainer}>
                                    <CText style={Styles.otpTitle}>{t('FIELDS_LABELS.NEW_CARD_LAST_DIGIT')}</CText>
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
                                            setFieldValue('cardNo', code);
                                        })}
                                        pinCount={4} />

                                    {errors.cardNo ? <CText style={GlobalStyle.errorTextStyle}>
                                        {t(errors.cardNo)}
                                    </CText>  : null}

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

                                <CInput
                                    isShow={isLightUser}
                                    ref={passport}
                                    inputSubLabel={t('VALIDATION.PASSPORT.NUMBER_LABEL')}
                                    placeholder={t('VALIDATION.PASSPORT.NUMBER_PLACEHOLDER')}
                                    value={values.passport}
                                    onChangeText={handleChange('passport')}
                                    leftIconName={'emirates-ID'}
                                    error={(errors.passport) && t(errors.passport)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => eid.current.focus()}
                                />

                                <CInput
                                    isShow={isLightUser}
                                    ref={eid}
                                    mask={masks.eid}
                                    inputSubLabel={t('FIELDS_LABELS.EMIRATES_ID')}
                                    placeholder={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                    value={values.emirateID}
                                    onChangeText={handleChange('emirateID')}
                                    leftIconName={'emirates-ID'}
                                    error={t(errors.emirateID)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => handleSubmit()}
                                />


                            </View>
                        </View>

                    </ViewContainer>
                );
            }}
        </Formik>
    );
}
export default CForm;
