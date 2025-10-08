import React, {Fragment, memo} from 'react';
import {View, TouchableOpacity, ActivityIndicator, Dimensions} from 'react-native';
import {CText, ProgressiveImage} from "../index";
import Styles from "./CreditCardUi.style";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import moment from "moment";
import {inquiryBalance, toggleCardBalance} from "../../store/actions/Auth.action";
import {useDispatch, useSelector} from "react-redux";
import {themes} from "../../theme/colors";
import { CountUp } from 'use-count-up'
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {checkCardIsActive, checkUserAndCardStatus, checkServices} from "../../pages/home/Home";
import {checkCentiV, formatAmount, isLightUser, SERVICES} from "../../utils/methods";
import Popup from "../popup/Popup";
import {checkAdvanceSalaryEligibility} from "../../store/actions/AdvanceSalary.action";
import DirhamSymbol from '../../assets/svg/dirhamSymbol.svg';

const windowWidth = Dimensions.get('window').width;

export const cardIsActivatedStatus = ['IN_PROGRESS', 'DELIVERED', 'ACTIVATED'];
export const cardNormalStatus = ['ACTIVE', 'BLOCKED'];
export const getCardIsActivatedOrStatus = (card, checkStatus = false) => {
    if(card?.isActivated === 'IN_PROGRESS') {
        return {
            text: 'CREDIT_CARD.NOT_DELIVERED',
            id: 'IN_PROGRESS',
            bgColor: themes['light'].colors.danger,
        }
    }else if(card?.isActivated === 'DELIVERED'){
        return {
            text: 'CREDIT_CARD.NOT_ACTIVATED',
            id: 'DELIVERED',
            bgColor: themes['light'].colors.danger,
        }
    } else if(card?.isActivated === 'ACTIVATED') {
        if(checkStatus) {
            if(card?.status === 'ACTIVE'){
                return {
                    text: 'CREDIT_CARD.ACTIVE',
                    id: 'ACTIVE',
                    bgColor: themes['light'].colors.green,
                }
            } else if(card?.status === 'BLOCKED'){
                return {
                    text: 'CREDIT_CARD.BLOCKED',
                    id: 'BLOCKED',
                    bgColor: themes['light'].colors.danger,
                }
            }
        } else {
            return {
                text: '',
                id: 'ACTIVATED',
                bgColor: themes['light'].colors.danger,
            }
        }
    }
};
export const getCardStatus = (card) => {
    if(card?.isActivated === 'DELIVERED'){
        return {
            text: 'NOT ACTIVATED',
            bgColor: themes['light'].colors.danger,
        }
    } else if(card?.isActivated === 'IN_PROGRESS') {
        return {
            text: 'NOT DELIVERED',
            bgColor: themes['light'].colors.danger,
        }
    } else if(card?.isActivated === 'ACTIVATED') {
        if(card?.status === 'ACTIVE'){
            return {
                text: 'ACTIVE',
                bgColor: themes['light'].colors.green,
            }
        } else if(card?.status === 'BLOCKED'){
            return {
                text: 'BLOCKED',
                bgColor: themes['light'].colors.danger,
            }
        }
    }
};

function CreditCardUi(props) {

    const { t } = useTranslation();
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global, userSubscriptions, points, advanceSalary}) => {
        return {
            user: auth.user,
            loading: auth.inquiryBalanceLoading,
            cardLoading: false,
            subscriptions: userSubscriptions.subscriptions,
            cards: auth?.user?.cards,
            pointsStats: points.pointsStats,
            getPointsStatsLoading: points?.getPointsStatsLoading,
            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility,
            advanceSalaryPromoCodeAndOffer: advanceSalary?.promoCodeAndOffer,
        }
    });

    const {onPress, activeOpacity= 0.9, card, cardWidth = windowWidth - 60, foundCardData, viewType, currentSelectIndex, whereToCome} = props;

    const getBalance = (walletID) => {
        if(walletID) {
            let payload = {
                walletID: walletID,
            };
            dispatch(inquiryBalance(payload, inquiryBalanceCallBack, false));
        }
    };

    const inquiryBalanceCallBack = () => {
        if(checkServices(card, [SERVICES.ADVANCE_SALARY._id]) && checkCentiV(card, 'NOT_EQUAL', 'CENTIV')) {
            checkUserAndCardStatus(t, card, ({type}) => {
                if(type === 'FUNCTION' && checkCardIsActive(card)) {
                    checkForcefullyAdvanceSalaryStatus();
                }
            }, {isShowPopup: false});
        }
    };

    const checkForcefullyAdvanceSalaryStatus = () => {
        let payload = {
            "cardId": card?._id,
            force: true
        };
        dispatch(checkAdvanceSalaryEligibility(payload,  (res) => {
            if(res?.status === '01'){
                advanceSalaryPopup();
            }
        }));
    };

    const advanceSalaryPopup = () => {
        let advInfo = checkServices(card, [SERVICES.ADVANCE_SALARY._id]) && reduxState?.advanceSalaryDetails?.status === "01" && {
            amount: reduxState?.advanceSalaryDetails?.eligibleAdvanceAmount
        };
        if(conditionsChecks() && advInfo?.amount) {
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'image',
                source: require('../../assets/images/3d-vector/advance-salary-icon.png'),
                imageStyle: {
                    width: 150,
                    height: 150,
                },
                title: `${t('PAGE_TITLE.ADVANCE_SALARY')} \n ${t('GLOBAL.APPLY_NOW_TEXT')} ${formatAmount(advInfo?.amount, 'AED', 0)}`,
                ...(reduxState?.advanceSalaryPromoCodeAndOffer?.offerDetails?.title && {
                    subText: reduxState?.advanceSalaryPromoCodeAndOffer?.offerDetails?.title
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

    const toggleCardBalanceFunc = (walletID, card) => {
        if(walletID) {
            let payload = {
                walletID: walletID,
            };

            if(card.hasOwnProperty('showBalance') && !card?.showBalance){
                advanceSalaryPopup()
            }

            if(!card?.hasBalanced) {
                getBalance(walletID, card?._id);
            } else {
                dispatch(toggleCardBalance(payload));
            }
        }
    };

    const renderCardContent = (value) => {
        let color = getCardBackgroundColor(foundCardData, card)?.backgroundColor;
        switch (value) {
            case 'info':
                return <View style={Styles.cardInfoContainer}>
                    <View style={[Styles.cardStatus, {backgroundColor: getCardIsActivatedOrStatus(card, true)?.bgColor}]}>
                        <CText style={Styles.cardStatusText}>{t(getCardIsActivatedOrStatus(card, true)?.text)}</CText>
                    </View>
                    <View style={Styles.cardInfoInnerContainer}>
                        <View style={[Styles.cardInfo, Styles.flex_1]}>
                            <CText style={Styles.cardInfoText}>{t('CREDIT_CARD.CARD_NUMBER')}</CText>
                            <CText style={[Styles.cardInfoText, Styles.large_font_size]}>
                               {card?.cardNumber}
                            </CText>
                        </View>
                        <View style={[Styles.cardInfo, Styles.mr_0]}>
                            <CText style={Styles.cardInfoText}>{t('CREDIT_CARD.EXPIRY')}</CText>
                            <CText style={Styles.cardInfoText}>{card?.expiry}</CText>
                        </View>
                    </View>

                </View>;
            default:
                return (
                    <Fragment>
                        <View style={Styles.cardBodyLeft}>
                            {reduxState?.loading ? <View style={Styles.cardBodyLoadingView}>
                                <ActivityIndicator color={'white'} size={'large'} />
                            </View> : <View style={Styles.cardBodyLeftTitleContainer}>
                                <TouchableOpacity style={Styles.cardBodyLeftCurrencyContainer}
                                                  // onPress={() => getBalance(card?.walletID, card)}
                                >
                                    {/* crashing */}
                                    {/* <DirhamSymbol fill={themes['light'].colors.tertiary} width={18} height={18}/> */}
                                </TouchableOpacity>
                                {!card?.showBalance ?
                                    <CText style={Styles.cardBodyLeftTitle}>XXXXXX</CText>
                                    :
                                    <CText style={Styles.cardBodyLeftTitle}>
                                        <CountUp isCounting start={0}
                                                 end={Number(card?.balance) || 0}
                                                 duration={0.3}
                                                 easing="linear" />
                                    </CText>
                                }
                            </View>}
                        </View>
                        <View style={Styles.cardBodyRight}>
                          {card?.isActivated === cardIsActivatedStatus[1] || card?.status === cardNormalStatus[1] ?
                              <View style={[Styles.cardStatus, {backgroundColor: getCardIsActivatedOrStatus(card, true)?.bgColor}]}>
                                <CText style={Styles.cardStatusText}>{t(getCardIsActivatedOrStatus(card, true)?.text)}</CText>
                            </View> : null}
                            <Fragment>
                                 <View style={Styles.reloadBalanceView}>
                                    <View style={Styles.reloadBalanceViewContent}>
                                        <CText style={Styles.reloadBalanceViewContentTitle}>
                                            {t('CREDIT_CARD.LAST_BALANCE_UPDATE')}
                                        </CText>
                                        {card?.time ?  <CText style={Styles.reloadBalanceViewContentTitle}>
                                            {moment(card?.time).format('DD/MM/YYYY : hh:mm a')}
                                        </CText> : null}
                                    </View>
                                </View>
                                <TouchableOpacity style={Styles.seeBalance}
                                                  onPress={() => toggleCardBalanceFunc(card?.walletID, card)}>
                                    <CText style={Styles.seeBalanceText}>
                                        {!card?.showBalance ? t('GLOBAL.SHOW') : t('GLOBAL.HIDE')} {t('GLOBAL.BALANCE')}
                                    </CText>
                                    <KamelpayIcon name={!card?.showBalance ? 'show' : 'hide'} style={Styles.seeBalanceIcon}/>
                                </TouchableOpacity>
                            </Fragment>

                        </View>
                    </Fragment>
                )
        }
    };

    const renderHeaderCompanyLogo = (data, card) => {
        return card?.hasCustomTheme && card?.themeSettings?.logo ?
            <View style={Styles.cardHeaderCompanyLogo}>
                <ProgressiveImage
                    resizeMode={'contain'}
                    indicatorColor={themes['light'].colors.tertiary}
                    style={Styles.cardHeaderCompanyLogoImage}
                    source={{uri: card?.themeSettings?.logo}}/>
            </View>
            : <CText style={Styles.cardHeaderTitle}>{data?.type}</CText>
    };

    const getCardBackgroundColor = (data, card) => {
        let bgColor = card?.hasCustomTheme && card?.themeSettings?.colors?.primary ? card?.themeSettings?.colors?.primary : data?.backgroundColor;
        let overlayBgColor = card?.hasCustomTheme && card?.themeSettings?.colors?.primary ? card?.themeSettings?.colors?.primary : data?.overlayBackgroundColor;
        return {
            backgroundColor: bgColor,
            overlayBackgroundColor: overlayBgColor
        }
    };

    const getActiveCardIndex = (array, activeIndex, type) => {
        const foundIndex = array?.findIndex(item => item._id === card?._id);
        return activeIndex === foundIndex
    };

    let isActiveCard = getActiveCardIndex(reduxState?.cards, currentSelectIndex, whereToCome);

    const renderCardLoading = () => {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <ActivityIndicator color={'white'} size={'large'} />
            </View>
        )
    };

    const navigate = (routeName) => {
        navigation.navigate(routeName)
    };

    const conditionsChecks = () => {
        let show = checkCentiV(card, 'NOT_EQUAL', 'CENTIV');
        let cardSelected = !(whereToCome === 'SLIDER' && !isActiveCard);
        let cardActivated = card?.isActivated === cardIsActivatedStatus[2];
        return show && cardSelected && cardActivated;
    };

    const renderNaqadPoints = () => {
        let color = getCardBackgroundColor(foundCardData, card)?.backgroundColor;
        return conditionsChecks() && !reduxState?.cardLoading && !reduxState?.getPointsStatsLoading ? (
          <View style={Styles.naqadPointsContainer}>

              <View style={Styles.naqadPoints}>
                  <CText style={[Styles.naqadPointsNumber, color && {color: color}]}>
                      {reduxState?.pointsStats?.availablePoints || 0}
                  </CText>
                  <CText style={[Styles.naqadPointsText, color && {color: color}]}>
                      Naqad points
                  </CText>
              </View>

              <TouchableOpacity activeOpacity={0.4}
                                style={Styles.naqadPointsButton}
                                onPress={() => {
                                    checkUserAndCardStatus(t, card, ({type}) => {
                                        if(type === 'NAVIGATE') {
                                            navigate('points')
                                        }
                                    }, {routeName: 'points', notCheckCardStatus: true, isShowPopup: true});
                                }}>
                  <CText style={[Styles.naqadPointsText, Styles.naqadPointsButtonText, color && {color: color}]}>
                      {t('GLOBAL.VIEW')}
                  </CText>
              </TouchableOpacity>
          </View>
        ) : null
    };

    return (
        <TouchableOpacity style={Styles.cardContainer} onPress={onPress} activeOpacity={activeOpacity}>
            <View style={[Styles.cardOverlay, {backgroundColor: getCardBackgroundColor(foundCardData, card)?.overlayBackgroundColor}]} />
            {renderNaqadPoints()}
            <View style={[Styles.card, {
                width: cardWidth,
                backgroundColor: getCardBackgroundColor(foundCardData, card)?.backgroundColor,
                shadowColor: getCardBackgroundColor(foundCardData, card)?.overlayBackgroundColor
            }]}>

                <View style={Styles.cardHeader}>
                    {renderHeaderCompanyLogo(foundCardData, card)}
                    <ProgressiveImage style={Styles.cardHeaderImage}
                        source={require('../../assets/images/mastercard.png')}/>
                </View>

                <View style={Styles.cardHeaderBottomBorder}/>

                <View style={Styles.cardBody}>

                    {(whereToCome === 'SLIDER' && !isActiveCard) ||  reduxState?.cardLoading ? renderCardLoading()
                    : renderCardContent(card?.isActivated === cardIsActivatedStatus[0] ? 'info' : viewType)}

                </View>
            </View>
        </TouchableOpacity>
    )
}

CreditCardUi.defaultProps = {
    // number: '',
    // valid: '',
    // name: '',
};

export default memo(CreditCardUi);
