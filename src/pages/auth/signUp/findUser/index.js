import React, {useState} from "react";
import Styles from "../../Auth.style";
import {ViewContainer, Container} from "../../../../containers";
import {useDispatch, useSelector} from "react-redux";
import CForm from "./Form";
import {openDialScreen, setHours} from "../../../../utils/methods";
import {FIND_USER_SEGMENT, ROUTES_AGAINST_STATUS, SIGN_UP_CONSTANT} from "../helper";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {userCardIdentification} from "../../../../store/actions/Auth.action";
import {View} from "react-native";
import {AlertView} from "../../../../uiComponents";
import Popup from "../../../../uiComponents/popup/Popup";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import PhonePrompt from "../phonePrompt";
import {_setDataToAsyncStorage} from "../../../../utils/asyncStorage/Functions";
import {DRAFT_SIGNUP_ID} from "../../../../utils/asyncStorage/Constants";

function CheckUser(props) {
    const { t, i18n } = useTranslation();
    const {route: {params: data}} = props;

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.userCardIdentificationLoading,
            currentCountry: global.currentCountry,
        }
    });

    const { loading } = reduxState;

    const [statusObj, updateStatusObj] = useState(null);

    const userCardIdentificationCallBack = async (res, payload) => {
        if(res?.error){
            let data = {
                ...res?.data,
                payload
            }
            if(!res?.data?.status){
                Popup.show({
                    showClose: false,
                    isVisible: true,
                    type: 'Error',
                    title: data?.message || t('POPUPS.ERROR.TITLE'),
                    text: t('ADVANCE_SALARY.REQUEST_FAIL_MESSAGE'),
                    actions: [
                        {
                            text: t('GLOBAL.CLOSE'),
                            callback: () => {
                                resetState();
                                Popup.hide()
                            }
                        },
                        {
                            text: t('GLOBAL.CONTACT_US'),
                            callback: () => contactUs()
                        }
                    ]
                })
            } else if(res?.data?.status === SIGN_UP_CONSTANT.NOT_FOUND._id || res?.data?.status === SIGN_UP_CONSTANT.EXISTS_IN_CORE_BUT_NOT_MOBILE._id || res?.data?.status === SIGN_UP_CONSTANT.EXISTS_IN_MOBILE_BUT_NOT_CORE._id){
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
                                data={data}
                                callBack={() => {
                                    resetState();
                                    Popup.hide();
                                }}
                            />
                        )
                    }
                })
            } else {
                updateStatusObj(data);
            }
        } else {
            let routeName = ROUTES_AGAINST_STATUS[res?.data?.status]?.routeName || 'kyc'
            if(res?.data?.userId && Object.keys(res?.data?.userId).length){
                await _setDataToAsyncStorage(DRAFT_SIGNUP_ID, JSON.stringify(res?.data?.userId));
            }
            navigation.navigate(routeName, {
                token: res?.data?.token
            });
        }
    }

    const resetState = () => {
        updateStatusObj(null);
    }

    const next = (values) => {
        resetState();
        let payload = {
            type: values.type,
            referralCode:values.referralCode,
            ...(data?.journeyBegin && {journeyBegin: data?.journeyBegin})
        }
        if(payload.type === FIND_USER_SEGMENT[0]._id) {
            payload.walletID = values.walletID;
        } else {
            payload.cardNo = values.cardNo;
            payload.cardExpiry = setHours(values.cardExpiry, 'to')
        }
        console.log(payload)
        dispatch(userCardIdentification(payload, userCardIdentificationCallBack))
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
        isLanguageChange: true
    };

    const contactUs = () => {
        resetState();
        Popup.hide();
        openDialScreen();
    };

    const renderPrompt = (obj) => {
       console.log(obj)
        switch (obj?.status) {
            case SIGN_UP_CONSTANT.USER_EXISTS._id:
                return (
                    <View>
                        <AlertView
                            showIcon={true}
                            // text={obj?.message}
                            text={t('SIGN_UP.ACCOUNT_ALREADY_EXISTS')}
                            viewContentStyle={{
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                            textStyle={{
                                marginBottom: 10
                            }}
                            buttonProps={{
                                title: t('FORGOT_PASSWORD.TITLE'),
                                onPress: () => {
                                    navigation.navigate('forgotPassword')
                                }
                            }}
                        />
                    </View>
                )
            default:
                return null
        }
    }

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <CForm
                    submit={next}
                    loading={loading}
                    onChangeDetection={() => {
                        updateStatusObj(null)
                    }}
                    loginRoute={() =>  navigation.navigate('login')}
                    renderPrompt={() => renderPrompt(statusObj)}
                />
            </ViewContainer>
        </Container>
    )
}
export default CheckUser;
