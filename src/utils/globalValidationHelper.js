import * as Yup from 'yup';

const validations = {
    password: Yup.string()
        .required('VALIDATION.PASSWORD.REQUIRED')
        .min(12, 'VALIDATION.PASSWORD.MIN')
        .matches(RegExp('(.*[A-Z].*)'), 'VALIDATION.PASSWORD.UPPERCASE')
        .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), 'VALIDATION.PASSWORD.SYMBOL')
        .matches(RegExp('(.*[a-z].*)'), 'VALIDATION.PASSWORD.LOWERCASE')
        .matches(RegExp('(.*\\d.*)'), 'VALIDATION.PASSWORD.DIGIT'),
    confirmPassword: Yup.string()
        .required('VALIDATION.CONFIRM_PASSWORD.REQUIRED')
        .oneOf([Yup.ref('password'), null], 'VALIDATION.CONFIRM_PASSWORD.MATCH')
}

export default validations;
