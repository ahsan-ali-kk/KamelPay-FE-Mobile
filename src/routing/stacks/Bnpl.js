import * as React from "react";
import {
    Bnpl,
    BnplCategories,
    BnplSubCategories,
    BnplCart,
    BnplCheckout,
    BnplProducts,
    BnplProductDetail,
    BnplAddresses,
    BnplAddAddress,
    BnplHistory,
    BnplHistoryView,
    GlobalOtp
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function BnplStack() {
    return (
        <Stack.Navigator initialRouteName="bnpl" screenOptions={StackScreenOptions}>
            <Stack.Screen name="bnpl" component={Bnpl} />
            <Stack.Screen name="bnpl_categories" component={BnplCategories} />
            <Stack.Screen name="bnpl_sub_categories" component={BnplSubCategories} />
            <Stack.Screen name="bnpl_products" component={BnplProducts} />
            <Stack.Screen name="bnpl_product_detail" component={BnplProductDetail} />
            <Stack.Screen name="bnpl_cart" component={BnplCart} />
            <Stack.Screen name="bnpl_checkout" component={BnplCheckout} />
            <Stack.Screen name="bnpl_addresses" component={BnplAddresses} />
            <Stack.Screen name="bnpl_add_address" component={BnplAddAddress} />
            <Stack.Screen name="bnpl_history" component={BnplHistory} />
            <Stack.Screen name="bnpl_history_view" component={BnplHistoryView} />
            <Stack.Screen name="bnpl_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default BnplStack;
