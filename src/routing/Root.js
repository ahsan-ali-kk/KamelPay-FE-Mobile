import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {TabBar} from "../containers";

import {
    HomeStack,
    SettingsStack,
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
import {useEffect, useRef} from "react";
import {getAndUpdateBiometricType} from "../store/actions/Auth.action";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {preserveNotification as preserveNotificationFunc, setCurrentScreen} from "../store/actions/Global.action";

const Tab = createBottomTabNavigator();

const Root = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const didConsume = useRef(false);

    const reduxState = useSelector(({auth, global}) => {
        return {
            currentScreen: global.currentScreen,
            isDashboardReady: global.isDashboardReady,
            toggleBiometricModalIsOpen: auth.toggleBiometricModalIsOpen,
            preserveNotification: global.preserveNotification,
        }
    });

    const {currentScreen} = reduxState;

    const getAndCheck = async (res) => {
        if(!res?.includes('PIN')){
            dispatch(setCurrentScreen("SET_PIN"))
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

    useEffect(() => {
        // let currentScreenNameToRef = navigationRef?.getCurrentRoute()?.name?.toUpperCase();
        // let screenName = props?.route?.name?.toUpperCase() || '';
        let hasPreserveNotification = !!reduxState?.preserveNotification;
        let hasNotOpenBiometricModal =  !reduxState?.toggleBiometricModalIsOpen;
        let isDashboardReady = reduxState?.isDashboardReady
        if(hasPreserveNotification && hasNotOpenBiometricModal && isDashboardReady && currentScreen !== "SET_PIN"){
            if (didConsume.current) return;
            didConsume.current = true;
            setTimeout(() => {
                let notification = {...reduxState?.preserveNotification};
                if(notification?.data?.actions === 'APPROVAL') {
                    navigation.navigate('Notifications', {
                        screen: 'notificationsApproval',
                        initial: false,
                        params: {...notification, isRest: true}
                    })
                } else if(notification?.data?.actions === 'ROUTE') {
                    navigation.navigate(notification?.routeName, notification?.data?.otherOptions)
                }
            }, 1000)
            dispatch(preserveNotificationFunc(null))
            didConsume.current = false;
        }
    }, [reduxState?.toggleBiometricModalIsOpen, reduxState?.isDashboardReady, reduxState?.preserveNotification]);

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
