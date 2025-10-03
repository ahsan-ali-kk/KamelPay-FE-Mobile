import React from "react";
import Popup from "../uiComponents/popup/Popup";
import GlobalStyle from "../assets/stylings/GlobalStyle";
import {View} from "react-native";
import {CText, ProgressiveImage} from "../uiComponents";
import {formatAmount, SERVICES} from "./methods";
import TopupStyle from "../pages/topUp/TopUp.style";
import {checkServices} from "../pages/home/Home";
import {getFeesAndVat as topUpGetFeesAndVat} from "../store/actions/TopUp.action";
import {getFeesAndVat as payBillGetFeesAndVat} from "../store/actions/PayBill.action";
import {store} from "../store";


export const checkCreditPayAmountEligibility = (amount, maxAmount) => {
    let actualAmount = Number(amount);
    return actualAmount <= maxAmount
};

const availCreditPayAlert = (t, hasLowBalance = false, packageAmount, creditPayMaxAmount, CB, closeCB) => {
    Popup.show({
        isVisible: true,
        styleMainContainer: GlobalStyle.paddingHorizontal_0,
        styleContainer: GlobalStyle.bottomHalfModal,
        viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
        buttonContainerStyle: {
            flexDirection: 'row'
        },
        type: 'customView',
        showClose: !hasLowBalance,
        edges: ['top', 'left', 'right'],
        customView: () => {
            return (
                <View style={GlobalStyle.shortInfoModalContainer}>
                    <View style={[GlobalStyle.shortInfoModalIconContainer, {marginBottom: 30}]}>
                        <ProgressiveImage
                            source={require('../assets/images/3d-vector/credit-pay.png')}
                            style={{width: 80, height: 80}} />
                    </View>
                    {hasLowBalance ? <CText style={[GlobalStyle.shortInfoModalTitle, {marginBottom: 20, color: 'red', fontSize: 18}]}>
                        {t("GLOBAL.LOW_BALANCE")}
                    </CText> : null }
                    <CText style={GlobalStyle.shortInfoModalTitle}>
                        {t('CREDIT_PAY.CREDIT_PAY_TITLE')}
                    </CText>
                    <CText style={GlobalStyle.shortInfoModalText}>
                        {t('CREDIT_PAY.CREDIT_PAY_SUB_TITLE')}
                    </CText>
                </View>
            )
        },
        actions: [
            {
                text: t('CREDIT_PAY.CREDIT_PAY'),
                callback: () => {
                    Popup.hide();
                    let checkMaxAMount = creditPayAmountEligibilityAlert(t, packageAmount, creditPayMaxAmount);
                    if(!checkMaxAMount){
                        CB && CB(SERVICES.EMBEDDED_FINANCE._id);
                    }
                },
                buttonStyle:{flex: 1},
                buttonType: 'fill'
            },
            ...(!hasLowBalance ? [{
                text: t('GLOBAL.PAY_IN_FULL'),
                callback: () => {
                    Popup.hide();
                    CB && CB('');
                },
                buttonStyle:{flex: 1},
                buttonType: 'fill'
            }]: [{
                text: t('GLOBAL.CLOSE'),
                callback: () => {
                    Popup.hide();
                    closeCB && closeCB();
                },
                buttonStyle:{flex: 1},
                buttonType: 'fill'
            }])
        ]
    })
};

const creditPayAmountEligibilityAlert = (t, packageAmount, creditPayMaxAmount) => {
    let maxAmount = checkCreditPayAmountEligibility(packageAmount, creditPayMaxAmount);
    if(!maxAmount) {
        Popup.show({
            isVisible: true,
            styleMainContainer: GlobalStyle.paddingHorizontal_0,
            styleContainer: GlobalStyle.bottomHalfModal,
            viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
            type: 'customView',
            showClose: false,
            edges: ['top', 'left', 'right'],
            customView: () => {
                return (
                    <View style={TopupStyle.shortInfoModalContainer}>
                        <View style={[GlobalStyle.shortInfoModalIconContainer, {marginBottom: 30}]}>
                            <ProgressiveImage
                                source={require('../assets/images/3d-vector/credit-pay.png')}
                                style={{width: 80, height: 80}} />
                        </View>
                        <CText style={GlobalStyle.shortInfoModalTitle}>
                            {t("CREDIT_PAY.CREDIT_PAY_ELIGIBLE_AMOUNT_IS")} {'\n\n'} {creditPayMaxAmount ? `${formatAmount(creditPayMaxAmount)} AED` : ''}
                        </CText>
                        <CText style={GlobalStyle.shortInfoModalText}>
                            {t("CREDIT_PAY.SELECTED_AMOUNT_EXCEEDS")}
                        </CText>
                    </View>
                )
            },
            actions: [
                {
                    text: t('GLOBAL.CHANGE'),
                    callback: () => Popup.hide()
                }
            ]
        });
        return true;  // Popup was shown
    } else {
        return false;  // No popup was shown
    }
};

export const checkCreditPay = (t, moduleType = '', hasLowBalance = false, amount, creditPayEligibility, card, CB, closeCB, feeAndVatPayload) => {
    let creditPayIsEligible = creditPayEligibility?.isEligible;
    let creditPayMaxAmount = creditPayEligibility?.maxAmount || 0;
    let userBalance = card?.balance || 0;
    let packageAmount = Number((amount || 0));

    if(moduleType === SERVICES?.EMBEDDED_FINANCE?._id){
        //User has come to credit pay module; check if the amount exceeds the limit, and if so, show a "limit exceeded" popup.
        const isPopupShown = creditPayAmountEligibilityAlert(t, packageAmount, creditPayMaxAmount);
        if (!isPopupShown) {
            CB && CB(SERVICES?.EMBEDDED_FINANCE?._id)
        }
    } else if(checkServices(card, [SERVICES.EMBEDDED_FINANCE._id]) && creditPayIsEligible) {
        if(feeAndVatPayload && feeAndVatPayload?.Currency !== 'AED') {
            if(feeAndVatPayload?.TransactionType === SERVICES?.TOPUP?._id) {
                store.dispatch(topUpGetFeesAndVat(feeAndVatPayload, (res) => {
                    if(res?.amountInAED) {
                        packageAmount = formatAmount(res.amountInAED);
                        availCreditPayAlert(t, hasLowBalance, packageAmount, creditPayMaxAmount, CB, closeCB)
                    }
                }));
            }  else if(feeAndVatPayload?.TransactionType === SERVICES?.BILL_PAYMENT?._id) {
                store.dispatch(payBillGetFeesAndVat(feeAndVatPayload, (res) => {
                    if(res?.amountInAED) {
                        packageAmount = formatAmount(res.amountInAED);
                        availCreditPayAlert(t, hasLowBalance, packageAmount, creditPayMaxAmount, CB, closeCB)
                    }
                }));
            }
        } else {
            availCreditPayAlert(t, hasLowBalance, packageAmount, creditPayMaxAmount, CB, closeCB)
        }
        // Check if the user is eligible for credit pay; show "eligible" popup; if eligible, check if the amount exceeds the limit, and if so, show a "limit exceeded" popup.
        // availCreditPayAlert(t, hasLowBalance, packageAmount, creditPayMaxAmount, CB, closeCB)
    } else {
        //Normal flow
        CB && CB('')
    }

};
