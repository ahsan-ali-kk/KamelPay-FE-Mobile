import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {Container, LivenessDetection, ReferralCode, TermsAndConditionsWebView} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {getFeesAndVat, processPayment} from "../../store/actions/PayBill.action";
import Style from "../topUp/TopUp.style";
import {CButton, Receipt, CText, ProgressiveImage, CheckBox, CInput, AlertView} from "../../uiComponents";
import {
    convertToSlug,
    formatAmount,
    FormatNumberWithCommas,
    MappedElement,
    openDialScreen,
    SERVICES
} from "../../utils/methods";
import Popup from "../../uiComponents/popup/Popup";
import {iconBaseUrl} from "../../utils/intercepter";
import {useTranslation} from "react-i18next";
import events from "../../utils/events";
import {sendOtp, topupAndPaybillmentVendor} from "../../store/actions/Global.action";
import {isBeneficiaryConstant, payBillEvent} from "../../trackingEvents/UXCAM";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useAppReview} from "../../hooks";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {requestCreditPay} from "../../store/actions/CreditPay.action";
import {checkCreditPay} from "../../utils/creditPayHelper";

function Overview(props) {

    const { t, i18n } = useTranslation();
    const { onReview } = useAppReview();
    const insets = useSafeAreaInsets();
    const livenessDetectionFlowRef = useRef();
    const webViewRef = useRef();

    const { route: { params: data}, navigation } = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAY_BILL.TITLE'),
        headerRight: true,
    };

    const reduxState = useSelector(({payBill, global, creditPay}) => {
        return {
            loading: payBill.processPaymentLoading || creditPay?.requestCreditPayLoading,
            buttonLoading: global?.sendOtpLoading,
            card: global.selectedCard,
            getFeesAndVatLoading: payBill.getFeesAndVatLoading,
            feesAndVat: payBill.feesAndVat,
            currentCountry: global.currentCountry,
            masterDetails: global.masterDetails,
            populars: global.populars,
            creditPayEligibility: creditPay.creditPayEligibility,
        }
    });
    const {feesAndVat, getFeesAndVatLoading, card, currentCountry} = reduxState;

    const [selectedCountry, updateSelectedCountry] = useState(currentCountry);
    const [ticketPayload, updateTicketPayload] = useState({});
    const [termsAndCondition, updateTermsAndCondition] = useState(false);
    const [promo, setPromo] = useState(feesAndVat?.promoDetails?.promo || '');
    const [promoError, setPromoError] = useState('');
    const promoRef = useRef(null);

    useEffect(() => {
        feeAndVat(promo);
        let e;
        if(data?.pageType !== "beneficiary" || data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id) {
            e = events.addEventListener("verifyOtpCallBack", (res) => {
                if(res?.promoCode){
                    setPromo(res?.promoCode);
                    promoRef.current = res?.promoCode;
                }
                if(res?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id) {
                    newPay({}, res?.moduleType, res?.token)
                } else if(res?.moduleType !== SERVICES?.EMBEDDED_FINANCE?._id) {
                    handleSubmit();
                }
            });
        }

        return () => {
            events.removeListener('verifyOtpCallBack', e);
        }
    }, []);


    const feeAndVat = (promocode) => {
        let payload = {
            BillerID: data?.biller?.BillerID,
            Amount: getTotalAmount().amount,
            Currency: getTotalAmount().currency,
            TransactionType: "BILL_PAYMENT",
            WalletID: card?.walletID,
            ...(promocode && {Promocode: promocode}),
            ...(data?.moduleType  && {Type: SERVICES?.EMBEDDED_FINANCE?._id})
        };
        dispatch(getFeesAndVat(payload, getFeesAndVatCallback))
    };

    const getFeesAndVatCallback = (res) => {
        if(res?.promoDetails?.promo){
            setPromo(res?.promoDetails?.promo);
        }
        setPromoError(res?.promoError || '')
    };

    const applyPromo = () => {
        feeAndVat(promo)
    };
    const removePromo = () => {
        feeAndVat();
        setPromoError('');
        setPromo('');
        promoRef.current = '';
    };

    const submit = (moduleType) => {
        if(data?.pageType === "beneficiary" || moduleType === SERVICES?.EMBEDDED_FINANCE?._id) {
            handleSubmit(moduleType)
        } else {
            dispatch(sendOtp({}, res => addNewBeneficiaryFlowCallBack(res)))
        }
    };

    const addNewBeneficiaryFlowCallBack = (res) => {
        if(!res.error) {
            navigation.navigate('pay_bill_otp', {...res, promoCode: promo})
        }
    };

    const contactUs = () => {
        Popup.hide();
        openDialScreen();
        navigationReset();
    };

    const lowBalancePopup = () => {
        Popup.show({
            isVisible: true,
            showClose: false,
            type: 'Error',
            title: t("GLOBAL.LOW_BALANCE"),
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
            let resData = {...res?.data};
            if(resData?.hasLowBalance) {
                checkCreditPay(t, '', resData?.hasLowBalance, resData?.amountInAED, reduxState?.creditPayEligibility, reduxState?.card,
                    (res) => {
                        if(res === SERVICES?.EMBEDDED_FINANCE?._id){
                            navigation.replace('pay_bill_overview', {
                                ...data,
                                ...(res && {moduleType: res})
                            });
                        } else {
                            lowBalancePopup()
                        }
                    },
                    (res) => {
                        navigationReset()
                    }
                )
            } else {
                let referenceNo = (resData?.transactionCode && resData?.transactionId) ? `${resData?.transactionCode}${resData?.transactionId}` : '';
                updateTicketPayload({
                    message: resData?.message,
                    ...(resData?.embeddedFinance ? {
                        isCreditPay: true,
                        amountInAED: resData?.embeddedFinance?.totalAmount
                    } : {
                        amountInAED: resData?.totalAmount,
                    }),
                    ...(resData?.userScratchCard && {
                        userScratchCard: resData?.userScratchCard
                    }),
                    ...(referenceNo && { referenceNo: referenceNo }),
                    ...payload
                });
                trackTransaction(payload, {
                    ...resData,
                    referenceNo,
                    vendor: topupAndPaybillmentVendor['PAYKII'].id,
                    isCreditPay: !!(resData?.embeddedFinance),
                    moduleType: data?.moduleType
                });
            }
        }
    };

    const trackTransaction = (payload, res) => {
        let receiverDetail = {
            biller: data?.biller,
            card: reduxState?.card,
            inputs: data?.io,
            transactionType: data?.payloadSend?.TransactionType,
            ...(data?.payloadSend?.Amount && {amount: data?.payloadSend?.Amount}),
            ...(data?.payloadSend?.Currency && {currency: data?.payloadSend?.Currency}),
            feeAndVat: res,
            isBeneficiary: data?.pageType === 'beneficiary' ? isBeneficiaryConstant[0] : payload?.AddBeneficiary ? isBeneficiaryConstant[1] : isBeneficiaryConstant[2],
            ...(data?.Alias && {alias: data?.Alias}),
            ...(payload?.Alias && {alias: payload?.Alias}),
        };
        payBillEvent(receiverDetail, payload)
    };

    const navigationReset = () => {
        Popup.hide();
        onReview();
        if(data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id){
            navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
            });
        } else {
            navigation.reset({
                index: 0,
                routes: [{name: data?.whereToFrom === 'TOPUP' ? 'Mobile_TopUp' : 'Pay_Bill'}],
            });
        }
    };

    const onClose = (val) => {
        if(!val) {
            removePromo();
            navigationReset();
        }
        updateTicketPayload({});
    };

    //Request CreditPay Function
    const requestCreditPayFunc = () => {
        let payload = {
            cardId: reduxState.card._id,
            amount: reduxState?.feesAndVat?.amountInAED,
            ...(reduxState?.feesAndVat?.promoDetails?.promo && {
                promocode: reduxState?.feesAndVat?.promoDetails?.promo
            }),
            type: SERVICES?.EMBEDDED_FINANCE?._id
        };

        dispatch(requestCreditPay(payload, (response) => {
            navigation.navigate('pay_bill_otp', {
                token: response?.data?.token,
                cardId: reduxState?.card?._id,
                screen: 'pay_bill_overview',
                ...data
            })
        }))
    };

    const handleSubmit = (moduleType) => {
        if(moduleType === SERVICES?.EMBEDDED_FINANCE?._id){
            requestCreditPayFunc();
        } else {
            let isLivenessSupported = reduxState?.populars?.facialServices?.length ? reduxState?.populars?.facialServices?.includes(SERVICES.BILL_PAYMENT?._id) : false;
            let livenessChecks = reduxState?.masterDetails?.livenessChecks || [];
            if (isLivenessSupported && livenessChecks?.length) {
                livenessDetectionFlowRef?.current?.toggleModal();
            } else {
                newPay();
            }
        }
    };

    const newPay = (selfie = {}, moduleType = '', token = '') => {

        let updatedPayload = data?.payloadSend;

        const formData = new FormData();

        if(selfie && Object.keys(selfie).length){
            formData.append('selfie', selfie);
        }

        if(updatedPayload?.AddBeneficiary) {
            formData.append('Alias', updatedPayload?.Alias);
            formData.append('AddBeneficiary', updatedPayload?.AddBeneficiary);
        }

        if(updatedPayload?.beneficiaryId) {
            formData.append('beneficiaryId', updatedPayload?.beneficiaryId);
        }

        if(promo || promoRef?.current) {
            formData.append('Promocode', promo || promoRef?.current);
        }

        formData.append('Amount', updatedPayload?.Amount);
        formData.append('BillerID', updatedPayload?.BillerID);
        formData.append('BillerType', updatedPayload?.BillerType);
        formData.append('CardId', updatedPayload?.CardId);
        formData.append('Currency', updatedPayload?.Currency);
        formData.append('Inputs', JSON.stringify(updatedPayload?.Inputs));
        formData.append('SKU', updatedPayload?.SKU);
        formData.append('TransactionType', updatedPayload?.TransactionType);

        if(moduleType === SERVICES?.EMBEDDED_FINANCE?._id && token) {
            formData.append('type', moduleType);
            formData.append('token', token);
        }

        dispatch(processPayment(formData, callBack, {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        }))

    };

    const getIcon = () => {
        let iconUrl = `${iconBaseUrl}/${data?.biller?.CountryCode}/${convertToSlug(data?.biller?.BillerName)}.png`;
        return {
            uri: iconUrl
        }
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

    const getTotalAmount = () => {
        let a = data?.billInfo?.type ==='DIRECT_PAY' ? data?.sku?.Amount : data?.payloadSend?.Amount;
        let c = data?.billInfo?.type ==='DIRECT_PAY' ? data?.sku?.Currency : data?.payloadSend?.Currency;
        return {
            amount: Number(a).toFixed(2),
            currency: c,
            value: `${Number(a).toFixed(2)} ${c}`,
        }
    };

    const getDisplayTotalAmount = () => {
        if(reduxState?.feesAndVat?.embeddedFinance) {
            return reduxState?.feesAndVat?.embeddedFinance?.totalAmount;
        } else {
            return reduxState?.feesAndVat?.totalAmount || 0
        }

    };

    const generateReceiverDetail = (paramData) => {
        let info = [];

        let obj = {
            ...(data && data),
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
            referenceNo: paramData?.referenceNo
        };

        if(obj?.Alias || obj?.payloadSend?.Alias) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NAME'),
                value: obj?.Alias || obj?.payloadSend?.Alias
            })
        }

        if(obj?.biller?.BillerName) {
            info.push({
                Name: t('RECEIPT.BILLER_NAME'),
                value: obj?.biller?.BillerName
            })
        }

        if(obj?.biller?.BillerType) {
            info.push({
                Name: t('RECEIPT.BILLER_TYPE'),
                value: obj?.biller?.BillerType
            })
        }

        if(obj?.io) {
            info = [
                ...info,
                ...obj?.io
            ];
        }

        if(obj?.billInfo?.BillDueDate) {
            info.push({
                Name: t('RECEIPT.BILL_DUE_DATE'),
                value: obj?.billInfo?.BillDueDate
            })
        }

        if(obj?.Card) {
            info.push({
                Name: t('RECEIPT.CARD'),
                value: obj?.Card
            })
        }

        if(obj?.referenceNo) {
            info.push({
                Name: t('RECEIPT.REFERENCE'),
                value: obj?.referenceNo
            })
        }

        return info
    };

    const generateTransferAmountAndCharges = () => {
        let info = [];

        let obj = {
            ...(data && data),
            ...(reduxState?.feesAndVat && reduxState?.feesAndVat)
        };

        let a = obj?.billInfo?.type ==='DIRECT_PAY' ? formatAmount(obj?.sku?.Amount) : formatAmount(obj?.payloadSend?.Amount);
        let c = obj?.billInfo?.type ==='DIRECT_PAY' ? obj?.sku?.Currency : obj?.payloadSend?.Currency;

        if(obj?.billInfo?.BaseCurrency) {
            info.push({
                Name: t('RECEIPT.AMOUNT_DUE'),
                value: obj?.billInfo?.TotalAmountDue ? `${formatAmount(obj?.billInfo?.BillAmountDue)} ${obj?.billInfo?.SettlementCurrency}`
                    :
                    `${formatAmount(obj?.sku?.Amount)} ${obj?.sku?.Currency}`
            })
        }

        if(obj?.billInfo?.type ==='AMOUNT_IN_SKU') {
            info.push({
                Name: t('RECEIPT.AMOUNT_DUE'),
                value: `${formatAmount(obj?.sku?.Amount)} ${obj?.sku?.Currency}`
            })
        }

        info.push({
            Name: t('RECEIPT.BILL_AMOUNT'),
            value: `${a} ${c}`,
            separate: true
        });

        if(obj?.totalFee) {
            info.push({
                Name: t('RECEIPT.PLATFORM_FEE'),
                value: formatAmount(obj?.totalFee, 'AED')
            })
        }

        if(obj?.totalVat) {
            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.totalVat, 'AED')
            })
        }

        if(obj?.embeddedFinance) {
            info.push({
                Name: t("RECEIPT.PLATFORM_FEE"),
                value: formatAmount(obj?.embeddedFinance?.totalFee || 0, 'AED')
            });

            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.embeddedFinance?.totalVat || 0, 'AED')
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

    const generateSendToInfo = (obj) => {
        return [
            ...generateReceiverDetail(obj),
            ...generateTransferAmountAndCharges(),
        ]
    };

    const renderHeader = () => {
        return (
            <View style={Style.confirmHeader}>
                <ProgressiveImage style={Style.confirmHeaderImage}
                                  source={getIcon()}
                                  fallback
                                  defaultSource={require('../../assets/images/others.png')}
                />
                <CText style={Style.confirmHeaderTitle}>{data?.biller?.BillerName}</CText>
            </View>
        )
    };

    const gteFooterBottomSpace = (val) => {
        return val ? val : 30
    };

    const viewTermAndConditions = () => {
        let uri;

        if(data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id){
            uri = reduxState.masterDetails?.creditPayTermsAndConditions || ''
        } else if(reduxState.masterDetails?.paykiiTermsAndConditions){
            uri = reduxState.masterDetails?.paykiiTermsAndConditions || ''
        }

        if(uri){
            webViewRef?.current?.toggleModal({uri})
        }
    };

    const renderFooter = () => {
        return (
            <View style={[Style.grayBottomButtonContainer, GlobalStyle.topBorder, {paddingBottom: gteFooterBottomSpace(insets.bottom)}]}>
                <CheckBox
                    value={termsAndCondition}
                    onChange={() => updateTermsAndCondition(!termsAndCondition)}
                    title={`${t('GLOBAL.AGREE')} `}
                    clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                    clickAbleTextFunc={() => viewTermAndConditions()}
                />
                <CButton buttonStyle={Style.bottomButton}
                         disabled={!termsAndCondition || !reduxState?.feesAndVat?.totalAmount || reduxState?.buttonLoading || reduxState?.getFeesAndVatLoading}
                         loading={reduxState.buttonLoading}
                         onPress={() => submit(data?.moduleType)}
                         title={data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id ? t('CREDIT_PAY.CREDIT_PAY') : t('GLOBAL.PAY_NOW')}/>
            </View>
        )
    };

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            headerProps={headerProps}
            loading={(data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id ? reduxState?.getFeesAndVatLoading : false) || reduxState.loading}
            scrollView={true}
            scrollViewProps={{contentContainerStyle: {flexGrow: 1}}}
            renderFooter={renderFooter}>

            {renderHeader()}

            <View style={Style.confirmInfoScrollView}>

                <CText style={Style.confirmInfoListHeaderText}> {t('RECEIPT.RECEIVER_DETAILS_AND_INFORMATION')} </CText>

                <MappedElement
                    data={generateReceiverDetail()}
                    renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                <View style={Style.confirmInfoListNormalSeparator}/>

                {feesAndVat?.offerDetails?.title ? <AlertView viewStyle={{marginTop: 10, marginBottom: 10}} text={feesAndVat?.offerDetails?.title} type='offers' /> : null}

                <CInput
                    isShow={data?.moduleType !== SERVICES?.EMBEDDED_FINANCE._id}
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
                                disabled={!promo?.length || getFeesAndVatLoading}
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
                    inputContainerStyle={{marginTop: 15}}
                    service={data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id ? SERVICES?.EMBEDDED_FINANCE?._id : SERVICES?.BILL_PAYMENT?._id}
                />

                <CText style={Style.confirmInfoListHeaderText}>
                    {data?.moduleType === SERVICES?.EMBEDDED_FINANCE._id ? t('RECEIPT.AMOUNT_AND_CHARGES') : t('RECEIPT.TRANSFER_AMOUNT_AND_CHARGES')}
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
                        value={getDisplayTotalAmount() || 0}
                        currency={Object.keys(selectedCountry?.currencies)}
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
                isCreditPay={ticketPayload?.isCreditPay || false}
                senTo={generateSendToInfo(ticketPayload)}
            />

            <LivenessDetection
                ref={livenessDetectionFlowRef}
                detectionsList={reduxState?.masterDetails?.livenessChecks || []}
                onComplete={(picture) => {
                    if(picture && Object.keys(picture).length) {
                        newPay(picture);
                        livenessDetectionFlowRef?.current?.toggleModal(false);
                    }
                }}

            />

            <TermsAndConditionsWebView
                ref={webViewRef}
                title={t('GLOBAL.TERMS_CONDITION')}
            />

        </Container>
    )
}

export default React.memo(Overview)
