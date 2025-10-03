import * as React from "react";
import {
    PersonalLoan,
    PersonalLoanAdditionalQuestion,
    PersonalLoanRequestOverview,
    GlobalOtp,
    PersonalLoanHistory,
    PersonalLoanHistoryView
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function PersonalLoanStack() {
    return (
        <Stack.Navigator initialRouteName="personal_loan" screenOptions={StackScreenOptions}>
            <Stack.Screen name="personal_loan" component={PersonalLoanAdditionalQuestion} />
            <Stack.Screen name="personal_loan_additional_question" component={PersonalLoan} />
            <Stack.Screen name="personal_loan_request_overview" component={PersonalLoanRequestOverview} />
            <Stack.Screen name="personal_loan_otp" component={GlobalOtp} />
            <Stack.Screen name="personal_loan_history" component={PersonalLoanHistory} />
            <Stack.Screen name="personal_loan_history_view" component={PersonalLoanHistoryView} />
        </Stack.Navigator>
    );
}

export default PersonalLoanStack;
