import React, {useEffect, useState} from "react";
import {View, ScrollView} from "react-native";
import {Container} from "../../../containers";
import {CList, CButton, CText, ProgressiveImage} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {MappedElement, SERVICES, setHours} from "../../../utils/methods";
import {getTransactionHistory} from "../../../store/actions/Bnpl.action";
import moment from "moment";
import Styles from "./History.style";
import {useTranslation} from "react-i18next";
import Popup from "../../../uiComponents/popup/Popup";
import {generateTaxInvoice} from "../../../store/actions/Global.action";

function History(props) {
    const { t } = useTranslation();

    const {navigation} = props;
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: "History",
        headerRight: true,
    };

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(null);

    const reduxState = useSelector(({auth, global, bnpl}) => {
        return {
            user: auth.user,
            loading: bnpl.getTransactionHistoryLoading || global?.generateTaxInvoiceLoading,
            data: bnpl.transactionHistory,
            isLoadMore: bnpl.transactionHistoryIsLoadMore,
            isLoadMoreLoading: bnpl.transactionHistoryIsLoadMoreLoading,
            metaData: bnpl.transactionHistoryMetaData,
            card: global.selectedCard,
        }
    });

    const get = (val = 1, filter = null) => {
        let payload = {
            page: val,
            limit: limit,
            cardId: reduxState?.card?._id,
            time: filter && filter?.key === "CUSTOM" ? 1 : -1,
            ...(filter && {
                from: setHours(filter?.from, 'from'),
                to: setHours(filter?.to, 'to'),
            })
        };
        dispatch(getTransactionHistory(payload));
    };

    useEffect(() => {
        get(page, filterPayload);
    }, [page, filterPayload]);

    const onRefreshHandler = () => {
        setPage(1);
    };
    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const view = (item) => {
        navigation.navigate('bnpl_history_view', {
            ...item
        })
    };

    const getProductVariantValues = (obj) => {
        return obj?.productDetail?.type === "WITH_VARIANTS" ? (obj?.productVariantDetail?.productVariantsValuesString) : '';
    };

    const getStatus = () => {
        return {
            PENDING: {
                _id: 'PENDING',
                text: 'Pending',
                color: '#0065FF',
                bgColor: '#e7edf6'
            },
            ACCEPTED: {
                _id: 'ACCEPTED',
                text: 'Accepted',
                color: '#66bd50',
                bgColor: '#e7f0e5',
            },
            REJECTED: {
                _id: 'REJECTED',
                text: 'Rejected',
                color: '#de4841',
                bgColor: '#f3e4e3',
            },
            EMI_REJECTED: {
                _id: 'EMI_REJECTED',
                text: 'EMI Rejected',
                color: '#de4841',
                bgColor: '#f3e4e3',
            },
            SHIPPING: {
                _id: 'SHIPPING',
                text: 'Shipping',
                color: '#f5a200',
                bgColor: '#f6eddd',
            },
            SHIPPED: {
                _id: 'SHIPPED',
                text: 'Shipped',
                color: '#ffd52a',
                bgColor: '#f6f2e1',
            },
            DELIVERED: {
                _id: 'DELIVERED',
                text: 'Delivered',
                color: '#00a45e',
                bgColor: '#ddede6',
            },
            REFUNDED: {
                _id: 'REFUNDED',
                text: 'Refunded',
                color: '#ff5630',
                bgColor: '#f6e6e2',
            }
        }
    };

    const renderProduct = (item, index) => {
        let statusObj = getStatus()[item.status];
        return (
            <View key={index} style={[Styles.listItemBodyProductItem, index === 0 && Styles.margin_left_0]}>
                <ProgressiveImage
                    style={Styles.listItemBodyProductItemImage}
                    source={{uri: item?.productDetail?.meta?.imageUrls[0]}}
                    resizeMode={'contain'}
                />
                <View style={Styles.listItemBodyProductContent}>
                    <CText style={[Styles.listItemBodyProductText, Styles.listItemBodyProductTitle]}>
                        {item?.productDetail?.name}
                    </CText>
                    {getProductVariantValues(item) ? <CText style={Styles.listItemBodyProductText}>
                        {getProductVariantValues(item)}
                    </CText> : null}

                    <View style={[Styles.listItemBodyProductStatus, {
                        backgroundColor: statusObj?.bgColor
                    }]}>
                        <CText style={[Styles.listItemBodyProductStatusText, {
                            color: statusObj?.color
                        }]}>
                            {statusObj?.text}
                        </CText>
                    </View>

                </View>
            </View>
        )
    };

    const renderProducts = (data) => {
        return (
            <ScrollView
                nestedScrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={Styles.listItemBodyProducts}
                contentContainerStyle={Styles.listItemBodyProductsContainer}
            >
                <MappedElement
                    data={data}
                    renderElement={renderProduct}
                />
            </ScrollView>
        )
    };

    const generateTaxInvoiceCallback = (item) => {
        Popup.show({
            isVisible: true,
            showClose: false,
            type: 'Success',
            title: t(item?.title),
            text: `${t(item?.messagePartOne)} ${t(item?.messagePartTow)}.`,
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => Popup.hide()
                },
            ]
        });
    };
    const generateTaxInvoiceFun = (item) => {
        let payload = {
            id: item?._id,
            type: item?.meta?.hasBnpl ? SERVICES.BNPL._id : SERVICES.ECOMMERCE._id,
        };
        dispatch(generateTaxInvoice(payload, generateTaxInvoiceCallback))
    };


    const renderItem = ({item, index}) => {
        return (
            <View key={index} style={Styles.listItem}>
                <View style={Styles.listItemHeader}>
                    <View style={Styles.listItemHeaderContent}>
                        <CText style={[Styles.listItemHeaderText, Styles.listItemHeaderTitle]}>
                            Order {item?.transactionId}
                        </CText>
                        <CText style={[Styles.listItemHeaderText, Styles.listItemHeaderSubTitle]}>
                            Placed On {moment(item?.time).format('MMM DD, YYYY')}
                        </CText>
                    </View>
                    <View style={Styles.listItemLeft}>
                        <CButton
                            title={'View Detail'}
                            iconName={'right-arrow'}
                            onPress={() => view(item)}
                            buttonStyle={Styles.listItemHeaderButton}
                            buttonText={Styles.listItemHeaderButtonText}
                            iconStyle={Styles.listItemHeaderButtonIcon}
                        />
                    </View>
                </View>
                <View style={Styles.listItemBody}>
                    {renderProducts(item?.orderProducts)}
                </View>
                {item?.status === 'SUCCESS' ? <CButton
                    buttonStyle={{marginTop: 15}}
                    buttonText={{textDecorationLine: 'underline'}}
                    type="outline"
                    onPress={() => generateTaxInvoiceFun(item)}
                    title={t('GLOBAL.GENERATE_TAX_INVOICE')}/> : null }
            </View>
        )
    };

    return (
        <Container headerProps={headerProps}>

            <CList
                contentContainerStyle={Styles.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/beneficiary-not-found.png'),
                    text:t('EMPTY_SECTION.NO_HISTORY_FOUND')
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

export default React.memo(History)
