import React, {useState} from "react";
import Styles from "../../Auth.style";
import {ViewContainer, Container} from "../../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import _ from "lodash";
import {userMobileIdentification} from "../../../../store/actions/Auth.action";
import {View} from "react-native";
import {CText} from "../../../../uiComponents";
import CForm from "../../forgotPassword/Form";
import Popup from "../../../../uiComponents/popup/Popup";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import PhonePrompt from "../phonePrompt";
import {errorPopup, SIGN_UP_CONSTANT} from "../helper";

function EnterPhone(props) {

    const { t, i18n } = useTranslation();
    const { route: { params: data } } = props;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.userMobileDetectionLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);

    const submit = (values) => {
        let perifix = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes?.length > 1 ?  '' : selectedCountry?.idd?.suffixes[0]}`;
        let payload = _.omit(values, ['phone']);
        payload.phone =  `${perifix.replace(/[^\w\s]/gi, '')}${values.phone.replace(/\s+/g, '')}`;
        payload.token = data?.token;
        console.log('EnterPhone Submit Payload', payload)

        dispatch(userMobileIdentification(payload, userMobileIdentificationCallBack))
    };

    const userMobileIdentificationCallBack = (res) => {
        if(res?.error) {
            if(res?.data?.status){
                Popup.show({
                    isVisible: true,
                    styleMainContainer: GlobalStyle.paddingHorizontal_0,
                    styleContainer: GlobalStyle.bottomHalfModal,
                    viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
                    buttonLastType: 'fill',
                    type: 'customView',
                    showClose: true,
                    edges: ['top', 'left', 'right'],
                    customView: () => {
                        return (
                            <PhonePrompt
                                errorMessage={res?.data?.message}
                                data={data}
                                callBack={() => {
                                    // resetState();
                                    Popup.hide();
                                }}
                            />
                        )
                    }
                })
            } else {
                errorPopup(t, res?.data?.message || "Something went wrong");
            }
        } else {
            if(res?.data?.status === SIGN_UP_CONSTANT.UNCLAIMED_USER_FOUND._id){
                // unclaimed_user_found
                navigation.navigate('authOTP', {
                    user: {
                        phone: res?.data?.phone,
                    //     ...response?.data?.data,
                    //     isDeviceRegistered: response?.data?.isDeviceRegistered,
                    },
                    token: res?.data?.token,
                    screen: 'passwordAndTermsAndCondition',
                    hideChangeNumber: false
                })
            }
            console.log("====userMobileIdentification====", res);
        }
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>
                        {t('SIGN_UP.ENTER_YOUR_PHONE_NUMBER')}
                    </CText>
                    <CText style={Styles.text}>
                        {t('FORGOT_PASSWORD.SUB_TITLE')}
                    </CText>
                </View>
                <CForm
                    loading={reduxState.loading}
                    submit={submit}
                    selectedCountry={selectedCountry}
                />

            </ViewContainer>
        </Container>
    )
}
export default EnterPhone;
