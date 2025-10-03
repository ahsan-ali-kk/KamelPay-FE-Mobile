import * as React from "react";
import {
    AdvanceSalary, AdvanceSalaryOtherInformation, AdvanceSalaryRequestOverview,
    CurrencyExchange, GlobalOtp,
    HelloPaisaBankBranches,
    HelloPaisaBanks,
    HelloPaisaCountries,
    HelloPaisaIban,
    HelloPaisaIFSCCodeBanks,
    Remittance,
    RemittanceBeneficiaryDetails,
    RemittanceType,
    UserAdditionalInfo
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function SnplStack() {

    let initialParams = {
        module :'SNPL'
    };

    return (
        <Stack.Navigator initialRouteName="send_money" screenOptions={StackScreenOptions}>
            <Stack.Screen name="send_money" initialParams={initialParams} component={Remittance} />
            <Stack.Screen name="send_money_countries" initialParams={initialParams} component={HelloPaisaCountries} />
            <Stack.Screen name="send_money_type" initialParams={initialParams} component={RemittanceType} />
            <Stack.Screen name="send_money_banks" initialParams={initialParams} component={HelloPaisaBanks} />
            <Stack.Screen name="send_money_ifsc_code" initialParams={initialParams} component={HelloPaisaIFSCCodeBanks} />
            <Stack.Screen name="send_money_iban" initialParams={initialParams} component={HelloPaisaIban} />
            <Stack.Screen name="send_money_bank_branches" initialParams={initialParams} component={HelloPaisaBankBranches} />
            <Stack.Screen name="user_additional_info" component={UserAdditionalInfo} />
            <Stack.Screen name="send_money_beneficiary_details" component={RemittanceBeneficiaryDetails} />
            <Stack.Screen name="send_money_exchange_rate" initialParams={initialParams} component={CurrencyExchange} />
            <Stack.Screen name="send_money_otp" initialParams={initialParams} component={GlobalOtp} />
            <Stack.Screen name="advance_salary" initialParams={initialParams} component={AdvanceSalary} />
            <Stack.Screen name="advance_salary_request_other_information" initialParams={initialParams} component={AdvanceSalaryOtherInformation} />
            <Stack.Screen name="advance_salary_request_overview" initialParams={initialParams} component={AdvanceSalaryRequestOverview} />
            <Stack.Screen name="advance_salary_otp" initialParams={initialParams} component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default SnplStack;
