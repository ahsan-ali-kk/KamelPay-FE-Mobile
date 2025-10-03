import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import {View} from 'react-native';
import {CButton, CText, IconButton, RangeSlider} from '../../uiComponents';
import {useTranslation} from "react-i18next";
import {CardAmountValidation} from "./Validations";
import TopupStyle from "../topUp/TopUp.style";

function CardAmount(props) {
    const { t, i18n } = useTranslation();

    const {submit, data, close} = props;

    const form = useRef(null);

    const getValidation = () => {
        let min = 0, minMessage = '',  max = 0, maxMessage = '';
        if(data?.amountDetails){
            min = data?.amountDetails.min;
            max = data?.amountDetails.max;
        }
        minMessage = `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.AT_LEAST')} ${min}`;
        maxMessage = `${t('VALIDATION.AMOUNT')} ${t('VALIDATION.NOT_MORE_THAN')} ${max}`;
        return CardAmountValidation({
            min,
            minMessage,
            max,
            maxMessage
        })
    };

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                amount: data?.amountDetails.min
            }}
            validationSchema={getValidation()}
        >
            {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                return (
                    <View style={TopupStyle.shortInfoModalContainer}>

                        <IconButton
                            buttonType='normal'
                            type="icon-with-background"
                            buttonStyle={TopupStyle.shortInfoModalIconContainer}
                            buttonIconStyle={TopupStyle.shortInfoModalIcon}
                            iconName={'easypay'}
                        />
                        <CText style={TopupStyle.shortInfoModalText}>{data?.name}</CText>

                        <View style={{width: '100%', marginTop: 25}}>

                            <RangeSlider
                                value={values.amount}
                                error={errors.amount}
                                minimumValue={data?.amountDetails.min}
                                maximumValue={data?.amountDetails.max}
                                step={data?.amountDetails.increment}
                                onValueChange={(val) => setFieldValue('amount', val)}

                            />

                            <CButton title={`${t('GLOBAL.NEXT')} : ${Number(values.amount).toFixed(2)}`}
                                     onPress={() => handleSubmit()}/>
                        </View>



                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CardAmount);
