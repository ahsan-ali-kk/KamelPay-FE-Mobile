import React, {useEffect, useState} from "react";
import {Container, CountriesModal} from "../../../containers";
import CForm, {BANK_TYPES, showNumberInBank} from "./Form";
import {useDispatch, useSelector} from "react-redux";
import {CModal} from "../../../uiComponents";
import {addBeneficiary} from "../../../store/actions/Remittance.action";
import {sendOtp} from "../../../store/actions/Global.action";
import _ from "lodash";
import events from "../../../utils/events";
import {useTranslation} from "react-i18next";
import {addBeneficiaryEvent} from "../../../trackingEvents/UXCAM";

function RemittanceBeneficiaryDetails(props) {
    const { t } = useTranslation();

    const {route: { params: data }, navigation} = props;

    const dispatch = useDispatch();

    const [addNewBeneficiary, updateAddNewBeneficiary] = useState(data?.pageType === 'ADD_NEW_BENEFICIARY' || true);

    const headerProps = {
        headerTitle: t('GLOBAL.RECEIVER_ACCOUNT_DETAILS'),
        headerRight: true,
    };

    const reduxState = useSelector(({remittance, global}) => {
        return {
            loading: remittance.processPaymentLoading || remittance.addBeneficiaryLoading || global.sendOtpLoading,
            currentCountry: global.currentCountry,
            countries: global.countries,
            card: global.selectedCard,
        }
    });

    const [countryModalIsOpen, updateCountryModalIsOpen] = useState(false);
    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);

    useEffect(() => {
        let array = reduxState?.countries || [];
        let matchKey = data?.country?.CIOC || data?.country?.cioc;
        let found = array.find(o => o.cioc === matchKey);
        if(found){
            updateSelectedCountry(found)
        }
    }, []);

    const toggleCountryModal = () => {
        updateCountryModalIsOpen(!countryModalIsOpen)
    };

    const countryOnSelect = (item) => {
        updateSelectedCountry(item);
        toggleCountryModal();
    };

    const navigationReset = () => {
        navigation.reset({
            index: 0,
            routes: [{name: data?.module !== 'SNPL' ? 'Send_Money' : 'Snpl'}],
        });
    };

    useEffect(() => {
        let e;
        if(addNewBeneficiary) {
           e = events.addEventListener("verifyOtpCallBack", (res) => {
                if (res) {
                    verifyOtpCallBack(res)
                }
            })
        } else {
            events.removeListener('verifyOtpCallBack', e);
        }
        return () => {
            events.removeListener('verifyOtpCallBack', e);
        }
    }, [addNewBeneficiary]);

    const verifyOtpCallBack = (res) => {
        let payload = _.omit(res, ['message', 'otp']);
        dispatch(addBeneficiary(payload, (res) => {
            if(!res.error) {
                if(!data?.pageType){
                    sendMoneyFlow(payload, res, 'ADD_BENEFICIARY_AND_SEND_MONEY')
                } else if (data?.pageType === 'ADD_NEW_BENEFICIARY') {
                    trackAddBeneficiary(payload, data);
                    navigationReset()
                }
            }
        }))
    };

    const trackAddBeneficiary = (res, payload) => {
        let payloadData = {
            alias: res?.Alias,
            bank: payload?.bank,
            card: reduxState?.card,
            otherDetails: {
                ...(res?.AccountTitle && {AccountTitle: res?.AccountTitle}),
                ...(res?.BeneficiaryAccountNo && {BeneficiaryAccountNo: res?.BeneficiaryAccountNo}),
                BeneficiaryFirstName: res?.BeneficiaryFirstName,
                BeneficiaryLastName: res?.BeneficiaryLastName,
                BeneficiaryMSISDN: res?.BeneficiaryMSISDN,
                BeneficiaryNationalityCountryISOCode: res?.BeneficiaryNationalityCountryISOCode,
                RemitPurpose: res?.RemitPurpose,
            }
        };
        addBeneficiaryEvent(payloadData);
    };

    const addNewBeneficiaryFlow = (payload) => {
        dispatch(sendOtp(payload, res => addNewBeneficiaryFlowCallBack(res)))
    };

    const addNewBeneficiaryFlowCallBack = (res) => {
        if(!res.error) {
            navigation.navigate('send_money_otp', res)
        }
    };

    const sendMoneyFlow = (payload, res, pageType) => {
        let otherDetails = _.omit(payload, ['BankId', 'token']);
        let updatedPayload = {
            ...data,
            otherDetails,
            ...(pageType && {pageType: pageType}),
            ...(res?.beneficiary && {beneficiaryId: res?.beneficiary})
        };
        navigation.navigate('send_money_exchange_rate', updatedPayload)
    };

    const submit = (values) => {
        let perifix = selectedCountry?.detail?.code;
        let payload = {
            ...values,
            ...(showNumberInBank(data?.type.Value, data?.country) || (data?.type?.Value !== BANK_TYPES.BANK_ACCOUNT && data?.type?.Value !== BANK_TYPES.UPI) ? {
                BeneficiaryMSISDN: `${perifix.replace(/[^\w\s]/gi, '')}${values.BeneficiaryMSISDN.replace(/\s+/g, '')}`,
            } : {
                BeneficiaryMSISDN: `${perifix.replace(/[^\w\s]/gi, '')}00000000000`,
            }),
            BeneficiaryNationalityCountryISOCode: values.BeneficiaryNationalityCountryISOCode?.cca3,
            BankId: data.bank?._id,
            RemitPurpose: values?.RemitPurpose === 'Other' ? values.RemitPurposeText : values.RemitPurpose
        };
        payload = _.omit(payload, ['RemitPurposeText']);
        if(addNewBeneficiary) {
            addNewBeneficiaryFlow(payload)
        } else {
            if(payload?.AddBeneficiary) {
                addNewBeneficiaryFlow(payload);
            } else {
                sendMoneyFlow(payload, null, 'DIRECT_SEND_MONEY')
            }
        }
    };

    return(
        <Container headerProps={headerProps}>

            <CForm
                toggleCountryModal={toggleCountryModal}
                selectedCountry={selectedCountry}
                data={data}
                addNewBeneficiary={addNewBeneficiary}
                onChangeAddNewBeneficiary={updateAddNewBeneficiary}
                loading={reduxState.loading}
                submit={submit}
            />

        </Container>
    )
}

export default RemittanceBeneficiaryDetails
