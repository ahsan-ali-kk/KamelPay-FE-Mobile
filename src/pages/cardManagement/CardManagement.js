import React, {Fragment, useEffect, useState} from "react";
import {View, TouchableOpacity, Dimensions, RefreshControl} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {Container, ViewContainer} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {
    checkIsAppUserOrRegisterDevice,
    handleSuccess,
    isMinimalUser,
    isShowUpdateOrBlockAppEmiratesIdAlert,
    MappedElement,
    SERVICES
} from "../../utils/methods";
import CreditCardUi, {
    cardIsActivatedStatus, getCardIsActivatedOrStatus
} from "../../uiComponents/creditCardUi/CreditCardUi";
import {foundProduct} from "../../utils/methods";
import Styles from "./CardManagement.style";
import HomeStyles from "../home/Home.style";
import {changePinRequest, requestActivateCard} from "../../store/actions/CardManagement.action";
import {CButton, Collapsible, CText, IconButton, ProgressiveImage} from "../../uiComponents";
import {toggleCardSelectionModal} from "../../store/actions/Global.action";
import KamlepayIcon from "../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";
import {
    checkCardIsActive,
    checkUserAndCardStatus,
    checkServices,
    renderYourCardIsOnItsWay,
    USER_TYPES,
    userVerificationPopup,
    yourEmiratesIDExpire
} from "../home/Home";
import AddNewCardView from "./addCard/AddNewCardView";
import {getCardById} from "../../store/actions/Auth.action";
import Feather from "@react-native-vector-icons/feather";
import Clipboard from "@react-native-clipboard/clipboard";
import Share from "react-native-share";
const windowWidth = Dimensions.get('window').width;

function CardManagement(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {route: {params: data}, navigation} = props;

    const reduxState = useSelector(({auth, cardManagement, global, userSubscriptions}) => {
        return {
            data: [],
            loading: cardManagement?.requestActivateCardLoading || auth.getOcrTokenLoading || cardManagement.changePinRequestLoading,
            currentCountry: global.currentCountry,
            card: global.selectedCard,
            user: auth.user,
            subscriptions: userSubscriptions.subscriptions,
            getCardByIdLoading: auth.getCardByIdLoading,
        }
    });

    let expiryEmiratesID = reduxState?.user?.expiryDate;
    let checkEmiratesIDExpiry = isShowUpdateOrBlockAppEmiratesIdAlert(expiryEmiratesID);

    const [toggleCollapsed, updateToggleCollapsed] = useState(true);

    useEffect(() => {
        if(data && data?.selectCardModal){
            cardsManage()
        }
    }, [data]);

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CARD_MANAGEMENT'),
        headerRight: true,
    };

    const { card } = reduxState;

    const navigate = (routeName, item) => {
        navigation.navigate(routeName, item)
    };

    const changePinRequestFunc = () => {
        checkUserAndCardStatus(t, card, ({type}) => {
            if(type === 'FUNCTION') {
                let payload = {
                    id: reduxState.card._id
                };
                dispatch(changePinRequest(payload, (response) => {
                    navigation.navigate('card_management_otp', {
                        token: response?.data?.token,
                        screen: 'change_pin',
                        card: card
                    })
                }))
            }
        }, {
            isShowPopup: true
        });
    };

    const requestActivateCardFunc = () => {
        dispatch(requestActivateCard({
            id: card?._id
        }, (res) => {
            if(!res?.error)
                navigation.navigate('card_management_otp', {
                    token: res?.data?.token,
                    screen: 'activate_card',
                    card: card
                })
        }))
    };

    const items = [
        {
            name: t('CARD_MANAGEMENT.OPTION_ONE'),
            icon: 'change-pin',
            onPress: () => changePinRequestFunc()
        },
        {
            name: t('CARD_MANAGEMENT.OPTION_TWO'),
            icon: 'activate-deactivate',
            // onPress: () => navigate('manage_card_status', reduxState?.card)
            onPress: () => {
                isMinimalUser(reduxState?.user,
                    () => {
                        userVerificationPopup(t, USER_TYPES.MINIMAL_USER._id)
                }, (obj) => {
                        navigate('manage_card_status', reduxState?.card)
                })
            }

        },
        // {
        //     name: 'Request NewCard',
        //     icon: 'send-money',
        //     onPress: () => navigate('transaction_history')
        //
        // },
        // {
        //     name: 'Report Missing Card',
        //     icon: 'load-funds'
        // }
        {
            name: t('GLOBAL.SUBSCRIPTIONS'),
            icon: 'offers',
            onPress: () => checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
                if(type === 'NAVIGATE') {
                    navigate('card_subscriptions', reduxState?.card)
                }
            }, {
                routeName: 'card_subscriptions',
                isShowPopup: true
            })
        }
    ];

    // if(reduxState?.subscriptions?.length) {
    //     items.push({
    //         // name: t('CARD_MANAGEMENT.OPTION_TWO'),
    //         name: 'Subscriptions',
    //         icon: 'offers',
    //         onPress: () => checkCardStatus(t, reduxState?.card, () => { navigate('card_subscriptions', reduxState?.card) })
    //     })
    // }

    const renderItems = (item, index) => {
        return item ? (
            <TouchableOpacity key={index}
                              onPress={item?.onPress ? item?.onPress : null}
                              style={HomeStyles.homeItem}>
                <IconButton
                    buttonType='normal'
                    type="icon-with-background"
                    buttonStyle={HomeStyles.homeItemIconContainer}
                    iconName={item?.icon}
                />
                <CText numberOfLines={2} style={HomeStyles.homeItemTitle}>{item?.name}</CText>
            </TouchableOpacity>
        ) : null
    };

    const renderCollapsibleButton = (array) => {
        return array?.length > 3 ? <TouchableOpacity style={[HomeStyles.collapsedButton,
            {marginLeft: windowWidth/2-50}]}
                                                     onPress={() => updateToggleCollapsed(!toggleCollapsed)}>
            <KamlepayIcon style={[HomeStyles.collapsedButtonIcon, {
                transform: [{ rotate: toggleCollapsed ? '0deg' : '180deg'}]
            }]} name="arrow-down"/>
        </TouchableOpacity> : null
    };

    const renderUserNotVerified = (obj) => {
        return (
            <View style={HomeStyles.completeVerificationContainer}>
                <ProgressiveImage
                    resizeMode="contain"
                    source={require('../../assets/images/complete_verification-icon.png')}
                    style={HomeStyles.completeVerificationContainerVector}/>
                <CText style={HomeStyles.completeVerificationContainerTitle}>
                    {t(obj?.title)}
                </CText>
                <CText style={HomeStyles.completeVerificationContainerSubTitle}>
                    {t(obj?.subTitle)}
                    {obj?.thirdTitle ? ' ' + t(obj?.thirdTitle) : null}
                </CText>
                <CButton
                    title={t('GLOBAL.GO_HOME')}
                    type="outline"
                    buttonStyle={{minWidth: 200}}
                    onPress={() => navigation.navigate('home')}
                />
            </View>
        )
    };

    const config = {
        velocityThreshold: 0.2,
        directionalOffsetThreshold: 10
    };

    const renderView  = (callBack) => {
        return card && Object.keys(card).length && getCardIsActivatedOrStatus(card)?.id === cardIsActivatedStatus[2] ? callBack : null
    };
    const onSwipeUp = (gestureState) => {
        checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
            if (type === 'NAVIGATE') {
                navigation.navigate('transaction_history')
            }
        }, {
            routeName: 'transaction_history',
            isShowPopup: true,
            notCheckCardStatus: true,
        });
    };
    const renderCard = () => {
        return (
            <View style={Styles.cardContainer}>
                {reduxState?.card ? <CreditCardUi
                    activeOpacity={1}
                    card={reduxState?.card}
                    foundCardData={foundProduct(reduxState?.card?.companyProductCode) || {}}
                    onPress={() => null}
                /> : null}
            </View>
        )
    };

    function personalizeMessage(id, phoneNumber) {
        let message = `${id}` || '';
        return message.replace(/{{phone}}/g, phoneNumber);
    }
    const copyCode = (id) => {
        let  text = personalizeMessage(id, reduxState?.user?.phone);
        Clipboard.setString(text);
        handleSuccess('Code copied!')
    };

    const share = async (id) => {
        let  text = personalizeMessage(id, reduxState?.user?.phone);
        const options = {
            title: 'NaqaD',
            url:'https://kamelpay.com/',
            message: text,
        };
        try {
            await Share.open(options);
        } catch (err) {
            console.log(err);
        }
    };
    const renderCardDetail = () => {
        return (
            <View style={[HomeStyles.cardSection, {marginTop: 0, marginBottom: 15}]}>
                <View style={[HomeStyles.card, {marginBottom: 25}]}>
                    <CText style={HomeStyles.cardTitle}>{t('CARD_MANAGEMENT.CARD_DETAILS')}</CText>
                    <View style={HomeStyles.cardItem}>
                        <CText style={HomeStyles.cardItemLabel}>
                            {t('CARD_MANAGEMENT.CARDHOLDER_NAME')}
                        </CText>
                        <CText style={[HomeStyles.cardItemLabel, HomeStyles.cardItemValue]}>
                            {reduxState?.card?.emboseName}
                        </CText>
                    </View>
                    <View style={HomeStyles.cardTwoItem}>
                        <View style={[HomeStyles.cardItem, HomeStyles.flex_1]}>
                            <CText style={HomeStyles.cardItemLabel}>{t('CARD_MANAGEMENT.CARD_NUMBER')}</CText>
                            <CText style={[HomeStyles.cardItemLabel, HomeStyles.cardItemValue]}>
                                {reduxState?.card?.cardNumber}
                            </CText>
                        </View>
                        <View style={HomeStyles.cardItem}>
                            <CText style={HomeStyles.cardItemLabel}>{t('CARD_MANAGEMENT.EXPIRY')}</CText>
                            <CText style={[HomeStyles.cardItemLabel, HomeStyles.cardItemValue]}>
                                {reduxState?.card?.expiry}
                            </CText>
                        </View>
                    </View>
                    {renderTransferDetail()}
                </View>
            </View>
        )
    };
    const renderTransferDetail = () => {
        return checkServices(reduxState?.card, [SERVICES.KP_WALLET_TRANSFER._id]) ? (
            <View style={HomeStyles.cardTwoItem}>
                <View style={[HomeStyles.cardItem, HomeStyles.flex_1]}>
                    <CText style={[HomeStyles.cardItemLabel, HomeStyles.dark, HomeStyles.textBold]}>{t('RECEIPT.TRANSFER_ID')}</CText>
                    <CText style={[HomeStyles.cardItemLabel, HomeStyles.cardItemValue]}>
                        {reduxState?.card?.walletID}
                    </CText>
                </View>
                <View style={[HomeStyles.cardItem, HomeStyles.cardTwoItem]}>
                    <IconButton
                        buttonType=''
                        type="icon-with-background"
                        buttonStyle={[Styles.referralCodeCopyButton, {marginHorizontal: 10}]}
                        buttonIconStyle={Styles.referralCodeCopyButtonIcon}
                        iconName={'copy'}
                        onPress={() => copyCode(reduxState?.card?.walletID)}
                    />
                    <IconButton
                        buttonType=''
                        type="icon-with-background"
                        buttonStyle={Styles.referralCodeCopyButton}
                        buttonIconStyle={Styles.referralCodeCopyButtonIcon}
                        iconName={'share'}
                        onPress={() => share(reduxState?.card?.walletID)}
                    />
                </View>
            </View>
        ) : null
    };
    const renderCardOptions = () => {
        return (
            <View style={[HomeStyles.cardSection, {marginTop: 0}]}>
                <View style={HomeStyles.card}>
                    <Collapsible
                        innerContainerStyle={HomeStyles.homeItems}
                        collapsedHeight={85}
                        collapsed={toggleCollapsed}>
                        <MappedElement
                            data={items}
                            renderElement={renderItems}
                        />
                    </Collapsible>
                </View>
                {renderCollapsibleButton(items)}
            </View>
        )
    };
    const renderTransactionsView = () => {
        return (
            <TouchableOpacity style={GlobalStyle.swipeUpView} onPress={() => onSwipeUp()}>
                <CText style={GlobalStyle.swipeUpViewText}>
                    {t('CARD_MANAGEMENT.TAP_TO_SEE_TRANSACTIONS')}
                </CText>
                <KamlepayIcon name="arrow-up" style={GlobalStyle.swipeUpViewIcon}/>
            </TouchableOpacity>
        )
    };

    const renderActivateYouCard  = () => {
        return card && getCardIsActivatedOrStatus(card)?.id === cardIsActivatedStatus[1] ? (
            <View style={[HomeStyles.completeVerificationContainer]}>

                <CText style={HomeStyles.completeVerificationContainerTitle}>
                    {t('ACTIVATE_YOUR_CARD.TITLE')}
                </CText>

                <CText style={HomeStyles.completeVerificationContainerSubTitle}>
                    {t('ACTIVATE_YOUR_CARD.SUB_TITLE')}
                </CText>

                <CButton
                    title={t('GLOBAL.ACTIVATE')}
                    type="outline"
                    buttonStyle={{minWidth: 200}}
                    onPress={() =>
                        isMinimalUser(reduxState?.user,
                            () => {
                                userVerificationPopup(t, USER_TYPES.MINIMAL_USER._id)
                            },
                            () => {
                                requestActivateCardFunc()
                            })
                    }
                />

            </View>
        ) : null
    };

    const updateEmiratesId = () => {
        navigation.navigate('home')
    };

    const cardsManage = () => {
        dispatch(toggleCardSelectionModal(true))
    };

    const _onRefresh = () => {
        if(reduxState?.card?._id){
            let payload = {
                id: reduxState?.card?._id
            };
            dispatch(getCardById(payload))
        }
    };

    const pullToRefreshCardStatusView = () => {
        return !checkCardIsActive(reduxState?.card) ? (
            <View style={[HomeStyles.pullToRefreshToCardStatus, {marginTop: 10}]}>
                <Feather
                    style={HomeStyles.pullToRefreshToCardStatusIcon}
                    name={"chevrons-down"}
                />
                <CText style={HomeStyles.pullToRefreshToCardStatusText}>
                    {t('GLOBAL.CHECK_CARD_STATUS_TO_SWIPE_DOWN')}
                </CText>
            </View>
        ) : null
    };

    return (
        <Container
            edges={['left', 'right']}
            loading={reduxState.loading}
            headerProps={headerProps}
            scrollView={true}
            scrollViewProps={{
                contentContainerStyle: Styles.scrollContainer,
                ...checkIsAppUserOrRegisterDevice(
                    reduxState?.user,
                    () => {
                        return {
                            refreshControl: <RefreshControl
                                refreshing={reduxState?.getCardByIdLoading || false}
                                onRefresh={_onRefresh}
                            />
                        }
                    }
                )
            }}>
            {checkIsAppUserOrRegisterDevice(
                reduxState?.user,
                (obj) => {
                    return (
                        reduxState?.user?.status !== 'INACTIVE' ? checkEmiratesIDExpiry?.cardManagementBlock && checkEmiratesIDExpiry?.appBlock
                            ? yourEmiratesIDExpire(t, updateEmiratesId, "GLOBAL.GO_HOME") : reduxState?.user?.cards?.length ? <Fragment>
                                <View style={Styles.scrollContainer}>
                                    {pullToRefreshCardStatusView()}
                                    {renderCard()}
                                    {renderView(renderCardDetail())}
                                    {renderView(renderCardOptions())}
                                    {renderActivateYouCard()}
                                    {renderYourCardIsOnItsWay(t, card)}

                                    <View style={[GlobalStyle.listFooterButton, {marginTop: 0, marginHorizontal: 0, paddingHorizontal: 30}]}>
                                        {renderView(renderTransactionsView())}

                                        <CButton title={t('CARD_MANAGEMENT.MANAGE_CARDS')}
                                                                                    disabled={reduxState.loading}
                                                                                    onPress={() => cardsManage()}/>

                                    </View>

                                </View>

                            </Fragment> :  <AddNewCardView /> : renderUserNotVerified(obj)
                    )
                },
                (obj) => {
                    return renderUserNotVerified(obj)
                }
            )}


        </Container>
    )
}

export default React.memo(CardManagement)
