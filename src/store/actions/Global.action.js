import GLOBAL from "../constants/Global.constant";
import CountriesData from "../../content/country";
import {handleError, handleSuccess, post, get, encodeQueryData, hasAndroidPermission} from "../../utils/methods";
import {getUserSubscriptions} from "./UserSubscriptions.action";
import {
    getLocationAndSetIntoHeaders,
    getTokenAndSetIntoHeaders,
    getValueIntoAsyncStorage
} from "../../utils/asyncStorage/Functions";
import {TOKEN} from "../../utils/asyncStorage/Constants";
import {
    updateKamelpayPhoneNumber,
    updateKamelpayWhatsAppNumber,
} from "../../utils/intercepter";
import { Platform } from "react-native";
import { Buffer } from 'buffer';
import RNFetchBlob from "rn-fetch-blob";
import { TextDecoder } from 'text-encoding';
import Share from 'react-native-share';

let a = [
    {
        "name": "Afghanistan",
        "code": "+93",
        "iso": "AF",
        "flag": "https://www.countryflags.io/AF/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Aland Islands",
        "code": "+358",
        "iso": "AX",
        "flag": "https://www.countryflags.io/AX/flat/24.png",
        "mask": "(###)###-##-##",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]

    },
    {
        "name": "Albania",
        "code": "+355",
        "iso": "AL",
        "flag": "https://www.countryflags.io/AL/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Algeria",
        "code": "+213",
        "iso": "DZ",
        "flag": "https://www.countryflags.io/DZ/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "American Samoa",
        "code": "+1",
        "iso": "AS",
        "flag": "https://www.countryflags.io/AS/flat/24.png",
        "mask": "(684)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Andorra",
        "code": "+376",
        "iso": "AD",
        "flag": "https://www.countryflags.io/AD/flat/24.png",
        "mask": "###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Angola",
        "code": "+244",
        "iso": "AO",
        "flag": "https://www.countryflags.io/AO/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Anguilla",
        "code": "+1",
        "iso": "AI",
        "flag": "https://www.countryflags.io/AI/flat/24.png",
        "mask": "(224)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Antarctica",
        "code": "+672",
        "iso": "AQ",
        "flag": "https://www.countryflags.io/AQ/flat/24.png",
        "mask": "1##-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Antigua and Barbuda",
        "code": "+1",
        "iso": "AG",
        "flag": "https://www.countryflags.io/AG/flat/24.png",
        "mask": "(268)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Argentina",
        "code": "+54",
        "iso": "AR",
        "flag": "https://www.countryflags.io/AR/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Armenia",
        "code": "+374",
        "iso": "AM",
        "flag": "https://www.countryflags.io/AM/flat/24.png",
        "mask": "##-###-###",
        pattern: [ /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Aruba",
        "code": "+297",
        "iso": "AW",
        "flag": "https://www.countryflags.io/AW/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Ascension Island",
        "code": "+247",
        "iso": "AC",
        "flag": "https://www.countryflags.io/SH/flat/24.png",
        "mask": "####",
        pattern: [/\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Australia",
        "code": "+61",
        "iso": "AU",
        "flag": "https://www.countryflags.io/AU/flat/24.png",
        "mask": "#-####-####",
        pattern: [ /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Austria",
        "code": "+43",
        "iso": "AT",
        "flag": "https://www.countryflags.io/AT/flat/24.png",
        "mask": "(###)###-####",
        pattern: [  /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Azerbaijan",
        "code": "+994",
        "iso": "AZ",
        "flag": "https://www.countryflags.io/AZ/flat/24.png",
        "mask": "##-###-##-##",
        pattern: [ /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ',  /\d/, /\d/]

    },
    {
        "name": "Bahamas",
        "code": "+1",
        "iso": "BS",
        "flag": "https://www.countryflags.io/BS/flat/24.png",
        "mask": "(242)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Bahrain",
        "code": "+973",
        "iso": "BH",
        "flag": "https://www.countryflags.io/BH/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Bangladesh",
        "code": "+880",
        "iso": "BD",
        "flag": "https://www.countryflags.io/BD/flat/24.png",
        "mask": "1###-######",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Barbados",
        "code": "+1",
        "iso": "BB",
        "flag": "https://www.countryflags.io/BB/flat/24.png",
        "mask": "(246)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Belarus",
        "code": "+375",
        "iso": "BY",
        "flag": "https://www.countryflags.io/BY/flat/24.png",
        "mask": "(##)###-##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, ' ', /\d/, /\d/]

    },
    {
        "name": "Belgium",
        "code": "+32",
        "iso": "BE",
        "flag": "https://www.countryflags.io/BE/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Belize",
        "code": "+501",
        "iso": "BZ",
        "flag": "https://www.countryflags.io/BZ/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Benin",
        "code": "+229",
        "iso": "BJ",
        "flag": "https://www.countryflags.io/BJ/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Bermuda",
        "code": "+1",
        "iso": "BM",
        "flag": "https://www.countryflags.io/BM/flat/24.png",
        "mask": "(441)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Bhutan",
        "code": "+975",
        "iso": "BT",
        "flag": "https://www.countryflags.io/BT/flat/24.png",
        "mask": "17-###-###",
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Bolivia",
        "code": "+591",
        "iso": "BO",
        "flag": "https://www.countryflags.io/BO/flat/24.png",
        "mask": "#-###-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Bosnia and Herzegovina",
        "code": "+387",
        "iso": "BA",
        "flag": "https://www.countryflags.io/BA/flat/24.png",
        "mask": "##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Botswana",
        "code": "+267",
        "iso": "BW",
        "flag": "https://www.countryflags.io/BW/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Brazil",
        "code": "+55",
        "iso": "BR",
        "flag": "https://www.countryflags.io/BR/flat/24.png",
        "mask": "(##)####-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "British Indian Ocean Territory",
        "code": "+246",
        "iso": "IO",
        "flag": "https://www.countryflags.io/IO/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Brunei Darussalam",
        "code": "+673",
        "iso": "BN",
        "flag": "https://www.countryflags.io/BN/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Bulgaria",
        "code": "+359",
        "iso": "BG",
        "flag": "https://www.countryflags.io/BG/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Burkina Faso",
        "code": "+226",
        "iso": "BF",
        "flag": "https://www.countryflags.io/BF/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Burundi",
        "code": "+257",
        "iso": "BI",
        "flag": "https://www.countryflags.io/BI/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Cambodia",
        "code": "+855",
        "iso": "KH",
        "flag": "https://www.countryflags.io/KH/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Cameroon",
        "code": "+237",
        "iso": "CM",
        "flag": "https://www.countryflags.io/CM/flat/24.png",
        "mask": "####-#####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Canada",
        "code": "+1",
        "iso": "CA",
        "flag": "https://www.countryflags.io/CA/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Cape Verde",
        "code": "+238",
        "iso": "CV",
        "flag": "https://www.countryflags.io/CV/flat/24.png",
        "mask": "(###)##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]

    },
    {
        "name": "Cayman Islands",
        "code": "+1",
        "iso": "KY",
        "flag": "https://www.countryflags.io/KY/flat/24.png",
        "mask": "(345)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Central African Republic",
        "code": "+236",
        "iso": "CF",
        "flag": "https://www.countryflags.io/CF/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Chad",
        "code": "+235",
        "iso": "TD",
        "flag": "https://www.countryflags.io/TD/flat/24.png",
        "mask": "##-##-##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]

    },
    {
        "name": "Chile",
        "code": "+56",
        "iso": "CL",
        "flag": "https://www.countryflags.io/CL/flat/24.png",
        "mask": "#-####-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "China",
        "code": "+86",
        "iso": "CN",
        "flag": "https://www.countryflags.io/CN/flat/24.png",
        "mask": [
            "(###)####-###",
            "(###)####-####",
            "##-#####-#####"
        ],
        pattern: [ /\d/,/\d/,/\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Christmas Island",
        "code": "+61",
        "iso": "CX",
        "flag": "https://www.countryflags.io/CX/flat/24.png",
        "mask": "#-####-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Cocos (Keeling) Islands",
        "code": "+61",
        "iso": "CC",
        "flag": "https://www.countryflags.io/CC/flat/24.png",
        "mask": "#-####-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Colombia",
        "code": "+57",
        "iso": "CO",
        "flag": "https://www.countryflags.io/CO/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Comoros",
        "code": "+269",
        "iso": "KM",
        "flag": "https://www.countryflags.io/KM/flat/24.png",
        "mask": "##-#####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Congo",
        "code": "+242",
        "iso": "CG",
        "flag": "https://www.countryflags.io/CG/flat/24.png",
        "mask": "##-#####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Cook Islands",
        "code": "+682",
        "iso": "CK",
        "flag": "https://www.countryflags.io/CK/flat/24.png",
        "mask": "##-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Costa Rica",
        "code": "+506",
        "iso": "CR",
        "flag": "https://www.countryflags.io/CR/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Croatia",
        "code": "+385",
        "iso": "HR",
        "flag": "https://www.countryflags.io/HR/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Cuba",
        "code": "+53",
        "iso": "CU",
        "flag": "https://www.countryflags.io/CU/flat/24.png",
        "mask": "#-###-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Cyprus",
        "code": "+357",
        "iso": "CY",
        "flag": "https://www.countryflags.io/CY/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Czech Republic",
        "code": "+420",
        "iso": "CZ",
        "flag": "https://www.countryflags.io/CZ/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Democratic Republic of the Congo",
        "code": "+243",
        "iso": "CD",
        "flag": "https://www.countryflags.io/CD/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Denmark",
        "code": "+45",
        "iso": "DK",
        "flag": "https://www.countryflags.io/DK/flat/24.png",
        "mask": "##-##-##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]

    },
    {
        "name": "Djibouti",
        "code": "+253",
        "iso": "DJ",
        "flag": "https://www.countryflags.io/DJ/flat/24.png",
        "mask": "##-##-##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]

    },
    {
        "name": "Dominica",
        "code": "+1",
        "iso": "DM",
        "flag": "https://www.countryflags.io/DM/flat/24.png",
        "mask": "(767)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Dominican Republic",
        "code": "+1",
        "iso": "DO",
        "flag": "https://www.countryflags.io/DO/flat/24.png",
        "mask": [
            "(809)###-####",
            "(829)###-####",
            "(849)###-####"
        ],
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Ecuador",
        "code": "+593",
        "iso": "EC",
        "flag": "https://www.countryflags.io/EC/flat/24.png",
        "mask": [
            "#-###-####",
            "##-###-####"
        ],
        pattern: [ /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Egypt",
        "code": "+20",
        "iso": "EG",
        "flag": "https://www.countryflags.io/EG/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "El Salvador",
        "code": "+503",
        "iso": "SV",
        "flag": "https://www.countryflags.io/SV/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Equatorial Guinea",
        "code": "+240",
        "iso": "GQ",
        "flag": "https://www.countryflags.io/GQ/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Eritrea",
        "code": "+291",
        "iso": "ER",
        "flag": "https://www.countryflags.io/ER/flat/24.png",
        "mask": "#-###-###",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Estonia",
        "code": "+372",
        "iso": "EE",
        "flag": "https://www.countryflags.io/EE/flat/24.png",
        "mask": [
            "###-####",
            "####-####"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Eswatini",
        "code": "+268",
        "iso": "SZ",
        "flag": "https://www.countryflags.io/SZ/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Ethiopia",
        "code": "+251",
        "iso": "ET",
        "flag": "https://www.countryflags.io/ET/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Falkland Islands (Malvinas)",
        "code": "+500",
        "iso": "FK",
        "flag": "https://www.countryflags.io/FK/flat/24.png",
        "mask": "#####",
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Faroe Islands",
        "code": "+298",
        "iso": "FO",
        "flag": "https://www.countryflags.io/FO/flat/24.png",
        "mask": "###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Fiji",
        "code": "+679",
        "iso": "FJ",
        "flag": "https://www.countryflags.io/FJ/flat/24.png",
        "mask": "##-#####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Finland",
        "code": "+358",
        "iso": "FI",
        "flag": "https://www.countryflags.io/FI/flat/24.png",
        "mask": "(###)###-##-##",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "France",
        "code": "+33",
        "iso": "FR",
        "flag": "https://www.countryflags.io/FR/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "French Guiana",
        "code": "+594",
        "iso": "GF",
        "flag": "https://www.countryflags.io/GF/flat/24.png",
        "mask": "#####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "French Polynesia",
        "code": "+689",
        "iso": "PF",
        "flag": "https://www.countryflags.io/PF/flat/24.png",
        "mask": "##-##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Gabon",
        "code": "+241",
        "iso": "GA",
        "flag": "https://www.countryflags.io/GA/flat/24.png",
        "mask": "#-##-##-##",
        pattern: [/\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Gambia",
        "code": "+220",
        "iso": "GM",
        "flag": "https://www.countryflags.io/GM/flat/24.png",
        "mask": "(###)##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]

    },
    {
        "name": "Georgia",
        "code": "+995",
        "iso": "GE",
        "flag": "https://www.countryflags.io/GE/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Germany",
        "code": "+49",
        "iso": "DE",
        "flag": "https://www.countryflags.io/DE/flat/24.png",
        "mask": [
            "###-###",
            "(###)##-##",
            "(###)##-###",
            "(###)##-####",
            "(###)###-####",
            "(####)###-####"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/]
    },
    {
        "name": "Ghana",
        "code": "+233",
        "iso": "GH",
        "flag": "https://www.countryflags.io/GH/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Gibraltar",
        "code": "+350",
        "iso": "GI",
        "flag": "https://www.countryflags.io/GI/flat/24.png",
        "mask": "###-#####",
        pattern: [/\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Greece",
        "code": "+30",
        "iso": "GR",
        "flag": "https://www.countryflags.io/GR/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Greenland",
        "code": "+299",
        "iso": "GL",
        "flag": "https://www.countryflags.io/GL/flat/24.png",
        "mask": "##-##-##",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Grenada",
        "code": "+1",
        "iso": "GD",
        "flag": "https://www.countryflags.io/GD/flat/24.png",
        "mask": "(473)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Guadeloupe",
        "code": "+590",
        "iso": "GP",
        "flag": "https://www.countryflags.io/GP/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Guam",
        "code": "+1",
        "iso": "GU",
        "flag": "https://www.countryflags.io/GU/flat/24.png",
        "mask": "(671)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Guatemala",
        "code": "+502",
        "iso": "GT",
        "flag": "https://www.countryflags.io/GT/flat/24.png",
        "mask": "#-###-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Guernsey",
        "code": "+44",
        "iso": "GG",
        "flag": "https://www.countryflags.io/GG/flat/24.png",
        "mask": "##-####-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Guinea",
        "code": "+224",
        "iso": "GN",
        "flag": "https://www.countryflags.io/GN/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Guinea-Bissau",
        "code": "+245",
        "iso": "GW",
        "flag": "https://www.countryflags.io/GW/flat/24.png",
        "mask": "#-######",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Guyana",
        "code": "+592",
        "iso": "GY",
        "flag": "https://www.countryflags.io/GY/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Haiti",
        "code": "+509",
        "iso": "HT",
        "flag": "https://www.countryflags.io/HT/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Holy See (Vatican City State)",
        "code": "+39",
        "iso": "VA",
        "flag": "https://www.countryflags.io/VA/flat/24.png",
        "mask": "06 698#####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',  /\d/, /\d/, /\d/]
    },
    {
        "name": "Honduras",
        "code": "+504",
        "iso": "HN",
        "flag": "https://www.countryflags.io/HN/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Hong Kong",
        "code": "+852",
        "iso": "HK",
        "flag": "https://www.countryflags.io/HK/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Hungary",
        "code": "+36",
        "iso": "HU",
        "flag": "https://www.countryflags.io/HU/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Iceland",
        "code": "+354",
        "iso": "IS",
        "flag": "https://www.countryflags.io/IS/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "India",
        "code": "+91",
        "iso": "IN",
        "flag": "https://www.countryflags.io/IN/flat/24.png",
        "mask": "(####)###-###",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Indonesia",
        "code": "+62",
        "iso": "ID",
        "flag": "https://www.countryflags.io/ID/flat/24.png",
        "mask": [
            "##-###-##",
            "##-###-###",
            "##-###-####",
            "(8##)###-###",
            "(8##)###-##-###"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/,  /\d/]
    },
    {
        "name": "Iran",
        "code": "+98",
        "iso": "IR",
        "flag": "https://www.countryflags.io/IR/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Iraq",
        "code": "+924",
        "iso": "IQ",
        "flag": "https://www.countryflags.io/IQ/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Ireland",
        "code": "+353",
        "iso": "IE",
        "flag": "https://www.countryflags.io/IE/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Isle of Man",
        "code": "+44",
        "iso": "IM",
        "flag": "https://www.countryflags.io/IM/flat/24.png",
        "mask": "##-####-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Israel",
        "code": "+972",
        "iso": "IL",
        "flag": "https://www.countryflags.io/IL/flat/24.png",
        "mask": [
            "#-###-####",
            "5#-###-####"
        ],
        pattern: [ /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Italy",
        "code": "+39",
        "iso": "IT",
        "flag": "https://www.countryflags.io/IT/flat/24.png",
        "mask": "(###)####-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Ivory Coast / Cote d'Ivoire",
        "code": "+225",
        "iso": "CI",
        "flag": "https://www.countryflags.io/CI/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Jamaica",
        "code": "+1",
        "iso": "JM",
        "flag": "https://www.countryflags.io/JM/flat/24.png",
        "mask": "(876)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Japan",
        "code": "+81",
        "iso": "JP",
        "flag": "https://www.countryflags.io/JP/flat/24.png",
        "mask": [
            "(###)###-###",
            "##-####-####"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Jersey",
        "code": "+44",
        "iso": "JE",
        "flag": "https://www.countryflags.io/JE/flat/24.png",
        "mask": "##-####-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Jordan",
        "code": "+962",
        "iso": "JO",
        "flag": "https://www.countryflags.io/JO/flat/24.png",
        "mask": "#-####-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Kazakhstan",
        "code": "+77",
        "iso": "KZ",
        "flag": "https://www.countryflags.io/KZ/flat/24.png",
        "mask": [
            "(6##)###-##-##",
            "(7##)###-##-##",
        ],
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Kenya",
        "code": "+254",
        "iso": "KE",
        "flag": "https://www.countryflags.io/KE/flat/24.png",
        "mask": "###-######",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Kiribati",
        "code": "+686",
        "iso": "KI",
        "flag": "https://www.countryflags.io/KI/flat/24.png",
        "mask": "##-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Korea, Democratic People's Republic of Korea",
        "code": "+850",
        "iso": "KP",
        "flag": "https://www.countryflags.io/KP/flat/24.png",
        "mask": [
            "###-###",
            "####-####",
            "##-###-###",
            "###-####-###",
            "191-###-####",
            "####-#############"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Korea, Republic of South Korea",
        "code": "+82",
        "iso": "KR",
        "flag": "https://www.countryflags.io/KR/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Kosovo",
        "code": "+383",
        "iso": "XK",
        "flag": "https://www.countryflags.io/XK/flat/24.png",
        "mask": [
            "##-###-###",
            "###-###-###"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Kuwait",
        "code": "+965",
        "iso": "KW",
        "flag": "https://www.countryflags.io/KW/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Kyrgyzstan",
        "code": "+996",
        "iso": "KG",
        "flag": "https://www.countryflags.io/KG/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Laos",
        "code": "+856",
        "iso": "LA",
        "flag": "https://www.countryflags.io/LA/flat/24.png",
        "mask": [
            "##-###-###",
            "(20##)###-###"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Latvia",
        "code": "+371",
        "iso": "LV",
        "flag": "https://www.countryflags.io/LV/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Lebanon",
        "code": "+961",
        "iso": "LB",
        "flag": "https://www.countryflags.io/LB/flat/24.png",
        "mask": [
            "#-###-###",
            "##-###-###"
        ],
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Lesotho",
        "code": "+266",
        "iso": "LS",
        "flag": "https://www.countryflags.io/LS/flat/24.png",
        "mask": "#-###-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Liberia",
        "code": "+231",
        "iso": "LR",
        "flag": "https://www.countryflags.io/LR/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Libya",
        "code": "+218",
        "iso": "LY",
        "flag": "https://www.countryflags.io/LY/flat/24.png",
        "mask": [
            "##-###-###",
            "21-###-####"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Liechtenstein",
        "code": "+423",
        "iso": "LI",
        "flag": "https://www.countryflags.io/LI/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Lithuania",
        "code": "+370",
        "iso": "LT",
        "flag": "https://www.countryflags.io/LT/flat/24.png",
        "mask": "(###)##-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Luxembourg",
        "code": "+352",
        "iso": "LU",
        "flag": "https://www.countryflags.io/LU/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Macau",
        "code": "+853",
        "iso": "MO",
        "flag": "https://www.countryflags.io/MO/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Madagascar",
        "code": "+261",
        "iso": "MG",
        "flag": "https://www.countryflags.io/MG/flat/24.png",
        "mask": "##-##-#####"
    },
    {
        "name": "Malawi",
        "code": "+265",
        "iso": "MW",
        "flag": "https://www.countryflags.io/MW/flat/24.png",
        "mask": [
            "1-###-###",
            "#-####-####"
        ]
    },
    {
        "name": "Malaysia",
        "code": "+60",
        "iso": "MY",
        "flag": "https://www.countryflags.io/MY/flat/24.png",
        "mask": [
            "#-###-###",
            "##-###-###",
            "(###)###-###",
            "##-###-####"
        ],
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Maldives",
        "code": "+960",
        "iso": "MV",
        "flag": "https://www.countryflags.io/MV/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Mali",
        "code": "+223",
        "iso": "ML",
        "flag": "https://www.countryflags.io/ML/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Malta",
        "code": "+356",
        "iso": "MT",
        "flag": "https://www.countryflags.io/MT/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Marshall Islands",
        "code": "+692",
        "iso": "MH",
        "flag": "https://www.countryflags.io/MH/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Martinique",
        "code": "+596",
        "iso": "MQ",
        "flag": "https://www.countryflags.io/MQ/flat/24.png",
        "mask": "(###)##-##-##",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Mauritania",
        "code": "+222",
        "iso": "MR",
        "flag": "https://www.countryflags.io/MR/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Mauritius",
        "code": "+230",
        "iso": "MU",
        "flag": "https://www.countryflags.io/MU/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Mayotte",
        "code": "+262",
        "iso": "YT",
        "flag": "https://www.countryflags.io/YT/flat/24.png",
        "mask": "#####-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Mexico",
        "code": "+52",
        "iso": "MX",
        "flag": "https://www.countryflags.io/MX/flat/24.png",
        "mask": [
            "##-##-####",
            "(###)###-####"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Micronesia, Federated States of Micronesia",
        "code": "+691",
        "iso": "FM",
        "flag": "https://www.countryflags.io/FM/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Moldova",
        "code": "+373",
        "iso": "MD",
        "flag": "https://www.countryflags.io/MD/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Monaco",
        "code": "+377",
        "iso": "MC",
        "flag": "https://www.countryflags.io/MC/flat/24.png",
        "mask": [
            "##-###-###",
            "(###)###-###"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Mongolia",
        "code": "+976",
        "iso": "MN",
        "flag": "https://www.countryflags.io/MN/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Montenegro",
        "code": "+382",
        "iso": "ME",
        "flag": "https://www.countryflags.io/ME/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Montserrat",
        "code": "+1",
        "iso": "MS",
        "flag": "https://www.countryflags.io/MS/flat/24.png",
        "mask": "(624)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Morocco",
        "code": "+212",
        "iso": "MA",
        "flag": "https://www.countryflags.io/MA/flat/24.png",
        "mask": "##-####-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Mozambique",
        "code": "+258",
        "iso": "MZ",
        "flag": "https://www.countryflags.io/MZ/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Myanmar",
        "code": "+95",
        "iso": "MM",
        "flag": "https://www.countryflags.io/MM/flat/24.png",
        "mask": [
            "###-###",
            "#-###-###",
            "##-###-###"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Namibia",
        "code": "+224",
        "iso": "NA",
        "flag": "https://www.countryflags.io/NA/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Nauru",
        "code": "+674",
        "iso": "NR",
        "flag": "https://www.countryflags.io/NR/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Nepal",
        "code": "+977",
        "iso": "NP",
        "flag": "https://www.countryflags.io/NP/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Netherlands",
        "code": "+31",
        "iso": "NL",
        "flag": "https://www.countryflags.io/NL/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Netherlands Antilles",
        "code": "+599",
        "iso": "AN",
        "flag": "https://www.countryflags.io/AN/flat/24.png",
        "mask": [
            "###-####",
            "9###-####"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "New Caledonia",
        "code": "+687",
        "iso": "NC",
        "flag": "https://www.countryflags.io/NC/flat/24.png",
        "mask": "##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "New Zealand",
        "code": "+24",
        "iso": "NZ",
        "flag": "https://www.countryflags.io/NZ/flat/24.png",
        "mask": [
            "#-###-###",
            "(###)###-###",
            "(###)###-####"
        ],
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Nicaragua",
        "code": "+505",
        "iso": "NI",
        "flag": "https://www.countryflags.io/NI/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Niger",
        "code": "+227",
        "iso": "NE",
        "flag": "https://www.countryflags.io/NE/flat/24.png",
        "mask": "##-##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Nigeria",
        "code": "+234",
        "iso": "NG",
        "flag": "https://www.countryflags.io/NG/flat/24.png",
        "mask": [
            "##-###-##",
            "##-###-###",
            "(###)###-####"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ',  /\d/,  /\d/]
    },
    {
        "name": "Niue",
        "code": "+683",
        "iso": "NU",
        "flag": "https://www.countryflags.io/NU/flat/24.png",
        "mask": "####",
        pattern: [/\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Norfolk Island",
        "code": "+672",
        "iso": "NF",
        "flag": "https://www.countryflags.io/NF/flat/24.png",
        "mask": "3##-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "North Macedonia",
        "code": "+389",
        "iso": "MK",
        "flag": "https://www.countryflags.io/MK/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Northern Mariana Islands",
        "code": "+1",
        "iso": "MP",
        "flag": "https://www.countryflags.io/MP/flat/24.png",
        "mask": "(670)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Norway",
        "code": "+47",
        "iso": "NO",
        "flag": "https://www.countryflags.io/NO/flat/24.png",
        "mask": "(###)##-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Oman",
        "code": "+968",
        "iso": "OM",
        "flag": "https://www.countryflags.io/OM/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Pakistan",
        "code": "+92",
        "iso": "PK",
        "flag": "https://www.countryflags.io/PK/flat/24.png",
        "mask": "(###)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Palau",
        "code": "+680",
        "iso": "PW",
        "flag": "https://www.countryflags.io/PW/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Palestine",
        "code": "+970",
        "iso": "PS",
        "flag": "https://www.countryflags.io/PS/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Panama",
        "code": "+507",
        "iso": "PA",
        "flag": "https://www.countryflags.io/PA/flat/24.png",
        "mask": "###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Papua New Guinea",
        "code": "+675",
        "iso": "PG",
        "flag": "https://www.countryflags.io/PG/flat/24.png",
        "mask": "(###)##-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Paraguay",
        "code": "+595",
        "iso": "PY",
        "flag": "https://www.countryflags.io/PY/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Peru",
        "code": "+51",
        "iso": "PE",
        "flag": "https://www.countryflags.io/PE/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Philippines",
        "code": "+63",
        "iso": "PH",
        "flag": "https://www.countryflags.io/PH/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Pitcairn",
        "code": "+870",
        "iso": "PN",
        "flag": "https://www.countryflags.io/PN/flat/24.png",
        "mask": "###-###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Poland",
        "code": "+48",
        "iso": "PL",
        "flag": "https://www.countryflags.io/PL/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Portugal",
        "code": "+351",
        "iso": "PT",
        "flag": "https://www.countryflags.io/PT/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Puerto Rico",
        "code": "+1",
        "iso": "PR",
        "flag": "https://www.countryflags.io/PR/flat/24.png",
        "mask": [
            "(787) ### ####",
            "(939) ### ####"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Qatar",
        "code": "+974",
        "iso": "QA",
        "flag": "https://www.countryflags.io/QA/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Reunion",
        "code": "+262",
        "iso": "RE",
        "flag": "https://www.countryflags.io/RE/flat/24.png",
        "mask": "#####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Romania",
        "code": "+40",
        "iso": "RO",
        "flag": "https://www.countryflags.io/RO/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Russia",
        "code": "+7",
        "iso": "RU",
        "flag": "https://www.countryflags.io/RU/flat/24.png",
        "mask": "(###)###-##-##",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Rwanda",
        "code": "+250",
        "iso": "RW",
        "flag": "https://www.countryflags.io/RW/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Saint Barthelemy",
        "code": "+590",
        "iso": "BL",
        "flag": "https://www.countryflags.io/BL/flat/24.png",
        "mask": "###-##-##-##",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Saint Helena, Ascension and Tristan Da Cunha",
        "code": "+290",
        "iso": "SH",
        "flag": "https://www.countryflags.io/SH/flat/24.png",
        "mask": "####",
        pattern: [/\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Saint Kitts and Nevis",
        "code": "+1",
        "iso": "KN",
        "flag": "https://www.countryflags.io/KN/flat/24.png",
        "mask": "(869)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Saint Lucia",
        "code": "+1",
        "iso": "LC",
        "flag": "https://www.countryflags.io/LC/flat/24.png",
        "mask": "(758)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Saint Martin",
        "code": "+590",
        "iso": "MF",
        "flag": "https://www.countryflags.io/MF/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Saint Pierre and Miquelon",
        "code": "+508",
        "iso": "PM",
        "flag": "https://www.countryflags.io/PM/flat/24.png",
        "mask": "##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Saint Vincent and the Grenadines",
        "code": "+1",
        "iso": "VC",
        "flag": "https://www.countryflags.io/VC/flat/24.png",
        "mask": "(784)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Samoa",
        "code": "+685",
        "iso": "WS",
        "flag": "https://www.countryflags.io/WS/flat/24.png",
        "mask": "##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "San Marino",
        "code": "+378",
        "iso": "SM",
        "flag": "https://www.countryflags.io/SM/flat/24.png",
        "mask": "####-######",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Sao Tome and Principe",
        "code": "+239",
        "iso": "ST",
        "flag": "https://www.countryflags.io/ST/flat/24.png",
        "mask": "##-#####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Saudi Arabia",
        "code": "+966",
        "iso": "SA",
        "flag": "https://www.countryflags.io/SA/flat/24.png",
        "mask": [
            "#-###-####",
            "5#-####-####"
        ],
        pattern: [ /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Senegal",
        "code": "+221",
        "iso": "SN",
        "flag": "https://www.countryflags.io/SN/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Serbia",
        "code": "+381",
        "iso": "RS",
        "flag": "https://www.countryflags.io/RS/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Seychelles",
        "code": "+248",
        "iso": "SC",
        "flag": "https://www.countryflags.io/SC/flat/24.png",
        "mask": "#-###-###",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Sierra Leone",
        "code": "+232",
        "iso": "SL",
        "flag": "https://www.countryflags.io/SL/flat/24.png",
        "mask": "##-######",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Singapore",
        "code": "+65",
        "iso": "SG",
        "flag": "https://www.countryflags.io/SG/flat/24.png",
        "mask": "####-####",
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Sint Maarten",
        "code": "+1",
        "iso": "SX",
        "flag": "https://www.countryflags.io/SX/flat/24.png",
        "mask": "(721)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Slovakia",
        "code": "+421",
        "iso": "SK",
        "flag": "https://www.countryflags.io/SK/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Slovenia",
        "code": "+386",
        "iso": "SI",
        "flag": "https://www.countryflags.io/SI/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Solomon Islands",
        "code": "+677",
        "iso": "SB",
        "flag": "https://www.countryflags.io/SB/flat/24.png",
        "mask": [
            "#####",
            "###-####"
        ],
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Somalia",
        "code": "+252",
        "iso": "SO",
        "flag": "https://www.countryflags.io/SO/flat/24.png",
        "mask": [
            "#-###-###",
            "##-###-###"
        ],
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "South Africa",
        "code": "+27",
        "iso": "ZA",
        "flag": "https://www.countryflags.io/ZA/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "South Georgia and the South Sandwich Islands",
        "code": "+500",
        "iso": "GS",
        "flag": "https://www.countryflags.io/GS/flat/24.png",
        "mask": "#####",
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "South Sudan",
        "code": "+211",
        "iso": "SS",
        "flag": "https://www.countryflags.io/SS/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Spain",
        "code": "+34",
        "iso": "ES",
        "flag": "https://www.countryflags.io/ES/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Sri Lanka",
        "code": "+94",
        "iso": "LK",
        "flag": "https://www.countryflags.io/LK/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Sudan",
        "code": "+249",
        "iso": "SD",
        "flag": "https://www.countryflags.io/SD/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Suriname",
        "code": "+597",
        "iso": "SR",
        "flag": "https://www.countryflags.io/SR/flat/24.png",
        "mask": [
            "###-###",
            "###-####"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Svalbard and Jan Mayen",
        "code": "+47",
        "iso": "SJ",
        "flag": "https://www.countryflags.io/SJ/flat/24.png",
        "mask": "(###)##-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Sweden",
        "code": "+46",
        "iso": "SE",
        "flag": "https://www.countryflags.io/SE/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Switzerland",
        "code": "+41",
        "iso": "CH",
        "flag": "https://www.countryflags.io/CH/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Syrian Arab Republic",
        "code": "+963",
        "iso": "SY",
        "flag": "https://www.countryflags.io/SY/flat/24.png",
        "mask": "##-####-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Taiwan",
        "code": "+886",
        "iso": "TW",
        "flag": "https://www.countryflags.io/TW/flat/24.png",
        "mask": [
            "####-####",
            "#-####-####"
        ],
        pattern: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Tajikistan",
        "code": "+992",
        "iso": "TJ",
        "flag": "https://www.countryflags.io/TJ/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Tanzania, United Republic of Tanzania",
        "code": "+255",
        "iso": "TZ",
        "flag": "https://www.countryflags.io/TZ/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Thailand",
        "code": "+66",
        "iso": "TH",
        "flag": "https://www.countryflags.io/TH/flat/24.png",
        "mask": [
            "##-###-###",
            "##-###-####"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Timor-Leste",
        "code": "+670",
        "iso": "TL",
        "flag": "https://www.countryflags.io/TL/flat/24.png",
        "mask": [
            "###-####",
            "77#-#####",
            "78#-#####"
        ],
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Togo",
        "code": "+228",
        "iso": "TG",
        "flag": "https://www.countryflags.io/TG/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Tokelau",
        "code": "+690",
        "iso": "TK",
        "flag": "https://www.countryflags.io/TK/flat/24.png",
        "mask": "####",
        pattern: [/\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Tonga",
        "code": "+676",
        "iso": "TO",
        "flag": "https://www.countryflags.io/TO/flat/24.png",
        "mask": "#####",
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Trinidad and Tobago",
        "code": "+1",
        "iso": "TT",
        "flag": "https://www.countryflags.io/TT/flat/24.png",
        "mask": "(868)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Tunisia",
        "code": "+216",
        "iso": "TN",
        "flag": "https://www.countryflags.io/TN/flat/24.png",
        "mask": "##-###-###",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Turkey",
        "code": "+90",
        "iso": "TR",
        "flag": "https://www.countryflags.io/TR/flat/24.png",
        "mask": "(###)###-####",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Turkmenistan",
        "code": "+993",
        "iso": "TM",
        "flag": "https://www.countryflags.io/TM/flat/24.png",
        "mask": "#-###-####",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Turks and Caicos Islands",
        "code": "+1",
        "iso": "TC",
        "flag": "https://www.countryflags.io/TC/flat/24.png",
        "mask": "(249)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Tuvalu",
        "code": "+688",
        "iso": "TV",
        "flag": "https://www.countryflags.io/TV/flat/24.png",
        "mask": [
            "2####",
            "90####"
        ],
        pattern: [/\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Uganda",
        "code": "+256",
        "iso": "UG",
        "flag": "https://www.countryflags.io/UG/flat/24.png",
        "mask": "(###)###-###",
        pattern: [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

    },
    {
        "name": "Ukraine",
        "code": "+380",
        "iso": "UA",
        "flag": "https://www.countryflags.io/UA/flat/24.png",
        "mask": "(##)###-##-##",
        pattern: [ /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "United Arab Emirates",
        "code": "+971",
        "iso": "AE",
        "flag": "https://www.countryflags.io/AE/flat/24.png",
        "mask": [
            "#-###-####",
            "5#-###-####"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "United Kingdom",
        "code": "+44",
        "iso": "GB",
        "flag": "https://www.countryflags.io/GB/flat/24.png",
        "mask": "##-####-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "United States",
        "code": "+1",
        "iso": "US",
        "flag": "https://www.countryflags.io/US/flat/24.png",
        "mask": "(###)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Uruguay",
        "code": "+598",
        "iso": "UY",
        "flag": "https://www.countryflags.io/UY/flat/24.png",
        "mask": "#-###-##-##",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    },
    {
        "name": "Uzbekistan",
        "code": "+998",
        "iso": "UZ",
        "flag": "https://www.countryflags.io/UZ/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Vanuatu",
        "code": "+678",
        "iso": "VU",
        "flag": "https://www.countryflags.io/VU/flat/24.png",
        "mask": [
            "#####",
            "##-#####"
        ],
        pattern: [ /\d/, /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Venezuela, Bolivarian Republic of Venezuela",
        "code": "+58",
        "iso": "VE",
        "flag": "https://www.countryflags.io/VE/flat/24.png",
        "mask": "(###)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Vietnam",
        "code": "+84",
        "iso": "VN",
        "flag": "https://www.countryflags.io/VN/flat/24.png",
        "mask": [
            "##-####-###",
            "(###)####-###"
        ],
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/],
    },
    {
        "name": "Virgin Islands, British",
        "code": "+1",
        "iso": "VG",
        "flag": "https://www.countryflags.io/VG/flat/24.png",
        "mask": "(284)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
    },
    {
        "name": "Virgin Islands, U.S.",
        "code": "+1",
        "iso": "VI",
        "flag": "https://www.countryflags.io/VI/flat/24.png",
        "mask": "(340)###-####",
        pattern: [ /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Wallis and Futuna",
        "code": "+681",
        "iso": "WF",
        "flag": "https://www.countryflags.io/WF/flat/24.png",
        "mask": "##-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Yemen",
        "code": "+967",
        "iso": "YE",
        "flag": "https://www.countryflags.io/YE/flat/24.png",
        "mask": [
            "#-###-###",
            "##-###-###",
            "###-###-###"
        ],
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]
    },
    {
        "name": "Zambia",
        "code": "+260",
        "iso": "ZM",
        "flag": "https://www.countryflags.io/ZM/flat/24.png",
        "mask": "##-###-####",
        pattern: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, /\d/]

    },
    {
        "name": "Zimbabwe",
        "code": "+263",
        "iso": "ZW",
        "flag": "https://www.countryflags.io/ZW/flat/24.png",
        "mask": "#-######",
        pattern: [/\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
    }
];

export const getCountries = () => async (dispatch) => {
    let currentCountryName = 'AE';
    let f =  CountriesData.map(o => {
        let found = a.find(i => i.iso === o.cca2);
        return { ...o, detail: found }
    });
    let find = f.find((country) => currentCountryName === country.cca2);
    let found = f.filter((country) => currentCountryName !== country.cca2);
    dispatch({ type: GLOBAL.GET_COUNTRIES, loading: false, countries: found, currentCountry: find});
};
export const getNationalityCountry = () => async (dispatch, getState) => {
    const {auth} = getState();
    if(auth?.user?.nationality) {
        let currentCountryName =  auth?.user?.nationality || 'AE';
        let f =  CountriesData.map(o => {
            let found = a.find(i => i.iso === o.cca2);
            return { ...o, detail: found }
        });
        let find = f.find((country) => currentCountryName === country.cca2);
        dispatch({ type: GLOBAL.SET_NATIONAL_COUNTRY, data: find});
    }
};

export const toggleCardSelectionModal = (value) => async (dispatch) => {
    dispatch({ type: GLOBAL.CARD_SELECTION_MODAL_IS_OPEN, data: value});
};
export const updateCard = (payload, index = 0, from) => async (dispatch, getState) => {

    const {auth} = getState();
    const {user} = auth;

    dispatch({ type: GLOBAL.UPDATE_CARD, data: payload, index});

    if(from !== 'GetUserSubscriptionsApi') {
        // let updated = {
        //     cardId: payload._id
        // };
        // dispatch(getUserSubscriptions(updated));
    }
};

export const updateUUID = (id) => async (dispatch) => {
    dispatch({ type: GLOBAL.SET_UUID, id});
};

export const getMasterDetail = () => async (dispatch) => {
    let token = await getValueIntoAsyncStorage(TOKEN);
    if(token) {
        await getTokenAndSetIntoHeaders(token);
        dispatch({type: GLOBAL.GET_MASTER_DETAIL, loading: true});
        try {
            let response = await post("master/getMaster");
            if (response?.data?.error) {
                handleError(response?.data?.data?.message || '');
                dispatch({type: GLOBAL.GET_MASTER_DETAIL, loading: false});
            } else {
                dispatch(updateTopupAndBillpaymentCurrentVendor(response?.data?.data?.data?.isBilrsActive))
                dispatch({type: GLOBAL.GET_MASTER_DETAIL, data: response?.data?.data?.data, loading: false});
            }
        } catch (error) {
            handleError(error?.data?.error || error?.message, {autoHide: false});
            dispatch({type: GLOBAL.GET_MASTER_DETAIL, loading: false});
        }
    } else {
        dispatch({type: GLOBAL.GET_MASTER_DETAIL, loading: false});
    }
};

export const getApplicationVersions = () => async (dispatch) => {
    dispatch({ type: GLOBAL.APPLICATION_VERSIONS, loading: true});
    try {
        let response = await post("master/get");
        if(response?.data?.error) {
          handleError(response?.data?.data?.message || '');
          dispatch({type: GLOBAL.APPLICATION_VERSIONS, loading: false});
        } else {
            let whatsAppNumber = response?.data?.data?.data?.kamelpayWhatsAppNumber || '';
            let kamelpayPhoneNumber = response?.data?.data?.data?.kamelpayPhoneNumber || '';

            if(whatsAppNumber) {
                updateKamelpayWhatsAppNumber(whatsAppNumber)
            }
            if(kamelpayPhoneNumber) {
                updateKamelpayPhoneNumber(kamelpayPhoneNumber);
            }
            dispatch({type: GLOBAL.APPLICATION_VERSIONS, data: response?.data?.data?.data, loading: false});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: GLOBAL.APPLICATION_VERSIONS, loading: false });
    }
};

export const promotionRequest = (payload, obj, CB) => async (dispatch) => {
    dispatch({ type: GLOBAL.PROMOTION_FORM_REQUEST, loading: true});
    try {
        let response = await post(obj.apiUrl, payload);

        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({type: GLOBAL.PROMOTION_FORM_REQUEST, loading: false});
        } else {
            CB && CB();
            handleSuccess(obj?.successMessage || 'Success');
        }
        dispatch({type: GLOBAL.PROMOTION_FORM_REQUEST, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: GLOBAL.PROMOTION_FORM_REQUEST, loading: false });
    }
};

export const sendOtp = (payload, CB) => async (dispatch) => {
    dispatch({ type: GLOBAL.SEND_OTP, loading: true});
    try {
        let response = await post("user/sendOtp");
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            CB && CB(response?.data);
        } else {
            // handleSuccess(response?.data?.data?.message);
            CB && CB({...response?.data?.data, ...payload});
        }
        dispatch({type: GLOBAL.SEND_OTP, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: GLOBAL.SEND_OTP, loading: false });
    }
};

export const resendOtp = (payload, CB) => async (dispatch) => {
    dispatch({ type: GLOBAL.RESEND_OTP, loading: true});
    try {
        // let response = await post("user/resendOtp", payload);
        let response = await post("user/resendOtpAuth", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            CB && CB(response?.data);
        } else {
            handleSuccess(response?.data?.data?.message);
            CB && CB({...payload, ...response?.data?.data})
        }
        dispatch({type: GLOBAL.RESEND_OTP, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: GLOBAL.RESEND_OTP, loading: false });
    }
};

export const verifyOtp = (payload, CB) => async (dispatch) => {
    dispatch({ type: GLOBAL.VERIFY_OTP, loading: true});
    try {
        // let response = await post("user/verifyOtp", payload);
        let response = await post("user/verifyOtpAuth", payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            CB && CB(response?.data);
        } else {
            CB && CB({...payload, ...response?.data?.data});
            // handleSuccess(response?.data?.data?.message);
        }
        dispatch({type: GLOBAL.VERIFY_OTP, loading: false});
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: GLOBAL.VERIFY_OTP, loading: false });
    }
};

export const getPopularsData = (payload) => async (dispatch) => {

    dispatch({ type: GLOBAL.GET_POPULARS_DATA, loading: true, isDashboardReady: false });

    let queryParams = encodeQueryData(payload) ? `?${encodeQueryData(payload)}` : '';

    try {
        let response = await get(`user/dashboard${queryParams}`);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({ type: GLOBAL.GET_POPULARS_DATA, loading: false, isDashboardReady: true});
        } else {
            dispatch({ type: GLOBAL.GET_POPULARS_DATA, loading: false, data: response?.data?.data, isDashboardReady: true});
            // dispatch(getSavingsStatus());
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: GLOBAL.GET_POPULARS_DATA, loading: false, isDashboardReady: false});
    }
};

export const deleteBeneficiary = (payload, CB) => async (dispatch) => {
    dispatch({ type: GLOBAL.DELETE_BENEFICIARY, loading: true});
    try {
        let response = await post(`beneficiary/delete`, payload);
        if(response?.data?.error) {
            dispatch({type: GLOBAL.DELETE_BENEFICIARY, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            handleSuccess(response?.data?.data?.message);
            dispatch({ type: GLOBAL.DELETE_BENEFICIARY, loading: false });
            CB && CB();
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: GLOBAL.DELETE_BENEFICIARY, loading: false});
    }

};

export const editBeneficiary = (payload, CB) => async (dispatch) => {
    dispatch({ type: GLOBAL.EDIT_BENEFICIARY, loading: true});
    try {
        let response = await post(`beneficiary/edit`, payload);
        if(response?.data?.error) {
            dispatch({type: GLOBAL.EDIT_BENEFICIARY, loading: false});
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
            handleSuccess(response?.data?.data?.message);
            dispatch({ type: GLOBAL.EDIT_BENEFICIARY, loading: false});
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({type: GLOBAL.EDIT_BENEFICIARY, loading: false});
    }
};

export const saveUqudoLogs = (payload, CB) => async (dispatch) => {
    try {
        let response = await post(`user/uqudoSucces`, payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
    }
};
export const saveForgetPasswordUqudoLogs = (payload, CB) => async (dispatch) => {
    try {
        let response = await post(`user/uqudoSuccesForgetPassword`, payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '', {autoHide: false});
        } else {
            CB && CB(response?.data?.data);
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
    }
};

export const viewTermsAndConditions = (payload) => (dispatch) => {
    dispatch({ type: GLOBAL.VIEW_TERMS_AND_CONDITIONS, data: payload});
};
export const updateCurrentLocation = (payload) => (dispatch) => {

    if(payload?.latitude && payload?.longitude){
        getLocationAndSetIntoHeaders(payload?.latitude, payload?.longitude);
    }

    dispatch({ type: GLOBAL.CURRENT_LOCATION, data: payload});
};

export const toggleLanguageModal = (payload) => (dispatch) => {
    dispatch({ type: GLOBAL.TOGGLE_LANGUAGE_MODAL, data: payload});
};

export const updatedSelectedCurrentPromotion = (payload) => (dispatch) => {
    dispatch({ type: GLOBAL.SELECTED_CURRENT_PROMOTION, data: payload});
};


const shareFile = async (filePath, CB) => {
    try {
        await Share.open({
            url: `file://${filePath}`,
            type: 'application/pdf',
        });
        CB && CB();
        console.log('File shared successfully');
    } catch (error) {
        console.error('Error sharing file:', error);
    }
};


export const generateTaxInvoice = (payload, CB) => async (dispatch) => {

    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
        console.log('Permission denied.');
        return;
    }

    dispatch({ type: GLOBAL.GENERATE_TAX_INVOICE, loading: true });

    try {
        const { fs, android } = RNFetchBlob;
        const documents = (Platform.OS === 'ios') ? fs.dirs.DocumentDir : fs.dirs.DownloadDir; // Directory for downloads
        const sanitizedType = (payload?.type || 'UNKNOWN').replace(/[^a-zA-Z0-9_-]/g, '');
        const fileName = `${sanitizedType}_TAX_INVOICE_${Date.now()}.pdf`;
        const filePath = `${documents}/${fileName}`;

        // Check if the file already exists and delete it
        const exists = await fs.exists(filePath);
        if (exists) {
            await fs.unlink(filePath);
        }

        // Fetch the PDF using Axios
        let response = await post('/transaction/generateInvoice', payload, {
            responseType: 'arraybuffer',
        });

        if(response?.data){
            const decoder = new TextDecoder('utf-8');
            const decodedResponse = decoder.decode(new Uint8Array(response?.data));

            if(decodedResponse?.includes('error')) {
                // Parse response to JSON if it's in JSON format
                const jsonResponse = JSON.parse(decodedResponse);
                if(jsonResponse?.error){
                    handleError(jsonResponse?.data?.message || '', {autoHide: false});
                }
            } else {
                // Convert the ArrayBuffer to Base64
                const base64Data = Buffer.from(response.data, 'binary').toString('base64');

                // Save the Base64 data to the file
                await fs.writeFile(filePath, base64Data, 'base64');

                if(Platform.OS === 'ios'){
                    // Call this function after saving the file
                    await shareFile(filePath, () => {
                        // Notify the user
                        CB && CB({
                            title: "POPUPS.TAX_INVOICE.TITLE",
                            messagePartOne: "POPUPS.TAX_INVOICE.MESSAGE",
                            messagePartTow: "POPUPS.TAX_INVOICE.MESSAGE_IOS",
                            filePath
                        });
                    });
                } else {
                    await android.addCompleteDownload({
                        title: fileName,
                        description: 'Tax Invoice',
                        mime: 'application/pdf',
                        path: filePath,
                        showNotification: true,
                        notification: true
                    });
                    // Notify the user
                    CB && CB({
                        title: "POPUPS.TAX_INVOICE.TITLE",
                        messagePartOne: "POPUPS.TAX_INVOICE.MESSAGE",
                        messagePartTow: "POPUPS.TAX_INVOICE.MESSAGE_ANDROID",
                        filePath
                    });
                }
            }
        } else {
            handleError('No data received from the server', { autoHide: false });
        }
        dispatch({ type: GLOBAL.GENERATE_TAX_INVOICE, loading: false });
    } catch (error) {
        console.error('Error downloading PDF:', error);
        handleError(error?.response?.data?.error || error?.message, { autoHide: false });
        dispatch({ type: GLOBAL.GENERATE_TAX_INVOICE, loading: false });
    }
};

export const topupAndPaybillmentVendor = {
    "PAYKII": {id: "PAYKII", api:"paykii"},
    "BILRS": {id: "BILRS", api: "bilrs"}
};

export const updateTopupAndBillpaymentCurrentVendor = (data) => (dispatch) => {
    dispatch({ type: GLOBAL.TOPUP_AND_BILLPAYMENT_CURRENT_VENDOR,
        data: data ? topupAndPaybillmentVendor.BILRS : topupAndPaybillmentVendor.PAYKII
    });
};

export const getPromotions = (payload, CB) => async (dispatch) => {
    dispatch({ type: GLOBAL.GET_PROMOTIONS, loading: true, data: []});
    try {
        let response = await post(`banner/list`, payload);
        if(response?.data?.error) {
            handleError(response?.data?.data?.message || '');
            dispatch({ type: GLOBAL.GET_PROMOTIONS, loading: false, data: []});
        } else {
            dispatch({ type: GLOBAL.GET_PROMOTIONS, loading: false, data: response?.data?.data?.data});
            CB && CB(response?.data?.data?.data)
        }
    } catch (error) {
        handleError(error?.data?.error || error?.message, {autoHide: false});
        dispatch({ type: GLOBAL.GET_PROMOTIONS, loading: false, data: []});
    }
};

export const preserveNotification = (data) => (dispatch) => {
    console.log('preserveNotification data', data)
    let notification = data?.data?.actions ? {
        title: data?.title || data?.notification?.title,
        description: data?.body || data?.notification?.body,
        data: data?.data
    } : null;
    console.log('====preserveNotification=====', notification, data?.data)
    dispatch({
        type: GLOBAL.PRESERVE_NOTIFICATION,
        data: notification
    });
};

export const setCurrentScreen = (data = '') => (dispatch) => {
    dispatch({
        type: GLOBAL.SET_CURRENT_SCREEN,
        data: data
    });
};
