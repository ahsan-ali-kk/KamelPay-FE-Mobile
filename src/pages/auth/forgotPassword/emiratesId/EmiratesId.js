import React, {useRef, useState} from "react";
import {View} from "react-native";
import Styles from "../../Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../../containers";
import {CText} from "../../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {getOcrTokenForgotPassword} from "../../../../store/actions/Auth.action";
import {useTranslation} from "react-i18next";
import Uqudo from "../../../home/UpdateEmiratesID";
import Popup from "../../../../uiComponents/popup/Popup";

function ForgotPassword(props) {

    const {navigation} = props;
    const {route: { params: data }} = props;

    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();
    const uqudoFlowRef = useRef();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.getOcrTokenForgotPasswordLoading,
        }
    });

    const [responseForget, updateResponseForget] = useState({});

    const errorPopup = (message) => {
        Popup.show({
            isVisible: true,
            type: 'Error',
            title: t('POPUPS.ERROR.TITLE'),
            text: message,
            actions: [
                {
                    text: t('GLOBAL.TRY_AGAIN'),
                    callback: () => {
                        Popup.hide()
                    }
                }
            ]
        })
    };

    const callBack = (res) => {
        if(res?.error){
            errorPopup(res?.data?.message);
            navigation.goBack()
        } else {
            updateResponseForget(res?.data);
            uqudoFlowRef?.current?.run({
                type: 'FORGOT_PASSWORD',
                ocrToken: res?.data?.ocrToken,
                token: res?.data?.token,
                vendor: res?.data?.vendor || '',
                uqudoUserId: res?.data?.uqudoUserId,
            })
        }
    };

    const submit = (values) => {
        let payload = {
            ...values,
            token: data?.token,
        };
        dispatch(getOcrTokenForgotPassword(payload, callBack))
    };

    const navigate = (routeName, payload = {}) => {
        navigation.navigate(routeName, payload)
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    const confirmEidDetail = (token, type, vendor = '') => {
        uqudoFlowRef?.current?.clearStates();
        let payload = {
            token: responseForget?.token,
            ocrToken: token,
            canOcr: data?.canOcr,
            vendor
        };
        navigate('newPassword', payload)
    };

    const confirmEidDetailOnClose = () => {
        uqudoFlowRef?.current?.clearStates();
        updateResponseForget();
        navigation.goBack();
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>{t('FORGOT_PASSWORD.TITLE')}</CText>
                    <CText style={Styles.text}>
                        {t('FORGOT_PASSWORD.THIRD_TITLE')}
                    </CText>
                </View>

                <CForm
                    loading={reduxState.loading}
                    submit={submit}
                />

                <Uqudo
                    ref={uqudoFlowRef}
                    confirm={confirmEidDetail}
                    close={confirmEidDetailOnClose}
                    tokenWithParams={true}
                />

            </ViewContainer>
        </Container>
    )
}
export default ForgotPassword;
