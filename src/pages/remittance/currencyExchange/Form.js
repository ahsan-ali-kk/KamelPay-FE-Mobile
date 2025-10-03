import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import Validations from './Validations';
import { View } from 'react-native';
import { CButton, CInput, ProgressiveImage, CText, AlertView, RangeSlider } from '../../../uiComponents';
import Styles from './CurrencyExchange.style';
import {
    formatAmount,
    FormatNumberWithCommas,
    getAdvanceFees,
    getValidation, numberWithToFix,
    SERVICES
} from "../../../utils/methods";
import { ReferralCode, ViewContainer } from "../../../containers";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import Style from "../../topUp/TopUp.style";
import KamelPayIcon from "../../../assets/icons/KamelPayIcon";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { renderRemittanceCounter } from "../../home/Home";

function CForm({ submit, submitLoading, data, onChange, onChangeWithoutDebounce, applyPromo, module }) {

    const { t } = useTranslation();
    const form = useRef();
    const dispatch = useDispatch();

    const reduxState = useSelector(({ auth, global, remittance, advanceSalary }) => {
        return {
            getCurrencyLoading: remittance.helloPaisaGetCurrencyLoading,
            currencyInfo: remittance.helloPaisaGetCurrency,
            currentCountry: global.currentCountry,
            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility,
            user: auth.user,
            populars: global.populars,
            masterDetails: global.masterDetails,
        }
    });

    const { currencyInfo, currentCountry: selectedCountry, getCurrencyLoading, advanceSalaryDetails,
        populars, masterDetails } = reduxState;

    const [advanceSalaryFeesAndVat, updateAdvanceSalaryFeesAndVat] = useState({});
    const [exchangeRate, updateExchangeRate] = useState('');

    useEffect(() => {

        if (currencyInfo && currencyInfo?.singleAmountUnit) {
            updateExchangeRate(currencyInfo?.singleAmountUnit);
        }

        if (currencyInfo && form?.current?.values?.sender && Number(currencyInfo?.amountInForeignCurrencyReceivable)) {
            form?.current?.setFieldValue('receiver', numberWithToFix(currencyInfo?.amountInForeignCurrencyReceivable));
        }

        if (currencyInfo && form?.current?.values?.receiver && Number(currencyInfo?.amountInAED)) {
            if (module !== 'SNPL') {
                form?.current?.setFieldValue('sender', numberWithToFix(currencyInfo?.amountInAED));
            }
        }

    }, [currencyInfo]);

    useEffect(() => {
        if (module === 'SNPL' && advanceSalaryDetails) {
            let minAmount = getValidation(advanceSalaryDetails, t)?.max || 0;
            onChangeSender(minAmount);
        }
    }, [advanceSalaryDetails]);

    const onChangeSender = (val) => {
        if (module === 'SNPL') {
            updateAdvanceSalaryFeesAndVat(getAdvanceSalaryFeesAndVat(val));
            let amount1 = (val - getAdvanceSalaryFeesAndVat(val).grandTotal);
            let amount2 = (val);
            form?.current?.setFieldValue('sender', numberWithToFix(amount2));
            if (amount1 > 0) onChangeWithoutDebounce(amount1.toString(), 'SENDER', form?.current?.values.promo);
            if (!amount1) { form?.current?.setFieldValue('receiver', ''); }
        } else {
            form?.current?.setFieldValue('sender', numberWithToFix(val));
            if (val > 0) onChange(val.toString(), 'SENDER', form?.current?.values.promo);
            if (!val) { form?.current?.setFieldValue('receiver', ''); }
        }
    };
    const onChangeReceiver = (val) => {
        form?.current?.setFieldValue('receiver', numberWithToFix(val));
        if (val > 0) onChange(val.toString(), 'RECEIVER', form?.current?.values.promo);
        if (!val) { form?.current?.setFieldValue('sender', ''); }
    };

    const checkDisable = (values) => {
        let c = false;
        if (!values?.sender || values?.sender < 1) {
            c = true;
        }
        if (!values?.receiver || values?.receiver < 1) {
            c = true;
        }
        if (!values?.promo) {
            c = true
        }
        return c
    };

    const removePromo = (values) => {
        form?.current?.setFieldValue('promo', '');
        let updatedValues = _.omit(values, ['promo']);
        applyPromo(updatedValues)
    };

    const getAdvanceSalaryFeesAndVat = (sender) => {
        let feeBracket = getAdvanceFees(advanceSalaryDetails?.feesBrackets, sender);
        let platformFee = feeBracket ? (feeBracket?.platformFee || 0) - (feeBracket?.platformFeeVat || 0) : 0;
        let fee = feeBracket ? (feeBracket?.fees || 0) - (feeBracket?.vatAmount || 0) : 0;
        let vat = feeBracket ? (feeBracket?.vatAmount || 0) + (feeBracket?.platformFeeVat || 0) : 0;
        return {
            platformFee: platformFee,
            fee: fee,
            vat: vat,
            totalFee: platformFee + fee,
            grandTotal: platformFee + fee + vat
        }
    };
    const getRemittanceFeeAndVat = () => {
        return {
            fee: Number(currencyInfo?.totalFee) || 0,
            vat: Number(currencyInfo?.totalVat) || 0
        }
    };
    const getTotalVat = () => {
        return (advanceSalaryFeesAndVat?.vat || 0) + getRemittanceFeeAndVat().vat || 0
    };
    const getTransferAmount = (sender) => {
        let totalFees = getRemittanceFeeAndVat().fee + (advanceSalaryFeesAndVat?.fee || 0) + (advanceSalaryFeesAndVat?.platformFee || 0);
        let totalVat = getTotalVat();
        return sender - (totalFees + totalVat) || 0;

    };
    const getTotalAmount = (senderValue) => {
        if (module !== 'SNPL') {
            return senderValue && currencyInfo?.totalAmount || 0
        } else {
            return senderValue
        }
    };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit({ ...values, amountInAED: currencyInfo?.amountInAED })}
            initialValues={{
                sender: '',
                receiver: '',
            }}
            validationSchema={Validations}
        >
            {({ handleChange, values, handleSubmit, errors }) => {
                return (
                    <ViewContainer scrolled={true}
                        renderFooter={() => {
                            return (
                                <View style={[Styles.bottomView, GlobalStyle.topBorder]}>
                                    <CButton disabled={getCurrencyLoading || !values?.sender || !values?.receiver}
                                        title={t('GLOBAL.NEXT')}
                                        loading={submitLoading || getCurrencyLoading}
                                        onPress={() => handleSubmit()} />
                                    <View style={Styles.bottomFooterImage}>
                                        <ProgressiveImage style={GlobalStyle.listSecondHeaderRightImage}
                                            source={require('../../../assets/images/hellopaisa-logo.png')} />
                                    </View>
                                </View>
                            )
                        }}
                        contentContainerStyle={Styles.scrollContainer}>
                        <View style={Styles.formContainer}>

                            <CText style={Styles.title}>{t('SEND_MONEY.INTERNATIONAL_REMITTANCE')}</CText>

                            <View style={Styles.formInnerContainer}>

                                <View style={Styles.inputsContainer}>
                                    <View style={Styles.inputsContainerLeft}>
                                        {module !== 'SNPL' ? <CInput
                                            inputSubLabel={t('FIELDS_LABELS.SENDER')}
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
                                                detail: {
                                                    code: selectedCountry?.cioc
                                                }

                                            }}
                                            countryViewLoading={getCurrencyLoading}
                                            onPress={() => null}
                                            keyboardType={'numeric'}
                                            value={values.sender.toString()}
                                            onChangeText={val => onChangeSender(val)}
                                            error={t(errors.sender)}
                                            returnKeyType="done"
                                            {...(values.sender.toString() ? { rightIconName: 'close' } : null)}
                                            toggleRightIconFunc={() => onChangeSender('')}
                                        /> : <RangeSlider
                                            subLabel={t('FIELDS_LABELS.SENDER')}
                                            subLabelRight={formatAmount(Number(values.sender), 'AED')}
                                            inputLabelStyle={Styles.inputLabel}
                                            value={Number(values.sender)}
                                            error={t(errors.sender)}
                                            minimumValue={getValidation(advanceSalaryDetails, t)?.min || 0}
                                            maximumValue={getValidation(advanceSalaryDetails, t)?.max}
                                            disabled={getCurrencyLoading}
                                            tapToSeek={true}
                                            step={advanceSalaryDetails?.stepper || 0}
                                            onSlidingComplete={(val) => onChangeSender(val)}
                                        />}
                                        <CInput
                                            isShow={module !== 'SNPL'}
                                            inputSubLabel={t('FIELDS_LABELS.RECEIVER')}
                                            inputLabelStyle={Styles.inputLabel}
                                            inputInnerContainerStyle={Styles.inputInnerContainerStyle}
                                            countryView={Styles.inputCountryView}
                                            style={Styles.inputView}
                                            placeholder={'0.00'}
                                            type="number"
                                            countryViewLoading={getCurrencyLoading}
                                            disabled={getCurrencyLoading}
                                            editable={module !== 'SNPL' && !getCurrencyLoading}
                                            selectedCountry={{
                                                flags: {
                                                    png: data?.country?.FlagPng || data?.country?.flagPng
                                                },
                                                detail: {
                                                    code: data?.country?.CIOC || data?.country?.cioc,
                                                }
                                            }}
                                            onPress={() => null}
                                            keyboardType={'numeric'}
                                            value={values.receiver.toString()}
                                            onChangeText={val => onChangeReceiver(val)}
                                            error={t(errors.receiver)}
                                            {...(values.receiver.toString() ? { rightIconName: 'close' } : null)}
                                            toggleRightIconFunc={() => onChangeReceiver('')}
                                        />
                                    </View>
                                    {module !== 'SNPL' ? <View style={Styles.inputsCenterIconContainer}>
                                        <KamelPayIcon style={Styles.inputsCenterIcon} name="exchange" />
                                    </View> : null}
                                </View>

                                <View style={Styles.separatorView}>
                                    <View style={Styles.rateTitleContainer}>
                                        <CText style={[Styles.rateTitle, Styles.rateSubTitle]}>
                                            {t('SEND_MONEY.EXCHANGE_RATE')}
                                        </CText>
                                        <FormatNumberWithCommas
                                            value={'1'}
                                            currency={Object.keys(selectedCountry?.currencies)}
                                            styleAmount={Styles.rateTitle}
                                            numberOfLines={1}
                                        />
                                        <CText style={Styles.rateTitle}> =  </CText>
                                        <FormatNumberWithCommas
                                            truncatedValue={exchangeRate * 1 || 0}
                                            currency={data?.country?.Currency}
                                            styleAmount={Styles.rateTitle}
                                            numberOfLines={1}
                                        />
                                    </View>
                                    {module !== 'SNPL' ? renderRemittanceCounter(
                                        {
                                            countNumber: masterDetails?.remittanceOfferCounter,
                                            count: populars?.remittanceCount,
                                            offer: populars?.remittanceOfferTitle
                                        },
                                        {
                                            container: Styles.counterStyle,
                                            innerContainer: Styles.counterInnerContainerStyle,
                                            iconItemStyle: Styles.counterIconItemStyle,
                                            iconStyle: Styles.counterIconStyle,
                                            textStyle: Styles.counterTextStyle,
                                            offerTextStyle: Styles.offerTextStyle
                                        }
                                    ) : null}
                                    {module === 'SNPL' ? <AlertView
                                        showIcon={false}
                                        viewStyle={{
                                            marginTop: -10,
                                            marginBottom: 20,
                                            paddingVertical: 15,
                                        }}
                                        title={'Note:'}
                                        text={'Exchange rate is an estimate. It may change depending on the rate at the time of Advance Salary Application approval'}
                                    /> : null}
                                </View>

                                {module !== 'SNPL' && currencyInfo?.offerDetails?.title ? <AlertView disabled viewStyle={{ marginTop: 20 }} text={currencyInfo?.offerDetails?.title} type='offers' /> : null}

                                <CInput
                                    isShow={module !== 'SNPL'}
                                    inputLabel={t('FIELDS_LABELS.DISCOUNT_CODE')}
                                    inputContainerStyle={{
                                        marginBottom: 5,
                                        marginTop: 20
                                    }}
                                    placeholder={t('FIELDS_LABELS.DISCOUNT_CODE_PLACEHOLDER')}
                                    value={values.promo}
                                    onChangeText={val => handleChange('promo')(val)}
                                    editable={!getCurrencyLoading && !currencyInfo?.promoDetails?.promo}
                                    error={currencyInfo?.promoError}
                                    rightButton={() => {
                                        return (
                                            <CButton
                                                buttonStyle={GlobalStyle.inputRightButton}
                                                buttonText={GlobalStyle.inputRightButtonText}
                                                disabled={checkDisable(values)}
                                                loading={getCurrencyLoading}
                                                title={getCurrencyLoading ? '' : currencyInfo?.promoDetails?.promo ? t('GLOBAL.REMOVE') : t('GLOBAL.APPLY')}
                                                onPress={() => currencyInfo?.promoDetails?.promo ? removePromo(values) : applyPromo(values)}
                                            />
                                        )
                                    }}
                                    onSubmitEditing={() => {
                                        currencyInfo?.promoDetails?.promo ? removePromo(values) : applyPromo(values)
                                    }}
                                    onBlur={() => {
                                        currencyInfo?.promoDetails?.promo ? removePromo(values) : applyPromo(values)
                                    }}
                                />

                                <ReferralCode
                                    inputContainerStyle={{ marginBottom: 5, marginTop: 20 }}
                                    service={module === 'SNPL' ? SERVICES.ADVANCE_REMITTANCE._id : SERVICES.REMITTANCE._id}
                                    loading={getCurrencyLoading}
                                />

                                <CText style={Style.confirmInfoListHeaderText}>
                                    {t('RECEIPT.TRANSFER_AMOUNT_AND_CHARGES')}
                                </CText>

                                <View style={Style.confirmInfoList}>

                                    {module !== 'SNPL' ? <Fragment>
                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.TRANSFER_AMOUNT')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={values.sender && values.receiver && currencyInfo?.amountInForeignCurrency || 0}
                                                currency={data?.country?.Currency}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>
                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.CHARGES')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={values.sender && values.receiver && currencyInfo?.totalFee || 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>
                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.VAT')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={values.sender && values.receiver && currencyInfo?.totalVat || 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>
                                        {values.sender && values.receiver && currencyInfo?.mode ? <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t(`RECEIPT.${currencyInfo?.mode}`)}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={`${currencyInfo?.mode === 'DISCOUNT' ? '-' : ''}` + currencyInfo?.discountAmount || 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View> : null}
                                        {values.sender && values.receiver && currencyInfo?.tat ? <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.TAT')}
                                            </CText>
                                            <CText style={[Style.confirmInfoListItemText, Style.textRight]}>
                                                {currencyInfo?.tat}
                                            </CText>
                                        </View> : null}
                                    </Fragment> : <Fragment>

                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.TRANSFER_AMOUNT')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={!getCurrencyLoading && values.sender && values.receiver ? getTransferAmount(values.sender) : 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>

                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.PLATFORM_FEE')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={!getCurrencyLoading && values.sender && values.receiver ? advanceSalaryFeesAndVat.platformFee || 0 : 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>

                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.ADVANCE_SALARY_FESS')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={!getCurrencyLoading && values.sender && values.receiver ? advanceSalaryFeesAndVat.fee || 0 : 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>

                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.REMITTANCE_CHARGERS')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={!getCurrencyLoading && values.sender && values.receiver ? getRemittanceFeeAndVat().fee : 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>

                                        <View style={Style.confirmInfoListItem}>
                                            <CText style={Style.confirmInfoListItemText}>
                                                {t('RECEIPT.VAT')}
                                            </CText>
                                            <FormatNumberWithCommas
                                                value={!getCurrencyLoading && values.sender && values.receiver ? getTotalVat() : 0}
                                                currency={Object.keys(selectedCountry?.currencies)}
                                                styleAmount={[Style.confirmInfoListItemText, Style.textRight]}
                                                numberOfLines={1}
                                            />
                                        </View>

                                    </Fragment>}

                                </View>

                                <View style={Style.confirmInfoListSeparator} />

                                <View style={Style.confirmInfoListItem}>
                                    <CText style={[Style.confirmInfoListItemText, Style.textBold]}>
                                        {t('RECEIPT.TOTAL_AMOUNT')}
                                    </CText>
                                    <FormatNumberWithCommas
                                        value={getTotalAmount(values.sender)}
                                        currency={Object.keys(selectedCountry?.currencies)}
                                        styleAmount={[Style.confirmInfoListItemText, Style.textBold, Style.textRight, Style.primaryText]}
                                        numberOfLines={1}
                                    />
                                </View>

                            </View>

                        </View>
                    </ViewContainer>
                );
            }}
        </Formik>
    );
}
export default CForm;
