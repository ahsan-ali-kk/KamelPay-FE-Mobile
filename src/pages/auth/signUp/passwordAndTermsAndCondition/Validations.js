import * as Yup from 'yup';
import globalValidationHelper from '../../../../utils/globalValidationHelper'

const scheme = Yup.object().shape({
    // email: Yup.string().email('VALIDATION.EMAIL.EMAIL'),
    referralCode: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "VALIDATION.REFERRAL_CODE.STRING_DIGIT_OR_CHARACTER"),
    termsAndCondition: Yup.bool().oneOf([true], 'VALIDATION.TERMS_AND_CONDITION.REQUIRED'),
    ...globalValidationHelper
});

export default scheme;

