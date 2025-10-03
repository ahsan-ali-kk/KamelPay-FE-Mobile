import React, {Fragment, useEffect, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {Container} from "../../containers";
import {CButton, CInput, CList, CListItem, CText} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {convertToSlug} from "../../utils/methods";
import {getMobileCarrierLookup} from "../../store/actions/TopUp.action";
import Popup from "../../uiComponents/popup/Popup";
import {iconBaseUrl} from "../../utils/intercepter";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";
import {getSKUOfBiller} from "../../store/actions/PayBill.action";

function Billers(props) {
    const { t, i18n } = useTranslation();

    const {navigation, route, data: billers, hideHeader = false, toggleCountryModal} = props;

    let data = route?.params || billers;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('MOBILE_TOPUP.TITLE'),
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');
    const [filteredBillers, updateFilteredBillers] = useState([]);

    const reduxState = useSelector(({topUp, payBill}) => {
        return {
            loading: topUp.mobileCarriersLoading || payBill.billerSkuLoading || topUp.getBillersByCountry,
        }
    });

    useEffect(() => {
        updateFilteredBillers(data?.Billers)
    }, [data]);

    const handleChange = (val) => {
        updateSearchText(val);
        let foundArray = [];
        if(val && data?.Billers) {
            foundArray = data?.Billers.filter((o) => o?.BillerName.toLowerCase().includes(val?.toLowerCase()));
        } else {
            foundArray = data?.Billers
        }
        updateFilteredBillers(foundArray)
    };

    const callBack = (res) => {

        if(res?.billerFound) {
            navigation.navigate('mobile_topup_pay', {
                data: res?.data,
                payload: data?.payload,
                ...(data?.pageType && {pageType: 'beneficiary'}),
                ...(data?.moduleType && {moduleType: data?.moduleType})
            })
        } else {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: t('MOBILE_TOPUP.LOOK_UP_ERROR_TITLE'),
                text: t('MOBILE_TOPUP.LOOK_UP_ERROR_SUB_TITLE'),
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () => Popup.hide()
                    }
                ]
            })
        }

    };

    const getBillerInfo = (item) => {
        if(item?.BillerType?.includes('Postpaid')) {
            getSku(item)
        } else {
            let payload = {
                ...data?.payload,
                BillerID: item?.BillerID
            };
            dispatch(getMobileCarrierLookup(payload, callBack))
        }
    };

    const getSKUOfBillerCallback = (res) => {
        let bInfo = {
            billerType: data?._id,
            whereToFrom: 'TOPUP'
        };
        if(Array.isArray(res?.sku)) {
            navigation.navigate('pay_bill_biller_sku', {
                biller: res?.biller,
                ...bInfo,
                ...(data?.moduleType && {moduleType: data?.moduleType})
            })
        } else {
            navigation.navigate('pay_bill_biller_sku_io', {
                ...res,
                ...bInfo,
                ...(data?.moduleType && {moduleType: data?.moduleType})
            })
        }
    };

    const getSku = (item) => {
        dispatch(getSKUOfBiller(item, '', getSKUOfBillerCallback))
    };


    const renderItem = ({item, index}) => {
        let iconUrl = `${iconBaseUrl}/${item?.CountryCode}/${convertToSlug(item?.BillerName)}.png`;
        return (
            <CListItem
                style={GlobalStyle.paddingHorizontal_0}
                key={index}
                iconRadius={0}
                defaultSource={require('../../assets/images/others.png')}
                source={{ uri: iconUrl }}
                title={item.BillerName}
                onPress={() => getBillerInfo(item)}
                rightIconName={'right-arrow'}
            />
        )
    };

    const renderListHeaderComponent = () => {
        return (
            <Fragment>
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0]}>
                    {t('MOBILE_TOPUP.SELECT_SERVICE_PROVIDER')}
                </CText>
            </Fragment>
        )
    };

    return (
        <Container {...(!hideHeader && {headerProps: headerProps})}>
            <View style={[GlobalStyle.listHeader]}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={val => handleChange( val)}
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
                data={filteredBillers}
                loading={reduxState.loading || reduxState.billerSkuLoading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-mobile-topup.png'),
                    text: t("MOBILE_TOPUP.SERVICE_PROVIDER_NOT_FOUND")
                }}
            />
            {toggleCountryModal ? <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('GLOBAL.CHANGE_COUNTRY')}
                         // type={'without_outline'}
                         disabled={reduxState.loading}
                         onPress={() => toggleCountryModal()}/>
            </View> : null}

        </Container>
    )
}

export default React.memo(Billers)
