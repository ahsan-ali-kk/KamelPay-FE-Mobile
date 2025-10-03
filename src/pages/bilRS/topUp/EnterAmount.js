import React, {forwardRef, useImperativeHandle, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {CText, CModal, CInput, CButton} from "../../../uiComponents";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import KeyboardView from "../../../containers/KeyboardView";
import {Formik} from "formik";

const EnterAmount = forwardRef((props, ref) => {

    const { t } = useTranslation();

    const {onChange} = props;

    const [isOpen, updateIsOpen] = useState(false);
    const [validation, updateValidation] = useState(null);
    const [selectedData, updateSelectedData] = useState(null);

    const createYup = (obj) => {
        let val = Yup.number().required(t('VALIDATION.SKU_AMOUNT.REQUIRED'));

        val = val.min((obj.MinAmount || 1), `${t('VALIDATION.SKU_AMOUNT.MIN')} ${obj?.MinAmount || 1}.`)

        if(obj.MaxAmount) {
            val = val.max(Number(obj?.MaxAmount), `${t('VALIDATION.SKU_AMOUNT.MAX')} ${obj?.MaxAmount}`)
        }
        return val;
    };


    useImperativeHandle(ref, () => ({
        toggleModal(val = false, obj = null) {
            updateIsOpen(val);
            updateSelectedData(obj);
            updateValidation(
                Yup.object().shape({
                    Amount: createYup(obj)
                })
            );
        },
    }));


    const modalClose = (value = false) => {
        updateIsOpen(value);
        updateValidation(null);
        updateSelectedData(null);
    };

    const submit = (values) => {
        onChange(values, selectedData)
        modalClose();
    }

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => modalClose()}>
            <Formik
                onSubmit={(values) => submit(values)}
                initialValues={{}}
                validationSchema={validation && Object.keys(validation).length ? validation : null}>
                {({handleChange, values, handleSubmit, errors}) => {
                    return (
                        <KeyboardView contentContainerStyle={[GlobalStyle.centerModalCenterViewContainerScroll]}>
                            <View style={GlobalStyle.centerModalCenterViewContainer}>

                                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton}
                                                  onPress={() => modalClose()}>
                                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                                </TouchableOpacity>

                                <CText style={GlobalStyle.centerModalCenterViewTitle}>
                                    {t('FIELDS_LABELS.ENTER_AMOUNT')}
                                </CText>

                                <CInput
                                    {...selectedData?.ReceivingCurrency ? {
                                        prefixView: () => (
                                            <View style={[GlobalStyle.countryView, (errors?.Amount && GlobalStyle.errorBorder)]}>
                                                <CText style={[GlobalStyle.countryViewText, {marginLeft: 0}]}>{selectedData?.ReceivingCurrency}</CText>
                                            </View>
                                        )
                                    } : {}}
                                    // inputLabel={t('FIELDS_LABELS.ENTER_AMOUNT')}
                                    placeholder={t('FIELDS_LABELS.ENTER_AMOUNT_PLACEHOLDER')}
                                    keyboardType="numeric"
                                    value={values.Amount}
                                    onChangeText={(val) => handleChange('Amount')(val)}
                                    error={errors?.Amount}
                                    returnKeyType="next"
                                    onSubmitEditing={() => handleSubmit()}
                                />

                                <CButton title={t("GLOBAL.NEXT")}
                                         loading={false}
                                         onPress={() => handleSubmit()}/>

                            </View>
                        </KeyboardView>
                    )
                }}
            </Formik>

        </CModal>
    )
});

export default EnterAmount;
