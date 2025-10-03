import React, {useEffect, useState} from "react";
import {View, ScrollView} from "react-native";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {processPayment} from "../../store/actions/DtOne.action";
import Style from "../topUp/TopUp.style";
import {CButton, Receipt, CText, ProgressiveImage, CheckBox} from "../../uiComponents";
import {formatAmount, FormatNumberWithCommas, MappedElement, openDialScreen} from "../../utils/methods";
import Popup from "../../uiComponents/popup/Popup";
import {useTranslation} from "react-i18next";
import events from "../../utils/events";
import {sendOtp} from "../../store/actions/Global.action";
import {getFeesAndVat} from "../../store/actions/DtOne.action";
import {useAppReview} from "../../hooks";

function Overview(props) {

    const { t, i18n } = useTranslation();
    const { onReview } = useAppReview();
    const { route: { params: data}, navigation } = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CONFIRMATION'),
        headerRight: true,
    };

    const reduxState = useSelector(({dtOne, global}) => {
        return {
            loading: dtOne.processPaymentLoading || dtOne.getFeesAndVatLoading,
            card: global.selectedCard,
            otpLoading: global.sendOtpLoading,
            currentCountry: global.currentCountry,
            getFeesAndVatLoading: dtOne.getFeesAndVatLoading,
            feesAndVat: dtOne.feesAndVat,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);
    const [ticketPayload, updateTicketPayload] = useState({});
    const [termsAndCondition, updateTermsAndCondition] = useState(false);

    useEffect(() => {
        feeAndVat();
        let e = events.addEventListener("verifyOtpCallBack", (res) => {
            handleSubmit()
        });
        return () => {
            events.removeListener('verifyOtpCallBack', e);
        }
    }, []);


    const feeAndVat = () => {
        let payload = {
            ProductId: data?.card?.id,
            Amount: data?.card?.amount,
        };
        dispatch(getFeesAndVat(payload))
    };

    const submit = () => {
        dispatch(sendOtp({}, res => sendOtpCallBack(res)))
    };

    const sendOtpCallBack = (res) => {
        if(!res.error) {
            navigation.navigate('dt_one_otp', res)
        }
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
            updateTicketPayload({
                ...res?.data,
                amountInAED: res?.data?.amountInAED,

            })
        }
    };

    const navigationReset = () => {
        Popup.hide();
        onReview();
        navigation.reset({
            index: 0,
            routes: [{name: 'Dt_One'}],
        });
    };

    const onClose = (val) => {
        if(!val) {
            navigationReset();
        }
        updateTicketPayload({})
    };

    const handleSubmit = () => {
        let payload = {
            ProductId: data?.card?.id,
            Amount: data?.card?.Amount,
            CardId: reduxState?.card?._id
        };
        dispatch(processPayment(payload, callBack))
    };

    const renderListItem = (label, value) => {
        return (
            <View style={Style.confirmInfoListItem}>
                <CText style={Style.confirmInfoListItemText}>
                    {label}
                </CText>
                <CText style={[Style.confirmInfoListItemText, Style.textRight]}>
                    {value}
                </CText>
            </View>
        )
    };

    const generateReceiverDetail = (res) => {
        let info = [];

        let obj = {
            ...(data && data),
        };

        if(obj?.card?.name) {
            info.push({
                Name: t('RECEIPT.CARD_NAME'),
                value: obj?.card?.name
            })
        }

        if(obj?.card?.description) {
            info.push({
                Name: t('RECEIPT.DESCRIPTION'),
                value: obj?.card?.description
            })
        }


        return info
    };

    const generateTransferAmountAndCharges = () => {
        let info = [];

        let obj = {
            ...(data && data),
            feesAndVat: reduxState?.feesAndVat
        };

        info.push({
            Name: t('RECEIPT.PURCHASE_AMOUNT'),
            value: formatAmount(obj?.card?.amount, Object.keys(selectedCountry?.currencies)),
            separate: true
        });

        if(obj?.feesAndVat?.totalFee) {
            info.push({
                Name: t('RECEIPT.CHARGES'),
                value: `${formatAmount(obj?.feesAndVat?.totalFee, obj?.c_currency)}`
            });
        }

        if(obj?.feesAndVat?.totalVat) {
            info.push({
                Name: t('RECEIPT.VAT'),
                value: `${formatAmount(obj?.feesAndVat?.totalVat, obj?.c_currency)}`
            });
        }


        return info
    };

    const generateSendToInfo = (res) => {
        return [
            ...generateReceiverDetail(res),
            ...generateTransferAmountAndCharges(),
        ]
    };

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            headerProps={headerProps}>

            <View style={Style.confirmHeader}>
                <ProgressiveImage style={Style.confirmHeaderImage}
                                  source={require('../../assets/images/voucher-vector.png')}
                />
                {/*<CText style={Style.confirmHeaderTitle}>{data?.sku?.name}</CText>*/}
                <CText style={Style.confirmHeaderTitle}>{data?.card?.name}</CText>
            </View>

            <Container
                edges={['left', 'right', 'bottom']}
                loading={reduxState.loading}
                SafeAreaViewStyle={Style.confirmScroll}>
                <ScrollView contentContainerStyle={Style.confirmInfoScrollView}>


                    <CText style={Style.confirmInfoListHeaderText}>
                        {t('RECEIPT.DETAILS_AND_INFORMATION')}
                    </CText>

                    <MappedElement
                        data={generateReceiverDetail()}
                        renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                    <View style={Style.confirmInfoListNormalSeparator}/>

                    <CText style={Style.confirmInfoListHeaderText}>
                        {t('RECEIPT.TRANSFER_AMOUNT_AND_CHARGES')}
                    </CText>

                    <MappedElement
                        data={generateTransferAmountAndCharges()}
                        renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                    <View style={Style.confirmInfoListSeparator}/>

                    <View style={Style.confirmInfoListItem}>
                        <CText style={[Style.confirmInfoListItemText, Style.textBold]}>
                           {t('RECEIPT.TOTAL_AMOUNT')}
                        </CText>
                        <FormatNumberWithCommas
                            value={reduxState?.feesAndVat?.totalAmount || 0}
                            currency={Object.keys(selectedCountry?.currencies)}
                            styleAmount={[Style.confirmInfoListItemText, Style.textBold, Style.textRight, Style.primaryText]}
                            numberOfLines={1}
                        />
                    </View>

                </ScrollView>

                <View style={[Style.bottomButtonContainer, {marginTop: 0}]}>
                    <CheckBox
                        value={termsAndCondition}
                        onChange={() => updateTermsAndCondition(!termsAndCondition)}
                        title={t('GLOBAL.AGREE')}
                        clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                        // clickAbleTextFunc={() => updateIsOpen(true)}
                    />
                    <CButton buttonStyle={Style.bottomButton}
                             disabled={!termsAndCondition}
                             loading={reduxState.loading || reduxState?.otpLoading}
                             onPress={() => submit()}
                             title='Pay Now'/>
                </View>
            </Container>

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={(val) => onClose(val)}
                data={ticketPayload}
                infoTitle={t('RECEIPT.INFORMATION')}
                infoUpperTitle=""
                senTo={generateSendToInfo(ticketPayload)}
            />

        </Container>
    )
}

export default React.memo(Overview)
