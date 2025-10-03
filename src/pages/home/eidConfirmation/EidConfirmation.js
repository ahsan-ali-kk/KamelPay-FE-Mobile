import React from "react";
import {View} from "react-native";
import {ViewContainer} from "../../../containers";
import Styles from './EidConfirmation.style';
import AuthStyles from '../../auth/Auth.style';
import {CButton, CModal, CText} from "../../../uiComponents";
import moment from 'moment';
import {useTranslation} from "react-i18next";
import {MappedElement} from "../../../utils/methods";
import {KYC_VENDORS} from "../UpdateEmiratesID";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";

function EidConfirmation(props) {
    const { t } = useTranslation();

    const {reScan, confirm, loading, onClose, data, vendor} = props;

    const headerProps = {
        headerRight: true,
        backOnPress:() => onClose()
    };

    const renderFooter = () => {
        return(
            <View style={[GlobalStyle.listFooterButton, {marginBottom: 54}]}>
                <CButton title={t('GLOBAL.CONFIRM')} loading={loading} onPress={confirm}/>
                <CButton type={'without_outline'} title={t('GLOBAL.RE_SCAN_ID')} onPress={reScan}/>
            </View>
        )
    };

    const getFirstName = () => {
        let name = vendor === KYC_VENDORS.ONE_KYC ?  data?.front?.name || '' : data?.front?.fullName || '';
        return name ? name.split(' ')[0] : ''
    };


    const renderDob = (DOB) => {
        if (new Date(moment(DOB, 'YYDDMM')) > new Date()) {
           return moment(DOB, 'YYDDMM').subtract(100, 'years').format('DD-MM-YYYY')
        } else {
            return moment(DOB, 'YYDDMM').format('DD-MM-YYYY')
        }
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

    const displayData = vendor === KYC_VENDORS.ONE_KYC ? [
        {
            titleKey: 'FIELDS_LABELS.EMIRATES_ID',
            value: data?.front?.id_number || ''
        },
        {
            titleKey: 'FIELDS_LABELS.FULL_NAME',
            value: data?.front?.name || ''
        },
        {
            titleKey: 'FIELDS_LABELS.NATIONALITY',
            value: data?.front?.nationality || ''
        },
        {
            titleKey: 'FIELDS_LABELS.DOB',
            value: data?.back?.date_of_birth || ''
        },
        {
            titleKey: 'FIELDS_LABELS.GENDER',
            value: getGender(data?.front?.sex || '')
        },
        {
            titleKey: 'FIELDS_LABELS.EXPIRY_DATE',
            value: data?.back?.expiry_date || ''
        }
    ] : [
        {
            titleKey: 'FIELDS_LABELS.EMIRATES_ID',
            value: data?.front?.identityNumber || ''
        },
        {
            titleKey: 'FIELDS_LABELS.FULL_NAME',
            value: data?.front?.fullName || ''
        },
        {
            titleKey: 'FIELDS_LABELS.NATIONALITY',
            value: data?.front?.nationality || ''
        },
        {
            titleKey: 'FIELDS_LABELS.DOB',
            value: data?.back?.dateOfBirthFormatted ? moment(data?.back?.dateOfBirthFormatted).format("DD/MM/YYYY") : data?.back?.dateOfBirth ? renderDob(data?.back?.dateOfBirth) : ''
        },
        {
            titleKey: 'FIELDS_LABELS.GENDER',
            value: getGender(data?.back?.sex)
        },
        {
            titleKey: 'FIELDS_LABELS.EXPIRY_DATE',
            value: data?.back?.dateOfExpiryFormatted ? moment(data?.back?.dateOfExpiryFormatted).format("DD/MM/YYYY") : data?.back?.dateOfExpiry ? moment(data?.back?.dateOfExpiry, "YYMMDD").format("DD/MM/YYYY") : ''
        }
    ];

    return (
        <CModal
            isOpen={props?.value}
            transparent={false}
            headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={AuthStyles.scrollContainer}>

                <View style={[AuthStyles.titleAndText, {marginTop: 30}]}>
                    <CText style={AuthStyles.title}>{t('EID_CONFIRMATION.TITLE')}</CText>
                    <CText style={AuthStyles.text}>
                        {t('EID_CONFIRMATION.SUB_FIRST_TITLE')} {getFirstName()}! {t('EID_CONFIRMATION.SUB_TITLE')}
                    </CText>
                </View>

                <MappedElement
                    data={displayData}
                    renderElement={(item, i) => {
                        return renderItem(item.titleKey, item?.value, i)
                    }}
                />

            </ViewContainer>

            {renderFooter()}

        </CModal>
    )
}

export default React.memo(EidConfirmation)
