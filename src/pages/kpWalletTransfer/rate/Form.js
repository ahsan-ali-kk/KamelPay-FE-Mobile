import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CText} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {useTranslation} from "react-i18next";
import Style from "../../topUp/TopUp.style";
import {FormatNumberWithCommas} from "../../../utils/methods";
import ASStyles from '../../advanceSalary/AdvanceSalary.style';

function CForm(props) {
    const { t, i18n } = useTranslation();

    const {submit, loading, selectedCountry, data} = props;

    const form = useRef(null);

    const charges = Number(data?.feesAmount);
    const eligibleMaxAmount = Number(data?.eligibleMaxAmount);
    const maxAmount = eligibleMaxAmount - charges;

    const getTotalAmount = (amount) => {
        let val = Number(amount);
        val += charges;
        return  val
    };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{}}
            validationSchema={Validations({maxAmount})}
        >
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                    <View style={Styles.formContainer}>
                        <View style={Styles.formInnerContainer}>

                        <View style={[ASStyles.eligibleAmountContainer, {marginTop: -15, marginBottom: 20}]}>
                                    <CText style={ASStyles.eligibleAmountTitle}>
                                        {t("GLOBAL.MAX_AMOUNT")}
                                    </CText>
                                    <FormatNumberWithCommas
                                        value={maxAmount}
                                        currency={'AED'}
                                        styleAmount={ASStyles.eligibleAmount}
                                        numberOfLines={1}
                                    />
                                </View>

                            <CInput
                                inputLabelStyle={Styles.inputLabel}
                                inputInnerContainerStyle={Styles.inputInnerContainerStyle}
                                countryView={Styles.inputCountryView}
                                style={Styles.inputView}
                                placeholder={'0.00'}
                                type="number"
                                disabled={true}
                                selectedCountry={{
                                    flags: {
                                        png: selectedCountry?.flags?.png
                                    },
                                    detail:{
                                        code: selectedCountry?.cioc
                                    }

                                }}
                                countryViewLoading={false}
                                onPress={() => null}
                                keyboardType={'numeric'}
                                value={values?.amount?.toString()}
                                onChangeText={val => {
                                    const regex = /^[0-9]\d*(\.\d*)?$/;
                                    if (regex.test(val) || val === '') {
                                        handleChange('amount')(val)
                                    }
                                }}
                                error={t(errors.amount)}
                                returnKeyType="next"
                                onSubmitEditing={() => handleSubmit()}
                                {...(values?.amount?.toString() ? { rightIconName : 'close'} : null)}
                                toggleRightIconFunc={() => handleChange('amount')('')}
                            />

                            <View style={Style.confirmInfoList}>

                                <View style={Style.confirmInfoListItem}>
                                    <CText style={Style.confirmInfoListItemText}>
                                        {t('RECEIPT.TRANSFER_AMOUNT')}
                                    </CText>
                                    <FormatNumberWithCommas
                                        value={values?.amount ? values?.amount : 0}
                                        currency={Object.keys(selectedCountry?.currencies)}
                                        styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View style={Style.confirmInfoListItem}>
                                    <CText style={Style.confirmInfoListItemText}>
                                        {t('RECEIPT.CHARGES')}
                                    </CText>
                                    <FormatNumberWithCommas
                                        value={charges || 0}
                                        currency={Object.keys(selectedCountry?.currencies)}
                                        styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                        numberOfLines={1}
                                    />
                                </View>

                            </View>

                            <View style={Style.confirmInfoListSeparator}/>

                            <View style={Style.confirmInfoListItem}>
                                <CText style={[Style.confirmInfoListItemText, Style.textBold]}>
                                    {t('RECEIPT.TOTAL_AMOUNT')}
                                </CText>
                                <FormatNumberWithCommas
                                    value={getTotalAmount(values.amount)}
                                    currency={Object.keys(selectedCountry?.currencies)}
                                    styleAmount={[Style.confirmInfoListItemText, Style.textBold, Style.textRight, Style.primaryText]}
                                    numberOfLines={1}
                                />
                            </View>

                        </View>

                        <CButton title={t('GLOBAL.NEXT')} loading={loading} onPress={() => handleSubmit()}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
