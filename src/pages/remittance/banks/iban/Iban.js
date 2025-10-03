import React, {useRef, useState} from "react";
import {View} from "react-native";
import {Container, ViewContainer} from "../../../../containers";
import {CButton, CInput, CText} from "../../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Styles from "../../../auth/Auth.style";
import Validations from "./Validations";
import {Formik} from "formik";
import {getBankOrBranchWithIban} from "../../../../store/actions/Remittance.action";
import Preview from "../preview/Preview";

function Iban(props) {

    const {t} = useTranslation();
    const form = useRef(null);

    const {route: {params: data}, navigation} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.BANKS'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            apiLoading: remittance.getBankAndBranchLoading,
            bankAndBranch: remittance.bankAndBranch,
        }
    });

    const {apiLoading, bankAndBranch} = reduxState;

    const [isOpen, updateIsOpen] = useState(false);

    const get = (val) => {
        let payload = {
            Country: data?.country.Name || data?.country.name,
            BankType: data?.type?.Value,
            IBAN: val?.toUpperCase()
        };
        dispatch(getBankOrBranchWithIban(payload, callback));
    };

    const callback = (res) => {
        if(res?.error){
            form?.current?.setFieldError('IBAN', res?.data?.message)
        } else {
            form?.current?.setFieldError('IBAN', '');
            togglePreview(true)
        }
    };

    const changeBank = () => {
        updateIsOpen(false)
    };

    const togglePreview = (value = false) => {
        updateIsOpen(value);
    };

    const confirm = () => {
        let obj = {
            ...data,
            bank: bankAndBranch,
            IBAN: form?.current?.values?.IBAN?.toUpperCase()
        };
        togglePreview();
        setTimeout(() => {
            // if(data?.pageType === 'ADD_NEW_BENEFICIARY') {
                navigation.replace('send_money_beneficiary_details', obj)
            // } else {
            //     navigation.replace('send_money_exchange_rate', obj)
            // }

        }, 100)
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>
                        {t('PAGE_TITLE.PLEASE_ENTER_YOUR_IBAN')}
                    </CText>
                </View>

                <Formik
                    innerRef={form}
                    onSubmit={(values) => get(values?.IBAN)}
                    initialValues={{
                        IBAN: ''
                    }}
                    validationSchema={Validations}
                >
                    {({handleChange, values, handleSubmit, errors, touched}) => {
                        return (
                            <View style={Styles.formContainer}>
                                <View style={Styles.formInnerContainer}>

                                    <CInput
                                        inputSubLabel={t('FIELDS_LABELS.IBAN')}
                                        placeholder={''}
                                        keyboardType={'default'}
                                        value={values.IBAN}
                                        autoCapitalize="characters"
                                        onChangeText={handleChange('IBAN')}
                                        error={touched.IBAN && t(errors.IBAN)}
                                        onSubmitEditing={() => handleSubmit()}
                                    />

                                </View>

                                <CButton title={'Search Bank'}
                                         type="without_outline"
                                         disabled={apiLoading}
                                         onPress={() => navigation.goBack()}/>

                                <CButton title={t('GLOBAL.NEXT')}
                                         loading={apiLoading}
                                         onPress={() => handleSubmit()}/>

                            </View>
                        );
                    }}
                </Formik>
            </ViewContainer>
            <Preview
                value={isOpen}
                data={{
                    ...data,
                    bank: bankAndBranch
                }}
                onChange={() => changeBank()}
                onConfirm={() => confirm()}
                onClose={() => changeBank()}
            />
        </Container>
    )

}

export default React.memo(Iban)
