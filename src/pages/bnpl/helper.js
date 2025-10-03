import { formatAmount } from "../../utils/methods";

export const feeType = ['OneTime', 'Monthly', 'Both'];

export const findBNPLProductInCart = (data) => {
    return data?.length && data[0] && data[0]?.isBnpl || false
};

export const generateInstallmentPlan = (t, obj, label = 'title') => {
        let isClubDeduction = obj?.isClubDeduction;
        let firstInstallmentEnable = obj?.firstInstallmentEnable;
        let isVatOnPrincipalAmount = obj?.isVatOnPrincipalAmount;

        // SHIPPING FEES AND VAT
        let isChargeShipmentFee = obj?.isChargeShipmentFee;
        let isVatOnShipmentCharges = obj?.isVatOnShipmentCharges;
        let shippingFees = isChargeShipmentFee ? Number(obj?.shippingFees || 0) : 0;
        let shippingFeesVat = isVatOnShipmentCharges ? Number(obj?.shippingFeesVat || 0) : 0;
        let totalShippingFeesAndVat = 0;
        totalShippingFeesAndVat += shippingFees;
        totalShippingFeesAndVat += shippingFeesVat;

        // PLATFORM FEES AND VAT
        let isChargePlatformFee = obj?.isChargePlatformFee;
        let isVatOnPlatformFee = obj?.isVatOnPlatformFee;
        let platformFees = isChargePlatformFee ? Number(obj?.platformFees || 0) : 0;
        let platformFeesVat = isVatOnPlatformFee ? Number(obj?.platformFeesVat || 0) : 0;
        let totalPlatformFeesAndVat = 0;
        totalPlatformFeesAndVat += platformFees;
        totalPlatformFeesAndVat += platformFeesVat;

        // PROCESSING FEES AND VAT
        let isChargeOneTimeFee = obj?.isChargeOneTimeFee;
        let isVatOnOneTimeFee = obj?.isVatOnOneTimeFee;
        let processingFees = isChargeOneTimeFee ? Number(obj?.processingFees || 0) : 0;
        let processingFeesVat = isVatOnOneTimeFee ? Number(obj?.processingFeesVat || 0) : 0;
        let totalProcessingFeesAndVat = 0;
        totalProcessingFeesAndVat += processingFees;
        totalProcessingFeesAndVat += processingFeesVat;

        // MONTHLY FEES AND VAT
        let isChargeMonthlyFee = obj?.isChargeMonthlyFee;
        let isVatOnMonthlyFee = obj?.isVatOnMonthlyFee;
        let monthlyFee = isChargeMonthlyFee ? Number(obj?.totalFeeMonthly || 0) : 0;
        let monthlyFeeVat = isVatOnMonthlyFee ? Number(obj?.totalVatMonthly || 0) : 0;
        let totalMonthlyFeesAndVat = 0;
        totalMonthlyFeesAndVat += monthlyFee;
        totalMonthlyFeesAndVat += monthlyFeeVat;

        let principalAmount = Number(obj?.fullPrice);

        let principalAmountVat = isVatOnPrincipalAmount ? Number(obj?.vatOnPrincipalAmount) : 0;

        let noOfInstallment = Number(obj?.noOfInstallment);

        let monthlyPayment = Number(obj?.monthlyInstallment);

        let data = [];

        let totalVat = 0;
        let totalMonthlyInstallment = 0;
        let amountDueToday = 0;

        if(!isClubDeduction && firstInstallmentEnable) {
            data.push({
                [label]: 'Product Price',
                value: formatAmount(principalAmount, 'AED')
            })

            if(principalAmountVat){
                data.push({
                    [label]: 'Product VAT',
                    value: formatAmount(principalAmountVat, 'AED')
                })
            }

            if(noOfInstallment){
                data.push({
                    [label]: 'No. Of Installment',
                    value: noOfInstallment
                })
            }

            if(totalPlatformFeesAndVat){
                data.push({
                    [label]: isVatOnPlatformFee ? 'Platform Fees + VAT' : 'Platform Fees',
                    value: formatAmount(totalPlatformFeesAndVat, 'AED')
                })
            }

            if((obj?.type === feeType[0] || obj?.type === feeType[2]) && totalProcessingFeesAndVat){
                data.push({
                    [label]: isVatOnOneTimeFee ? 'Processing Fees + VAT' : 'Processing Fees',
                    value: formatAmount(totalProcessingFeesAndVat, 'AED')
                })
            }

            if((obj?.type === feeType[1] || obj?.type === feeType[2]) && totalMonthlyFeesAndVat){
                data.push({
                    [label]: isVatOnMonthlyFee ? 'Monthly Processing Fees + VAT' : 'Monthly Processing Fees',
                    value: formatAmount(totalMonthlyFeesAndVat, 'AED')
                })
            }

            if(totalShippingFeesAndVat){
                data.push({
                    [label]: isVatOnShipmentCharges ? 'Shipping Charges Fees + VAT' : 'Shipping Charges Fees',
                    value: formatAmount(totalShippingFeesAndVat, 'AED')
                })
            }
            totalMonthlyInstallment = monthlyPayment;
            if(monthlyPayment){
                data.push({
                    [label]: 'Monthly Installment',
                    value: formatAmount(monthlyPayment, 'AED')
                })
            }

            amountDueToday = monthlyPayment + totalShippingFeesAndVat + totalPlatformFeesAndVat + principalAmountVat;

            if((obj?.type === feeType[0] || obj?.type === feeType[2]) && totalProcessingFeesAndVat){
                amountDueToday += totalProcessingFeesAndVat
            }

            if((obj?.type === feeType[1] || obj?.type === feeType[2]) && totalMonthlyFeesAndVat){
                amountDueToday += totalMonthlyFeesAndVat
            }

            data.push({
                [label]: 'Due Today',
                value: formatAmount(amountDueToday, 'AED')
            })
        }
        else if(!isClubDeduction && !firstInstallmentEnable) {
               data.push({
                [label]: 'Product Price',
                value: formatAmount(principalAmount, 'AED')
            })

            if(principalAmountVat){
                data.push({
                    [label]: 'Product VAT',
                    value: formatAmount(principalAmountVat, 'AED')
                })
            }

            if(noOfInstallment){
                data.push({
                    [label]: 'No. Of Installment',
                    value: noOfInstallment
                })
            }

            if(totalPlatformFeesAndVat){
                data.push({
                    [label]: isVatOnPlatformFee ? 'Platform Fees + VAT' : 'Platform Fees',
                    value: formatAmount(totalPlatformFeesAndVat, 'AED')
                })
            }

            if((obj?.type === feeType[0] || obj?.type === feeType[2]) && totalProcessingFeesAndVat){
                data.push({
                    [label]: isVatOnOneTimeFee ? 'Processing Fees + VAT' : 'Processing Fees',
                    value: formatAmount(totalProcessingFeesAndVat, 'AED')
                })
            }

            if((obj?.type === feeType[1] || obj?.type === feeType[2]) && totalMonthlyFeesAndVat){
                data.push({
                    [label]: isVatOnMonthlyFee ? 'Monthly Processing Fees + VAT' : 'Monthly Processing Fees',
                    value: formatAmount(totalMonthlyFeesAndVat, 'AED')
                })
            }

            if(totalShippingFeesAndVat){
                data.push({
                    [label]: isVatOnShipmentCharges ? 'Shipping Charges Fees + VAT' : 'Shipping Charges Fees',
                    value: formatAmount(totalShippingFeesAndVat, 'AED')
                })
            }

            totalMonthlyInstallment = monthlyPayment;
            if(monthlyPayment){
                data.push({
                    [label]: 'Monthly Installment',
                    value: formatAmount(monthlyPayment, 'AED')
                })
            }

            amountDueToday += totalShippingFeesAndVat + totalPlatformFeesAndVat + principalAmountVat;

            if((obj?.type === feeType[0] || obj?.type === feeType[2]) && totalProcessingFeesAndVat){
                amountDueToday += totalProcessingFeesAndVat
            }

            if((obj?.type === feeType[1] || obj?.type === feeType[2]) && totalMonthlyFeesAndVat){
                amountDueToday += totalMonthlyFeesAndVat
            }

            data.push({
                [label]: 'Due Today',
                value: formatAmount(amountDueToday, 'AED')
            })
        }
        else if(isClubDeduction && firstInstallmentEnable) {

            let productPrice = principalAmount + shippingFees + platformFees;
            if((obj?.type === feeType[0] || obj?.type === feeType[2])){
                productPrice += processingFees
            }
            if((obj?.type === feeType[1] || obj?.type === feeType[2])){
                productPrice += monthlyFee
            }

            data.push({
                [label]: 'Product Price',
                value: formatAmount(productPrice, 'AED')
            })

            if(noOfInstallment){
                data.push({
                    [label]: 'No. Of Installment',
                    value: noOfInstallment
                })
            }

            let monthlyPayment = productPrice / noOfInstallment;
            totalMonthlyInstallment = monthlyPayment;
            if(monthlyPayment){
                data.push({
                    [label]: 'Monthly Installment',
                    value: formatAmount((monthlyPayment), 'AED')
                })
            }

            let totalVat = principalAmountVat + shippingFeesVat + platformFeesVat;
            if((obj?.type === feeType[0] || obj?.type === feeType[2])){
                totalVat += processingFeesVat
            }
            if((obj?.type === feeType[1] || obj?.type === feeType[2])){
                totalVat += monthlyFeeVat
            }
            if(totalVat){
                data.push({
                    [label]: 'Total VAT',
                    value: formatAmount(totalVat, 'AED')
                })
            }

            amountDueToday += monthlyPayment + totalVat;

            data.push({
                [label]: 'Due Today',
                value: formatAmount(amountDueToday, 'AED')
            })
        }
        else if(isClubDeduction && !firstInstallmentEnable) {
              let productPrice = principalAmount + shippingFees + platformFees;
            if((obj?.type === feeType[0] || obj?.type === feeType[2])){
                productPrice += processingFees
            }
            if((obj?.type === feeType[1] || obj?.type === feeType[2])){
                productPrice += monthlyFee
            }

            data.push({
                [label]: 'Product Price',
                value: formatAmount(productPrice, 'AED')
            })

            if(noOfInstallment){
                data.push({
                    [label]: 'No. Of Installment',
                    value: noOfInstallment
                })
            }

            let monthlyPayment = productPrice / noOfInstallment;
            totalMonthlyInstallment = monthlyPayment;
            if(monthlyPayment){
                data.push({
                    [label]: 'Monthly Installment',
                    value: formatAmount((monthlyPayment), 'AED')
                })
            }

            let totalVat = principalAmountVat + shippingFeesVat + platformFeesVat;
            if((obj?.type === feeType[0] || obj?.type === feeType[2])){
                totalVat += processingFeesVat
            }
            if((obj?.type === feeType[1] || obj?.type === feeType[2])){
                totalVat += monthlyFeeVat
            }
            if(totalVat){
                data.push({
                    [label]: 'Total VAT',
                    value: formatAmount(totalVat, 'AED')
                })
            }

            amountDueToday += totalVat;
            data.push({
                [label]: 'Due Today',
                value: formatAmount(amountDueToday, 'AED')
            })
        }

        return {
            data,
            amountDueToday,
            totalMonthlyInstallment
        }
    }
