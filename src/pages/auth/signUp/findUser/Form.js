import React, { useRef, memo, Fragment } from 'react';
import { Formik } from 'formik';
import Validations from './Validations';
import { TouchableOpacity, View } from 'react-native';
import {
    CButton,
    CInput,
    CSegmented,
    CText,
    DateTimePicker,
    IconButton,
    ProgressiveImage
} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import { useTranslation } from "react-i18next";
import OTPInputView from "../../../../lib/react-native-otp-input";
import { themes } from "../../../../theme/colors";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import { FIND_USER_SEGMENT } from "../helper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { QrBarcodeScanner } from "../../../../containers";
import Popup from "../../../../uiComponents/popup/Popup";

function CForm(props) {

    const { t, i18n } = useTranslation();
    const { submit, loading, loginRoute, renderPrompt, onChangeDetection } = props;
    const form = useRef(null);
    const QrBarcodeScannerRef = useRef(null);
    const referralCode = useRef(null);


    const qrButtonPopup = () => {
        Popup.show({
            isVisible: true,
            showClose: false,
            type: 'customView',
            customView: () => {
                return (
                    <View style={[GlobalStyle.flex_1, GlobalStyle.margin_top_15]}>
                        <View style={[GlobalStyle.flex_1, GlobalStyle.margin_horizontal_30]}>
                            <CText style={GlobalStyle.shortInfoModalTitle}>
                                {t('SCAN_BARCODE.TITLE')}
                            </CText>
                            <CText style={GlobalStyle.shortInfoModalText}>
                                {t('SCAN_BARCODE.SUB_TITLE')}
                            </CText>
                        </View>

                       <View style={[GlobalStyle.flex_1, {alignItems: "center"}]}>
                           <ProgressiveImage
                               style={{
                                   width: 300,
                                   height: 100
                               }}
                               resizeMode="contain"
                               source={require('./../../../../assets/images/card-qr-code.png')}
                           />
                       </View>

                        <CText style={[GlobalStyle.shortInfoModalTitle, {marginTop: 15, marginBottom: -10}]}>OR</CText>

                        <ProgressiveImage
                            style={{
                                width: 350,
                                height: 180,
                            }}
                            source={require('./../../../../assets/images/scan-barcode.png')}
                        />
                    </View>
                )
            },
            actions: [
                {
                    text: t('GLOBAL.SCAN'),
                    callback: () => {
                        Popup.hide();
                        QrBarcodeScannerRef?.current?.open(true);
                    }
                },
                {
                    text: t('GLOBAL.CANCEL'),
                    callback: () => Popup.hide()
                },
            ]
        })
    };

    const renderQrButton = () => {
        return (
            <IconButton
                buttonType={'button'}
                // onPress={() => QrBarcodeScannerRef?.current?.open(true)}
                onPress={() => qrButtonPopup()}
                buttonStyle={GlobalStyle.inputRightIconButton}>
                <MaterialIcons
                    name="qr-code-scanner"
                    style={[
                        GlobalStyle.inputIcon,
                        {
                            color: themes['light'].colors.gray7,
                            fontSize: 24
                        }
                    ]}
                />
            </IconButton>
        )
    }

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                type: FIND_USER_SEGMENT[0]._id,
                referralCode:''
                // walletID: '49790020155',
                // cardNo: '3062',
            }}
            validationSchema={Validations}
        >
            {({ handleChange, values, handleSubmit, errors, submitCount, setFieldValue, touched }) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

                            <View style={[Styles.titleAndText, { marginTop: 30, marginBottom: 30 }]}>
                                <CText style={[Styles.title, Styles.secondTitle, { marginBottom: 15 }]}>
                                    {t('SIGN_UP.TITLE')}
                                </CText>
                                <CSegmented
                                    inputSubLabel={t('SIGN_UP.SUB_TITLE')}
                                    data={FIND_USER_SEGMENT}
                                    onSelect={(obj) => {
                                        onChangeDetection && onChangeDetection();
                                        handleChange('type')(obj?._id)
                                        setFieldValue('cardNo', '');      // always reset
                                        setFieldValue('cardExpiry', '');  // always reset
                                        setFieldValue('walletID', '');    // always reset
                                    }}
                                    value={values?.type}
                                />
                            </View>

                            {values?.type === FIND_USER_SEGMENT[0]._id ? <Fragment>
                                <CInput
                                    type="number"
                                    keyboardType={'numeric'}
                                    inputSubLabel={t('VALIDATION.WALLET_ID.LABEL')}
                                    placeholder={t('VALIDATION.WALLET_ID.PLACEHOLDER')}
                                    value={values.walletID}
                                    onChangeText={(val) => handleChange('walletID')(val)}
                                    error={t(errors.walletID)}
                                    returnKeyType="next"
                                    rightButton={() => renderQrButton()}
                                    onSubmitEditing={() => handleSubmit()}
                                />

                                {/*<ProgressiveImage*/}
                                {/*    source={require('../../../../assets/images/card-digits.png')}*/}
                                {/*    style={Styles.cardDetailHeaderIconImage}*/}
                                {/*/>*/}

                            </Fragment> : null}

                            {values?.type === FIND_USER_SEGMENT[1]._id ? <Fragment>
                                <View style={[Styles.cardDetail, { marginTop: 0 }]}>
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
                                        <View style={[Styles.otpContainer, { marginBottom: 0, alignItems: 'flex-start' }]}>
                                            <OTPInputView
                                                code={values?.cardNo}
                                                onCodeChanged={handleChange('cardNo')}
                                                autoFocusOnLoad={false}
                                                codeInputFieldStyle={Styles.codeInputFieldStyle}
                                                codeInputHighlightStyle={Styles.codeInputHighlightStyle}
                                                placeholderCharacter={"0"}
                                                placeholderTextColor={themes['light'].colors.primaryLighten}
                                                style={[Styles.otpInputView, Styles.smallOtpInputView]}
                                                onCodeFilled={(code => setFieldValue('cardNo', code))}
                                                pinCount={4}
                                            />
                                            {submitCount && errors.cardNo ? <CText style={GlobalStyle.errorTextStyle}> {t(errors.cardNo)} </CText> : null}
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
                            </Fragment> : null}

                            <CInput
                                isShow={true}
                                ref={referralCode}
                                inputSubLabel={`${t('VALIDATION.REFERRAL_CODE.LABEL')} (${t("GLOBAL.OPTIONAL")})`}
                                placeholder={t('VALIDATION.REFERRAL_CODE.PLACEHOLDER')}
                                value={values.referralCode}
                                onChangeText={handleChange('referralCode')}
                                error={(errors.referralCode && touched.referralCode) && t(errors.referralCode)}
                                returnKeyType="next"
                            />

                            {renderPrompt ? renderPrompt() : null}

                        </View>

                        <CButton title={t('GLOBAL.NEXT')} loading={loading} onPress={() => handleSubmit()} />

                        <View style={Styles.bottomTextContainer}>
                            <CText style={Styles.textContainerButtonText}>{t('GLOBAL.ALREADY_HAVE_AN_ACCOUNT')}</CText>
                            <TouchableOpacity style={Styles.textContainerButton} onPress={loginRoute}>
                                <CText style={[Styles.textContainerButtonText, Styles.linkText]}>{t('GLOBAL.LOGIN')}</CText>
                            </TouchableOpacity>
                        </View>

                        <QrBarcodeScanner
                            ref={QrBarcodeScannerRef}
                            onScan={async (obj) => {
                                if (obj?.data) {
                                    await setFieldValue('walletID', obj?.data);
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
