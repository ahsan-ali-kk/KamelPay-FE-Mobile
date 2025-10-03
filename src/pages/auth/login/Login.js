import React, {memo, useEffect, useState} from "react";
import {View} from "react-native";
import Styles from "../Auth.style";
import CForm from "./Form";
import {ViewContainer, Container, CountriesModal} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../../store/actions/Auth.action";
import {CModal, CText} from "../../../uiComponents";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { JOURNEY_BEGIN } from "../signUp/helper";

function Login(props) {

    const { t, i18n } = useTranslation();

    const {route: {params: data}, navigation} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.loginLoading,
            overlayLoading: auth.resumeSignupJourneyLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);
    const [countryModalIsOpen, updateCountryModalIsOpen] = useState(false);

    const toggleCountryModal = (val = false) => {
        updateCountryModalIsOpen(val)
    };

    const countryOnSelect = (item) => {
        updateSelectedCountry(item);
        toggleCountryModal();
    };

    const loginFunction = async (values) => {
        let perifix = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes?.length > 1 ?  '' : selectedCountry?.idd?.suffixes[0]}`;
        let payload = _.omit(values, ['phone']);
        payload.phone =  `${perifix.replace(/[^\w\s]/gi, '')}${values.phone.replace(/\s+/g, '')}`;
        dispatch(login(payload))
    };

    useEffect(() => {
        if(reduxState.currentCountry) {
            updateSelectedCountry(reduxState.currentCountry)
        }
    }, [reduxState.currentCountry]);

    const headerProps = {
        hideBackButton: data?.hideBackButton || false,
        showCenterLogo: true,
        headerRight: true,
        isLanguageChange: true,
    };

    return (
        <Container headerProps={headerProps} loading={reduxState.overlayLoading}>

            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>{!data?.hideBackButton ? t('LOGIN.TITLE') : t('LOGIN.TITLE_2')}</CText>
                    <CText style={Styles.text}> {t('LOGIN.SUB_TITLE')} </CText>
                </View>

                <CForm loading={reduxState.loading}
                       submit={loginFunction}
                       toggleCountryModal={toggleCountryModal}
                       selectedCountry={selectedCountry}
                       forgotRoute={() =>  navigation.navigate('forgotPassword')}
                       forgotUsernameRoute={() =>  navigation.navigate('forgotUsername')}
                       signUpRoute={() =>  navigation.navigate('findUser', {
                            journeyBegin: JOURNEY_BEGIN.NEW._id
                       })}
                />

            </ViewContainer>

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
export default memo(Login);
