import React from "react";
import {View} from "react-native";
import {ViewContainer} from "../../../../containers";
import AuthStyles from '../../../auth/Auth.style';
import {CButton, CModal, CText} from "../../../../uiComponents";
import Style from "./Preview.style";
import _ from 'lodash';
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";

function Preview(props) {
    const { t } = useTranslation();

    const {data, value, onClose, onChange, onConfirm} = props;

    const headerProps = {
        headerTitle: t('PAGE_TITLE.REVIEW'),
        headerRight: true,
        backOnPress: () => onClose()
    };

    return (
        <CModal
            isOpen={value}
            transparent={false}
            headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={AuthStyles.scrollContainer}>
                <View style={[AuthStyles.titleAndText, {marginTop: 30, marginBottom: 30}]}>
                    <CText style={AuthStyles.title}>{t('SEND_MONEY.BANK_CONFIRMATION')}</CText>
                    <CText style={AuthStyles.text}>
                        {t('SEND_MONEY.REVIEW_BANK_SELECTION')}
                    </CText>
                </View>

                <View style={Style.list}>

                    <View style={Style.listItem}>
                        <CText style={Style.listItemTitle}>{t('SEND_MONEY.COUNTRY')}</CText>
                        <CText style={Style.listItemValue}>
                            {_.capitalize(data?.country?.Name || data?.country?.name)}
                        </CText>
                    </View>

                    <View style={Style.listItem}>
                        <CText style={Style.listItemTitle}>{t('SEND_MONEY.BANK_TYPE')}</CText>
                        <CText style={Style.listItemValue}>{data?.type?.Name}</CText>
                    </View>

                    <View style={Style.listItem}>
                        <CText style={Style.listItemTitle}>{t('SEND_MONEY.BANK_NAME')}</CText>
                        <CText style={Style.listItemValue}>{data?.bank?.BankName}</CText>
                    </View>

                    {data?.bank?.BranchName ? <View style={Style.listItem}>
                        <CText style={Style.listItemTitle}>{t('SEND_MONEY.BRANCH_NAME')}</CText>
                        <CText style={Style.listItemValue}>{data?.bank?.BranchName}</CText>
                    </View> : null}

                </View>

            </ViewContainer>
           <View style={GlobalStyle.margin_horizontal_30}>
               <CButton  title={t('GLOBAL.CONFIRM')} onPress={() => onConfirm()}/>
               <CButton type="without_outline" title={t('GLOBAL.BACK')} onPress={() => onChange()}/>
           </View>
        </CModal>
    )
}

export default Preview
