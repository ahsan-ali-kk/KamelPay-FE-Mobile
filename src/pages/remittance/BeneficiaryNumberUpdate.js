import React, {useEffect, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {CButton, CInput, CText, CModal} from "../../uiComponents";
import {Formik} from "formik";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KeyboardView from "../../containers/KeyboardView";
import * as Yup from "yup";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {getCountryByKey, validateNumberRegex} from "../../utils/methods";
import {useSelector} from "react-redux";

function BeneficiaryNumberUpdate(props) {
    const { t, i18n } = useTranslation();

    const reduxState = useSelector(({global}) => {
        return {
            countries: global.countries,
        }
    });

    const {submit, loading, onClose, isOpen, country} = props;

    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        let foundCountry = getCountryByKey(reduxState?.countries, country?.CCA2);
        setSelectedCountry(foundCountry)
    }, [country]);

    const onSubmit = (values) => {
        let perifix = selectedCountry?.detail?.code;
        values.BeneficiaryMSISDN = `${perifix.replace(/[^\w\s]/gi, '')}${values.BeneficiaryMSISDN.replace(/\s+/g, '')}`;
        submit && submit(values);
        onClose && onClose()
    };

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => onClose()}>
            <Formik
                onSubmit={(values) => onSubmit(values)}
                initialValues={{}}
                validationSchema={Yup.object().shape({
                    BeneficiaryMSISDN: Yup.string().label('VALIDATION.PHONE.LABEL')
                        .test('checkPhoneNumber', (value, obj) => validateNumberRegex(selectedCountry, value || '', obj))
                        .required("VALIDATION.PHONE.REQUIRED")
                })}>
                {({handleChange, values, handleSubmit, errors}) => {
                    return (
                        <KeyboardView contentContainerStyle={[ GlobalStyle.centerModalCenterViewContainerScroll ]}>
                            <View style={GlobalStyle.centerModalCenterViewContainer}>

                                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => onClose()}>
                                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                                </TouchableOpacity>

                                <CText style={GlobalStyle.centerModalCenterViewTitle}>
                                    {/*{t('FIELDS_LABELS.ENTER_AMOUNT')}*/}
                                    Update
                                </CText>

                                <CInput
                                    // ref={phone}
                                    // inputSubLabel={t('FIELDS_LABELS.MOBILE_NUMBER')}
                                    inputSubLabel={'Receiver contact number'}
                                    type="number"
                                    selectedCountry={selectedCountry}
                                    disabled={true}
                                    // onPress={() => toggleCountryModal()}
                                    keyboardType={'numeric'}
                                    value={values.BeneficiaryMSISDN}
                                    onChangeText={(val) => {
                                        let phone = val;
                                        let reg = /^0+/gi;
                                        if (phone.match(reg)) {
                                            phone = phone.replace(reg, '');
                                        }
                                        handleChange('BeneficiaryMSISDN')(phone)
                                    }}
                                    error={t(errors.BeneficiaryMSISDN)}
                                    onSubmitEditing={() => handleSubmit()}
                                    // onBlur={() => setAccountNumber()}
                                    returnKeyType="next"
                                />

                                <CButton title={t('GLOBAL.UPDATE')}
                                         loading={loading}
                                         onPress={() => handleSubmit()}/>

                            </View>
                        </KeyboardView>
                    )
                }}
            </Formik>
        </CModal>
    )
}

export default React.memo(BeneficiaryNumberUpdate)
