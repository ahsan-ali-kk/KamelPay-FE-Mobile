import * as React from "react";
import {
    Savings,
    SavingsCategories,
    SavingsSubCategories,
    SavingsVendors,
    SavingsVendorDetails,
    SavingsQrAndPin,
    SavingsOverview,
    SavingsFavourites,
    GlobalOtp,
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function SavingsStack() {
    return (
        <Stack.Navigator initialRouteName="savings_categories" screenOptions={StackScreenOptions}>
            <Stack.Screen name="savings_history" component={Savings} />
            <Stack.Screen name="savings_favourites" component={SavingsFavourites} />
            <Stack.Screen name="savings_categories" component={SavingsCategories} />
            <Stack.Screen name="savings_sub_categories" component={SavingsSubCategories} />
            <Stack.Screen name="savings_vendors" component={SavingsVendors} />
            <Stack.Screen name="savings_vendor_details" component={SavingsVendorDetails} />
            <Stack.Screen name="savings_qr_and_pin" component={SavingsQrAndPin} />
            <Stack.Screen name="savings_overview" component={SavingsOverview} />
            <Stack.Screen name="savings_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default SavingsStack;
