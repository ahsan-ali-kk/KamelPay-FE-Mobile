import * as Yup from 'yup';
import {newPasswordAndConfirmNewPasswordValidation} from '../../../utils/globalValidationHelper'

const scheme = (isPortalUser = false) => Yup.object().shape({
    otp: Yup.string().required('VALIDATION.OTP.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.OTP.MATCHES')
        .length(6, 'VALIDATION.OTP.LENGTH'),
    ...(isPortalUser ? {
        ...newPasswordAndConfirmNewPasswordValidation
    } : {}),
});

export default scheme;

