import axios from "axios";
import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LANGUAGE, TOKEN} from "./Constants";
import * as DeviceInfo from "react-native-device-info";
import {store} from "../../store";

export const removeItemIntoAsyncStorage = async (key) => {
    await AsyncStorage.removeItem(key);
};

export const _setDataToAsyncStorage = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, data);
    } catch (error) {
        console.log('error', error)
    }
};

export const getValueIntoAsyncStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value
        } else {
            return null
        }

    } catch (error) {
        // Error retrieving data
        return null
    }
};

export const getLangAndSet = async() => {
    let language = await getValueIntoAsyncStorage(LANGUAGE);
    language = JSON.parse(language);
    if(language?.name) axios.defaults.headers.common['lang'] = language?.name;
    else axios.defaults.headers.common['lang'] = 'en';
};

export const otherHeaders = async () => {
    let version = await DeviceInfo.getVersion();
    let uniqueId = await DeviceInfo.syncUniqueId();
    let systemVersion = await DeviceInfo.getSystemVersion();
    let buildNumber = await DeviceInfo.getBuildNumber();
    let deviceModel = await DeviceInfo.getModel();
    let deviceBrand = await DeviceInfo.getBrand();

    if(uniqueId) axios.defaults.headers.common['device-id'] = uniqueId;
    if(version) axios.defaults.headers.common['app-version'] = version;
    if(systemVersion) axios.defaults.headers.common['device-version'] = systemVersion;
    if(buildNumber) axios.defaults.headers.common['build-number'] = buildNumber;
    if(deviceModel) axios.defaults.headers.common['device-model'] = deviceModel;
    if(deviceBrand) axios.defaults.headers.common['device-brand'] = deviceBrand;

    axios.defaults.headers.common['os'] = Platform.OS;
};

export const getDeviceIdAndSet = async () => {
    let uniqueId = await DeviceInfo.syncUniqueId();
    if (uniqueId) {
        axios.defaults.headers.common['device-id'] = uniqueId;
    } else {
        await getDeviceIdAndSet();
    }
};

export const getLocationAndSetIntoHeaders = (lat, long) => {
    const {global} = store.getState();
    let latitude = lat ? lat : global?.currentLocation?.latitude;
    let longitude = long ? long : global?.currentLocation?.longitude;
    if(latitude && longitude) {
        axios.defaults.headers.common['coordinates'] = [latitude, longitude];
    }
};

export const getTokenAndSetIntoHeaders = async (token) => {

    // await getLangAndSet();
    // await otherHeaders();

    if (token) {
        axios.defaults.headers.common['Authorization'] = `${token}`;
    } else {
        let accessToken = await getValueIntoAsyncStorage(TOKEN);
        if (accessToken) {
            axios.defaults.headers.common['Authorization'] = `${accessToken}`;
        }
    }
};

export const removeUserDetail = async () => {
    await removeItemIntoAsyncStorage(TOKEN);
};

export const getToken = async (value) => {
    let token;

    if(value) {
        token = value
    } else {
        token = await getValueIntoAsyncStorage(TOKEN)
    }

    if (token !== null) {
        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        return token;
    } else {
        return null
    }
};

export const setLocalStorageDataIntoNewKeyAndRemoveOldKey = async (oldKey, newKey) => {
    let val = await getValueIntoAsyncStorage(oldKey);
    if(val){
        await _setDataToAsyncStorage(newKey, val);
        await removeItemIntoAsyncStorage(oldKey)
    }
};
