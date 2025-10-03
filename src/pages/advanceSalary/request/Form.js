import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CText, Dropdown, RangeSlider} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import ASStyles from '../AdvanceSalary.style';
import {ReferralCode, ViewContainer, References} from "../../../containers";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import {
    formatAmount,
    FormatNumberWithCommas,
    getEligibleAdvanceAmount,
    getValidation,
    SERVICES
} from "../../../utils/methods";
import {useNavigation} from "@react-navigation/native";

function CForm(props) {

    const { t } = useTranslation();
    const navigation = useNavigation();

    const homeReferencesRef = useRef(null);
    const localReferencesRef = useRef(null);
    const [filterReferences, setFilterReferences] = useState(null);

    const {currentUserNumber, submit,  selectedCountry, currentCountry, advanceSalaryDetails, params, toggleCountryModal} = props;

    const form = useRef(null);
    const phone = useRef();
    const name = useRef();
    const phone2 = useRef();
    const name2 = useRef();
    const advance = useRef();

    const trimNumber = (number, prefix) => {
        let updatedNumber = number.replace(/\s+/g, '');
        // Ensure both `number` and `prefix` are valid strings
        if (typeof updatedNumber !== 'string' || typeof prefix !== 'string') return number;

        // Normalize the number by removing spaces and any non-numeric characters except the plus sign
        let normalizedNumber = updatedNumber.replace(/[^\d+]/g, '');
        let normalizedPrefix = prefix.replace('+', '');

        // Check if the normalized phone number starts with the country prefix and remove it
        return normalizedNumber.startsWith(normalizedPrefix)
            ? normalizedNumber.substring(normalizedPrefix.length)
            : normalizedNumber;
    };

    const getPreviousReferences = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            console.log('No valid data provided.');
            return { local: [], first: [] };
        }

        // Helper function to filter keys based on prefix
        const filterByPrefix = (item, prefix) => {
            return Object.keys(item).reduce((acc, key) => {
                if (key.startsWith(prefix)) acc[key] = item[key];
                return acc;
            }, {});
        };

        // Generate filtered data for `local` and `first`
        const local = data.map(item => filterByPrefix(item, "local"));
        const home = data.map(item => filterByPrefix(item, "first"));

        return { local, home };
    };

    useEffect(() => {
        if(params?.module !== 'SNPL' && advanceSalaryDetails && advanceSalaryDetails?.previousAdvanceSalaries) {

            let data = advanceSalaryDetails?.previousAdvanceSalaries?.length ? getPreviousReferences(advanceSalaryDetails?.previousAdvanceSalaries || []) : [];
            setFilterReferences(data);

        }
    }, [advanceSalaryDetails]);


    const updateReferences = (obj) => {
        if(obj){

            if(obj?.firstReferenceFullName){
                form?.current?.setFieldValue('firstReferenceFullName', obj?.firstReferenceFullName || '');
            }
            if(obj?.firstReferenceRelation) {
                form?.current?.setFieldValue('firstReferenceRelation', obj?.firstReferenceRelation || '');
            }
            if(obj?.firstReferencePhone){
                let firstReferencePhone = obj?.firstReferencePhone?.replace(/[^\d+]/g, '') || '';
                let firstReferencePhonePrefix = selectedCountry?.detail?.code?.replace(/[^\d+]/g, '') || '';
                let modifiedFirstReferencePhone = firstReferencePhone ? trimNumber(firstReferencePhone, firstReferencePhonePrefix) : '';
                form?.current?.setFieldValue('firstReferencePhone', modifiedFirstReferencePhone || '');
            }

            if(obj?.localFriendFullName){
                form?.current?.setFieldValue('localFriendFullName', obj?.localFriendFullName || '');
            }
            if(obj?.localFriendFullName){
                form?.current?.setFieldValue('localFriendRelation', obj?.localFriendRelation || '');
            }
            if(obj?.localFriendPhone){
                let localFriendPhone = obj?.localFriendPhone?.replace(/[^\d+]/g, '') || '';
                let localFriendPhonePrefix = currentCountry?.detail?.code?.replace(/[^\d+]/g, '') || '';
                let modifiedLocalFriendPhone = localFriendPhone ? trimNumber(localFriendPhone, localFriendPhonePrefix) : '';
                form?.current?.setFieldValue('localFriendPhone', modifiedLocalFriendPhone || '');
            }

        }
    };

    useEffect(() => {

        if(params?.module !== 'SNPL' && advanceSalaryDetails) {
            let minAmount = getValidation(advanceSalaryDetails, t)?.max || 0;
            setTimeout(() => {
                form?.current?.setFieldValue('advance', Number(minAmount) ? Number(minAmount) : '');
            })
        }

    }, [advanceSalaryDetails]);

    const data = [
        {
            label: t('GLOBAL.HUSBAND_WIFE'),
            value: 'Husband/wife',
        },
        {
            label: t('GLOBAL.FATHER_MOTHER'),
            value: 'Father/Mother',
        },
        {
            label: t('GLOBAL.BROTHER'),
            value: 'Brother',
        },
        {
            label: t('GLOBAL.FRIEND'),
            value: 'Friend',
        },

    ];

    const otherData = [
        {
            label: t('GLOBAL.RELATIVE'),
            value: 'Relative',
        },
        {
            label: t('GLOBAL.ROOM_MATE'),
            value: 'Room Mate',
        },
        {
            label: t('GLOBAL.FRIEND'),
            value: 'Friend',
        },
        {
            label: t('GLOBAL.CO_WORKER'),
            value: 'Co-Worker',
        },
        {
            label: t('GLOBAL.HUSBAND_WIFE'),
            value: 'Husband/wife',
        },
    ];

    const generateValidation = () => {
        return Validations({currentUserNumber, advance: getValidation(advanceSalaryDetails, t), selectedCountry, currentCountry})
    };

    const renderFooter = (handleSubmit) => {
        return(
            <Fragment>
                <View style={GlobalStyle.listFooterButton}>
                    <CButton title={t('GLOBAL.NEXT')} onPress={() => handleSubmit()}/>
                    {params?.module === 'SNPL' ? null : <CButton title={t('GLOBAL.HISTORY')}
                                                                 type={'without_outline'}
                                                                 onPress={() => navigation.navigate('advance_salary_history')}/>}
                </View>
                <References
                    title={"Previous References"}
                    subTitle={"Tap to select previous reference"}
                    ref={homeReferencesRef}
                    onChange={(obj = null) => updateReferences(obj)}
                    data={filterReferences?.home}
                />
                <References
                    title={"Previous References"}
                    subTitle={"Tap to select previous reference"}
                    ref={localReferencesRef}
                    onChange={(obj = null) => updateReferences(obj)}
                    data={filterReferences?.local}
                />
            </Fragment>
        )
    };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                ...(params?.module === 'SNPL' ? {
                    advance: params?.advance,
                    type: "ADVANCE_REMITTANCE",
                    beneficiaryId: params?.beneficiaryId,
                } : {
                    type: "ADVANCE_SALARY"
                }),
                // firstReferenceRelation: 'Relative',
                // firstReferencePhone: '3152812753',
                // firstReferenceFullName: 'Muhammad Wasif Khanzada',
                // localFriendRelation: 'Relative',
                // localFriendPhone: '505636092',
                // localFriendFullName: 'Muhammad Asif Khanzada',
            }}
            validationSchema={generateValidation()}>

            {({handleChange, values, handleSubmit, setFieldTouched, touched, submitCount, errors, setFieldValue}) => {
                return (
                    <ViewContainer scrolled={true}
                                   contentContainerStyle={[Styles.scrollContainer, GlobalStyle.paddingHorizontal_0]}
                                   renderFooter={() => renderFooter(handleSubmit)}>

                        <View style={[Styles.formContainer, GlobalStyle.paddingHorizontal_30]}>

                            <View style={Styles.formInnerContainer}>

                                <View style={ASStyles.eligibleAmountContainer}>
                                    <CText style={ASStyles.eligibleAmountTitle}>
                                        {params?.module === 'SNPL' ?  t('ADVANCE_SALARY.ADVANCE_AMOUNT') : t('ADVANCE_SALARY.ELIGIBLE_ADVANCE_AMOUNT')}
                                    </CText>
                                    <FormatNumberWithCommas
                                        value={params?.module === 'SNPL' ? params.advance : getEligibleAdvanceAmount(advanceSalaryDetails)}
                                        currency={'AED'}
                                        styleAmount={ASStyles.eligibleAmount}
                                        numberOfLines={1}
                                    />
                                </View>

                                {params?.module !== 'SNPL' ?  <Fragment>
                                    <View style={Styles.separateSection}>
                                        <RangeSlider
                                            subLabel={t('ADVANCE_SALARY.HOW_MUCH_TAKE_ADVANCE')}
                                            subLabelRight={formatAmount(Number(values.advance), 'AED')}
                                            inputLabelStyle={Styles.inputLabel}
                                            value={Number(values.advance)}
                                            error={t(errors.advance)}
                                            minimumValue={getValidation(advanceSalaryDetails, t)?.min || 0}
                                            maximumValue={getValidation(advanceSalaryDetails, t)?.max || 0}
                                            // disabled={advance}
                                            tapToSeek={true}
                                            step={advanceSalaryDetails?.stepper || 1}
                                            onSlidingComplete={(val) => setFieldValue('advance', val)}
                                        />
                                        <CInput
                                            ref={advance}
                                            placeholder={'0.00'}
                                            selectedCountry={currentCountry}
                                            showCountryCurrency={true}
                                            value={values.advance?.toString()}
                                            onChangeText={val => handleChange('advance')(val)}
                                            keyboardType="numeric"
                                            returnKeyType="next"
                                        />
                                    </View>
                                </Fragment> : null}

                                <View style={Styles.separateSection}>
                                    <View style={Styles.separateSectionHeader}>
                                        <CText style={[Styles.title, Styles.separateSectionHeaderTitle]}>
                                            Home Reference
                                        </CText>
                                        {filterReferences?.home?.length ? <CButton
                                            buttonStyle={Styles.separateSectionHeaderButton}
                                            buttonText={Styles.separateSectionHeaderButtonText}
                                            iconStyle={Styles.separateSectionHeaderButtonIcon}
                                            title={"Select"}
                                            iconName={"refresh"}
                                            type={'outline'}
                                            onPress={() => homeReferencesRef.current?.open()}
                                        /> : null }
                                    </View>
                                    <Dropdown
                                        dropdownProps={{
                                            options: data,
                                            label: `${t('VALIDATION.CONTACT.SECOND_TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`
                                        }}
                                        inputProps={{
                                            inputSubLabel: `${t('VALIDATION.CONTACT.SECOND_TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`,
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
                                        inputSubLabel={`${t('VALIDATION.CONTACT_FULL_NAME.SECOND_TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`}
                                        placeholder={''}
                                        value={values.firstReferenceFullName}
                                        onChangeText={handleChange('firstReferenceFullName')}
                                        onSubmitEditing={() => phone.current.focus()}
                                        {...(submitCount && {error: submitCount ? t(errors.firstReferenceFullName) : setFieldTouched('firstReferenceFullName', true, true) && t(errors.firstReferenceFullName)})}
                                        returnKeyType="next"
                                    />
                                    <CInput
                                        ref={phone}
                                        type="number"
                                        selectedCountry={selectedCountry}
                                        disabled={true}
                                        onPress={() => toggleCountryModal(true)}
                                        keyboardType={'numeric'}
                                        inputSubLabel={`${t('VALIDATION.CONTACT_PHONE.SECOND_TITLE')} (${t('GLOBAL.IN_HOME_COUNTRY')})`}
                                        value={values.firstReferencePhone}
                                        onChangeText={(val) => {
                                            let phone = val;
                                            let reg = /^0+/gi;
                                            if (phone.match(reg)) {
                                                phone = phone.replace(reg, '');
                                            }
                                            handleChange('firstReferencePhone')(phone)
                                        }}
                                        returnKeyType="next"
                                        {...(submitCount && {error: submitCount ? t(errors.firstReferencePhone) : setFieldTouched('firstReferencePhone', true, true) && t(errors.firstReferencePhone)})}

                                    />
                                </View>

                                <View style={Styles.separateSection}>
                                    <View style={Styles.separateSectionHeader}>
                                        <CText style={[Styles.title, Styles.separateSectionHeaderTitle]}>
                                            Local Reference
                                        </CText>
                                        {filterReferences?.home?.length ? <CButton
                                            buttonStyle={Styles.separateSectionHeaderButton}
                                            buttonText={Styles.separateSectionHeaderButtonText}
                                            iconStyle={Styles.separateSectionHeaderButtonIcon}
                                            title={"Select"}
                                            iconName={"refresh"}
                                            type={'outline'}
                                            onPress={() => localReferencesRef.current?.open()}
                                        /> : null}
                                    </View>
                                    <Dropdown
                                        dropdownProps={{
                                            options: otherData,
                                            label: `${t('VALIDATION.CONTACT.SECOND_TITLE')} (${t('GLOBAL.IN_UAE')})`
                                        }}
                                        inputProps={{
                                            inputSubLabel: `${t('VALIDATION.CONTACT.SECOND_TITLE')} (${t('GLOBAL.IN_UAE')})`,
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
                                        inputSubLabel={`${t('VALIDATION.CONTACT_FULL_NAME.SECOND_TITLE')} (${t('GLOBAL.IN_UAE')})`}
                                        placeholder={''}
                                        value={values.localFriendFullName}
                                        onChangeText={handleChange('localFriendFullName')}
                                        returnKeyType="next"
                                        onSubmitEditing={() => phone2.current.focus()}
                                        {...(submitCount && {error: submitCount ? t(errors.localFriendFullName) : setFieldTouched('localFriendFullName', true, true) && t(errors.localFriendFullName)})}
                                    />
                                    <CInput
                                        ref={phone2}
                                        type="number"
                                        selectedCountry={currentCountry}
                                        disabled={true}
                                        onPress={() => null}
                                        keyboardType={'numeric'}
                                        inputSubLabel={`${t('VALIDATION.CONTACT_PHONE.SECOND_TITLE')} (${t('GLOBAL.IN_UAE')})`}
                                        value={values.localFriendPhone}
                                        onChangeText={(val) => {
                                            let phone = val;
                                            let reg = /^0+/gi;
                                            if (phone.match(reg)) {
                                                phone = phone.replace(reg, '');
                                            }
                                            handleChange('localFriendPhone')(phone)
                                        }}
                                        {...(submitCount && {error: submitCount ? t(errors.localFriendPhone) : setFieldTouched('localFriendPhone', true, true) && t(errors.localFriendPhone)})}
                                        onSubmitEditing={() => handleSubmit()}
                                        returnKeyType="next"
                                    />
                                </View>

                                <ReferralCode
                                    service={SERVICES.ADVANCE_SALARY._id}
                                />

                            </View>

                        </View>

                    </ViewContainer>
                );
            }}
        </Formik>
    );
}
export default CForm;
