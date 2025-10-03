import React, {useRef} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CText, Dropdown} from '../../../../uiComponents';
import Styles from '../../../auth/Auth.style';
import {ViewContainer} from "../../../../containers";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import {FormatNumberWithCommas} from "../../../../utils/methods";
import ASStyles from "../../AdvanceSalary.style";

function CForm(props) {

    const { t } = useTranslation();

    const {submit, loading, advanceSalaryDetails} = props;
    const { selectedCountry, currentCountry, toggleCountryModal, advanceApplied} = props;

    const form = useRef(null);
    const phone = useRef();
    const name = useRef();
    const phone2 = useRef();
    const name2 = useRef();

    const getEligibleAdvanceAmount = () => {
        if(advanceSalaryDetails?.eligibleAdvanceAmount){
            return Number(advanceSalaryDetails?.eligibleAdvanceAmount)
        } else {
            return 0
        }
    };

    const data = [
        {
            label: t('GLOBAL.RELATIVE'),
            value: 'Relative',
        },
        {
            label: t('GLOBAL.SPOUSE'),
            value: 'Spouse',
        },
        {
            label: t('GLOBAL.CO_WORKER'),
            value: 'Co-Worker',
        },
        {
            label: t('GLOBAL.FRIEND'),
            value: 'Friend',
        },
    ];

    const otherData = [
        {
            label: t('GLOBAL.ROOM_MATE'),
            value: 'Room Mate',
        },
    ];

    // const getFees = (feesBracket, amount) => {
    //     if(feesBracket?.length){
    //         return feesBracket.find((obj) => {
    //             if(amount >= obj?.fromAmount && amount <= obj?.toAmount) {
    //                 return obj
    //             }
    //         })
    //     }
    // };

    // const getValidation = () => {
    //     let feeBracket = getFees(advanceSalaryDetails?.feesBrackets, advanceSalaryDetails?.averagaSalary);
    //     let values = {
    //         max: getEligibleAdvanceAmount(),
    //         min: (feeBracket?.fees - feeBracket?.vat) * 2 || 0
    //     };
    //     return Validations(selectedCountry, currentCountry, values)
    // };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                // firstReferenceRelation: 'Relative',
                // firstReferencePhone: '3152812753',
                // firstReferenceFullName: 'Muhammad Wasif Khanzada',
                // localFriendRelation: 'Relative',
                // localFriendPhone: '505636092',
                // localFriendFullName: 'Muhammad Asif Khanzada',
            }}
            validationSchema={Validations(selectedCountry, currentCountry)}>
            {({handleChange, values, handleSubmit, errors, setFieldValue, setFieldTouched, submitCount, touched}) => {
                return (
                    <View style={{flex: 1}}>
                        <ViewContainer scrolled={true}
                                       contentContainerStyle={[Styles.scrollContainer, GlobalStyle.paddingHorizontal_0]}>

                            <View style={[Styles.formContainer, GlobalStyle.paddingHorizontal_30]}>

                                <View style={ASStyles.eligibleAmountContainer}>
                                    <CText style={ASStyles.eligibleAmountTitle}>
                                        {t('ADVANCE_SALARY.ADVANCE_AMOUNT')}
                                    </CText>
                                    <FormatNumberWithCommas
                                        value={advanceApplied}
                                        currency={'AED'}
                                        styleAmount={ASStyles.eligibleAmount}
                                        numberOfLines={1}
                                    />
                                </View>


                                <View style={Styles.separateSection}>
                                    <Dropdown
                                        dropdownProps={{
                                            options: data,
                                            label: `${t('VALIDATION.REFERENCE.TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`
                                        }}
                                        inputProps={{
                                            inputSubLabel: `${t('VALIDATION.REFERENCE.TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`,
                                            value: values.firstReferenceRelation,
                                        }}
                                        error={t(errors.firstReferenceRelation)}
                                        touched={touched.firstReferenceRelation}
                                        onBlur={() => setFieldTouched('firstReferenceRelation', true, true)}
                                        submitCount={submitCount}
                                        onChange={(val) => handleChange('firstReferenceRelation')(val?.value)}
                                    />
                                    <CInput
                                        ref={name}
                                        inputSubLabel={`${t('VALIDATION.REFERENCE_FULL_NAME.TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`}
                                        placeholder={''}
                                        value={values.firstReferenceFullName}
                                        onChangeText={handleChange('firstReferenceFullName')}
                                        error={t(errors.firstReferenceFullName)}
                                        onSubmitEditing={() => phone.current.focus()}
                                        returnKeyType="next"
                                    />
                                    <CInput
                                        ref={phone}
                                        type="number"
                                        selectedCountry={selectedCountry}
                                        onPress={() => toggleCountryModal(true)}
                                        keyboardType={'numeric'}
                                        inputSubLabel={`${t('VALIDATION.REFERENCE_PHONE.TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`}
                                        value={values.firstReferencePhone}
                                        onChangeText={(val) => {
                                            let phone = val;
                                            let reg = /^0+/gi;
                                            if (phone.match(reg)) {
                                                phone = phone.replace(reg, '');
                                            }
                                            handleChange('firstReferencePhone')(phone)
                                        }}
                                        error={t(errors.firstReferencePhone)}
                                        returnKeyType="next"
                                    />
                                </View>

                                <View style={Styles.separateSection}>
                                    <Dropdown
                                        dropdownProps={{
                                            options: [...otherData, ...data],
                                            label: `${t('VALIDATION.REFERENCE.TITLE')} (${t('GLOBAL.IN_UAE')})`
                                        }}
                                        inputProps={{
                                            inputSubLabel: `${t('VALIDATION.REFERENCE.TITLE')} (${t('GLOBAL.IN_UAE')})`,
                                            value: values.localFriendRelation,
                                        }}
                                        error={t(errors.localFriendRelation)}
                                        touched={touched.localFriendRelation}
                                        onBlur={() => setFieldTouched('localFriendRelation', true, true)}
                                        submitCount={submitCount}
                                        onChange={(val) => handleChange('localFriendRelation')(val?.value)}
                                    />
                                    <CInput
                                        ref={name2}
                                        inputSubLabel={`${t('VALIDATION.REFERENCE_FULL_NAME.TITLE')} (${t('GLOBAL.IN_UAE')})`}
                                        placeholder={''}
                                        value={values.localFriendFullName}
                                        onChangeText={handleChange('localFriendFullName')}
                                        error={t(errors.localFriendFullName)}
                                        returnKeyType="next"
                                        onSubmitEditing={() => phone2.current.focus()}
                                    />
                                    <CInput
                                        ref={phone2}
                                        type="number"
                                        selectedCountry={currentCountry}
                                        disabled={true}
                                        onPress={() => null}
                                        keyboardType={'numeric'}
                                        inputSubLabel={`${t('VALIDATION.REFERENCE_PHONE.TITLE')} (${t('GLOBAL.IN_UAE')})`}
                                        value={values.localFriendPhone}
                                        onChangeText={(val) => {
                                            let phone = val;
                                            let reg = /^0+/gi;
                                            if (phone.match(reg)) {
                                                phone = phone.replace(reg, '');
                                            }
                                            handleChange('localFriendPhone')(phone)
                                        }}
                                        error={t(errors.localFriendPhone)}
                                        onSubmitEditing={() => handleSubmit()}
                                        returnKeyType="next"
                                    />
                                </View>

                            </View>

                        </ViewContainer>

                        <View style={{paddingHorizontal: 25}}>
                            <CButton title={t('GLOBAL.NEXT')}
                                     loading={loading}
                                     onPress={() => handleSubmit()}/>
                        </View>

                    </View>
                );
            }}
        </Formik>
    );
}
export default CForm;
