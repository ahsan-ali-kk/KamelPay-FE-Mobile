import React, {Fragment, useRef} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CText, CToggleSwitch} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {ViewContainer} from "../../../containers";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";

function TenuresSelection(props) {

    const { t } = useTranslation();
    const {submit, currentCountry, loading} = props;

    const form = useRef(null);

    const liabilityAmount = useRef();
    const educationExpense = useRef();
    const healthcareExpense = useRef();
    const maintenanceSupport = useRef();
    const housingRent = useRef();
    const foodExpense = useRef();
    const utilityCost = useRef();

    const generateValidation = () => {
        return Validations()
    };

    const renderFooter = (handleSubmit) => {
        return(
            <Fragment>
                <View style={GlobalStyle.listFooterButton}>
                    <CButton title={t('GLOBAL.NEXT')}
                             loading={loading}
                             onPress={() => handleSubmit()}/>
                </View>
            </Fragment>
        )
    };


    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                anyMonthlyLiability: false,
                // anyMonthlyLiability: true,
                // liability: "500",
                // educationExpense: "10",
                // healthcareExpense: "10",
                // maintenanceSupport: "10",
                // housingRent: "10",
                // foodExpense: "10",
                // utilityCost: "10",
            }}
            validationSchema={generateValidation()}>

            {({handleChange, values, handleSubmit, setFieldTouched, submitCount, errors, setFieldValue}) => {
                return (
                    <ViewContainer scrolled={true}
                                   contentContainerStyle={[Styles.scrollContainer, GlobalStyle.paddingHorizontal_0]}
                                   renderFooter={() => renderFooter(handleSubmit)}>

                        <View style={[Styles.formContainer, GlobalStyle.paddingHorizontal_30]}>

                            <View style={Styles.formInnerContainer}>

                                <View style={[GlobalStyle.toggleView, {marginTop: 20}]}>
                                    <CText style={[GlobalStyle.toggleViewText, {marginRight: 25}]}>
                                        {/* {t('VALIDATION.MONTHLY_LIABILITIES.LABEL')} */}
                                        Do you have any other monthly finance installment / liability
                                    </CText>
                                    <CToggleSwitch style={{}} onToggle={() => {
                                        if(values?.anyMonthlyLiability){
                                            setFieldValue('liability', 0)
                                        }
                                        setFieldValue('anyMonthlyLiability', !values?.anyMonthlyLiability)
                                    }} isOn={values?.anyMonthlyLiability} />
                                </View>

                                <CInput
                                    isShow={!!(values?.anyMonthlyLiability)}
                                    ref={liabilityAmount}
                                    keyboardType={'numeric'}
                                    inputSubLabel={t('VALIDATION.MONTHLY_LIABILITIES.SUB_LABEL')}
                                    placeholder={'0.00'}
                                    selectedCountry={currentCountry}
                                    showCountryCurrency={true}
                                    value={values.liability}
                                    onChangeText={handleChange('liability')}
                                    error={t(errors.liability)}
                                    onSubmitEditing={() => educationExpense?.current.focus()}
                                    returnKeyType="next"
                                />

                                <CInput
                                    ref={educationExpense}
                                    keyboardType={'numeric'}
                                    inputSubLabel={t("VALIDATION.EDUCATION_EXPENSE.LABEL")}
                                    placeholder={''}
                                    value={values?.educationExpense}
                                    onChangeText={handleChange('educationExpense')}
                                    onSubmitEditing={() => healthcareExpense?.current.focus()}
                                    {...(submitCount && {error: submitCount ? t(errors?.educationExpense) : setFieldTouched('educationExpense', true, true) && t(errors?.educationExpense)})}
                                    returnKeyType="next"
                                />

                                <CInput
                                    ref={healthcareExpense}
                                    keyboardType={'numeric'}
                                    inputSubLabel={t("VALIDATION.HEALTH_CARE_EXPENSE.LABEL")}
                                    placeholder={''}
                                    value={values?.healthcareExpense}
                                    onChangeText={handleChange('healthcareExpense')}
                                    onSubmitEditing={() => maintenanceSupport?.current.focus()}
                                    {...(submitCount && {error: submitCount ? t(errors?.healthcareExpense) : setFieldTouched('healthcareExpense', true, true) && t(errors?.healthcareExpense)})}
                                    returnKeyType="next"
                                />

                                <CInput
                                    ref={maintenanceSupport}
                                    keyboardType={'numeric'}
                                    inputSubLabel={t("VALIDATION.MAINTENANCE_SUPPORT.LABEL")}
                                    placeholder={''}
                                    value={values?.maintenanceSupport}
                                    onChangeText={handleChange('maintenanceSupport')}
                                    onSubmitEditing={() => housingRent?.current.focus()}
                                    {...(submitCount && {error: submitCount ? t(errors?.maintenanceSupport) : setFieldTouched('maintenanceSupport', true, true) && t(errors?.maintenanceSupport)})}
                                    returnKeyType="next"
                                />

                                <CInput
                                    ref={housingRent}
                                    keyboardType={'numeric'}
                                    inputSubLabel={t("VALIDATION.HOUSING_RENT.LABEL")}
                                    placeholder={''}
                                    value={values?.housingRent}
                                    onChangeText={handleChange('housingRent')}
                                    onSubmitEditing={() => foodExpense?.current.focus()}
                                    {...(submitCount && {error: submitCount ? t(errors?.housingRent) : setFieldTouched('housingRent', true, true) && t(errors?.housingRent)})}
                                    returnKeyType="next"
                                />

                                <CInput
                                    ref={foodExpense}
                                    keyboardType={'numeric'}
                                    inputSubLabel={t("VALIDATION.FOOD_EXPENSE.LABEL")}
                                    placeholder={''}
                                    value={values?.foodExpense}
                                    onChangeText={handleChange('foodExpense')}
                                    onSubmitEditing={() => utilityCost?.current.focus()}
                                    {...(submitCount && {error: submitCount ? t(errors?.foodExpense) : setFieldTouched('foodExpense', true, true) && t(errors?.foodExpense)})}
                                    returnKeyType="next"
                                />

                                <CInput
                                    ref={utilityCost}
                                    keyboardType={'numeric'}
                                    inputSubLabel={t("VALIDATION.UTILITY_COST.LABEL")}
                                    placeholder={''}
                                    value={values?.utilityCost}
                                    onChangeText={handleChange('utilityCost')}
                                    onSubmitEditing={() => handleSubmit()}
                                    {...(submitCount && {error: submitCount ? t(errors?.utilityCost) : setFieldTouched('utilityCost', true, true) && t(errors?.utilityCost)})}
                                    returnKeyType="next"
                                />

                            </View>

                        </View>

                    </ViewContainer>
                );
            }}
        </Formik>
    );
}
export default TenuresSelection;
