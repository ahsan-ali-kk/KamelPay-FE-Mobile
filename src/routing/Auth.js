import React, {useEffect, useState} from 'react';
import {
    Welcome,
    ELogin,
    Login,
    CardConfirmation,
    AuthOTP,
    UserCreation,
    ForgotPassword,
    ForgotPasswordEmiratesId,
    NewPassword,
    ChangePhoneNumber,
    SignupFindUser,
    SignupKyc,
    SignupLiveness,
    SignupEnterPhone,
    SignupPasswordAndTermsAndCondition
} from "../pages";
import {useDispatch} from "react-redux";
import {getAndUpdateBiometricType} from "../store/actions/Auth.action";
import {CLoading} from "../uiComponents";
import {createStackNavigator} from "@react-navigation/stack";
import {getValueIntoAsyncStorage} from "../utils/asyncStorage/Functions";
import {WELCOME_SCREEN} from "../utils/asyncStorage/Constants";

export const Stack = createStackNavigator();

function Auth() {

    const dispatch = useDispatch();

    const [initialRouteName, updateInitialRouteName] = useState(null);

    const getAndCheck = async (res) => {
        let val = await getValueIntoAsyncStorage(WELCOME_SCREEN);
        console.log('getAndCheck val', val)
        if(val === 'hide'){
            updateInitialRouteName(res.length ? 'eLogin' : 'login');
        } else {
            console.log('run else')
            updateInitialRouteName('welcome');
        }
    };

    useEffect(() => {
        dispatch(getAndUpdateBiometricType(
            async (res) => await getAndCheck(res)
        ))
    }, []);

    const renderSacks = (initialRoute) => {
        return (
            <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="welcome" component={Welcome} />
                <Stack.Screen name="login" component={Login}/>
                <Stack.Screen name="eLogin" component={ELogin} />
                <Stack.Screen name="authOTP" component={AuthOTP} />
                <Stack.Screen name="newPassword" component={NewPassword} />
                <Stack.Screen name="changePhoneNumber" component={ChangePhoneNumber} />
                <Stack.Screen name="cardConfirmation" component={CardConfirmation} />
                <Stack.Screen name="userCreation" component={UserCreation} />
                <Stack.Screen name="forgotPassword" component={ForgotPassword} />
                <Stack.Screen name="forgotPasswordEmiratesId" component={ForgotPasswordEmiratesId} />
                <Stack.Screen name="findUser" component={SignupFindUser} />
                <Stack.Screen name="kyc" component={SignupKyc} />
                <Stack.Screen name="liveness" component={SignupLiveness} />
                <Stack.Screen name="enterPhone" component={SignupEnterPhone} />
                <Stack.Screen name="passwordAndTermsAndCondition" component={SignupPasswordAndTermsAndCondition} />
            </Stack.Navigator>
        );
    };

    /** Layout */
    const Layout = (initialRouteName)=> {
        console.log('initialRouteName===', initialRouteName)
        if (initialRouteName !== null) {
            return renderSacks(initialRouteName)
        } else {
            return (
                <CLoading showAnimation={true} loading={true}/>
            );
        }
    };

    return Layout(initialRouteName);
}

export default React.memo(Auth);
