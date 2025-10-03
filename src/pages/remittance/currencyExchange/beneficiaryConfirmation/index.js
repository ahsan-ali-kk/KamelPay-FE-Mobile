import React, {forwardRef, useImperativeHandle, useState} from "react";
import {View} from "react-native";
import {ViewContainer} from "../../../../containers";
import AuthStyles from '../../../auth/Auth.style';
import {CButton, CModal, CText} from "../../../../uiComponents";
import Style from "./BeneficiaryConfirmation.style";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import {showNumberInBank} from "../../remittanceBeneficiaryDetails/Form";

const BeneficiaryConfirmation = forwardRef((props, ref) => {

    const { t } = useTranslation();

    const {onClose, onConfirm} = props;
    const [isOpen, updateIsOpen] = useState(false);
    const [selectedData, updateSelectedData] = useState(null);

    useImperativeHandle(ref, () => ({
        toggleModal(val = false, data = null) {
            updateIsOpen(val);
            updateSelectedData(data)
        },
    }));

    const onCloseHandle = () => {
        updateIsOpen(false);
        updateSelectedData(null)
        onClose && onClose()
    };

    const onConfirmHandle = () => {
        updateIsOpen(false);
        updateSelectedData(null)
        onConfirm && onConfirm(selectedData)
    };

    const headerProps = {
        headerTitle: t('PAGE_TITLE.REVIEW'),
        headerRight: true,
        backOnPress: onCloseHandle
    };

    const renderItem = (name, value) => {
        return value ? (
            <View style={Style.listItem}>
                <CText style={Style.listItemTitle}>{t(name)}</CText>
                <CText style={Style.listItemValue}>
                    {value}
                </CText>
            </View>
        ) : null
    }

    return (
        <CModal
            isOpen={isOpen}
            transparent={false}
            headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={AuthStyles.scrollContainer}>
                <View style={[AuthStyles.titleAndText, {marginTop: 30, marginBottom: 30}]}>
                    <CText style={AuthStyles.title}>{t('SEND_MONEY.BENEFICIARY_CONFIRMATION')}</CText>
                    <CText style={AuthStyles.text}>
                        {t('SEND_MONEY.REVIEW_BENEFICIARY_SELECTION')}
                    </CText>
                </View>

                <View style={Style.list}>
                    {renderItem('RECEIPT.RECEIVER', selectedData?.otherDetails?.BeneficiaryFirstName ?
                        `${selectedData?.otherDetails?.BeneficiaryFirstName} ${selectedData?.otherDetails?.BeneficiaryLastName}`
                    : '')}
                    {(showNumberInBank(selectedData?.bank?.BankType, selectedData?.country)  || selectedData?.bank?.BankType !== 'BankAccount' || selectedData?.bank?.SpecialBank) && selectedData?.otherDetails?.BeneficiaryMSISDN
                        ? renderItem('RECEIPT.RECEIVER_NUMBER', `+${selectedData?.otherDetails?.BeneficiaryMSISDN}`)
                    : null}
                    {renderItem('RECEIPT.BANK_NAME', selectedData?.bank?.BankName)}
                    {renderItem('RECEIPT.BRANCH_NAME', selectedData?.bank?.BranchName)}
                    {renderItem('RECEIPT.RECEIVER_ACCOUNT_TITLE', selectedData?.otherDetails?.AccountTitle)}
                    {renderItem('RECEIPT.RECEIVER_ACCOUNT_NUMBER', selectedData?.otherDetails?.BeneficiaryAccountNo)}

                </View>

            </ViewContainer>
           <View style={GlobalStyle.margin_horizontal_30}>
               <CButton title={t('GLOBAL.CONFIRM')} onPress={onConfirmHandle}/>
               <CButton title={t('GLOBAL.BACK')} type="without_outline" onPress={onCloseHandle}/>
           </View>
        </CModal>
    )
})

export default React.memo(BeneficiaryConfirmation)
