import * as React from "react";
import {Notifications, NotificationsApproval} from "../../pages";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const StackScreenOptions = {
    headerShown: false
};

function NotificationsStack() {
    return (
        <Stack.Navigator initialRouteName="notifications" screenOptions={StackScreenOptions}>
            <Stack.Screen name="notifications" component={Notifications} />
            <Stack.Screen name="notificationsApproval" component={NotificationsApproval} />
        </Stack.Navigator>
    );
}

export default NotificationsStack;
