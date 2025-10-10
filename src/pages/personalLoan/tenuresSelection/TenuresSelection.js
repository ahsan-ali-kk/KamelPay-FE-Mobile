import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CText} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import ASStyles from "../PersonalLoan.style";
import {formatAmount, FormatNumberWithCommas, MappedElement} from "../../../utils/methods";
import Popup from "../../../uiComponents/popup/Popup";
import {foundBracket} from "../helper";
import { AntDesign } from '@react-native-vector-icons/ant-design';

function CForm(props) {

    const { t } = useTranslation();
    const navigation = useNavigation();
    const {amount, tenure, feeBrackets, nextPayloadObj, onSelect} = props;

    const renderInstallmentCount = (noOfInstallment) => {
        switch (Number(noOfInstallment)) {
            case 1:
                return `${noOfInstallment} Month`
            default :
                return `${noOfInstallment} Months`
        }
    }

    const selectInstallment = (obj) => {
        onSelect ? onSelect(obj) : navigation.navigate('personal_loan_additional_question', {
            selectedInstallment: obj,
            nextPayloadObj,
            amount,
            tenure,
            feeBrackets
        })
        Popup.hide()
    };

    const renderInstallmentsItem = (obj, i) => {
        const find = foundBracket(feeBrackets, obj?.amount, obj?.noOfInstallment)
        let amount = Number(obj?.amount).toFixed(0);
        let monthlyProcessingFee = find?.MonthlyProcessingFee ? Number(find?.MonthlyProcessingFee): 0
        amount -= monthlyProcessingFee;
        return obj ? (
            <TouchableOpacity activeOpacity={0.5} key={i} style={ASStyles.installmentListItem} onPress={() => selectInstallment(obj)}>
                <View style={ASStyles.installmentListItemLeft}>
                    <View style={ASStyles.installmentListItemTextContainer}>
                        <CText style={[ASStyles.installmentListItemText]}>Finance Amount Upto : </CText>
                        <CText style={[ASStyles.installmentListItemText, ASStyles.boldText, ASStyles.darkText]}>{formatAmount(amount, "AED", 2, true)}</CText>
                    </View>
                    <View style={ASStyles.installmentListItemTextContainer}>
                        <CText style={ASStyles.installmentListItemText}>Tenure : </CText>
                        <CText style={[ASStyles.installmentListItemText, ASStyles.boldText, ASStyles.dangerText]}>{renderInstallmentCount(obj?.noOfInstallment)}</CText>
                    </View>
                </View>
                <View style={ASStyles.installmentListItemRight}>
                    <AntDesign name={"arrowright"} style={ASStyles.installmentListItemIcon}/>
                </View>
            </TouchableOpacity>
        ) : null
    }
    const renderInstallments = (array = []) => {
        return (
            <View style={ASStyles.installmentList}>
                <MappedElement data={array} renderElement={renderInstallmentsItem}/>
            </View>
        )
    }

    return (
        <View style={[Styles.scrollContainer, {paddingHorizontal: 0}]}>
            <View style={[Styles.formContainer]}>
                <View style={Styles.formInnerContainer}>
                    <View style={[ASStyles.eligibleAmountContainer, {marginTop: 0, flexDirection: 'column'}]}>
                        <CText style={[ASStyles.eligibleAmountTitle, ASStyles.boldText, {marginBottom: 10, fontSize: 12, textAlign: 'center'}]}>
                            As per your salary and expenses you are eligible for monthly installment amount of upto
                        </CText>
                        <FormatNumberWithCommas
                            value={amount}
                            currency={'AED'}
                            styleAmount={ASStyles.eligibleAmount}
                            numberOfLines={1}
                        />
                    </View>
                    <View style={Styles.separateSection}>
                        <View style={Styles.separateSectionHeader}>
                            <CText style={[Styles.title, Styles.separateSectionHeaderTitle, ASStyles.flex_1, {fontSize: 14}]}>
                                Select Finance Amount & Tenure
                            </CText>
                        </View>
                        {renderInstallments(tenure)}
                    </View>
                </View>
            </View>
        </View>
    );
}
export default CForm;
