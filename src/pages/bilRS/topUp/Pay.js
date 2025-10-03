import React, {Fragment, useEffect, useRef, useState} from "react";
import {View, TouchableOpacity, ScrollView} from "react-native";
import {Container} from "../../../containers";
import {useSelector} from "react-redux";
import Styles from "../payBill/Billers.style";
import TopupStyle from "./TopUp.style";
import {CInput, CText, IconButton, ProgressiveImage} from "../../../uiComponents";
import {convertToSlug, MappedElement, SERVICES} from "../../../utils/methods";
import {iconBaseUrl, iconBilrsBaseUrl} from "../../../utils/intercepter";
import Popup from "../../../uiComponents/popup/Popup";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import {themes} from "../../../theme/colors";
import {checkCreditPay} from "../../../utils/creditPayHelper";
import EnterAmount from "./EnterAmount";

function Pay(props) {
    const { t, i18n } = useTranslation();

    const form = useRef(null);
    const enterAmountRef = useRef(null);

    const { route: { params: data}, navigation } = props;

    const headerProps = {
        headerTitle: t('MOBILE_TOPUP.TITLE'),
        headerRight: true,
    };

    useEffect(() => {
        if(data?.data?.selectedSku) {
            onSelectSKU(data?.data?.selectedSku)
        }
    }, []);

    const reduxState = useSelector(({payBill, global, topUp, creditPay}) => {
        return {
            loading: payBill.processPaymentLoading,
            card: global.selectedCard,
            overlayLoading: topUp.getFeesAndVatLoading,
            creditPayEligibility: creditPay.creditPayEligibility,
            checkCreditPayEligibilityLoading: creditPay.checkCreditPayEligibilityLoading,
        }
    });

    const [selectedSku, updateSelectedSku] = useState({});
    const [filteredSku, updateFilteredSku] = useState(data?.data?.SKU);

    const [searchText, updateSearchText] = useState('');

    const onSelectSKU = (item) => {
        if(Number(item.Amount)){
            submit({}, item);
        } else {
            enterAmountRef.current?.toggleModal(true, item)
        }
    };

    const submit = (values, sku) => {
        let payload = {
            Currency: sku?.ReceivingCurrency || selectedSku?.ReceivingCurrency,
            BillerID: data?.data?.Biller?.BillerID,
            BillerType: sku?.Type || "Mobile Prepaid",
            SKU: sku?.SKU || selectedSku?.SKU,
            Inputs: data?.data?.Inputs,
            CardId: reduxState.card._id,
            TransactionType: SERVICES?.TOPUP?._id,
            AddBeneficiary: data?.payload?.AddBeneficiary || false,
            ...(data?.payload?.Alias && {Alias: data?.payload?.Alias}),
            ...(data?.payload?.beneficiaryId && {beneficiaryId: data?.payload?.beneficiaryId}),
            ...(data?.payload?.MobileNumber && {MobileNumber: data?.payload?.MobileNumber}),
        };

        if(values?.Amount) {
            payload.Amount = values.Amount
        } else {
            payload.Amount = sku.Amount || selectedSku.Amount
        }

        let feeAndVatPayload = {
            BillerID: payload?.BillerID,
            Amount: payload?.Amount,
            Currency: payload?.Currency,
            TransactionType: payload?.TransactionType,
            WalletID: reduxState.card?.walletID,
        };

        checkCreditPay(t, data?.moduleType, false, payload?.Amount, reduxState?.creditPayEligibility, reduxState?.card,
            (moduleType) => {
                navigation.navigate('mobile_topup_overview', {
                    payload: payload,
                    data: {
                        ...data,
                        ...(moduleType && {moduleType})
                    }
                });
            },
            () => {},
            feeAndVatPayload);

    };

    const view = (obj) => {
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
                        <IconButton
                            buttonType='normal'
                            type="icon-with-background"
                            buttonStyle={TopupStyle.shortInfoModalIconContainer}
                            buttonIconStyle={TopupStyle.shortInfoModalIcon}
                            iconName={'mobile-prepaid'}
                        />
                        <CText style={TopupStyle.shortInfoModalText}>{obj?.Description}</CText>
                    </View>
                )
            },
            actions: [
                {
                    text: t('GLOBAL.NEXT'),
                    callback: () => {
                        Popup.hide();
                        onSelectSKU(obj);
                    }
                },
                {
                    text: t('GLOBAL.CHANGE'),
                    callback: () => Popup.hide()
                },
            ]
        })
    };

    const renderSKUItem = (item, index) => {
        return (
            <View key={index} style={TopupStyle.skuItemContainer}>
                <TouchableOpacity style={TopupStyle.skuItem} onPress={() => view(item)}>
                    <IconButton
                        buttonType='normal'
                        type="icon-with-background"
                        buttonStyle={TopupStyle.skuItemIconContainer}
                        buttonIconStyle={TopupStyle.skuItemIcon}
                        iconName={'mobile-prepaid'}
                    />
                    <View style={TopupStyle.skuItemContent}>
                        <CText style={TopupStyle.skuItemTitle}> {item?.Description} </CText>
                    </View>
                </TouchableOpacity>
            </View>

        )
    };

    const getIcon = () => {
        let iconUrl = `${iconBilrsBaseUrl}/${data?.data?.Country?.CountryCode}/${convertToSlug(data?.data?.Biller?.BillerID)}.png`;
        return {
            uri: iconUrl
        }
    };

    const filterWithSearchSKU = (val) => {
        let foundArray = [];
        if(val) {
            foundArray = data?.data?.SKU.filter((o) =>  o?.Description?.toLowerCase().includes(val?.toLowerCase()));
        } else {
            foundArray = data?.data?.SKU
        }
        updateFilteredSku(foundArray)
    };

    const onChange = (val) => {
        updateSearchText(val);
        filterWithSearchSKU(val)
    };

    const renderHeaderListComponent = () => {
        return (
            <Fragment>
                <View style={TopupStyle.listHeader}>
                    <ProgressiveImage style={TopupStyle.listHeaderImage}
                                      source={getIcon()}
                                      fallback
                                      resizeMode="contain"
                                      defaultSource={require('../../../assets/images/others.png')}
                    />
                    <CText style={TopupStyle.listHeaderText}>{t('MOBILE_TOPUP.CHOOSE_PACKAGE')}</CText>
                </View>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={val => onChange(val)}
                    inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                    inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                    leftIconName={'search'}
                    iconStyle={{color: themes['light'].colors.gray8}}
                    onSubmitEditing={() => null}
                />
            </Fragment>
        )
    };

    const renderSKUs = (data) => {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={TopupStyle.skuList}
                contentContainerStyle={TopupStyle.skuInnerList}>
                <View style={{width: '100%'}}>
                    {renderHeaderListComponent()}
                </View>
                <MappedElement data={data} renderElement={renderSKUItem}/>
            </ScrollView>
        )
    };

    return (
        <Container
            loading={reduxState?.loading}
            loadingWithOverlay={reduxState?.overlayLoading}
            headerProps={headerProps}>

            <View style={TopupStyle.listPay}>

                <View style={TopupStyle.listPayItem}>
                    <CText style={TopupStyle.listPayItemTitle}>{t('RECEIPT.NETWORK')}</CText>
                    <CText style={TopupStyle.listPayItemValue}>
                        {data?.data?.Biller?.BillerName}
                    </CText>
                </View>
                {data?.payload?.Alias || data?.payload?.Alias ? <View style={TopupStyle.listPayItem}>
                    <CText style={TopupStyle.listPayItemTitle}>{t('RECEIPT.RECEIVER_NAME')}</CText>
                    <CText style={TopupStyle.listPayItemValue}>
                        {data?.payload?.Alias}
                    </CText>
                </View> : null}
                <View style={TopupStyle.listPayItem}>
                    <CText style={TopupStyle.listPayItemTitle}>{t('RECEIPT.RECEIVER_NUMBER')}</CText>
                    <CText style={TopupStyle.listPayItemValue}>+{data?.payload?.MobileNumber}</CText>
                </View>
            </View>

            <View style={Styles.container}>
                {renderSKUs(filteredSku)}
            </View>

            <EnterAmount ref={enterAmountRef}
                         onChange={(values, skuObj) => {
                             submit(values, skuObj);
                         }}
            />

        </Container>
    )
}

export default React.memo(Pay)
