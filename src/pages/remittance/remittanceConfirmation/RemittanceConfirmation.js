import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {Container, LivenessDetection} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {
    formatAmount,
    FormatNumberWithCommas,
    MappedElement, SERVICES,
    status
} from "../../../utils/methods";
import {CButton, CheckBox, Receipt, ProgressiveImage, CText, AlertView} from "../../../uiComponents";
import {processPayment} from "../../../store/actions/Remittance.action";
import Popup from "../../../uiComponents/popup/Popup";
import Styles from "../Remittance.style";
import events from "../../../utils/events";
import {sendOtp, viewTermsAndConditions} from "../../../store/actions/Global.action";
import Style from "../../topUp/TopUp.style";
import {useTranslation} from "react-i18next";
import {isBeneficiaryConstant, remittanceEvent} from "../../../trackingEvents/UXCAM";
import {showNumberInBank} from "../remittanceBeneficiaryDetails/Form";
import {useAppReview} from "../../../hooks";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalStyle from "../../../assets/stylings/GlobalStyle";

function RemittanceConfirmation(props) {

    const {route: { params: data }, navigation} = props;
    const { t } = useTranslation();
    const { onReview } = useAppReview();
    const insets = useSafeAreaInsets();
    const livenessDetectionFlowRef = useRef();

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CONFIRMATION'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            user: auth.user,
            getCurrencyLoading: remittance.helloPaisaGetCurrencyLoading,
            loading:  global.sendOtpLoading,
            processPaymentLoading:  remittance.processPaymentLoading,
            currencyInfo: remittance.helloPaisaGetCurrency,
            currentCountry: global.currentCountry,
            card: global.selectedCard,
            remittanceTermsAndConditions: global.masterDetails?.remittanceTermsAndConditions,
            masterDetails: global.masterDetails,
            populars: global.populars,
        }
    });

    const [ticketPayload, updateTicketPayload] = useState({});

    useEffect(() => {
        let e;
        if(data?.pageType === "DIRECT_SEND_MONEY" || (!checkIsLivenessSupported() && checkBeneficiaryRemittanceOtpCheck() && (data?.pageType === "BENEFICIARY_TO_SEND_MONEY" || data?.pageType === "ADD_BENEFICIARY_AND_SEND_MONEY"))) {
            e = events.addEventListener("verifyOtpCallBack", (res) => {
                newPay()
            });
        }
        return () => {
            events.removeListener('verifyOtpCallBack', e);
        }
    }, []);

    const checkIsLivenessSupported = () => {
        let isLivenessSupported = reduxState?.populars?.facialServices?.length ? reduxState?.populars?.facialServices?.includes(SERVICES.REMITTANCE?._id) : false;
        let livenessChecks = reduxState?.masterDetails?.livenessChecks || [];
        return isLivenessSupported && !!livenessChecks?.length
    };
    const checkBeneficiaryRemittanceOtpCheck = () => {
        let remittanceCount = data?.beneficiaryObj?.remittanceCount ? Number(data?.beneficiaryObj?.remittanceCount) : 0;
        let beneficiaryRemittanceOtpCount = reduxState?.masterDetails?.beneficiaryRemittanceOtpCount ? Number(reduxState?.masterDetails?.beneficiaryRemittanceOtpCount) : 0;
        let beneficiaryRemittanceOtpCheck = reduxState?.masterDetails?.beneficiaryRemittanceOtpCheck;
        if(reduxState?.masterDetails){
            return !(remittanceCount > beneficiaryRemittanceOtpCount) || beneficiaryRemittanceOtpCheck
        } else {
            return true
        }
    };

    const submit = () => {
        if(data?.pageType === "BENEFICIARY_TO_SEND_MONEY" || data?.pageType === "ADD_BENEFICIARY_AND_SEND_MONEY") {
            if(checkIsLivenessSupported()){
                livenessDetectionFlowRef?.current?.toggleModal();
            } else if(checkBeneficiaryRemittanceOtpCheck()) {
                dispatch(sendOtp({}, res => beneficiaryToSendMoneyAskOtpFlowCallBack(res)));
            } else {
                newPay();
            }
        } else if(data?.pageType === "DIRECT_SEND_MONEY") {
            dispatch(sendOtp({}, res => addNewBeneficiaryFlowCallBack(res)))
        }
    };

    const beneficiaryToSendMoneyAskOtpFlowCallBack = (res) => {
        if(!res.error) {
            navigation.navigate('send_money_otp', res)
        }
    };
    const addNewBeneficiaryFlowCallBack = (res) => {
        if(!res.error) {
            navigation.navigate('send_money_otp', res)
        }
    };

    const newPay = (selfie = {}) => {

        const formData = new FormData();

        if(Object.keys(selfie).length){
            formData.append('selfie', selfie);
        }

        if(!data?.beneficiaryId && data?.otherDetails?.AddBeneficiary) {
            formData.append('AddBeneficiary', data?.otherDetails?.AddBeneficiary);
            formData.append('Alias', data?.otherDetails?.Alias);
        }

        if(data?.beneficiaryId) {
            formData.append('beneficiaryId', data?.beneficiaryId);
        }

        formData.append('BeneficiaryMSISDN', data?.otherDetails?.BeneficiaryMSISDN);
        formData.append('BeneficiaryFirstName', data?.otherDetails?.BeneficiaryFirstName);
        formData.append('BeneficiaryLastName', data?.otherDetails?.BeneficiaryLastName);
        formData.append('BeneficiaryNationalityCountryISOCode', data?.otherDetails?.BeneficiaryNationalityCountryISOCode);
        formData.append('RemitPurpose', data?.otherDetails?.RemitPurpose);
        formData.append('BankId', data.bank?._id);
        formData.append('CardId', reduxState?.card?._id);
        formData.append('Amount', data?.Amount);

        if(data?.Promocode){
            formData.append('Promocode', data?.Promocode);
        }

        if(data?.bank?.BankTypeName === 'Bank Account'){
            formData.append('AccountTitle', data?.otherDetails?.AccountTitle);
            formData.append('BeneficiaryAccountNo', data?.otherDetails?.BeneficiaryAccountNo);
        }

        dispatch(processPayment(formData, payCallBack))
    };

    const payCallBack = (res, payload, isTrackHistory = false) => {
        if(res?.error){
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: res?.data?.message || t('POPUPS.ERROR.TITLE'),
                text: t('POPUPS.ERROR.SUB_TITLE'),
                actions: [
                    {
                        text:  t('GLOBAL.TRY_AGAIN'),
                        callback: () => {
                            Popup.hide();
                            navigationReset()
                        }
                    }
                ]
            })
            trackTransaction(payload, res?.data, "FAILED")
        } else {
            let s = res?.data?.status || 'IN_PROGRESS';
            updateTicketPayload({
                ...res?.data,
                amountInAED: res?.data?.totalAmount || reduxState?.currencyInfo?.totalAmount,
                ...payload,
                Currency: 'AED',
                ...(s && {
                    message: t(status[s].message),
                    icon: status[s]
                }),
                ...((res?.referenceNo) && {
                    referenceNo: res?.referenceNo
                }),
                ...(isTrackHistory && {
                    trackHistory: () => {
                        updateTicketPayload({});
                        navigation.popToTop();
                        navigation.navigate('send_money_history');
                    }
                })
            });
            trackTransaction(payload, {
                ...res?.data,
                referenceNo: res?.referenceNo
            }, s)
        }
    };

    const trackTransaction = (payload, res, status) => {
        let receiverDetail = {
            status: status,
            card: reduxState?.card,
            ...(data?.Amount && {amount: data?.Amount}),
            ...(data?.bank && {bank: data?.bank}),
            ...(data?.country && {country: data?.country}),
            ...(data?.otherDetails && {otherDetails: data?.otherDetails}),
            ...(data?.transactionType && {transactionType: data?.transactionType}),
            ...(data?.beneficiaryAlias && {alias: data?.beneficiaryAlias}),
            feeAndVat: res,
            isBeneficiary: data?.pageType === 'BENEFICIARY_TO_SEND_MONEY' ? isBeneficiaryConstant[0] : data?.otherDetails?.AddBeneficiary ? isBeneficiaryConstant[1] : isBeneficiaryConstant[2],
        };

        remittanceEvent(receiverDetail)
    };


    const navigationReset = () => {
        onReview();
        navigation.reset({
            index: 0,
            routes: [{name: 'Send_Money'}],
        });
    };

    const onClose = (val) => {
        if(!val) {
            navigationReset();
        }
        updateTicketPayload({})
    };

    const generateReceiverDetail = (paramData) => {
        let info = [];

        let obj = {
            ...(data?.otherDetails && data?.otherDetails),
            ...(data?.bank && {
                BankTypeName: data?.bank?.BankTypeName,
                BankName: data?.bank?.BankName,
                BranchName: data?.bank?.BranchName || '',
            }),
            referenceNo: paramData?.referenceNo,
            ...(reduxState?.currencyInfo && reduxState?.currencyInfo)
        };

        if(obj?.BeneficiaryFirstName) {
            info.push({
                Name: t('RECEIPT.RECEIVER'),
                value: `${obj?.BeneficiaryFirstName} ${obj?.BeneficiaryLastName}`
            })
        }
        if((showNumberInBank(data?.bank?.BankType, data?.country)  || data?.bank?.BankType !== 'BankAccount') && obj?.BeneficiaryMSISDN) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NUMBER'),
                value: '+' + obj?.BeneficiaryMSISDN
            })
        }

        if(obj?.BankName) {
            info.push({
                Name: t('RECEIPT.BANK_NAME'),
                value: obj?.BankName
            })
        }

        if(obj?.BranchName) {
            info.push({
                Name: t('RECEIPT.BRANCH_NAME'),
                value: obj?.BranchName
            })
        }

        if(obj?.BankTypeName) {
            info.push({
                Name: t('RECEIPT.TYPE_TRANSFER'),
                value: obj?.BankTypeName
            })
        }

        if(obj?.AccountTitle) {
            info.push({
                Name: t('RECEIPT.RECEIVER_ACCOUNT_TITLE'),
                value: obj?.AccountTitle
            })
        }

        if(obj?.BeneficiaryAccountNo) {
            info.push({
                Name: t('RECEIPT.RECEIVER_ACCOUNT_NUMBER'),
                value: obj?.BeneficiaryAccountNo
            })
        }

        if(obj?.RemitPurpose) {
            info.push({
                Name: t('RECEIPT.REMITTANCE_PURPOSE'),
                value: obj?.RemitPurpose
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

    const generateTransferAmountAndCharges = (paramData) => {
        let info = [];

        let obj = {
            ...(data?.otherDetails && data?.otherDetails),
            ...(data?.bank && {BankTypeName: data?.bank?.BankTypeName}),
            ...(reduxState?.currencyInfo && reduxState?.currencyInfo)
        };

        let receiverCurrency = data?.country?.Currency || data?.country?.currency;

        let amountInForeignCurrencyReceivable = paramData && Object.keys(paramData).length ? paramData?.amountInForeignCurrencyReceivable : obj?.amountInForeignCurrencyReceivable;
        let totalFee = paramData && Object.keys(paramData).length ? paramData?.totalFee : obj?.totalFee;
        let totalVat = paramData && Object.keys(paramData).length ? paramData?.totalVat : obj?.totalVat;
        let countryFee = paramData && Object.keys(paramData).length ? paramData?.countryFee : obj?.countryFee;
        let tat = paramData && Object.keys(paramData).length ? paramData?.tat : obj?.tat;

        if(amountInForeignCurrencyReceivable) {
            info.push({
                Name: t('RECEIPT.TRANSFER_AMOUNT'),
                value: `${formatAmount(amountInForeignCurrencyReceivable, receiverCurrency)}`,
                separate: true
            })
        }

        if(totalFee) {
            info.push({
                Name: t('RECEIPT.CHARGES'),
                value: `${formatAmount(totalFee, 'AED')}`
            })
        }

        if(totalVat) {
            info.push({
                Name: t('RECEIPT.VAT'),
                value: `${formatAmount(totalVat, 'AED')} `
            })
        }

        if(countryFee && Number(countryFee)) {
            info.push({
                Name: t('RECEIPT.RECEIVER_CHARGES'),
                value: `${formatAmount(countryFee, receiverCurrency)}`
            })
        }

        // if(obj?.offerDetails?.title){
        //     info.push({
        //         Name: t('RECEIPT.OFFER'),
        //         value: obj?.offerDetails?.title
        //     });
        // }

        if(obj?.promoDetails?.promo) {
            info.push({
                Name: t('RECEIPT.PROMO_CODE'),
                value: obj?.promoDetails?.promo
            })
        }

        if(obj?.mode && obj?.discountAmount) {
            info.push({
                Name: t(`RECEIPT.${obj?.mode}`),
                value: `${obj?.mode === 'DISCOUNT' ? '-' : ''} ${formatAmount(obj?.discountAmount)} AED` || 0
            })
        }

        if(tat) {
            info.push({
                Name: t('RECEIPT.TAT'),
                value: tat
            })
        }

        return info
    };

    const generateSendToInfo = (obj) => {
        return [
            ...generateReceiverDetail(obj),
            ...generateTransferAmountAndCharges(obj),
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

    const viewTermAndConditions = () => {
        dispatch(viewTermsAndConditions({
            isOpen: true,
            type: 'REMITTANCE',
        }))
    };

    const renderHeader = () => {
        return (
            <View style={Style.confirmHeader}>
                <ProgressiveImage style={Style.confirmHeaderImage}
                                  source={require('../../../assets/images/bank-icon01.png')}
                />
                <CText style={[Style.confirmHeaderTitle, {marginBottom: 10}]}>{t('RECEIPT.TOTAL_AMOUNT')}</CText>
                <FormatNumberWithCommas
                    styleAmount={Styles.totalAmountValue}
                    value={data?.Amount}
                />
            </View>
        )
    };

    const gteFooterBottomSpace = (val) => {
        return val ? val : 30
    };

    const renderFooter = () => {
        return (
            <View style={[Style.grayBottomButtonContainer, GlobalStyle.topBorder, {paddingBottom: gteFooterBottomSpace(insets.bottom)}]}>
                <CheckBox
                    hideCheckBox={true}
                    disabled={true}
                    title={t('GLOBAL.BY_CLICKING_ON_SEND_MONEY_I_AGREE_TO')}
                    clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                    clickAbleTextFunc={() => viewTermAndConditions()}
                />
                <CButton disabled={!Object.keys(reduxState?.currencyInfo)?.length || reduxState.processPaymentLoading || reduxState.loading}
                         buttonStyle={Style.bottomButton}
                         title={t('PAGE_TITLE.SEND_MONEY')}
                         loading={reduxState.processPaymentLoading || reduxState.loading}
                         onPress={() => submit()}/>
            </View>
        )
    };

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            headerProps={headerProps}
            scrollViewProps={{ contentContainerStyle: { flexGrow: 1 }}}
            loading={reduxState.processPaymentLoading || reduxState.loading}
            scrollView={true}
            renderFooter={renderFooter}>

            {renderHeader()}

            <View style={Style.confirmInfoScrollView}>

                    <CText style={Style.confirmInfoListHeaderText}> {t('RECEIPT.RECEIVER_DETAILS')} </CText>

                    <MappedElement
                        data={generateReceiverDetail()}
                        renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                    <View style={Style.confirmInfoListNormalSeparator}/>

                    {reduxState?.currencyInfo?.offerDetails?.title ? <AlertView viewStyle={{marginTop: 10, marginBottom: 10}}
                                                                                text={reduxState?.currencyInfo?.offerDetails?.title}
                                                                                type='offers' /> : null}

                    <CText style={Style.confirmInfoListHeaderText}>
                        {t('RECEIPT.TRANSFER_AMOUNT_AND_CHARGES')}
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
                            styleAmount={[Style.confirmInfoListItemText,
                                Style.textBold, Style.textRight, Style.primaryText]}
                            value={reduxState?.currencyInfo?.totalAmount}
                        />
                    </View>
                </View>

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={(val) => onClose(val)}
                data={ticketPayload}
                refId={ticketPayload?.payoutPartnerRef || ''}
                infoTitle={t('RECEIPT.TRANSACTION_DETAILS')}
                infoUpperTitle=""
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

        </Container>
    )
}

export default React.memo(RemittanceConfirmation)
