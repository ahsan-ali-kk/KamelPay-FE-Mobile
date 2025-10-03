import * as React from "react";
import {
    KPWalletTransfer,
    KPWalletTransferFind,
    KPWalletTransferRate,
    KPWalletTransferConfirmation,
    KPWalletTransferHistory,
    GlobalOtp
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function KPWalletTransferStack() {
    return (
        <Stack.Navigator initialRouteName="kp_wallet_transfer" screenOptions={StackScreenOptions}>
            <Stack.Screen name="kp_wallet_transfer" component={KPWalletTransfer} />
            <Stack.Screen name="kp_wallet_transfer_find" component={KPWalletTransferFind} />
            <Stack.Screen name="kp_wallet_transfer_rate" component={KPWalletTransferRate} />
            <Stack.Screen name="kp_wallet_transfer_confirmation" component={KPWalletTransferConfirmation} />
            <Stack.Screen name="kp_wallet_transfer_history" component={KPWalletTransferHistory} />
            <Stack.Screen name="kp_wallet_transfer_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}
export default KPWalletTransferStack;
