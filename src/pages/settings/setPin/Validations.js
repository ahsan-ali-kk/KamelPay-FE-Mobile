import * as Yup from 'yup';

const scheme = Yup.object().shape({
    pin: Yup.string().required('VALIDATION.LOGIN_CODE.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.LOGIN_CODE.MATCH')
        .length(4, 'VALIDATION.LOGIN_CODE.LENGTH'),
    confirmPin: Yup.string()
        .required('VALIDATION.CONFIRM_LOGIN_CODE.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.CONFIRM_LOGIN_CODE.VALID')
        .oneOf([Yup.ref('pin'), null], 'VALIDATION.CONFIRM_LOGIN_CODE.MATCH')
});

export default scheme;
