import React, {useRef, useState, Fragment} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CModal, CLoading, CText, CToggleSwitch} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {CountriesModal, ViewContainer} from "../../../containers";
import {capitalizeFirstLetter} from "../../../utils/methods";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import RemittanceStyle from "../Remittance.style";
import {useTranslation} from "react-i18next";
import {wallets, phWallets} from "../Remittance";

export const BANK_TYPES = {
    BANK_ACCOUNT: "BankAccount",
    UPI: "UPI",
}

export const showNumberInBank = (type, country) => {
    let countries = ['IN'];
    return type === BANK_TYPES.BANK_ACCOUNT && (countries?.includes(country?.CCA2) || countries?.includes(country?.cca2))
};

function CForm(props) {

    const { t, i18n } = useTranslation();

    const {submit, loading, selectedCountry, toggleCountryModal, data, addNewBeneficiary, onChangeAddNewBeneficiary} = props;

    const form = useRef(null);
    const firstName = useRef(null);
    const lastName = useRef(null);
    const phone = useRef(null);
    const beneficiaryAccountNo = useRef(null);

    const [nationalityModalIsOpen, updateNationalityModalIsOpen] = useState(false);

    const prevCountry = () => {

        let countryName = data?.country?.Name || data?.country?.name;
        let countryFlag = data?.country?.FlagPng || data?.country?.flagPng;
        let countryCca3 = data?.country?.CCA3 || data?.country?.cca3;

        return data?.country ? {
            name: { common: capitalizeFirstLetter(countryName) },
            flags: { png: countryFlag },
            cca3: countryCca3,
            ...data?.country
        } : {}

    };

    const toggleNationalityModal = () => {
        updateNationalityModalIsOpen(!nationalityModalIsOpen)
    };

    const nationalityOnSelect = (item) => {
        form && form.current.setFieldValue('BeneficiaryNationalityCountryISOCode', item);
        toggleNationalityModal();
    };

    const getFullName = (obj = {}) => {
        let firstName = obj?.BeneficiaryFirstName || form?.current?.values?.BeneficiaryFirstName;
        let lastName = obj?.BeneficiaryLastName || form?.current?.values?.BeneficiaryLastName;
        return `${firstName} ${lastName}`;
    };

    const toggleAddBeneficiary = () => {
        let currentValue = form?.current?.values?.AddBeneficiary;
        form.current.setFieldValue('AddBeneficiary', !currentValue);
        form.current.setFieldValue('Alias', !currentValue ? getFullName() : '')
        onChangeAddNewBeneficiary(!currentValue)
    };

    const setBeneficiaryName = () => {
        let currentValue = form?.current?.values?.AddBeneficiary;
        form.current.setFieldValue('Alias', currentValue ? getFullName() : '');
    };

    const setAccountTitle = () => {
        if(data?.type?.Value === BANK_TYPES.BANK_ACCOUNT || data?.type?.Value === BANK_TYPES.UPI) {
            form.current.setFieldValue('AccountTitle', getFullName());
        }
        setBeneficiaryName();
    };

    const setAccountNumber = () => {
        if(data?.type?.Value === BANK_TYPES.BANK_ACCOUNT) {
            let currentValue = form?.current?.values?.BeneficiaryMSISDN;
            if(wallets.includes(data?.bank?.BankName) || phWallets.includes(data?.bank?.BankName)){
                form.current.setFieldValue('BeneficiaryAccountNo', `0${currentValue}`);
            }
        }
        setBeneficiaryName();
    };
    console.log('checkWallet', data?.type?.Value);

    const checkWallet = () => {
        const {country} = data;
        if((country?.CCA2 === "PH" || country?.cca2 === "PH") && phWallets.includes(data?.bank?.BankName)){
            return {
                value: '',
                placeholder: '09XXXXXXXXX',
                keyboardType: "numeric"
            }
        } else if(wallets.includes(data?.bank?.BankName)) {
            return {
                value: '',
                placeholder: '03XXXXXXXXX',
                keyboardType: "numeric"
            }
        } else {
            return {
                value: data?.IBAN || '',
                placeholder: '',
                keyboardType: "default"
            }
        }
    };

    const onSubmit = (obj) => {
        setAccountTitle(obj);
        let values = form?.current?.values;
        if(data?.type?.Value === BANK_TYPES.BANK_ACCOUNT){
            values.BeneficiaryAccountNo = values.BeneficiaryAccountNo.toUpperCase();
        }
        submit(values)
    };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => onSubmit(values)}
            initialValues={{
                BeneficiaryFirstName: '',
                BeneficiaryLastName: '',
                ...(data?.type?.Value === BANK_TYPES.BANK_ACCOUNT ? {
                    AccountTitle: '',
                    BeneficiaryAccountNo: checkWallet().value,
                } : data?.type?.Value === BANK_TYPES.UPI ? {
                    AccountTitle: '',
                    BeneficiaryAccountNo: '',
                } : {
                    BeneficiaryMSISDN: '',
                }),
                BeneficiaryNationalityCountryISOCode: prevCountry(),
                RemitPurpose: 'Family Support',
                AddBeneficiary: !addNewBeneficiary ? addNewBeneficiary || true : addNewBeneficiary
            }}
            validationSchema={Validations(data?.type?.Value, selectedCountry, data?.country)}>
            {({handleChange, values, handleSubmit, errors, setFieldValue, touched}) => {
                return (
                    <View style={{flex: 1}}>
                        {data?.pageType !== 'ADD_NEW_BENEFICIARY' ? <View style={[GlobalStyle.toggleView, RemittanceStyle.addBeneficiaryView]}>
                            <CText style={GlobalStyle.toggleViewText}>
                               {t('GLOBAL.ADD_RECEIVER_ACCOUNT')}
                            </CText>
                            <CToggleSwitch style={{}} onToggle={() => toggleAddBeneficiary()} isOn={values.AddBeneficiary} />
                        </View> : null}
                        <ViewContainer scrolled={true}
                                       contentContainerStyle={Styles.scrollContainer}
                                       renderFooter={() => {
                                           return <View style={{paddingHorizontal: 25, paddingVertical: 25}}>
                                               <CButton title={addNewBeneficiary ? t('GLOBAL.SAVE_RECEIVER_ACCOUNT') : t('GLOBAL.NEXT')}
                                                        loading={loading} onPress={() => handleSubmit()}/>
                                           </View>
                                       }}>

                            <View style={[Styles.formContainer, RemittanceStyle.formTopSpace]}>

                                <CInput
                                    ref={firstName}
                                    inputSubLabel={t('FIELDS_LABELS.FIRST_NAME')}
                                    value={values.BeneficiaryFirstName}
                                    onChangeText={handleChange('BeneficiaryFirstName')}
                                    onBlur={() => setAccountTitle()}
                                    error={touched.BeneficiaryFirstName && t(errors.BeneficiaryFirstName)}
                                    onSubmitEditing={() => lastName.current.focus()}
                                    returnKeyType="next"
                                />

                                <CInput
                                    ref={lastName}
                                    inputSubLabel={t('FIELDS_LABELS.LAST_NAME')}
                                    value={values.BeneficiaryLastName}
                                    onBlur={() => setAccountTitle()}
                                    onChangeText={handleChange('BeneficiaryLastName')}
                                    error={touched.BeneficiaryLastName && t(errors.BeneficiaryLastName)}
                                    onSubmitEditing={() => !showNumberInBank(data?.type?.Value, data?.country) && (data?.type?.Value === BANK_TYPES.BANK_ACCOUNT || data?.type?.Value === BANK_TYPES.UPI) ? beneficiaryAccountNo.current.focus() : phone.current.focus()}
                                    returnKeyType="next"
                                />

                                {showNumberInBank(data?.type?.Value, data?.country) || (data?.type?.Value !== BANK_TYPES.BANK_ACCOUNT && data?.type?.Value !== BANK_TYPES.UPI) ? <CInput
                                    ref={phone}
                                    inputSubLabel={t('FIELDS_LABELS.MOBILE_NUMBER')}
                                    type="number"
                                    selectedCountry={selectedCountry}
                                    disabled={true}
                                    onPress={() => toggleCountryModal()}
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
                                    onSubmitEditing={() => data?.type?.Value === BANK_TYPES.BANK_ACCOUNT ? beneficiaryAccountNo.current.focus() : handleSubmit()}
                                    onBlur={() => setAccountNumber()}
                                    returnKeyType="next"
                                /> : null}

                                {data?.type?.Value === BANK_TYPES.UPI ? <Fragment>

                                    <CInput
                                        ref={beneficiaryAccountNo}
                                        inputSubLabel={t('FIELDS_LABELS.UPI_ID')}
                                        placeholder={"username@bankhandle"}
                                        value={values.BeneficiaryAccountNo}
                                        onChangeText={handleChange('BeneficiaryAccountNo')}
                                        error={touched.BeneficiaryAccountNo && t(errors.BeneficiaryAccountNo)}
                                        onSubmitEditing={() => handleSubmit()}
                                        returnKeyType="next"
                                    />

                                </Fragment> : null}

                                {data?.type?.Value === BANK_TYPES.BANK_ACCOUNT ? <Fragment>

                                    <CInput
                                        ref={beneficiaryAccountNo}
                                        inputSubLabel={t('FIELDS_LABELS.ACCOUNT_OR_IBAN_NUMBER')}
                                        placeholder={checkWallet().placeholder}
                                        keyboardType={checkWallet().keyboardType}
                                        value={values.BeneficiaryAccountNo}
                                        autoCapitalize="characters"
                                        onChangeText={handleChange('BeneficiaryAccountNo')}
                                        error={touched.BeneficiaryAccountNo && t(errors.BeneficiaryAccountNo)}
                                        onSubmitEditing={() => handleSubmit()}
                                        returnKeyType="next"
                                    />

                                </Fragment> : null}

                            </View>

                            <CModal
                                isOpen={nationalityModalIsOpen}
                                close={() => toggleNationalityModal()}
                                headerProps={{
                                    headerTitle: t('FIELDS_LABELS.SELECT_NATIONALITY'),
                                    headerRight: true,
                                    backOnPress:() => toggleNationalityModal()
                                }}>
                                <CountriesModal onSelect={(val) => nationalityOnSelect(val)}/>
                            </CModal>

                        </ViewContainer>

                        <CLoading showAnimation={true} loading={loading}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default CForm;
