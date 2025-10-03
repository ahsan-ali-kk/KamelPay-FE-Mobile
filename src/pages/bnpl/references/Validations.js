import * as Yup from 'yup';
import {validateNumberRegex} from "../../../utils/methods";

const scheme  = (payload) => {
    return Yup.object().shape({
        firstReferenceRelation: Yup.string().required('VALIDATION.CONTACT.SECOND_REQUIRED'),
        firstReferenceFullName: Yup.string().required("VALIDATION.CONTACT_FULL_NAME.SECOND_REQUIRED")
            .matches(/^[A-Za-z\s]+$/, "VALIDATION.CONTACT_FULL_NAME.SECOND_MATCH"),
        firstReferencePhone: Yup.string()
            .test('checkPhoneNumber', (value, obj) => validateNumberRegex(payload?.selectedCountry, value || '', obj))
            .required("VALIDATION.CONTACT_PHONE.SECOND_REQUIRED"),
        localFriendRelation: Yup.string().required('VALIDATION.CONTACT.SECOND_REQUIRED'),
        localFriendFullName: Yup.string().required("VALIDATION.CONTACT_FULL_NAME.SECOND_REQUIRED")
            .matches(/^[A-Za-z\s]+$/, "VALIDATION.CONTACT_FULL_NAME.SECOND_MATCH"),
        localFriendPhone: Yup.string()
            .test('checkPhoneNumber', (value, obj) => validateNumberRegex(payload?.currentCountry, value || '', obj))
            .test('matchPhoneNumber',
                "VALIDATION.CONTACT_PHONE.SECOND_MATCH_REQUIRED",
                (value) => {
                    let perifix = payload?.currentCountry?.detail?.code;
                    let userTypedNumber = `${perifix ? perifix.replace(/[^\w\s]/gi, '') : ''}${value ? value.replace(/\s+/g, '') : ''}`;
                    return payload?.currentUserNumber ? payload?.currentUserNumber !== userTypedNumber : false
                }
            )
            .required("VALIDATION.CONTACT_PHONE.SECOND_REQUIRED"),
    })
};

export default scheme;
