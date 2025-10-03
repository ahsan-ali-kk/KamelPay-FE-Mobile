import React, {useEffect, useState} from "react";
import {Container, CountriesModal} from "../../../containers";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Form from "./Form";
import _ from "lodash";
import {useNavigation} from "@react-navigation/native";
import {CModal} from "../../../uiComponents";
import {filterBracket} from "../helper";
import Popup from "../../../uiComponents/popup/Popup";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {View} from "react-native";
import TopupStyle from "../../topUp/TopUp.style";
import TenuresSelection from "../tenuresSelection/TenuresSelection";

function AdvanceSalaryRequest(props) {

    const {params} = props;
    const { t } = useTranslation();
    const navigation = useNavigation();

    const headerProps = {
        headerTitle: t('PERSONAL_LOAN.REQUEST_PAGE_TITLE'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global,  personalLoan}) => {
        return {
            loading: personalLoan.requestLoading || global.sendOtpLoading,
            card: global.selectedCard,
            personalLoanEligibility: personalLoan.personalLoanEligibility,
            currentCountry: global.currentCountry,
            nationalCountry: global.nationalCountry,
            user: auth.user,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.nationalCountry);
    const [countryModalIsOpen, updateCountryModalIsOpen] = useState(false);
    const [personalLoanEligibility, setPersonalLoanEligibility] = useState({})
    const [selectedInstallment, setSelectedInstallment] = useState(params?.selectedInstallment || null)

    useEffect(() => {
        let eligibleAmount = selectedInstallment?.amount;
        let noInstallment = selectedInstallment?.noOfInstallment;
        let feeBrackets = filterBracket(reduxState?.personalLoanEligibility?.feeBrackets, eligibleAmount, noInstallment);
        let personalLoanEligibility = {
            ...reduxState?.personalLoanEligibility,
            noOfInstallment: noInstallment,
            amount: (eligibleAmount - (feeBrackets?.maxMonthlyProcessingFee || 0)).toFixed(0),
            feeBrackets: feeBrackets?.filteredBrackets
        };
        setPersonalLoanEligibility(personalLoanEligibility)
    }, [reduxState?.personalLoanEligibility, selectedInstallment])

    const toggleCountryModal = (val = false) => {
        updateCountryModalIsOpen(val)
    };

    const countryOnSelect = (item) => {
        updateSelectedCountry(item);
        toggleCountryModal();
    };

    const submit = (values) => {
        let selectedCountryPrefix = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes?.length > 1 ?  '' : selectedCountry?.idd?.suffixes[0]}`;
        let currentCountryPrefix = `${reduxState?.currentCountry?.idd?.root}${reduxState?.currentCountry?.idd?.suffixes?.length > 1 ?  '' : reduxState?.currentCountry?.idd?.suffixes[0]}`;
        let updatedValues = _.omit(values, ['firstReferencePhone', 'localFriendPhone']);
        let payload = {
            ...values,
            ...updatedValues,
            ...params?.nextPayloadObj,
            selectedInstallment: selectedInstallment
        };
        payload.firstReferencePhone =  `${selectedCountryPrefix.replace(/[^\w\s]/gi, '')}${values.firstReferencePhone.replace(/\s+/g, '')}`;
        payload.localFriendPhone =  `${currentCountryPrefix.replace(/[^\w\s]/gi, '')}${values.localFriendPhone.replace(/\s+/g, '')}`;
        navigation.navigate('personal_loan_request_overview', payload)
    };

    const changeTenures = () => {
        Popup.show({
            isVisible: true,
            styleMainContainer: GlobalStyle.paddingHorizontal_0,
            styleContainer: GlobalStyle.bottomHalfModal,
            viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
            type: 'customView',
            showClose: false,
            edges: ['top', 'left', 'right'],
            customView: () => {
                return (
                    <View style={[TopupStyle.shortInfoModalContainer, {alignItems: 'stretch'}]}>
                        <TenuresSelection
                            amount={params?.amount}
                            tenure={params?.tenure || []}
                            // nextPayloadObj={values}
                            feeBrackets={params?.feeBrackets}
                            onSelect={(res) => {
                                setSelectedInstallment(res)
                            }}
                        />
                    </View>
                )
            },
            actions: [
                {
                    text: t('GLOBAL.CLOSE'),
                    callback: () => Popup.hide()
                }
            ]
        });
    };


    return (
        <Container loading={reduxState.loading} headerProps={headerProps}>
            <Form
                params={params}
                submit={submit}
                loading={reduxState.loading}
                toggleCountryModal={toggleCountryModal}
                changeTenures={changeTenures}
                selectedCountry={selectedCountry}
                currentCountry={reduxState?.currentCountry}
                personalLoanEligibility={personalLoanEligibility}
                selectedInstallment={selectedInstallment}
                currentUserNumber={reduxState?.user?.phone}
            />
            <CModal isOpen={countryModalIsOpen} close={() => toggleCountryModal()}
                    headerProps={{
                        headerTitle: t('GLOBAL.COUNTRIES'),
                        headerRight: true,
                        backOnPress:() => toggleCountryModal()
                    }}>
                <CountriesModal onSelect={(val) => countryOnSelect(val)}/>
            </CModal>

        </Container>
    )
}

export default React.memo(AdvanceSalaryRequest)
