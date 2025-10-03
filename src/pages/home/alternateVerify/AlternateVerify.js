import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {Text, View} from "react-native";
import {ViewContainer} from "../../../containers";
import AuthStyles from '../../auth/Auth.style';
import {CButton, CInput, CModal, CText} from "../../../uiComponents";
import Validations from "./Validations";
import {Formik} from "formik";
import {themes} from "../../../theme/colors";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {alternateVerify, getProfile} from "../../../store/actions/Auth.action";
import Popup from "../../../uiComponents/popup/Popup";
import _ from "lodash";
import {generatePasswordTips} from "../../../utils/methods";
import OTPInputView from "../../../uiComponents/OTPInputView";

export const AlternateForm = (props) => {

    const { t } = useTranslation();
    const newPassword = useRef(null);
    const confirmPassword = useRef(null);
    const [showPassword, togglePassword] = useState(false);
    const {submit, loading, isPortalUser} = props;

    return (
            <Formik
                onSubmit={submit}
                initialValues={{}}
                validationSchema={Validations(isPortalUser)}>
                {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                    return (
                        <View style={AuthStyles.formContainer}>

                            <View style={AuthStyles.formInnerContainer}>

                                <View style={[AuthStyles.otpContainer]}>
                                    <OTPInputView
                                        code={values?.otp}
                                        autoFocusOnLoad={false}
                                        onCodeChanged={handleChange('otp')}
                                        codeInputFieldStyle={AuthStyles.codeInputFieldStyle}
                                        codeInputHighlightStyle={AuthStyles.codeInputHighlightStyle}
                                        placeholderCharacter={"0"}
                                        placeholderTextColor={themes['light'].colors.primaryLighten}
                                        style={[AuthStyles.otpInputView]}
                                        onCodeFilled = {(otp => setFieldValue('otp', otp))}
                                        pinCount={6} />

                                    {errors.otp ? <Text style={GlobalStyle.errorTextStyle}>
                                        {t(errors.otp)}
                                    </Text>  : null}

                                </View>

                                <CInput
                                    isShow={isPortalUser}
                                    ref={newPassword}
                                    inputSubLabel={t('FIELDS_LABELS.NEW_PASSWORD')}
                                    placeholder={t('FIELDS_LABELS.ENTER_HERE')}
                                    value={values.newPassword}
                                    onChangeText={handleChange('newPassword')}
                                    error={t(errors.newPassword)}
                                    leftIconName={"password-lock"}
                                    rightIconName={showPassword ? "hide" : "show"}
                                    secureTextEntry={!showPassword}
                                    toggleRightIconFunc={() => togglePassword(!showPassword)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmPassword.current.focus()}
                                />

                                <CInput
                                    isShow={isPortalUser}
                                    ref={confirmPassword}
                                    inputSubLabel={t('FIELDS_LABELS.NEW_CONFIRM_PASSWORD')}
                                    placeholder={t('FIELDS_LABELS.ENTER_HERE')}
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    error={t(errors.confirmPassword)}
                                    leftIconName={"password-lock"}
                                    rightIconName={showPassword ? "hide" : "show"}
                                    secureTextEntry={!showPassword}
                                    toggleRightIconFunc={() => togglePassword(!showPassword)}
                                    onSubmitEditing={() => handleSubmit()}
                                />

                                {isPortalUser ? generatePasswordTips(t, values, errors, 'newPassword') : null}


                            </View>

                            <CButton title={t('GLOBAL.PROCEED')}
                                     buttonStyle={{width:'100%'}}
                                     loading={loading}
                                     onPress={() => handleSubmit()}/>

                        </View>
                    )
                }}
            </Formik>

    )
};

const Alternate = forwardRef((props, ref) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isOpen, updateIsOpen] = useState(false);
    const [type, setType] = useState('');

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.alternateVerifyLogin,
            user: auth.user,
        }
    });

    const {loading, user} = reduxState;

    useImperativeHandle(ref, () => ({
        toggleModal(obj) {
            updateIsOpen(true);
            setType(obj?.type || '');
        },
    }));

    const alternateVerifyCallBack = (res) => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            ...(res?.error ? {
                type: 'Error',
                title: t('GLOBAL.ERROR'),
            } : {
                type: 'Success',
                title: t('GLOBAL.SUCCESSFULLY'),
            }),
            text: res?.data?.message,
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => Popup.hide()
                },
            ]
        });

        if(!res?.error) {
            modalClose();
            dispatch(getProfile());
        }

    };

    const submit = (values) => {
        let payload = _.omit(values, ['confirmPassword', 'newPassword']);

        let updatedPayload = {
            ...payload,
            type,
            ...(values?.newPassword ? {
                password: values?.newPassword
            } : {})
        };
        console.log(updatedPayload);
        dispatch(alternateVerify(updatedPayload, alternateVerifyCallBack));
    };

    const modalClose = (value = false) => {
        updateIsOpen(value);
        setType('');
    };

    const headerProps = {
        backOnPress:() => modalClose()
    };

    return (
        <CModal isOpen={isOpen} headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={AuthStyles.scrollContainer}>
                <View style={[AuthStyles.titleAndText, {marginTop: 30}]}>
                    <CText style={AuthStyles.title}> {t('ALTERNATE_VERIFY.TITLE')} </CText>
                    <CText style={AuthStyles.text}> {t('ALTERNATE_VERIFY.SUB_TITLE')} </CText>
                </View>
                <AlternateForm
                    submit={submit}
                    loading={loading}
                    scrolled={true}
                    isPortalUser={user?.isPortalUser?.status || false}
                />
            </ViewContainer>
        </CModal>
    )

});

export default React.memo(Alternate)
