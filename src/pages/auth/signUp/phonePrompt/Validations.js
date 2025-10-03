import * as Yup from 'yup';
import {validateNumberRegex} from "../../../../utils/methods";
import {CONTACT_PREFERENCES} from "../helper";

const scheme  = (regex) => Yup.object().shape({
    callbackType: Yup.string().oneOf([CONTACT_PREFERENCES[0]._id, CONTACT_PREFERENCES[1]._id]).required("Please select how we should contact you"),
    phone: Yup.string()
        .test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj))
        .required("VALIDATION.PHONE.REQUIRED"),
});

export default scheme;
