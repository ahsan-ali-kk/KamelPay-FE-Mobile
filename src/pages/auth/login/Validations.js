import * as Yup from 'yup';
import {validateNumberRegex} from "../../../utils/methods";

const scheme  = (regex) => Yup.object().shape({
    phone: Yup.string()
    .test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj))
    .required("VALIDATION.PHONE.REQUIRED"),
    password: Yup.string().label('VALIDATION.PASSWORD.LABEL').required('VALIDATION.PASSWORD.REQUIRED'),
});

export default scheme;
