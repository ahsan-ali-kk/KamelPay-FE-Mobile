import React from "react";
import {View} from "react-native";
import {ViewContainer} from "../../../containers";
import Styles from './Confirmation.style';
import AuthStyles from '../../../pages/auth/Auth.style';
import {CButton, CText} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {MappedElement} from "../../../utils/methods";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import { parse, format } from "date-fns";

function Confirmation(props) {
    const { t } = useTranslation();

    const {reScan, confirm, loading, data, buttonText} = props;

    const renderFooter = () => {
        return(
            <View style={GlobalStyle.listFooterButton}>
                <CButton title={buttonText ? buttonText : t('GLOBAL.CONFIRM')} loading={loading} onPress={confirm}/>
                <CButton type={'without_outline'} title={t('PASSPORT_CONFIRMATION.RE_SCAN_PASSPORT')} onPress={reScan}/>
            </View>
        )
    };

    const getFirstName = () => {
        return data?.passport?.given_name || ''
    };

    const renderItem = (label, value, i) => {
        return (
            <View key={i} style={Styles.listItem}>
                <CText style={Styles.listItemLabel}>{t(label)}</CText>
                <CText style={[Styles.listItemValue, !value && Styles.listItemValueRed]}>{value || 'Try Again'}</CText>
            </View>
        )
    };

    const getGender = (val) => {
        return val === 'M' ? 'Male' : val === 'F' ? 'Female': ''
    };

    const getFullName = (obj) => {
        return (obj?.given_name || obj?.surname) ? `${obj?.given_name ? obj?.given_name : ''} ${obj?.surname ? ' ' + obj?.surname : ''}` : ''
    };


    const formatDate = (val) => {
        if (!val) return "";

        // try dash format first
        let parsed = parse(val, "yyyy-mm-dd", new Date());

        // if failed, try slash format
        if (isNaN(parsed.getTime())) {
            parsed = parse(val, "yyyy/mm/dd", new Date());
        }

        return isNaN(parsed.getTime()) ? "" : format(parsed, "dd/mm/yyyy");
    };

    const displayData = [
        {
            titleKey: 'FIELDS_LABELS.PASSPORT',
            value: data?.passport?.passport_number || ''
        },
        {
            titleKey: 'FIELDS_LABELS.FULL_NAME',
            value: getFullName(data?.passport) || ''
        },
        {
            titleKey: 'FIELDS_LABELS.NATIONALITY',
            value: data?.passport?.country_code || ''
        },
        {
            titleKey: 'FIELDS_LABELS.DOB',
            value: formatDate(data?.passport?.date_of_birth)
        },
        {
            titleKey: 'FIELDS_LABELS.GENDER',
            value: getGender(data?.passport?.sex || '')
        },
        {
            titleKey: 'FIELDS_LABELS.EXPIRY_DATE',
            value: formatDate(data?.passport?.date_of_expiry)
        }
    ];

    return (
        <ViewContainer scrolled={true}
                       renderFooter={renderFooter}
                       contentContainerStyle={AuthStyles.scrollContainer}>

            <View style={[AuthStyles.titleAndText, {marginTop: 30}]}>
                <CText style={AuthStyles.title}>{t('PASSPORT_CONFIRMATION.TITLE')}</CText>
                <CText style={AuthStyles.text}>
                    {t('PASSPORT_CONFIRMATION.SUB_FIRST_TITLE')} {getFirstName()}! {t('PASSPORT_CONFIRMATION.SUB_TITLE')}
                </CText>
            </View>

            <MappedElement
                data={displayData}
                renderElement={(item, i) => renderItem(item.titleKey, item?.value, i)}
            />

        </ViewContainer>
    )
}

export default React.memo(Confirmation)
