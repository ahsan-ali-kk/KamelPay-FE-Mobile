import * as React from "react";
import {
    DtOneCards,
    DtOneHistory,
    GlobalOtp,
    DtOneOverview,
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function DtOneStack() {
    return (
        <Stack.Navigator initialRouteName="dt_one_history" screenOptions={StackScreenOptions}>
            <Stack.Screen name="dt_one_cards" component={DtOneCards} />
            <Stack.Screen name="dt_one_history" component={DtOneHistory} />
            <Stack.Screen name="dt_one_otp" component={GlobalOtp} />
            <Stack.Screen name="dt_one_overview" component={DtOneOverview} />
        </Stack.Navigator>
    );
}

export default DtOneStack;
