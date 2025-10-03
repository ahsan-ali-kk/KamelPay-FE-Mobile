import * as Yup from 'yup';
import globalValidationHelper from '../../../utils/globalValidationHelper'
 
const scheme = (isPortalUser = false) => Yup.object().shape({
    otp: Yup.string().required('VALIDATION.OTP.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.OTP.MATCHES')
        .length(6, 'VALIDATION.OTP.LENGTH'),
    ...(isPortalUser ? {
        newPassword: globalValidationHelper.password,
        confirmPassword: globalValidationHelper.confirmPassword
    } : {}),
});

export default scheme;

