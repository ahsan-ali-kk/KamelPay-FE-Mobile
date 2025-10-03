import React, {Fragment, useEffect, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container} from "../../../containers";
import {CInput, CList, CListItem, CText} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {getSKUOfBiller} from "../../../store/actions/PayBill.action";
import {convertToSlug} from "../../../utils/methods";
import {iconBaseUrl, iconBilrsBaseUrl} from "../../../utils/intercepter";
import {themes} from "../../../theme/colors";
import {useTranslation} from "react-i18next";

function Billers(props) {
    const { t, i18n } = useTranslation();

    const {navigation, route: {params: data}} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: `${t('PAY_BILL.PAY')} ${data?._id} ${t('PAY_BILL.BILL')}`,
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');
    const [filteredCountry, updateFilteredCountry] = useState([]);


    useEffect(() => {
        if(data?.selectedSKU) {
            getSku(data?.selectedSKU)
        }
        updateFilteredCountry(data.Billers)
    }, []);

    const reduxState = useSelector(({payBill}) => {
        return {
            loading: payBill.billersLoading,
            billerSkuLoading: payBill.billerSkuLoading
        }
    });

    const handleChange = (val) => {
        updateSearchText(val);
        let foundArray = [];
        if(val && data?.Billers) {
            foundArray = data?.Billers.filter((o) => o?.BillerName.toLowerCase().includes(val?.toLowerCase()));
        } else {
            foundArray = data?.Billers
        }
        updateFilteredCountry(foundArray)
    };

    const getSKUOfBillerCallback = (res) => {

        let bInfo = {
            billerType: data?._id,
            ...(data?.moduleType && {moduleType: data?.moduleType})
        };

        if(Array.isArray(res?.sku)) {
            navigation.navigate('pay_bill_biller_sku', {biller: res?.biller, ...bInfo})
        } else {
            navigation.navigate('pay_bill_biller_sku_io', {...res, ...bInfo})
        }
    };

    const getSku = (item) => {
        dispatch(getSKUOfBiller(item, '', getSKUOfBillerCallback))
    };


    const renderItem = ({item, index}) => {
        let iconUrl = `${iconBilrsBaseUrl}/${item?.CountryCode}/${convertToSlug(item?.BillerID)}.png`;
        return (
            <CListItem
                style={GlobalStyle.paddingHorizontal_0}
                key={index}
                iconRadius={0}
                defaultSource={require('../../../assets/images/others.png')}
                source={{ uri: iconUrl }}
                title={item.BillerName}
                onPress={() => getSku(item)}
                rightIconName={'right-arrow'}
            />
        )
    };

    const renderListHeaderComponent = () => {
        return (
            <Fragment>
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0]}>
                    {t('PAY_BILL.SELECT_COMPANY')}
                </CText>
            </Fragment>
        )
    };

    return (
        <Container headerProps={headerProps}>

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
                data={filteredCountry}
                loading={reduxState.loading || reduxState.billerSkuLoading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/empty-bills.png'),
                    text: t('PAY_BILL.COMPANY_NOT_FOUND')
                }}
            />

        </Container>
    )
}

export default React.memo(Billers)
