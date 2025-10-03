import React, {useState} from "react";
import {View} from "react-native";
import Styles from "../../pages/auth/Auth.style";
import CForm from "./Form";
import {Container, ViewContainer} from "../../containers";
import {CText} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {resendOtp, verifyOtp} from "../../store/actions/Global.action";
import events from "../../utils/events";
import {useTranslation} from "react-i18next";
import {toggleSubscriptionModal} from "../../store/actions/Savings.action";

function OTP(props) {

    const { t, i18n } = useTranslation();

    const {route: {params: data}, navigation, reSend, verify, loading, reSendShow = true} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.verifyOtpLoading,
            resendLoading: auth.resendOtpLoading,
            isLoggedIn: auth.isLoggedIn,
        }
    });

    const [token, updatedToken] = useState(data?.token || '');

    const next = (values) => {
        if(verify){
            verify(values)
        } else {
            dispatch(verifyOtp({
                otp: values.otp,
                token: token
            }, res => nextCallBack(res)))
        }
    };


    const goBack = () => {
        if(data?.flow === 'WITHOUT_OTP_DATA') {
            navigation.replace(data?.screen, {
                ...data?.overviewData
            })
        } else {
            navigation.goBack()
        }
    };

    const nextCallBack = (response) => {
        if(!response.error) {

            let payload = {
                ...data,
                ...(response?.token && {token: response?.token})
            };

            if(data?.flow === 'WITHOUT_OTP_DATA') {
                navigation.replace(data?.screen, {
                    ...data?.overviewData,
                    whereToComeFrom: 'OTP',
                    verifyOtpResponseToken: response?.token
                })

            } else if(data?.screen === 'activate_card' || data?.screen === 'change_pin' || data?.screen === 'advance_salary_request_overview' || data?.isGoBack) {
                navigation.replace(data?.screen, payload)
            } else {
                events.emit("verifyOtpCallBack", payload);
                navigation.goBack();
                if(data?.callAgain === 'toggle_subscription_modal') {
                    setTimeout(() => {
                        dispatch(toggleSubscriptionModal({
                            isOpen: true,
                            otp_verified: true,
                        }))
                    }, 100)
                }
            }

        }
    };

    const resendCodeCallback = (res) => {
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
        if(reSend){
            reSend();
        } else {
            dispatch(resendOtp({ token }, res => resendCodeCallback(res)))
        }
    };

    const headerProps = {
        showCenterLogo: false,
        headerRight: true,
        backOnPress: () => goBack()
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
                    reSendShow={reSendShow}
                    loading={reduxState.loading || reduxState.resendLoading || loading}
                    isLoggedIn={reduxState.isLoggedIn}
                    submit={next}
                    resendCode={resendCode}
                />
            </ViewContainer>
        </Container>
    )
}
export default OTP;
