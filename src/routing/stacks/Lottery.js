import * as React from "react";
import {
    Lottery,
    LotteryHistory,
    LotteryDetail,
    LotteryOverview,
    LotteryCheck,
    GlobalOtp
} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function LotteryStack() {
    return (
        <Stack.Navigator initialRouteName="lottery" screenOptions={StackScreenOptions}>
            <Stack.Screen name="lottery" component={Lottery} />
            <Stack.Screen name="lottery_history" component={LotteryHistory} />
            <Stack.Screen name="lottery_detail" component={LotteryDetail} />
            <Stack.Screen name="lottery_check" component={LotteryCheck} />
            <Stack.Screen name="lottery_overview" component={LotteryOverview} />
            <Stack.Screen name="lottery_otp" component={GlobalOtp} />
        </Stack.Navigator>
    );
}

export default LotteryStack;
