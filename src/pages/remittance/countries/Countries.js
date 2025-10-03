import React, {useCallback, useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container} from "../../../containers";
import {CInput, CList, CListItem, ProgressiveImage, CText} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {capitalizeFirstLetter, FormatNumberWithCommas} from "../../../utils/methods";
import {getHelloPaisaCountries} from "../../../store/actions/Remittance.action";
import { debounce } from 'lodash-es';
import Styles from "./Countries.style";
import {MappedElement} from "../../../utils/methods";
import {themes} from "../../../theme/colors";
import KamelPayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";

function HelloPaisaCountries(props) {
    const { t } = useTranslation();

    const {navigation, route: { params: data }} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.SEND_MONEY'),
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [show, setShow] = useState(true);

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            user: auth.user,
            loading: remittance.helloPaisaCountriesLoading,
            data: remittance.helloPaisaCountries,
            specialCountries: remittance.helloPaisaSpecialCountries,
            isLoadMore: remittance.helloPaisaCountriesIsLoadMore,
            isLoadMoreLoading: remittance.helloPaisaCountriesIsLoadMoreLoading,
            metaData: remittance.helloPaisaCountriesMetaData,
            currentCountry: global.currentCountry,
            selectedCard: global.selectedCard,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);


    const searchDebounce = useCallback(
        debounce((e) => {
            try {
                get(1, e);
            } catch (error) {

            }
        }, 500),
        []
    );

    const onChange = (val) => {
        updateSearchText(val);
        searchDebounce(val);
        setShow(!val.length)
    };

    const get = (val = 1, text) => {
        let payload = {
            page: val,
            limit: limit,
            cardId: reduxState?.selectedCard?._id,
            ...(text && { search: text }),
        };
        dispatch(getHelloPaisaCountries(payload));
    };

    useEffect(() => {
        get(page);
    }, [page]);

    const onRefreshHandler = () => {
        setPage(1);
        get(1);
    };

    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const onSelect = (item) => {
        navigation.navigate('send_money_type', {
            ...data,
            country: item
        })
    };

    const renderItem = ({item, index}) => {
        console.log('item', item)
        return <CListItem
            style={GlobalStyle.paddingHorizontal_0}
            titleStyle={Styles.listItemTitle}
            key={index}
            source={{uri: item?.FlagPng}}
            iconRadius={0}
            resizeMode='contain'
            defaultSource={require('../../../assets/images/others.png')}
            title={capitalizeFirstLetter(item?.Name)}
            onPress={() => onSelect(item)}
        >
            <View style={Styles.listItemContent}>
                <CText style={Styles.listItemText}>{t('SEND_MONEY.EXCHANGE_RATE')}</CText>
                <FormatNumberWithCommas
                    value={'1'}
                    currency={Object.keys(selectedCountry?.currencies)}
                    styleAmount={Styles.rateTitle}
                    numberOfLines={1}
                />
                <CText style={Styles.rateTitle}> = </CText>
                <FormatNumberWithCommas
                    truncatedValue={item?.singleAmountUnit * 1 || 0}
                    currency={item?.Currency}
                    styleAmount={Styles.rateTitle}
                    numberOfLines={1}
                />
            </View>
        </CListItem>
    };

    const renderSpecialCountryItem = (item, index) => {
        return (
            <TouchableOpacity key={index} style={Styles.specialListItem} onPress={() => onSelect(item)}>
                <ProgressiveImage
                    style={Styles.specialListItemImage}
                    source={{uri: item?.FlagPng}}
                    resizeMode='contain'
                    fallback
                    defaultSource={require('../../../assets/images/others.png')}
                />
                <View style={Styles.specialListItemContent}>
                    <CText style={Styles.specialListItemSubTitle}>01 AED {t('SEND_MONEY.TO')}</CText>
                    <View style={Styles.specialListItemRateContainer}>
                        <FormatNumberWithCommas
                            truncatedValue={item?.singleAmountUnit * 1 || 0}
                            currency={item?.Currency}
                            styleAmount={Styles.specialListItemRate}
                            numberOfLines={1}
                        />
                        <KamelPayIcon
                            style={Styles.specialListItemRateIcon}
                            name="thin-arrow-left"/>
                    </View>
                    <CText style={Styles.specialListItemTitle} numberOfLines={1}>
                        {capitalizeFirstLetter(item?.Name)}
                    </CText>
                </View>
            </TouchableOpacity>
        )
    };

    const renderSpecialCountries = (data) => {
        if(show && data?.length) {
            return (
                <View style={Styles.specialCountries}>
                    <View style={Styles.specialCountriesHeader}>
                        <CText style={Styles.specialCountriesHeaderText}>{t('SECTION_LABELS.POPULAR_COUNTRIES')}</CText>
                    </View>
                    <View style={Styles.specialList}>
                        <MappedElement data={data} renderElement={renderSpecialCountryItem} />
                    </View>
                </View>
            )
        }
        return null
    };

    const renderListHeaderComponent = () => {
        return <View>
            <CText style={[GlobalStyle.listTitle]}>
                {t('SECTION_LABELS.SELECT_OTHER_COUNTRY')}
            </CText>
            <View style={[GlobalStyle.listHeader]}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={(val) => onChange(val)}
                    inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                    inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                    leftIconName={'search'}
                    iconStyle={{color: themes['light'].colors.gray8}}
                    onSubmitEditing={() => null}
                />
            </View>
        </View>
    };

    return (
        <Container headerProps={headerProps}>

            {renderSpecialCountries(reduxState?.specialCountries)}

            {renderListHeaderComponent()}
            <CList
                // ListHeaderComponent={renderListHeaderComponent}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/country-not-found.png'),
                    text: t('EMPTY_SECTION.NO_COUNTRIES_FOUND')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

        </Container>
    )
}

export default React.memo(HelloPaisaCountries)
