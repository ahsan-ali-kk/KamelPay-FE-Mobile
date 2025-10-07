import * as Yup from 'yup';

export const passwordAndConfirmPasswordValidation = {
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

export const newPasswordAndConfirmNewPasswordValidation = {
    newPassword: Yup.string()
        .required('VALIDATION.NEW_PASSWORD.REQUIRED')
        .min(12, 'VALIDATION.NEW_PASSWORD.MIN')
        .matches(RegExp('(.*[A-Z].*)'), 'VALIDATION.NEW_PASSWORD.UPPERCASE')
        .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), 'VALIDATION.NEW_PASSWORD.SYMBOL')
        .matches(RegExp('(.*[a-z].*)'), 'VALIDATION.NEW_PASSWORD.LOWERCASE')
        .matches(RegExp('(.*\\d.*)'), 'VALIDATION.NEW_PASSWORD.DIGIT'),
    confirmPassword: Yup.string()
        .required('VALIDATION.NEW_CONFIRM_PASSWORD.REQUIRED')
        .oneOf([Yup.ref('newPassword'), null], 'VALIDATION.NEW_CONFIRM_PASSWORD.MATCH')
}
