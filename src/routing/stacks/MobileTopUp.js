import * as React from "react";
import {
    AddTopUp,
    TopUp,
    TopUpBillers,
    TopUpOverview,
    TopUpHistory,
    TopUpPay,

    BillerSku,
    BillerSkuIo,
    Pay,
    PayBillOverview,

    BilRSBillerSku,
    BilRSBillerSkuIo,
    BilRSPay,
    BilRSPayBillOverview,

    BilRSTopUp,
    BilRSAddTopUp,
    BilRSTopUpBillers,
    BilRSTopUpPay,
    BilRSTopUpOverview,
    BilRSTopUpHistory,

    GlobalOtp
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";
import {useSelector} from "react-redux";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function MobileTopUpStack() {
    const {topupAndBillpaymentCurrentVendor} = useSelector(state => state.global);
    return (
        <Stack.Navigator initialRouteName="mobile_topup" screenOptions={StackScreenOptions}>
            {topupAndBillpaymentCurrentVendor?.id === 'BILRS' ? (
                    <>
                        {/*BILRS*/}
                        {/*======TOPUP======*/}
                        <Stack.Screen name="mobile_topup" component={BilRSTopUp} />
                        <Stack.Screen name="mobile_topup_history" component={BilRSTopUpHistory} />
                        <Stack.Screen name="add_mobile_topup" component={BilRSAddTopUp} />
                        <Stack.Screen name="mobile_topup_billers" component={BilRSTopUpBillers} />
                        <Stack.Screen name="mobile_topup_pay" component={BilRSTopUpPay} />
                        <Stack.Screen name="mobile_topup_overview" component={BilRSTopUpOverview} />
                        {/*======PAYBILL======*/}
                        <Stack.Screen name="pay_bill_biller_sku" component={BilRSBillerSku} />
                        <Stack.Screen name="pay_bill_biller_sku_io" component={BilRSBillerSkuIo} />
                        <Stack.Screen name="pay_bill_pay" component={BilRSPay} />
                        <Stack.Screen name="pay_bill_overview" component={BilRSPayBillOverview} />
                    </>
                )
                : (
                <>
                    {/*PAYKII*/}
                    {/*======TOPUP======*/}
                    <Stack.Screen name="mobile_topup" component={TopUp} />
                    <Stack.Screen name="mobile_topup_history" component={TopUpHistory} />
                    <Stack.Screen name="add_mobile_topup" component={AddTopUp} />
                    <Stack.Screen name="mobile_topup_billers" component={TopUpBillers} />
                    <Stack.Screen name="mobile_topup_pay" component={TopUpPay} />
                    <Stack.Screen name="mobile_topup_overview" component={TopUpOverview} />
                    {/*/!*======PAYBILL======*!/*/}
                    <Stack.Screen name="pay_bill_biller_sku" component={BillerSku} />
                    <Stack.Screen name="pay_bill_biller_sku_io" component={BillerSkuIo} />
                    <Stack.Screen name="pay_bill_pay" component={Pay} />
                    <Stack.Screen name="pay_bill_overview" component={PayBillOverview} />
                </>
                )
            }
            <Stack.Screen name="mobile_topup_otp" component={GlobalOtp} />
            <Stack.Screen name="pay_bill_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default MobileTopUpStack;
