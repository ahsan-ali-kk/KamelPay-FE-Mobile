import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {TabBar} from "../containers";

import {
    HomeStack,
    SettingsStack,
    NotificationsStack,
    PayBillStack,
    MobileTopUpStack,
    CardManagementStack,
    SendMoneyStack,
    SavingsStack,
    AdvanceSalaryStack,
    LotteryStack,
    ATMLocatorStack,
    DtOneStack,
    SnplStack,
    BnplStack,
    ScratchCardsStack,
    PersonalLoanStack,
    KPWalletTransferStack
} from "./stacks";
import {useEffect} from "react";
import {getAndUpdateBiometricType} from "../store/actions/Auth.action";
import {useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const Root = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const getAndCheck = async (res) => {
        if(!res?.includes('PIN')){
            navigation.navigate('Settings', { screen: 'set_pin',  initial: false, params: {
                    isBackFalse: true
            }});
        }
    };

    useEffect(() => {
        dispatch(getAndUpdateBiometricType(
            async (res) => await getAndCheck(res)
        ))
    }, []);

    return (
            <Tab.Navigator initialRouteName="Home"
                       tabBar={props => <TabBar {...props}/>}
                       screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeStack}/>
            <Tab.Screen name="Card_Management" component={CardManagementStack} />
            <Tab.Screen name="Settings" component={SettingsStack}/>
            <Tab.Screen name="Send_Money" component={SendMoneyStack} />
            <Tab.Screen name="Mobile_TopUp" component={MobileTopUpStack} />
            <Tab.Screen name="Pay_Bill" component={PayBillStack} />
            <Tab.Screen name="Dt_One" component={DtOneStack} />
            <Tab.Screen name="Savings" component={SavingsStack} />
            <Tab.Screen name="Advance_Salary" component={AdvanceSalaryStack} />
            <Tab.Screen name="Lottery" component={LotteryStack} />
            <Tab.Screen name="Snpl" component={SnplStack} />
            <Tab.Screen name="ATMLocator" component={ATMLocatorStack} />
            <Tab.Screen name="BNPL" component={BnplStack} />
            <Tab.Screen name="Scratch_Cards" component={ScratchCardsStack} />
            <Tab.Screen name="Personal_Loan" component={PersonalLoanStack} />
            <Tab.Screen name="KP_Wallet_Transfer" component={KPWalletTransferStack} />
        </Tab.Navigator>
    )
};

export default Root;
