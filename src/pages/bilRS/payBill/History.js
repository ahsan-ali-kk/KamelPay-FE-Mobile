import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {Container} from "../../../containers";
import {CList, Receipt, CText, ProgressiveImage, DateFilter, CButton} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {formatAmount, foundProduct, SERVICES, setHours, status} from "../../../utils/methods";
import {getTransactionHistory, getSingleTransactionHistory} from "../../../store/actions/PayBill.action";
import moment from "moment";
import Styles from "../../remittance/history/History.style";
import {useTranslation} from "react-i18next";
import Popup from "../../../uiComponents/popup/Popup";
import {generateTaxInvoice} from "../../../store/actions/Global.action";

function History(props) {
    const { t } = useTranslation();

    const {navigation} = props;
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.PAY_BILL_HISTORY'),
        headerRight: true,
    };

    const [ticketPayload, updateTicketPayload] = useState({});

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(null);

    const reduxState = useSelector(({auth, global, payBill}) => {
        return {
            user: auth.user,
            loading: payBill.getTransactionHistoryLoading || payBill.getSingleTransactionHistoryLoading || global?.generateTaxInvoiceLoading,
            data: payBill.transactionHistory,
            isLoadMore: payBill.transactionHistoryIsLoadMore,
            isLoadMoreLoading: payBill.transactionHistoryIsLoadMoreLoading,
            metaData: payBill.transactionHistoryMetaData,
            card: global.selectedCard,
        }
    });

    const get = (val = 1, filter = null) => {
        let payload = {
            page: val,
            limit: limit,
            cardId: reduxState?.card?._id,
            transactionType: "BILL_PAYMENT",
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
        let payload = {...item};
        payload.Currency = 'AED';
        payload.foreignCurrency = item.Currency;
        if(item?.meta?.embeddedFinance){
            payload.amountInAED = item?.meta?.embeddedFinance?.totalAmount;
        } else {
            payload.amountInAED = item?.meta?.totalAmount;
        }
        payload.message = payload?.meta?.message || t(status[item?.status]?.message);
        payload.icon = status[item?.status]?.iconName;
        if(item?.transactionCode && item?.transactionId){
            payload.referenceNo = `${item?.transactionCode}${item?.transactionId}`;
        }
        updateTicketPayload(payload)
    };

    const singleTransactionHistoryView = (item) => {
        if(item._id && reduxState?.card?._id){
            let payload = {
                id: item._id,
                cardId: reduxState?.card?._id,
            };
            dispatch(getSingleTransactionHistory(payload, (res) => {
                view(res)
            }))
        }
    };

    const generateTaxInvoiceCallback = (item) => {
        Popup.show({
            isVisible: true,
            showClose: false,
            type: 'Success',
            title: t(item?.title),
            text: `${t(item?.messagePartOne)} ${t(item?.messagePartTow)}.`,
            actions: [
                // {
                //     text: t('GLOBAL.VIEW'),
                //     callback: async () => {
                //         Popup.hide();
                //         await viewGeneratedTaxInvoice(item?.filePath)
                //     }
                // },
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
            type: item?.meta?.embeddedFinance ? SERVICES.EMBEDDED_FINANCE._id : SERVICES.BILL_PAYMENT._id
        };
        dispatch(generateTaxInvoice(payload, generateTaxInvoiceCallback))
    };

    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity key={index} style={[Styles.listItem]} onPress={() => singleTransactionHistoryView(item)}>
               <View style={[Styles.listItemContain, Styles.rowListItem]}>
                   <View style={Styles.listItemCardVectorContainer}>
                       <ProgressiveImage
                           style={Styles.listItemCardVector}
                           source={foundProduct(reduxState?.card?.companyProductCode).cardVector}/>
                   </View>
                   <View style={[Styles.listItemContain]}>
                       <View style={Styles.listItemLeft}>
                           <CText style={Styles.listItemTitle} numberOfLines={1}>
                               {item?.meta?.biller?.BillerName}
                           </CText>
                           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                               {item?.meta?.embeddedFinance ? <View style={[Styles.listItemTag, {marginBottom: 0, marginRight: 15}]}>
                                   <CText style={[Styles.listItemTagText]}>
                                       {t('CREDIT_PAY.CREDIT_PAY')}
                                   </CText>
                               </View> : null }
                               <CText style={[Styles.listItemAmount, {marginTop: 5, marginBottom: 0}]}>
                                   {item?.meta?.embeddedFinance ? formatAmount(item?.meta?.embeddedFinance?.totalAmount) : item?.meta?.totalAmount} AED
                               </CText>
                           </View>
                       </View>
                       <View style={Styles.listItemRight}>
                           <View style={[Styles.listItemTag, status[item?.status] && {backgroundColor: status[item?.status].bgColor}]}>
                               <CText style={[Styles.listItemTagText, status[item?.status] && {color: status[item?.status].color}]}>
                                   {status[item?.status]  ? t(status[item?.status].title) : ''}
                               </CText>
                           </View>
                           <CText style={Styles.listItemDate}>
                               {moment(item?.time).format('DD MMM YYYY')}
                           </CText>
                       </View>
                   </View>
               </View>
                {item?.status === 'SUCCESS' ? <CButton
                    buttonStyle={{marginTop: 15}}
                    buttonText={{textDecorationLine: 'underline'}}
                    type="outline"
                    onPress={() => generateTaxInvoiceFun(item)}
                    title={t('GLOBAL.GENERATE_TAX_INVOICE')}/> : null }
            </TouchableOpacity>
        )
    };

    const generateReceiverDetail = (data) => {
        let info = [];

        let obj = {
            ...(data?.meta?.biller?.BillerName && {
                BillerName: data?.meta?.biller?.BillerName,
            }),
            ...(data?.meta?.biller?.BillerType && {
                type: data?.meta?.biller?.BillerType,
            }),
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
            ...(data?.beneficiary?.Alias && {
                Alias: data?.beneficiary?.Alias,
            }),
            referenceNo: data?.referenceNo
        };

        if(obj?.Alias) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NAME'),
                value: obj?.Alias
            })
        }

        if(obj?.BillerName) {
            info.push({
                Name: t('RECEIPT.BILLER_NAME'),
                value: obj?.BillerName
            })
        }


        if(obj?.type) {
            info.push({
                Name: t('RECEIPT.BILLER_TYPE'),
                value: obj?.type
            });
        }

        if(data?.inputs?.length){
            info = [
                ...info,
                ...data?.inputs
            ];
        }

        if(obj?.Card) {
            info.push({
                Name: t('RECEIPT.CARD'),
                value: obj?.Card
            })
        }

        if(obj?.referenceNo) {
            info.push({
                Name: t('RECEIPT.REFERENCE'),
                value: obj?.referenceNo
            })
        }

        return info
    };
    const generateTransferAmountAndCharges = (data) => {
        let info = [];

        let obj = {
            ...(data && data?.meta),
            createdAt: data?.createdAt,
            amount: data?.amount
        };

        if(obj?.amount) {
            info.push({
                Name: t('RECEIPT.BILL_AMOUNT'),
                value: formatAmount(obj?.amount, data.Currency),
                separate: true
            })
        }
        if(obj?.totalFee) {
            info.push({
                Name: t('RECEIPT.PLATFORM_FEE'),
                value: formatAmount(obj?.totalFee, data.Currency)
            })
        }

        if(obj?.totalVat) {
            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.totalVat, data.Currency)
            })
        }

        if(obj?.embeddedFinance) {
            info.push({
                Name: t("RECEIPT.PLATFORM_FEE"),
                value: formatAmount(obj?.embeddedFinance?.totalFee, 'AED')
            });

            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.embeddedFinance?.totalVat, 'AED')
            });
        }

        if(obj?.promoDetails?.promo) {
            info.push({
                Name: t('RECEIPT.PROMO_CODE'),
                value: obj?.promoDetails?.promo
            })
        }

        if(obj?.mode && obj?.discountAmount) {
            info.push({
                Name: t(`RECEIPT.${obj?.mode}`),
                value: `${obj?.mode === 'DISCOUNT' ? '-' : ''} ${formatAmount(obj?.discountAmount)} AED` || 0
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
    const generateSendToInfo = (data) => {
        return [
            ...generateReceiverDetail(data),
            ...generateTransferAmountAndCharges(data),
        ]
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
                    icon: require('../../../assets/images/empty-bills.png'),
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
                infoUpperTitle=""
                isCreditPay={!!(ticketPayload?.meta?.embeddedFinance)}
                senTo={generateSendToInfo(ticketPayload)}
                isHistory={true}
            />

        </Container>
    )
}

export default React.memo(History)
