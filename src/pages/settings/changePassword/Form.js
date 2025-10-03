import React, {Fragment, useRef, useState} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import Popup from "../../../uiComponents/popup/Popup";
import {generatePasswordTips} from "../../../utils/methods";

function CForm({submit, loading, uqudoTokenType = '', uqudoToken}) {

    const { t } = useTranslation();
    const oldPassword = useRef(null);
    const newPassword = useRef(null);
    const confirmPassword = useRef(null);
    const [showPassword, togglePassword] = useState(false);


    const onSubmit = (values) => {
        if(!uqudoTokenType) {
            Popup.show({
                isVisible: true,
                type: 'Warning',
                title: 'Are You Sure!',
                text: 'Do you want to remove all other devices from your account?',
                actions: [
                    {
                        text:  t('GLOBAL.OK'),
                        callback: () => {
                            submit({
                                ...values,
                                removeRegisteredDevices: true
                            });
                            Popup.hide();
                        }
                    },
                    {
                        text:  t('GLOBAL.NO'),
                        callback: () => {
                            submit({
                                ...values,
                                removeRegisteredDevices: false
                            });
                            Popup.hide();
                        }
                    }
                ]
            })
        }
        else {
            submit({
                ...values,
                uqudoToken,
                uqudoTokenType
            });
        }

    };

    return (
        <Formik
            onSubmit={(values) => onSubmit(values)}
            initialValues={{}}
            validationSchema={Validations(uqudoTokenType)}>
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                   <Fragment>
                       <View style={Styles.formContainer}>

                           <View style={Styles.formInnerContainer}>

                               <CInput
                                   ref={oldPassword}
                                   isShow={!uqudoTokenType}
                                   inputSubLabel={t('FIELDS_LABELS.OLD_PASSWORD')}
                                   placeholder={t('FIELDS_LABELS.ENTER_HERE')}
                                   value={values.oldPassword}
                                   onChangeText={handleChange('oldPassword')}
                                   error={t(errors.oldPassword)}
                                   leftIconName={"password-lock"}
                                   rightIconName={showPassword ? "hide" : "show"}
                                   secureTextEntry={!showPassword}
                                   toggleRightIconFunc={() => togglePassword(!showPassword)}
                                   returnKeyType="next"
                                   onSubmitEditing={() => newPassword.current.focus()}
                               />

                               <CInput
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

                               {generatePasswordTips(t, values, errors, 'newPassword')}

                           </View>

                       </View>
                       <View style={GlobalStyle.bottomView}>
                           <CButton title={t('GLOBAL.SUBMIT')}
                                    loading={loading}
                                    onPress={() => handleSubmit()}/>
                       </View>
                   </Fragment>
                );
            }}
        </Formik>
    );
}
export default CForm;
