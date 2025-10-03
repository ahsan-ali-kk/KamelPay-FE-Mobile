import React, {useEffect, useState} from "react";
import {View, ScrollView} from "react-native";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import Style from "../../topUp/TopUp.style";
import {CButton, Receipt, CText, ProgressiveImage, CheckBox} from "../../../uiComponents";
import {formatAmount, FormatNumberWithCommas, MappedElement, openDialScreen} from "../../../utils/methods";
import Popup from "../../../uiComponents/popup/Popup";
import {useTranslation} from "react-i18next";
import events from "../../../utils/events";
import {sendOtp} from "../../../store/actions/Global.action";
import {createSubscription, getUserSubscriptions} from "../../../store/actions/UserSubscriptions.action";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Overview(props) {

    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();

    const { route: { params: data}, navigation} = props;


    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CONFIRMATION'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global, userSubscriptions}) => {
        return {
            loading: userSubscriptions.createSubscriptionLoading,
            card: global.selectedCard,
            user: auth.user,
            buttonLoading: global?.sendOtpLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [ticketPayload, updateTicketPayload] = useState({});
    const [termsAndCondition, updateTermsAndCondition] = useState(false);
    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);

    useEffect(() => {
        let e = events.addEventListener("verifyOtpCallBack", (res) => {
            handleSubmit()
        });

        return () => {
            events.removeListener('verifyOtpCallBack', e);
        }
    }, []);

    const submit = () => {
        dispatch(sendOtp({}, res => sendOtpCallBack(res)))
    };

    const sendOtpCallBack = (res) => {
        if(!res.error) {
            // navigation.goBack()
            navigation.navigate('card_management_otp', res)

        }
    };

    const navigationReset = () => {
        Popup.hide();
        navigation.goBack();
        // navigation.reset({
        //     index: 0,
        //     routes: [{name: 'subscriptions'}],
        // });
    };

    const contactUs = () => {
        Popup.hide();
        openDialScreen();
        navigationReset();
    };

    const callBack = (res, payload) => {
        if(res?.error){
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: res?.data?.message || t('POPUPS.ERROR.TITLE'),
                text: t('POPUPS.ERROR.SUB_TITLE'),
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () => navigationReset()
                    },
                    {
                        text: t('GLOBAL.CONTACT_US'),
                        callback: () => contactUs()
                    }
                ]
            })
        } else {
            dispatch(getUserSubscriptions({
                cardId: reduxState?.card?._id
            }));
            updateTicketPayload({
                message: res?.data?.message,
                amountInAED: res?.data?.totalAmount,
                ...payload
            });

        }
    };

    const onClose = () => {
        navigationReset();
        updateTicketPayload({})
    };

    const handleSubmit = () => {
        let payload = {
            subscriptionId: data?.subscription?.subscriptionId,
            cardId: data?.card?._id,
        };
        dispatch(createSubscription(payload, callBack))
    };

    const generateReceiverDetail = () => {
        let info = [];

        let obj = {
            ...(data && data?.subscription),
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
        };


        if(obj?.title) {
            info.push({
                Name: "Subscription",
                value: obj?.title
            })
        }
        if(obj?.description) {
            info.push({
                Name: "Description",
                value: obj?.description
            })
        }

        if(obj?.Card) {
            info.push({
                Name: t('RECEIPT.CARD'),
                value: obj?.Card
            })
        }

        return info
    };

    const generateTransferAmountAndCharges = () => {
        let info = [];

        let obj = {
            ...(data && data?.subscription),
        };

        console.log('obj', obj, selectedCountry);

        if(obj?.amountInAED){
            info.push({
                // Name: t('RECEIPT.PURCHASE_AMOUNT'),
                Name: 'Subscription Charges',
                value: formatAmount(obj?.amountInAED, Object.keys(selectedCountry?.currencies)),
                separate: true
            });
        }

        if(obj?.totalFee) {
            info.push({
                Name: t('RECEIPT.CHARGES'),
                value: formatAmount(obj?.totalFee, Object.keys(selectedCountry?.currencies))
            })
        }

        if(obj?.totalVat) {
            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.totalVat, Object.keys(selectedCountry?.currencies))
            })
        }

        return info
    };

    const generateSendToInfo = () => {
        return [
            ...generateReceiverDetail(),
            ...generateTransferAmountAndCharges(),
        ]
    };

    const renderListItem = (label, value) => {
        return (
            <View key={value} style={Style.confirmInfoListItem}>
                <CText style={Style.confirmInfoListItemText}>
                    {label}
                </CText>
                <CText style={[Style.confirmInfoListItemText, Style.textRight]}>
                    {value}
                </CText>
            </View>
        )
    };

    const renderHeader = () => {
        return (
            <View style={Style.confirmHeader}>
                <ProgressiveImage style={Style.confirmHeaderImage}
                                  source={require('../../../assets/images/voucher-vector.png')}
                />
                <CText style={Style.confirmHeaderTitle}>{data?.subscription?.title}</CText>
            </View>
        )
    };

    const gteFooterBottomSpace = (val) => {
        return val ? val : 30
    };

    const renderFooter = () => {
        return (
            <View style={[Style.grayBottomButtonContainer, {paddingBottom: gteFooterBottomSpace(insets.bottom)}]}>
                <CheckBox
                    value={termsAndCondition}
                    onChange={() => updateTermsAndCondition(!termsAndCondition)}
                    title={t('GLOBAL.AGREE')}
                    clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                />
                <CButton buttonStyle={Style.bottomButton}
                         disabled={!termsAndCondition || reduxState?.buttonLoading}
                         loading={reduxState.buttonLoading}
                         onPress={() => submit()}
                         title={t('GLOBAL.PAY_NOW')}/>
            </View>
        )
    };

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            headerProps={headerProps}
            loading={reduxState.loading}
            scrollView={true}
            renderFooter={renderFooter}>

            {renderHeader()}

            <View style={Style.confirmInfoScrollView}>

                    <CText style={Style.confirmInfoListHeaderText}> {t('RECEIPT.DETAILS_AND_INFORMATION')} </CText>

                    <MappedElement
                        data={generateReceiverDetail()}
                        renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                    <View style={Style.confirmInfoListNormalSeparator}/>

                    <CText style={Style.confirmInfoListHeaderText}>
                        {t('RECEIPT.AMOUNT_AND_CHARGES')}
                    </CText>

                    <MappedElement
                        data={generateTransferAmountAndCharges()}
                        renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                    <View style={Style.confirmInfoListSeparator}/>

                <View style={[Style.confirmInfoListItem, Style.confirmInfoLastListItem]}>
                        <CText style={[Style.confirmInfoListItemText, Style.textBold]}>
                            {t('RECEIPT.TOTAL_AMOUNT')}
                        </CText>
                        <FormatNumberWithCommas
                            value={data?.subscription?.totalAmount || 0}
                            currency={Object.keys(selectedCountry?.currencies)}
                            styleAmount={[Style.confirmInfoListItemText, Style.textBold, Style.textRight, Style.primaryText]}
                            numberOfLines={1}
                        />
                    </View>

                </View>

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={() => onClose()}
                data={ticketPayload}
                infoUpperTitle=""
                senTo={generateSendToInfo(ticketPayload)}
            />

        </Container>
    )
}

export default React.memo(Overview)
