import React, {useEffect, useState, useRef} from "react";
import {View} from "react-native";
import {Container, ReferralCode, LivenessDetection, TermsAndConditionsWebView} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {processPayment} from "../../store/actions/PayBill.action";
import {getFeesAndVat} from "../../store/actions/TopUp.action";
import Style from "./TopUp.style";
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
import {isBeneficiaryConstant, topUpEvent} from "../../trackingEvents/UXCAM";
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

    const { route: { params: data}, navigation} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('MOBILE_TOPUP.TITLE'),
        headerRight: true,
    };

    const reduxState = useSelector(({payBill, global, topUp, creditPay}) => {
        return {
            loading: payBill.processPaymentLoading || creditPay?.requestCreditPayLoading,
            card: global.selectedCard,
            getFeesAndVatLoading: topUp.getFeesAndVatLoading,
            feesAndVat: topUp.feesAndVat,
            currentCountry: global.currentCountry,
            buttonLoading: global.sendOtpLoading,
            masterDetails: global.masterDetails,
            populars: global.populars,
            creditPayEligibility: creditPay.creditPayEligibility,
        }
    });

    const {feesAndVat, getFeesAndVatLoading, card, currentCountry} = reduxState;

    const [ticketPayload, updateTicketPayload] = useState({});
    const [termsAndCondition, updateTermsAndCondition] = useState(false);
    const [selectedCountry, updateSelectedCountry] = useState(currentCountry);
    const [promo, setPromo] = useState(feesAndVat?.promoDetails?.promo || '');
    const [promoError, setPromoError] = useState('');
    const promoRef = useRef(null);

    useEffect(() => {
        feeAndVat(promo);
        let e;

        if(data?.data?.pageType !== "beneficiary" || data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id) {
            e = events.addEventListener("verifyOtpCallBack", (res) => {
                if(res?.promoCode){
                    setPromo(res?.promoCode);
                    promoRef.current = res?.promoCode;
                }
                if(res?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id) {
                    newPay({}, res?.data?.moduleType, res?.token)
                } else if(res?.data?.moduleType !== SERVICES?.EMBEDDED_FINANCE?._id) {
                    handleSubmit()
                }
            });
        }

        return () => {
            events.removeListener('verifyOtpCallBack', e);
        }
    }, []);

    const feeAndVat = (promocode) => {
        let payload = {
            BillerID: data?.payload?.BillerID,
            Amount: data?.payload?.Amount,
            Currency: data?.payload?.Currency,
            TransactionType: "TOPUP",
            WalletID: card?.walletID,
            ...(promocode && {Promocode: promocode}),
            ...(data?.data?.moduleType  && {Type: SERVICES?.EMBEDDED_FINANCE?._id})
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
        if(data?.data?.pageType === "beneficiary" || moduleType === SERVICES?.EMBEDDED_FINANCE?._id) {
            handleSubmit(moduleType)
        } else {
            dispatch(sendOtp({}, res => addNewBeneficiaryFlowCallBack(res)))
        }
    };

    const addNewBeneficiaryFlowCallBack = (res) => {
        if(!res.error) {
            navigation.navigate('mobile_topup_otp', {...res, promoCode: promo})
        }
    };

    const navigationReset = () => {
        Popup.hide();
        onReview();
        if(data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id){
            navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
            });
        } else {
            navigation.reset({
                index: 0,
                routes: [{name: 'Mobile_TopUp'}],
            });
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
                            navigation.replace('mobile_topup_overview', {
                                payload: data?.payload,
                                data: {
                                    ...data?.data,
                                    ...(res && {moduleType: res})
                                }
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
                let referenceNo = resData?.transactionCode && resData?.transactionId ? `${resData?.transactionCode}${resData?.transactionId}` : '';
                updateTicketPayload({
                    message: resData?.message,
                    ...(data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE._id ? {
                        isCreditPay: true,
                        amountInAED: resData?.embeddedFinance?.totalAmount,
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
                    moduleType: data?.data?.moduleType
                });
            }
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
            navigation.navigate('mobile_topup_otp', {
                token: response?.data?.token,
                cardId: reduxState?.card?._id,
                screen: 'mobile_topup_overview',
                ...data
            })
        }))
    };

    const handleSubmit = (moduleType) => {
        if(moduleType === SERVICES?.EMBEDDED_FINANCE?._id){
            requestCreditPayFunc();
        } else {
            let isLivenessSupported = reduxState?.populars?.facialServices?.length ? reduxState?.populars?.facialServices?.includes(SERVICES?.TOPUP?._id) : false;
            let livenessChecks = reduxState?.masterDetails?.livenessChecks || [];
            if(isLivenessSupported && livenessChecks?.length){
                livenessDetectionFlowRef?.current?.toggleModal();
            } else {
                newPay();
            }
        }
    };

    const newPay = (selfie = {}, moduleType = '', token = '') => {

        let updatedPayload = data?.payload;

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
        formData.append('MobileNumber', updatedPayload?.MobileNumber);
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
        let iconUrl = `${iconBaseUrl}/${data?.data?.data?.Country?.CountryCode}/${convertToSlug(data?.data?.data?.Biller?.BillerName)}.png`;
        return {
            uri: iconUrl
        }
    };

    const trackTransaction = (payload, res) => {
        let receiverDetail = {
            biller: {
                ...data?.data?.data?.Biller,
                BillerType: data?.payload?.BillerType
            },
            number: data?.payload?.MobileNumber,
            alias: data?.payload?.Alias,
            card: reduxState?.card,
            transactionType: data?.payload?.TransactionType,
            ...(data?.payload?.Amount && {amount: data?.payload?.Amount}),
            ...(data?.payload?.Currency && {currency: data?.payload?.Currency}),
            isBeneficiary: data?.data?.pageType === 'beneficiary' ? isBeneficiaryConstant[0] : payload?.AddBeneficiary ? isBeneficiaryConstant[1] : isBeneficiaryConstant[2],
            ...(data?.Alias && {alias: data?.Alias}),
            ...(payload?.Alias && {alias: payload?.Alias}),
            feeAndVat: res
        };
        topUpEvent(receiverDetail)
    };

    const generateReceiverDetail = (paramData) => {
        let info = [];

        let obj = {
            ...(data?.data?.data && {
                BillerName: data?.data?.data?.Biller?.BillerName,
            }),
            ...(data?.payload && {
                Number: `+${data?.payload?.MobileNumber}`,
            }),
            ...(data?.payload && {
                Alias: data?.payload?.Alias,
            }),
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
            referenceNo: paramData?.referenceNo
        };

        if(obj?.Alias) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NAME'),
                value: obj?.Alias
            })
        }

        if(obj?.Number) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NUMBER'),
                value: obj?.Number
            })
        }

        if(obj?.BillerName) {
            info.push({
                Name: t('RECEIPT.NETWORK'),
                value: obj?.BillerName
            })
        }

        info.push({
            Name: t('RECEIPT.TYPE'),
            value: 'Mobile Prepaid'
        });

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
            ...(data && data?.payload),
            ...(reduxState?.feesAndVat && reduxState?.feesAndVat)
        };

        if(obj?.Amount){
            info.push({
                Name: t('RECEIPT.TOP_UP_AMOUNT'),
                value: `${obj?.Amount} ${obj.Currency}`,
                separate: true
            });
        }

        if(obj?.totalFee) {
            info.push({
                Name: t('RECEIPT.PLATFORM_FEE'),
                value: formatAmount(obj?.totalFee, "AED")
            })
        }

        if(obj?.totalVat) {
            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.totalVat, "AED")
            })
        }

        // if(feesAndVat?.offerDetails?.title){
        //     info.push({
        //         Name: t('RECEIPT.OFFER'),
        //         value: feesAndVat?.offerDetails?.title
        //     });
        // }

        if(obj?.embeddedFinance) {
            info.push({
                Name: t("RECEIPT.PLATFORM_FEE"),
                value: formatAmount((obj?.embeddedFinance?.totalFee || 0), 'AED')
            });

            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount((obj?.embeddedFinance?.totalVat || 0), 'AED')
            });
        }

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

    const generateSendToInfo = (data) => {
        return [
            ...generateReceiverDetail(data),
            ...generateTransferAmountAndCharges(),
        ]
    };

    const renderListItem = (label, value, i) => {
        return (
            <View key={i} style={Style.confirmInfoListItem}>
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
                                  source={getIcon()}
                                  fallback
                                  defaultSource={require('../../assets/images/others.png')}
                />
                <CText style={Style.confirmHeaderTitle}>{data?.data?.data?.Biller?.BillerName}</CText>
            </View>
        )
    };

    const gteFooterBottomSpace = (val) => {
        return val ? val : 30
    };

    const viewTermAndConditions = () => {
        let uri;

        if(data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id){
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
                         onPress={() => submit(data?.data?.moduleType)}
                         title={data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id ? t('CREDIT_PAY.CREDIT_PAY') : t('GLOBAL.PAY_NOW')}/>
            </View>
        )
    };

    const getTotalAmount = () => {
        if(reduxState?.feesAndVat?.embeddedFinance) {
            return reduxState?.feesAndVat?.embeddedFinance?.totalAmount;
        } else {
            return reduxState?.feesAndVat?.totalAmount || 0
        }
    };

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            headerProps={headerProps}
            loading={(data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE?._id ? reduxState?.getFeesAndVatLoading : false) || reduxState.loading}
            scrollView={true}
            scrollViewProps={{contentContainerStyle: {flexGrow: 1}}}
            renderFooter={renderFooter}
        >

            {renderHeader()}

            <View style={Style.confirmInfoScrollView}>

                <CText style={Style.confirmInfoListHeaderText}> {t('RECEIPT.RECEIVER_DETAILS_AND_INFORMATION')} </CText>

                <MappedElement
                    data={generateReceiverDetail()}
                    renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                <View style={Style.confirmInfoListNormalSeparator}/>

                {feesAndVat?.offerDetails?.title ? <AlertView viewStyle={{marginTop: 10, marginBottom: 10}} text={feesAndVat?.offerDetails?.title} type='offers' /> : null}

                <CInput
                    isShow={data?.data?.moduleType !== SERVICES?.EMBEDDED_FINANCE._id}
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
                    inputContainerStyle={{marginBottom: 10, marginTop: 10}}
                    service={data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE._id ? SERVICES?.EMBEDDED_FINANCE._id : SERVICES.TOPUP._id}
                />

                <CText style={Style.confirmInfoListHeaderText}>
                    {data?.data?.moduleType === SERVICES?.EMBEDDED_FINANCE._id ? t('RECEIPT.AMOUNT_AND_CHARGES') : t('RECEIPT.TRANSFER_AMOUNT_AND_CHARGES')}
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
                        value={getTotalAmount()}
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
