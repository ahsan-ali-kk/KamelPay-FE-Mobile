import React, {forwardRef, useImperativeHandle, useState} from "react";
import {View} from "react-native";
import {ViewContainer} from "../../../containers";
import Styles from './UserConfirmation.style';
import AuthStyles from '../../auth/Auth.style';
import {CButton, CModal, CText, CToggleSwitch} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {MappedElement, maskMiddle} from "../../../utils/methods";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";

const UserConfirmation = forwardRef((props, ref) => {

    const { t } = useTranslation();

    const {data, reFind, confirm} = props;

    const [isOpen, updateIsOpen] = useState(false);
    const [addBeneficiary, updateAddBeneficiary] = useState(true);

    useImperativeHandle(ref, () => ({
        toggleModal(val) {
            updateIsOpen(val);
        },
    }));

    const modalClose = (value = false) => {
        updateIsOpen(value)
    };

    const headerProps = {
        headerRight: true,
        backOnPress:() => modalClose()
    };

    const renderFooter = () => {
        return(
            <View style={GlobalStyle.listFooterButton}>
                <CButton
                    title={t('GLOBAL.CONFIRM')}
                    onPress={() => {
                        confirm({
                            addBeneficiary
                        })
                    }}
                />
                <CButton
                    type={'without_outline'}
                    title={t("GLOBAL.TRY_ANOTHER")}
                    onPress={reFind}
                />
            </View>
        )
    };

    const renderItem = (label, value, i) => {
        return (
            <View key={i} style={Styles.listItem}>
                <CText style={Styles.listItemLabel}>{t(label)}</CText>
                <CText style={[Styles.listItemValue, !value && Styles.listItemValueRed]}>{value || t('GLOBAL.TRY_AGAIN')}</CText>
            </View>
        )
    };

    const displayData = [
        {
            titleKey: t('RECEIPT.TRANSFER_ID'),
            value: data?.walletID || ''
        },
        {
            titleKey: t('RECEIPT.RECEIVER_ACCOUNT_TITLE'),
            value: data?.user?.fullName || ''
        },
        {
            titleKey: t('RECEIPT.RECEIVER_NUMBER'),
            value: data?.user?.phone ? maskMiddle(data?.user?.phone) : ''
        }
    ];

    const toggleAddBeneficiary = () => {
        updateAddBeneficiary(!addBeneficiary)
    };

    return (
        <CModal headerProps={headerProps}
                isOpen={isOpen}
                close={() => modalClose()}
                renderFooter={renderFooter}
        >
            <ViewContainer scrolled={true} contentContainerStyle={AuthStyles.scrollContainer}>

                <View style={[AuthStyles.titleAndText, {marginTop: 30}]}>
                    <CText style={AuthStyles.title}>
                        {t("GLOBAL.REVIEW_YOUR_DETAILS")}
                    </CText>
                    <CText style={AuthStyles.text}>
                        {t("GLOBAL.REVIEW_YOUR_DETAILS_CONFIRMATION")}
                    </CText>
                </View>

                <View style={GlobalStyle.toggleView}>
                    <CText style={GlobalStyle.toggleViewText}> {t('SECTION_LABELS.ADD_BENEFICIARY')} </CText>
                    <CToggleSwitch style={{}} onToggle={() => toggleAddBeneficiary()} isOn={addBeneficiary} />
                </View>

                <MappedElement
                    data={displayData}
                    renderElement={(item, i) => renderItem(item.titleKey, item?.value, i)}
                />

            </ViewContainer>
        </CModal>
    )
});

export default React.memo(UserConfirmation)
