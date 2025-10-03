import * as React from "react";
import {
    ATMLocator,
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function ATMLocatorStack() {
    return (
        <Stack.Navigator initialRouteName="atm_locator" screenOptions={StackScreenOptions}>
            <Stack.Screen name="atm_locator" component={ATMLocator} />
        </Stack.Navigator>
    );
}

export default ATMLocatorStack;
