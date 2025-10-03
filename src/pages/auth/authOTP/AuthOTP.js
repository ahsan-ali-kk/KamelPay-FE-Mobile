import React, {useState} from "react";
import {View} from "react-native";
import Styles from "../Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {CText} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {resendOtp, toggleAuth, verifyOtp} from "../../../store/actions/Auth.action";
import {TOKEN} from "../../../utils/asyncStorage/Constants";
import {_setDataToAsyncStorage, getTokenAndSetIntoHeaders} from "../../../utils/asyncStorage/Functions";
import events from "../../../utils/events";
import {useTranslation} from "react-i18next";
import {loginUser} from "../../../trackingEvents/UXCAM";
import {connectionSocket} from "../../../utils/socket";

function AuthOTP(props) {
    const { t } = useTranslation();

    const {navigation, route : {params : data}} = props;
    const dispatch = useDispatch();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.verifyOtpLoading,
            resendLoading: auth.resendOtpLoading,
            isLoggedIn: auth.isLoggedIn,
            biometricEnable: auth.biometricEnable
        }
    });

    const [token, updatedToken] = useState(data?.token || '');

    const verifyOtpCallBack = async (response) => {
        if(response.error) {
            if(response?.data?.message === 'Session expired.') {
                navigation.navigate('login')
            }
        } else {
            if(data.screen === 'checkStatus') {
                await _setDataToAsyncStorage(TOKEN, response?.token);
                await getTokenAndSetIntoHeaders(response?.token);
                await connectionSocket();
                let updatedUser = {
                    ...data?.user,
                    status: 'INACTIVE'
                };
                await loginUser(updatedUser);
                dispatch(toggleAuth(updatedUser));
            }
            else {
                navigate(data.screen, response.token)
            }
        }
    };

    const submit = (values) => {
        let payload = {
            otp: values.otp,
            token: token
        };
        dispatch(verifyOtp(payload, verifyOtpCallBack))
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

    const changeNumber = () => {
        let payload = {
            phone : data?.user?.phone,
            token: token
        };
        navigate('changePhoneNumber', payload)
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30, marginBottom: 30}]}>
                    <CText style={Styles.title}> {t('OTP.TITLE')} </CText>
                    <CText style={Styles.text}> {t('OTP.SUB_TITLE')} </CText>

                    {data?.user?.phone || data?.phone ? <View style={Styles.phoneNumberView}>
                        <CText style={Styles.phoneNumber}>+{data?.user?.phone || data?.phone}</CText>
                    </View> : null}
                </View>

                <CForm
                    loading={reduxState.loading || reduxState.resendLoading}
                    isLoggedIn={reduxState.isLoggedIn}
                    submit={submit}
                    hideChangeNumber={data?.hideChangeNumber || false}
                    changeNumber={changeNumber}
                    resendCode={resendCode}
                    loginRoute={() =>  navigate('login')}
                />

            </ViewContainer>
        </Container>
    )
}
export default AuthOTP;
