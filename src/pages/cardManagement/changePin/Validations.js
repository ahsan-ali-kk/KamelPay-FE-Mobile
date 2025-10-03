import * as Yup from 'yup';

const scheme = Yup.object().shape({
    otp: Yup.string().required('VALIDATION.NEW_PIN.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.NEW_PIN.MATCH')
        .length(4, 'VALIDATION.NEW_PIN.LENGTH'),
    confirmOtp: Yup.string()
        .required('VALIDATION.CONFIRM_NEW_PIN.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.CONFIRM_NEW_PIN.VALID')
        .oneOf([Yup.ref('otp'), null], 'VALIDATION.CONFIRM_NEW_PIN.MATCH')
});

export default scheme;
