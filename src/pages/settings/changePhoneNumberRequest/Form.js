import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, DateTimePicker} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {useTranslation} from "react-i18next";
import {masks} from "../../../utils/methods";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";

function CForm(props) {
    const { t, i18n } = useTranslation();

    const {submit, loading, selectedCountry, verificationWithOcr} = props;

    const form = useRef(null);
    const newPhone = useRef(null);
    const confirmNewPhone = useRef(null);
    const emirateID = useRef(null);

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                // oldPhone: '567054100',
                // newPhone: '505636093',
                // emirateID: '784-1978-4802030-7',
                // dateOfBirth: new Date('1978-05-01'),
                oldPhone: '',
                newPhone: '',
                emirateID: '784',
                dateOfBirth: '',
            }}
            validationSchema={Validations(verificationWithOcr, selectedCountry)}
        >
            {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>
                            {/*<CInput*/}
                            {/*    ref={oldPhone}*/}
                            {/*    type="number"*/}
                            {/*    disabled={true}*/}
                            {/*    selectedCountry={selectedCountry}*/}
                            {/*    onPress={() => null}*/}
                            {/*    keyboardType={'numeric'}*/}
                            {/*    inputSubLabel={t('VALIDATION.OLD_PHONE_NUMBER.TITLE')}*/}
                            {/*    value={values.oldPhone}*/}
                            {/*    onChangeText={(val) => {*/}
                            {/*        let phone = val;*/}
                            {/*        let reg = /^0+/gi;*/}
                            {/*        if (phone.match(reg)) {*/}
                            {/*            phone = phone.replace(reg, '');*/}
                            {/*        }*/}
                            {/*        handleChange('oldPhone')(phone)*/}
                            {/*    }}*/}
                            {/*    error={t(errors.oldPhone)}*/}
                            {/*    returnKeyType="next"*/}
                            {/*    onSubmitEditing={() => newPhone.current.focus()}*/}
                            {/*/>*/}

                            <CInput
                                ref={newPhone}
                                type="number"
                                disabled={true}
                                selectedCountry={selectedCountry}
                                onPress={() => null}
                                keyboardType={'numeric'}
                                inputSubLabel={t('VALIDATION.NEW_PHONE_NUMBER.TITLE')}
                                value={values.newPhone}
                                onChangeText={(val) => {
                                    let phone = val;
                                    let reg = /^0+/gi;
                                    if (phone.match(reg)) {
                                        phone = phone.replace(reg, '');
                                    }
                                    handleChange('newPhone')(phone)
                                }}
                                error={t(errors.newPhone)}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmNewPhone.current.focus()}
                            />
                            <CInput
                                ref={confirmNewPhone}
                                type="number"
                                disabled={true}
                                selectedCountry={selectedCountry}
                                onPress={() => null}
                                keyboardType={'numeric'}
                                inputSubLabel={t('VALIDATION.CONFIRM_NEW_PHONE_NUMBER.TITLE')}
                                value={values.confirmNewPhone}
                                onChangeText={(val) => {
                                    let phone = val;
                                    let reg = /^0+/gi;
                                    if (phone.match(reg)) {
                                        phone = phone.replace(reg, '');
                                    }
                                    handleChange('confirmNewPhone')(phone)
                                }}
                                error={t(errors.confirmNewPhone)}
                                returnKeyType="next"
                                onSubmitEditing={() => !verificationWithOcr ? emirateID.current.focus() : handleSubmit()}
                            />

                            <CInput
                                isShow={!verificationWithOcr}
                                ref={emirateID}
                                mask={masks.eid}
                                inputSubLabel={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                placeholder={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                value={values.emirateID}
                                onChangeText={handleChange('emirateID')}
                                leftIconName={'emirates-ID'}
                                error={t(errors.emirateID)}
                                returnKeyType="next"
                                // onSubmitEditing={() => handleSubmit()}
                            />

                            <DateTimePicker
                                isShow={!verificationWithOcr}
                                // ref={dob}
                                subLabel={t('VALIDATION.DOB.TITLE')}
                                placeHolder={'DD/MM/YYYY'}
                                maximumDate={new Date()}
                                value={values.dateOfBirth}
                                textStyle={GlobalStyle.inputTextStyle}
                                onChange={(date) => setFieldValue('dateOfBirth', date)}
                                error={t(errors.dateOfBirth)}
                            />

                        </View>

                        <CButton title={t('GLOBAL.NEXT')} loading={loading} onPress={() => handleSubmit()}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
