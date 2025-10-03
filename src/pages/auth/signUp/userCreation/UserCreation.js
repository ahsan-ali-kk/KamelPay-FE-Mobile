import React, {useState} from "react";
import {View} from "react-native";
import Styles from "../../Auth.style";
import { themes } from '../../../../theme/colors';
import CForm from "./Form";
import {ViewContainer, Container} from "../../../../containers";
import {CText} from "../../../../uiComponents";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {signUp} from "../../../../store/actions/Auth.action";
import {useTranslation} from "react-i18next";
import {setHours} from "../../../../utils/methods";

function UserCreation(props) {

    const {theme, navigation, route : {params : data}} = props;
    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.signUpLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [selectedCountry] = useState(reduxState.currentCountry);

    const signUpCallback = (response) => {
            navigation.navigate('authOTP', {
                user: {
                    ...response?.data?.data,
                    isDeviceRegistered: response?.data?.isDeviceRegistered,
                },
                token: response?.data?.token,
                screen: 'checkStatus',
                hideChangeNumber: true
            })
    };

    const submit = (values) => {
        let perifix = selectedCountry?.detail?.code;
        let payload = _.omit(values, ['phone', 'confirmPassword']);
        payload.phone =  `${perifix.replace(/[^\w\s]/gi, '')}${values.phone.replace(/\s+/g, '')}`;
        if(payload.emirateID){
            payload.emirateID = `${values.emirateID.replace(/-/g,"")}`;
        }
        if(data?.cardExpiry){
            payload.cardExpiry = setHours(data.cardExpiry, 'to')
        }
        if(data?.cardNo){
            payload.cardNo = data.cardNo
        }
        // console.log(payload);
        dispatch(signUp(payload, signUpCallback))
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}> {t('SIGN_UP.TITLE')} </CText>
                    <CText style={Styles.text}> {t('SIGN_UP.SUB_TITLE')} </CText>
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
export default UserCreation;
