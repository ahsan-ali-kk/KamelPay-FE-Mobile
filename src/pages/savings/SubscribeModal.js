import React, {useEffect, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {CButton, CheckBox, CText, ProgressiveImage, CModal} from "../../uiComponents";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import Style from "./Savings.style";
import {useDispatch, useSelector} from "react-redux";
import {sendOtp, viewTermsAndConditions} from "../../store/actions/Global.action";
import {subscriptionCreate, toggleSubscriptionModal} from "../../store/actions/Savings.action";
import Popup from "../../uiComponents/popup/Popup";
import {useNavigation} from "@react-navigation/native";
import {openDialScreen} from "../../utils/methods";
import {checkUserAndCardStatus} from "../home/Home";

function SubscribeModal(props) {

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [termsAndCondition, updateTermsAndCondition] = useState(false);

    const reduxState = useSelector(({global, savings}) => {
        return {
            toggleSubscription: savings.toggleSubscription,
            loading: savings.subscriptionCreateLoading || global.sendOtpLoading,
            savingsStatus: savings.savingsStatus,
            populars: global.populars,
            card: global.selectedCard,
        }
    });


    useEffect(() => {
        if(reduxState?.toggleSubscription?.otp_verified) {
            subscriptionCreateFunc()
        }
    }, [reduxState?.toggleSubscription]);

    const onClose = () => {
        dispatch(toggleSubscriptionModal({
            isOpen: false,
            otp_verified: false,
        }))
    };

    const viewTermAndConditions = () => {
        dispatch(toggleSubscriptionModal({
            isOpen: false,
            otp_verified: reduxState?.toggleSubscription?.otp_verified || false,
        }));
        setTimeout(() => {
            dispatch(viewTermsAndConditions({
                isOpen: true,
                type: 'SAVINGS_SUBSCRIPTION_TERMS_AND_CONDITION',
            }))
        }, 100)
    };

    const subscribe = () => {
        checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
            if(type === 'FUNCTION') {
                dispatch(sendOtp({}, res => sendOtpCallBack(res)))
            }
        }, {
            isShowPopup: true
        });
    };

    const sendOtpCallBack = (res) => {
        dispatch(toggleSubscriptionModal({
            isOpen: false,
            otp_verified: false,
        }));
        setTimeout(() => {
            navigation.navigate('savings_otp', {
                ...res,
                callAgain: 'toggle_subscription_modal'
            })
        }, 100)
    };

    const subscriptionCreateFunc = () => {
        if(reduxState?.savingsStatus?.subscriptionId) {
            let payload = {
                subscription: reduxState?.savingsStatus?.subscriptionId,
                card: reduxState?.card?._id
            };
            dispatch(subscriptionCreate(payload, subscriptionCreateCallBack))
        }
    };

    const subscriptionCreateCallBack = (res) => {
        dispatch(toggleSubscriptionModal({ isOpen: false, otp_verified: false }));
       setTimeout(() => {
           if(res?.error){
               Popup.show({
                   isVisible: true,
                   type: 'Error',
                   title: t('GLOBAL.ERROR'),
                   text: res?.data?.message,
                   actions: [
                       {
                           text: t('GLOBAL.TRY_AGAIN'),
                           callback: () => Popup.hide()
                       },
                       {
                           text: t('GLOBAL.CONTACT_US'),
                           callback: () => {
                               Popup.hide();
                               openDialScreen();
                           }
                       }
                   ]
               })
           } else {
               Popup.show({
                   isVisible: true,
                   type: 'Success',
                   title: t('GLOBAL.SUCCESS'),
                   text: res?.data?.message,
                   actions: [
                       {
                           text: t('GLOBAL.OK'),
                           callback: () => Popup.hide()
                       }
                   ]
               })
           }
       }, 100)
    };

    return (
        <CModal centerView={true} isOpen={reduxState?.toggleSubscription?.isOpen} close={() => onClose()}>
            <View style={GlobalStyle.centerModalCenterViewContainer}>

                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => onClose()}>
                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                </TouchableOpacity>

                <View style={[GlobalStyle.centerModalCenterVectorContainer]}>
                    <View style={Style.modalVectorContainer}>
                        <ProgressiveImage
                            style={[GlobalStyle.centerModalCenterVector, Style.modalVector]}
                            source={require('../../assets/images/gift-promo.png')}/>
                    </View>
                </View>


                <View style={GlobalStyle.centerModalLogoKSContainer}>
                    <ProgressiveImage
                        style={GlobalStyle.centerModalLogoKS}
                        resizeMode='contain'
                        source={require('../../assets/images/KS_Blue.png')}/>
                </View>
                {/*<CText style={[GlobalStyle.centerModalCenterViewTitle, Style.modalTitle]}>*/}
                {/*    KAMEL SAVINGS*/}
                {/*</CText>*/}

                <View style={GlobalStyle.centerModalCenterViewBody}>
                    <CText style={[GlobalStyle.centerModalCenterViewSubTitle, Style.modalSubText]}>
                        Get our monthly SAVINGS subscription and avail discounts up to 50% off across 1000+ restaurants and pharmacies in the UAE
                    </CText>
                    <CText style={[GlobalStyle.centerModalCenterViewSubTitle, Style.modalSubText]}>
                        Simple visit any SAVINGS listed restaurant or pharmacy, scan your QR code & redeem exclusive discounts.
                    </CText>
                </View>

                <CheckBox
                    value={termsAndCondition}
                    onChange={() => {updateTermsAndCondition(!termsAndCondition)}}
                    title={t('GLOBAL.AGREE')}
                    clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                    clickAbleTextFunc={() => viewTermAndConditions()}
                />
                <CButton buttonStyle={Style.bottomButton}
                         disabled={!termsAndCondition}
                         loading={reduxState?.loading}
                         onPress={() => subscribe()}
                         title={'Subscribe'}/>

                <CText style={Style.rates}>*AED 3 + VAT monthly subscription fee after 30 days to apply. Unsubscribe anytime</CText>

            </View>
        </CModal>
    )
}

export default React.memo(SubscribeModal)
