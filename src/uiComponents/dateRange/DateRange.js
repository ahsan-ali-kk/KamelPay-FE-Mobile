import React from "react";
import {View, TouchableOpacity} from "react-native";
import {DateTimePicker} from "../../uiComponents";
import Styles from "./DateRange.style";
import KamelPayIcon from "../../assets/icons/KamelPayIcon";
import * as Yup from "yup";
import {Formik} from "formik";
import {useTranslation} from "react-i18next";

function DateRange(props) {
    const { t, i18n } = useTranslation();

    const {submit, isClear} = props;

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                to: undefined,
                from: undefined
            }}
            validationSchema={Yup.object().shape({
                to: Yup.date().required(t("VALIDATION.DATE.REQUIRED")),
                from: Yup.date().required(t("VALIDATION.DATE.REQUIRED"))
            })}>
            {({handleChange, values, handleSubmit, errors, setFieldValue}) => {

                let clear = values?.to && values?.from;

                return (
                    <View style={Styles.container}>

                        <DateTimePicker
                            placeHolder={t('FIELDS_LABELS.FROM_PLACEHOLDER')}
                            inputContainer={Styles.containerItem}
                            value={values.from}
                            onChange={date => setFieldValue('from', date)}
                            error={errors.from}
                            // minimumDate={minimumDate}
                            maximumDate={new Date()}
                        />

                        <DateTimePicker
                            placeHolder={t('FIELDS_LABELS.TO_PLACEHOLDER')}
                            inputContainer={Styles.containerItem}
                            value={values.to}
                            onChange={date => setFieldValue('to', date)}
                            error={errors.to}
                            minimumDate={values.from}
                            maximumDate={new Date()}
                        />

                        <TouchableOpacity style={Styles.button} onPress={() => handleSubmit()}>
                            <KamelPayIcon style={Styles.buttonIcon} name={"search"}/>
                        </TouchableOpacity>

                    </View>
                )}}
        </Formik>

    )
}
export default DateRange;
