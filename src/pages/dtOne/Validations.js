import * as Yup from 'yup';

const CardAmountValidation = (obj) =>  Yup.object().shape({
    amount: Yup.number().required("VALIDATION.AMOUNT_FIELD.REQUIRED")
        .min(obj.min, obj.minMessage)
        .max(obj.max,  obj.maxMessage)
});

export {
    CardAmountValidation
};
