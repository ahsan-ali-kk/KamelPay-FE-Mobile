import React, {useCallback, useEffect, useState} from "react";
import {Container} from "../../../containers";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {CInput, CList, CListItem} from "../../../uiComponents";
import {themes} from "../../../theme/colors";
import {debounce} from "lodash";
import {getCategories} from "../../../store/actions/Bnpl.action";

function Categories() {

    const { t } = useTranslation();

    const navigation  = useNavigation();
    const dispatch  = useDispatch();

    const [searchText, updateSearchText] = useState('');
    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    const reduxState = useSelector(({bnpl}) => {
        return {
            loading: bnpl.getCategoriesLoading,
            data: bnpl.categories,
            isLoadMore: bnpl.categoriesIsLoadMore,
            isLoadMoreLoading: bnpl.categoriesIsLoadMoreLoading,
            metaData: bnpl.categoriesMetaData,
        }
    });

    const headerProps = {
        headerTitle: 'Categories',
        headerRight: true
    };

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
        let payload = {
            page: val,
            limit: limit,
            ...(text && { search: text }),
        };
        dispatch(getCategories(payload));
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
        navigation.navigate('bnpl_sub_categories', {
            category: item
        })
    };

    const renderItem = ({item}) => {
        return <CListItem
            style={GlobalStyle.paddingHorizontal_0}
            listImageContainer={{width: 52, height: 52}}
            resizeMode={'contain'}
            source={{uri: item?.meta?.imageUrl}}
            defaultSource={require('../../../assets/images/3d-vector/categories.png')}
            iconRadius={0}
            title={item?.name}
            description={item?.description}
            onPress={() => onSelect(item)}
            rightIconName={'right-arrow'}
        />
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
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/3d-vector/empty-categories.png'),
                    text: 'No Categories Found'
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

export default React.memo(Categories)
