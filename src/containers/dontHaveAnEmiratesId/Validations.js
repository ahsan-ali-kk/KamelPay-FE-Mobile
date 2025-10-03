import * as Yup from 'yup';

const scheme = Yup.object().shape({
    emirateID: Yup.string()
    .label('VALIDATION.EMIRATE_ID.LABEL')
    .matches(/^\d{3}-\d{4}-\d{7}-\d{1}$/, 'VALIDATION.EMIRATE_ID.MATCH'),
    cardExpiry: Yup.string().required('VALIDATION.CARD_EXPIRY.REQUIRED'),
    cardNo: Yup.string().required('VALIDATION.CARD_NUMBER.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.CARD_NUMBER.MATCHES')
        .length(4, 'VALIDATION.CARD_NUMBER.LENGTH'),
    dob: Yup.date().label('VALIDATION.DOB.LABEL').required("VALIDATION.DOB.REQUIRED"),
    nationality: Yup.string().label('VALIDATION.NATIONALITY.LABEL').required("VALIDATION.NATIONALITY.REQUIRED"),
});

export default scheme;

