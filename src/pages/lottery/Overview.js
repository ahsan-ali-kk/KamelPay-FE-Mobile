import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Container, ReferralCode} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import Style from "../topUp/TopUp.style";
import {CButton, Receipt, CText, ProgressiveImage, CheckBox, CInput, AlertView} from "../../uiComponents";
import {formatAmount, FormatNumberWithCommas, MappedElement, openDialScreen, SERVICES} from "../../utils/methods";
import Popup from "../../uiComponents/popup/Popup";
import {useTranslation} from "react-i18next";
import {sendOtp} from "../../store/actions/Global.action";
import {processPayment, getFeesAndVat} from "../../store/actions/Lottery.action";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useAppReview} from "../../hooks";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


function Overview(props) {

    const { t, i18n } = useTranslation();
    const { onReview } = useAppReview();
    const insets = useSafeAreaInsets();

    const { route: { params: data}, navigation } = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CONFIRMATION'),
        headerRight: true,
    };

    const reduxState = useSelector(({lottery, global}) => {
        return {
            loading: lottery?.processPaymentLoading || lottery.getFeesAndVatLoading,
            buttonLoading: global.sendOtpLoading,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
            getFeesAndVatLoading: lottery.getFeesAndVatLoading,
            feesAndVat: lottery.feesAndVat,
        }
    });

    const {feesAndVat, getFeesAndVatLoading, card} = reduxState;

    const [ticketPayload, updateTicketPayload] = useState({});
    const [termsAndCondition, updateTermsAndCondition] = useState(false);
    const [promo, setPromo] = useState(feesAndVat?.promoDetails?.promo || '');
    const [promoError, setPromoError] = useState('');

    useEffect(() => {
        feeAndVat(promo);
    }, []);

    useEffect(() => {
        if(data?.whereToComeFrom === 'OTP'){
            handleSubmit()
        }
    }, [data]);

    const feeAndVat = (promocode) => {
        let payload = {
            productId: data?.product_id,
            Quantity: data?.quantity,
            walletID: card?.walletID,
            ...(promocode && {Promocode: promocode})
        };
        dispatch(getFeesAndVat(payload, getFeesAndVatCallback))
    };
    const getFeesAndVatCallback = (res) => {
        setPromoError(res?.promoError || '')
    };

    const applyPromo = () => {
        feeAndVat(promo)
    };
    const removePromo = () => {
        feeAndVat();
        setPromoError('');
        setPromo('');
    };

    const submit = () => {
        dispatch(sendOtp({}, res => sendOtpCallBack(res)))
    };

    const sendOtpCallBack = (res) => {
        if(!res.error) {
            navigation.replace('lottery_otp', {
                ...res,
                overviewData: data,
                flow: 'WITHOUT_OTP_DATA',
                screen: 'lottery_overview',
                promoCode: promo
            })
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
                message: res?.data?.message,
                amountInAED: res?.data?.totalAmount,
                ticketNumber: res?.data?.ticketNumber,
                ...(res?.data?.userScratchCard && {
                    userScratchCard: res?.data?.userScratchCard
                }),
                ...payload
            });
            // trackTransaction(payload, res?.data)

        }
    };

    const trackTransaction = (payload, res) => {
        // let receiverDetail = {
        //     biller: data?.biller,
        //     card: reduxState?.card,
        //     inputs: data?.io,
        //     transactionType: data?.payloadSend?.TransactionType,
        //     ...(data?.payloadSend?.Amount && {amount: data?.payloadSend?.Amount}),
        //     ...(data?.payloadSend?.Currency && {currency: data?.payloadSend?.Currency}),
        //     feeAndVat: res,
        //     isBeneficiary: data?.pageType === 'beneficiary' ? isBeneficiaryConstant[0] : payload?.AddBeneficiary ? isBeneficiaryConstant[1] : isBeneficiaryConstant[2],
        //     ...(data?.Alias && {alias: data?.Alias}),
        //     ...(payload?.Alias && {alias: payload?.Alias}),
        // };
        // console.log('receiverDetail', receiverDetail)
        // payBillEvent(receiverDetail, payload)
    };

    const navigationReset = () => {
        Popup.hide();
        onReview();
        navigation.reset({
            index: 0,
            routes: [{name: 'Lottery'}],
        });
    };

    const onClose = (val) => {
        if(!val) {
            navigationReset();
        }
        updateTicketPayload({});
        removePromo();
    };

    const handleSubmit = () => {
        let payload = {
            CampaignID: data?.product_id,
            CardId: reduxState?.card?._id,
            Quantity: data?.quantity
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

    const generateReceiverDetail = () => {
        let info = [];

        let obj = {
            ...(data && data),
            ...(ticketPayload && ticketPayload),
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
        };

        if(obj?.c_productName) {
            info.push({
                Name: t('RECEIPT.PRODUCT_NAME'),
                value: obj?.c_productName
            })
        }
        if(obj?.c_prizeTitle) {
            info.push({
                Name: t('RECEIPT.PRIZE'),
                value: obj?.c_prizeTitle
            })
        }

        if(obj?.ticketNumber) {
            let string = obj?.ticketNumber.toString();
            info.push({
                Name: t('RECEIPT.TICKET_NUMBERS'),
                value: string.replaceAll(',', '\n')
            })
        }

        if(obj?.Card) {
            info.push({
                Name: t('RECEIPT.CARD'),
                value: obj?.Card
            })
        }
        if(obj?.quantity) {
            info.push({
                Name: t('RECEIPT.QUANTITY'),
                value: obj?.quantity
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

        if(obj?.feesAndVat?.amountInAED) {
            info.push({
                Name: t('RECEIPT.PURCHASE_AMOUNT'),
                value: `${formatAmount(obj?.feesAndVat?.amountInAED, obj?.feesAndVat?.Currency || 'AED')}`,
                separate: true
            });
        }

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

        // if(feesAndVat?.offerDetails?.title){
        //     info.push({
        //         Name: t('RECEIPT.OFFER'),
        //         value: feesAndVat?.offerDetails?.title
        //     });
        // }

        if(feesAndVat?.promoDetails?.promo) {
            info.push({
                Name: t('RECEIPT.PROMO_CODE'),
                value: feesAndVat?.promoDetails?.promo
            })
        }

        if(feesAndVat?.mode && feesAndVat?.discountAmount) {
            info.push({
                Name: t(`RECEIPT.${feesAndVat?.mode}`),
                value: `${feesAndVat?.mode === 'DISCOUNT' ? '-' : ''} ${formatAmount(feesAndVat?.discountAmount)} AED` || 0
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

    const renderHeader = () => {
        return (
            <View style={Style.confirmHeader}>
                <ProgressiveImage style={[Style.confirmHeaderImage, {width: 150}]}
                                  source={{uri: data?.c_campaignImages?.prize?.httpsURL}}
                                  fallback
                                  resizeMode={'contain'}
                                  defaultSource={require('../../assets/images/others.png')}
                />
                <CText style={Style.confirmHeaderTitle}>{data?.c_prizeTitle}</CText>
            </View>
        )
    };

    const gteFooterBottomSpace = (val) => {
        return val ? val : 30
    };

    const renderFooter = () => {
        return  (
            <View style={[Style.grayBottomButtonContainer, {paddingBottom: gteFooterBottomSpace(insets.bottom)}]}>
                <CheckBox
                    value={termsAndCondition}
                    onChange={() => updateTermsAndCondition(!termsAndCondition)}
                    title={`${t('GLOBAL.AGREE')} `}
                    clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                    // clickAbleTextFunc={() => updateIsOpen(true)}
                />
                <CButton buttonStyle={Style.bottomButton}
                         disabled={!termsAndCondition || !reduxState?.feesAndVat?.totalAmount || reduxState?.buttonLoading}
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
            scrollViewProps={{
                contentContainerStyle: {
                    flexGrow: 1
                }
            }}
            renderFooter={renderFooter}
        >

            {renderHeader()}

            <View style={Style.confirmInfoScrollView}>


                <CText style={Style.confirmInfoListHeaderText}>{t('RECEIPT.DETAILS_AND_INFORMATION')} </CText>

                <MappedElement
                    data={generateReceiverDetail()}
                    renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                <View style={Style.confirmInfoListNormalSeparator}/>

                {feesAndVat?.offerDetails?.title ? <AlertView viewStyle={{marginTop: 10, marginBottom: 10}} text={feesAndVat?.offerDetails?.title} type='offers' /> : null}

                <CInput
                    inputLabel={t('FIELDS_LABELS.DISCOUNT_CODE')}
                    inputContainerStyle={{marginTop: 10, marginBottom: 5}}
                    placeholder={t('FIELDS_LABELS.DISCOUNT_CODE_PLACEHOLDER')}
                    value={promo}
                    onChangeText={val => {
                        setPromoError('');
                        setPromo(val)
                    }}
                    editable={!getFeesAndVatLoading && !feesAndVat?.promoDetails?.promo}
                    error={promoError}
                    rightButton={() => {
                        return (
                            <CButton
                                buttonStyle={GlobalStyle.inputRightButton}
                                buttonText={GlobalStyle.inputRightButtonText}
                                disabled={getFeesAndVatLoading}
                                title={getFeesAndVatLoading ? '' : feesAndVat?.promoDetails?.promo ? t('GLOBAL.REMOVE') : t('GLOBAL.APPLY')}
                                loading={getFeesAndVatLoading}
                                onPress={() => feesAndVat?.promoDetails?.promo ? removePromo() : applyPromo()}
                            />
                        )
                    }}
                    onBlur={() => feesAndVat?.promoDetails?.promo ? removePromo() : applyPromo()}
                    onSubmitEditing={() => feesAndVat?.promoDetails?.promo ? removePromo() : applyPromo()}
                />

                <ReferralCode
                    inputContainerStyle={{marginBottom: 10, marginTop: 10}}
                    service={SERVICES.LOTTERY._id}
                />

                <CText style={Style.confirmInfoListHeaderText}>
                    {t('RECEIPT.TRANSACTION_DETAILS')}
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
                        value={reduxState?.feesAndVat?.totalAmount || 0}
                        // fractionDigits={3}
                        currency={data?.c_currency}
                        styleAmount={[Style.confirmInfoListItemText, Style.textBold, Style.textRight, Style.primaryText]}
                        numberOfLines={1}
                    />
                </View>

            </View>

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={(val) => onClose(val)}
                data={ticketPayload}
                infoUpperTitle=""
                // fractionDigits={3}
                senTo={generateSendToInfo(ticketPayload)}
            />

        </Container>
    )
}

export default React.memo(Overview)
