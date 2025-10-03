import React, {useState} from "react";
import {View} from "react-native";
import Styles from "../Auth.style";
import { themes } from '../../../theme/colors';
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {CText} from "../../../uiComponents";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {updatePhoneNumber} from "../../../store/actions/Auth.action";
import events from "../../../utils/events";
import {useTranslation} from "react-i18next";

function ChangePhoneNumber(props) {

    const { t, i18n } = useTranslation();

    const {theme, navigation, route : {params : data}} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.updatePhoneNumberLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [selectedCountry] = useState(reduxState.currentCountry);

    const callback = (response) => {
        navigation.navigate('authOTP', {
            user: response?.data?.data,
            token: response?.data?.token,
            screen: 'checkStatus',
            hideChangeNumber: true
        });
        events.emit('restartOTPTimer', {})
    };

    const submit = (values) => {
        let perifix = selectedCountry?.detail?.code;
        let payload = _.omit(values, ['phone', 'confirmPassword']);
        payload.phone = `${perifix.replace(/[^\w\s]/gi, '')}${values.phone.replace(/\s+/g, '')}`;
        payload.token = data?.token;
        dispatch(updatePhoneNumber(payload, callback))
    };


    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}> {t('CHANGE_PHONE_NUMBER.TITLE')} </CText>
                    <CText style={Styles.text}> {t('CHANGE_PHONE_NUMBER.SUB_TITLE')} </CText>
                    <CText style={[Styles.text, Styles.phoneNumber]}> +{data?.phone} </CText>
                </View>
                <CForm
                    theme={themes[theme]}
                    loading={reduxState.loading}
                    submit={submit}
                    selectedCountry={selectedCountry}
                    loginRoute={() =>  navigation.navigate('login')}
                />

            </ViewContainer>
        </Container>
    )
}
export default ChangePhoneNumber;
