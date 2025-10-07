import axios from "axios";
import { Platform, Alert, PermissionsAndroid, Linking, I18nManager, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { USER_BIO_KEY } from './asyncStorage/Constants';
import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Communications from 'react-native-communications';
import ReactNativeBiometrics from "react-native-biometrics";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import DeviceInfo from "react-native-device-info";
import { login } from "../store/actions/Auth.action";
import { CText } from "../uiComponents";
import { themes } from "../theme/colors";
import PNF, { PhoneNumberUtil } from 'google-libphonenumber';
import { phoneNumber, whatsAppNumber } from "./intercepter";
import moment from "moment";
import i18n from 'i18next';
import { _setDataToAsyncStorage, getValueIntoAsyncStorage } from "./asyncStorage/Functions";
import _ from "lodash";
import { RNFetchBlob } from "rn-fetch-blob";
import Styles from "../pages/auth/Auth.style";
import KampayIcons from "../assets/icons/KamelPayIcon";

export const get = (url) => {
    return axios.get(url)
};

export const post = (url, data, config) => {
    return axios.post(url, data, config)
};
export const put = (url, data) => {
    return axios.put(url, data)
};

export const encodeQueryData = (data) => {
    const ret = [];
    for (const d in data) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return ret.join('&');
};

export const handleCommon = (type, title = '', description = '', otherOptions) => {
    Toast.show({
        type: type,
        text1: title,
        text2: description || '',
        ...otherOptions
    });
};
export const handleError = (description = '', otherOptions) => {
    Toast.show({
        type: 'error',
        text1: i18n.t('GLOBAL.ERROR'),
        text2: description || 'Something went wrong!',
        topOffset: Platform.OS === 'ios' ? 55 : 40,
        ...otherOptions
    });
};
export const handleSuccess = (message = '', defaultDescription = '', otherOptions) => {
    Toast.show({
        type: 'success',
        text1: i18n.t('GLOBAL.SUCCESSFULLY'),
        text2: message || '',
        topOffset: Platform.OS === 'ios' ? 55 : 40,
        ...otherOptions
    });
};

export const generateFileObject = (file) => {
    const filename = file?.fileName || file.uri.replace(/^.*[\\\/]/, '');
    return {
        uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
        type: file?.type,
        name: filename,
    };
};

export const truncateAmount = (val = 0) => {
    return Math.floor(val * 100) / 100
};

export const FormatNumberWithCommas = ({ value = 0, currency = 'AED', styleAmount, styleCurrency, numberOfLines, fractionDigits = 2, showInStart = false, truncatedValue = 0 }) => {
    let prefix = <CText style={styleCurrency ? styleCurrency : styleAmount}> {currency} </CText>;
    return <CText style={styleAmount} numberOfLines={numberOfLines}>
        {showInStart ? prefix : null}
        {truncatedValue ? truncateAmount(truncatedValue) : value ? Number(value).toFixed(fractionDigits).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0}
        {showInStart ? null : prefix}
    </CText>
};

export const formatAmount = (value, currency = '', fractionDigits = 2, truncatedValue = false) => {
    if (value) {
        let formattedValue = truncatedValue ? truncateAmount(value) : Number(value).toFixed(fractionDigits).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return currency ? `${formattedValue} ${currency}` : formattedValue
    } else {
        return 0
    }
};

export const FormatNumberWithCommas2 = ({ value = 0, currency = 'AED', containerStyle = {}, styleAmount, styleCurrency, numberOfLines }) => {
    return <CText style={styleAmount} numberOfLines={numberOfLines}>
        {value ? Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0}
    </CText>
};

export const formatter = (value, currency = 'AED') => {
    const val = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    });

    return val.format(value)
};

export const numberWithToFix = (val, toFixed = 2) => {
    if (!val && val !== 0) return ''; // Null ya undefined ke liye empty string return karein

    // Handle special characters or invalid numbers
    if (isNaN(val)) {
        return ''; // Return 0 for invalid or dot inputs
    }

    const num = Number(val); // Value ko number mein convert karein

    if (num % 1 === 0) {
        // Agar integer hai, directly integer return karein
        return num.toString();
    } else {
        // Agar decimal part significant hai, to poora show karein
        const fixed = num.toFixed(toFixed);
        return fixed
        // return fixed.replace(/\.?0+$/, ''); // Trailing zeros aur unnecessary dot remove karein
    }
};

export const comingSoonAlert = (obj) => {
    Alert.alert(
        obj.title || '',
        obj.msg || '',
        [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
    );
};

export const MappedElement = ({ data, renderElement, empty }) => {
    if (data && data.length) {
        return data.map((obj, index, array) => renderElement(obj, index, array));
    }
    return empty ? empty() : null;
};

export const splitString = (value, idx) => value.split(new RegExp(`(?<=^.{${idx}})`));

export const generateArrayOfString = (array, key = '_id') => {
    let ids = [];
    if (array && array.length) {
        array.forEach(obj => ids.push(obj[key]))
    }
    return ids
};

export const onChangeEmiratesId = (key, val, set) => {
    let v = val.replace(/(\d{3})(\d{4})(\d{7})(\d{1})/, "$1-$2-$3-$4")
    set(key, v)
    // set(key, val)
};
export const onChangePhoneNumber = (key, val, set) => {
    set(key, val.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3"))
    // set(key, val)
};

export const convertToSlug = (Text, sep = '_') => {
    return Text ? Text.toLowerCase()
        .replace(/ /g, sep)
        .replace(/[^\w-]+/g, '') : '';
};
export const iconConvertToSlug = (Text) => {
    return Text ? Text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '') : '';
};

export const useStatusBar = (style, animated = true) => {
    useFocusEffect(
        useCallback(() => {
            if (Platform.OS === 'android') {
                let b = style === 'light-content' ? '#000080' : 'white';
                StatusBar.setBackgroundColor(b, animated);
                StatusBar.setBarStyle(style, animated);
            } else {
                StatusBar.setBarStyle(style, animated);
            }
        }, [])
    );
};

export const openDialScreen = () => {
    const phone = String(phoneNumber).replace(/[^\d+]/g, '');
    if (!phone) {
        Alert.alert('Invalid number');
        return;
    }

    const url = `tel:${phone}`;

    Linking.canOpenURL(url)
        .then(supported => {
            return Linking.openURL(url);
        })
        .catch(err => console.log('Dial error:', err));
};

export const applyMask = (value, mask) => {
    let i = 0;
    return mask
        .map((m) => {
            if (typeof m === 'string') return m;
            const char = value[i];
            if (!char) return '';
            if (m.test(char)) {
                i++;
                return char;
            }
            return '';
        })
        .join('');
}
export const masks = {
    eid: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/],
    // eid: [/\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/],
    // eid: '###-####-#######-#',
    // phone: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    phone: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
};

export const validateRegex = (regex, string) => {
    // regex.replaceAll(' ')
    const arr = [];
    if (string.length > regex.length || regex.length > string.length) {
        return false;
    } else {
        string.split("").map((str, index) => {
            if (str === '-') {
                str = str.replace(' ', /\s/)
            }
            if (regex[index].test(str) === true) {
                arr.push(true);
            } else {
                arr.push(false);
            }
        });
        let checker = (arr) => arr.every((v) => v === true);
        return checker(arr);
    }
};

export const setUpBiometricLogin = async (CB) => {
    let key = '';
    const { available } = await ReactNativeBiometrics.isSensorAvailable();
    if (available) {
        const res = await ReactNativeBiometrics.simplePrompt({ promptMessage: 'Face or fingerprint ID for NaqaD' });
        if (res?.success) {
            const { publicKey } = await ReactNativeBiometrics.createKeys('Confirm biometrics');
            key = publicKey
        } else {
            CB && CB(res)
        }
    }
    if (key) {
        await _setDataToAsyncStorage(USER_BIO_KEY, key);
    }
    return key
};

// async function hasAndroidPermission() {
//     const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
//
//     const hasPermission = await PermissionsAndroid.check(permission);
//     if (hasPermission) {
//         return true;
//     }
//
//     const status = await PermissionsAndroid.request(permission);
//     return status === 'granted';
// }

export async function hasAndroidPermission() {
    if (Number(Platform.Version) >= 33) {
        return true;
    }

    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
        return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
}

export async function savePicture(uri) {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
        console.log('run if========')
        return;
    }

    return new Promise((resolve, reject) => {
        CameraRoll.save(uri, 'photo')
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}

export function capitalizeFirstLetter(string) {
    return string?.length ? (string?.charAt(0).toUpperCase() + string.slice(1)) : '';
}

export const phoneUtil = PhoneNumberUtil.getInstance();

export const validateNumberRegex = async (country, string, { createError, path }, checkWithCode = true) => {
    try {
        if (string) {
            let code = country?.detail?.code?.replace('+', '');
            if (checkWithCode && country?.detail?.code && string?.startsWith(code)) {
                return createError({
                    path,
                    message: 'VALIDATION.PHONE.TEST',
                });
            } else if ((/^[0-9]*$/).test(string)) {
                const number = phoneUtil.parse(string, country?.cca2);

                let valid = await phoneUtil.isValidNumber(number);

                if (!valid) {
                    return createError({
                        path,
                        message: 'VALIDATION.PHONE.TEST',
                    });
                } else {
                    return true
                }
            } else {
                return createError({
                    path,
                    message: 'VALIDATION.PHONE.TEST',
                });
            }

        } else {

            return createError({
                path,
                message: 'VALIDATION.PHONE.REQUIRED',
            });

        }
    } catch (e) {
        return createError({
            path,
            message: 'VALIDATION.PHONE.TEST',
        });
    }

};

export const getBioKey = async () => {
    return await getValueIntoAsyncStorage(USER_BIO_KEY);
};

export const loginWithBiometrics = async (dispatch) => {
    let payload = {
        type: 'BIOMETRIC',
        isClient: true,
    };

    let key = await getBioKey();
    if (key) {
        const signatureResponse = await ReactNativeBiometrics.createSignature({
            promptMessage: 'Face or fingerprint ID for NaqaD',
            payload: key,
        });
        let id = await DeviceInfo.getUniqueId();
        if (id) payload.deviceId = id;
        if (signatureResponse.signature) {
            payload.password = signatureResponse.signature;
            dispatch(login(payload))
        }
    }
};

export const status = {
    'SUCCESS': {
        title: "RECEIPT.SUCCESS.TITLE",
        message: "RECEIPT.SUCCESS.MESSAGE",
        color: 'white',
        bgColor: '#42B658',
        darkBgColor: '#42B658',
        iconName: 'check'
    },
    'FAILED': {
        title: "RECEIPT.FAILED.TITLE",
        message: "RECEIPT.FAILED.MESSAGE",
        color: 'white',
        bgColor: '#EE3B35',
        darkBgColor: '#EE3B35',
        iconName: 'cross'
    },
    'IN_PROGRESS': {
        title: "RECEIPT.IN_PROGRESS.TITLE",
        message: "RECEIPT.IN_PROGRESS.MESSAGE",
        color: 'white',
        bgColor: '#F59D1E',
        darkBgColor: '#F59D1E',
        iconName: 'refresh'
    },
    'IN_PROGRESS_CANCELLATION': {
        title: "RECEIPT.IN_PROGRESS_CANCELLATION.TITLE",
        message: "RECEIPT.IN_PROGRESS_CANCELLATION.MESSAGE",
        color: 'white',
        bgColor: '#86a2c7',
        darkBgColor: '#86a2c7',
        iconName: 'refresh'
    },
    'CANCELLED': {
        title: "RECEIPT.CANCELLED.TITLE",
        message: "RECEIPT.CANCELLED.MESSAGE",
        color: 'white',
        bgColor: '#262031',
        darkBgColor: '#262031',
        iconName: 'refresh'
    }
};

export const openWhatsApp = (t) => {
    let number = whatsAppNumber;
    let text = `Hello I am NaqaD ${Platform.OS} app user I need some help`;
    let url = `whatsapp://send?text=${text}&phone=${number}`;
    Linking.openURL(url)
        .then(data => {
            console.log("WhatsApp Opened successfully " + data);
        })
        .catch(() => {
            alert(t("GLOBAL.WHATS_APP_ALERT"));
        });
};

export const getTimeMessage = () => {
    let day = new Date();
    let hr = day.getHours();
    let message = '';
    if (hr >= 0 && hr < 12) {
        message = "GLOBAL.GOOD_MORNING";
    } else if (hr == 12) {
        message = "GLOBAL.GOOD_AFTERNOON";
    } else if (hr >= 12 && hr <= 17) {
        message = "GLOBAL.GOOD_AFTERNOON";
    } else {
        message = "GLOBAL.GOOD_EVENING";
    }
    return message
};

export const getFullName = (user) => {
    return user?.companyName || user?.fullName || 'Naqad';
};

export const splitFullName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return { firstName: '', lastName: '' }; // Handle invalid input

    const nameParts = fullName.trim().split(' '); // Split by space and remove extra spaces
    const firstName = nameParts[0] || ''; // First word as First Name
    const lastName = nameParts.slice(1).join(' ') || ''; // Remaining words as Last Name

    return { firstName, lastName };
};

export const generateFullName = (data) => {
    return `${data?.firstName}${data?.middleName ? ` ${data?.middleName}` : ''}${data?.lastName ? ` ${data?.lastName}` : ''}`;
};

export const getPhone = (user) => {
    return `+${user?.phone}` || '';
};

export const getLayoutDirection = () => {
    return I18nManager?.isRTL || false;
};


export const cards = [
    {
        code: '35',
        type: 'PayD',
        backgroundColor: themes['light'].colors.secondary,
        overlayBackgroundColor: themes['light'].colors.secondary,
        cardVector: require('../assets/images/payD-card-vector.png')
    },
    {
        code: '36',
        type: 'CentiV',
        backgroundColor: themes['light'].colors.dark,
        overlayBackgroundColor: themes['light'].colors.dark2,
        cardVector: require('../assets/images/centive-card-vector.png')
    }
];

export const foundProduct = (code) => {
    if (code) {
        return cards.find(o => code.toString().startsWith(o.code))
    }
    return cards[0]
};
export const checkCentiV = (card, matchType = 'NOT_EQUAL', cardType = 'CENTIV') => {
    let cardObj = card && Object.keys(card)?.length;
    if (matchType === 'EQUAL') {
        return cardObj && card.cardType === cardType;
    } else if (matchType === 'NOT_EQUAL') {
        return cardObj && card.cardType !== cardType;
    }
};

export const getCloser = (value, checkOne, checkTwo) => Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;
export const nameFirstLetter = (value) => {
    return value.length ? value.charAt(0).toUpperCase() : ''
};

export const arrangeDataWithName = (data, keyName = 'name') => {
    return data?.length ? data.sort((a, b) => a[keyName].localeCompare(b[keyName])) : [];
};

export const setHours = (d, where) => {
    if (where === 'from') {
        return moment(d).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    } else {
        return moment(d).set({ hour: 23, minute: 59, second: 59, millisecond: 59 })
    }
};

export const percentage = (total, remaining) => {
    let p = (100 * remaining) / total;
    return Math.round(p);
};

function getPrevMonthWithMoment(date, days) {
    return moment(date).subtract(1, 'months').add(days, 'days')
}
function getNextMonthWithMoment(date, months = 1, days) {
    return moment(date).add(months, 'months').add(days, 'days')
}
function dateCheck(from, to, check) {

    let fDate, lDate, cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if ((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}
function timeDifference(date1, date2) {
    let oneDay = 24 * 60 * 60; // hours*minutes*seconds
    let oneHour = 60 * 60; // minutes*seconds
    let oneMinute = 60; // 60 seconds
    let firstDate = date1.getTime(); // convert to milliseconds
    let secondDate = date2.getTime(); // convert to milliseconds
    let seconds = Math.round(Math.abs(firstDate - secondDate) / 1000); //calculate the diffrence in seconds
    // the difference object
    let difference = {
        "days": 0,
        "hours": 0,
        "minutes": 0,
        "seconds": 0,
    }
    //calculate all the days and substract it from the total
    while (seconds >= oneDay) {
        difference.days++;
        seconds -= oneDay;
    }
    //calculate all the remaining hours then substract it from the total
    while (seconds >= oneHour) {
        difference.hours++;
        seconds -= oneHour;
    }
    //calculate all the remaining minutes then substract it from the total
    while (seconds >= oneMinute) {
        difference.minutes++;
        seconds -= oneMinute;
    }
    //the remaining seconds :
    difference.seconds = seconds;
    //return the difference object
    return difference;
}

export const isShowUpdateOrBlockAppEmiratesIdAlert = (date) => {

    let expiryMonth = new Date(date);
    expiryMonth.setHours(0);
    expiryMonth.setMinutes(0);
    expiryMonth.setSeconds(0);
    expiryMonth.setMilliseconds(0);

    let currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    let prevMonth = new Date(getPrevMonthWithMoment(expiryMonth));
    prevMonth.setHours(0);
    prevMonth.setMinutes(0);
    prevMonth.setSeconds(0);
    prevMonth.setMilliseconds(0);

    let nextMonth = new Date(getNextMonthWithMoment(expiryMonth));
    nextMonth.setHours(0);
    nextMonth.setMinutes(0);
    nextMonth.setSeconds(0);
    nextMonth.setMilliseconds(0);

    let next3Months = new Date(getNextMonthWithMoment(expiryMonth, 3));
    next3Months.setHours(0);
    next3Months.setMinutes(0);
    next3Months.setSeconds(0);
    next3Months.setMilliseconds(0);

    // console.log('===================================', '===================================')
    // console.log('===================================', next3Months, date, '===================================')
    // console.log('currentDate >= next3Months', currentDate >= next3Months)
    // console.log('===================================', '===================================')

    return {
        showPopup: dateCheck(prevMonth, nextMonth, currentDate) && timeDifference(nextMonth, currentDate).days > 0,
        appBlock: currentDate >= nextMonth,
        cardManagementBlock: currentDate >= next3Months,
        hasExpire: currentDate >= expiryMonth,
        afterExpiryDaysRemaining: timeDifference(nextMonth, currentDate).days
    };
};

const distance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
};

export const calculateKM = (vendorLocation, currentLocation) => {
    let totalKM = 0;
    if (currentLocation) {
        let u = vendorLocation.split(',');
        totalKM = distance(u[0], u[1], currentLocation?.latitude, currentLocation?.longitude, 'K');
        // totalKM = distance(u[0], u[1], 25.1795867, 55.2772743, 'K');
    }
    return Number(totalKM).toFixed(2)
};

export const SEND_OTP_TOPICS = [
    'TRANSACTION_PURPOSE',
    'CARD_ACTIVATION',
    'CARD_PIN_CHANGE',
    'ACCOUNT_CREATION',
    'FORGET_PASSWORD',
    'UPDATE_MOBILE_NUMBER'
]

export const getEligibleAdvanceAmount = (advanceSalary) => {
    if (advanceSalary?.eligibleAdvanceAmount) {
        return Number(advanceSalary?.eligibleAdvanceAmount)
    } else {
        return 0
    }
};
export const getValidation = (advanceSalary, t) => {
    let min = 0, minMessage = '', max = 0, maxMessage = '';
    if (advanceSalary?.feesBrackets?.length) {
        min = Math.min(...advanceSalary?.feesBrackets.map(item => item?.fromAmount || 0));
        max = getEligibleAdvanceAmount(advanceSalary);
        if (min === 0) {
            min = 100
        }
    }
    minMessage = `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${min}`;
    maxMessage = `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.NOT_MORE_THAN')} ${max}`;

    return { min, minMessage, max, maxMessage }
};
export const getAdvanceFees = (feesBracket, amount) => {
    if (feesBracket?.length) {
        return feesBracket.find((obj) => {
            if (amount >= obj?.fromAmount && amount <= obj?.toAmount) {
                return obj
            }
        })
    }
};

export const getEligiblePersonalLoanAmount = (obj) => {
    if (obj?.amount) {
        return Number(obj?.amount)
    } else {
        return 0
    }
};
export const getValidationForPersonalLoan = (obj, t) => {
    let min = 0, minMessage = '', max = 0, maxMessage = '';
    if (obj?.feeBrackets?.length) {
        min = Math.min(...obj?.feeBrackets.map(item => item?.FromAmount || 0));
        max = getEligiblePersonalLoanAmount(obj);
        if (min === 0) {
            min = 100
        }
    }
    minMessage = `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${min}`;
    maxMessage = `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.NOT_MORE_THAN')} ${max}`;
    return { min, minMessage, max, maxMessage }
};
export const getPersonalLoanFees = (feesBracket, amount, fromKey = 'FromAmount', toKey = 'ToAmount') => {
    if (feesBracket?.length) {
        return feesBracket.find((obj) => {
            if (amount >= obj[fromKey] && amount <= obj[toKey]) {
                return obj
            }
        })
    }
};

export const getPBnplFees = (feesBracket, amount, fromKey = 'FromAmount', toKey = 'ToAmount') => {
    if (feesBracket?.length) {
        return feesBracket.find((obj) => {
            if (amount >= obj[fromKey] && amount <= obj[toKey]) {
                return obj
            }
        })
    }
};

// for employer app
export const EMPLOYER_KYC = {
    INITIAL_UNVERIFIED: "INITIAL_UNVERIFIED",
    INITIAL_VERIFICATION_APPROVED: "INITIAL_VERIFICATION_APPROVED",
    ON_BOARD_REQUEST: "ON_BOARD_REQUEST",
    ON_BOARD_REQUEST_APPROVED: "ON_BOARD_REQUEST_APPROVED",
    ON_BOARD_REQUEST_REJECT: "ON_BOARD_REQUEST_REJECT",
};

export const EMPLOYER_STATUS = {
    'APPROVED': {
        key: "APPROVED",
        text: "Approved",
        employeeStatus: "Active",
        employeeStatusColor: "#42B658",
        color: 'white',
        bgColor: '#42B658',
        darkBgColor: '#42B658',
        lightBgColor: 'rgba(97, 200, 119, 0.15)',
    },
    'REJECTED': {
        key: "REJECTED",
        text: "Rejected",
        color: 'white',
        employeeStatus: "In-Active",
        employeeStatusColor: "#EE3B35",
        bgColor: '#EE3B35',
        darkBgColor: '#EE3B35',
        lightBgColor: 'rgba(255, 97, 87, 0.15)',
    },
    'PENDING': {
        key: "PENDING",
        text: "Pending",
        subText: "Pending At Your End",
        color: 'white',
        employeeStatus: "In-Active",
        employeeStatusColor: "#EE3B35",
        bgColor: '#F59D1E',
        darkBgColor: '#F59D1E',
        lightBgColor: 'rgba(245, 157, 30, 0.15)',
    }
};

export const EMPLOYER_EMPLOYEE_TYPES = [
    { _id: "KAMELPAY", name: "Kamel Pay" },
    { _id: "OTHER_BANK", name: "Other Bank" },
];

export const INITIALS = [
    { _id: "MR", name: "MR" },
    { _id: "MS", name: "MS" },
];

export const GENDER = [
    { _id: "M", name: "Male" },
    { _id: "F", name: "Female" },
];

export const NATIONALITY = [
    { _id: "AF", name: "Afghanistan" },
    { _id: "AX", name: "Aland Islands" },
    { _id: "AL", name: "Albania" },
    { _id: "DZ", name: "Algeria" },
    { _id: "AS", name: "American Samoa" },
    { _id: "AD", name: "Andorra" },
    { _id: "AO", name: "Angola" },
    { _id: "AI", name: "Anguilla" },
    { _id: "AQ", name: "Antarctica" },
    { _id: "AG", name: "Antigua And Barbuda" },
    { _id: "AR", name: "Argentina" },
    { _id: "AM", name: "Armenia" },
    { _id: "AW", name: "Aruba" },
    { _id: "AU", name: "Australia" },
    { _id: "AT", name: "Austria" },
    { _id: "AZ", name: "Azerbaijan" },
    { _id: "BS", name: "Bahamas" },
    { _id: "BH", name: "Bahrain" },
    { _id: "BD", name: "Bangladesh" },
    { _id: "BB", name: "Barbados" },
    { _id: "BY", name: "Belarus" },
    { _id: "BE", name: "Belgium" },
    { _id: "BZ", name: "Belize" },
    { _id: "BJ", name: "Benin" },
    { _id: "BM", name: "Bermuda" },
    { _id: "BT", name: "Bhutan" },
    { _id: "BO", name: "Bolivia" },
    { _id: "BQ", name: "Caribbean Netherland" },
    { _id: "BA", name: "Bosnia - Herzegovina" },
    { _id: "BW", name: "Botswana" },
    { _id: "BV", name: "Bouvet Island" },
    { _id: "BR", name: "Brazil" },
    { _id: "IO", name: "British Indian Ocean" },
    { _id: "VG", name: "US Virgin Islands" },
    { _id: "BN", name: "Brunei Darussalam " },
    { _id: "BG", name: "Bulgaria" },
    { _id: "BF", name: "Burkina Faso" },
    { _id: "BI", name: "Burundi" },
    { _id: "KH", name: "Cambodia" },
    { _id: "CM", name: "Cameroon" },
    { _id: "CA", name: "Canada" },
    { _id: "CV", name: "Cape Verde" },
    { _id: "KH", name: "Cayman Islands" },
    { _id: "CF", name: "Central African" },
    { _id: "TD", name: "Chad" },
    { _id: "CL", name: "Chile" },
    { _id: "CX", name: "Christmas Islands" },
    { _id: "CC", name: "Cocos Islands" },
    { _id: "CO", name: "Columbia" },
    { _id: "KM", name: "Comoro Islands" },
    { _id: "CG", name: "Congo" },
    { _id: "CD", name: "Congo - Kinshasa" },
    { _id: "CK", name: "Cook Islands" },
    { _id: "CR", name: "Costa Rica" },
    { _id: "CI", name: "Cote D'Ivore" },
    { _id: "XP", name: "Country XPD & XPT" },
    { _id: "HR", name: "Croatia" },
    { _id: "CU", name: "Cuba" },
    { _id: "CW", name: "Curacao" },
    { _id: "CY", name: "Cyprus" },
    { _id: "CZ", name: "Czech Republic" },
    { _id: "DK", name: "Denmark" },
    { _id: "DJ", name: "Djibouti" },
    { _id: "DM", name: "Dominica" },
    { _id: "DO", name: "Dominican Republic" },
    { _id: "TP", name: "East Timor" },
    { _id: "EC", name: "Ecuador" },
    { _id: "EG", name: "Egypt" },
    { _id: "SV", name: "El Salvador" },
    { _id: "GQ", name: "Equatorial Guinea" },
    { _id: "ER", name: "Eritrea" },
    { _id: "EE", name: "Estonia" },
    { _id: "ET", name: "Ethiopia" },
    { _id: "XE", name: "Europa" },
    { _id: "EU", name: "European In Country" },
    { _id: "FK", name: "Falkland Islands" },
    { _id: "FO", name: "Faroe Islands" },
    { _id: "FJ", name: "Fiji" },
    { _id: "FI", name: "Finland" },
    { _id: "FR", name: "France" },
    { _id: "GF", name: "French Guiana" },
    { _id: "PF", name: "French Polynesia" },
    { _id: "TF", name: "French Southern Ter" },
    { _id: "GA", name: "Gabon" },
    { _id: "GM", name: "Gambia" },
    { _id: "GE", name: "Georgia" },
    { _id: "DE", name: "Germany" },
    { _id: "GH", name: "Ghana" },
    { _id: "GI", name: "Gibraltar" },
    { _id: "GR", name: "Greece" },
    { _id: "GL", name: "Greenland" },
    { _id: "GD", name: "Grenada" },
    { _id: "GP", name: "Guadeloupe" },
    { _id: "GU", name: "Guam" },
    { _id: "GT", name: "Guatemala" },
    { _id: "GG", name: "Guernsey Minor Ch" },
    { _id: "GN", name: "Guinea" },
    { _id: "GW", name: "Guinea-Bissau" },
    { _id: "GY", name: "Guyana" },
    { _id: "HT", name: "Haiti" },
    { _id: "HM", name: "Heard Island" },
    { _id: "VA", name: "Holy See" },
    { _id: "HN", name: "Honduras" },
    { _id: "HK", name: "Hong Kong" },
    { _id: "HU", name: "Hungary" },
    { _id: "IS", name: "Iceland" },
    { _id: "IN", name: "India" },
    { _id: "ID", name: "Indonesia" },
    { _id: "IR", name: "Iran" },
    { _id: "IQ", name: "Iraq" },
    { _id: "IE", name: "Ireland" },
    { _id: "IM", name: "Isle of Man" },
    { _id: "IL", name: "Israel" },
    { _id: "IT", name: "Italy" },
    { _id: "JM", name: "Jamaica" },
    { _id: "JP", name: "Japan" },
    { _id: "JE", name: "Jersey" },
    { _id: "JO", name: "Jordan" },
    { _id: "KZ", name: "Kazakstan" },
    { _id: "KE", name: "Kenya" },
    { _id: "KI", name: "Kiribati" },
    { _id: "KP", name: "North Korea" },
    { _id: "KR", name: "South Korea" },
    { _id: "KW", name: "Kuwait" },
    { _id: "KG", name: "Kyrgyzstan" },
    { _id: "LA", name: "Laos" },
    { _id: "LV", name: "Latvia" },
    { _id: "LB", name: "Lebanon" },
    { _id: "LS", name: "Lesotho" },
    { _id: "LR", name: "Liberia" },
    { _id: "LY", name: "Libya " },
    { _id: "LI", name: "Liechtenstein" },
    { _id: "LT", name: "Lithuania" },
    { _id: "LU", name: "Luxembourg" },
    { _id: "MO", name: "Macau" },
    { _id: "MK", name: "Macedonia" },
    { _id: "MG", name: "Madagascar" },
    { _id: "MW", name: "Malawi" },
    { _id: "MY", name: "Malaysia" },
    { _id: "MV", name: "Maldives" },
    { _id: "ML", name: "Mali" },
    { _id: "MT", name: "Malta" },
    { _id: "MH", name: "Marshall Island" },
    { _id: "MQ", name: "Martinique" },
    { _id: "MR", name: "Mauritania" },
    { _id: "MU", name: "Mauritius" },
    { _id: "YT", name: "Mayotte" },
    { _id: "MX", name: "Mexico" },
    { _id: "FM", name: "Micronesia " },
    { _id: "MD", name: "Moldova, Republic of" },
    { _id: "MC", name: "Monaco" },
    { _id: "MN", name: "Mongolia" },
    { _id: "MS", name: "Monserrat" },
    { _id: "ME", name: "Montenegro" },
    { _id: "MA", name: "Morocco" },
    { _id: "MZ", name: "Mozambique" },
    { _id: "MM", name: "Myanmar" },
    { _id: "NA", name: "Namibia" },
    { _id: "NR", name: "Nauru" },
    { _id: "NP", name: "Nepal" },
    { _id: "NL", name: "Netherlands" },
    { _id: "AN", name: "Netherlands Antilles" },
    { _id: "NC", name: "New Caledonia" },
    { _id: "NZ", name: "New Zealand" },
    { _id: "NI", name: "Nicaragua" },
    { _id: "NE", name: "Niger" },
    { _id: "NG", name: "Nigeria" },
    { _id: "NU", name: "Niue" },
    { _id: "NF", name: "Norfolk Island" },
    { _id: "MP", name: "Mariana Islands" },
    { _id: "NO", name: "Norway" },
    { _id: "OM", name: "Oman" },
    { _id: "PK", name: "Pakistan" },
    { _id: "PW", name: "Palau" },
    { _id: "PS", name: "Palestine" },
    { _id: "PA", name: "Panama" },
    { _id: "PG", name: "Papua New Guinea" },
    { _id: "PY", name: "Paraguay" },
    { _id: "CN", name: "Rep of China" },
    { _id: "PE", name: "Peru" },
    { _id: "PH", name: "Philippines" },
    { _id: "PN", name: "Pitcairn" },
    { _id: "PI", name: "PLATINUM" },
    { _id: "PL", name: "Poland" },
    { _id: "PT", name: "Portugal" },
    { _id: "PR", name: "Puerto Rico" },
    { _id: "QA", name: "Qatar" },
    { _id: "TW", name: "Rep of China(Taiwan)" },
    { _id: "RE", name: "Reunion" },
    { _id: "RO", name: "Romania" },
    { _id: "RU", name: "Russian Federation" },
    { _id: "RW", name: "Rwanda" },
    { _id: "BL", name: "Saint Barthelemy" },
    { _id: "KN", name: "Saint Kitts Nevis" },
    { _id: "LC", name: "Saint Lucia" },
    { _id: "SX", name: "Saint Maarten(Dutch)" },
    { _id: "MF", name: "Saint Martin(French)" },
    { _id: "WS", name: "Samoa" },
    { _id: "SM", name: "San Marino" },
    { _id: "ST", name: "Sao Tome Principe" },
    { _id: "SA", name: "Saudi Arabia" },
    { _id: "SN", name: "Senegal" },
    { _id: "RS", name: "Serbia, Republic of" },
    { _id: "SC", name: "Seychelles" },
    { _id: "SL", name: "Sierra Leone" },
    { _id: "XS", name: "Silver" },
    { _id: "SS", name: "SILVER" },
    { _id: "SG", name: "Singapore" },
    { _id: "SK", name: "Slovakia" },
    { _id: "SI", name: "Slovenia" },
    { _id: "SB", name: "Solomon Islands" },
    { _id: "SO", name: "Somalia" },
    { _id: "ZA", name: "South Africa" },
    { _id: "GS", name: "South Georgia " },
    { _id: "ES", name: "Spain" },
    { _id: "LK", name: "Sri Lanka" },
    { _id: "SH", name: "St. Helena" },
    { _id: "PM", name: "St Pierre & Miquelon" },
    { _id: "VC", name: "St Vincent Grenadine" },
    { _id: "QQ", name: "Stateless" },
    { _id: "SP", name: "Stateless Persons" },
    { _id: "SD", name: "Sudan" },
    { _id: "SR", name: "Suriname" },
    { _id: "SJ", name: "Svalbard Jan Mayen" },
    { _id: "SZ", name: "Swaziland" },
    { _id: "SE", name: "Sweden" },
    { _id: "CH", name: "Switzerland" },
    { _id: "SY", name: "Syrian Arab Republic" },
    { _id: "TJ", name: "Tajikistan" },
    { _id: "TZ", name: "Tanzania" },
    { _id: "TH", name: "Thailand" },
    { _id: "TL", name: "Timor-Leste" },
    { _id: "TG", name: "Togo" },
    { _id: "TK", name: "Tokelau" },
    { _id: "TO", name: "Tonga" },
    { _id: "TT", name: "Trinidad and Tobago" },
    { _id: "TN", name: "Tunisia" },
    { _id: "TR", name: "Turkey" },
    { _id: "TM", name: "Turkmenistan" },
    { _id: "TC", name: "Turks and Caicos " },
    { _id: "TV", name: "Tuvalu" },
    { _id: "UG", name: "Uganda" },
    { _id: "UA", name: "Ukraine" },
    { _id: "AE", name: "United Arab Emirates" },
    { _id: "GB", name: "United Kingdom of GB and NI" },
    { _id: "UM", name: "United StatesMinor" },
    { _id: "US", name: "United States" },
    { _id: "UY", name: "Uruguay" },
    { _id: "YU", name: "USE RS(SERBIA)" },
    { _id: "UZ", name: "Uzbekistan" },
    { _id: "VU", name: "Vanuatu" },
    { _id: "VE", name: "Venezuela" },
    { _id: "VN", name: "Vietnam" },
    { _id: "VI", name: "Virgin Islands, U.S." },
    { _id: "WF", name: "Wallis et Futuna" },
    { _id: "EH", name: "Western Sahara" },
    { _id: "XX", name: "Worldwide" },
    { _id: "YE", name: "Yemen" },
    { _id: "ZM", name: "Zambia" },
    { _id: "ZW", name: "Zimbabwe" },
];

export const TOPIC = {
    CLIENT_PROFILE_UPDATE: "CLIENT_PROFILE_UPDATE",
    INITIAL_VERIFICATION_APPROVED: "INITIAL_VERIFICATION_APPROVED",
    ON_BOARD_REQUEST: "ON_BOARD_REQUEST",
    ON_BOARD_REQUEST_APPROVED: "ON_BOARD_REQUEST_APPROVED",
    ON_BOARD_REQUEST_REJECT: "ON_BOARD_REQUEST_REJECT",
    EMPLOYEES_FILE_UPLOAD: "EMPLOYEES_FILE_UPLOAD",
    EMPLOYEES_OTHER_BANK_FILE_UPLOAD: "EMPLOYEES_OTHER_BANK_FILE_UPLOAD",
    EMPLOYEE_ONBOARD_REQUEST: "EMPLOYEE_ONBOARD_REQUEST",
    EMPLOYEE_ONBOARD_APPROVED: "EMPLOYEE_ONBOARD_APPROVED",
    EMPLOYEE_ONBOARD_REJECT: "EMPLOYEE_ONBOARD_REJECT",
    EMPLOYEE_UPDATE_REQUEST: "EMPLOYEE_UPDATE_REQUEST",
    SALARY_FILE_UPLOAD: "SALARY_FILE_UPLOAD",
    DEPOSIT_FILE_UPLOAD: "DEPOSIT_FILE_UPLOAD",
    CENTIV_CARD_REQUEST: "CENTIV_CARD_REQUEST",
    CARD_REPLACEMENT_REQUEST: "CARD_REPLACEMENT_REQUEST",
    EMPLOYEE_APPLICATION_BLOCK_REQUEST: "EMPLOYEE_APPLICATION_BLOCK_REQUEST",
    EMPLOYEE_APPLICATION_UN_BLOCK_REQUEST: "EMPLOYEE_APPLICATION_UN_BLOCK_REQUEST",
    USER_BLOCK_REQUEST: "USER_BLOCK_REQUEST",
    CHANGE_EMPLOYEE_TYPE: "CHANGE_EMPLOYEE_TYPE",
    USER_UNBLOCK_REQUEST: "USER_UNBLOCK_REQUEST",
    ESTABLISHMENT_IDS_ADDED: "ESTABLISHMENT_IDS_ADDED",
    UPDATE_MOL_NO: "UPDATE_MOL_NO",
    ESTABLISHMENT_ID_ADDED: "ESTABLISHMENT_ID_ADDED",
    CENTIV_LOAD_FUNDS: "CENTIV_LOAD_FUNDS",
    EMPLOYEE_EID_UPDATE: "EMPLOYEE_EID_UPDATE",
    EMPLOYEE_PHONE_UPDATE: "EMPLOYEE_PHONE_UPDATE",
    CARD_PIN_CHANGE: "CARD_PIN_CHANGE",
    EOS_FILE_UPLOAD: 'EOS_FILE_UPLOAD',
    //Exchange house
    EXCHANGE_HOUSE_BRANCH_ONBOARD_REQUEST: 'EXCHANGE_HOUSE_BRANCH_ONBOARD_REQUEST'
};
export const approvalStatusArray = (topic) => {
    return topic === TOPIC.ON_BOARD_REQUEST || topic === TOPIC.EXCHANGE_HOUSE_BRANCH_ONBOARD_REQUEST ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Documents Checked" },
        { _id: "", title: "Approved By Admin" },
        { _id: "", title: "Compliance Passed" },
        { _id: "APPROVED_BY_ADMIN", title: "Onboarded" },
    ] : topic === TOPIC.ESTABLISHMENT_IDS_ADDED ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "APPROVED_BY_ADMIN", title: "Processed" },
    ] : topic === TOPIC.UPDATE_MOL_NO ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "APPROVED_BY_ADMIN", title: "Processed" },
    ] : topic === TOPIC.EMPLOYEE_PHONE_UPDATE || topic === TOPIC.EMPLOYEE_EID_UPDATE ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "APPROVED_BY_ADMIN", title: "Processed" },
    ] : topic === TOPIC.CHANGE_EMPLOYEE_TYPE || topic === TOPIC.EMPLOYEE_APPLICATION_BLOCK_REQUEST || topic === TOPIC.EMPLOYEE_APPLICATION_UN_BLOCK_REQUEST || topic === TOPIC?.CENTIV_LOAD_FUNDS ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "APPROVED_BY_ADMIN", title: "Processed" },
    ] : topic === TOPIC.EMPLOYEE_ONBOARD_REQUEST ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "", title: "Documents Checked" },
        { _id: "", title: "Compliance Passed" },
        { _id: "", title: "Card Printed" },
        { _id: "", title: "Courier on the way" },
        { _id: "APPROVED_BY_ADMIN", title: "Card Delivered" },
    ] : topic === TOPIC.EMPLOYEES_FILE_UPLOAD ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "APPROVED_BY_ADMIN", title: "Approved By Admin" },
        { _id: "", title: "Compliance Passed" },
        { _id: "", title: "Card Printed" },
        { _id: "", title: "Courier on the way" },
        { _id: "APPROVED_BY_ADMIN", title: "Delivered" },
    ] : topic === TOPIC.CARD_REPLACEMENT_REQUEST ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "", title: "Card Permanently Blocked" },
        { _id: "", title: "Replacement Request Sent" },
        { _id: "", title: "Card Printed" },
        { _id: "", title: "Courier on the way" },
        { _id: "APPROVED_BY_ADMIN", title: "Delivered" },
    ] : topic === TOPIC.DEPOSIT_FILE_UPLOAD ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "APPROVED_BY_ADMIN", title: "Company Account Credited" },
    ] : topic === TOPIC.SALARY_FILE_UPLOAD ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "", title: "Approved By Admin" },
        { _id: "APPROVED_BY_ADMIN", title: "Salary Processed" },
    ] : topic === TOPIC.CLIENT_PROFILE_UPDATE ? [
        { _id: "APPROVED_BY_CLIENT_ADMIN", title: "Waiting For Your Approval" },
        { _id: "APPROVED_BY_CLIENT", title: "Approved By You" },
        { _id: "APPROVED_BY_ADMIN", title: "Approved By Admin" },
    ] : topic === TOPIC.EOS_FILE_UPLOAD
        ? [
            { _id: "APPROVED_BY_CLIENT", title: "Waiting For Your Approval" },
            { _id: "APPROVED_BY_ADMIN", title: "Approved By Admin" },
        ]
        : []
};

export const CARD_STATUS_ARRAY = [
    { _id: "PENDING", title: "Pending" },
    { _id: "COMPLIANCE_BANK_PASSED", title: "Compliance Bank Passed" },
    { _id: "COMPLIANCE_BANK_FAIL", title: "Compliance Bank Fail" },
    { _id: "CARD_ON_PRINTING", title: "Card On Printing" },
    { _id: "CARD_ON_PRINTED", title: "Card On Printed" },
    { _id: "DELIVERED", title: "Delivered" },
];

export const CLIENT_APPROVAL_STATUS = {
    APPROVED_BY_CLIENT_ADMIN: "APPROVED_BY_CLIENT_ADMIN",
    APPROVED_BY_CLIENT: "APPROVED_BY_CLIENT",
    REJECTED_BY_CLIENT: "REJECTED_BY_CLIENT",
    APPROVED_BY_ADMIN: "APPROVED_BY_ADMIN",
    REJECTED_BY_ADMIN: "REJECTED_BY_ADMIN",
};

export const ACTION = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
};

export function valueFormatter(value, pattern) {
    let i = 0;
    const v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

export const _readableTextCap = (text) => {
    if (text?.length) {
        let arr = text?.split("_");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = _.capitalize(arr[i]);
        }
        arr = arr?.join(" ");
        return arr;
    }
    return "";
};
export const readableText = (text) => {
    return text?.length ? _.capitalize(text)?.split("_").join(" ") : "";
};

export const generateCreatedBy = (data, user) => {
    if (data?.createdBy && Object.keys(data?.createdBy)?.length) {
        let name = data?.createdBy?.user?.name || data?.createdBy?.user?.companyName;
        let role = user?._id === data?.createdBy?.user?._id ? "You" : readableText(data?.createdBy.role);
        return user?._id === data?.createdBy?.user?._id ? "Created By You" : `${name} (${role})`
    }
    return null
};

export const renderDateAndTime = (date = undefined) => {
    return moment(date).format("DD-MMM-YYYY (hh:mm a)");
};
export const renderDate = (date = undefined) => {
    return moment(date).format("DD-MMM-YYYY");
};
export const getObjByKey = (array = [], val = "", key = "_id") => {
    return array?.length ? array?.find((obj) => obj[key] === val) : {};
};

export const getCountryByKey = (countries, value, findingKey = 'cca2') => {
    return countries?.length ? countries.find(o => o[findingKey] === value) : {};
};


export const checkPermissionAndDownloadFile = async (item) => {

    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
        downloadFile(item);
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message:
                        'Application needs access to your storage to download File',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                downloadFile(item);
                console.log('Storage Permission Granted.');
            } else {
                // If permission denied then show alert
                Alert.alert('Error', 'Storage Permission Not Granted');
            }
        } catch (err) {
            // To handle permission related exception
            console.log("++++" + err);
        }
    }
};
const downloadFile = (item) => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = item?.url;
    // Function to get extention of the file url
    let file_ext = item?.fileFormat;
    const { config, fs } = RNFetchBlob;
    let PictureDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
    let options = {
        fileCache: true,
        path: PictureDir + "/" + item?.url + '_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: PictureDir + "/" + item?.url + '_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
            description: 'File'
        }
    };
    config(options)
        .fetch('GET', FILE_URL)
        .then(res => {
            // Alert after successful downloading
            try {
                console.log('res -> ', res);
            }
            catch (e) {
                console.log('eerr', e)
            }
            // if (Platform.OS === "ios") {
            // RNFetchBlob.ios.openDocument(res.data);
            // }
            alert('File Downloaded Successfully.');
        });
};
const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
        /[^.]+$/.exec(fileUrl) : undefined;
};

export const SERVICES = {
    REMITTANCE: {
        _id: "REMITTANCE",
        route: 'Send_Money'
    },
    BILL_PAYMENT: {
        _id: "BILL_PAYMENT",
        route: 'Pay_Bill'
    },
    TOPUP: {
        _id: "TOPUP",
        route: 'Mobile_TopUp'
    },
    LOTTERY: {
        _id: "LOTTERY",
        route: 'Lottery'
    },
    ADVANCE_SALARY: {
        _id: "ADVANCE_SALARY",
        route: 'Advance_Salary'
    },
    ADVANCE_REMITTANCE: {
        _id: "ADVANCE_REMITTANCE",
        route: 'Snpl'
    },
    BNPL: {
        _id: "BNPL",
        route: 'BNPL'
    },
    ECOMMERCE: {
        _id: "ECOMMERCE",
        route: 'BNPL'
    },
    PERSONAL_LOAN: {
        _id: "PERSONAL_LOAN",
        route: 'Personal_Loan'
    },
    EMBEDDED_FINANCE: {
        _id: "EMBEDDED_FINANCE",
        // route: 'Personal_Loan'
    },
    KP_WALLET_TRANSFER: {
        _id: "KP_WALLET_TRANSFER",
        route: 'KP_Wallet_Transfer'
    }
};

export const STATES = [
    {
        label: "Abu Dhabi",
        value: "Abu Dhabi",
    },
    {
        label: "Ajman",
        value: "Ajman"
    },
    {
        label: "Dubai",
        value: "Dubai",
    },
    {
        label: "Fujairah",
        value: "Fujairah",
    },
    {
        label: "Ras Al Khaimah",
        value: "Ras Al Khaimah",
    },
    {
        label: "Sharjah",
        value: "Sharjah",
    },
    {
        name: "Umm Al Quwain",
        value: "Umm Al Quwain",
    }
];

export const isLightUser = (user, successCallBack, errorCallBack) => (user?.hasOwnProperty('isLightUser') && user?.isLightUser) ? successCallBack && successCallBack() : errorCallBack && errorCallBack();
export const isMinimalUser = (user, successCallBack, errorCallBack) => (user?.hasOwnProperty('isMinimalUser') && user?.isMinimalUser) ? successCallBack && successCallBack() : errorCallBack && errorCallBack();
export const checkIsDeviceRegistered = (user) => (user?.hasOwnProperty('isDeviceRegistered') && user?.isDeviceRegistered);

export const checkIsAppUserOrRegisterDevice = (user, resolvedCallBack, notResolvedCallBack) => {

    // let isDeviceRegistered = user?.hasOwnProperty('isDeviceRegistered') && user?.isDeviceRegistered;
    let isPortalUser = user?.hasOwnProperty('isPortalUser') && user?.isPortalUser?.status;
    // let isLightUser = user?.hasOwnProperty('isLightUser') && user?.isLightUser;
    // let isMinimalUser = user?.hasOwnProperty('isMinimalUser') && user?.isMinimalUser;

    if (isPortalUser) {
        return notResolvedCallBack && notResolvedCallBack({
            title: 'USER_NOT_VERIFIED.TITLE',
            subTitle: 'USER_NOT_VERIFIED.SUB_TITLE',
            type: 'IS_PORTAL_USER'
        });
    }
    else {
        return resolvedCallBack && resolvedCallBack({
            title: 'USER_NOT_VERIFIED.TITLE',
            subTitle: 'USER_NOT_VERIFIED.SUB_TITLE',
        });
    }

    // if(isDeviceRegistered) {
    //     if(isPortalUser) {
    //         return notResolvedCallBack && notResolvedCallBack({
    //             title: 'USER_NOT_VERIFIED.TITLE',
    //             subTitle: 'USER_NOT_VERIFIED.SUB_TITLE',
    //             type: 'IS_PORTAL_USER'
    //         });
    //     } else {
    //         return resolvedCallBack && resolvedCallBack({
    //             title: 'USER_NOT_VERIFIED.TITLE',
    //             subTitle: 'USER_NOT_VERIFIED.SUB_TITLE',
    //         });
    //     }
    // } else {
    //     return notResolvedCallBack && notResolvedCallBack({
    //         title: 'GLOBAL.NEW_DEVICE_DETECTED',
    //         subTitle: 'USER_NOT_VERIFIED.TITLE',
    //         ...(!isLightUser || !isMinimalUser && {
    //             thirdTitle: 'USER_NOT_VERIFIED.SUB_TITLE'
    //         }),
    //         type: 'IS_DEVICE_REGISTER'
    //     });
    // }

};

export const checkCreditPayAmountEligibility = (amount, maxAmount) => {
    let actualAmount = Number(amount);
    return actualAmount <= maxAmount
};

export const maskMiddle = (value, startVisible = 3, endVisible = 2) => {
    if (!value || value.length <= startVisible + endVisible) return value;

    const start = value.slice(0, startVisible);
    const end = value.slice(-endVisible);
    const maskedLength = value.length - (startVisible + endVisible);
    const masked = 'x'.repeat(maskedLength);

    return start + masked + end;
}

export const OTP_TOPICS = {
    WALLET_TRANSFER: "wallet transfer"
}

export function expiryStringToDate(expiry) {
    if (!/^\d{4}$/.test(expiry)) return null; // validate input format

    const year = parseInt(expiry.slice(0, 2), 10) + 2000; // "30" => 2030
    const month = parseInt(expiry.slice(2, 4), 10) - 1;   // "05" => 4 (May)

    return new Date(year, month);
}



export function generatePassword(length = 12) {
    const lower   = "abcdefghijklmnopqrstuvwxyz";
    const upper   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits  = "0123456789";
    const special = "!@#$%^&*(),.?\":{}|<>";
    const pool    = lower + upper + digits + special;

    // Same regexes as Yup validation
    const upperRe  = /[A-Z]/;
    const lowerRe  = /[a-z]/;
    const digitRe  = /\d/;
    const specialRe = /[!@#$%^&*(),.?":{}|<>]/;

    let pwd = "";

    do {
        pwd = Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join("");
    } while (
        !upperRe.test(pwd) ||
        !lowerRe.test(pwd) ||
        !digitRe.test(pwd) ||
        !specialRe.test(pwd)
    );

    return pwd;
}

// Helpers: booleans that mean "OK / rule satisfied"
const passwordChecks = (v = '') => ({
    min: v.length >= 12,
    lower: /[a-z]/.test(v),
    upper: /[A-Z]/.test(v),
    digit: /\d/.test(v),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(v),
});

export function generatePasswordTips(t, values, errors, key = 'password') {
    const value = String(values?.[key] ?? '');
    // Jab user ne kuch type kiya ho ya error aa raha ho to hi red/green dikhayen
    const showState = !!value || !!errors?.[key];

    const { min, upper, lower, digit, symbol } = passwordChecks(value);

    const Row = ({ ok, labelKey }) => (
        <View style={Styles.tipSectionItem}>
            <KampayIcons
                // OK -> success, Not OK -> error; empty -> neutral (no extra style)
                style={[
                    Styles.tipSectionItemIcon,
                    showState ? (ok ? Styles.success : Styles.error) : null,
                ]}
                name={ok ? 'correct' : 'error'}
            />
            <CText
                style={[
                    Styles.tipSectionItemText,
                    showState && !ok ? Styles.error : null,
                ]}
            >
                {t(labelKey)}
            </CText>
        </View>
    );

    return (
        <View style={Styles.tipSection}>
            <CText style={Styles.tipSectionTitle}>
                {t('GLOBAL.PASSWORD_VALIDATION_TIPS')}
            </CText>
            <CText style={Styles.tipSectionSubTitle}>
                {t('GLOBAL.PASSWORD_VALIDATION_TIPS_SUB_TITLE')}
            </CText>

            <Row ok={min} labelKey="GLOBAL.PASSWORD_VALIDATION_TIPS_ONE" />
            <Row ok={upper} labelKey="GLOBAL.PASSWORD_VALIDATION_TIPS_TWO" />
            <Row ok={lower} labelKey="GLOBAL.PASSWORD_VALIDATION_TIPS_THREE" />
            <Row ok={digit} labelKey="GLOBAL.PASSWORD_VALIDATION_TIPS_FOUR" />
            <Row ok={symbol} labelKey="GLOBAL.PASSWORD_VALIDATION_TIPS_FIVE" />
        </View>
    );
}
