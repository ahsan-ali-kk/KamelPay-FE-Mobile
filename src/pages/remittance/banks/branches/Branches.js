import React, {useCallback, useEffect, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {Container} from "../../../../containers";
import {CInput, CList, CListItem, ProgressiveImage, CText, CLoading} from "../../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {gethelloPaisaBankBranches} from "../../../../store/actions/Remittance.action";
import { debounce } from 'lodash-es';
import Preview from "../preview/Preview";
import _ from 'lodash';
import {themes} from "../../../../theme/colors";
import {useTranslation} from "react-i18next";

function HelloPaisaBankBranches(props) {
    const { t } = useTranslation();

    const {route: { params: data }, navigation} = props;
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: data?.bank.BankName || ' ',
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [isOpen, updateIsOpen] = useState(false);
    const [confirmationData, updateConfirmationData] = useState(null);
    const [loading, updateLoading] = useState(false);


    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            user: auth.user,
            loading: remittance.helloPaisaBankBranchesLoading,
            data: remittance.helloPaisaBankBranches,
            isLoadMore: remittance.helloPaisaBankBranchesIsLoadMore,
            isLoadMoreLoading: remittance.helloPaisaBankBranchesIsLoadMoreLoading,
            metaData: remittance.helloPaisaBankBranchesMetaData,
        }
    });

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

    const getCallback = (array, text = '') => {
        if(array?.length && array?.length === 1) {
            if(data?.searchText || !text.length) {
                showConfirm(true, {
                    ...data,
                    bank: array[0],
                });
            }
        }
    };

    const get = (val = 1, text = searchText) => {
        let countryName = data?.country?.Name || data?.country?.name;
        let payload = {
            page: val,
            limit: limit,
            Country: countryName,
            BankType: data?.type?.Value,
            BankName: data?.bank?.BankName,
            ...(text && { search: text }),
        };
        dispatch(gethelloPaisaBankBranches(payload, (res) => getCallback(res, text)));
    };

    useEffect(() => {
        if(!data?.searchText) {
            get(page);
        }
    }, [page]);

    useEffect(() => {
        if(data?.searchText) {
            onChange(data?.searchText)
        }
    }, [data?.searchText]);

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
        showConfirm(true, {
            ...data,
            bank: item,
        });
    };

    const renderItem = ({item}) => {
        return <CListItem
            style={GlobalStyle.paddingHorizontal_0}
            localSource={require('../../../../assets/images/bank-icon01.png')}
            iconRadius={0}
            title={item?.BranchName || t('SEND_MONEY.BRANCH_LESS')}
            onPress={() => onSelect(item)}
            rightIconName={'right-arrow'}
        />
    };

    const showConfirm = (value = false, data = null) => {
        updateConfirmationData(data);
        updateIsOpen(value);
    };

    const changeBank = () => {
        if(data?.goBackWithRoute) {
            updateIsOpen(false)
        } else {
            updateLoading(true);
            let prevData = confirmationData;
            showConfirm();
            setTimeout(() => {
                updateLoading(false);
                if (prevData?.bank?.SpecialBank) {
                    navigation.navigate('send_money_type', _.omit(prevData, ['bank', 'type']))
                } else if (prevData?.bank?.BranchName) {
                } else {
                    navigation.navigate('send_money_banks', _.omit(prevData, ['bank']))
                }
            }, 100)
        }
    };

    const confirm = () => {
            updateLoading(true);
            let prevData = confirmationData;
            showConfirm();
            setTimeout(() => {
                updateLoading(false);
                // if(data?.pageType === 'ADD_NEW_BENEFICIARY') {
                    navigation.replace('send_money_beneficiary_details', prevData)
                // } else {
                //     navigation.replace('send_money_exchange_rate', prevData)
                // }

            }, 100)
    };

    const listHeaderComponent = () => {
        return (
            <View style={[GlobalStyle.listSecondHeader, {marginHorizontal: -30}]}>
                <CText style={[GlobalStyle.listTitle, {flex: 1, marginTop: 0, marginBottom: 0}]}>
                    {t('SEND_MONEY.SELECT_BANK_BRANCH')}
                </CText>
                <ProgressiveImage style={GlobalStyle.listSecondHeaderRightImage}
                                  source={require('../../../../assets/images/hellopaisa-logo.png')}/>
            </View>
        )
    }

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
                    icon: require('../../../../assets/images/empty-bank.png'),
                    text: t('EMPTY_SECTION.NO_BANK_BRANCHES_FOUND')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

            <Preview
                value={isOpen}
                data={confirmationData}
                onChange={() => changeBank()}
                onConfirm={() => confirm()}
                onClose={() => changeBank()}
            />

            {loading ? <CLoading showAnimation={true} loading={true}/> : null}

        </Container>
    )
}

export default React.memo(HelloPaisaBankBranches)
