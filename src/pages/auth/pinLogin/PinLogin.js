import React from "react";
import {View} from "react-native";
import Styles from "../Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {useSelector} from "react-redux";
import {login} from "../../../store/actions/Auth.action";
import {CText} from "../../../uiComponents";
import {useTranslation} from "react-i18next";

function PinLogin(props) {

    const { t, i18n } = useTranslation();

    const {navigation} = props;


    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.loginLoading,
            biometricEnable: auth.biometricEnable,
        }
    });

    const renderContent = () => {
        if(reduxState?.biometricEnable?.includes('PIN') && reduxState?.biometricEnable?.includes('BIOMETRIC')) {
            return {
                title: t('PIN_LOGIN.TITLE'),
                text: t('PIN_LOGIN.SUB_TITLE')
            }
        }
        else if(reduxState?.biometricEnable?.includes('PIN')) {
            return {
                title: t('PIN_LOGIN.SECOND_TITLE'),
                text: t('PIN_LOGIN.SECOND_SUB_TITLE')
            }
        }
        else if(reduxState?.biometricEnable?.includes('BIOMETRIC')) {
            return {
                title: t('PIN_LOGIN.THIRD_TITLE'),
                text: t('PIN_LOGIN.THIRD_SUB_TITLE')
            }
        } else {
            return {
                title: '',
                text: ''
            }
        }
        // return {
        //     title: t('PIN_LOGIN.THIRD_TITLE'),
        //     text: t('PIN_LOGIN.THIRD_SUB_TITLE')
        // }
    };

    const headerProps = {
        hideBackButton: false,
        showCenterLogo: true,
        headerRight: true
    };

    return (
        <Container headerProps={headerProps} loading={reduxState.loading}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>{renderContent().title}</CText>
                    <CText style={Styles.text}>{renderContent().text}</CText>
                </View>


                <CForm loading={reduxState.loading}
                       biometricEnable={reduxState?.biometricEnable}
                       loginRoute={() =>  navigation.navigate('login', {
                           hideBackButton: true,
                           key: 'E_LOGIN'
                       })}
                       signUpRoute={() => navigation.navigate('cardConfirmation')}/>

            </ViewContainer>
        </Container>
    )
}
export default PinLogin;
