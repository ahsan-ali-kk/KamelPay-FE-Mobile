import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {Container} from "../../containers";
import {CList, CText, ProgressiveImage, DateFilter} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {foundProduct, setHours, status} from "../../utils/methods";
import moment from "moment";
import Styles from "../remittance/history/History.style";
import {useTranslation} from "react-i18next";
import {getHistory} from "../../store/actions/Lottery.action";
import {useNavigation} from "@react-navigation/native";

function History(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.HISTORY'),
        headerRight: true,
    };

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(null);

    const reduxState = useSelector(({auth, global, lottery}) => {
        return {
            user: auth.user,
            loading: lottery.getHistoryLoading,
            data: lottery.history,
            isLoadMore: lottery.historyIsLoadMore,
            isLoadMoreLoading: lottery.historyIsLoadMoreLoading,
            metaData: lottery.historyMetaData,
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
        dispatch(getHistory(payload));
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
        let payload = {...item};
        payload.Currency = item?.c_currency;
        payload.foreignCurrency = item?.c_currency;
        payload.amountInAED = item?.amountInAED;
        payload.message = payload?.meta?.message || t(status[item?.status]?.message);
        payload.icon = status[item?.status]?.iconName;
        // updateTicketPayload(payload)
        navigation.navigate('lottery_check', payload)
    };

    const renderItem = ({item, index}) => {
        let ticketNumber = item?.ticketNumber && item?.ticketNumber.toString();
        return (
            <TouchableOpacity key={index} style={[Styles.listItem, Styles.rowListItem]} onPress={() => view(item)}>
                <View style={Styles.listItemCardVectorContainer}>
                    <ProgressiveImage
                        style={Styles.listItemCardVector}
                        source={foundProduct(item?.card?.companyProductCode).cardVector}/>
                </View>
                <View style={[Styles.listItemContain]}>
                    <View style={Styles.listItemLeft}>
                        <CText style={Styles.listItemTitle} numberOfLines={1}>
                            {item?.campaign?.c_prizeTitle}
                        </CText>
                        <CText style={[Styles.ticketNumberTitle]}> {t('RECEIPT.TICKET_NUMBERS')} </CText>
                        <CText style={[Styles.ticketNumbers]}>
                            {ticketNumber?.replaceAll(',', '\n')}
                        </CText>
                        {item?.campaign?.c_endTime ? <CText style={Styles.date}>
                            {t('PRIZE_DRAW.MAX_DRAW_DATE')} {moment(item?.campaign?.c_endTime).format('MMMM DD, yyyy')}
                            </CText> : null}
                    </View>
                    <View style={Styles.listItemRight}>
                        <View style={[Styles.listItemTag, status[item?.status] && {backgroundColor: status[item?.status].bgColor}]}>
                            <CText style={[Styles.listItemTagText, status[item?.status] && {color: status[item?.status].color}]}>
                                {status[item?.status]  ? t(status[item?.status].title) : ''}
                            </CText>
                        </View>
                        <CText style={[Styles.listItemAmount, {marginBottom: 0, textAlign: 'right'}]}>
                            {Number(item?.totalAmount)} {item?.campaign?.c_currency}
                        </CText>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    const filterOnChange = (values) => {
        updateFilterPayload(values);
        setPage(1);
    };

    return (
        <Container headerProps={headerProps}>

            <DateFilter onChange={(values) => filterOnChange(values)} />

            <CList
                contentContainerStyle={Styles.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-bills.png'),
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
