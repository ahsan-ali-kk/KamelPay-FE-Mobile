import * as React from "react";
import {
    ScratchCards,
    ScratchCardDetail,
    GlobalOtp
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function ScratchCardsStack() {
    return (
        <Stack.Navigator initialRouteName="scratch_cards" screenOptions={StackScreenOptions}>
            <Stack.Screen name="scratch_cards" component={ScratchCards} />
            <Stack.Screen name="scratch_card_detail" component={ScratchCardDetail} />
            {/*<Stack.Screen name="advance_salary_otp" component={GlobalOtp} />*/}
        </Stack.Navigator>
    );
}

export default ScratchCardsStack;
