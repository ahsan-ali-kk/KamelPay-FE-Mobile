import * as Yup from 'yup';

const scheme = Yup.object().shape({
    cardNo: Yup.string().required('VALIDATION.CARD_NUMBER.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.CARD_NUMBER.MATCHES')
        .length(4, 'VALIDATION.CARD_NUMBER.LENGTH'),
    cardExpiry: Yup.string().required('VALIDATION.CARD_EXPIRY.REQUIRED'),
});

export default scheme;

