import React, {Fragment, useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {Container, ViewContainer} from "../../../containers";
import {useSelector} from "react-redux";
import Styles from "./Billers.style";
import {CButton, CInput, ProgressiveImage, CText} from "../../../uiComponents";
import {Formik} from "formik";
import * as Yup from 'yup';
import {
    convertToSlug,
    MappedElement,
    formatAmount,
    SERVICES,
    checkCreditPayAmountEligibility
} from "../../../utils/methods";
import _ from "lodash";
import {iconBaseUrl, iconBilrsBaseUrl} from "../../../utils/intercepter";
import TopUpStyle from "../../topUp/TopUp.style";
import {useTranslation} from "react-i18next";
import {checkCreditPay} from "../../../utils/creditPayHelper";

function Pay(props) {
    const { t, i18n } = useTranslation();

    const form = useRef(null);

    const { route: { params: data}, navigation } = props;

    const {sku, billInfo, biller, payload, io} = data;

    const slug = convertToSlug(data?.billerType);

    const headerProps = {
        headerTitle: `${t('PAY_BILL.PAY')} ${data?.billerType} ${(slug !== 'mobile_prepaid' || slug !== 'top-up') ? t('PAY_BILL.BILL') : ''}` ,
        headerRight: true,
    };

    const reduxState = useSelector(({payBill, global, creditPay}) => {
        return {
            loading: payBill.processPaymentLoading,
            card: global.selectedCard,
            overlayLoading: payBill.getFeesAndVatLoading,
            creditPayEligibility: creditPay.creditPayEligibility,
            checkCreditPayEligibilityLoading: creditPay.checkCreditPayEligibilityLoading,
        }
    });

    const [showAmountInput, updateShowAmountInput] = useState(false);
    const [customPay, updateCustomPay] = useState(false);
    const [flag, setFlag] = useState(true);
    const [validations, setValidations] = useState();

    const submit = (values) => {
        let updatedPayload = _.omit(payload,['type']);
        let payloadData = {
            ...updatedPayload,
            // Currency: billInfo?.SettlementCurrency || sku?.ReceivingCurrency,
            Currency: billInfo?.BaseCurrency || sku?.ReceivingCurrency,
            BillerType: biller.BillerType,
            ...(billInfo?.TransactionId && {TransactionId: billInfo?.TransactionId}),
            TransactionType: SERVICES?.BILL_PAYMENT?._id,
        };
        if((billInfo?.type === 'CUSTOM_AMOUNT') || showAmountInput) {
            payloadData.Amount = values.Amount
        } else if (billInfo?.type === "DIRECT_PAY") {
            payloadData.Amount = sku?.Amount;
        } else {
            payloadData.Amount = billInfo?.BillAmountDue;
        }

        let feeAndVatPayload = {
            BillerID: payloadData?.BillerID,
            Amount: payloadData?.Amount,
            Currency: payloadData?.Currency,
            TransactionType: payloadData?.TransactionType,
            WalletID: reduxState.card?.walletID,
        };

        // pay_bill_overview
        checkCreditPay(t, data?.moduleType, false, payloadData?.Amount, reduxState?.creditPayEligibility, reduxState?.card,
            (moduleType) => {
                    navigation.navigate('pay_bill_overview', {
                        payloadSend: payloadData,
                        ...data,
                        ...(moduleType && {moduleType})
                    })
                },
                () => {},
                feeAndVatPayload);
        // dispatch(processPayment(payloadData, callBack))
    };


    useEffect(() => {
        if(flag && (billInfo?.type === 'CUSTOM_AMOUNT') || (payload?.type === 'SOME_CONDITIONS')) {

            let partialPaymentAllowed = sku?.PartialPaymentAllowed ? Number(sku?.PartialPaymentAllowed) : 0;
            let excessPaymentAllowed = sku?.ExcessPaymentAllowed ? Number(sku?.ExcessPaymentAllowed) : 0;

            let minAmount = sku?.MinAmount ? Number(sku?.MinAmount) : 1;
            let maxAmount = sku?.MaxAmount ? Number(sku?.MaxAmount) : 0;

            let billAmountDue = billInfo?.BillAmountDue ? Number(billInfo?.BillAmountDue) : 0;

            let amount = Yup.number().required(t('VALIDATION.SKU_AMOUNT.REQUIRED'))
                .typeError(t('VALIDATION.ONLY_DIGITS'));

            if(billInfo?.type === 'CUSTOM_AMOUNT') {
                amount = amount.min(minAmount, `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${minAmount}.`);
                if(maxAmount) {
                    amount = amount.max(maxAmount, `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.NOT_MORE_THAN')} ${maxAmount} ${t('VALIDATION.AMOUNT').toLowerCase()}.`)
                }
            } else if(payload?.type === 'SOME_CONDITIONS') {

                if(partialPaymentAllowed || excessPaymentAllowed){
                    updateCustomPay(true)
                }

                if(partialPaymentAllowed && excessPaymentAllowed){
                    let minA = minAmount;
                    amount = amount.min(minA, `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${minA}.`)
                } else if(partialPaymentAllowed) {
                    let minA = minAmount;
                    let maxA = billAmountDue;
                    amount = amount.min(minA, `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${minA}.`);
                    amount = amount.max(maxA, `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${maxA}.`);
                } else if(excessPaymentAllowed){
                    amount = amount.min(billAmountDue, `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${billAmountDue}.`);
                    if(maxAmount) {
                        amount = amount.max(maxAmount, `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.NOT_MORE_THAN')} ${maxAmount} ${t('VALIDATION.AMOUNT').toLowerCase()}.`)
                    }
                }

            }
            setValidations(Yup.object().shape({Amount: amount}));

            setFlag(false)
        }
    }, []);


    const getIcon = () => {
        let iconUrl = `${iconBilrsBaseUrl}/${data?.biller?.CountryCode}/${convertToSlug(data?.biller?.BillerID)}.png`;
        return {
            uri: iconUrl
        }
    };

    const renderListItem = (title, value, type = 'normal') => {
        return (
            <View key={title} style={type === 'center' ? Styles.listPayItemCenter : Styles.listPayItem}>
                <CText style={type === 'center' ? Styles.listPayItemCenterLabel : [Styles.listPayItemText, Styles.mr_10]}>
                    {title}
                </CText>
                <CText style={type === 'center' ? Styles.listPayItemCenterValue : [Styles.listPayItemText, Styles.textBold, Styles.textRight]}>
                    {value}
                </CText>
            </View>
        )
    };

    return (
        <Container headerProps={headerProps}
                   loadingWithOverlay={reduxState?.overlayLoading}>

            <ViewContainer scrolled={true}
                           contentContainerStyle={Styles.scrollContainer}
                           style={Styles.scrollContainer}>
                <Formik
                    innerRef={form}
                    validationSchema={(billInfo?.type === 'CUSTOM_AMOUNT') || showAmountInput ? validations : null}
                    onSubmit={(values) => submit(values)}
                    initialValues={{}}>
                    {({handleChange, values, handleSubmit, errors}) => {
                        return (
                            <Fragment>
                                <View style={Styles.container}>

                                    <View style={TopUpStyle.confirmHeader}>
                                        <ProgressiveImage
                                            style={TopUpStyle.confirmHeaderImage}
                                            source={getIcon()}
                                            fallback
                                            resizeMode="contain"
                                            defaultSource={require('../../../assets/images/others.png')}
                                        />
                                        <CText style={TopUpStyle.confirmHeaderTitle}>{data?.biller?.BillerName}</CText>
                                    </View>

                                    <View style={Styles.listPay}>
                                        {/*{billInfo?.BaseCurrency ? renderListItem(*/}
                                        {/*    t('RECEIPT.AMOUNT_DUE'),*/}
                                        {/*    billInfo?.TotalAmountDue ? `${formatAmount(billInfo?.BillAmountDue)} ${billInfo?.SettlementCurrency}` : `${formatAmount(sku?.Amount)} ${sku?.ReceivingCurrency}`, 'center')*/}
                                        {/*    : null}*/}
                                        {billInfo?.SettlementCurrency ? renderListItem(
                                                t('RECEIPT.AMOUNT_DUE'),
                                                billInfo?.TotalAmountDue ? `${formatAmount(billInfo?.BillAmountDue)} ${billInfo?.BaseCurrency}` : `${formatAmount(sku?.Amount)} ${sku?.ReceivingCurrency}`, 'center')
                                            : null}
                                        {billInfo?.type ==='AMOUNT_IN_SKU' ? renderListItem(t('RECEIPT.AMOUNT_DUE'), `${formatAmount(sku?.Amount)} ${sku?.ReceivingCurrency}`, 'center') : null}
                                        {billInfo?.type ==='DIRECT_PAY' ? renderListItem(t('RECEIPT.AMOUNT'), `${formatAmount(sku?.Amount)} ${sku?.ReceivingCurrency}`, 'center') : null}

                                        {(billInfo?.type === 'CUSTOM_AMOUNT') || showAmountInput ? <View>
                                            <CInput
                                                inputSubLabel={t('FIELDS_LABELS.ENTER_AMOUNT')}
                                                placeholder={t('FIELDS_LABELS.ENTER_AMOUNT_PLACEHOLDER')}
                                                keyboardType="numeric"
                                                value={values.Amount}
                                                onChangeText={handleChange('Amount')}
                                                error={errors.Amount}
                                                returnKeyType="next"
                                                onSubmitEditing={() => handleSubmit()}
                                            />
                                        </View> : null}

                                        {billInfo?.BillDueDate ? renderListItem(t('RECEIPT.BILL_DUE_DATE'), billInfo?.BillDueDate) : null}
                                        <MappedElement data={io}
                                                   renderElement={(o, i) => renderListItem(o.Name, o?.value)}/>

                                    </View>

                                </View>
                                <View style={Styles.bottomButtonContainer}>
                                    {customPay ? <CButton
                                        type='outline'
                                        disabled={reduxState.loading}
                                        onPress={() => updateShowAmountInput(!showAmountInput)}
                                        buttonStyle={Styles.bottomButton}
                                        title={t('PAY_BILL.CUSTOM_AMOUNT')}/> : null}

                                    <CButton buttonStyle={Styles.bottomButton}
                                             loading={reduxState.loading}
                                             onPress={() => handleSubmit()}
                                             title={!showAmountInput && customPay ? t('PAY_BILL.PAY_FULL_BILL') : t('GLOBAL.NEXT')}/>
                                </View>
                            </Fragment>
                        )
                    }}
                </Formik>
            </ViewContainer>

        </Container>
    )
}

export default React.memo(Pay)
