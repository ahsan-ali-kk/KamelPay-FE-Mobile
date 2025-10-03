import React, {useState} from "react";
import {Container, CountriesModal} from "../../../../containers";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Form from "./Form";
import {useNavigation} from "@react-navigation/native";
import _ from "lodash";
import {CModal} from "../../../../uiComponents";

function OtherInformation(props) {

    const { t } = useTranslation();
    const navigation = useNavigation();

    const {route: {params: data}} = props;

    const headerProps = {
        headerTitle: t('ADVANCE_SALARY.SALARY_REQUEST_TITLE'),
        headerRight: true,
    };

    const reduxState = useSelector(({global, advanceSalary}) => {
        return {
            loading: advanceSalary.requestLoading || global.sendOtpLoading,
            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility,
            dropDownValues: advanceSalary.dropDownValues,
            currentCountry: global.currentCountry,
            nationalCountry: global.nationalCountry,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.nationalCountry);
    const [countryModalIsOpen, updateCountryModalIsOpen] = useState(false);

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
            ...data,
            ...updatedValues
        };
        payload.firstReferencePhone =  `${selectedCountryPrefix.replace(/[^\w\s]/gi, '')}${values.firstReferencePhone.replace(/\s+/g, '')}`;
        payload.localFriendPhone =  `${currentCountryPrefix.replace(/[^\w\s]/gi, '')}${values.localFriendPhone.replace(/\s+/g, '')}`;
        navigation.navigate('advance_salary_request_overview', payload)
    };

    return (
        <Container loading={reduxState.loading} headerProps={headerProps}>

            <Form
                submit={submit}
                loading={reduxState.loading}
                toggleCountryModal={toggleCountryModal}
                selectedCountry={selectedCountry}
                currentCountry={reduxState?.currentCountry}
                advanceApplied={data?.advance}
                advanceSalaryDetails={reduxState?.advanceSalaryDetails}
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

export default React.memo(OtherInformation)
