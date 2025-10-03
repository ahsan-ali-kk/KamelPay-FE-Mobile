import * as React from "react";
import {
    CurrencyExchange,
    GlobalOtp,
    HelloPaisaBankBranches,
    HelloPaisaBanks,
    HelloPaisaCountries,
    Remittance,
    RemittanceBeneficiaryDetails,
    RemittanceConfirmation,
    RemittanceHistory,
    RemittanceType,
    UserAdditionalInfo,
    HelloPaisaIFSCCodeBanks,
    HelloPaisaIban
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function SendMoneyStack() {
    return (
        <Stack.Navigator initialRouteName="send_money" screenOptions={StackScreenOptions}>
            <Stack.Screen name="send_money" component={Remittance} />
            <Stack.Screen name="send_money_history" component={RemittanceHistory} />
            <Stack.Screen name="send_money_countries" component={HelloPaisaCountries} />
            <Stack.Screen name="send_money_type" component={RemittanceType} />
            <Stack.Screen name="send_money_banks" component={HelloPaisaBanks} />
            <Stack.Screen name="send_money_ifsc_code" component={HelloPaisaIFSCCodeBanks} />
            <Stack.Screen name="send_money_iban" component={HelloPaisaIban} />
            <Stack.Screen name="send_money_bank_branches" component={HelloPaisaBankBranches} />
            <Stack.Screen name="send_money_exchange_rate" component={CurrencyExchange} />
            <Stack.Screen name="user_additional_info" component={UserAdditionalInfo} />
            <Stack.Screen name="send_money_beneficiary_details" component={RemittanceBeneficiaryDetails} />
            <Stack.Screen name="send_money_confirmation" component={RemittanceConfirmation} />
            <Stack.Screen name="send_money_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default SendMoneyStack;
