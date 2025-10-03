import React, { useEffect, useState, Fragment} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {trackHistory} from "../../store/actions/DtOne.action";
import {CButton, CList, CText, IconButton, Receipt} from "../../uiComponents";
import {View, TouchableOpacity} from "react-native";
import {formatAmount, status} from "../../utils/methods";
import Styles from "./DtOne.style";
import moment  from 'moment';
import {useTranslation} from "react-i18next";

function History(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {route: {params: data}, navigation} = props;

    const reduxState = useSelector(({auth, dtOne, global}) => {
        return {
            loading: dtOne.getHistoryLoading,
            data: dtOne.history,
            isLoadMore: dtOne.historyIsLoadMore,
            isLoadMoreLoading: dtOne.historyIsLoadMoreLoading,
            metaData: dtOne.historyMetaData,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
        }
    });

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [ticketPayload, updateTicketPayload] = useState({});
    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);


    useEffect(() => {
        get(1, reduxState?.card?._id);
        return () => {
            setPage(1)
        }

    }, [reduxState?.card]);

    useEffect(() => {
        get(page);
    }, [page]);

    const get = (val = 1, cardId) => {
        let payload = {
            cardId: cardId || reduxState?.card?._id,
            page: val,
            limit: limit,
        };
        dispatch(trackHistory(payload));
    };

    const onRefreshHandler = () => {
        setPage(1);
        get(1)
    };
    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };


    const headerProps = {
        headerTitle: t('PAGE_TITLE.HISTORY'),
        headerRight: true,
    };

    const cardView = (card) => {
        updateTicketPayload(card)
    };

    const renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={Styles.listItem} onPress={() => cardView(item)}>
                <IconButton
                    buttonType='normal'
                    type="icon-with-background"
                    iconName={'easypay'}
                />
                <View style={Styles.listItemContent}>
                    <View style={Styles.listItemTop}>
                        <CText style={Styles.listItemTitle} numberOfLines={1}>
                            {item?.cardCodeDetails?.name}
                        </CText>
                        <View style={[Styles.listItemStatus, status[item?.status] && {backgroundColor: status[item?.status].bgColor}]}>
                            <CText style={[Styles.listItemStatusText, status[item?.status] && {color: status[item?.status].color}]}>
                                {status[item?.status]  ? t(status[item?.status].title) : ''}
                            </CText>
                        </View>
                    </View>
                    <View style={Styles.listItemBottom}>
                        <View style={Styles.listItemBottomCode}>
                            {item?.cardCodeDetails?.code ?  <Fragment>
                                <CText style={Styles.listItemLabel}>{t('RECEIPT.SCRATCH_CODE')}</CText>
                                <CText style={Styles.listItemValue}>{item?.cardCodeDetails?.code}</CText>
                            </Fragment> : null}
                        </View>
                        <CText style={Styles.listItemDate}>{moment(item?.createdAt).format('DD/MM/YY hh:mm a')}</CText>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    const onClose = () => {
        updateTicketPayload({})
    };

    const generateReceiverDetail = (res) => {
        let info = [];

        let obj = {
            ...(res && res),
        };
        if(obj?.cardCodeDetails?.code) {
            info.push({
                Name: t('RECEIPT.SCRATCH_CODE'),
                value: obj?.cardCodeDetails?.code,
                isTitle: true
            })
        }

        if(obj?.cardCodeDetails?.name) {
            info.push({
                Name: t('RECEIPT.CARD_NAME'),
                value: obj?.cardCodeDetails?.name,
            })
        }

        if(obj?.createdAt) {
            info.push({
                Name: t('GLOBAL.DATE'),
                value: moment(obj?.createdAt).format('DD MMMM, yyyy'),
                separate: true
            });
            info.push({
                Name: t('GLOBAL.TIME'),
                value: moment(obj?.createdAt).format('hh:mm a')
            })
        }

        return info
    };

    const generateTransferAmountAndCharges = (res) => {
        let info = [];

        let obj = {
            ...(res && res),
        };

        info.push({
            Name: t('RECEIPT.PURCHASE_AMOUNT'),
            value: formatAmount(obj?.amount, Object.keys(selectedCountry?.currencies)),
        });

        info.push({
            Name: t('RECEIPT.CHARGES'),
            value: t('RECEIPT.NO_FEE')
        });

        info.push({
            Name: t('RECEIPT.VAT'),
            value: t('RECEIPT.NO_VAT')
        });

        return info
    };

    const generateSendToInfo = (res) => {
        return [
            ...generateReceiverDetail(res),
            ...generateTransferAmountAndCharges(res),
        ]
    };

    return (
        <Container headerProps={headerProps}>
            <CList
                style={{marginHorizontal: -30}}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-cards.png'),
                    text: t('EMPTY_SECTION.PURCHASE_CARD')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={() => onClose()}
                data={ticketPayload}
                infoTitle={t('RECEIPT.INFORMATION')}
                infoUpperTitle=""
                isHistory={true}
                senTo={generateSendToInfo(ticketPayload)}
            />

        </Container>
    )
}

export default React.memo(History)
