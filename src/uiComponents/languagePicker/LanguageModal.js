import React, {useState, memo, useEffect} from "react";
import { useTranslation } from "react-i18next";
import {View, I18nManager, ScrollView} from "react-native";
import {MappedElement} from "../../utils/methods";
import {LANGUAGE} from "../../utils/asyncStorage/Constants";
import {_setDataToAsyncStorage} from "../../utils/asyncStorage/Functions";
import RNRestart from 'react-native-restart';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CListItem, CModal, CButton} from "../index";
import {themes} from "../../theme/colors";
import Styles from "../../pages/settings/Settings.style";
import {useDispatch, useSelector} from "react-redux";
import {toggleLanguageModal} from "../../store/actions/Global.action";
import {languages} from "./LanguagePicker";

//array with all supported languages

const LanguageModal = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation(); //i18n instance
    const [isSelected, updateIsSelected] = useState(languages[0]);

    const reduxState = useSelector(({global}) => {
        return {
            isOpenLanguagePicker: global.isOpenLanguagePicker
        }
    });
    

    useEffect(()=>{
        if(reduxState?.isOpenLanguagePicker && isSelected.name !== i18n.language){
            updateIsSelected(languages?.find(item=> item?.name === i18n.language))
        }
    },[reduxState?.isOpenLanguagePicker])


    const submit = async () => {
        onClose();
        await _setDataToAsyncStorage(LANGUAGE, JSON.stringify(isSelected));
        I18nManager.forceRTL(isSelected ? isSelected?.direction !== 'ltr' : false);
        I18nManager.allowRTL(isSelected ? isSelected?.direction !== 'ltr' : false);
        RNRestart.Restart();
    };

    const LanguageItem = (item) => {
        let selected = Object.keys(isSelected).length ? isSelected?.name : i18n.language;
        return (
            <CListItem
                resizeMode={'contain'}
                style={[GlobalStyle.paddingHorizontal_0, {
                    borderTopWidth: item?.index === 0 ? 0 : 1,
                    borderBottomWidth: 0,
                    borderColor: themes['light'].colors.lighten,
                }]}
                localSource={item?.icon}
                titleStyle={{lineHeight: 24}}
                iconRadius={0}
                title={t(item?.label)}
                onPress={() => updateIsSelected(item)}
                {...(item?.name === (selected) ? {
                    rightIconName: 'tick',
                    description: t(item?.subTitle)
                } : {})}
            />
        )
    };

    const onClose = () => {
        dispatch(toggleLanguageModal(false))
    };

    return (
        <CModal
            headerProps={{
                headerTitle: t('SECTION_LABELS.SELECT_LANGUAGE'),
                backOnPress: () => onClose()
            }}
            isOpen={reduxState?.isOpenLanguagePicker}
            close={() => onClose()}>
            <ScrollView contentContainerStyle={Styles.listContainer}>
                <MappedElement
                    data={languages}
                    renderElement={(lang, index) => <LanguageItem index={index} {...lang} key={lang.name} />}
                />
            </ScrollView>
            <View style={GlobalStyle.listFooterButton}>
                <CButton title={'Ok'} onPress={() => submit()}/>
            </View>
        </CModal>
    );
};

export default memo(LanguageModal);