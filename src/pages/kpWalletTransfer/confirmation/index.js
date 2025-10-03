import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {Container, TermsAndConditionsWebView} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {
    formatAmount,
    FormatNumberWithCommas,
    MappedElement,
    maskMiddle,
    OTP_TOPICS,
    status,
} from "../../../utils/methods";
import {CButton, CheckBox, Receipt, ProgressiveImage, CText} from "../../../uiComponents";
import Popup from "../../../uiComponents/popup/Popup";
import Styles from "../../remittance/Remittance.style";
import events from "../../../utils/events";
import {sendOtp} from "../../../store/actions/Global.action";
import Style from "../../topUp/TopUp.style";
import {useTranslation} from "react-i18next";
import {useAppReview} from "../../../hooks";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import { kpWalletTransferProcessPayment } from "../../../store/actions/KPWalletTransfer.action";

function Confirmation(props) {

    const {route: { params: data }, navigation} = props;
    const { t } = useTranslation();
    const { onReview } = useAppReview();
    const insets = useSafeAreaInsets();
    const webViewRef = useRef();

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CONFIRMATION'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global, kpWalletTransfer}) => {
        return {
            user: auth.user,
            loading: global.sendOtpLoading,
            processPaymentLoading: kpWalletTransfer.processPaymentLoading,
            currentCountry: global.currentCountry,
            card: global.selectedCard,
            masterDetails: global.masterDetails,
            populars: global.populars,
        }
    });

    const [ticketPayload, updateTicketPayload] = useState({});

    useEffect(() => {
        let e = events.addEventListener("verifyOtpCallBack", (res) => {
            newPay()
        });
        return () => {
            events.removeListener('verifyOtpCallBack', e);
        }
    }, []);

    const submit = () => {
        dispatch(sendOtp({
            topic: OTP_TOPICS.WALLET_TRANSFER
        }, res => sendOtpCallBack(res)))
    };

    const sendOtpCallBack = (res) => {
        if(!res.error) {
            navigation.navigate('kp_wallet_transfer_otp', res)
        }
    };

    const newPay = () => {

        const formData = new FormData();

        if(!data?.beneficiaryId && data?.addBeneficiary) {
            formData.append('addBeneficiary', data?.addBeneficiary);
            formData.append('beneficiaryAlias', data?.receiverName);
        } else if (!data?.beneficiaryId && !data?.addBeneficiary) {
            formData.append('beneficiaryAlias', data?.receiverName);
        }

        if(data?.beneficiaryId) {
            formData.append('beneficiaryId', data?.beneficiaryId);
        }

        formData.append('senderWalletID', data?.senderCard?.walletID);
        formData.append('beneficiaryAccountNo', data?.receiverCard?.walletID);
        formData.append('amount', Number(data?.amount));
        formData.append('feesAmount', data?.feesAmount);

        dispatch(kpWalletTransferProcessPayment(formData, payCallBack))
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
                amountInAED: res?.data?.meta?.totalAmount,
                ...payload,
                Currency: 'AED',
                ...(s && {
                    message: t(status[s].message),
                    icon: status[s]
                }),
                ...((res?.data?.referenceNo) && {
                    referenceNo: res?.data?.referenceNo
                })
            });
        }
    };

    const trackTransaction = (payload, res, status) => {};

    const navigationReset = () => {
        onReview();
        navigation.reset({
            index: 0,
            routes: [{name: 'kp_wallet_transfer'}],
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
            ...(data && Object.keys(data) ? data : {}),
            referenceNo: paramData?.referenceNo,
        };

        let beneficiaryAlias = obj?.beneficiaryAlias || obj?.receiverCard?.user?.fullName

        if(obj?.receiverCard?.walletID) {
            info.push({
                Name: t('RECEIPT.TRANSFER_ID'),
                value: obj?.receiverCard?.walletID
            })
        }

        if(beneficiaryAlias) {
            info.push({
                Name: t('RECEIPT.RECEIVER_ACCOUNT_TITLE'),
                value: beneficiaryAlias
            })
        }

        if(obj?.receiverCard?.user?.phone) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NUMBER'),
                value: '+' + maskMiddle(obj?.receiverCard?.user?.phone)
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
            ...(data && Object.keys(data) ? data : {})
        };

        let receiverCurrency = "AED";
        let amountInForeignCurrencyReceivable = obj?.amount;
        let totalFee = obj?.feesAmount;

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
        let uri;

        if(reduxState.masterDetails?.kpWalletTransferTermsAndConditions){
            uri = reduxState.masterDetails?.kpWalletTransferTermsAndConditions || ''
        }

        if(uri){
            webViewRef?.current?.toggleModal({uri})
        }
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
                    value={getTotalAmount()}
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
                    title={`${t('KP_WALLET_TRANSFER.BY_CLICKING_ON_CONFIRM_I_AGREE_TO')} `}
                    clickAbleText={t('GLOBAL.TERMS_CONDITION')}
                    clickAbleTextFunc={() => viewTermAndConditions()}
                />
                <CButton disabled={false}
                         buttonStyle={Style.bottomButton}
                         title={t('GLOBAL.CONFIRM')}
                         loading={reduxState.processPaymentLoading || reduxState.loading}
                         onPress={() => submit()}/>
            </View>
        )
    };

    const getTotalAmount = () => {
        return (data?.amount ? Number(data?.amount) : 0) + (data?.feesAmount ? Number(data?.feesAmount) : 0)
    }

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
                            value={getTotalAmount()}
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

            <TermsAndConditionsWebView
                ref={webViewRef}
                title={t('GLOBAL.TERMS_CONDITION')}
            />

        </Container>
    )
}

export default React.memo(Confirmation)
