import React, {useCallback, useEffect, useState} from "react";
import {CList, CInput} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {View} from "react-native";
import Product from "./Product";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {getProducts} from "../../../store/actions/Bnpl.action";
import {debounce} from "lodash";
import {themes} from "../../../theme/colors";

function Products(props) {

    const { t } = useTranslation();

    const navigation  = useNavigation();
    const dispatch  = useDispatch();
    const {route: { params: data }} = props;

    const [searchText, updateSearchText] = useState('');
    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    const reduxState = useSelector(({bnpl, global}) => {
        return {
            loading: bnpl.getProductsLoading,
            data: bnpl.products,
            isLoadMore: bnpl.productsIsLoadMore,
            isLoadMoreLoading: bnpl.productsIsLoadMoreLoading,
            metaData: bnpl.productsMetaData,
            card: global.selectedCard,
        }
    });

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
            ...(data?.category?._id && { category: data?.category?._id }),
            ...(data?.subCategory?._id && { subCategory: data?.subCategory?._id }),
            ...(text && { search: text }),
            cardId: reduxState.card?._id
        };
        dispatch(getProducts(payload))
    };

    const navigate = (item) => {
        navigation.navigate('bnpl_product_detail', {
            product: item
        })
    };

    const renderItems = ({item, index}) => {
        return (
            <Product
                key={index}
                data={item}
                onPress={() => navigate(item)}
            />
        )
    };

    const headerProps = {
        headerTitle: data?.subCategory?.name || 'Products',
        headerRight: true
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
                nestedScrollEnabled={props?.nestedScrollEnabled}
                contentContainerStyle={[{paddingHorizontal: 25}]}
                data={reduxState?.data}
                loading={reduxState?.loading}
                renderItem={renderItems}
                numColumns={2}
                automaticallyAdjustContentInsets={true}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/3d-vector/empty-products.png'),
                    text: 'No Products Found'
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

export default React.memo(Products)
