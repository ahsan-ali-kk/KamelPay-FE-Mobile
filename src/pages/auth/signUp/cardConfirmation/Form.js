import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CButton, ProgressiveImage, CText, DateTimePicker} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import KamlepayIcon from "../../../../assets/icons/KamelPayIcon";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {themes} from "../../../../theme/colors";
import {useTranslation} from "react-i18next";
import OTPInputView from '../../../../uiComponents/OTPInputView';

function CForm({submit, loginRoute, loading}) {
    const { t, i18n } = useTranslation();

    const formRef = useRef(null);

    const renderErrorView = (error) => {
        return error ? (
            <CText style={GlobalStyle.errorTextStyle}>
                {error}
            </CText>
        ) : null
    };

    const selectAndToggleCard = (val) => {
        let selectedCard = formRef?.current?.values?.cardSelection || [];
        if(selectedCard?.includes(val)) {
            selectedCard = selectedCard.filter(o => o !== val);
        } else {
            selectedCard.push(val)
        }
        formRef?.current?.setFieldValue('cardSelection', selectedCard)
    };

    return (
        <Formik
            innerRef={formRef}
            onSubmit={(values) => submit(values)}
            initialValues={{
                // cardSelection: []
            }}
            validationSchema={Validations}
        >
            {({handleChange, values, handleSubmit, errors, setFieldValue, submitCount}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>
                            <View style={[Styles.titleAndText, {marginTop: 30}]}>
                                <CText style={[Styles.title, Styles.secondTitle]}>{t('CARD_CONFIRMATION.TITLE')}</CText>
                            </View>


                            <View style={Styles.vectorContainer}>
                                <ProgressiveImage
                                    source={require('../../../../assets/images/card-confirmation-icon.png')}
                                    style={Styles.confirmationVector}
                                />
                            </View>


                            <View style={Styles.cardDetail}>
                                <View style={Styles.cardDetailHeader}>
                                    <View style={Styles.cardDetailHeaderIcon}>
                                        <ProgressiveImage
                                            source={require('../../../../assets/images/card-digits.png')}
                                            style={Styles.cardDetailHeaderIconImage}
                                        />
                                    </View>
                                    <View style={Styles.cardDetailContent}>
                                        <CText style={Styles.cardDetailContentTitle}>
                                            {t('CARD_CONFIRMATION.SECOND_TITLE')}
                                        </CText>
                                        <CText style={Styles.cardDetailContentText}>
                                            {t('CARD_CONFIRMATION.SECOND_SUB_TITLE')}
                                        </CText>
                                    </View>
                                </View>
                                <View style={Styles.cardDetailBody}>
                                    <View style={[Styles.otpContainer, {marginBottom: 0}]}>
                                        <OTPInputView
                                            code={values?.cardNo}
                                            onCodeChanged={handleChange('cardNo')}
                                            autoFocusOnLoad={false}
                                            codeInputFieldStyle={Styles.codeInputFieldStyle}
                                            codeInputHighlightStyle={Styles.codeInputHighlightStyle}
                                            placeholderCharacter={"0"}
                                            placeholderTextColor={themes['light'].colors.primaryLighten}
                                            style={[Styles.otpInputView, Styles.smallOtpInputView]}
                                            onCodeFilled = {(code => {
                                                setFieldValue('cardNo', code);
                                            })}
                                            pinCount={4} />
                                        {errors.cardNo ? <CText style={GlobalStyle.errorTextStyle}> {t(errors.cardNo)} </CText>  : null}
                                    </View>
                                </View>
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

                            {/*<View style={Styles.separator}>*/}
                            {/*    <View style={Styles.separatorLine}/>*/}
                            {/*    <CText style={Styles.separatorText}> {t('GLOBAL.OR')} </CText>*/}
                            {/*    <View style={Styles.separatorLine}/>*/}
                            {/*</View>*/}

                            {/*<TouchableOpacity style={Styles.bottomCard}*/}
                            {/*                  onPress={() => submit()}>*/}
                            {/*    <ProgressiveImage*/}
                            {/*        source={require('../../../../assets/images/new-card-vector.png')}*/}
                            {/*        style={Styles.bottomCardImage}*/}
                            {/*    />*/}
                            {/*    <CText style={Styles.bottomCardText}>*/}
                            {/*        {t('CARD_CONFIRMATION.THIRD_TITLE')}*/}
                            {/*    </CText>*/}

                            {/*    <KamlepayIcon*/}
                            {/*        name="right-arrow"*/}
                            {/*        style={Styles.bottomCardIcon}*/}
                            {/*    />*/}

                            {/*</TouchableOpacity>*/}


                        </View>

                        <CButton title={t('GLOBAL.I_AM_READY')} loading={loading} onPress={() => handleSubmit()}/>

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
