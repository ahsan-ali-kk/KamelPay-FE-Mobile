import * as React from "react";
import {
    AboutUs,
    AddCard,
    ChangePassword,
    Faqs,
    PasswordsAndBiometrics,
    PrivacyPolicy,
    Profile,
    SetPin,
    Settings,
    TermsAndConditions,
    UserAdditionalInfo,
    ChangePhoneNumberRequest,
    ChangePhoneNumberRequestOverview,
    ChangePhoneNumberOTP,
    GlobalOtp,
    Referral,
    ReferralTransaction,
    ScheduleOfCharges
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";
import NotificationsStack from "./Notifications";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function SettingsStack() {
    return (
        <Stack.Navigator initialRouteName="settings" screenOptions={StackScreenOptions}>
            <Stack.Screen name="settings" component={Settings} />
            <Stack.Screen name="change_password" component={ChangePassword} />
            <Stack.Screen name="passwords_and_biometrics" component={PasswordsAndBiometrics} />
            <Stack.Screen name="set_pin" component={SetPin} />
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="user_additional_info" component={UserAdditionalInfo} />
            <Stack.Screen name="terms_and_conditions" component={TermsAndConditions} />
            <Stack.Screen name="about_us" component={AboutUs} />
            <Stack.Screen name="privacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="faqs" component={Faqs} />
            <Stack.Screen name="change_phone_number_request" component={ChangePhoneNumberRequest} />
            <Stack.Screen name="change_phone_number_request_overview" component={ChangePhoneNumberRequestOverview} />
            <Stack.Screen name="change_phone_number_request_otp" component={ChangePhoneNumberOTP} />
            <Stack.Screen name="add_card" component={AddCard} />
            <Stack.Screen name="referral" component={Referral} />
            <Stack.Screen name="referral_transaction" component={ReferralTransaction} />
            <Stack.Screen name="schedule_of_charges" component={ScheduleOfCharges} />
            <Stack.Screen name="Notifications" component={NotificationsStack} />
        </Stack.Navigator>
    );
}

export default SettingsStack;
