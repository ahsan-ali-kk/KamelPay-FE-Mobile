import * as React from "react";
import {
    AdvanceSalary,
    AdvanceSalaryHistory,
    AdvanceSalaryOtherInformation,
    AdvanceSalaryRequestOverview,
    GlobalOtp
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function AdvanceSalaryStack() {
    return (
        <Stack.Navigator initialRouteName="advance_salary" screenOptions={StackScreenOptions}>
            <Stack.Screen name="advance_salary" component={AdvanceSalary} />
            <Stack.Screen name="advance_salary_history" component={AdvanceSalaryHistory} />
            <Stack.Screen name="advance_salary_request_other_information" component={AdvanceSalaryOtherInformation} />
            <Stack.Screen name="advance_salary_request_overview" component={AdvanceSalaryRequestOverview} />
            <Stack.Screen name="advance_salary_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default AdvanceSalaryStack;
