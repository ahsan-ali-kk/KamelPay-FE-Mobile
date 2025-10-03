import React, {Fragment, useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, RefreshControl} from 'react-native';
import {Container} from "../../containers";
import Styles from "./Home.style";
import {getCardById, getProfile, newDeviceRegister, newValidateUser, updateUserType,
} from "../../store/actions/Auth.action";
import {useDispatch, useSelector} from "react-redux";
import {
    checkCentiV,
    checkIsAppUserOrRegisterDevice,
    formatAmount,
    getAdvanceFees,
    getEligibleAdvanceAmount,
    getEligiblePersonalLoanAmount,
    getPersonalLoanFees,
    isLightUser,
    isMinimalUser,
    isShowUpdateOrBlockAppEmiratesIdAlert,
    MappedElement,
    SERVICES,
    truncateAmount
} from "../../utils/methods";
import {CLoading, ProgressiveImage, CButton, CText, IconButton, AlertView} from "../../uiComponents";
import {
    getMasterDetail,
    getNationalityCountry,
    getPopularsData,
    preserveNotification,
    updateCard
} from "../../store/actions/Global.action";
import Popup from "../../uiComponents/popup/Popup";
import CardSelection from "./cardSelection/CardSelection";
import CardLastDigit, {CardLastDigitForm} from "./cardLastDigit/CardLastDigit";
import SendMoneySection from "./SendMoneySection";
import RecentTransactionsSection from "./RecentTransactionsSection";
import {cardIsActivatedStatus, cardNormalStatus, getCardIsActivatedOrStatus} from "../../uiComponents/creditCardUi/CreditCardUi";
import {useTranslation} from "react-i18next";
import Uqudo, {KYC_VENDORS, TOKEN_TYPE_CONSTANTS} from "./UpdateEmiratesID";
import _ from "lodash";
import moment from "moment";
import Promotions from "./promotions/Promotions";
import {
    checkAdvanceSalaryEligibility,
    clearAdvanceSalaryEligibility,
    getPromoAndOffer
} from "../../store/actions/AdvanceSalary.action";
import {checkBNPLEligibility, clearBNPLEligibility} from "../../store/actions/Bnpl.action";
import {getPointsStats} from "../../store/actions/Points.action";
import DontHaveAnEmiratesId from "../../containers/dontHaveAnEmiratesId";
import {store} from '../../store';
import LivenessDetection from "../../containers/livenessDetection";
import AddNewCardView from "../cardManagement/addCard/AddNewCardView";
import UpdateEmiratesIDController from './UpdateEmiratesIDController';
import Alternate from "./alternateVerify/AlternateVerify";
import {
    checkPersonalLoanEligibility,
    clearPersonalLoanEligibility,
    getPersonalLoanPromoAndOffer
} from "../../store/actions/PersonalLoan.action";
import Feather from 'react-native-vector-icons/Feather'
import {checkCreditPayEligibility, clearCreditPayEligibility} from "../../store/actions/CreditPay.action";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import { checkKPWalletTransferEligibility, clearKPWalletTransferEligibility } from '../../store/actions/KPWalletTransfer.action';
import {navigationRef} from "../../routing/Ref";
import PassportController from "../../containers/passportScanner/Controller";
import {errorPopup, IDENTIFICATION_TYPE} from "../auth/signUp/helper";
import PassportScanner from "../../containers/passportScanner";

export const USER_TYPES = {
    LIGHT_USER: {
        _id: 'LIGHT_USER'
    },
    MINIMAL_USER: {
        _id: 'MINIMAL_USER'
    }
}

export const blockRouteForCentiv = ['Send_Money', 'Advance_Salary', 'Personal_Loan'];
export const checkCardStatus = (t, card, callBack, isShowPopup = true) => {
    if(card && Object.keys(card)?.length && getCardIsActivatedOrStatus(card, true)?.id === cardNormalStatus[0]) {
        callBack({type:"CARD_ACTIVE"})
    } else {
        callBack({type:"CARD_BLOCKED"});
        if(isShowPopup) {
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'Error',
                title: t('POPUPS.TEMP_BLOCK.TITLE'),
                text: t('POPUPS.TEMP_BLOCK.SUB_TITLE'),
                actions: [
                    {
                        text: t('GLOBAL.CANCEL'),
                        callback: () => Popup.hide()
                    },
                ]
            })
        }
    }
};

export const userVerificationPopup = (t, type) => {
    if(type === USER_TYPES.MINIMAL_USER._id){
        Popup.show({
            isVisible: true,
            styleMainContainer: GlobalStyle.paddingHorizontal_0,
            styleContainer: GlobalStyle.bottomHalfModal,
            viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
            buttonContainerStyle: GlobalStyle.shortInfoModalButtons,
            buttonLastType: 'fill',
            type: 'customView',
            showClose: true,
            edges: ['top', 'left', 'right'],
            customView: () => {
                return (
                    <View style={GlobalStyle.shortInfoModalContainer}>
                        <CText style={GlobalStyle.shortInfoModalTitle}>
                            {t('POPUPS.VERIFY_YOUR_IDENTITY.TITLE')}
                        </CText>
                        <CText style={GlobalStyle.shortInfoModalText}>
                            {t('POPUPS.VERIFY_YOUR_IDENTITY.SUB_TITLE')}
                        </CText>
                    </View>
                )
            },
            actions: [
                {
                    children: (
                        <View style={Styles.homeListItemContainer}>
                            <TouchableOpacity onPress={() => {
                                Popup.hide();
                                UpdateEmiratesIDController?.run({
                                    type: type === USER_TYPES.LIGHT_USER._id ? 'LIGHT_USER_VERIFICATION' : 'MINIMAL_USER_VERIFICATION'
                                });
                            }}
                                              style={Styles.homeListItem}>

                                <View style={Styles.homeListItemImageContainer}>
                                    <ProgressiveImage
                                        resizeMode="contain"
                                        source={require('../../assets/images/3d-vector/id-card.png')}
                                        style={Styles.homeListItemImage}/>
                                </View>
                                <View style={Styles.homeListItemContent}>
                                    <CText numberOfLines={2} style={Styles.homeListItemText}>{t('SIGN_UP.EMIRATES_ID')}</CText>
                                </View>

                            </TouchableOpacity>
                        </View>
                    )
                },
                {
                    children: (
                        <View style={Styles.homeListItemContainer}>
                            <TouchableOpacity onPress={() => {
                                Popup.hide();
                                PassportController?.run({
                                    type: 'MINIMAL_USER_VERIFICATION',
                                    vendor: KYC_VENDORS.ONE_KYC,
                                });
                            }}
                                              style={Styles.homeListItem}>

                                <View style={Styles.homeListItemImageContainer}>
                                    <ProgressiveImage
                                        resizeMode="contain"
                                        source={require('../../assets/images/3d-vector/passport.png')}
                                        style={Styles.homeListItemImage}/>
                                </View>
                                <View style={Styles.homeListItemContent}>
                                    <CText numberOfLines={2} style={Styles.homeListItemText}>{t('SIGN_UP.PASSPORT')}</CText>
                                </View>

                            </TouchableOpacity>
                        </View>
                    )
                },
            ]
        })
    } else {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Warning',
            title: t('USER_NOT_VERIFIED.TITLE'),
            text: t('USER_NOT_VERIFIED.SUB_TITLE'),
            actions: [
                {
                    text: t('GLOBAL.VERIFY'),
                    callback: () => {
                        Popup.hide();
                        UpdateEmiratesIDController?.run({
                            type: type === USER_TYPES.LIGHT_USER._id ? 'LIGHT_USER_VERIFICATION' : 'MINIMAL_USER_VERIFICATION'
                        });
                        // callBack && callBack({type: 'USER_VERIFICATION'})
                    }
                },
                {
                    text: t('GLOBAL.CANCEL'),
                    callback: () => Popup.hide()
                },
            ]
        })
    }
}

export const checkUserAndCardStatus = (t, card, callBack, options = {}) => {
    const {auth} = store.getState();
    const {user} = auth;

    const routeAndFunction = (data) => {
        if(data?.routeName) {
            if(blockRouteForCentiv.includes(data?.routeName) && checkCentiV(card, 'EQUAL', 'CENTIV')){
                remitBlockPopup(t, data?.routeName);
                callBack && callBack({type: 'BLOCKED'});
            } else {
                callBack && callBack({type: 'NAVIGATE'});
            }
        } else {
            callBack && callBack({type: 'FUNCTION'});
        }
    };

    return isLightUser(user,
        () => {
            if(options?.isShowPopup){
                userVerificationPopup(t, USER_TYPES.LIGHT_USER._id)
            }
            callBack && callBack({type: USER_TYPES.LIGHT_USER._id})
        },
        () => {
            isMinimalUser(user,
                () => {
                    if(options?.isShowPopup){
                        userVerificationPopup(t, USER_TYPES.MINIMAL_USER._id)
                    }
                    callBack && callBack({type: USER_TYPES.MINIMAL_USER._id})
                },
                () => {
                    if(options?.notCheckCardStatus){
                        routeAndFunction(options)
                    } else {
                        checkCardStatus(t, card, ({type}) => {
                            if(type === "CARD_BLOCKED"){
                                callBack && callBack({type: 'BLOCKED'});
                            } else {
                                routeAndFunction(options)
                            }

                        }, options?.isShowPopup)
                    }
                },
                )
        },
    );
};
export const renderYourCardIsOnItsWay  = (t, selectedCard, loading = false) => {
    if(selectedCard && Object.keys(selectedCard)?.length && getCardIsActivatedOrStatus(selectedCard)?.id === cardIsActivatedStatus[0]) {
        return loading ? <CLoading loading={true} showAnimation={true}/> : (
            <View style={[Styles.completeVerificationContainer]}>
                <CText style={Styles.completeVerificationContainerTitle}>
                    {t('CARD_IS_ON_ITS_WAY.TITLE')}
                </CText>
                <CText style={[Styles.completeVerificationContainerSubTitle, {marginBottom:0}]}>
                    {t('CARD_IS_ON_ITS_WAY.SUB_TITLE')}
                </CText>
            </View>
        )
    }
    return null
};
export const yourEmiratesIDExpire  = (t, updateFunc, buttonText = "GLOBAL.UPDATE", loading) => {
    return (
        <View style={[Styles.completeVerificationContainer]}>
            <ProgressiveImage
                resizeMode="contain"
                source={require('../../assets/images/update-emirates-id-vector.png')}
                style={Styles.completeVerificationContainerVector}/>
            <CText style={Styles.completeVerificationContainerTitle}>
                {t('POPUPS.EXPIRED_EMIRATES_ID.TITLE')}
            </CText>
            <CText style={Styles.completeVerificationContainerSubTitle}>
                {/*Please update your Emirates ID to verify your identity with NaqaD*/}
                {t('POPUPS.EXPIRED_EMIRATES_ID.THIRD_TITLE')}
            </CText>
            <CButton
                title={t(buttonText)}
                type="outline"
                buttonStyle={{minWidth: 200}}
                loading={loading}
                disabled={loading}
                onPress={() => updateFunc && updateFunc()}
            />
        </View>
    )
};
export const remitBlockPopup = (t, routeName) => {
    Popup.show({
        isVisible: true,
        type: 'Error',
        imageSize: 'normal',
        title: `${_.startCase(routeName)} ${t('POPUPS.ROUTE_BLOCK.TITLE')}`,
        text: t('POPUPS.ROUTE_BLOCK.SUB_TITLE'),
        actions: [
            {
                text: t('GLOBAL.OK'),
                callback: () => Popup.hide()
            },
        ]
    })
};

export const checkServices = (card, data) => {
    let cardServices = card?.services;
    return (cardServices?.length && data?.length) ? data.every(val => cardServices.includes(val)) : false
};
export const renderRemittanceCounter = (obj, style) => {
    const {count, countNumber, offer} = obj;
    let length = countNumber;
    let lengthCounter = Array.from( {length}, () => ({}));
    let remainingRemittanceCount = (length - count);
    let active = require('../../assets/images/snpl.png');
    let inActive = require('../../assets/images/in-active-snpl.png');
    return offer?.length ? (
        <View style={[Styles.keyFeatureItemCounterContainer, style?.container]}>
            <CText style={[Styles.keyFeatureItemCounterText, {
                marginTop: 10
            }, style?.textStyle, style?.offerTextStyle]}>
                {offer}
            </CText>
        </View>
        ) : count >= 1 ? (
        <View style={[Styles.keyFeatureItemCounterContainer, style?.container]}>
            <View style={[Styles.keyFeatureItemCounterInnerContainer, style?.innerContainer]}>
                <MappedElement
                    data={lengthCounter}
                    renderElement={(item, i) => {
                        return (
                            <View key={i} style={[Styles.keyFeatureItemCounterImageContainer, style?.iconItemStyle]}>
                                <ProgressiveImage
                                    resizeMode={'contain'}
                                    style={[Styles.keyFeatureItemCounterImage, style?.iconStyle]}
                                    source={count >= (i+1) ? active : inActive}
                                />
                            </View>
                        )
                    }}
                />
            </View>
            <CText style={[Styles.keyFeatureItemCounterText, style?.textStyle]}>
                {`Do ${remainingRemittanceCount} more transaction${(remainingRemittanceCount) > 1 ? '(s)' : ''} to SEND MONEY HOME for FREE`}
            </CText>
        </View>
    ) : null
};

export const checkCardIsActive = (card) => {
    return card && getCardIsActivatedOrStatus(card)?.id === cardIsActivatedStatus[2]
};

function Home(props) {

    const {navigation} = props;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const uqudoFlowRef = useRef();
    const passportScannerRef = useRef();
    const alternateRef = useRef();
    const dontHaveAnEmiratesIdRef = useRef();
    const livenessDetectionFlowRef = useRef();

    const reduxState = useSelector(({auth, global, advanceSalary, bnpl, personalLoan, creditPay, kpWalletTransfer}) => {
        return {
            masterDetails: global.masterDetails,
            getMasterDetailLoading: global.getMasterDetailLoading,
            activeCardIndex: global.activeCardIndex,
            card: global.selectedCard,
            populars: global.populars,
            isDashboardReady: global.isDashboardReady,
            popularsLoading: global.popularsLoading,
            preserveNotification: global.preserveNotification,

            user: auth.user,
            getCardByIdLoading: auth.getCardByIdLoading,
            verificationLoading: auth.getOcrTokenLoading || auth.newUserValidateLoading,
            toggleBiometricModalIsOpen: auth.toggleBiometricModalIsOpen,
            getOcrTokenLoading: auth.getOcrTokenLoading,
            mainLoading: auth.updateEmiratesIDLoading,
            inquiryBalanceLoading: auth.inquiryBalanceLoading,
            newDeviceRegisterLoading: auth.newDeviceRegisterLoading,
            loading: auth.getOcrTokenLoading,

            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility,
            checkAdvanceSalaryEligibilityLoading: advanceSalary.checkAdvanceSalaryEligibilityLoading,
            advanceSalaryPromoCodeAndOffer: advanceSalary?.promoCodeAndOffer,

            creditPayEligibility: creditPay.creditPayEligibility,
            checkCreditPayEligibilityLoading: creditPay.checkCreditPayEligibilityLoading,

            bnplEligibility: bnpl.bnplEligibility,
            checkBnplEligibilityLoading: bnpl.checkBnplEligibilityLoading,

            personalLoanEligibility: personalLoan.personalLoanEligibility,
            checkPersonalLoanEligibilityLoading: personalLoan.checkPersonalLoanEligibilityLoading,
            personalLoanPromoCodeAndOfferLoading: personalLoan.getPersonalLoanPromoCodeAndOfferLoading,
            personalLoanPromoCodeAndOffer: personalLoan.personalLoanPromoCodeAndOffer,

            kpWalletTransferEligibility: kpWalletTransfer.eligibility,
            checkKpWalletTransferEligibilityLoading: kpWalletTransfer.checkEligibilityLoading,

            detectImagePassportLoading: auth.detectImagePassportLoading,

            updateUserTypeLoading: auth.updateUserTypeLoading,
        }
    });

    const {advanceSalaryDetails, populars, advanceSalaryPromoCodeAndOffer, bnplEligibility, checkBnplEligibilityLoading,
        checkAdvanceSalaryEligibilityLoading, inquiryBalanceLoading, masterDetails,
        personalLoanEligibility, checkPersonalLoanEligibilityLoading, personalLoanPromoCodeAndOffer, getCardByIdLoading,
        creditPayEligibility, checkCreditPayEligibilityLoading, kpWalletTransferEligibility, checkKpWalletTransferEligibilityLoading,
        detectImagePassportLoading, updateUserTypeLoading} = reduxState;

    let expiryEmiratesID = reduxState?.user?.expiryDate;

    const [selectedCard, updateSelectedCard] = useState();
    const [sliderIndex, updateSliderIndex] = useState(null);
    const [cardLastDigitModalIsOpen, updateCardLastDigitModalIsOpen] = useState(false);
    const [cardNo, updateCardNo] = useState('');
    const [cardExpiry, updateCardExpiry] = useState(null);
    const [uqudoToken, updateUqudoToken] = useState('');
    const [ocrVendor, updateOcrVendor] = useState('');

    const didConsume = useRef(false);

    useEffect(() => {
        let currentScreenNameToRef = navigationRef?.getCurrentRoute()?.name?.toUpperCase();
        let screenName = props?.route?.name?.toUpperCase() || '';
        let hasPreserveNotification = !!reduxState?.preserveNotification;
        let hasNotOpenBiometricModal =  !reduxState?.toggleBiometricModalIsOpen;
        let isDashboardReady = reduxState?.isDashboardReady
        if(hasPreserveNotification && hasNotOpenBiometricModal && isDashboardReady && screenName === currentScreenNameToRef){
            if (didConsume.current) return;
                didConsume.current = true;
                setTimeout(() => {
                    let notification = {...reduxState?.preserveNotification};
                    if(notification?.data?.actions === 'APPROVAL') {
                        navigation.navigate('notificationsApproval', notification)
                    } else if(notification?.data?.actions === 'ROUTE') {
                        navigation.navigate(notification?.routeName, notification?.data?.otherOptions)
                    }
                }, 1000)
                dispatch(preserveNotification(null))
                didConsume.current = false;
        }
    }, [reduxState?.toggleBiometricModalIsOpen, reduxState?.isDashboardReady, reduxState?.preserveNotification]);

    //Get user nationality country and master detail
    useEffect(() => {
        dispatch(getNationalityCountry());
        dispatch(getMasterDetail());
    }, []);

    //Check user is not light user then get promo and offer for advance salary
    useEffect(() => {
        checkUserAndCardStatus(t, selectedCard,
            ({type}) => {
                if(type === 'FUNCTION') {
                        if (checkServices(selectedCard, [SERVICES.ADVANCE_SALARY._id]) && advanceSalaryDetails?.isEligible && selectedCard?.walletID) {
                        let advanceSalaryAmount = getEligibleAdvanceAmount(advanceSalaryDetails);
                        let feesObj = getAdvanceFees(advanceSalaryDetails?.feesBrackets, advanceSalaryAmount);
                        let totalFees = Number(feesObj?.fees || 0) + Number(feesObj?.platformFee || 0);
                        let payload = {
                            amount: advanceSalaryAmount,
                            totalFee: totalFees,
                            walletID: selectedCard?.walletID,
                            transactionType: SERVICES?.ADVANCE_SALARY?._id
                        };
                        dispatch(getPromoAndOffer(payload));
                    }
                }
        }, {
                isShowPopup: false
        });
    }, [advanceSalaryDetails, selectedCard]);

    //Check user is not light user then get promo and offer for personal finance
    useEffect(() => {
        checkUserAndCardStatus(t, selectedCard,
            ({type}) => {
                if(type === 'FUNCTION') {
                    if (checkServices(selectedCard, [SERVICES.PERSONAL_LOAN._id]) && personalLoanEligibility?.isEligible && selectedCard?.walletID) {
                        let personalLoanAmount = getEligiblePersonalLoanAmount(personalLoanEligibility);
                        let feesObj = getPersonalLoanFees(personalLoanEligibility?.feeBrackets, personalLoanAmount);
                        let totalFees = Number(feesObj?.ProcessingFeesOneTime || 0) + Number(feesObj?.PlatformFee || 0);
                        let payload = {
                            amount: personalLoanAmount,
                            totalFee: totalFees,
                            walletID: selectedCard?.walletID,
                            transactionType: "PERSONAL_LOAN"
                        };
                        dispatch(getPersonalLoanPromoAndOffer(payload));
                    }
                }
            }, {
                isShowPopup: false
            });
    }, [personalLoanEligibility, selectedCard]);

    //Navigation listener add or remove
    //Set selected card and index into state
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if(selectedCard && reduxState?.card?._id !==  selectedCard?._id){
                updateSliderIndex(reduxState?.activeCardIndex);
                updateSelectedCard(reduxState?.card)
            }
        });
        return unsubscribe;
    }, [navigation, reduxState?.card]);

    //Check new device detected and is app user otherwise
    //If user status is ACTIVE then get data against active card
    //Or check user emirates id has expired then show popup to update emirates id
    useEffect(() => {
        checkIsAppUserOrRegisterDevice(
            reduxState?.user,
            () => {
                if(reduxState?.user?.status === 'ACTIVE'){
                    let activeCardIndex = sliderIndex !== reduxState?.activeCardIndex ? 0 : sliderIndex;
                    onChangeCard(activeCardIndex);
                    if(expiryEmiratesID) {
                        if(!reduxState?.toggleBiometricModalIsOpen && isShowUpdateOrBlockAppEmiratesIdAlert(expiryEmiratesID)?.showPopup) {
                            // setTimeout(() => {
                            //     uqudoFlowRef?.current?.run({
                            //         type: "UPDATE_EMIRATES_ID"
                            //     })
                            // }, 1000)
                            uqudoFlowRef?.current?.run({
                                type: "UPDATE_EMIRATES_ID"
                            })
                        }
                    }
                }
            }
        );
    }, [selectedCard]);

    const navigate = (routeName, otherOptions = null) => {
        checkUserAndCardStatus(t, selectedCard, ({type}) => {
            if(type === 'NAVIGATE') {
                if(otherOptions) {
                    navigation.navigate(routeName, otherOptions ? otherOptions : {})
                } else {
                    navigation.navigate(routeName)
                }
            }
        }, {routeName, isShowPopup: true});
    };

    const onSelectCard = () => {
        navigation.navigate('Card_Management')
    };

    //check forcefully conditionally credit pay status and generate display item information
    const checkForcefullyCreditPayStatus = (card, isForcefully, CB) => {
        if(checkServices(reduxState?.card, [SERVICES.EMBEDDED_FINANCE._id]) && card?._id){
            let payload = {
                "cardId": card?._id,
                ...(isForcefully && {
                    force: true
                })
            };
            dispatch(checkCreditPayEligibility(payload, CB));
        }
    };
    const selectCreditPay = (obj) => {
        Popup.show({
            isVisible: true,
            styleMainContainer: GlobalStyle.paddingHorizontal_0,
            styleContainer: GlobalStyle.bottomHalfModal,
            viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
            buttonContainerStyle: GlobalStyle.shortInfoModalButtons,
            buttonLastType: 'fill',
            type: 'customView',
            showClose: true,
            edges: ['top', 'left', 'right'],
            customView: () => {
                return (
                    <View style={GlobalStyle.shortInfoModalContainer}>
                        <CText style={GlobalStyle.shortInfoModalTitle}>
                            {t('CREDIT_PAY.CREDIT_PAY_TITLE')}
                        </CText>
                        <CText style={GlobalStyle.shortInfoModalText}>
                            {t('CREDIT_PAY.CREDIT_PAY_SUB_TITLE')}
                        </CText>
                    </View>
                )
            },
            actions: [
                {
                    text: "t('HOME.LABEL_TWO')",
                    children: renderHomeOptionItems({
                        name: t('HOME.LABEL_TWO'),
                        route: 'Pay_Bill',
                        otherOption: {
                            screen: 'pay_bill',
                            params: {
                                moduleType: SERVICES.EMBEDDED_FINANCE._id,
                                creditPayEligibility
                            },
                            initial: false,
                        },
                        image: require('../../assets/images/3d-vector/pay-bills.png'),
                        imageSize: {
                            width: 100,
                            height: 70,
                        },
                        style: { marginTop: 0 },
                        closeCallback: () => Popup.hide()
                    })
                },
                {
                    text: t('HOME.LABEL_ONE'),
                    children: renderHomeOptionItems({
                        name: t('HOME.LABEL_ONE'),
                        route: 'Mobile_TopUp',
                        otherOption: {
                            screen: 'mobile_topup',
                            params: {
                                moduleType: SERVICES.EMBEDDED_FINANCE._id,
                                creditPayEligibility
                            },
                            initial: false,
                        },
                        image: require('../../assets/images/3d-vector/topup.png'),
                        imageSize: {
                            width: 100,
                            height: 60,
                        },
                        style: { marginTop: 0 },
                        closeCallback: () => Popup.hide()
                    }),
                },
            ]
        })
    };

    const creditPayStatusCallBackToNavigate = (res) => {
       if(res?.isEligible){
           selectCreditPay(res)
       }

    };
    const getCreditPayDetails = (status, obj) => {
        if(status) {
            if((status === 'BLOCKED') || (status === USER_TYPES.LIGHT_USER._id) || (status === USER_TYPES.MINIMAL_USER._id)){
                return {
                    badge: t('GLOBAL.APPLY_NOW'),
                    onPress: () => {},
                    buttonText: t("HOME.MAIN_OPTION_FOURTEEN.BUTTON"),
                    subTitle: status === 'BLOCKED' ? t("CREDIT_PAY.TO_APPLY_CREDIT_PAY_ACTIVATE_YOUR_CARD") : t("CREDIT_PAY.TO_APPLY_CREDIT_PAY_PLEASE_UPDATE_EMIRATES_ID")
                }
            } else {
                if(obj?.isEligible) {
                    return {
                        badge: t('GLOBAL.NEW'),
                        subTitle: t("CREDIT_PAY.CREDIT_PAY_SUB_TITLE"),
                        buttonText: t("HOME.MAIN_OPTION_FOURTEEN.BUTTON"),
                        onPress: () => checkForcefullyCreditPayStatus(reduxState?.card, true, creditPayStatusCallBackToNavigate),
                    };
                } else {
                    return {
                        badge: t('GLOBAL.NEW'),
                        subTitle: obj?.notEligibleReason || t("CREDIT_PAY.NOT_ELIGIBLE_TEXT"),
                        buttonText: t("HOME.MAIN_OPTION_FOURTEEN.BUTTON_TWO"),
                        onPress: () => checkForcefullyCreditPayStatus(reduxState?.card, true, creditPayStatusCallBackToNavigate),
                    };
                }
            }
        }
    };

    //check forcefully conditionally advance salary status and generate display item information
    const checkForcefullyAdvanceSalaryStatus = (card, isForcefully, CB) => {
        if(checkServices(reduxState?.card, [SERVICES.ADVANCE_SALARY._id]) && card?._id){
            let payload = {
                "cardId": card?._id,
                ...(isForcefully && {
                    force: true
                })
            };
            dispatch(checkAdvanceSalaryEligibility(payload, CB));
        }
    };
    const advanceSalaryStatusCallBackToShowPopup = (res) => {
        if(res?.status === '01'){
            let info = getAdvanceSalaryDetails(res);
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'image',
                source: require('../../assets/images/3d-vector/advance-salary.png'),
                title: info?.subTitle,
                ...(info?.thirdTitle && {
                    subText: info?.thirdTitle
                }),
                actions: [
                    {
                        text: t('GLOBAL.APPLY_NOW'),
                        callback: () => {
                            navigate('Advance_Salary');
                            Popup.hide();
                        }
                    },
                    {
                        text: t('GLOBAL.CANCEL'),
                        callback: () => Popup.hide()
                    }
                ]
            });
        }
    };
    const advanceSalaryStatusCallBackToNavigate = (res) => {
        if(res?.status === '01'){
            navigate('Advance_Salary')
        }
    };
    const getAdvanceSalaryDetails = (status, obj) => {
        if(status) {
            if((status === 'BLOCKED') || (status === USER_TYPES.LIGHT_USER._id) || (status === USER_TYPES.MINIMAL_USER._id)){
                return {
                    badge: t('GLOBAL.APPLY_NOW'),
                    disable: false,
                    subTitle: status === 'BLOCKED' ? t("ADVANCE_SALARY.TO_AN_ADVANCE_SALARY_ACTIVATE_YOUR_CARD") : t("ADVANCE_SALARY.TO_APPLY_ADVANCE_SALARY_PLEASE_UPDATE_EMIRATES_ID")
                }
            } else {
                switch (obj?.status) {
                    case "01":
                        return {
                            badge: t('GLOBAL.APPLY_NOW'),
                            subTitle: `${t('GLOBAL.APPLY_NOW_TEXT')} ${formatAmount(obj?.eligibleAdvanceAmount, 'AED')}.`,
                            ...(advanceSalaryPromoCodeAndOffer?.offerDetails?.title && {
                                thirdTitle: advanceSalaryPromoCodeAndOffer?.offerDetails?.title
                            })
                        };
                    case "02":
                        return {
                            subTitle: t('GLOBAL.ADV_NOT_ELIGIBLE_TEXT')
                        };
                    case "03":
                        return {
                            badge: t('GLOBAL.PROCESSING'),
                            bgColor: '#F59D1E',
                            darkBgColor: '#F59D1E',
                            subTitle: t('GLOBAL.PROCESSING_TEXT')
                        };
                    case "04":
                        return {
                            badge: t('GLOBAL.APPROVED'),
                            bgColor: '#42B658',
                            darkBgColor: '#42B658',
                            subTitle: `${t('GLOBAL.DUE_DATE')} ${moment(obj?.dueDate).format('DD/MM/YYYY')} ${t('GLOBAL.OR_NEXT_SALARY_DATE')}.`
                        };
                    case "05":
                        return {
                            subTitle: t('GLOBAL.ADV_NOT_ELIGIBLE_AND_REJECT_TEXT')
                        };
                    default:
                        return null;
                }
            }
        }
    };

    //check forcefully conditionally personal finance status and generate display item information
    const checkForcefullyPersonalLoanStatus = (card, isForcefully, CB) => {
        if(checkServices(reduxState?.card, [SERVICES.PERSONAL_LOAN._id]) && card?._id){
            let payload = {
                "cardId": card?._id,
                ...(isForcefully && {
                    force: true
                })
            };
            dispatch(checkPersonalLoanEligibility(payload, CB));
        }

    };
    const personalLoanStatusCallBackToNavigate = (res) => {
        if(res?.isEligible){
            navigate('Personal_Loan')
        }
    };

    function trimAfterAed(str) {
        const marker = "Finance";
        const idx = str.indexOf(marker);
        if (idx === -1) return str;
        return str.slice(0, idx + marker.length);
    }
    const getPersonalLoanDetails = (status, obj) => {
        if(status) {
            if((status === 'BLOCKED') || (status === USER_TYPES.LIGHT_USER._id) || (status === USER_TYPES.MINIMAL_USER._id)){
                return {
                    badge: t('GLOBAL.APPLY_NOW'),
                    buttonText:  t('GLOBAL.APPLY_NOW'),
                    disable: false,
                    subTitle: status === 'BLOCKED' ? t("PERSONAL_LOAN.TO_AN_PERSONAL_LOAN_ACTIVATE_YOUR_CARD") : t("PERSONAL_LOAN.TO_APPLY_PERSONAL_LOAN_PLEASE_UPDATE_EMIRATES_ID")
                }
            } else {
                if(obj?.isEligible || obj?.status){
                    return {
                        ...(obj?.isEligible ? {
                            badge: t('GLOBAL.APPLY_NOW'),
                            buttonText:  t('GLOBAL.APPLY_NOW'),
                            ...(personalLoanPromoCodeAndOffer?.offerDetails?.title && {
                                thirdTitle: personalLoanPromoCodeAndOffer?.offerDetails?.title
                            })
                        } : (obj?.status === 'Reject') ? {
                            // badge: t('GLOBAL.REJECT'),
                            // bgColor: '#FF6157',
                            darkBgColor: '#FF6157',
                            buttonText:  t('HOME.MAIN_OPTION_THIRTEEN.BUTTON_TWO'),
                        } : (obj?.status === 'Pending') ? {
                            badge: t('GLOBAL.PROCESSING'),
                            bgColor: '#F59D1E',
                            darkBgColor: '#F59D1E',
                            buttonText:  t('HOME.MAIN_OPTION_THIRTEEN.BUTTON_TWO'),
                        } : (obj?.status === 'SentToBank') || (obj?.status === 'Approve') || (obj?.status === 'Disbursed') ? {
                            badge: t('GLOBAL.APPROVED'),
                            bgColor: '#42B658',
                            darkBgColor: '#42B658',
                            buttonText:  t('HOME.MAIN_OPTION_THIRTEEN.BUTTON_TWO'),
                        } : {
                            buttonText:  t('HOME.MAIN_OPTION_THIRTEEN.BUTTON_TWO'),
                        }),
                        subTitle: obj?.message && obj?.isEligible ? trimAfterAed(obj?.message) : obj?.message,
                        onPress: () => checkForcefullyPersonalLoanStatus(reduxState?.card, true, personalLoanStatusCallBackToNavigate),
                    }
                } else {
                    return {
                        subTitle: t("PERSONAL_LOAN.PERSONAL_LOAN_NOT_ELIGIBLE_TEXT"),
                        buttonText:  t('HOME.MAIN_OPTION_THIRTEEN.BUTTON_TWO'),
                        onPress: () => checkForcefullyPersonalLoanStatus(reduxState?.card, true, personalLoanStatusCallBackToNavigate),
                    }
                }

            }
        }


    };

    //checkBNPLEligibility
    const checkForcefullyBNPLEligibility = (card) => {
        if(checkServices(reduxState?.card, [SERVICES.BNPL._id]) && card?._id){
            let payload = {
                "cardId": card?._id
            };
            dispatch(checkBNPLEligibility(payload));
        }
    };
    //generate display item information for BNPL
    const getBnplMessages = (status, obj, isEligible) => {
        if(status) {
            if ((status === 'BLOCKED') || (status === USER_TYPES.LIGHT_USER._id) || (status === USER_TYPES.MINIMAL_USER._id)) {
                return {
                    name: t('HOME.MAIN_OPTION_SIX.TITLE'),
                    badge: t('GLOBAL.APPLY_NOW'),
                    disable: false,
                    subTitle: status === 'BLOCKED' ? t("BNPL.TO_APPLY_BNPL_ACTIVATE_YOUR_CARD") : t("BNPL.TO_APPLY_BNPL_PLEASE_UPDATE_EMIRATES_ID")
                }
            } else {
                switch (isEligible) {
                    case true:
                        return {
                            name: t('HOME.MAIN_OPTION_SIX.TITLE'),
                            subTitle: obj?.message,
                            badge: t('HOME.MAIN_OPTION_SIX.BADGE')
                        }
                    default:
                        return {
                            name: t('HOME.MAIN_OPTION_SIX.TITLE'),
                            subTitle: obj?.message || t('BNPL.BNPL_NOT_ELIGIBLE_TEXT'),
                            badge: obj?.status || t('HOME.MAIN_OPTION_SIX.BADGE')
                        }
                }
            }
        }
    };

     //check forcefully conditionally kp wallet transfer status and generate display item information
    const checkForcefullyKpWalletTransferStatus = (card, isForcefully, CB) => {
        if(checkServices(reduxState?.card, [SERVICES.KP_WALLET_TRANSFER._id]) && card?._id){
            let payload = {
                "cardId": card?._id,
                ...(isForcefully && {
                    force: true
                })
            };
            dispatch(checkKPWalletTransferEligibility(payload, CB));
        }
    };

    const kpWalletTransferStatusCallBackToNavigate = (res, payload) => {
        if(res?.isEligible){
            navigate('KP_Wallet_Transfer')
        } else if(payload?.force) {
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'Error',
                title: t('GLOBAL.ERROR'),
                text: res?.responseMessage,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => Popup.hide()
                    },
                    {
                        text: 'View History',
                        callback: () => {
                            navigate("kp_wallet_transfer_history")
                            Popup.hide();
                        }
                    },
                ]
            });
        }
    };


    //Check user is not light user then get pointsStats, check forcefully advance salary status, bnpl eligibility.
    const checkUserEligibility = (card) => {
        checkUserAndCardStatus(t, card, ({type}) => {
            if(type === 'FUNCTION') {
                if (reduxState?.user?.status === 'ACTIVE' && card?._id && checkCentiV(card, 'NOT_EQUAL', 'CENTIV')) {
                    checkForcefullyPersonalLoanStatus(card);
                    checkForcefullyAdvanceSalaryStatus(card);
                    checkForcefullyCreditPayStatus(card);
                    checkForcefullyBNPLEligibility(card);
                    checkForcefullyKpWalletTransferStatus(card);
                }
            }
        }, {
            isShowPopup: false
        });
    };

    const getNaqadPointsStats = (card) => {
        checkUserAndCardStatus(t, card, ({type}) => {
            if(type === 'FUNCTION') {
                dispatch(getPointsStats());
            }
        }, {isShowPopup: false, notCheckCardStatus: true});
    };

    //Get dashboard data against selected card
    const getDashBoardData = (card) => {
        if(card?._id){
            let payload = {
                cardId: card?._id
            };
            dispatch(getPopularsData(payload));
        }
    };

    //Clear stored eligibility's on card change
    const clearEligibility = () => {
        dispatch(clearAdvanceSalaryEligibility());
        dispatch(clearPersonalLoanEligibility());
        dispatch(clearCreditPayEligibility());
        dispatch(clearBNPLEligibility());
        dispatch(clearKPWalletTransferEligibility());
    };

    const onChangeCard = (index) => {
        updateSliderIndex(index);
        let foundCard = reduxState?.user?.cards?.length ? reduxState?.user?.cards[index] : null;
        dispatch(updateCard(foundCard, index));
        updateSelectedCard(foundCard);
        if((selectedCard?._id === foundCard?._id) && checkCardIsActive(foundCard)){
            clearEligibility();
            getDashBoardData(foundCard);
            getNaqadPointsStats(foundCard);
            checkUserEligibility(foundCard);
        }
    };

    //===EMIRATES ID FLOW===//
    const newValidateUserCallBack = (res) => {
        if(res?.error) {
            uqudoFlowRef?.current?.clearStates();
            updateUqudoToken('');
            updateOcrVendor('');
            updateCardNo('');
            updateCardExpiry(null);
        } else {
            dispatch(getProfile());
            cardLastDigitOnClose();
        }
    };
    const newDeviceRegisterCallBack = (res) => {
        updateUqudoToken('');
        updateOcrVendor('');
        uqudoFlowRef?.current?.clearStates();
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            ...(res?.error ? {
                type: 'Error',
                title: t('GLOBAL.ERROR'),
            } : {
                type: 'Success',
                title: t('GLOBAL.SUCCESSFULLY'),
            }),
            text: res?.data?.message,
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => Popup.hide()
                },
            ]
        });
        if(!res?.error) {
            dispatch(getProfile())
        }
    };
    const isPortalUserFlow = (token, type, vendor = '') => {
        uqudoFlowRef?.current?.clearStates();
        navigation.navigate('change_password', {
            uqudoToken: token,
            uqudoTokenType: type,
            vendor: vendor,
        });
    };
    const confirmEidDetail = (token, type, vendor = '') => {
        if(type === TOKEN_TYPE_CONSTANTS.PORTAL_USER_VERIFICATION) {
            isPortalUserFlow(token, type, vendor);
        } else if(type === TOKEN_TYPE_CONSTANTS.NEW_DEVICE_REGISTERED) {
            let isPortalUser = reduxState?.user?.hasOwnProperty('isPortalUser') && reduxState?.user?.isPortalUser?.status;
            if(isPortalUser){
                isPortalUserFlow(token, type, vendor);
            } else {
                dispatch(newDeviceRegister({token: token, vendor}, newDeviceRegisterCallBack));
            }
        } else {
            updateUqudoToken(token);
            updateOcrVendor(vendor);
            uqudoFlowRef?.current?.clearStates();
            dispatch(newValidateUser({token: token, cardNo, cardExpiry, vendor}, newValidateUserCallBack))
        }
    };
    const confirmEidDetailOnClose = () => {
        uqudoFlowRef?.current?.clearStates();
        updateUqudoToken('');
        updateOcrVendor('');
    };

    //===PASSPORT FLOW===//
    const confirmPassportDetail = (obj) => {
        let payload = {
            token: obj?.ocrToken,
            ...(obj?.docType && {docType: obj?.docType}),
            ...(obj?.vendor && {vendor: obj?.vendor}),
            identificationType: IDENTIFICATION_TYPE.PASSPORT._id,
        };
        console.log("Confirm Passport Detail", payload, obj);
        dispatch(updateUserType(payload, updateUserTypeCallBack));
    };

    const updateUserTypeCallBack = (res) => {
        confirmPassportDetailOnClose();
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: res?.error ? 'Error' : 'Success',
            title: res?.error ? t('GLOBAL.ERROR') : t('GLOBAL.SUCCESSFULLY'),
            text: res?.data?.message,
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => Popup.hide()
                },
            ]
        });
        if(!res?.error) {
            dispatch(getProfile())
        }
    };

    const confirmPassportDetailOnClose = () => {
        passportScannerRef?.current?.clearStates();
    }

    const cardLastDigitSubmit = ({cardNo, cardExpiry, emirateID}) => {
        updateCardLastDigitModalIsOpen(false);
       if(uqudoToken && ocrVendor){
            dispatch(newValidateUser({ token: uqudoToken, vendor: ocrVendor, cardNo, cardExpiry }, newValidateUserCallBack))
        } else {
           updateCardNo(cardNo);
           updateCardExpiry(cardExpiry);
           uqudoFlowRef?.current?.run({
               eid: emirateID.replace(/-/g,""),
               type: 'ONBOARDING'
           })
        }
    };

    const cardLastDigitOnClose = () => {
        updateCardLastDigitModalIsOpen(false);
        updateCardNo('');
        updateCardExpiry(null);
    };

    const renderAddCardSubmit = ({cardNo, cardExpiry}) => {
        dispatch(newValidateUser({ cardNo, cardExpiry }, newValidateUserCallBack))
    };

    const renderAddCardView = () => {
        return (
            <View style={{flex: 1, paddingHorizontal: 30}}>
                <CardLastDigitForm
                    submit={renderAddCardSubmit}
                    isEid={false}
                    loading={false}
                    scrolled={false}
                />
            </View>
        )
    };

    const renderVerificationView  = () => {
        return reduxState?.verificationLoading ? <CLoading
                transparent={true}
                loading={true} showAnimation={true}/>
            : checkIsAppUserOrRegisterDevice(
                reduxState?.user,
                () => {
                    return (
                        reduxState?.user?.isEidScanned ? renderAddCardView() : <View style={Styles.completeVerificationContainer}>
                            <ProgressiveImage
                                resizeMode="contain"
                                source={require('../../assets/images/complete_verification-icon.png')}
                                style={Styles.completeVerificationContainerVector}/>
                            <CText style={Styles.completeVerificationContainerTitle}>
                                {t('USER_NOT_VERIFIED.TITLE')}
                            </CText>
                            <CText style={Styles.completeVerificationContainerSubTitle}>
                                {t('USER_NOT_VERIFIED.SUB_TITLE')}
                            </CText>
                            <CButton
                                title={t('GLOBAL.VERIFY')}
                                type="outline"
                                buttonStyle={{minWidth: 200}}
                                onPress={() => updateCardLastDigitModalIsOpen(true)}
                            />
                            <CButton
                                title={t('GLOBAL.DONT_HAVE_AN_EMIRATES_ID')}
                                type="without_outline"
                                buttonStyle={{minWidth: 200, marginTop: 15}}
                                onPress={() => dontHaveAnEmiratesIdRef?.current?.toggleModal(true)}
                            />
                        </View>
                    )
                },
                (obj) => {
                    return (
                        <View style={Styles.completeVerificationContainer}>
                            <ProgressiveImage
                                resizeMode="contain"
                                source={require('../../assets/images/complete_verification-icon.png')}
                                style={Styles.completeVerificationContainerVector}/>

                            <CText style={Styles.completeVerificationContainerTitle}>
                                {t(obj?.title)}
                            </CText>

                            <CText style={Styles.completeVerificationContainerSubTitle}>
                                {t(obj?.subTitle)}
                                {obj?.thirdTitle ? ' ' + t(obj?.thirdTitle) : null}
                            </CText>

                            <CButton
                                title={t('GLOBAL.VERIFY')}
                                type="outline"
                                buttonStyle={{minWidth: 200}}
                                loading={reduxState?.newDeviceRegisterLoading}
                                onPress={() => {
                                    if(obj?.type === 'IS_PORTAL_USER'){
                                        uqudoFlowRef?.current?.run({type: 'PORTAL_USER_VERIFICATION'})
                                    }
                                }}
                            />

                            {obj?.type === 'IS_PORTAL_USER' && reduxState?.masterDetails?.alternateVerify ? <CButton
                                title={t('ALTERNATE_VERIFY.TITLE')}
                                type="outline"
                                buttonStyle={{minWidth: 200, marginTop: 15}}
                                loading={reduxState?.newDeviceRegisterLoading}
                                onPress={() => alternateRef?.current?.toggleModal({ type: 'PORTAL_USER_VERIFICATION' })}
                            /> : null}

                        </View>
                    )
                },
            )
    };

    const renderActivateYouCard  = () => {
        return selectedCard && getCardIsActivatedOrStatus(selectedCard)?.id === cardIsActivatedStatus[1] ? (
            <View style={[Styles.completeVerificationContainer]}>
                <CText style={Styles.completeVerificationContainerTitle}>
                   {t('ACTIVATE_YOUR_CARD.TITLE')}
                </CText>
                <CText style={Styles.completeVerificationContainerSubTitle}>
                    {t('ACTIVATE_YOUR_CARD.SUB_TITLE')}
                </CText>
                <CButton
                    title={t("ACTIVATE_YOUR_CARD.GO_TO_ACTIVATE")}
                    type="outline"
                    buttonStyle={{minWidth: 200}}
                    onPress={() => isMinimalUser(reduxState?.user,
                        () => {
                            userVerificationPopup(t, USER_TYPES.MINIMAL_USER._id)
                        },
                        () => {
                            navigation.navigate('Card_Management')
                        }
                    )}
                />
            </View>
        ) : null
    };

    const blockRouteForCentiVFun = (routeName) => {
        if(selectedCard && Object.keys(selectedCard)?.length && getCardIsActivatedOrStatus(selectedCard, true)?.id === cardNormalStatus[0]) {
            if(blockRouteForCentiv.includes(routeName) && checkCentiV(selectedCard, 'EQUAL', 'CENTIV')) {
                // return 'NOT_AUTHORISE'
                return true
            } else {
                return false
            }
        } else {
            // return 'TEMP_BLOCK'
            return true
        }
    };

    const renderItemIsNew = (value) => {
        return value ? (
            <View style={Styles.homeItemBadgeNew}>
                <CText style={Styles.homeItemBadgeNewText}>{value}</CText>
            </View>
        ) : null
    };

    const renderView  = (callBack) => {
        return selectedCard && getCardIsActivatedOrStatus(selectedCard)?.id === cardIsActivatedStatus[2] ? callBack() : null
    };

    const getKeyFeaturesItems = () => {
        let keyFeaturesItems = [];
        let buttonColor = reduxState?.card?.themeSettings?.colors?.primary;

        let itemsLoading = checkBnplEligibilityLoading || checkCreditPayEligibilityLoading || checkPersonalLoanEligibilityLoading || checkAdvanceSalaryEligibilityLoading || checkBnplEligibilityLoading

        let status = '';
        checkUserAndCardStatus(t, selectedCard,
            ({type}) => status = type,
            {isShowPopup: false}
        );

        if(checkServices(reduxState?.card, [SERVICES.EMBEDDED_FINANCE._id]) && checkServices(reduxState?.card, [SERVICES.TOPUP._id]) && checkServices(reduxState?.card, [SERVICES.BILL_PAYMENT._id])) {
            let creditPayDetails = creditPayEligibility;
            let creditPayIsEligible = checkServices(reduxState?.card, [SERVICES.EMBEDDED_FINANCE._id]) && creditPayDetails?.isEligible || false;
            keyFeaturesItems.push({
                name: t('CREDIT_PAY.CREDIT_PAY_TITLE'),
                loading: checkCreditPayEligibilityLoading,
                disable: itemsLoading,
                ...getCreditPayDetails(status, creditPayDetails, creditPayIsEligible),
                rightSource: require('../../assets/images/3d-vector/credit-pay.png'),
                rightSourceStyle:{
                    width: 80,
                    height: 80,
                },
                ...(buttonColor && {buttonColor: buttonColor})
            });
        }

        if(checkServices(reduxState?.card, [SERVICES.PERSONAL_LOAN._id])) {
            keyFeaturesItems.push({
                name: t('HOME.LABEL_THIRTEEN'),
                route: 'Personal_Loan',
                loading: checkPersonalLoanEligibilityLoading,
                rightSourceStyle: {
                    width: 70,
                    height: 55,
                },
                rightSource: require('../../assets/images/3d-vector/holding-money.png'),
                disable: itemsLoading || blockRouteForCentiVFun('Personal_Loan'),
                ...(buttonColor && {buttonColor: buttonColor}),
                ...(getPersonalLoanDetails(status, personalLoanEligibility)),
                history: {
                    title: t('GLOBAL.HISTORY'),
                    buttonText: t('GLOBAL.VIEW'),
                    route: 'personal_loan_history',
                }
            });
        }

        if(checkServices(reduxState?.card, [SERVICES.ADVANCE_SALARY._id])) {
            keyFeaturesItems.push({
                name: t('HOME.LABEL_ELEVEN'),
                route: 'Advance_Salary',
                loading: checkAdvanceSalaryEligibilityLoading,
                ...(advanceSalaryDetails?.status !== "01" ? {
                    buttonText:  t('HOME.MAIN_OPTION_THREE.BUTTON_TWO'),
                    onPress: () => checkForcefullyAdvanceSalaryStatus(reduxState?.card, true, advanceSalaryStatusCallBackToShowPopup)
                } : advanceSalaryDetails?.status === "01" ? {
                    buttonText: t('HOME.MAIN_OPTION_THREE.BUTTON'),
                    onPress: () => checkForcefullyAdvanceSalaryStatus(reduxState?.card, true, advanceSalaryStatusCallBackToNavigate)
                } : {}),
                rightSourceStyle: {
                    width: 92,
                    height: 92,
                },
                rightSource: require('../../assets/images/3d-vector/advance-salary-icon.png'),
                disable: itemsLoading || advanceSalaryDetails?.status !== "01" || blockRouteForCentiVFun('Advance_Salary'),
                ...(buttonColor && {buttonColor: buttonColor}),
                ...(getAdvanceSalaryDetails(status, advanceSalaryDetails)),
                history: {
                    title: t('GLOBAL.HISTORY'),
                    buttonText: t('GLOBAL.VIEW'),
                    route: 'advance_salary_history',
                }
            });
        }

        if(checkServices(reduxState?.card, [SERVICES.REMITTANCE._id]) && populars?.nationalityCountry){
            keyFeaturesItems.push({
                name: `${t('HOME.MAIN_OPTION_ONE.TITLE')} ${populars?.nationalityCountry?.name}`,
                route: 'Send_Money',
                badge: t('HOME.MAIN_OPTION_ONE.BADGE'),
                buttonText: t('HOME.MAIN_OPTION_ONE.BUTTON'),
                ...(buttonColor && {buttonColor: buttonColor}),
                ...(reduxState?.populars?.nationalityCountry ? {
                    rightSource: {uri: reduxState?.populars?.nationalityCountry?.flagPng},
                } : {rightSource: require('../../assets/images/3d-vector/globe.png')}),
                subTitle: `${t('HOME.MAIN_OPTION_ONE.SUB_TITLE')} ${truncateAmount(populars?.singleAmountUnit || 0)} ${populars?.nationalityCountry?.currency}`,
                ...(populars?.firstRemittance && {thirdTitle: populars?.firstRemittance}),
                ...(status ? {disable: false} : {disable: itemsLoading || blockRouteForCentiVFun('Send_Money')}),
                counter: () => renderRemittanceCounter({
                   countNumber: masterDetails?.remittanceOfferCounter,
                   count: populars?.remittanceCount,
                   offer: populars?.remittanceOfferTitle
                }),
            })
        }

        if(checkServices(reduxState?.card, [SERVICES.ECOMMERCE._id, SERVICES.BNPL._id])) {
            let bnplDetails = bnplEligibility;
            let bnplIsEligible = checkServices(reduxState?.card, [SERVICES.BNPL._id]) && bnplDetails?.isEligible || false;
            keyFeaturesItems.push({
                disable: !bnplIsEligible || itemsLoading || blockRouteForCentiVFun('BNPL'),
                ...getBnplMessages(status, bnplDetails, bnplIsEligible),
                rightSource: require('../../assets/images/3d-vector/all-bnpl.png'),
                route: 'BNPL',
                otherOption: {
                    screen: 'bnpl',
                    params:{
                        bnplIsEligible
                    }
                },
                rightSourceStyle:{
                    width: 70,
                    height: 70,
                },
                buttonText: t('HOME.MAIN_OPTION_SIX.BUTTON'),
                ...(buttonColor && {buttonColor: buttonColor}),
                history: {
                    title: t('GLOBAL.HISTORY'),
                    buttonText: t('GLOBAL.VIEW'),
                    route: 'bnpl_history',
                }
            });
        }

        return keyFeaturesItems
    };

    const renderKeyFeatureItem = (o, i) =>  {
        return (
            <View key={i} style={[Styles.keyFeatureItemContainer, o?.style]}>
                <TouchableOpacity
                                  activeOpacity={0.9}
                                  disabled={o?.loading || o?.disable || reduxState?.popularsLoading}
                                  onPress={() => {
                                      if(o?.onPress){
                                          checkUserAndCardStatus(t, selectedCard, ({type}) => {
                                              if (type === 'FUNCTION') {
                                                  o?.onPress()
                                              }
                                          }, {isShowPopup: true})
                                      } else if(o?.route) {
                                          navigate(o?.route, o?.otherOption || {})
                                      }
                                  }}
                                  style={[Styles.keyFeature, o?.type === 'INVERSE' ? [Styles.keyFeatureInverse, o?.backgroundColor && {backgroundColor: o?.backgroundColor}] : null]}>

                        {o?.loading ? <CLoading showAnimation={true}
                                             transparent={true}
                                             animationStyle={{height: 50}}
                                             loading={true}/> : <Fragment>

                        {o?.pattern ? <ProgressiveImage
                            // resizeMode={'cover'}
                            style={Styles.keyFeatureBackgroundImage}
                            source={o?.pattern}
                        /> : null}

                        {o?.icon ? <View style={[Styles.keyFeatureIconMainContainer, o?.type === 'INVERSE' && Styles.keyFeatureIconMainContainerInverse]}>
                            <IconButton
                                buttonType='normal'
                                type="icon-with-background"
                                buttonStyle={[Styles.keyFeatureIconContainer, o?.type === 'INVERSE' && Styles.keyFeatureIconContainerInverse]}
                                iconName={o?.icon}
                            />
                        </View> : null}

                        <View style={Styles.keyFeatureContent}>

                            <CText numberOfLines={o?.nameNumberOfLines || 2}
                                   style={[Styles.keyFeatureTitle, o?.titleStyle && o?.titleStyle, o?.type === 'INVERSE' ? [Styles.keyFeatureTitleInverse] : null]}>
                                {t(o?.name)}
                            </CText>

                            {o?.subTitle ? <CText numberOfLines={o?.subTitleNumberOfLines || 3}
                                                  style={[Styles.keyFeatureSubTitle, o?.subTitleStyle && o?.subTitleStyle, o?.type === 'INVERSE' && [Styles.keyFeatureSubTitleInverse]]}>
                                {t(o?.subTitle)}
                            </CText> : null}
                            {o?.thirdTitle ? <CText numberOfLines={2}
                                                    style={[Styles.keyFeatureThirdTitle, o?.type === 'INVERSE' && Styles.keyFeatureThirdTitleInverse]}>
                                {t(o?.thirdTitle)}
                            </CText> : null}
                            {o?.poweredBy ?  <View style={Styles.keyFeaturePoweredBy}>
                                <ProgressiveImage
                                    resizeMode={'contain'}
                                    style={Styles.keyFeaturePoweredByImage}
                                    source={o?.poweredBy}
                                />
                            </View>: null}
                            {o?.counter ? o?.counter() : null}
                            {o?.buttonText ? <CButton
                                title={o?.buttonText}
                                disabled={o?.disable}
                                onPress={() => {
                                    if (o?.onPress) {
                                        checkUserAndCardStatus(t, selectedCard, ({type}) => {
                                            if (type === 'FUNCTION') {
                                                o?.onPress()
                                            }
                                        }, {isShowPopup: true})
                                    } else if (o?.route) {
                                        navigate(o?.route, o?.otherOption || {})
                                    }
                                }}
                                {...(o?.type !== 'INVERSE' && {colorType: 'secondary'})}
                                buttonStyle={[
                                    Styles.keyFeatureButton,
                                    o?.buttonColor && {
                                        backgroundColor: o?.buttonColor,
                                        borderColor: o?.buttonColor
                                    },
                                    o?.type === 'INVERSE' && Styles.keyFeatureButtonInverse,
                                ]}
                                buttonText={[
                                    Styles.keyFeatureButtonText,
                                    o?.type === 'INVERSE' && Styles.keyFeatureButtonTextInverse,
                                ]}
                                iconStyle={[
                                    Styles.keyFeatureButtonIcon,
                                    o?.type === 'INVERSE' && Styles.keyFeatureButtonIconInverse,
                                ]}
                                iconName="long-arrow-right"
                            /> : null}

                        </View>

                        {o?.rightSource ? <View style={Styles.keyFeatureRightImageMainContainer}>
                            <ProgressiveImage
                                resizeMode={'contain'}
                                source={o?.rightSource}
                                style={[Styles.keyFeatureRightImage, o?.rightSourceStyle && o?.rightSourceStyle]}
                            />
                        </View> : null}

                        {o?.badge ? <View style={[Styles.keyFeatureBadge, o?.bgColor && {backgroundColor: o?.bgColor}]}>
                            <CText numberOfLines={2}
                                   style={[Styles.keyFeatureBadgeText, o?.color && {color: o?.color}]}>
                                {o?.badge}
                            </CText>
                        </View> : null}

                    </Fragment>}

                </TouchableOpacity>
                {o?.history ? <View style={Styles.keyFeatureItemBottomContainer}>
                    <CText style={Styles.keyFeatureItemBottomText}>{o?.history?.title}</CText>
                    <CButton
                        type={'without_outline'}
                        buttonStyle={Styles.keyFeatureItemBottomButton}
                        buttonText={Styles.keyFeatureItemBottomButtonText}
                        onPress={() =>  navigate(o?.history?.route, o?.history?.otherOption || {})}
                        title={o?.history?.buttonText}
                    />
                </View> : null}

            </View>
        )
    };
    const keyFeatures = () => {
        return (
            <View style={Styles.keyFeatureList}>
                <MappedElement data={getKeyFeaturesItems()} renderElement={renderKeyFeatureItem} />
            </View>
        )
    };

    const getHomeOption = () => {
        let items = [];

        if(checkServices(reduxState?.card, [SERVICES.ADVANCE_SALARY._id, SERVICES.REMITTANCE._id, SERVICES.ADVANCE_REMITTANCE._id])
            && advanceSalaryDetails && advanceSalaryDetails?.status !== "02" && advanceSalaryDetails?.status === "01") {
            items.push({
                name: t('HOME.MAIN_OPTION_TWO.TITLE'),
                route: 'Snpl',
                image: require('../../assets/images/snpl.png'),
                imageSize: {
                    width: 60,
                    height: 60,
                },
            })
        }

        if(checkServices(reduxState?.card, [SERVICES.KP_WALLET_TRANSFER._id])) {
            items.push({
                name: t('HOME.MAIN_OPTION_SIXTEEN.TITLE'),
                callback: () => {
                    checkForcefullyKpWalletTransferStatus(reduxState?.card, true, kpWalletTransferStatusCallBackToNavigate)
                },
                image: require('../../assets/images/3d-vector/send-money.png'),
                imageSize: {
                    width: 80,
                    height: 60,
                },
                loading: checkKpWalletTransferEligibilityLoading,
            })
        }

        if(checkServices(reduxState?.card, [SERVICES.LOTTERY._id])) {
            items.push({
                name: t('HOME.MAIN_OPTION_FOUR.TITLE'),
                route: 'Lottery',
                image: require('../../assets/images/3d-vector/prize-draw.png'),
                imageSize: {
                    width: 60,
                    height: 60,
                },
            })
        }

        if(checkServices(reduxState?.card, [SERVICES.BILL_PAYMENT._id])) {
            items.push({
                name: t('HOME.LABEL_TWO'),
                route: 'Pay_Bill',
                otherOption: {
                    screen: 'pay_bill',
                    initial: false
                },
                image: require('../../assets/images/3d-vector/pay-bills.png'),
                imageSize: {
                    width: 100,
                    height: 70,
                },
            })
        }

        if(checkServices(reduxState?.card, [SERVICES.TOPUP._id])) {
            items.push({
                name: t('HOME.LABEL_ONE'),
                route: 'Mobile_TopUp',
                otherOption: {
                    screen: 'mobile_topup',
                    initial: false,
                },
                image: require('../../assets/images/3d-vector/topup.png'),
                imageSize: {
                    width: 100,
                    height: 60,
                },
            })
        }

        if(checkServices(reduxState?.card, [SERVICES.REMITTANCE._id])) {
            items.push({
                name: t('HOME.LABEL_FIVE'),
                route: 'populars',
                ...(reduxState?.populars?.nationalityCountry ? {
                    image: {uri: reduxState?.populars?.nationalityCountry?.flagPng},
                } : {image: require('../../assets/images/3d-vector/globe.png')}),
            })
        }

        items.push({
            name: t('HOME.LABEL_TWELVE'),
            route: 'Scratch_Cards',
            otherOption: {
                    screen: 'scratch_cards',
                    params: {
                     card: reduxState?.card
                    },
                    initial: false,
            },
            image: require('../../assets/images/3d-vector/scratch-card-voucher.png'),
            imageSize: {
                width: 100,
            },
        });

        items.push({
            name: t('HOME.LABEL_NINE'),
            route: 'ATMLocator',
            // badge: t('GLOBAL.NEW'),
            image: require('../../assets/images/3d-vector/map-locator.png'),
            imageSize: {
                width: 100,
            },
        });

        return items
    };
    const renderHomeOptionItems = (item, index) => {
        return item?.disable ? null : (
            <View style={Styles.homeListItemContainer} key={index}>
                <TouchableOpacity disabled={item?.disable || item?.loading}
                                   onPress={() => {
                                       item?.closeCallback && item.closeCallback();
                                        if(item?.route) {
                                            navigate(item?.route, item?.otherOption || {})
                                        } else if(item?.callback){
                                            checkUserAndCardStatus(t, selectedCard, ({type}) => {
                                                if (type === 'FUNCTION') {
                                                    item?.callback()
                                                }
                                            }, {isShowPopup: true})
                                        }
                                   }}
                                  style={[Styles.homeListItem, item?.backgroundColor && {backgroundColor: item?.backgroundColor}, item?.style]}>
                    {item?.loading ? <CLoading loading={true} text={"hide"}/>: <Fragment>
                        {renderItemIsNew(item?.badge)}
                        <View style={Styles.homeListItemImageContainer}>
                            <ProgressiveImage
                                resizeMode="contain"
                                source={item.image}
                                style={[Styles.homeListItemImage, item?.imageSize && item?.imageSize]}/>
                        </View>
                        <View style={Styles.homeListItemContent}>
                            <CText numberOfLines={2} style={Styles.homeListItemText}>{item?.name}</CText>
                        </View>
                    </Fragment>}


                </TouchableOpacity>
                {item?.history ? <View style={Styles.keyFeatureItemBottomContainer}>
                    <CText style={Styles.keyFeatureItemBottomText}>{item?.history?.title}</CText>
                    <CButton
                        type={'without_outline'}
                        disabled={item?.disable || item?.loading}
                        buttonStyle={Styles.keyFeatureItemBottomButton}
                        buttonText={Styles.keyFeatureItemBottomButtonText}
                        onPress={() =>  navigate(item?.history?.route, item?.history?.otherOption || {})}
                        title={item?.history?.buttonText}
                    />
                </View> : null}
            </View>
        )
    };
    const renderHomeOption = () => {
        return (
            <View style={Styles.homeList}>
                <MappedElement data={getHomeOption()} renderElement={renderHomeOptionItems}/>
            </View>
        )
    };

    const renderPopularsLoading = () => {
        return (
            <CLoading text={'hide'}
                      style={{position: 'relative', minHeight: 200}}
                      showAnimation={true}
                      loading={reduxState?.popularsLoading}/>
        )
    };

    const promotionOnSelect = (item) => {
        if(item?.otherOptions?.type === 'FUNCTION'){
            if(item?.forServices?.includes(SERVICES.EMBEDDED_FINANCE._id)){
                checkForcefullyCreditPayStatus(reduxState?.card, true, creditPayStatusCallBackToNavigate);
            }
            if(item?.forServices?.includes(SERVICES.KP_WALLET_TRANSFER._id)){
                checkForcefullyKpWalletTransferStatus(reduxState?.card, true, kpWalletTransferStatusCallBackToNavigate)
            }
        }
    }

    const renderHomeContent = () => {
        return (
            <Fragment>
                {reduxState?.popularsLoading ? renderPopularsLoading() : <Fragment>
                    <Promotions selectedCard={selectedCard}
                                onSelect={(item) => promotionOnSelect(item)}/>
                    {keyFeatures()}
                    {renderHomeOption()}
                </Fragment>}

                {checkServices(reduxState?.card, [SERVICES.REMITTANCE._id]) ? <SendMoneySection selectedCard={selectedCard}/> : null}

                <RecentTransactionsSection selectedCard={selectedCard} />

            </Fragment>
        )
    };

    const updateEmiratesId = () => {
        uqudoFlowRef?.current?.run({ type: 'GET_NEW_TOKEN' })
    };

    let checkEmiratesIDExpiry = isShowUpdateOrBlockAppEmiratesIdAlert(expiryEmiratesID);

    const renderExpiryTime = (value) => {
        if(value <= 1) {
            return `${value} ${t('GLOBAL.DAY')}`;
        } else {
            return `${value} ${t('GLOBAL.DAYS')}`;
        }
    };

    const _onRefresh = () => {
        if(reduxState?.popularsLoading !== true){
            if(checkCardIsActive(selectedCard)){
                getDashBoardData(selectedCard);
                getNaqadPointsStats(selectedCard);
                checkUserEligibility(selectedCard)
            } else {
                if(selectedCard?._id){
                    let payload = {
                        id: selectedCard?._id
                    };
                    dispatch(getCardById(payload))
                }

            }
        }
    };

    const livenessDetectionOnSubmit = (selfie = {}) => {
        const formData = new FormData();
        if(Object.keys(selfie).length){
            formData.append('selfie', selfie);
        }
        dispatch(newDeviceRegister(formData, newDeviceRegisterCallBack, {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        }));
    };

    const pullToRefreshCardStatusView = () => {
        return !checkCardIsActive(selectedCard) ? (
            <View style={Styles.pullToRefreshToCardStatus}>
                <Feather
                    style={Styles.pullToRefreshToCardStatusIcon}
                    name={"chevrons-down"}
                />
                <CText style={Styles.pullToRefreshToCardStatusText}>
                    {t('GLOBAL.CHECK_CARD_STATUS_TO_SWIPE_DOWN')}
                </CText>
            </View>
        ) : null
    };

    return (
        <Fragment>
            <Container
                edges={['top', 'right', 'left']}
                customHeader={true}
                scrollView={true}
                loading={reduxState?.loading}
                loadingMarginTop={1}
                scrollViewProps={{
                    contentContainerStyle: Styles.homeContainer,
                    ...checkIsAppUserOrRegisterDevice(
                        reduxState?.user,
                        () => {
                            return {
                                refreshControl: <RefreshControl
                                    refreshing={getCardByIdLoading || false}
                                    onRefresh={_onRefresh}
                                />
                            }
                        }
                    )
                }}
            >
                {checkIsAppUserOrRegisterDevice(
                    reduxState?.user,
                    () => {
                        if(reduxState?.user?.status !== 'INACTIVE'){
                            if(checkEmiratesIDExpiry?.appBlock){
                                return yourEmiratesIDExpire(t, updateEmiratesId, "GLOBAL.UPDATE", reduxState?.verificationLoading);
                            } else if(!reduxState?.user?.cards?.length) {
                                return <AddNewCardView />;
                            } else {
                                return <Fragment>

                                    {pullToRefreshCardStatusView()}

                                    <CardSelection
                                        currentSelectIndex={sliderIndex}
                                        onSelect={onSelectCard}
                                        onChange={onChangeCard}
                                        data={reduxState?.user?.cards}
                                        loading={checkAdvanceSalaryEligibilityLoading || inquiryBalanceLoading}
                                    />

                                    {checkEmiratesIDExpiry?.hasExpire ? <View
                                        style={{paddingHorizontal: 30, marginVertical: 10}}>
                                        <AlertView
                                            loading={reduxState?.getOcrTokenLoading}
                                            onPress={() => updateEmiratesId()}
                                            animatedIcon
                                            type="error"
                                            text={t('POPUPS.EXPIRED_EMIRATES_ID.TITLE')}
                                            subText={`${t('POPUPS.EXPIRED_EMIRATES_ID.SUB_TITLE_START')} ${renderExpiryTime(checkEmiratesIDExpiry?.afterExpiryDaysRemaining)} ${t('POPUPS.EXPIRED_EMIRATES_ID.SUB_TITLE_END')}`}
                                        />
                                    </View> : null}

                                    {renderView(renderHomeContent)}
                                    {renderActivateYouCard()}
                                    {renderYourCardIsOnItsWay(t, selectedCard, reduxState?.verificationLoading)}

                                </Fragment>
                            }
                        } else {
                            return renderVerificationView()
                        }
                    },
                    () => {
                        return renderVerificationView();
                    }
                )}

            </Container>

            <CardLastDigit
                preValidationValues={reduxState?.user?.preValidationValues || null}
                value={cardLastDigitModalIsOpen}
                submit={cardLastDigitSubmit}
                onClose={() => cardLastDigitOnClose()}
            />

            <DontHaveAnEmiratesId
                preValidationValues={reduxState?.user?.preValidationValues || null}
                ref={dontHaveAnEmiratesIdRef} />

            <LivenessDetection
                ref={livenessDetectionFlowRef}
                detectionsList={reduxState?.masterDetails?.livenessChecks}
                onComplete={(picture = {}) => {
                    if(picture && Object.keys(picture).length) {
                        livenessDetectionOnSubmit(picture);
                        livenessDetectionFlowRef?.current?.toggleModal(false);
                    }
                }}
            />

            <Uqudo
                ref={uqudoFlowRef}
                confirm={confirmEidDetail}
                close={confirmEidDetailOnClose}
            />

            <PassportScanner
                onUploadError={(error) => {
                    errorPopup(t, error?.data?.message)
                }}
                loading={detectImagePassportLoading || updateUserTypeLoading}
                confirm={confirmPassportDetail}
                close={confirmPassportDetailOnClose}
                ref={passportScannerRef} />

            <Alternate ref={alternateRef} />

        </Fragment>
    )
}

export default Home;
