import React, {useCallback, useEffect, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container} from "../../../containers";
import {CInput, CList, CListItem, ProgressiveImage, CText} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {gethelloPaisaBanks} from "../../../store/actions/Remittance.action";
import { debounce } from 'lodash-es';
import {themes} from "../../../theme/colors";
import {useTranslation} from "react-i18next";

function HelloPaisaBanks(props) {
    const { t } = useTranslation();

    const {route: { params: data }, navigation} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.BANKS'),
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [isBranch, updateIsBranch] = useState(false);

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            user: auth.user,
            loading: remittance.helloPaisaBanksLoading,
            data: remittance.helloPaisaBanks,
            isLoadMore: remittance.helloPaisaBanksIsLoadMore,
            isLoadMoreLoading: remittance.helloPaisaBanksIsLoadMoreLoading,
            metaData: remittance.helloPaisaBanksMetaData,
        }
    });

    useEffect(() => {
        const {country, type} = data;
        if((country?.CCA2 === "IN" || country?.cca2 === "IN") && type?.Value === "BankAccount") {
            navigation.navigate('send_money_ifsc_code', data)
        }
        else if((country?.CCA2 === "PK" || country?.cca2 === "PK") && type?.Value === "BankAccount") {
            navigation.navigate('send_money_iban', data)
        }
    }, []);

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
        searchDebounce(val)
    };

    const get = (val = 1, text = searchText) => {
        let countryName = data?.country.Name || data?.country.name;
        let payload = {
            page: val,
            limit: limit,
            Country: countryName,
            BankType: data?.type.Value,
            ...(text && { search: text }),
        };
        dispatch(gethelloPaisaBanks(payload, callback));
    };

    const callback = (res) => {
        updateIsBranch(res?.isBranch || false);
        if(res?.data && res?.data.length === 1 && res?.isBranch) {
            onSelect(res?.data[0], true)
        }
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

    const onSelect = (item, value = isBranch) => {
        navigation.navigate('send_money_bank_branches', {
            ...data,
            bank: item,
            ...(value && {searchText: searchText})
        })
    };

    const renderItem = ({item}) => {
        return <CListItem
            style={GlobalStyle.paddingHorizontal_0}
            localSource={require('../../../assets/images/bank-icon01.png')}
            iconRadius={0}
            title={item?.BankName}
            onPress={() => onSelect(item)}
            rightIconName={'right-arrow'}
        />
    };

    const listHeaderComponent = () => {
        return (
            <View style={[GlobalStyle.listSecondHeader, {marginHorizontal: -30}]}>
                <CText style={[GlobalStyle.listTitle, {flex: 1, marginTop: 0, marginBottom: 0}]}>
                    {t('SEND_MONEY.SELECT_BANK')}
                </CText>
                <ProgressiveImage style={GlobalStyle.listSecondHeaderRightImage}
                                  source={require('../../../assets/images/hellopaisa-logo.png')}/>
            </View>
        )
    };

    return (
        <Container headerProps={headerProps}>

            <View style={GlobalStyle.listHeader}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH_HERE')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={val => onChange( val)}
                    inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                    inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                    leftIconName={'search'}
                    {...(searchText ? { rightIconName : 'close'} : null)}
                    toggleRightIconFunc={() => onChange('')}
                    iconStyle={{color: themes['light'].colors.gray8}}
                    onSubmitEditing={() => null}
                />
            </View>

            <CList
                ListHeaderComponent={listHeaderComponent}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/empty-bank.png'),
                    text: t('EMPTY_SECTION.NO_BANKS_FOUND')
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

export default React.memo(HelloPaisaBanks)
