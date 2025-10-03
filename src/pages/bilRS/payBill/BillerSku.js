import React, {Fragment, useCallback, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {CInput, CList, CListItem, CText, IconButton} from "../../../uiComponents";
import {checkCreditPayAmountEligibility, convertToSlug, formatAmount, SERVICES} from "../../../utils/methods";
import {iconBaseUrl, iconBilrsBaseUrl} from "../../../utils/intercepter";
import {getSKUOfBiller} from "../../../store/actions/PayBill.action";
import { debounce } from 'lodash-es';
import {themes} from "../../../theme/colors";
import {useTranslation} from "react-i18next";
import Popup from "../../../uiComponents/popup/Popup";
import TopupStyle from "../../topUp/TopUp.style";
import {checkCreditPay} from "../../../utils/creditPayHelper";

function BillerSku(props) {
    const { t, i18n } = useTranslation();

    const { route: {params: data}, navigation } = props;

    const dispatch = useDispatch();

    const [searchText, updateSearchText] = useState('');

    const slug = convertToSlug(data?.billerType);

    const headerProps = {
        headerTitle: `${t('PAY_BILL.PAY')} ${data?.billerType}` ,
        headerRight: true,
    };

    const searchDebounce = useCallback(
        debounce((e) => {
            try {
                get(e);
            } catch (error) {

            }
        }, 500),
        []
    );

    const onChange = (val) => {
        updateSearchText(val);
        searchDebounce(val)
    };

    const get = (text) => {
        dispatch(getSKUOfBiller(data?.biller, text));
    };

    const reduxState = useSelector(({payBill, global, creditPay}) => {
        return {
            data: payBill.billerSku,
            loading: payBill.billerSkuLoading,
            card: global.selectedCard,
            overlayLoading: payBill.getFeesAndVatLoading,
            creditPayEligibility: creditPay.creditPayEligibility,
            checkCreditPayEligibilityLoading: creditPay.checkCreditPayEligibilityLoading,
        }
    });

    const creditPayAmountEligibilityAlert = (amount) => {
        const maxAmount = data?.creditPayEligibility?.maxAmount || 0;
        let maxAmountCheck = checkCreditPayAmountEligibility(amount, maxAmount);
        if(!maxAmountCheck) {
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
                            <CText style={TopupStyle.shortInfoModalText}>
                                {t("CREDIT_PAY.SELECTED_AMOUNT_EXCEEDS")}
                                {t("CREDIT_PAY.CREDIT_PAY_ELIGIBLE_AMOUNT_IS")} {'\n'} {data?.creditPayEligibility?.maxAmount ? `${formatAmount(data?.creditPayEligibility?.maxAmount)} AED` : ''}
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
                        navigate(obj);
                    }
                },
                {
                    text: t('GLOBAL.CHANGE'),
                    callback: () => Popup.hide()
                },
            ]
        })
    };

    const navigate = (item) => {
        if(slug === 'mobile_prepaid' || slug === 'top-up') {
            let feeAndVatPayload = {
                BillerID: data?.biller?.BillerID,
                Amount: item?.Amount,
                Currency: item?.Currency,
                TransactionType: SERVICES?.BILL_PAYMENT?._id,
                WalletID: reduxState.card?.walletID,
            };
            checkCreditPay(t, data?.moduleType, false, item?.Amount, reduxState?.creditPayEligibility, reduxState?.card,
                (moduleType) => {
                        navigation.navigate('pay_bill_biller_sku_io', {
                            sku: item,
                            biller: data?.biller,
                            billerType: data?.billerType,
                            ...(moduleType && {moduleType})
                        })
                    },
                () => {},
                feeAndVatPayload
                );
        } else {
            navigation.navigate('pay_bill_biller_sku_io', {
                sku: item,
                biller: data?.biller,
                billerType: data?.billerType,
                ...(data?.moduleType && {moduleType: data?.moduleType})
            })
        }
    };

    const checkAndNavigate = (item) => {
        if(slug === 'mobile_prepaid' || slug === 'top-up'){
            view(item)
        } else {
            navigate(item)
        }
    };

    const renderItem = ({item, index}) => {
        let iconUrl = `${iconBilrsBaseUrl}/${data?.biller?.CountryCode}/${convertToSlug(data?.biller?.BillerID)}.png`;
        return (
            <CListItem key={index}
                       style={GlobalStyle.paddingHorizontal_0}
                       iconRadius={0}
                       source={{ uri: iconUrl }}
                       defaultSource={require('../../../assets/images/others.png')}
                       title={item?.Description}
                       onPress={() => checkAndNavigate(item)}
                       rightIconName={'right-arrow'}
            />
        )
    };

    const renderListHeaderComponent = () => {
        return (
            <Fragment>
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0]}>
                    {t('PAY_BILL.SELECT')} {(slug === 'mobile_prepaid' || slug === 'top-up') ? t('PAY_BILL.PACKAGE') : t('PAY_BILL.SERVICES')}
                </CText>
            </Fragment>
        )
    };

    return (
        <Container
            loadingWithOverlay={reduxState?.overlayLoading}
            headerProps={headerProps}>
            <View style={[GlobalStyle.listHeader]}>
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
            </View>

           <CList
                ListHeaderComponent={renderListHeaderComponent}
                contentContainerStyle={GlobalStyle.list}
                data={Array.isArray(reduxState.data) ? reduxState.data : []}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/empty-bills.png'),
                    text: `${t('PAY_BILL.NO')} ${(slug === 'mobile_prepaid' || slug === 'top-up') ? t('PAY_BILL.PACKAGES') : t('PAY_BILL.SERVICES')} ${t('PAY_BILL.FOUND')}`
                }}
            />
        </Container>
    )
}

export default React.memo(BillerSku)
