import axios from "axios";
import {logout} from "../store/actions/Auth.action";
import {store} from '../store';
import {
    _setDataToAsyncStorage,
    getDeviceIdAndSet,
    getLangAndSet,
    getTokenAndSetIntoHeaders,
    otherHeaders,
    getLocationAndSetIntoHeaders
} from "./asyncStorage/Functions";
import {TOKEN} from "./asyncStorage/Constants";
// let baseUrl = 'https://kamelpay.tech:8083/api/';
// let baseUrl = 'https://sandbox-mobileapi.kamelpay.tech:8083/api/';
// let baseUrl = 'https://uat.kamilpay.com/v1/api/';
// let baseUrl = 'http://192.168.0.2:3002/v1/api/';
// let baseUrl = 'https://kamilpay.com/v1/api/';

const environment = ['', 'staging.', 'uat.'];

const currentEnvironment = environment[2]

let baseUrl = `https://${currentEnvironment}kamilpay.com/v1/api/`;
// let baseUrl = `https://b23227dec156.ngrok-free.app/v1/api/`;
// let baseUrl = `http://192.168.105.35:3001/v1/api/`;
// let baseUrl = `https://v2.kamilpay.com/v1/api/`;

// let socketUrl = `https://uat.kamilpay.com/`;
let socketUrl = baseUrl;

const iconBaseUrl = 'https://kp-statics.s3.me-south-1.amazonaws.com/billers';
const iconBilrsBaseUrl = 'https://kp-statics.s3.me-south-1.amazonaws.com/bilrs';

// export const whatsAppNumber = '+971564104207';
// let phoneNumber = '+97145623700';

let whatsAppNumber = '';
const updateKamelpayWhatsAppNumber = (phone) => {
    whatsAppNumber = phone;
};

let phoneNumber = '';
const updateKamelpayPhoneNumber = (phone) => {
    phoneNumber = phone;
};

export const updateInterceptorBaseUrl = (url) => {
    axios.defaults.baseURL = url
};

let session = ["Session expired.", "Session not found."];

const interceptor = async () => {

    updateInterceptorBaseUrl(baseUrl);
    // axios.defaults.baseURL = baseUrl;
    await getDeviceIdAndSet();
    await getLangAndSet();
    await otherHeaders();

    axios.interceptors.request.use(
        function (config) {
            return config;
        },
        function (error) {
            console.log('request error', error);
            return Promise.reject(error.response);
        }
    );
    axios.interceptors.response.use(
        function (response) {
            (async () => {

                if(store.getState().auth.isLoggedIn && response?.headers?.token) {
                    await _setDataToAsyncStorage(TOKEN, response?.headers?.token);
                    await getTokenAndSetIntoHeaders(response?.headers?.token);
                    getLocationAndSetIntoHeaders();
                }
                if (response?.data?.error && session?.includes(response?.data?.data?.message)) {
                   await store.dispatch(logout(true, 'expire', response?.data?.data?.message))
                }

            })();

            return response;
        },
        async function (error) {
            console.log('response error', error);
            return Promise.reject(error?.message ? error : error.response);
        }
    );
};

export {
    baseUrl,
    iconBaseUrl,
    iconBilrsBaseUrl,
    socketUrl,
    interceptor,
    phoneNumber,
    updateKamelpayPhoneNumber,
    whatsAppNumber,
    updateKamelpayWhatsAppNumber,
    currentEnvironment
}

