import * as Yup from 'yup';
import {validateNumberRegex} from "../../../utils/methods";

const scheme  = (withOCR, regex) => Yup.object().shape({
    newPhone: Yup.string()
        .test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj))
        .required("VALIDATION.NEW_PHONE_NUMBER.REQUIRED"),
    confirmNewPhone: Yup.string()
        .test('checkPhoneNumber', (value, obj) => validateNumberRegex(regex, value || '', obj))
        .oneOf([Yup.ref('newPhone'), null], "VALIDATION.CONFIRM_NEW_PHONE_NUMBER.MATCH")
        .required("VALIDATION.CONFIRM_NEW_PHONE_NUMBER.REQUIRED"),
    ...(!withOCR ? {
        emirateID: Yup.string()
            .label('VALIDATION.EMIRATE_ID.LABEL')
            .matches(/^\d{3}-\d{4}-\d{7}-\d{1}$/, 'VALIDATION.EMIRATE_ID.MATCH')
            .required('VALIDATION.EMIRATE_ID.REQUIRED'),
        dateOfBirth: Yup.date()
            .required("VALIDATION.DOB.REQUIRED"),
    } : {})

});

export default scheme;
