import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {Container} from "../../../containers";
import {CButton, CText, ProgressiveImage} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {formatAmount, MappedElement, SERVICES, status} from "../../../utils/methods";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {getSingleTransactionHistory} from "../../../store/actions/PersonalLoan.action";
import Popup from "../../../uiComponents/popup/Popup";
import {generateTaxInvoice} from "../../../store/actions/Global.action";
import {renderInstallmentCount} from "../helper";
import ReceiptStyle from "../../../uiComponents/receipt/Receipt.style";
import Styles from "../PersonalLoan.style";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import RepaymentSchedule from "../RepaymentSchedule";
import Documents from "./Documents";

function HistoryDetail(props) {

    const {t} = useTranslation();
    const {route: {params: data}} = props;

    const dispatch = useDispatch();
    const DocumentsRef = useRef();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.PERSONAL_LOAN'),
        headerRight: true,
    };

    const [ticketPayload, updateTicketPayload] = useState({});

    const reduxState = useSelector(({auth, global, personalLoan}) => {
        return {
            user: auth.user,
            loading: personalLoan.getSinglePersonalLoanTransactionHistoryLoading || global?.generateTaxInvoiceLoading,
            card: global.selectedCard,
        }
    });

    const {loading} = reduxState;

    const get = (id) => {
        if (id) {
            let payload = {id};
            dispatch(getSingleTransactionHistory(payload, (res) => {
                view(res)
            }))
        }
    };

    useEffect(() => {
        if (data?.id) {
            get(data?.id)
        }
    }, [data])

    const view = (item) => {
        let payload = {...item};
        payload.Currency = 'AED';
        // payload.foreignCurrency = item.Currency;
        payload.amountInAED = item?.amount;
        payload.message = payload?.meta?.message || t(status[item?.status]?.message);
        payload.icon = status[item?.status]?.iconName;
        updateTicketPayload(payload)
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


    const generateReceiverDetail = (data) => {
        let info = [];

        let obj = {
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
            referenceNo: data?.referenceNo
        };

        if (obj?.Card) {
            info.push({
                Name: t('RECEIPT.CARD'),
                value: obj?.Card
            })
        }
        if (obj?.referenceNo) {
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

        let monthlyPayment = Number(financeAmount / noOfInstallment);
        let monthlyProfit = Number(totalFeeMonthly / noOfInstallment);
        let totalMonthlyPayment = Number(monthlyPayment + monthlyProfit);

        let totalPaymentDueOnSalaryDate = Number(financeAmount);

        let profit = Number(totalFeeMonthly);
        let totalPaymentDueToday = profit;

        if (obj?.feeBracket?.noOfInstallment == 1) {
            totalPaymentDueOnSalaryDate += totalPaymentDueToday;
            totalPaymentDueToday = totalFee + totalVat;
        }

        if (obj?.feeBracket?.noOfInstallment) {
            info.push({
                Name: 'Tenure',
                value: renderInstallmentCount(obj?.feeBracket?.noOfInstallment),
                separate: true
            });
        }

        if (obj?.amount) {
            info.push({
                Name: t('PERSONAL_LOAN.PERSONAL_LOAN_AMOUNT'),
                value: formatAmount(obj?.amount, data.Currency),

            })
        }

        if (obj?.feeBracket?.noOfInstallment == 1) {
            info.push({
                Name: "Profit",
                value: formatAmount(profit, receiverCurrency)
            });
        }

        if (totalFee) {
            info.push({
                Name: "Processing Fees + VAT",
                value: formatAmount(totalFee + totalVat, receiverCurrency)
            });
        }

        if (obj?.feeBracket?.noOfInstallment != 1) {
            // info.push({
            //     Name: 'Monthly Payment On Salary Date',
            //     value: formatAmount(monthlyPayment || 0, receiverCurrency)
            // });
            // info.push({
            //     Name: 'Monthly Profit Payment',
            //     value: formatAmount(monthlyProfit || 0, receiverCurrency)
            // });
            info.push({
                isBold: true,
                Name: 'Total Monthly Payment On Salary Date',
                value: formatAmount(totalMonthlyPayment || 0, receiverCurrency, 2, true)
            });
        }

        if (obj?.feeBracket?.noOfInstallment == 1) {
            info.push({
                isBold: true,
                Name: 'Total Payment Due On Salary Date',
                value: formatAmount(totalPaymentDueOnSalaryDate || 0, receiverCurrency)
            });
            if (totalPaymentDueToday) {
                info.push({
                    isBold: true,
                    Name: 'Total Payment Due Today',
                    value: formatAmount(totalPaymentDueToday || 0, receiverCurrency)
                });
            }
        }

        if (data?.promoDetails?.promo) {
            info.push({
                Name: t('RECEIPT.PROMO_CODE'),
                value: data?.promoDetails?.promo
            })
        }

        if (data?.mode && data?.discountAmount) {
            info.push({
                Name: t(`RECEIPT.${data?.mode}`),
                value: `${data?.mode === 'DISCOUNT' ? '-' : ''} ${formatAmount(data?.discountAmount)} AED` || 0
            })
        }

        if (obj?.createdAt) {
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

    const renderItem = (obj, i) => {
        return (
            <View key={i} style={[ReceiptStyle.listItem, obj?.isTitle && ReceiptStyle.listItem2]}>
                <CText style={[ReceiptStyle.listItemText, obj?.isTitle && ReceiptStyle.listItemText2]}>
                    {obj.Name}
                </CText>
                <CText
                    style={[ReceiptStyle.listItemText, obj?.isTitle ? ReceiptStyle.listItemLastText2 : ReceiptStyle.listItemLastText]}>
                    {obj.value}
                </CText>
            </View>
        )
    };

    const getRepaymentSchedule = () => {
        console.log('ticketPayload', ticketPayload, ticketPayload?.disbursementDate)
        return {
            feeBracket: ticketPayload?.feeBracket,
            noOfInstallment: ticketPayload?.feeBracket?.noOfInstallment,
            amount: ticketPayload?.amount,
            date: ticketPayload?.disbursementDate || ticketPayload?.createdAt,
        }
    }
{console.log('ticketPayload', ticketPayload?.status)}
    return (
        <Container
            headerProps={headerProps} edges={['left', 'right', 'bottom']}
            scrollView={true}
            scrollViewProps={{
                contentContainerStyle: [Styles.scrollContainer, GlobalStyle.list],
            }}
            loading={loading}>

            <View style={ReceiptStyle.popupHeader}>
                <ProgressiveImage
                    source={require('../../../assets/images/payment-successful.png')}
                    style={ReceiptStyle.popupHeaderImage}/>

                {ticketPayload?.message ? <CText style={ReceiptStyle.title}>{ticketPayload?.message}</CText> : null}
                <CText style={ReceiptStyle.amountTitle}>{t("PERSONAL_LOAN.PERSONAL_LOAN_AMOUNT")}</CText>

                <CText style={ReceiptStyle.amountText}> {ticketPayload?.amountInAED ? Number(ticketPayload?.amountInAED).toFixed(2) : 0} <CText>AED</CText></CText>

            </View>

            <View style={[ReceiptStyle.list, {marginBottom: 25}]}>

                <MappedElement
                    data={generateReceiverDetail(ticketPayload)}
                    renderElement={(item, index) => renderItem(item, index)}
                />

                <RepaymentSchedule
                    isShow={ticketPayload && ticketPayload?.status !== 'FAILED'}
                    data={getRepaymentSchedule()}/>

                <View style={ReceiptStyle.listHeader}>
                    <CText style={ReceiptStyle.listHeaderText}>
                        {t("RECEIPT.PERSONAL_LOAN_AND_CHARGES")}
                    </CText>
                </View>
                <MappedElement
                    data={generateTransferAmountAndCharges(ticketPayload)}
                    renderElement={(item, index) => renderItem(item, index)}
                />

            </View>

            <CButton
                title={"View Documents"}
                onPress={() => DocumentsRef?.current?.toggleModal()}

            />

            <Documents
                data={ticketPayload}
                ref={DocumentsRef}/>

        </Container>
    )
}

export default React.memo(HistoryDetail)
