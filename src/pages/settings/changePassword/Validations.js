import * as Yup from 'yup';
import {newPasswordAndConfirmNewPasswordValidation} from "../../../utils/globalValidationHelper";

const scheme = (type) => ({
    ...(!type ? {
        oldPassword: Yup.string()
            .required('VALIDATION.OLD_PASSWORD.REQUIRED')
    } : {}),
   ...newPasswordAndConfirmNewPasswordValidation
});

export default (type) => Yup.object().shape(scheme(type));
