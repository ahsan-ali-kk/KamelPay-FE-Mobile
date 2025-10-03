import * as React from "react";
import {
    Billers,
    BillerSku,
    BillerSkuIo,
    BillerTypes,
    Pay,
    PayBill,
    PayBillHistory,
    PayBillOverview,

    BilRSPayBill,
    BilRSPayBillHistory,
    BilRSBillerTypes,
    BilRSBillers,
    BilRSBillerSku,
    BilRSBillerSkuIo,
    BilRSPay,
    BilRSPayBillOverview,

    GlobalOtp,
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";
import {useSelector} from "react-redux";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function PayBillStack() {
    const {topupAndBillpaymentCurrentVendor} = useSelector(state => state.global);
    return (
        <Stack.Navigator initialRouteName="pay_bill" screenOptions={StackScreenOptions}>
            {topupAndBillpaymentCurrentVendor?.id === 'BILRS' ? (
                <>
                    {/*BILRS*/}
                    <Stack.Screen name="pay_bill" component={BilRSPayBill} />
                    <Stack.Screen name="pay_bill_history" component={BilRSPayBillHistory} />
                    <Stack.Screen name="pay_bill_biller_types" component={BilRSBillerTypes} />
                    <Stack.Screen name="pay_bill_billers" component={BilRSBillers} />
                    <Stack.Screen name="pay_bill_biller_sku" component={BilRSBillerSku} />
                    <Stack.Screen name="pay_bill_biller_sku_io" component={BilRSBillerSkuIo} />
                    <Stack.Screen name="pay_bill_pay" component={BilRSPay} />
                    <Stack.Screen name="pay_bill_overview" component={BilRSPayBillOverview} />
                </>
            ) : (
                <>
                    {/*PAYKII*/}
                    <Stack.Screen name="pay_bill" component={PayBill} />
                    <Stack.Screen name="pay_bill_history" component={PayBillHistory} />
                    <Stack.Screen name="pay_bill_biller_types" component={BillerTypes} />
                    <Stack.Screen name="pay_bill_billers" component={Billers} />
                    <Stack.Screen name="pay_bill_biller_sku" component={BillerSku} />
                    <Stack.Screen name="pay_bill_biller_sku_io" component={BillerSkuIo} />
                    <Stack.Screen name="pay_bill_pay" component={Pay} />
                    <Stack.Screen name="pay_bill_overview" component={PayBillOverview} />
                </>
            )}
            <Stack.Screen name="pay_bill_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default PayBillStack;
