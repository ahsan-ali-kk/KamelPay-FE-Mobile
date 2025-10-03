import * as Yup from 'yup';

const scheme = (isEid) => Yup.object().shape({
    ...(isEid && {
        emirateID: Yup.string()
        .label('VALIDATION.EMIRATE_ID.LABEL')
        .matches(/^\d{3}-\d{4}-\d{7}-\d{1}$/, 'VALIDATION.EMIRATE_ID.MATCH')
        .required('VALIDATION.EMIRATE_ID.REQUIRED'),
    }),
    cardNo: Yup.string().required('VALIDATION.CARD_NUMBER.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.CARD_NUMBER.MATCHES')
        .length(4, 'VALIDATION.CARD_NUMBER.LENGTH'),
    cardExpiry: Yup.string()
        .required('VALIDATION.CARD_EXPIRY.REQUIRED')
});

export default scheme;

