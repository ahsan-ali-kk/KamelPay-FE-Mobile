import React, {useEffect, useState} from "react";
import {RefreshControl, View} from "react-native";
import AuthStyle from "../../auth/Auth.style";
import {Container} from "../../../containers";
import {CText, CToggleSwitch} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import Styles from "../subscriptions/Subscriptions.style";
import {formatAmount, MappedElement} from "../../../utils/methods";
import Popup from "../../../uiComponents/popup/Popup";
import {checkCardSubscriptionStatus, updateCardSubscriptionStatus} from "../../../store/actions/CardManagement.action";

function OtherSubscriptions() {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [subscriptions, setSubscriptions] = useState([
        {
            title: 'SMS / Card Services',
            amountInAED: 3,
            description: 'Yor are not subscribed.',
            isSubscribed: false
        }
    ]);

    const reduxState = useSelector(({global, auth, cardManagement}) => {
        return {
            loading: cardManagement?.checkCardSubscriptionStatusLoading || cardManagement?.updateCardSubscriptionLoading,
            checkCardSubscriptionStatusLoading: cardManagement?.checkCardSubscriptionStatusLoading,
            currentCountry: global.currentCountry,
            card: global.selectedCard,
            user: auth.user,
        }
    });

    const get = () => {
        if(reduxState?.card){
            let payload = {
                id: reduxState?.card?._id
            };
            dispatch(checkCardSubscriptionStatus(payload, statusCallBack))
        }
    };

    const statusCallBack = (res) => {
        let array = subscriptions;
        if(array?.length){
            array.forEach((obj) => {
                obj.isSubscribed = res?.status,
                obj.description = `Yor are ${res?.status ? '' : 'not '}subscribed.`
            })
        }
        setSubscriptions(array);
    };

    useEffect(() => {
        get()
    }, []);

    const headerProps = {
        headerRight: true,
    };

    const toggleSubscription = (item) => {
        confirm(item)
    };


    const unsubscribeOrSubscribe = (item) => {
        let payload = {
            id: reduxState?.card?._id
        };

        if(item?.isSubscribed){
            payload.status = false
        } else {
            payload.status = true
        }

        dispatch(updateCardSubscriptionStatus(payload, unsubscribeOrSubscribeCallBack));
    };

    const unsubscribeOrSubscribeCallBack = () => {
        get();
    };

    const confirm = (item) => {
        let subscribe = item?.isSubscribed;
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Warning',
            title: 'Are you sure!',
            text: `Do you want to ${subscribe ? 'unsubscribe' : 'subscribe' } this subscription?`,
            actions: [
                {
                    text: t('GLOBAL.YES'),
                    callback: () => {
                        Popup.hide();
                        unsubscribeOrSubscribe(item)
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
    };

    const renderListItem = (item, index) => {
        return (
            <View key={index} style={Styles.listItem}>
                <View style={Styles.listItemContent}>
                    <CText style={Styles.listItemTitle}>
                        {item?.title}
                    </CText>
                    {item?.description ? <CText style={Styles.listItemText}>
                        {item?.description}
                    </CText> : null}

                </View>
                <View style={Styles.listItemContentEnd}>
                    <View style={[Styles.listItemTag, Styles.margin_bottom_10]}>
                        <CText style={Styles.listItemTagText}>
                            {formatAmount(item?.amountInAED, 'AED')}
                        </CText>
                    </View>
                    <CToggleSwitch style={{}}
                                   onToggle={() => toggleSubscription(item)}
                                   disabled={false}
                                   isOn={item?.isSubscribed} />
                </View>
            </View>
        )
    };
    const renderList = () => {
        return (
            <View style={Styles.list}>
                <MappedElement
                    data={subscriptions}
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
                </CText>
                <CText style={AuthStyle.text}>
                    Review or activate your subscriptions
                </CText>
            </View>
            {renderList()}
        </Container>
    )
}
export default OtherSubscriptions;
