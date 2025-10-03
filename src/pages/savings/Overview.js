import React, {useState} from "react";
import {View, ScrollView} from "react-native";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import Style from "../topUp/TopUp.style";
import {CButton, Receipt, CText, ProgressiveImage, CheckBox} from "../../uiComponents";
import {formatAmount, FormatNumberWithCommas, MappedElement, openDialScreen} from "../../utils/methods";
import Popup from "../../uiComponents/popup/Popup";
import {useTranslation} from "react-i18next";
import {redeemOffer} from "../../store/actions/Savings.action";
import {useSubscriptions} from "../../trackingEvents/UXCAM";
import {renderFlatOrPercentage} from "./Savings";

function Overview(props) {

    const { t, i18n } = useTranslation();

    const { route: { params: data}, navigation} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CONFIRMATION'),
        headerRight: true,
    };

    const reduxState = useSelector(({savings, global, topUp}) => {
        return {
            currentCountry: global.currentCountry,
            payBillAmount: savings.payBillAmount,
            loading: savings.redeemOfferLoading
        }
    });

    const [ticketPayload, updateTicketPayload] = useState({});
    const [termsAndCondition, updateTermsAndCondition] = useState(false);
    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);

    const submit = () => {
        let payload = {
            typeId: data?.offer?.id,
            type: data?.type,
            billAmount: data?.amount,
            outletId: data?.vendor?.id,
            ...reduxState?.payBillAmount
        };
        dispatch(redeemOffer(payload, callBack))
    };

    const navigationReset = () => {
        Popup.hide();
        navigation.reset({
            index: 0,
            routes: [{name: 'Savings'}],
        });
    };

    const contactUs = () => {
        Popup.hide();
        openDialScreen();
        navigationReset();
    };

    const onClose = (val) => {
        if(!val) {
            navigationReset();
        }
        updateTicketPayload({})
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
            trackEvent(res, payload);
            updateTicketPayload({
                message: res?.message,
                amountInAED: res?.data?.payableAmount,
                ...payload
            })
        }
    };

    const trackEvent = (res) => {
        useSubscriptions(res)
    };

    const generateReceiverDetail = () => {
        let info = [];

        let obj = {
            ...(data && data),
        };

        if(obj?.vendor){
            info.push({
                Name: t(`RECEIPT.VENDOR`),
                value: obj?.vendor?.name,
            });
        }
        if(obj?.offer){
            info.push({
                Name: t('RECEIPT.OFFER'),
                value: obj?.offer?.title,
            });
        }

        return info
    };

    const generateTransferAmountAndCharges = () => {
        let info = [];

        let obj = {
            ...(data && data),
            ...reduxState?.payBillAmount
        };

        if(obj?.amount){
            info.push({
                Name: t(`RECEIPT.AMOUNT`),
                value: `${formatAmount(obj?.amount)} ${Object.keys(selectedCountry?.currencies)}`,
                separate: true
            });
        }

        if(obj?.discount) {
            info.push({
                Name: t(`RECEIPT.DISCOUNT`),
                value: renderFlatOrPercentage(reduxState?.payBillAmount) || 0
            })
        }

        info.push({
            Name: t('RECEIPT.CHARGES'),
            value: t('RECEIPT.NO_FEE'),
        });

        info.push({
            Name: t('RECEIPT.VAT'),
            value: t('RECEIPT.NO_VAT'),
        });

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

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            headerProps={headerProps}>

            <View style={Style.confirmHeader}>
                <ProgressiveImage style={Style.confirmHeaderImage}
                                  source={{uri: data?.offer?.offerPhoto}}
                />
                <CText style={Style.confirmHeaderTitle}>{data?.offer?.title}</CText>
            </View>

            <Container
                edges={['left', 'right', 'bottom']}
                SafeAreaViewStyle={Style.confirmScroll}
                loading={reduxState.loading}>
                <ScrollView contentContainerStyle={Style.confirmInfoScrollView}>

                    <CText style={Style.confirmInfoListHeaderText}>
                        {t('RECEIPT.INFORMATION')}
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
                            value={reduxState?.payBillAmount?.payableAmount || 0}
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
                             loading={reduxState.loading}
                             onPress={() => submit()}
                             title={t('RECEIPT.REDEEM')}/>
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
