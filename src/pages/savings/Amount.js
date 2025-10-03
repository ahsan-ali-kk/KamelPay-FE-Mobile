import React from "react";
import {TouchableOpacity, View} from "react-native";
import {CButton, CInput, CText, CModal} from "../../uiComponents";
import {Formik} from "formik";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KeyboardView from "../../containers/KeyboardView";
import * as Yup from "yup";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";

function Amount(props) {
    const { t, i18n } = useTranslation();

    const {submit, loading, onClose, isOpen} = props;

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => onClose()}>
            <Formik
                onSubmit={(values) => submit(values)}
                initialValues={{}}
                validationSchema={Yup.object().shape({
                    amount: Yup.string().required("VALIDATION.AMOUNT_FIELD.REQUIRED")
                        .matches(RegExp('(.*\\d.*)'), 'VALIDATION.ONLY_DIGITS')
                })}>
                {({handleChange, values, handleSubmit, errors}) => {
                    return (
                        <KeyboardView contentContainerStyle={[ GlobalStyle.centerModalCenterViewContainerScroll ]}>
                            <View style={GlobalStyle.centerModalCenterViewContainer}>

                                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => onClose()}>
                                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                                </TouchableOpacity>

                                <CText style={GlobalStyle.centerModalCenterViewTitle}>{t('FIELDS_LABELS.ENTER_AMOUNT')}</CText>

                                <CInput
                                    // inputSubLabel={t('FIELDS_LABELS.BENEFICIARY_NAME')}
                                    placeholder={t('FIELDS_LABELS.ENTER_AMOUNT')}
                                    value={values.amount}
                                    // leftIconName={'profile'}
                                    onChangeText={handleChange('amount')}
                                    error={t(errors.amount)}
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                />

                                <CButton title={t('GLOBAL.SUBMIT')}
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

export default React.memo(Amount)
