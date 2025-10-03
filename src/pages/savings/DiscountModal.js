import React from "react";
import {TouchableOpacity, View, Linking} from "react-native";
import {CButton, CText, ProgressiveImage, CModal} from "../../uiComponents";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import Feather from "react-native-vector-icons/Feather";
import Style from "./DiscountModal.style";
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';
import {handleSuccess} from "../../utils/methods";
import {renderFlatOrPercentage} from "./Savings";

function DiscountModal(props) {
    const { t, i18n } = useTranslation();

    const {loading, onClose, isOpen, selected} = props;

    const viewStore = () => {
        let url = selected?.offerUrl;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
    };

    const copyCode = () => {
        Clipboard.setString(selected?.code);
        handleSuccess(t('GLOBAL.COPY_CODE_SUCCESS'))
    };

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => onClose()}>
            <View style={[GlobalStyle.centerModalCenterViewContainer]}>

               <View style={[GlobalStyle.centerModalCenterVectorContainer, {marginVertical: 10}]}>
                   <ProgressiveImage
                       style={GlobalStyle.centerModalCenterVector}
                       source={require('../../assets/images/discount-vector.png')}/>
               </View>

                <CText style={[GlobalStyle.centerModalCenterViewTitle]}>
                    {selected?.title}
                </CText>

                <View style={[GlobalStyle.centerModalCenterViewBody, {alignItems: 'center'}]}>

                    <View style={Style.offerList}>
                        {renderFlatOrPercentage(selected) ? <View style={Style.offerListItem}>
                            <KamelpayIcon name="offers" style={Style.offerListItemIcon}/>
                            <CText style={Style.offerListItemText}> {renderFlatOrPercentage(selected)} </CText>
                        </View> : null}
                        <View style={Style.separator}/>
                        {selected?.validTo ? <View style={Style.offerListItem}>
                            <Feather name="clock" style={Style.offerListItemIcon}/>
                            <CText style={Style.offerListItemText}> {moment(selected?.validTo).format('DD/MM/YY')} </CText>
                        </View> : null}
                    </View>

                    <View style={Style.codeView}>
                        <CText style={Style.codeViewText}> {t('GLOBAL.CLICK_AND_COPY_CODE')} </CText>
                        <TouchableOpacity style={Style.codeViewButton} onPress={() => copyCode()}>
                            <CText style={Style.codeViewButtonText}>{selected?.code}</CText>
                            <Feather name="copy" style={Style.codeViewButtonIcon}/>
                        </TouchableOpacity>
                    </View>

                    <View style={Style.termsView}>
                        <CText style={Style.termsViewTitle}>{t('GLOBAL.TERMS_AND_CONDITION')}</CText>
                        <CText style={Style.termsViewText}>{selected?.termsConditions}</CText>
                    </View>

                </View>

                {selected?.offerUrl ?
                <CButton buttonStyle={Style.bottomButton}
                         loading={false}
                         onPress={() => viewStore()}
                         title={t('K_S.VIEW_STORE')}/>
                : null}

                <CButton title={t('GLOBAL.CANCEL')}
                         type={'without_outline'}
                         loading={loading}
                         onPress={() => onClose()}/>

            </View>
        </CModal>
    )
}

export default React.memo(DiscountModal)
