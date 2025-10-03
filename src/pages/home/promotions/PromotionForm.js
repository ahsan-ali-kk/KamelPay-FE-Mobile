import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Header, SafeAreaView, ViewContainer} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import Styles from "../../payBill/Billers.style";
import AuthStyle from "../../auth/Auth.style";
import {CButton, CInput, DateTimePicker, CText} from "../../../uiComponents";
import {FieldArray, Formik} from "formik";
import * as Yup from 'yup';
import {mapValues} from "lodash";
import {promotionRequest} from "../../../store/actions/Global.action";
import {masks} from "../../../utils/methods";
import {useTranslation} from "react-i18next";

function PromotionForm(props) {
    const { t } = useTranslation();

    const form = useRef(null);

    const { route: { params: data}, navigation } = props;

    const dispatch = useDispatch();

    const headerOption = {
        headerTitle: data?.pageTitle || '',
    };

    const reduxState = useSelector(({global}) => {
        return {
            loading: global.promotionRequestFormLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [flag, setFlag] = useState(true);
    const [validations, setValidations] = useState();
    const [saveList, setSaveList] = useState(false);

    useEffect(() => {
        if(data?.array?.length && flag) {
            modArray(data?.array);
            setFlag(false)
        }
    }, []);

    const callBack = () => {
        navigation.goBack();
    };

    const submit = (values) => {
        let payload = values.Inputs;
        payload = payload.map(o => {
            return {
                [o.payloadKey]: `${o?.perifix ? o.perifix : ''}${o.type === 'phone' ? o.value.replace(/\s+/g, '') : o.value}`
            }
        });
        const convertedObject = Object.assign({}, ...payload);
        convertedObject.type = 'KAMELPAY_APP';
        dispatch(promotionRequest(convertedObject, data, callBack))
    };

    const createYup = (yu, obj) => {
        let val = yu;

        if(obj.required){
            val = val.required(`${t('VALIDATION.PLEASE_ENTER')} ${obj?.label}.`)
        }

        if(obj?.datatype === 'numeric') {
            // val = val.matches(/^[0-9]+$/, "Must be only digits")
        } else if (obj?.datatype === 'Alphanumeric') {
            val = val.matches(/^[A-Za-z0-9]+$/, t("VALIDATION.ONLY_DIGITS"))
        }

        if (obj?.type === 'email') {
            val = val.email('VALIDATION.EMAIL.REQUIRED')
                .typeError('VALIDATION.EMAIL.EMAIL')
        }else if (obj?.type === 'phone') {
            val = val.matches(/^\d{2} \d{3} \d{4}$/, 'VALIDATION.PHONE.NOT_VALID')
        }

        if(obj?.minLength) {
            val = val.min((obj.minLength), (obj?.minLengthError || `${obj.label} ${t('VALIDATION.AT_LEAST')} ${obj.minLength} ${t('VALIDATION.DIGITS')}.`))
        }
        if(obj?.maxLength) {
            val = val.max((obj.maxLength), (obj?.maxLengthError || `${obj.label} ${t('VALIDATION.NOT_MORE_THAN')} ${obj.maxLength} ${t('VALIDATION.DIGITS')}.`))
        }
        return val;
    };

    const modArray = (data) => {
        let perifix = `${reduxState?.currentCountry?.idd?.root}${reduxState?.currentCountry?.idd?.suffixes?.length > 1 ?  '' : reduxState?.currentCountry?.idd?.suffixes[0]}`;

        let array  = [];

        data?.map((o, i) => {
            array.push({
                ...o,
                value: '',
                ...(o.type === 'phone' && {perifix})
            });
        });

        form && form.current.setFieldValue('Inputs', array);

        let newSchema = Yup.object().shape({
            Inputs:  Yup.array().of(
                Yup.lazy(obj => {
                    return Yup.object().shape(mapValues(obj, (value, key) => {
                        if(key === 'value') {
                            let val = Yup.string();
                            return createYup(val, obj).nullable()
                        }
                    }))
                })
            )
        });
        setValidations(newSchema)
    };

    return (
        <SafeAreaView style={GlobalStyle.fullContainer} edges={['left', 'right', 'bottom']}>

            <Header {...headerOption}/>

            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer} style={Styles.scrollContainer}>

                <View style={Styles.formContainer}>
                    <Formik
                        innerRef={form}
                        validationSchema={validations}
                        onSubmit={(values) => submit(values)}
                        initialValues={{}}>
                        {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                            return (
                                <View style={[AuthStyle.formContainer, {flexGrow:1}]}>
                                    {data?.title || data?.subTitle ? <View style={[AuthStyle.titleAndText, {width: 'auto', marginBottom: 20}]}>
                                        {data?.title ? <CText style={AuthStyle.title}>{data?.title}</CText> : null}
                                        {data?.subTitle ? <CText style={AuthStyle.text}>{data?.subTitle}</CText> : null}
                                    </View> : null}

                                    <View style={AuthStyle.formInnerContainer}>
                                        <FieldArray name="Inputs" render={arrayHelpers => {
                                            return (
                                                values?.Inputs?.length ? values?.Inputs.map((field, index) =>  {
                                                   return (field?.type === "date"|| field?.type === "time" ? <DateTimePicker
                                                       key={index}
                                                    label={field.label}
                                                       minimumDate={new Date()}
                                                       maximumDate={field?.maximumDate || null}
                                                       inputSubLabel={`${field?.description || ''}`}
                                                    placeholder={field.placeholder}
                                                    value={field['value']}
                                                    onChange={val => setFieldValue(`Inputs.${index}.value`, val)}
                                                    error={errors && errors.Inputs && errors?.Inputs.length && errors?.Inputs[index]?.value ? t(errors?.Inputs[index].value) : ''}
                                                    /> :  <CInput
                                                       mask={field.type === 'phone' ? masks.phone : null}
                                                       key={index}
                                                       selectedCountry={field.type === 'phone' ? reduxState.currentCountry : {}}
                                                       disabled={true}
                                                       onPress={() => null}
                                                       type={field.type === 'phone' ? "number" : ''}
                                                       multiline={field?.multiline || field?.type === 'textArea'}
                                                       style={[GlobalStyle.inputStyle, {minHeight: field?.type === 'textArea' ? 100 : 'auto', }]}
                                                       inputLabel={field.label}
                                                       inputSubLabel={`${field?.description || ''}`}
                                                       placeholder={field.placeholder}
                                                       keyboardType={field?.datatype || 'default'}
                                                       value={field['value']}
                                                       onChangeText={val => setFieldValue(`Inputs.${index}.value`, val)}
                                                       error={errors && errors.Inputs && errors?.Inputs.length && errors?.Inputs[index]?.value ? t(errors?.Inputs[index].value) : ''}
                                                       returnKeyType="next"
                                                   /> )
                                                })  : null
                                            )
                                        }}>
                                        </FieldArray>

                                    </View>

                                    <CButton title={t('GLOBAL.SUBMIT')} loading={reduxState.loading} onPress={() => handleSubmit()}/>

                                </View>
                            );
                        }}
                    </Formik>
                </View>

            </ViewContainer>

        </SafeAreaView>
    )
}

export default React.memo(PromotionForm)
