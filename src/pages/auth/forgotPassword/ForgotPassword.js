import React, {useState} from "react";
import {View} from "react-native";
import Styles from "../Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {CText} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {forgotPassword} from "../../../store/actions/Auth.action";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {handleSuccess} from "../../../utils/methods";

function ForgotPassword(props) {
    const {navigation} = props;

    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.forgotPasswordLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);


    const forgotPasswordCallBack = (response) => {
        if(response?.canOcr) {
            navigation.navigate('forgotPasswordEmiratesId', { ...response })
        } else {
            handleSuccess(response?.message);
            navigation.navigate('authOTP', { ...response })
        }
    };

    const submit = (values) => {
        let perifix = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes?.length > 1 ?  '' : selectedCountry?.idd?.suffixes[0]}`;
        let payload = _.omit(values, ['phone']);
        payload.phone =  `${perifix.replace(/[^\w\s]/gi, '')}${values.phone.replace(/\s+/g, '')}`;
        dispatch(forgotPassword(payload, forgotPasswordCallBack))
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
                    <CText style={Styles.title}>{t('FORGOT_PASSWORD.TITLE')}</CText>
                    <CText style={Styles.text}>
                        {t('FORGOT_PASSWORD.SUB_TITLE')}
                    </CText>
                </View>
                <CForm
                    loading={reduxState.loading}
                    submit={submit}
                    selectedCountry={selectedCountry}
                    loginRoute={() => navigate('login')}
                />

            </ViewContainer>
        </Container>
    )
}
export default ForgotPassword;
