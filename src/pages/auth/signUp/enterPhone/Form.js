import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {TouchableOpacity, View} from 'react-native';
import {CButton, CInput, CText} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import {useTranslation} from "react-i18next";

function CForm({submit, loginRoute, loading, selectedCountry}) {
    const { t, i18n } = useTranslation();

    const phone = useRef(null);

    return (
        <Formik
            onSubmit={(values) => submit(values)}
            initialValues={{
                // phone: '567054100',
            }}
            validationSchema={Validations(selectedCountry)}
        >
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

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
                                // mask={masks.phone}
                            />

                        </View>

                        <CButton title={t('GLOBAL.NEXT')} loading={loading} onPress={() => handleSubmit()}/>

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
