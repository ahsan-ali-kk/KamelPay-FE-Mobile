import * as Yup from 'yup';
import {validateNumberRegex} from "../../../../utils/methods";
import globalValidationHelper from '../../../../utils/globalValidationHelper'

const scheme = (regex) => Yup.object().shape({
    email: Yup.string().email('VALIDATION.EMAIL.EMAIL'),

    phone: Yup.string().test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj))
        .required("VALIDATION.PHONE.REQUIRED"),

    referralCode: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "VALIDATION.REFERRAL_CODE.STRING_DIGIT_OR_CHARACTER"),

    
    termsAndCondition: Yup.bool().oneOf([true], 'VALIDATION.TERMS_AND_CONDITION.REQUIRED'),

    nationality: Yup.string().label('VALIDATION.NATIONALITY.LABEL').required("VALIDATION.NATIONALITY.REQUIRED"),

    emirateID: Yup.string()
        .label('VALIDATION.EMIRATE_ID.LABEL')
        .matches(/^\d{3}-\d{4}-\d{7}-\d{1}$/, 'VALIDATION.EMIRATE_ID.MATCH'),
        // .nullable()
        // .test('required-if-passport-empty', "VALIDATION.EMIRATES_AND_PASSPORT", function (value) {
        //     const { passport } = this.options.parent;
        //     if (!value && !passport) return false;
        //     return true;
        // }),

    passport: Yup.string()
        .label('VALIDATION.PASSPORT.NUMBER_LABEL')
        .required("VALIDATION.PASSPORT.NUMBER_REQUIRED")
        .matches(/^[a-zA-Z0-9]{6,9}$/, 'VALIDATION.PASSPORT.NUMBER_MATCH'),
        // .nullable()
        // .test('required-if-emirateID-empty', "VALIDATION.EMIRATES_AND_PASSPORT", function (value) {
        //     const { emirateID } = this.options.parent;
        //     if (!value && !emirateID) return false;
        //     return true;
        // }),
    ...globalValidationHelper,

});

export default scheme;
