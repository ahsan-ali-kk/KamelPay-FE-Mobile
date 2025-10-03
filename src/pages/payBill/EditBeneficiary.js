import React from "react";
import {TouchableOpacity, View} from "react-native";
import {CButton, CInput, CText, CModal} from "../../uiComponents";
import {Formik} from "formik";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KeyboardView from "../../containers/KeyboardView";
import * as Yup from "yup";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";


function EditBeneficiary(props) {
    const { t, i18n } = useTranslation();

    const {submit, loading, onClose, selected, isOpen} = props;

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => onClose()}>
            <Formik
                onSubmit={(values) => submit(selected, values)}
                initialValues={{
                    Alias: selected?.beneficiaryAlias
                }}
                validationSchema={Yup.object().shape({
                    Alias: Yup.string().required("VALIDATION.BENEFICIARY_NAME.REQUIRED")
                })}>
                {({handleChange, values, handleSubmit, errors}) => {
                    return (
                        <KeyboardView contentContainerStyle={GlobalStyle.centerModalCenterViewContainerScroll}>
                            <View style={GlobalStyle.centerModalCenterViewContainer}>

                                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => onClose()}>
                                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                                </TouchableOpacity>

                                <CText style={GlobalStyle.centerModalCenterViewTitle}>{t('SECTION_LABELS.EDIT_BENEFICIARY')}</CText>

                                <CInput
                                    // inputSubLabel={t('FIELDS_LABELS.BENEFICIARY_NAME')}
                                    placeholder={t('FIELDS_LABELS.BENEFICIARY_NAME_PLACEHOLDER')}
                                    value={values.Alias}
                                    leftIconName={'profile'}
                                    onChangeText={handleChange('Alias')}
                                    error={t(errors.Alias)}
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

export default React.memo(EditBeneficiary)
