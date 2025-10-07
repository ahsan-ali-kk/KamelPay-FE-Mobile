import * as Yup from 'yup';

import {passwordAndConfirmPasswordValidation} from '../../../../utils/globalValidationHelper'

const scheme = Yup.object().shape({
    ...passwordAndConfirmPasswordValidation
});

export default scheme;
