import React, {useEffect} from "react";
import {View, TouchableOpacity} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container} from "../../../containers";
import {CSectionList, ProgressiveImage, CText, IconButton, CButton} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {gethelloPaisaRemittanceType} from "../../../store/actions/Remittance.action";
import Styles from "../currencyExchange/CurrencyExchange.style";
import {useTranslation} from "react-i18next";
import {capitalizeFirstLetter, FormatNumberWithCommas} from "../../../utils/methods";
import KamelPayIcon from "../../../assets/icons/KamelPayIcon";

function RemittanceType(props) {
    const { t } = useTranslation();

    const {route: {params: data}, navigation} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.SEND_MONEY'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            user: auth.user,
            loading: remittance.helloPaisaTypesLoading,
            data: remittance.helloPaisaTypes,
            specialBanks: remittance.helloPaisaSpecialBanks,
            masterDetails: global.masterDetails,
        }
    });

    const get = () => {
        let payload = {
            Country: data?.country?.Name
        };
        dispatch(gethelloPaisaRemittanceType(payload));
    };

    useEffect(() => {
        if(data?.country){
            get();
        }
    }, [data]);

    const icons = {
        BankAccount: 'bank-icon',
        COTC: 'cashpickup',
        'Mobile Wallet': 'mobile-wallet',
    };

    const onSelect = (item) => {
        if(item?.BankName) {
            navigation.navigate('send_money_bank_branches', {
                country: data?.country,
                ...(data?.pageType && {pageType: data?.pageType}),
                bank: item,
                type:{
                    Value: item?.BankType,
                    Name: item?.BankTypeName
                }
            })
        } else {
            navigation.navigate('send_money_banks', {
                country: data?.country,
                ...(data?.pageType && {pageType: data?.pageType}),
                type: item
            });
        }
    };

    const renderItem = ({item}) => {

        let icon = item?.BankName ? 'mobile-wallet' : icons[item?.Value];
        let title = item?.BankName ? `${item?.BankName} - ${item?.BankTypeName}` : item?.Name;

        return <TouchableOpacity style={GlobalStyle.listItem} onPress={() => onSelect(item)}>
            <IconButton
                type="icon-with-background"
                buttonStyle={Styles.listItemIconContainer}
                iconName={icon}
            />
            <CText style={GlobalStyle.listItemText}>{title}</CText>
        </TouchableOpacity>
    };

    const modifyData = () => {
        let array = [];
        array.push({
            title: '',
            _id: 'SPECIAL_BANKS',
            data: reduxState?.data
        });
        if (reduxState?.specialBanks?.length) {
            array.push({
                title: 'Mobile Wallet',
                _id: 'SPECIAL_BANKS',
                data: reduxState?.specialBanks
            })
        }
        return array
    };

    const renderSpecialCountryItem = (item) => {
        return (
            <View style={Styles.countryView}>
                <ProgressiveImage
                    style={Styles.countryViewImage}
                    source={{uri: item?.FlagPng}}
                    resizeMode='contain'
                    fallback
                    defaultSource={require('../../../assets/images/others.png')}
                />
                <View style={Styles.countryViewContent}>
                    <CText style={Styles.countryViewContentTitle} numberOfLines={1}>
                        {capitalizeFirstLetter(item?.Name)}
                    </CText>
                    <View style={Styles.specialListItemRateContainer}>
                        <CText style={Styles.countryViewContentRate}>1 AED {t('SEND_MONEY.TO')} </CText>
                        <FormatNumberWithCommas
                            truncatedValue={item?.singleAmountUnit * 1 || 0}
                            currency={item?.Currency}
                            styleAmount={[Styles.countryViewContentRate, Styles.blueColor]}
                            numberOfLines={1}
                        />
                    </View>
                </View>
            </View>
        )
    };
    const changeCountry = () => {
        navigation.navigate('send_money_countries', {
            ...(data?.pageType && {pageType: data?.pageType}),
        })
    };

    return (
        <Container
            loading={reduxState.loading}
            headerProps={headerProps}>

            <View style={Styles.countryViewContainer}>
                <View style={Styles.countryViewHeader}>
                    <CText style={Styles.countryViewHeaderTitle}>{t('GLOBAL.RECEIVER_COUNTRY')}</CText>
                    {reduxState?.masterDetails?.accessOtherCountryInRemittance ? <CButton
                        buttonStyle={Styles.countryViewHeaderButton}
                        type={'outline'}
                        colorType={'secondary'}
                        title={t('GLOBAL.CHANGE_COUNTRY')}
                        onPress={() => changeCountry()}
                    /> : null}
                </View>

                {renderSpecialCountryItem(data?.country)}
            </View>

            <CText style={GlobalStyle.listTitle}>
               {t('SEND_MONEY.TYPE.TITLE')}
            </CText>

            <CSectionList
                contentContainerStyle={GlobalStyle.list}
                data={modifyData()}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/empty-beneficiary.png'),
                    text: t('SEND_MONEY.TYPE.NOT_FOUND')
                }}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
            />

            <View style={{...Styles.bottomFooterImage, ...{marginBottom: 20}}}>
                <ProgressiveImage style={GlobalStyle.listSecondHeaderRightImage}
                                  source={require('../../../assets/images/hellopaisa-logo.png')}/>
            </View>

        </Container>
    )
}

export default React.memo(RemittanceType)
