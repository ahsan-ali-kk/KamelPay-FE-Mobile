import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CSegmented} from '../../../../uiComponents';
import {useTranslation} from "react-i18next";
import {CONTACT_PREFERENCES} from "../helper";

function CForm({submit, loading, selectedCountry, contactUs}) {
    const { t, i18n } = useTranslation();

    const phone = useRef(null);

    return (
        <Formik
            onSubmit={(values) => submit(values)}
            initialValues={{}}
            validationSchema={Validations(selectedCountry)}
        >
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                    <View style={{width: '100%'}}>

                        <CSegmented
                            containerStyle={{marginBottom: 25}}
                            inputSubLabel={t('SIGN_UP.WE_COULD_NOT_FIND.THIRD_TITLE')}
                            data={CONTACT_PREFERENCES}
                            onSelect={(obj) => {
                                handleChange('callbackType')(obj?._id)
                            }}
                            value={values?.callbackType}
                            error={t(errors?.callbackType)}
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
                            error={t(errors.phone)}
                            returnKeyType="next"
                            onSubmitEditing={() => handleSubmit()}
                        />

                        <CButton title={t('GLOBAL.SUBMIT')} loading={loading} onPress={() => handleSubmit()}/>

                        <CButton disabled={loading} title={t('GLOBAL.CONTACT_US')} type={'without_outline'} onPress={() => contactUs()}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
