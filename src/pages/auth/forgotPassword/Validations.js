import * as Yup from 'yup';
import {validateNumberRegex} from "../../../utils/methods";

const scheme  = (regex) => Yup.object().shape({
    // emirateID: Yup.string()
    //     .label('VALIDATION.EMIRATE_ID.LABEL')
    //     .matches(/^\d{3}-\d{4}-\d{7}-\d{1}$/, 'VALIDATION.EMIRATE_ID.MATCH')
    //     .required('VALIDATION.EMIRATE_ID.REQUIRED'),
    phone: Yup.string()
        .test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj))
        .required("VALIDATION.PHONE.REQUIRED"),
});

export default scheme;
