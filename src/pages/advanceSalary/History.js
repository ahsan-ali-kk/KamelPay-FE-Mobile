import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {Container} from "../../containers";
import {CList, Receipt, CText, DateFilter, CButton} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {formatAmount, SERVICES, setHours, status} from "../../utils/methods";
import moment from "moment";
import Styles from "../remittance/history/History.style";
import {useTranslation} from "react-i18next";
import {getTransactionHistory, getSingleTransactionHistory} from "../../store/actions/AdvanceSalary.action";
import Popup from "../../uiComponents/popup/Popup";
import {generateTaxInvoice} from "../../store/actions/Global.action";

function History(props) {
    const { t } = useTranslation();

    const {navigation} = props;
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.ADVANCE_SALARY_HISTORY'),
        headerRight: true,
    };

    const [ticketPayload, updateTicketPayload] = useState({});

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(null);

    const reduxState = useSelector(({auth, global, advanceSalary}) => {
        return {
            user: auth.user,
            loading: advanceSalary.getAdvanceSalaryTransactionHistoryLoading || advanceSalary.getSingleAdvanceSalaryTransactionHistoryLoading || global?.generateTaxInvoiceLoading,
            data: advanceSalary.advanceSalaryTransactionHistory,
            isLoadMore: advanceSalary.advanceSalaryTransactionHistoryIsLoadMore,
            isLoadMoreLoading: advanceSalary.advanceSalaryTransactionHistoryIsLoadMoreLoading,
            metaData: advanceSalary.advanceSalaryTransactionHistoryMetaData,
            card: global.selectedCard,
        }
    });

    const get = (val = 1, filter = null) => {
        let payload = {
            page: val,
            limit: limit,
            cardId: reduxState?.card?._id,
            type: SERVICES.ADVANCE_SALARY._id,
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
        // payload.foreignCurrency = item.Currency;
        payload.amountInAED = item?.amount;
        payload.message = payload?.meta?.message || t(status[item?.status]?.message);
        payload.icon = status[item?.status]?.iconName;
        updateTicketPayload(payload)
    };

    const singleTransactionHistoryView = (item) => {
        if(item._id){
            let payload = {
                id: item._id,
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
            type: SERVICES.ADVANCE_SALARY._id
        };
        dispatch(generateTaxInvoice(payload, generateTaxInvoiceCallback))
    };

    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity key={index} style={[Styles.listItem]} onPress={() => singleTransactionHistoryView(item)}>
                <View style={[Styles.listItemContain, Styles.rowListItem]}>
                   <View style={Styles.listItemLeft}>
                       <CText style={Styles.listItemTitle} numberOfLines={2}>
                           {t('RECEIPT.REFERENCE')} {item?.referenceNo}
                       </CText>
                       <CText style={[Styles.listItemAmount, {marginTop: 5, marginBottom: 0}]}>
                           {item?.amount} AED
                       </CText>
                   </View>
                   <View style={Styles.listItemRight}>
                       <View style={[Styles.listItemTag, status[item?.status] && {backgroundColor: status[item?.status].bgColor}]}>
                           <CText style={[Styles.listItemTagText, status[item?.status] && {color: status[item?.status].color}]}>
                               {status[item?.status]  ? t(status[item?.status].title) : ''}
                           </CText>
                       </View>
                       <CText style={Styles.listItemDate}>
                           {moment(item?.createdAt).format('DD MMM YYYY')}
                       </CText>
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
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
            referenceNo: data?.referenceNo
        };

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
        if(data?.rejectionReason) {
            info.push({
                Name: t('RECEIPT.REJECTION_REASON'),
                value: data?.rejectionReason
            })
        }

        return info
    };
    const generateTransferAmountAndCharges = (data) => {
        let info = [];

        let obj = {
            ...(data && data?.meta),
            createdAt: data?.createdAt,
            amount: data?.amount,
            feeBracket: data?.feeBracket
        };

        if(obj?.amount) {
            info.push({
                Name: t('ADVANCE_SALARY.ADVANCE_AMOUNT'),
                value: formatAmount(obj?.amount, data.Currency),
                separate: true
            })
        }

        let platformFee = obj?.feeBracket?.platformFee || 0;
        let platformFeeVat = obj?.feeBracket?.platformFeeVat || 0;
        let fees = obj?.feeBracket?.fees || 0;
        let vatAmount = obj?.feeBracket?.vatAmount || 0;

        if(platformFee) {
            info.push({
                Name: t('RECEIPT.PLATFORM_FEE'),
                value: formatAmount(platformFee - platformFeeVat, 'AED')
            });
        }

        if(fees) {
            info.push({
                Name: t('RECEIPT.PROCESSING_FEES'),
                value: formatAmount(fees - vatAmount, 'AED')
            });
        }

        if(vatAmount){
            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(vatAmount + platformFeeVat, 'AED')
            });
        }

        if(data?.promoDetails?.promo) {
            info.push({
                Name: t('RECEIPT.PROMO_CODE'),
                value: data?.promoDetails?.promo
            })
        }

        if(data?.mode && data?.discountAmount) {
            info.push({
                Name: t(`RECEIPT.${data?.mode}`),
                value: `${data?.mode === 'DISCOUNT' ? '-' : ''} ${formatAmount(data?.discountAmount)} AED` || 0
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

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={() => onClose()}
                data={ticketPayload}
                amountTitle={t("ADVANCE_SALARY.ADVANCE_AMOUNT")}
                infoUpperTitle={""}
                infoTitle={t("RECEIPT.ADVANCE_SALARY_AND_CHARGES")}
                senTo={generateSendToInfo(ticketPayload)}
                isHistory={true}
            />

        </Container>
    )
}

export default React.memo(History)
