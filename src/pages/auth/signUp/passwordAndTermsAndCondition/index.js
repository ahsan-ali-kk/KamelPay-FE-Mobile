import React, {useEffect} from "react";
import Styles from "../../Auth.style";
import {ViewContainer, Container} from "../../../../containers";
import {useDispatch, useSelector} from "react-redux";
import CForm from "./Form";
import {BackHandler, View} from "react-native";
import {CText} from "../../../../uiComponents";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {getProfile, toggleAuth, userSignUp} from "../../../../store/actions/Auth.action";
import {errorPopup} from "../helper";
import {
    _setDataToAsyncStorage,
    removeItemIntoAsyncStorage
} from "../../../../utils/asyncStorage/Functions";
import {DRAFT_SIGNUP_ID, TOKEN} from "../../../../utils/asyncStorage/Constants";
import {connectionSocket} from "../../../../utils/socket";

function PasswordAndTermsAndCondition(props) {

    const { t, i18n } = useTranslation();
    const { route: { params: data } } = props;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    console.log('PasswordAndTermsAndCondition data', data)

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.userSignupLoading,
            currentCountry: global.currentCountry,
            masterDetails: global.masterDetails,
            applicationVersions: global.applicationVersions
        }
    });

    const {loading, masterDetails, applicationVersions} = reduxState;

    const userSignUpCallback = async (res) => {
        if(res?.error) {
            errorPopup(t, res?.data?.message || "Something went wrong");
        } else {
            console.log('userSignUpCallback==userSignUpCallback',res?.data);
            await _setDataToAsyncStorage(TOKEN, res?.data?.token);
            await connectionSocket();
            await removeItemIntoAsyncStorage(DRAFT_SIGNUP_ID);
            dispatch(getProfile({}, (res) => {
                let user = res?.type === 'SUCCESS' ? res?.user : {
                    ...res?.data?.data,
                    isDeviceRegistered: res?.data?.isDeviceRegistered
                }
                // loginUser(user);
                dispatch(toggleAuth(user));
            }));
        }
    };

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            resetNavigation();
            return true
        });
        return () => sub.remove();
    }, [navigation]);


    const next = (values) => {
        let payload = {
            ...values,
            token: data?.token || data
        }
        dispatch(userSignUp(payload, userSignUpCallback));
    };

    const resetNavigation = () => {
        navigation.reset({
            index: 0,
            routes: [{name: 'login'}],
        });
    }

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
        backOnPress: () => resetNavigation(),
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>
                        {t('SIGN_UP.LAST_STEP_TITLE')}
                    </CText>
                    <CText style={Styles.text}>
                        {t('SIGN_UP.LAST_STEP_SUB_TITLE')}
                    </CText>
                </View>
                <CForm
                    submit={next}
                    loading={loading}
                    termAndConditions={masterDetails?.signupTermsAndConditions || applicationVersions?.signupTermsAndConditions || ''}
                />
            </ViewContainer>
        </Container>
    )
}
export default PasswordAndTermsAndCondition;
