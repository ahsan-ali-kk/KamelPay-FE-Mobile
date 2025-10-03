import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CText, Dropdown} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {References, ViewContainer} from "../../../containers";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";

function CForm(props) {

    const { t } = useTranslation();

    const homeReferencesRef = useRef(null);
    const localReferencesRef = useRef(null);

    const {submit, selectedCountry, currentCountry, currentUserNumber, bnplDetails} = props;

    const form = useRef(null);
    const phone = useRef();
    const name = useRef();
    const phone2 = useRef();
    const name2 = useRef();
    const [filterReferences, setFilterReferences] = useState(null);

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
        if(bnplDetails && bnplDetails?.previousBnpls) {
            let data = bnplDetails?.previousBnpls?.length ? getPreviousReferences(bnplDetails?.previousBnpls || []) : [];
            setFilterReferences(data);
        }
    }, [bnplDetails]);

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

    const generateValidation = () => {
        return Validations({currentUserNumber, selectedCountry, currentCountry})
    };

    const renderFooter = (handleSubmit) => {
        return(
            <Fragment>
                <View style={[GlobalStyle.listFooterButton, {marginBottom: 40}]}>
                    <CButton title={t('GLOBAL.NEXT')} onPress={() => handleSubmit()}/>
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
                firstReferenceRelation: '',
                firstReferencePhone: '',
                firstReferenceFullName: '',
                localFriendRelation: '',
                localFriendPhone: '',
                localFriendFullName: '',
            }}
            validationSchema={generateValidation()}>

            {({handleChange, values, handleSubmit, setFieldTouched, touched, submitCount, errors}) => {
                return (
                    <ViewContainer scrolled={true}
                                   contentContainerStyle={[Styles.scrollContainer, GlobalStyle.paddingHorizontal_0]}
                                   renderFooter={() => renderFooter(handleSubmit)}>

                        <View style={[Styles.formContainer, GlobalStyle.paddingHorizontal_30]}>

                            <View style={Styles.formInnerContainer}>

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
                                        onPress={() => null}
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

                            </View>

                        </View>

                    </ViewContainer>
                );
            }}
        </Formik>
    );
}
export default CForm;
