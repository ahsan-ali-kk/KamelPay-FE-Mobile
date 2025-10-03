import * as Yup from 'yup';
import {validateNumberRegex} from "../../../utils/methods";

const mobileNumber = (regex) => Yup.object().shape({
    MobileNumber: Yup.string()
        .test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj))
        .required("VALIDATION.PHONE.REQUIRED"),
    AddBeneficiary: Yup.boolean(),
    Alias:  Yup.string()
        .when("AddBeneficiary", {
            is: true,
            then: Yup.string().required("VALIDATION.BENEFICIARY_NAME.REQUIRED")
        }),
});

export {
    mobileNumber
};
