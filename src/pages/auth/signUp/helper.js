import {whatsAppNumber} from "../../../utils/intercepter";
import {Alert, Linking, TouchableOpacity} from "react-native";
import Popup from "../../../uiComponents/popup/Popup";
import Styles from "../Auth.style";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {CText} from "../../../uiComponents";
import React from "react";

const KYC_SEGMENT = [
    {
        value: "SIGN_UP.EMIRATES_ID",
        _id: "EMIRATES_ID",
    },
    {
        value: "SIGN_UP.PASSPORT",
        _id: "PASSPORT",
    },
];

const CONTACT_PREFERENCES = [
    {
        value: "SIGN_UP.PHONE",
        ioniconsName: 'call-outline',
        _id: "PHONE",
    },
    {
        value: "SIGN_UP.WHATS_APP",
        ioniconsName: 'logo-whatsapp',
        _id: "WHATSAPP",
    }
];

const FIND_USER_SEGMENT = [
    {
        value: "SIGN_UP.WALLET_ID",
        _id: "WALLET_ID",
    },
    {
        value: "SIGN_UP.LAST_4_DIGITS",
        _id: "LAST_4_DIGITS",
    },
];

const SIGN_UP_CONSTANT = {
    NOT_FOUND: {
        _id: "not_found",
    },
    USER_EXISTS: {
        _id: "user_exists",
    },
    UNCLAIMED_USER_FOUND: {
        _id: "unclaimed_user_found",
    },
    MULTIPLE_USERS_FOUND: {
        _id: "multiple_users_found",
    },
    EXISTS_IN_CORE_BUT_NOT_MOBILE: {
        _id: "exists_in_core_but_not_mobile",
    },
    EXISTS_IN_MOBILE_BUT_NOT_CORE: {
        _id: "exists_in_mobile_but_not_core",
    },
};

const IDENTIFICATION_TYPE  = {
    EMIRATES_ID: {
        _id: "EMIRATES_ID",
        value: "Emirates ID",
    },
    PASSPORT: {
        _id: "PASSPORT",
        value: "Passport",
    },
    MANUAL: {
        hide: true,
        _id: "MANUAL",
        value: "Manual",
    },
};

const openWhatsApp = (t, { phoneNumber, callbackType, cardId, expiry, walletId }) => {
    let number = whatsAppNumber; // your support WhatsApp number

    // Build ID details (card + expiry OR walletId)
    let idDetails = "";
    if (cardId) {
        idDetails = `Card ID: ${cardId}\nExpiry: ${expiry || "N/A"}`;
    } else if (walletId) {
        idDetails = `Wallet ID: ${walletId}`;
    } else {
        idDetails = "ID: N/A";
    }

    // Banking/Fintech Professional template
//     let text = `Dear Support,
//
// I am attempting to register using my credentials.
// ${idDetails}
// Phone: ${phoneNumber}
//
// Kindly guide me with the next steps.`;

    let text = `Dear Support,

I am facing an issue while trying to SIGN UP.
Phone: ${phoneNumber}

Kindly assist me.`;

    let url = `whatsapp://send?phone=${number}&text=${encodeURIComponent(text)}`;

    Linking.openURL(url)
        .then((data) => {
            console.log("WhatsApp opened successfully", data);
        })
        .catch(() => {
            Alert.alert(t("GLOBAL.WHATS_APP_ALERT"));
        });
};

const errorPopup = (t, title, message) => {
    Popup.show({
        showClose: false,
        isVisible: true,
        type: 'Error',
        title: title || t('POPUPS.ERROR.TITLE'),
        text: message || t('ADVANCE_SALARY.REQUEST_FAIL_MESSAGE'),
        actions: [
            {
                text: t('GLOBAL.TRY_AGAIN'),
                callback: () => {
                    Popup.hide()
                }
            }
        ]
    });
};

const ROUTES_AGAINST_STATUS = {
    OTP_NOT_VERIFIED: {
       _id: "OTP_NOT_VERIFIED",
       routeName: "enterPhone"
   },
    PASSWORD_NOT_SET: {
        _id: "PASSWORD_NOT_SET",
        routeName: "passwordAndTermsAndCondition"
    },
    KYC_PENDING: {
        _id: "KYC_PENDING",
        routeName: "kyc"
    },
    LIVENESS_VERIFICATION_PENDING: {
        _id: "LIVENESS_VERIFICATION_PENDING",
        routeName: "liveness"
    }
}

const JOURNEY_BEGIN = {
    NEW: {
        _id: "NEW",
    },
    CONTINUE: {
        _id: "CONTINUE",
    }
}

const ScanBox = ({ onPress, title, description, type, loading }) => (
    <TouchableOpacity style={Styles.scanBox} disabled={loading} activeOpacity={0.7} onPress={onPress}>
        {/* {type === "PASSPORT" ? <MaterialCommunityIcons name="passport"
                                                       style={Styles.scanBoxIcon}
                                                       size={40}  /> : null}
        {type === "EMIRATES_ID" ? <KamelpayIcon name="emirates-ID"
                                                style={Styles.scanBoxIcon}
                                                size={40}/> : null}
        {type === "LIVENESS" ? <MaterialCommunityIcons name="camera-plus"
                                                       style={Styles.scanBoxIcon}
                                                       size={40}/> : null} */}
        <CText style={Styles.scanBoxText}>{title}</CText>
        <CText style={Styles.scanBoxDescription}>{description}</CText>
    </TouchableOpacity>
);

const LIVENESS_VERIFICATION_PENDING = 'LIVENESS_VERIFICATION_PENDING'

export  {
    KYC_SEGMENT,
    FIND_USER_SEGMENT,
    SIGN_UP_CONSTANT,
    CONTACT_PREFERENCES,
    IDENTIFICATION_TYPE,
    ROUTES_AGAINST_STATUS,
    JOURNEY_BEGIN,
    LIVENESS_VERIFICATION_PENDING,
    openWhatsApp,
    errorPopup,
    ScanBox
}

