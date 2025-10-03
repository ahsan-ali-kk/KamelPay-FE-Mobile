import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {Container, ViewContainer} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {checkAmountBiller, clearBillerSkuIo, getBillerSkuIo} from "../../store/actions/PayBill.action";
import Styles from "./Billers.style";
import AuthStyle from "../auth/Auth.style";
import {CButton, CInput, ProgressiveImage, CText, CToggleSwitch} from "../../uiComponents";
import {FieldArray, Formik} from "formik";
import * as Yup from 'yup';
import {mapValues} from "lodash";
import Popup from "../../uiComponents/popup/Popup";
import {convertToSlug} from "../../utils/methods";
import {iconBaseUrl} from "../../utils/intercepter";
import TopUpStyle from "../topUp/TopUp.style";
import {useTranslation} from "react-i18next";

function BillerSkuIo(props) {
    const { t, i18n } = useTranslation();

    const form = useRef(null);

    const { route: { params: data}, navigation } = props;
    const dispatch = useDispatch();

    const slug = convertToSlug(data?.billerType);

    const headerProps = {
        headerTitle: `${t('PAY_BILL.PAY')}  ${data?.billerType} ${slug !== 'mobile_prepaid' ? t('PAY_BILL.PAY') : ''}` ,
        headerRight: true,
    };

    useEffect(() => {
        if(!data?.io) {
            let payload = {
                BillerID: data?.biller?.BillerID,
                SKU: data?.sku?.SKU,
            };
            dispatch(getBillerSkuIo(payload))
        }
        return () => {
            dispatch(clearBillerSkuIo());
        }
    }, []);

    const reduxState = useSelector(({payBill, global}) => {
        return {
            data: payBill.billerSkuIos,
            loading: payBill.billerCheckAmountLoading || payBill.billerSkuIosLoading,
            card: global.selectedCard
        }
    });

    const [flag, setFlag] = useState(true);
    const [validations, setValidations] = useState();

    useEffect(() => {
        if(reduxState.data?.length && flag) {
            modArray(reduxState.data);
            setFlag(false)
        }
    }, [reduxState.data]);

    const submit = (values) => {

        data.io = values.Inputs;

        let inputs = values.Inputs.map(o => ({IOID: o.IOID, value: o.value}));

        let payload = {
            BillerID: data.biller.BillerID,
            SKU: data.sku.SKU,
            Inputs: inputs,
            CardId: reduxState.card._id,
            AddBeneficiary: values?.AddBeneficiary,
            ...(values?.AddBeneficiary && {Alias: values?.Alias}),
        };

        const {sku} = data;

        if (sku?.InquiryAvailable === 1) {
            // Partial, Excess, DueDate
            dispatch(checkAmountBiller({
                ...payload,
                type: 'SOME_CONDITIONS'
            }, checkAmountCallBack))
        } else {
            if (Number(sku?.Amount) === 0) {
                // Min Amount, Max Amount
                navigate({type: 'CUSTOM_AMOUNT'}, payload)
            } else {
                //just pay
                navigate({type: 'DIRECT_PAY'}, payload)
            }
        }
    };

    const checkBillDueDate = (res) => {
        let billDueDate = new Date(res?.BillDueDate).setHours(23, 59, 59);
        return data?.sku?.InquiryAvailable === 1 && data?.sku?.PastDuePaymentAllowed === 0 && (billDueDate <= new Date())
    };

    const checkAmountCallBack = (res, payload, errorCall = false) => {
        if (errorCall) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: t('POPUPS.INVALID_REFERENCE.TITLE'),
                text: t('POPUPS.INVALID_REFERENCE.SUB_TITLE'),
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () => Popup.hide()
                    },
                    {
                        text: t('GLOBAL.CONTACT_US'),
                        callback: () => Popup.hide()
                    }
                ]
            })
        } else {
            if (checkBillDueDate(res)) {
                Popup.show({
                    isVisible: true,
                    type: 'Error',
                    title: t('POPUPS.BILL_PAST.TITLE'),
                    text: t('POPUPS.BILL_PAST.SUB_TITLE'),
                })
            } else {
                navigate(res, payload)
            }
        }
    };

    const navigate = (params, payload) => {
        navigation.navigate('pay_bill_pay', {
            ...data,
            billInfo: params,
            payload,
            billerType: data?.billerType,
            ...(data?.whereToFrom && {whereToFrom: data?.whereToFrom})
        })
    };

    const createYup = (yu, obj) => {

        let val = yu;
        if(obj.Datatype === 'Numeric') {
            val = val.matches(/^[0-9]+$/, t('VALIDATION.ONLY_DIGITS'))
        } else if (obj.Datatype === 'Alphanumeric') {
            // val = val.matches(/^[A-Za-z0-9]+$/, "Only alphabet or digits allowed ")
        }
        if(obj.MinLength) {
            val = val.min((obj.MinLength), `${obj.Name}  ${t('VALIDATION.AT_LEAST')} ${obj.MinLength} ${t('VALIDATION.DIGITS')}.`)
        }
        if(obj.MaxLength) {
            val = val.max((obj.MaxLength), `${obj.Name} ${t('VALIDATION.NOT_MORE_THAN')} ${obj.MaxLength}  ${t('VALIDATION.DIGITS')}.`)
        }
        return val;
    };

    const modArray = (data) => {

        let array  = [];

        data?.map((o, i) => {
            array.push({...o, placeholder: `${t('VALIDATION.ENTER')} ${o.Name.toLowerCase()}.`, value: ''});
        });

        form && form.current.setFieldValue('Inputs', array);

         let newSchema = Yup.object().shape({
             AddBeneficiary: Yup.boolean(),
             Alias:  Yup.string()
                 .when("AddBeneficiary", {
                     is: true,
                     then: Yup.string().required(t('VALIDATION.BENEFICIARY_NAME.REQUIRED'))
                 }),
             Inputs:  Yup.array().of(
                 Yup.lazy(obj => {
                     return Yup.object().shape(mapValues(obj, (value, key) => {
                        if(key === 'value') {
                            let val = Yup.string().required(`${t('VALIDATION.PLEASE_ENTER')} ${obj.Name}.`);
                            return createYup(val, obj).nullable()
                        }
                     }))
                 })
             )
             });

        setValidations(newSchema)
    };

    const toggleAddBeneficiary = () => {
        let currentValue = form?.current?.values?.AddBeneficiary;
        form.current.setFieldValue('AddBeneficiary', !currentValue)
    };

    const getIcon = () => {
        let iconUrl = `${iconBaseUrl}/${data?.biller?.CountryCode}/${convertToSlug(data?.biller?.BillerName)}.png`;
        return {
            uri: iconUrl
        }
    };

    return (
        <Container headerProps={headerProps}>

            <ViewContainer scrolled={true}
                           contentContainerStyle={Styles.scrollContainer}
                           style={Styles.scrollContainer}>

                <View style={Styles.formContainer}>
                    <Formik
                        innerRef={form}
                        validationSchema={validations}
                        onSubmit={(values) => submit(values)}
                        initialValues={{
                            AddBeneficiary: true
                        }}>
                        {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                            return (
                                <View style={[AuthStyle.formContainer, {flexGrow:1}]}>

                                    <View style={TopUpStyle.confirmHeader}>
                                        <ProgressiveImage style={TopUpStyle.confirmHeaderImage}
                                                          source={getIcon()}
                                                          fallback
                                                          defaultSource={require('../../assets/images/others.png')}
                                        />
                                        <CText style={TopUpStyle.confirmHeaderTitle}>{data?.biller?.BillerName}</CText>
                                    </View>

                                    <View style={AuthStyle.formInnerContainer}>
                                        <FieldArray name="Inputs" render={arrayHelpers => {
                                            return (
                                                values?.Inputs?.length ? values?.Inputs.map((field, index) => {
                                                    return (
                                                        <CInput
                                                            key={index}
                                                            inputLabel={field.Name}
                                                            inputSubLabel={`${field?.Description || ''}.`}
                                                            placeholder={field.placeholder}
                                                            keyboardType={field?.Datatype === "Alphanumeric" ? 'default' : 'numeric'}
                                                            value={field['value']}
                                                            onChangeText={val => setFieldValue(`Inputs.${index}.value`, val)}
                                                            error={errors && errors.Inputs && errors?.Inputs.length && errors?.Inputs[index]?.value ? errors?.Inputs[index].value : ''}
                                                            returnKeyType="next"
                                                        />
                                                    )
                                                }) : null
                                            )
                                        }}>
                                        </FieldArray>

                                        <View style={GlobalStyle.toggleView}>
                                            <CText style={GlobalStyle.toggleViewText}> {t('SECTION_LABELS.ADD_BENEFICIARY')} </CText>
                                            <CToggleSwitch style={{}} onToggle={() => toggleAddBeneficiary()} isOn={values.AddBeneficiary} />
                                        </View>

                                        {values.AddBeneficiary ? <CInput
                                            placeholder={t('FIELDS_LABELS.BENEFICIARY_NAME_PLACEHOLDER')}
                                            value={values.Alias}
                                            onChangeText={handleChange('Alias')}
                                            error={errors.Alias}
                                            leftIconName={'profile'}
                                            returnKeyType="next"
                                        /> : null}
                                    </View>

                                    <CButton title={t('GLOBAL.NEXT')} loading={reduxState.loading} onPress={() => handleSubmit()}/>

                                </View>
                            );
                        }}
                    </Formik>
                </View>

            </ViewContainer>

        </Container>
    )
}

export default React.memo(BillerSkuIo)
