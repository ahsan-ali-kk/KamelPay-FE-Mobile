import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PinResultStatus = {
    initial: 'initial',
    success: 'success',
    failure: 'failure',
    locked: 'locked'
};

export const setPinCode = async (username, pin) => {
    // Store the credentials
    return await Keychain.setGenericPassword(username, pin);
};
export const retrievePinCode = async () => {
    try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            console.log(
                'Credentials successfully loaded for user ' ,credentials
            );
            return  credentials;

        } else {
            console.log('No credentials stored');
        }
    } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
    }
};



export const hasPinCode = async (serviceName) => {
    return await Keychain.getInternetCredentials(serviceName).then(res => {
        return !!res && !!res.password
    })
};

export const deletePinCode = async (serviceName) => {
    return await Keychain.resetInternetCredentials(serviceName)
};

export const resetInternalStates = async (asyncStorageKeys) => {
    return await AsyncStorage.multiRemove(asyncStorageKeys)
};

export const noBiometricsConfig = Platform.select({
    android: {
        accessControl: Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
    },
    ios: {}
});
