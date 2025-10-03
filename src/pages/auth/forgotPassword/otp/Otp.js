import React, {useState} from "react";
import {View} from "react-native";
import Styles from "../../Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../../containers";
import {CText} from "../../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {resendOtp, sendUsername, verifyOtp} from "../../../../store/actions/Auth.action";
import events from "../../../../utils/events";

function OTP(props) {

    const {navigation, route : {params : data}} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.verifyOtpLoading,
            resendLoading: auth.resendOtpLoading,
            isLoggedIn: auth.isLoggedIn,
        }
    });

    const [token, updatedToken] = useState(data?.token || '');

    const verifyOtpCallBack = (response) => {
         if(response.error) {
             if(response?.data?.message === 'Session expired.') {
                 navigation.goBack()
             }
        } else {
            if(data.screen === 'login') {
                dispatch(sendUsername({token: response.token}));
                navigate(data.screen)
            } else {
                navigate(data.screen, response.token)
            }
        }
    };

    const next = (values) => {
        dispatch(verifyOtp({
            otp: values.otp,
            token: token
        }, verifyOtpCallBack))
    };

    const navigate = (routeName, payload = {}) => {
        navigation.navigate(routeName, payload)
    };

    const resendCodeCallBack = (res) => {
        if(res.error) {
            if(res?.data?.message === 'Session expired.') {
                navigation.goBack()
            }
        } else {
            updatedToken(res.token);
            events.emit('restartOTPTimer', {})
        }
    };

    const resendCode = () => {
        let payload = {
            token: token,
        };
        dispatch(resendOtp(payload, res => resendCodeCallBack(res)))
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30, marginBottom: 30}]}>
                    <CText style={Styles.title}>OTP Verification</CText>
                    <CText style={Styles.text}>
                        Enter 6-digit code sent to your mobile number
                    </CText>
                    {data?.phone ? <View style={Styles.phoneNumberView}>
                        <CText style={Styles.phoneNumber}>+{data?.phone}</CText>
                    </View> : null}
                </View>
                <CForm
                    loading={reduxState.loading || reduxState.resendLoading}
                    isLoggedIn={reduxState.isLoggedIn}
                    submit={next}
                    resendCode={resendCode}
                    loginRoute={() =>  navigate('login')}
                />
            </ViewContainer>
        </Container>
    )
}
export default OTP;
