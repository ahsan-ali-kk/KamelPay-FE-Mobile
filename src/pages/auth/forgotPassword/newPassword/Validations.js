import * as Yup from 'yup';

import globalValidationHelper from '../../../../utils/globalValidationHelper'

const scheme = Yup.object().shape({
    ...globalValidationHelper
});

export default scheme;
