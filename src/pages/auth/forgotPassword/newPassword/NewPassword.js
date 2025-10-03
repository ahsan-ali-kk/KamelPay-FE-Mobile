import React from "react";
import {View} from "react-native";
import Styles from "../../Auth.style";
import { themes } from '../../../../theme/colors';
import CForm from "./Form";
import {ViewContainer, Container} from "../../../../containers";
import {CText} from "../../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {newPassword} from "../../../../store/actions/Auth.action";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import Popup from "../../../../uiComponents/popup/Popup";

function NewPassword(props) {
    const { t, i18n } = useTranslation();

    const {theme, navigation, route : {params : data}} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.newPasswordLoading
        }
    });

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

    const callBack = (response) => {
        if(response.error || response?.data?.message === 'Session expired.') {
            errorPopup(response?.data?.message);
            navigate('forgotPassword')
        } else {
            navigate('login')
        }
    };

    const submit = (values) => {
        let payload;
        let paramsData = _.omit(data, ['canOcr']);
        if(data?.canOcr) {
            payload = {
                ...paramsData,
                password: values.password
            };
        } else {
            payload = {
                token: data,
                password: values.password
            };
        }
        dispatch(newPassword(payload, callBack))
    };

    const navigate = (routeName, payload = {}) => {
        navigation.navigate(routeName, payload)
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}> {t('NEW_PASSWORD.TITLE')} </CText>
                    <CText style={Styles.text}> {t('NEW_PASSWORD.SUB_TITLE')} </CText>
                </View>
                <CForm theme={themes[theme]}
                       loading={reduxState.loading}
                       submit={submit}
                       loginRoute={() => navigate('login')}
                />
            </ViewContainer>
        </Container>
    )
}
export default NewPassword;
