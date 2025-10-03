import React, {useRef, Fragment, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {
    CButton,
    CheckBox,
    CInput,
    CSegmented,
    CText,
    DateTimePicker,
    Dropdown
} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import {useTranslation} from "react-i18next";
import {IDENTIFICATION_TYPE, KYC_SEGMENT} from "../helper";
import {NATIONALITY} from "../../../../utils/methods";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import KamelpayIcon from "../../../../assets/icons/KamelPayIcon";
import {getOcrTokenSignup} from "../../../../store/actions/Auth.action";
import {useDispatch} from "react-redux";
import Popup from "../../../../uiComponents/popup/Popup";
import {subYears} from "date-fns";


const ScanBox = ({ onPress, title, description, type, loading }) => (
    <TouchableOpacity style={Styles.scanBox} disabled={loading} activeOpacity={0.7} onPress={onPress}>
        {type === "PASSPORT" ? <MaterialCommunityIcons name="passport"
                                                       style={Styles.scanBoxIcon}
                                                       size={40}  /> : null}
        {type === "EMIRATES_ID" ? <KamelpayIcon name="emirates-ID"
                                                style={Styles.scanBoxIcon}
                                                size={40}/> : null}
        <CText style={Styles.scanBoxText}>{title}</CText>
        <CText style={Styles.scanBoxDescription}>{description}</CText>
    </TouchableOpacity>
);

function CForm(props) {

    const { t, i18n } = useTranslation();
    const {submit, loading, data, passportScannerRef, uqudoFlowRef} = props;
    const form = useRef(null);
    const dispatch = useDispatch();

    const passport = useRef(null);

    const errorPopup = (title, message) => {
        Popup.show({
            showClose: false,
            isVisible: true,
            type: 'Error',
            title: title || t('POPUPS.ERROR.TITLE'),
            text: message || t('ADVANCE_SALARY.REQUEST_FAIL_MESSAGE'),
            actions: [
                {
                    text: t('GLOBAL.TRY_AGAIN'),
                    callback: () => {
                        Popup.hide()
                    }
                }
            ]
        });
    };

    //===EMIRATES ID FUNCTIONS===//
    const getOcrTokenSignupCallBack = (res) => {
        if(res?.error){
            errorPopup(data?.message);
        } else {
            uqudoFlowRef?.current?.run({
                type: 'SING_UP',
                ocrToken: res?.data?.ocrToken,
                token: data?.token,
                vendor: res?.data?.vendor || '',
                uqudoUserId: res?.data?.uqudoUserId,
            })
        }
    }
    const getOCRToken = (token) => {
        let payload = { token };
        dispatch(getOcrTokenSignup(payload, getOcrTokenSignupCallBack))
    };
    const renderEmiratesIdScanView = (isVisible) => {
        return isVisible ? (
            <ScanBox
                type={"EMIRATES_ID"}
                loading={loading}
                title={t('SCAN_EMIRATES_ID.TITLE')}
                description={t('SCAN_EMIRATES_ID.SUB_TITLE')}
                onPress={() => getOCRToken(data?.token)}
            />
        ) : null
    };

    //===PASSPORT FUNCTIONS===//
    const renderPassportScanView = (isVisible) => {
        return isVisible ? (
            <ScanBox
                loading={loading}
                type={"PASSPORT"}
                title={t('SCAN_PASSPORT.TITLE')}
                description={t('SCAN_PASSPORT.SUB_TITLE')}
                onPress={() => passportScannerRef?.current?.open()}
            />
        ) : null
    };


    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                identificationType: KYC_SEGMENT[0]._id,
            }}
            validationSchema={Validations}
        >
            {({handleChange, values, handleSubmit, errors, submitCount, setFieldValue, setFieldTouched, touched}) => {
                console.log(errors)
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

                            <View style={[Styles.titleAndText, {marginTop: 30, marginBottom: 20}]}>
                                <CText style={[Styles.title, Styles.secondTitle, {marginBottom: 15}]}>
                                    {t('SIGN_UP.TITLE_2')}
                                </CText>
                                <CSegmented
                                    disable={loading}
                                    inputSubLabel={t('SIGN_UP.SUB_TITLE_2')}
                                    data={KYC_SEGMENT}
                                    onSelect={(obj) => {
                                        handleChange('identificationType')(obj?._id);
                                        setFieldValue('dontHavePassport', false)
                                        setFieldValue('passport', "")
                                        setFieldValue('nationality', "")
                                        setFieldValue('dob', "")
                                    }}
                                    value={values?.identificationType}
                                />
                            </View>


                            {renderEmiratesIdScanView(values?.identificationType === IDENTIFICATION_TYPE.EMIRATES_ID._id)}

                            {renderPassportScanView(values?.identificationType === IDENTIFICATION_TYPE.PASSPORT._id && !values.dontHavePassport)}

                            {values?.identificationType !== IDENTIFICATION_TYPE.PASSPORT._id ?  <CheckBox
                                    title={t('SIGN_UP.I_DONT_HAVE_EMIRATES_ID')}
                                    value={values.dontHavePassport}
                                    onChange={() => {
                                        handleChange('identificationType')("PASSPORT");
                                        setFieldValue('dontHavePassport', false)
                                        setFieldValue('passport', "")
                                        setFieldValue('nationality', "")
                                        setFieldValue('dob', "")
                                    } }
                                /> : null}

                            {values?.identificationType === IDENTIFICATION_TYPE.PASSPORT._id ?  <Fragment>
                                <CheckBox
                                    title={t('SIGN_UP.I_DONT_HAVE_PASSPORT')}
                                    value={values.dontHavePassport}
                                    onChange={() => setFieldValue('dontHavePassport', !values.dontHavePassport) }
                                />

                                {values.dontHavePassport ? <View style={{marginTop: 15}}>

                                    <CInput
                                        ref={passport}
                                        inputSubLabel={`${t('VALIDATION.PASSPORT.NUMBER_LABEL')} (${t("GLOBAL.OPTIONAL")})`}
                                        placeholder={t('VALIDATION.PASSPORT.NUMBER_PLACEHOLDER')}
                                        value={values.passport}
                                        onChangeText={handleChange('passport')}
                                        error={submitCount && (errors.passport) && t(errors.passport)}
                                        returnKeyType="next"
                                        onSubmitEditing={() => eid.current.focus()}
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
                                        // touched={touched.nationality}
                                        onBlur={() => setFieldTouched('nationality', true, true)}
                                        submitCount={submitCount}
                                        onChange={(val) => handleChange('nationality')(val?._id)}
                                    />

                                    <DateTimePicker
                                        subLabel={t('VALIDATION.DOB.TITLE')}
                                        placeHolder={'DD/MM/YYYY'}
                                        // maximumDate={new Date()}
                                        maximumDate={subYears(new Date(), 18)}   // user cannot pick less than 18 yrs old
                                        minimumDate={subYears(new Date(), 100)}
                                        value={values.dob}
                                        textStyle={GlobalStyle.inputTextStyle}
                                        onChange={(date) => setFieldValue('dob', date)}
                                        error={submitCount && t(errors.dob)}
                                    />
                                </View>: null}

                            </Fragment> : null}

                        </View>


                        {values?.identificationType === IDENTIFICATION_TYPE.PASSPORT._id && values.dontHavePassport ? <CButton title={t('GLOBAL.NEXT')}
                                                                        loading={loading}
                                                                        onPress={() => handleSubmit()} /> : null}

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
