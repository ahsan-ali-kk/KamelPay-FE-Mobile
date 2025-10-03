import * as Yup from 'yup';
import {validateNumberRegex} from "../../../utils/methods";
import {BANK_TYPES, showNumberInBank} from "./Form";

const normalScheme = () => ({
    BeneficiaryFirstName: Yup.string().required("VALIDATION.FIRST_NAME.REQUIRED")
        .min(2, 'VALIDATION.FIRST_NAME.MIN')
        .max(45, 'VALIDATION.FIRST_NAME.MAX')
        .matches(/^[aA-zZ\s]+$/, "VALIDATION.FIRST_NAME.MATCH"),
    BeneficiaryLastName: Yup.string().required("VALIDATION.LAST_NAME.REQUIRED")
        .min(2, 'VALIDATION.LAST_NAME.MIN')
        .max(45, 'VALIDATION.LAST_NAME.MAX')
        .matches(/^[aA-zZ\s]+$/, "VALIDATION.LAST_NAME.MATCH"),
    RemitPurpose: Yup.string().required("VALIDATION.REMITTANCE_PURPOSE.SELECT_REQUIRED"),
    RemitPurposeText: Yup.string().when(['RemitPurpose'], {
            is: (RemitPurpose) =>
                RemitPurpose === 'Other',
            then: Yup.string().required('VALIDATION.REMITTANCE_PURPOSE.REQUIRED')
        }),
    BeneficiaryNationalityCountryISOCode: Yup.object().required("VALIDATION.NATIONALITY.REQUIRED"),
    AddBeneficiary: Yup.boolean(),
    Alias:  Yup.string()
        .when("AddBeneficiary", {
            is: true,
            then: Yup.string().required("VALIDATION.BENEFICIARY_NAME.REQUIRED")
        }),
});

const bankScheme = {
    // BeneficiaryAccountNo: Yup.string().required("VALIDATION.ACCOUNT_OR_IBAN_NUMBER.REQUIRED").matches(/^[a-zA-Z0-9_.-]*$/, 'VALIDATION.ACCOUNT_OR_IBAN_NUMBER.MATCH'),
    BeneficiaryAccountNo: Yup.string().required("VALIDATION.ACCOUNT_OR_IBAN_NUMBER.REQUIRED").matches(/^[a-zA-Z0-9]+$/, 'VALIDATION.ACCOUNT_OR_IBAN_NUMBER.MATCH'),
    AccountTitle: Yup.string().required("VALIDATION.ACCOUNT_TITLE.REQUIRED").matches(/^[a-zA-Z0-9_._ ]*$/, 'VALIDATION.ACCOUNT_TITLE.MATCH'),
};
const upIdScheme = {
    BeneficiaryAccountNo: Yup.string().required('UPI ID is required')
        .matches(
            /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
            'Please enter valid upi id (username@bankhandle)'
        ),
};
const phoneScheme = (regex) => {
    return {
        BeneficiaryMSISDN: Yup.string().label('VALIDATION.PHONE.LABEL')
            .test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj, false))
            .required("VALIDATION.PHONE.REQUIRED")
    }
};


const scheme = (type, regex) => {
    return (
        Yup.object().shape({
            ...normalScheme(),
            ...(type === BANK_TYPES.BANK_ACCOUNT ?
                showNumberInBank(type, regex) ? {...phoneScheme(regex), ...bankScheme} : bankScheme
                : type === BANK_TYPES.UPI ? upIdScheme : phoneScheme(regex)),
        })
    )
};

export default scheme;
