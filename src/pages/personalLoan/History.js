import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {Container} from "../../containers";
import {CList, Receipt, CText, DateFilter, CButton} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {formatAmount, SERVICES, setHours, status} from "../../utils/methods";
import moment from "moment";
import Styles from "../remittance/history/History.style";
import {useTranslation} from "react-i18next";
import {getTransactionHistory, getSingleTransactionHistory} from "../../store/actions/PersonalLoan.action";
import Popup from "../../uiComponents/popup/Popup";
import {generateTaxInvoice} from "../../store/actions/Global.action";
import {renderInstallmentCount} from "./helper";
import {useNavigation} from "@react-navigation/native";

function History(props) {
    const { t } = useTranslation();

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.PERSONAL_LOAN'),
        headerRight: true,
    };

    const [ticketPayload, updateTicketPayload] = useState({});

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterPayload, updateFilterPayload] = useState(null);

    const reduxState = useSelector(({auth, global, personalLoan}) => {
        return {
            user: auth.user,
            loading: personalLoan.getPersonalLoanTransactionHistoryLoading || personalLoan.getSinglePersonalLoanTransactionHistoryLoading || global?.generateTaxInvoiceLoading,
            data: personalLoan.personalLoanTransactionHistory,
            isLoadMore: personalLoan.personalLoanTransactionHistoryIsLoadMore,
            isLoadMoreLoading: personalLoan.personalLoanTransactionHistoryIsLoadMoreLoading,
            metaData: personalLoan.personalLoanTransactionHistoryMetaData,
            card: global.selectedCard,
        }
    });

    const get = (val = 1, filter = null) => {
        let payload = {
            page: val,
            limit: limit,
            cardId: reduxState?.card?._id,
            type: SERVICES.PERSONAL_LOAN._id,
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
        navigation.navigate('personal_loan_history_view',{ id: item._id });
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
            type: SERVICES.PERSONAL_LOAN._id
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

        info.push({
            Name: t('VALIDATION.LIABILITIES.LABEL'),
            value: formatAmount(data?.liability || 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.EDUCATION_EXPENSE.LABEL'),
            value: formatAmount(data?.educationExpense || 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.HEALTH_CARE_EXPENSE.LABEL'),
            value: formatAmount(data?.healthcareExpense || 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.MAINTENANCE_SUPPORT.LABEL'),
            value: formatAmount(data?.maintenanceSupport || 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.HOUSING_RENT.LABEL'),
            value: formatAmount(data?.housingRent || 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.FOOD_EXPENSE.LABEL'),
            value: formatAmount(data?.foodExpense || 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.UTILITY_COST.LABEL'),
            value: formatAmount(data?.utilityCost || 0, 'AED'),
        });

        return info
    };
    const generateTransferAmountAndCharges = (data) => {
        let info = [];

        let obj = {
            ...(data && data?.meta),
            createdAt: data?.createdAt,
            amount: data?.amount,
            feeBracket: data?.feeBracket,
        };

        let receiverCurrency = "AED";

        let totalFee = Number(obj?.feeBracket?.processingFees || 0);
        let totalVat = Number(obj?.feeBracket?.processingFeesVat || 0);

        let totalPlatformFees = Number(obj?.feeBracket?.platformFee || 0);
        let totalPlatformFeeVat = Number(obj?.feeBracket?.platformFeeVat || 0);
        let totalPlatformFeesAndVat = totalPlatformFees + totalPlatformFeeVat;

        let totalFeeMonthly = Number(obj?.feeBracket?.processingFeesMonthly || 0);

        let financeAmount = Number(obj?.amount);
        let noOfInstallment = obj?.feeBracket?.noOfInstallment;

        let monthlyPayment = Number(financeAmount/noOfInstallment);
        let monthlyProfit = Number(totalFeeMonthly/noOfInstallment);
        let totalMonthlyPayment = Number(monthlyPayment+monthlyProfit);

        let totalPaymentDueOnSalaryDate = Number(financeAmount);

        let profit = Number(totalFeeMonthly);
        let totalPaymentDueToday = profit;

        if(obj?.feeBracket?.noOfInstallment == 1){
            totalPaymentDueOnSalaryDate += totalPaymentDueToday;
            totalPaymentDueToday = totalFee + totalVat;
        }

        if(obj?.feeBracket?.noOfInstallment) {
            info.push({
                Name: 'Tenure',
                value: renderInstallmentCount(obj?.feeBracket?.noOfInstallment),
                separate: true
            });
        }

        if(obj?.amount) {
            info.push({
                Name: t('PERSONAL_LOAN.PERSONAL_LOAN_AMOUNT'),
                value: formatAmount(obj?.amount, data.Currency),

            })
        }

        if(obj?.feeBracket?.noOfInstallment == 1){
            info.push({
                Name: "Profit",
                value: formatAmount(profit, receiverCurrency)
            });
        }

        if(totalFee){
            info.push({
                Name: "Processing Fees + VAT",
                value: formatAmount(totalFee + totalVat, receiverCurrency)
            });
        }

        if(obj?.feeBracket?.noOfInstallment != 1) {
            info.push({
                isBold: true,
                Name: 'Total Monthly Payment On Salary Date',
                value: formatAmount(totalMonthlyPayment || 0, receiverCurrency, 2, true)
            });
        }

        if(obj?.feeBracket?.noOfInstallment == 1) {
            info.push({
                isBold: true,
                Name: 'Total Payment Due On Salary Date',
                value: formatAmount(totalPaymentDueOnSalaryDate || 0, receiverCurrency)
            });
            if(totalPaymentDueToday){
                info.push({
                    isBold: true,
                    Name: 'Total Payment Due Today',
                    value: formatAmount(totalPaymentDueToday || 0, receiverCurrency)
                });
            }
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
                amountTitle={t("PERSONAL_LOAN.PERSONAL_LOAN_AMOUNT")}
                infoUpperTitle={""}
                infoTitle={t("RECEIPT.PERSONAL_LOAN_AND_CHARGES")}
                senTo={generateSendToInfo(ticketPayload)}
                isHistory={true}
            />

        </Container>
    )
}

export default React.memo(History)
