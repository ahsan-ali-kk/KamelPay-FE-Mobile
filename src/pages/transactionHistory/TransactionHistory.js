import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {Container} from "../../containers";
import {CList, CText, IconButton, DateFilter, CButton} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {getTransaction, syncTransaction} from "../../store/actions/TransactionHistory.action";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./TransactionHistory.style";
import {FormatNumberWithCommas, setHours} from "../../utils/methods";
import KamlepayIcon from "../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {dateFilters} from "../../uiComponents/dateFilter/DateFilter";

export const renderTime = (value) => {
    const c  = value.split('T');
    let timeString = c[1];
    let H = +timeString.substr(0, 2);
    let h = (H % 12) || 12;
    let ampm = H < 12 ? "AM" : "PM";
    timeString = h + timeString.substr(2, 3) + ' ' +  ampm;
    return `${c[0]} ${timeString}`
};

export function TransactionHistoryItem(props) {
    const { t } = useTranslation();

    const {item, index = 0, style, onPres} = props;

    const renderReceiptTag = (depositSlip) => {
        let text = depositSlip ? t('GLOBAL.RECEIPT_UPLOADED') : t('GLOBAL.UPLOAD_RECEIPT');
        return (
            <View style={[Styles.listItemTag, depositSlip && Styles.listItemTagUploaded]}>
                <CText style={[Styles.listItemTagText, depositSlip && Styles.listItemTagUploadedText]}>
                    {text}
                </CText>
            </View>
        )
    };

    return (
        <TouchableOpacity style={[Styles.listItem, index === 0 && Styles.listItemBorderNone, style]}
                          onPress={onPres}>
            <IconButton
                type="icon-with-background"
                buttonStyle={Styles.listItemIcon}
                iconName={'transactions'}
            />
            <View style={Styles.listItemContent}>
                <CText numberOfLines={2} style={Styles.listItemTitle}>{item?.description}</CText>
                <CText numberOfLines={1} style={Styles.listItemDate}>{item.time ? renderTime(item.time) : null}</CText>
                <View style={Styles.remainingBalanceItem}>
                    <CText style={Styles.remainingBalanceItemText}>{t('GLOBAL.REMAINING_BALANCE')}</CText>
                    <FormatNumberWithCommas
                        value={item?.availableBalance || 0}
                        styleAmount={Styles.remainingBalanceItemAmount}
                        numberOfLines={1}
                    />
                </View>
            </View>
         <View style={Styles.listItemRightContent}>
             {renderReceiptTag(item?.depositSlip)}
             <View style={Styles.listItemAmountContainer}>
                 <KamlepayIcon style={[Styles.listItemAmountIcon, item?.mode === 'DEBIT' && Styles.redIcon]}
                               name={item?.mode === 'DEBIT' ? 'caret-up' : 'caret-down'}/>
                 <FormatNumberWithCommas
                     value={item.amount}
                     styleAmount={Styles.listItemAmount}
                     numberOfLines={1}
                 />
             </View>
         </View>
        </TouchableOpacity>
    )
}

function TransactionHistory(props) {

    const { t } = useTranslation();
    const navigation  = useNavigation();
    const {route: {params: data}} = props;

    const headerProps = {
        headerTitle: t('PAGE_TITLE.TRANSACTION_HISTORY'),
        headerRight: true,
    };

    const dispatch = useDispatch();

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(data?.selected === 'TODAY' ? dateFilters(t)[0] : null);

    const reduxState = useSelector(({global, auth, transactionHistory}) => {
        return {
            user: auth.user,
            loading: transactionHistory.loading,
            syncLoading: transactionHistory.syncTransactionLoading,
            data: transactionHistory.data,
            isLoadMore: transactionHistory.isLoadMore,
            isLoadMoreLoading: transactionHistory.isLoadMoreLoading,
            metaData: transactionHistory.metaData,
            card: global.selectedCard
        }
    });

    const get = (val = 1, filter = null) => {
        let payload = {
            cardId: reduxState?.card?._id,
            page: val,
            limit: limit,
            time: filter && filter?.key === "CUSTOM" ? 1 : -1,
            ...(filter && {
                from: setHours(filter?.from, 'from'),
                to: setHours(filter?.to, 'to'),
            })
        };
        dispatch(getTransaction(payload));
    };

    useEffect(() => {
        get(page, filterPayload);
    }, [page, filterPayload]);

    const onRefreshHandler = () => {
        setPage(1);
    };

    const onEndReached = () => {
        if (reduxState.data?.length < reduxState.metaData?.totalDocuments) {
            setPage(page + 1);
        }
    };

    const renderTransactionItems = ({item, index}) => {
        return (
            <TransactionHistoryItem
                key={index}
                index={index}
                item={item}
                onPres={() => navigation.navigate('transaction_history_view', item)}
                // onPres={() => null}
            />
        )
    };

    const filterOnChange = (values) => {
        updateFilterPayload(values);
        setPage(1);
    };

    const sync = () => {
        if(reduxState?.card?.walletID){
            let payload = {
                walletID: reduxState?.card?.walletID,
                force: true
            };
            dispatch(syncTransaction(payload, syncTransactionCallBack))
        }
    };

    const syncTransactionCallBack = () => {
        get(page, filterPayload)
    };

    return (
        <Container headerProps={headerProps}>

            <DateFilter
                initialValue={data?.selected}
                notInclude={['CUSTOM']}
                onChange={(values) => filterOnChange(values)} />

            <CList
                loading={reduxState.loading}
                contentContainerStyle={[GlobalStyle.list, Styles.list]}
                data={reduxState.data}
                renderItem={renderTransactionItems}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-transactions.png'),
                    text: t('EMPTY_SECTION.TRANSACTION_HISTORY')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />
            <View style={GlobalStyle.listFooterButton}>
                <CButton title={'Sync Transactions'}
                         disabled={reduxState.loading || reduxState.syncLoading}
                         loading={reduxState.syncLoading}
                         onPress={() => sync()}/>
            </View>
        </Container>
    )
}
export default TransactionHistory;
