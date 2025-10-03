import * as Yup from 'yup';

const scheme = Yup.object().shape({
    pin: Yup.string().required('VALIDATION.PIN.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.PIN.MATCH')
        .length(4, 'VALIDATION.PIN.LENGTH'),
    confirmPin: Yup.string()
        .required('VALIDATION.CONFIRM_PIN.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.CONFIRM_PIN.MATCH')
        .oneOf([Yup.ref('pin'), null], 'VALIDATION.CONFIRM_PIN.MATCH')
});

export default scheme;
