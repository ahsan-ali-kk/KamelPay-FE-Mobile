import * as React from "react";
import {
    GlobalOtp,
    Home,
    OTP,
    Populars,
    PromotionForm,
    Referral,
    UserAdditionalInfo,
    Points,
    ChangePassword,
    AddCard,
    AdvanceSalaryHistory,
    PersonalLoanHistory,
    PersonalLoanHistoryView,
    KPWalletTransferHistory,
    BnplHistory,
    BnplHistoryView,
    NotificationsApproval
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";
import NotificationsStack from "./Notifications";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function HomeStack() {
    return (
        <Stack.Navigator initialRouteName="home" screenOptions={StackScreenOptions}>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="change_password" component={ChangePassword} />
            <Stack.Screen name="promotionForm" component={PromotionForm} />
            <Stack.Screen name="populars" component={Populars} />
            <Stack.Screen name="user_additional_info" component={UserAdditionalInfo} />
            <Stack.Screen name="otp" component={OTP} />
            <Stack.Screen name="savings_otp" component={GlobalOtp} />
            <Stack.Screen name="referral" component={Referral} />
            <Stack.Screen name="points" component={Points} />
            <Stack.Screen name="add_card" component={AddCard} />
            <Stack.Screen name="advance_salary_history" component={AdvanceSalaryHistory} />
            <Stack.Screen name="personal_loan_history" component={PersonalLoanHistory} />
            <Stack.Screen name="personal_loan_history_view" component={PersonalLoanHistoryView} />
            <Stack.Screen name="kp_wallet_transfer_history" component={KPWalletTransferHistory} />
            <Stack.Screen name="bnpl_history" component={BnplHistory} />
            <Stack.Screen name="bnpl_history_view" component={BnplHistoryView} />
            <Stack.Screen name="notificationsApproval" component={NotificationsApproval} />
            <Stack.Screen name="Notifications" component={NotificationsStack} />
        </Stack.Navigator>
    );
}
export default HomeStack;
