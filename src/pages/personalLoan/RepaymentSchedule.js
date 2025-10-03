import React from "react";
import {View} from "react-native";
import {CText} from "../../uiComponents";
import {formatAmount, MappedElement} from "../../utils/methods";
import moment from "moment";
import {useTranslation} from "react-i18next";
import ReceiptStyle from "../../uiComponents/receipt/Receipt.style";
import Styles from "./PersonalLoan.style";


function formatDateWithAddedMonths(monthsToAdd) {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsToAdd);
    return date.toISOString().slice(0, 10).split('-').reverse().join('-');
}

function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // e.g., "25 Jun 2025"
}

function truncateAmount(val = 0) {
    return Math.floor(val * 100) / 100
};

function calculateMonthlyReducingRate(P, EMI, n, precision = 1e-10, maxIterations = 100) {
    console.log(P, EMI, n,)
    let low = 0;
    let high = 1;
    let mid;

    function computeEMI(P, r, n) {
        return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    for (let i = 0; i < maxIterations; i++) {
        mid = (low + high) / 2;
        const computedEMI = computeEMI(P, mid, n);

        if (Math.abs(computedEMI - EMI) < precision) {
            return mid; // Found the rate
        }

        if (computedEMI > EMI) {
            // console.log('TOO High')
            high = mid; // Too high, reduce rate
        } else {
            // console.log('TOO Low')
            low = mid; // Too low, increase rate
        }
    }

    return mid; // Approximate rate after iterations
}

function calculateFlatRatePA(totalProfit, principal, tenureYears) {
    if (principal <= 0 || tenureYears <= 0) {
        throw new Error("Principal and tenure must be positive numbers.");
    }
    const flatRate = totalProfit / (principal * tenureYears);
    return flatRate; // e.g. 0.18 => 18%
}

function getCurrentProfitRateOrOrginRate(amount, feeBracket) {
    const principle = Number(amount);
    const noOfInstallment = feeBracket?.noOfInstallment;
    const profit = feeBracket?.processingFeesMonthly;

    const monthlyPrinciple = principle / noOfInstallment;
    const monthlyProfit = profit / noOfInstallment;
    const emi = monthlyPrinciple + monthlyProfit;
    const flatRate = calculateFlatRatePA(profit, principle, (noOfInstallment / 12));
    const monthlyRate = calculateMonthlyReducingRate(principle, emi, noOfInstallment);
    // Optional: Nominal Annual Rate
    const nominalAnnual = monthlyRate * 12;
    return {
        flatRate: (flatRate * 100).toFixed(4),
        curr_pft: (nominalAnnual * 100).toFixed(4),
    }
}

function generateInstallments(startDate, amount, feeBracket) {
    const installments = [];
    const baseDate = new Date(startDate);
    baseDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Extract number of installments and principal amount
    const noOfInstallment = feeBracket?.noOfInstallment;
    const principle = Number(amount);
    // Total profit over the entire tenure (e.g. processing fees)
    const profit = Number(feeBracket?.processingFeesMonthly || 0);
    // Total payable (principal + total profit)
    const totalFinanceAmount = principle + profit;
    // Evenly split principal and profit per month (for EMI breakdown)
    const monthlyPrinciple = principle / noOfInstallment;
    const monthlyProfit = profit / noOfInstallment;
    console.log('monthlyPrinciple', monthlyPrinciple)
    // EMI = monthly principal + monthly profit
    const emi = monthlyPrinciple + monthlyProfit;
    // Calculate the monthly interest rate for reducing balance method
    // const monthlyInterestRate = calculateMonthlyReducingRate(principle, emi, noOfInstallment);
    const monthlyInterestRate = calculateMonthlyReducingRate(principle, emi, noOfInstallment);

    const dueDates = [];
    // 🔁 Step 1: Generate all installment due dates
    for (let i = 0; i < noOfInstallment; i++) {
        const d = new Date(baseDate);
        d.setMonth(d.getMonth() + (i));
        dueDates.push(d);
    }
    // Keep track of how much principal is left after each installment
    let remainingPrincipal = principle;
    // 🔁 Step 2: Generate each installment entry
    for (let i = 0; i < noOfInstallment; i++) {
        const dueDate = dueDates[i];
        // Define start and end period for each installment
        const startPeriod = new Date(dueDate);
        let endPeriod;
        if (i < noOfInstallment - 1) {
            endPeriod = new Date(dueDates[i + 1]);
            endPeriod.setDate(endPeriod.getDate() - 1);
        } else {
            // Last installment ends 1 month after due date, minus 1 day
            endPeriod = new Date(dueDate);
            endPeriod.setMonth(endPeriod.getMonth() + 1);
            endPeriod.setDate(endPeriod.getDate() - 1);
        }
        // Calculate number of days in this installment period
        const periodDays = Math.round((endPeriod - startPeriod) / (1000 * 60 * 60 * 24) + 1);
        // Compute interest using reducing balance method
        let interestAmount = remainingPrincipal * monthlyInterestRate;
        // Daily amortisation = profit for this period / days
        let dailyAmortisation = (interestAmount / periodDays);
        // Principal paid = EMI - interest
        let prin = emi - interestAmount;
        // Update remaining principal after payment
        remainingPrincipal -= prin;
        // Defensive rounding to avoid -0.01 due to float errors
        remainingPrincipal = Math.max(0, Number(remainingPrincipal.toFixed(6)));
        // Construct installment object
        let obj = {
            installmentNo: i + 1,
            dueDate: formatDate(dueDate),
            startPeriod: formatDate(startPeriod),
            endPeriod: formatDate(endPeriod),
            principal: prin.toFixed(2) + ` AED`,
            profit: Number(interestAmount).toFixed(2) + ` AED`,
            totalAmount: Number(emi).toFixed(2) + ` AED`,
            periodDays,
            emi: truncateAmount(emi),
            outstandingPrincipal: Number(remainingPrincipal).toFixed(2) + ` AED`,
            outstandingFinance: Number(emi * (noOfInstallment - i - 1)).toFixed(2) + ` AED`,
            dailyAmortisation: Number(dailyAmortisation).toFixed(4),
        }
        installments.push(obj);
    }

    return installments;
}

function calculateFlatProfitRate(monthlyProfit, noOfInstallment, principalAmount) {
    const totalProfit = monthlyProfit;
    const tenureInYears = noOfInstallment / 12;
    const flatRate = (totalProfit / principalAmount) / tenureInYears * 100;
    return flatRate.toFixed(2); // use 6 decimal places for precision like your screenshot
}

function RepaymentSchedule(props) {

    const { t } = useTranslation();
    const {data, isShow = true} = props;

    console.log("RepaymentSchedule", data)

    function getOrdinal(index) {
        const ordinals = [
            'First', 'Second', 'Third', 'Fourth',
            'Fifth', 'Sixth', 'Seventh', 'Eighth',
            'Ninth', 'Tenth', 'Eleventh', 'Twelfth'
        ];
        return ordinals[index] || `${index + 1}th`;
    }

    function generateInstallments(startDate, numberOfInstallments) {
        const installments = [];
        const baseDate = moment.utc(startDate).startOf('day'); // <- FIXED
        let today = moment().startOf('day');

        let processingFeesMonthly = data?.feeBracket?.processingFeesMonthly || data?.feeBracket?.MonthlyProcessingFee || 0

        let totalFeeMonthly = Number(processingFeesMonthly);

        let financeAmount = Number(data?.amount);
        let noOfInstallment = data?.noOfInstallment;

        let monthlyPayment = Number(financeAmount/noOfInstallment);
        let monthlyProfit = Number(totalFeeMonthly/noOfInstallment);
        let totalMonthlyPayment = Number(monthlyPayment+monthlyProfit);

        const principle = Number(data?.amount);

        const emi = monthlyPayment + monthlyProfit;

        const monthlyInterestRate = calculateMonthlyReducingRate(principle, emi, noOfInstallment);

        console.log('monthlyInterestRate', monthlyInterestRate, processingFeesMonthly)

        let remainingPrincipal = financeAmount;



        for (let i = 0; i < numberOfInstallments; i++) {
            // Clone and increment date
            const installmentDate = moment(baseDate).add(i + 1, 'months'); // ✅ now always from 25th
            const dueMoment = installmentDate.clone().startOf('day');

            const isThisMonth = dueMoment.isSame(today, 'month') && dueMoment.isSame(today, 'year');
            const isNextMonth = dueMoment.isSame(moment(today).add(1, 'month'), 'month') && dueMoment.isSame(moment(today).add(1, 'month'), 'year');

            // Compute interest using reducing balance method
            let interestAmount = remainingPrincipal * monthlyInterestRate;
            console.log('interestAmount', interestAmount);
            // Daily amortisation = profit for this period / days
            // let dailyAmortisation = (interestAmount / periodDays);
            // Principal paid = EMI - interest
            let prin = emi - interestAmount;
            // Update remaining principal after payment
            remainingPrincipal -= prin;
            // Defensive rounding to avoid -0.01 due to float errors
            remainingPrincipal = Math.max(0, Number(remainingPrincipal.toFixed(6)));

            installments.push({
                dateLabel: getOrdinal(i),
                dueDate: moment(installmentDate).format('DD MMM'), // Format: YYYY-MM-DD
                installmentNo: i + 1,
                monthlyPayment: formatAmount(prin.toFixed(2), "AED"),
                monthlyProfit: formatAmount(interestAmount, "AED", 2, true),
                totalAmount: formatAmount(totalMonthlyPayment, "AED"),
                isCollected: dueMoment.isBefore(today),         // true if due date has passed
                isActive: isThisMonth || isNextMonth,
            });
        }
        return installments;
    }

    // console.log('generateInstallments')

    return isShow ? (
        <View style={{marginVertical: 20}}>
            <View style={ReceiptStyle.listHeader}>
                <CText style={ReceiptStyle.listHeaderText}>
                    Repayment Schedule
                </CText>
                <CText style={[Styles.installmentListItemText, {marginTop: 10}]}>
                    Tentative schedule based on salary disbursement
                </CText>
            </View>
            <View style={[Styles.repaymentContainer]}>
                <MappedElement
                    data={generateInstallments(data?.date, data?.noOfInstallment)}
                    renderElement={(item, index, array) => {
                        return (
                            <View style={[Styles.repaymentContainerItem,
                                (item?.isCollected) && Styles.collectedItemBackground,
                                (item?.isActive) && Styles.activeItem,
                                array?.length === (index+1) && Styles.margin_bottom_zero
                            ]}>
                                <View style={Styles.repaymentContainerItemLeft}>
                                    <View style={Styles.repaymentDotContainer}>
                                        {index !== 0 ? <View style={[Styles.repaymentDotTopLine]}/> : null}
                                        <View style={[Styles.repaymentDot, (item?.isCollected) && Styles.activeItem, (item?.isActive) && Styles.activeItemDot]}/>
                                        {array?.length !== (index+1) ? <View style={[Styles.repaymentDotBottomLine]}/> : null}
                                    </View>
                                    <View style={Styles.repaymentDateContainer}>
                                        <CText style={[Styles.repaymentDateText, (item?.isCollected) && Styles.collectedItemText, (item?.isActive) && Styles.darkText]}>{item?.dateLabel}</CText>
                                        <CText style={[Styles.repaymentDateText, (item?.isCollected) && Styles.collectedItemText, (item?.isActive) && Styles.darkText]}>{item?.dueDate}</CText>
                                    </View>
                                </View>
                                <View style={Styles.repaymentContainerItemRight}>
                                    <CText style={[Styles.repaymentTitle, (item?.isCollected) && Styles.collectedItemText, (item?.isActive) && Styles.darkText]}>{item?.totalAmount}</CText>
                                    <View style={{flexDirection: 'column'}}>
                                        <CText style={[Styles.repaymentSubTitle, (item?.isCollected) && Styles.collectedItemText]}>{`${"Principal"}: ${item?.monthlyPayment}`}</CText>
                                        {/*<CText style={[Styles.repaymentSubTitle, (item?.isCollected) && Styles.collectedItemText, {marginHorizontal: 5}]}>+</CText>*/}
                                        <CText style={[Styles.repaymentSubTitle, (item?.isCollected) && Styles.collectedItemText]}>{`${"Profit"}: ${item?.monthlyProfit}`}</CText>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </View>
    ) : null
}

export default React.memo(RepaymentSchedule)
