import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {Container} from "../../../containers";
import {CList, Receipt, CText, DateFilter} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {formatAmount, maskMiddle, numberWithToFix, setHours, status} from "../../../utils/methods";
import {getKpWalletTransferHistory, getSingleKpWalletTransferHistory} from "../../../store/actions/KPWalletTransfer.action";
import moment from "moment";
import Styles from "./History.style";
import KamelPayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";

function History(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.KP_WALLET_TRANSFER'),
        headerRight: true,
    };

    const [ticketPayload, updateTicketPayload] = useState({});
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(null);

    const reduxState = useSelector(({auth, global, kpWalletTransfer}) => {
        return {
            user: auth.user,
            loading: kpWalletTransfer.getTransactionHistoryLoading || kpWalletTransfer.getSingleTransactionHistoryLoading || global?.generateTaxInvoiceLoading,
            data: kpWalletTransfer.transactionHistory,
            isLoadMore: kpWalletTransfer.transactionHistoryIsLoadMore,
            isLoadMoreLoading: kpWalletTransfer.transactionHistoryIsLoadMoreLoading,
            metaData: kpWalletTransfer.transactionHistoryMetaData,
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
        dispatch(getKpWalletTransferHistory(payload));
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
        payload.Currency = 'AED';
        payload.amountInAED = item?.meta?.totalAmount;
        payload.Amount = item?.amount;
        payload.message = t(status[item?.status].message);
        payload.icon = status[item?.status];
        if(item?.referenceNo){
                payload.referenceNo = `${item?.referenceNo}`;
        }
        updateTicketPayload(payload)
    };

    const singleTransactionHistoryView = (item) => {
        if(item._id && reduxState?.card?._id){
            let payload = {
                id: item._id,
                cardId: reduxState?.card?._id,
            };
            dispatch(getSingleKpWalletTransferHistory(payload, (res) => {
                view(res)
            }))
        }
    };

    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity key={index}
                              style={Styles.listItem}
                              onPress={() => singleTransactionHistoryView(item)}>
               <View style={Styles.listItemContain}>
                   <View style={Styles.listItemLeft}>
                       <CText style={Styles.listItemTitle} numberOfLines={1}>
                           {item?.meta?.beneficiaryAlias}
                       </CText>
                       <CText style={Styles.listItemAmount}>
                           {numberWithToFix(item?.meta?.totalAmount)} AED
                       </CText>
                       <CText style={Styles.listItemDate}>
                           {moment(item?.createdAt).format('DD MMM YYYY, hh:mm a')}
                       </CText>
                   </View>
                   <View style={Styles.listItemRight}>
                       <View style={[Styles.listItemTag, status[item?.status] && {backgroundColor: status[item?.status].bgColor}]}>
                           <CText style={[Styles.listItemTagText, status[item?.status] && {color: status[item?.status].color}]}>
                               {status[item?.status]  ? t(status[item?.status].title) : ''}
                           </CText>
                       </View>
                       <View style={Styles.countryView}>
                           <CText style={Styles.countryViewText}>UAE</CText>
                           <KamelPayIcon name="long-arrow-right" style={Styles.countryViewIcon}/>
                           <CText style={Styles.countryViewText}>{"UAE"}</CText>
                       </View>
                   </View>
               </View>
            </TouchableOpacity>
        )
    };

    const generateSendToInfo = (obj) => {

        let info = [];

        let receiverCurrency = "AED";
        let amountInForeignCurrencyReceivable = obj?.amount;
        let totalFee = obj?.meta?.feesAmount;

        if(obj?.meta?.beneficiaryAccountNo) {
            info.push({
                Name: t('RECEIPT.TRANSFER_ID'),
                value: obj?.meta?.beneficiaryAccountNo
            })
        }

        if(obj?.meta?.beneficiaryAlias) {
            info.push({
                Name: t('RECEIPT.RECEIVER_ACCOUNT_TITLE'),
                value: obj?.meta?.beneficiaryAlias
            })
        }

        if(obj?.meta?.recieverPhone) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NUMBER'),
                value: '+' + maskMiddle(obj?.meta?.recieverPhone)
            })
        }

        if(obj?.referenceNo) {
            info.push({
                Name: t('RECEIPT.REFERENCE'),
                value: obj?.referenceNo
            })
        }


        if(amountInForeignCurrencyReceivable) {
            info.push({
                Name: t('RECEIPT.TRANSFER_AMOUNT'),
                value: `${formatAmount(amountInForeignCurrencyReceivable, receiverCurrency)}`,
                separate: true
            })
        }

        if(totalFee) {
            info.push({
                Name: t('RECEIPT.CHARGES'),
                value: `${formatAmount(totalFee, 'AED')}`
            })
        }

        if(obj?.createdAt) {
            info.push({
                Name: t('GLOBAL.DATE'),
                value: moment(obj?.createdAt).format('DD MMM yyyy'),
            });
            info.push({
                Name: t('GLOBAL.TIME'),
                value: moment(obj?.createdAt).format('hh:mm a'),
            });
        }

        return info
    };

    const onClose = () => {
        updateTicketPayload({})
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

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={() => onClose()}
                data={ticketPayload}
                infoTitle={t('RECEIPT.TRANSACTION_DETAILS')}
                infoUpperTitle=""
                refId={ticketPayload?.payoutPartnerRef || ''}
                senTo={generateSendToInfo(ticketPayload)}
                isHistory={true}
            />

        </Container>
    )
}

export default React.memo(History)
