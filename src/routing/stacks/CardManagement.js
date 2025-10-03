import * as React from "react";
import {
    ActivateCard,
    CardManagement,
    CardStatus,
    ChangePin,
    GlobalOtp,
    TransactionHistory,
    TransactionView,
    CardSubscriptions,
    CardSubscriptionsOverview,
    Points,
    AddCard,
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function CardManagementStack() {
    return (
        <Stack.Navigator initialRouteName="card_management" screenOptions={StackScreenOptions}>
            <Stack.Screen name="card_management" component={CardManagement} />
            <Stack.Screen name="change_pin" component={ChangePin} />
            <Stack.Screen name="card_management_otp" component={GlobalOtp} />
            <Stack.Screen name="transaction_history" component={TransactionHistory}/>
            <Stack.Screen name="transaction_history_view" component={TransactionView}/>
            <Stack.Screen name="manage_card_status" component={CardStatus} />
            <Stack.Screen name="card_subscriptions" component={CardSubscriptions} />
            <Stack.Screen name="card_subscriptions_overview" component={CardSubscriptionsOverview} />
            <Stack.Screen name="activate_card" component={ActivateCard} />
            <Stack.Screen name="add_card" component={AddCard} />
            <Stack.Screen name="points" component={Points} />
        </Stack.Navigator>
    );
}

export default CardManagementStack;
