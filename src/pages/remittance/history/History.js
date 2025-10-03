import React, {useEffect, useState} from "react";
import {View, TouchableOpacity, Platform, Linking} from "react-native";
import {Container} from "../../../containers";
import {CList, Receipt, CButton, CText, DateFilter} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {formatAmount, numberWithToFix, SERVICES, setHours, status} from "../../../utils/methods";
import {cancelTransaction, getTransactionHistory, getSingleTransactionHistory} from "../../../store/actions/Remittance.action";
import moment from "moment";
import Styles from "./History.style";
import Popup from "../../../uiComponents/popup/Popup";
import KamelPayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";
import {whatsAppNumber} from "../../../utils/intercepter";
import {generateTaxInvoice} from "../../../store/actions/Global.action";

function History(props) {
    const { t } = useTranslation();

    const {navigation} = props;
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.SEND_MONEY_HISTORY'),
        headerRight: true,
    };

    const [ticketPayload, updateTicketPayload] = useState({});

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(null);

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            user: auth.user,
            loading: remittance.getTransactionHistoryLoading || remittance.cancelTransaction || remittance.getSingleTransactionHistoryLoading || global?.generateTaxInvoiceLoading,
            data: remittance.transactionHistory,
            isLoadMore: remittance.transactionHistoryIsLoadMore,
            isLoadMoreLoading: remittance.transactionHistoryIsLoadMoreLoading,
            metaData: remittance.transactionHistoryMetaData,
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
        let payload = {...item};
        payload.Currency = 'AED';
        payload.foreignCurrency = item.Currency;
        payload.amountInAED = item?.totalAmount;
        payload.Amount = item?.amount;
        payload.message = t(status[item?.status].message);
        payload.icon = status[item?.status];
        if(item?.transactionCode && item?.transactionId){
            payload.referenceNo = `${item?.transactionCode}${item?.transactionId}`;
        }
        updateTicketPayload(payload)
    };

    const callBack = () => {
        onRefreshHandler()
    };

    // export const cancelTransactionHelloPaisa = (t) => {
    //
    // };

    const cancel = (item) => {
        // let payload = {
        //     transactionId: item?._id
        // };
        // dispatch(cancelTransaction(payload, callBack))
        let number = whatsAppNumber;
        let text = `Hello I am NaqaD ${Platform.OS} app user I want to cancel my transaction.\n${t('RECEIPT.PAYMENT_REF_ID')} / Control Pin : ${item?.payoutPartnerRef}`;
        let url = `whatsapp://send?text=${text}&phone=${number}`;
        Linking.openURL(url)
            .then(data => {
                console.log("WhatsApp Opened successfully " + data);
            })
            .catch(() => {
                alert(t("GLOBAL.WHATS_APP_ALERT"));
            });

    };

    const cancelConfirmation = (item) => {

        // Popup.show({
        //     isVisible: true,
        //     type: 'Warning',
        //     title: t('POPUPS.CANCEL_TRANSACTION.TITLE'),
        //     text: t('POPUPS.CANCEL_TRANSACTION.SUB_TITLE'),
        //     actions: [
        //         {
        //             text: t('GLOBAL.CANCEL'),
        //             callback: () => Popup.hide()
        //         },
        //         {
        //             text: t('GLOBAL.YES'),
        //             callback: () => {
        //                 Popup.hide();
        //                 cancel(item)
        //             }
        //         },
        //     ]
        // })
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
            type: SERVICES.REMITTANCE._id,
        };
        dispatch(generateTaxInvoice(payload, generateTaxInvoiceCallback))
    };


    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity key={index}
                              style={Styles.listItem}
                              onPress={() => singleTransactionHistoryView(item)}>
               <View style={Styles.listItemContain}>
                   <View style={Styles.listItemLeft}>
                       <CText style={Styles.listItemTitle} numberOfLines={1}>
                           {item?.BeneficiaryFirstName} {item?.BeneficiaryLastName}
                       </CText>
                       <CText style={Styles.listItemAmount}>
                           {numberWithToFix(item?.totalAmount)} AED
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
                           <CText style={Styles.countryViewText}>{item?.CCA3}</CText>
                       </View>
                   </View>
               </View>

                {item?.status === 'SUCCESS' ?  <CButton
                        buttonStyle={{marginTop: 15, marginBottom: 8}}
                        buttonText={{textDecorationLine: 'underline'}}
                        type="outline"
                        onPress={() => generateTaxInvoiceFun(item)}
                        title={t('GLOBAL.GENERATE_TAX_INVOICE')}/> : null}

                {!item?.isRequestedCancel && item?.status === 'IN_PROGRESS' ?
                    <CButton
                    buttonStyle={{marginTop: 15, marginBottom: 8}}
                    type="outline"
                    onPress={() => cancel(item)}
                    title={t('FIELDS_LABELS.CANCEL_TRANSACTION')}/>
                    : null}
            </TouchableOpacity>
        )
    };

    const generateSendToInfo = (obj) => {

        let info = [];

        if(obj?.BeneficiaryFirstName) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NAME'),
                value: `${obj?.BeneficiaryFirstName} ${obj?.BeneficiaryLastName}`
            })
        }

        if(obj?.BankType !== "BankAccount" && obj?.BeneficiaryMSISDN) {
            info.push({
                Name: t('RECEIPT.RECEIVER_NUMBER'),
                value: '+' + obj?.BeneficiaryMSISDN
            })
        }

        if(obj?.BankName) {
            info.push({
                Name: t('RECEIPT.BANK_NAME'),
                value: obj?.BankName
            })
        }

        if(obj?.BranchName) {
            info.push({
                Name: t('RECEIPT.BRANCH_NAME'),
                value: obj?.BranchName
            })
        }

        if(obj?.BankTypeName) {
            info.push({
                Name: t('RECEIPT.TYPE_TRANSFER'),
                value: obj?.BankTypeName
            })
        }

        if(obj?.BankType === "BankAccount" && obj?.AccountTitle) {
            info.push({
                Name: t('RECEIPT.RECEIVER_ACCOUNT_TITLE'),
                value: obj?.AccountTitle
            })
        }

        if(obj?.BankType === "BankAccount" && obj?.BeneficiaryAccountNo) {
            info.push({
                Name: t('RECEIPT.RECEIVER_ACCOUNT_NUMBER'),
                value: obj?.BeneficiaryAccountNo
            })
        }
        if(obj?.RemitPurpose) {
            info.push({
                Name: t('RECEIPT.REMITTANCE_PURPOSE'),
                value: obj?.RemitPurpose
            })
        }

        if(obj?.referenceNo) {
            info.push({
                Name: t('RECEIPT.REFERENCE'),
                value: obj?.referenceNo
            })
        }

        if(obj?.amountInForeignCurrency) {
            info.push({
                Name: t('RECEIPT.TRANSFER_AMOUNT'),
                value: `${formatAmount(obj?.amountInForeignCurrency, obj?.foreignCurrency || '')}`,
                separate: true
            })
        }

        if(obj?.totalFee) {
            info.push({
                Name: t('RECEIPT.CHARGES'),
                value: `${formatAmount(obj?.totalFee)} ${obj?.Currency}`
            })
        }

        if(obj?.totalVat) {
            info.push({
                Name: t('RECEIPT.VAT'),
                value: `${formatAmount(obj?.totalVat)} ${obj?.Currency}`
            })
        }

        if(obj?.countryFee && Number(obj?.countryFee)) {
            info.push({
                Name: t('RECEIPT.RECEIVER_CHARGES'),
                value: `${formatAmount(obj?.countryFee)} ${obj?.foreignCurrency}`
            })
        }

        if(obj?.promoDetails?.promo) {
            info.push({
                Name: t('RECEIPT.PROMO_CODE'),
                value: obj?.promoDetails?.promo
            })
        }

        if(obj?.mode) {
            info.push({
                Name: t(`RECEIPT.${obj?.mode}`),
                value: `${obj?.mode === 'DISCOUNT' ? '-' : ''} ${formatAmount(obj?.discountAmount)} ${obj?.Currency}` || 0
            })
        }

        if(obj?.tat) {
            info.push({
                Name: t('RECEIPT.TAT'),
                value: obj?.tat
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
