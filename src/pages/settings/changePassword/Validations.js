import * as Yup from 'yup';
import globalValidationHelper from '../../../utils/globalValidationHelper'

const scheme = (type) => ({
    ...(!type ? {
        oldPassword: globalValidationHelper.password
    } : {}),
    newPassword: globalValidationHelper.password,
    confirmPassword: globalValidationHelper.confirmPassword
});

export default (type) => Yup.object().shape(scheme(type));
