import React, {useEffect, useRef, useState, Fragment} from "react";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {CountriesModal, ViewContainer, Container} from "../../../containers";
import {CButton, CInput, CModal, CText, CToggleSwitch} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import Styles from "../payBill/Billers.style";
import {Formik} from "formik";
import AuthStyle from "../../auth/Auth.style";
import {mobileNumber} from "./Validations";
import {getBillersByCountry, getMobileCarrierLookup} from "../../../store/actions/TopUp.action";
import {useTranslation} from "react-i18next";
import Billers from "./Billers";

function AddTopUp(props) {
    const { t, i18n } = useTranslation();

    const {navigation, route: { params: data }, } = props;
    const dispatch = useDispatch();
    const form = useRef();
    const headerProps = {
        headerTitle: t('MOBILE_TOPUP.TITLE'),
        headerRight: true,
    };

    const reduxState = useSelector(({topUp, global}) => {
        return {
            loading: topUp.mobileCarriersLoading || topUp.getBillersByCountry,
            currentCountry: global.currentCountry,
            countries: global.countries,

            getBillersByCountry: topUp.getBillersByCountry,
            billersByCountry: topUp.billersByCountry,
        }
    });

    const [countryModalIsOpen, updateCountryModalIsOpen] = useState(false);
    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);

    useEffect(() => {
        updateCountryModalIsOpen(data?.initialCountryModal === undefined ? false : data?.initialCountryModal);
        if(data?.country) {
            let found = reduxState.countries.find(c => c.cioc === data?.country?.cioc);
            updateSelectedCountry(found || reduxState.currentCountry)
        }
    }, [data]);


    useEffect(() => {
        if(data?.BillerType?.includes('Postpaid' || 'Mobile Postpaid') && data?.viewType === 'SELECTION') {
            dispatch(getBillersByCountry({
                countryCode: selectedCountry?.cca3
            }))
        }
    }, [selectedCountry]);


    const toggleCountryModal = () => {
        updateCountryModalIsOpen(!countryModalIsOpen)
    };

    const countryOnSelect = (item) => {
        updateSelectedCountry(item);
        toggleCountryModal();
    };

    const callBack = (res, payload) => {
        if(res?.billerFound) {
            navigation.navigate('mobile_topup_pay', {
                data: res?.data,
                payload,
                ...(data?.moduleType && {moduleType: data?.moduleType})
            })
        } else {
            navigation.navigate('mobile_topup_billers', {
                payload,
                Billers: res?.data || [],
                ...(data?.moduleType && {moduleType: data?.moduleType})
            })
        }
    };

    const getMobileCarrier = (values) => {
        let perifix = selectedCountry?.detail?.code;
        let payload = {
            AddBeneficiary: values?.AddBeneficiary,
            ...(values?.AddBeneficiary && {Alias: values?.Alias}),
            CountryCode: selectedCountry?.cca3,
            ...(data?.BillerID && {BillerID: data?.BillerID}),
            MobileNumber: `${perifix.replace(/[^\w\s]/gi, '')}${values.MobileNumber.replace(/\s+/g, '')}`
        };
        dispatch(getMobileCarrierLookup(payload, callBack))
    };

    const submit = (values) => {
        getMobileCarrier(values)
    };

    const toggleAddBeneficiary = () => {
        let currentValue = form?.current?.values?.AddBeneficiary;
        form.current.setFieldValue('AddBeneficiary', !currentValue)
    };

    return (
        <Fragment>
            {data?.BillerType?.includes('Postpaid') && data?.viewType === 'SELECTION' ? <Billers
                data={reduxState?.billersByCountry}
                loading={reduxState?.getBillersByCountry}
                navigation={navigation}
                toggleCountryModal={() => toggleCountryModal()}
            /> : <Container
                loading={reduxState.loading}
                headerProps={headerProps}>
                <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer} style={Styles.scrollContainer}>
                    <Formik
                        innerRef={form}
                        validationSchema={mobileNumber(selectedCountry)}
                        onSubmit={(values) => submit(values)}
                        initialValues={{
                            MobileNumber: '',
                            AddBeneficiary: true,
                            Alias: ''
                        }}>
                        {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                            return (
                                <View style={[Styles.formContainer]}>
                                    <View style={[AuthStyle.formContainer, GlobalStyle.margin_top_15, {flexGrow: 1}]}>
                                        <CInput
                                            inputSubLabel={t('FIELDS_LABELS.MOBILE_NUMBER')}
                                            type="number"
                                            // disabled={true}
                                            selectedCountry={selectedCountry}
                                            onPress={() => toggleCountryModal()}
                                            keyboardType={'numeric'}
                                            value={values.MobileNumber}
                                            onChangeText={(val) => {
                                                let phone = val;
                                                let reg = /^0+/gi;
                                                if (phone.match(reg)) {
                                                    phone = phone.replace(reg, '');
                                                }
                                                handleChange('MobileNumber')(phone)
                                            }}
                                            error={t(errors.MobileNumber)}
                                            // mask={selectedCountry?.detail?.pattern}
                                            returnKeyType="next"
                                        />

                                        <View style={GlobalStyle.toggleView}>
                                            <CText style={GlobalStyle.toggleViewText}> {t("SECTION_LABELS.ADD_BENEFICIARY")} </CText>
                                            <CToggleSwitch style={{}} onToggle={() => toggleAddBeneficiary()} isOn={values.AddBeneficiary} />
                                        </View>

                                        {values.AddBeneficiary ? <CInput
                                            inputSubLabel={t('FIELDS_LABELS.BENEFICIARY_NAME')}
                                            placeholder={t('FIELDS_LABELS.BENEFICIARY_NAME_PLACEHOLDER')}
                                            value={values.Alias}
                                            leftIconName={'profile'}
                                            onChangeText={handleChange('Alias')}
                                            error={t(errors.Alias)}
                                            returnKeyType="next"
                                        /> : null}
                                    </View>

                                    <View style={[GlobalStyle.listFooterButton, GlobalStyle.marginHorizontal_0]}>
                                        <CButton title={t("GLOBAL.NEXT")}
                                                 onPress={() => handleSubmit()}
                                                 loading={reduxState.loading}/>
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                </ViewContainer>


            </Container>}
                <CModal
                isOpen={countryModalIsOpen}
                headerProps={{
                headerTitle: t('MOBILE_TOPUP.TITLE'),
                headerRight: true,
                backOnPress:() => toggleCountryModal()
            }}>
                <CountriesModal onSelect={(val) => countryOnSelect(val)}/>
                </CModal>
        </Fragment>

    )
}

export default React.memo(AddTopUp)
