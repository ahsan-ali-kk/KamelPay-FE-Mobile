import * as Yup from 'yup';
import {validateNumberRegex} from "../../../../utils/methods";

const scheme  = (selectedCountry, currentCountry, values) => {
    return Yup.object().shape({
            firstReferenceRelation: Yup.string().required('VALIDATION.REFERENCE.REQUIRED'),
            firstReferenceFullName: Yup.string().required("VALIDATION.REFERENCE_FULL_NAME.REQUIRED"),
            firstReferencePhone: Yup.string()
                .test('checkPhoneNumber', (value, obj) => validateNumberRegex(selectedCountry, value || '', obj))
                .required("VALIDATION.PHONE.REQUIRED"),
            localFriendRelation: Yup.string().required('VALIDATION.REFERENCE.REQUIRED'),
            localFriendFullName: Yup.string().required("VALIDATION.REFERENCE_FULL_NAME.REQUIRED"),
            localFriendPhone: Yup.string()
                .test('checkPhoneNumber', (value, obj) => validateNumberRegex(currentCountry, value || '', obj))
                .required("VALIDATION.PHONE.REQUIRED"),
        }
    )
};

export default scheme;
