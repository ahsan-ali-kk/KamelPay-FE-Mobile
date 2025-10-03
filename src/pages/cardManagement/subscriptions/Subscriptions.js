import React, {useEffect, useState} from "react";
import {RefreshControl, View} from "react-native";
import AuthStyle from "../../auth/Auth.style";
import {Container} from "../../../containers";
import {CText, CToggleSwitch} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import Styles from "./Subscriptions.style";
import {formatAmount, MappedElement} from "../../../utils/methods";
import Popup from "../../../uiComponents/popup/Popup";
import moment from "moment";
import {checkUserAndCardStatus} from "../../home/Home";
import {getUserSubscriptions, unsubscribeSubscription} from "../../../store/actions/UserSubscriptions.action";
import {isBefore} from "../../../utils/dateHelper";

function Subscriptions(props) {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {navigation} = props;
    const [disabledOptions, updateDisabledOption] = useState([]);

    const reduxState = useSelector(({userSubscriptions, global, auth}) => {
        return {
            data: userSubscriptions.subscriptions,
            loading: userSubscriptions.getSubscriptionsLoading || userSubscriptions.unsubscribeSubscriptionLoading,
            currentCountry: global.currentCountry,
            card: global.selectedCard,
            user: auth.user,
        }
    });

    const get = () => {
        let payload = {
            cardId: reduxState?.card?._id
        };
        dispatch(getUserSubscriptions(payload));
    };

    useEffect(() => {
        if(!reduxState?.data?.length){
            get()
        }
    }, []);

    const headerProps = {
        headerRight: true,
    };

    const toggleSubscription = (item) => {
        confirm(item)
    };

    const navigate = (item) => {
        checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
            if(type === 'NAVIGATE') {
                navigation.navigate('card_subscriptions_overview', {
                    card: reduxState?.card,
                    subscription: item
                })
            }
        }, {
            routeName: 'card_subscriptions_overview',
            isShowPopup: true
        });
    };

    const unsubscribe = (item) => {
        let payload = {
            cardId: reduxState?.card?._id,
            subscriptionId: item?.subscriptionId
        };
        dispatch(unsubscribeSubscription(payload, unsubscribeCallBack))
    };
    const unsubscribeCallBack = () => {
        get();
    };

    const checkAllInOneIsActive = (data) => {
        let found = data?.find(a => a?.type === 'ALL_IN_ONE');
        if(found && (found.isSubscribed || !found.isExpired)) {
            updateDisabledOption(['BALANCE_TRANSACTION_CHECK', 'TRANSACTIONAL_SMS', 'CREDIT_SMS']);
        } else {
            let foundTransactionalSms = data?.find(a => a?.type === 'TRANSACTIONAL_SMS');
            if(foundTransactionalSms && (foundTransactionalSms.isSubscribed || !foundTransactionalSms.isExpired)) {
                updateDisabledOption(['CREDIT_SMS']);
            } else {
                updateDisabledOption([]);
            }
        }
    };

    useEffect(() => {
        if(reduxState?.data?.length){
            checkAllInOneIsActive(reduxState?.data)
        } else {
            updateDisabledOption([]);
        }
    }, [reduxState?.data]);

    const confirm = (item) => {
        let subscribe = item?.isSubscribed;
        if(subscribe) {
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'Warning',
                title: 'Are you sure!',
                text: `Do you want to unsubscribe this subscription?`,
                actions: [
                    {
                        text: t('GLOBAL.YES'),
                        callback: () => {
                            Popup.hide();
                            unsubscribe(item)
                        }
                    },
                    {
                        text: t('GLOBAL.NO'),
                        callback: () => {
                            Popup.hide();
                        }
                    },
                ]
            })
        } else {
            navigate(item)
        }
    };

    const renderExpiry = (val, isExpired) => {
        return isExpired || val ? (
            <View style={[Styles.listItemTag, Styles.redTag]}>
                <CText style={[Styles.listItemTagText, Styles.redTagText]}>
                    {isExpired ? 'Expired' : `Expiry : ${moment(val).format('DD/MM/YYYY')}`}
                </CText>
            </View>
        ) : null
    };

    const renderListItem = (item, index) => {
        let isExpired = isBefore(item?.expiryDate, moment());
        return (
            <View key={index} style={Styles.listItem}>
                <View style={Styles.listItemContent}>
                    <CText style={Styles.listItemTitle}>
                        {item?.title}
                    </CText>
                    <CText style={Styles.listItemText}>
                        {item?.description}
                    </CText>
                    {renderExpiry(item?.expiryDate, isExpired)}
                </View>
                <View style={Styles.listItemContentEnd}>
                    <View style={[Styles.listItemTag, Styles.margin_bottom_10]}>
                        <CText style={Styles.listItemTagText}>
                            {formatAmount(item?.amountInAED, 'AED')}
                        </CText>
                    </View>
                    <CToggleSwitch style={{}}
                                   onToggle={() => toggleSubscription(item)}
                                   disabled={disabledOptions.includes(item?.type)}
                                   // disabled={true}
                                   isOn={isExpired ? false : item?.isSubscribed} />
                </View>
            </View>
        )
    };
    const renderList = () => {
        return (
            <View style={Styles.list}>
                <MappedElement
                    data={reduxState?.data}
                    renderElement={renderListItem}
                />
            </View>
        )
    };

    const _onRefresh = () => {
        get()
    };

    return (
        <Container headerProps={headerProps}
                   loading={reduxState?.loading}
                   scrollView={true}
                   scrollViewProps={{
                       contentContainerStyle: [AuthStyle.scrollContainer, {paddingHorizontal: 30}],
                       refreshControl: <RefreshControl
                           refreshing={false}
                           onRefresh={_onRefresh}
                       />
                   }}
        >
            <View style={[AuthStyle.titleAndText, Styles.textContent]}>
                <CText style={AuthStyle.title}>
                    Subscriptions
                    {/*{t('CARD_MANAGEMENT.TITLE')}*/}
                </CText>
                <CText style={AuthStyle.text}>
                    Review or activate your subscriptions
                </CText>
            </View>
            {renderList()}
        </Container>
    )
}
export default Subscriptions;
