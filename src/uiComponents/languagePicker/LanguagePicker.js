import React, {useState, memo} from "react";
import { useTranslation } from "react-i18next";
import {View, TouchableOpacity} from "react-native";
import {CText} from "../index";
import Ionicons from "@react-native-vector-icons/ionicons";
import Styles from "../../pages/settings/Settings.style";
import {toggleLanguageModal} from "../../store/actions/Global.action";
import {useDispatch} from "react-redux";

//array with all supported languages
export const languages = [
    {
        name: "ar",
        label: "Arabic",
        direction: 'rtl',
        subTitle: 'سيظهر التطبيق بهذه الطريقة',
        icon: require('../../assets/images/flags/flag_UAE.png')
    },
    {
        name: "en",
        label: "English",
        direction: 'ltr',
        subTitle: 'App will shown this way',
        icon: require('../../assets/images/flags/flag_UK.png')
    },
    {
        name: "ur",
        label: "Urdu",
        direction: 'rtl',
        subTitle: 'ایپ اس طرح دکھائے گی۔',
        icon: require('../../assets/images/flags/flag_PK.png')
    },
    {
        name: "hi",
        label: "Hindi",
        direction: 'ltr',
        subTitle: 'ऐप इस तरह दिखाएगा',
        icon: require('../../assets/images/flags/flag_IN.png')
    },
    {
        name: "ml",
        label: "Malayalam",
        direction: 'ltr',
        subTitle: 'ആപ്പ് ഈ രീതിയിൽ കാണിക്കും',
        icon: require('../../assets/images/flags/flag_IN.png')
    },
    {
        name: "ta",
        label: "Tamil",
        direction: 'ltr',
        subTitle: 'பயன்பாடு இந்த வழியில் காட்டப்படும்',
        icon: require('../../assets/images/flags/flag_IN.png')
    },
    {
        name: "hn",
        label: "Hinglish",
        direction: 'ltr',
        subTitle: 'App is tarah dikhaega',
        icon: require('../../assets/images/flags/flag_IN.png')
    },
];

const LanguagePicker = (props) => {

    const {type, isVisibleLanguage = true, style} = props;
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation(); //i18n instance

    const getCurrentLanguageObj = (val) => {
        return val ? languages.find(o => o.name === val).label : 'English'
    };

    const open = () => {
        dispatch(toggleLanguageModal(true))
    };

    return (
        <View>
            {type === 'button-icon' ?  <TouchableOpacity style={[Styles.buttonWithIcon, style]}  onPress={() => open()}>
                <Ionicons style={Styles.buttonIcon} name={'language'} />
                {isVisibleLanguage ? <CText style={Styles.buttonText} numberOfLines={1}> {i18n?.language.toUpperCase() || 'EN'}</CText> : null}
            </TouchableOpacity> : <TouchableOpacity style={Styles.listItem}  onPress={() => open()}>

                <View style={Styles.listItemButton}>
                    <Ionicons style={Styles.listItemButtonIcon} name={'language'} />
                </View>
                <CText style={Styles.listItemText} numberOfLines={1}>{getCurrentLanguageObj(i18n.language)}</CText>
            </TouchableOpacity>}

        </View>
    );
};

export default memo(LanguagePicker);
