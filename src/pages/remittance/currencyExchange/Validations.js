import * as Yup from 'yup';

const scheme = Yup.object().shape({
    sender: Yup.number()
        .label('VALIDATION.SENDER_AMOUNT.LABEL')
        .required('VALIDATION.SENDER_AMOUNT.REQUIRED')
        .min(1, 'VALIDATION.SENDER_AMOUNT.MIN'),
    receiver: Yup.number().label('VALIDATION.RECEIVER_AMOUNT.LABEL')
        .min(1, 'VALIDATION.RECEIVER_AMOUNT.MIN'),

});

export default scheme;

