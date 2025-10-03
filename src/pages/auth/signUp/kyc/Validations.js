import * as Yup from 'yup';
import {KYC_SEGMENT} from "../helper";

const isPassportFlow = (identificationType) => identificationType === KYC_SEGMENT[1]._id;

const scheme = Yup.object().shape({
    identificationType: Yup.string().oneOf([KYC_SEGMENT[0]._id, KYC_SEGMENT[1]._id]).required(),
    passport: Yup.string().when(['identificationType', 'dontHavePassport'], {
        is: (identificationType, dontHavePassport) => isPassportFlow(identificationType) && dontHavePassport,
        then: Yup.string()
            .label('VALIDATION.PASSPORT.NUMBER_LABEL')
            // .required("VALIDATION.PASSPORT.NUMBER_REQUIRED")
            .matches(/^[a-zA-Z0-9]+$/, 'VALIDATION.PASSPORT.NUMBER_MATCH')
            .max(20, 'VALIDATION.PASSPORT.NUMBER_MAX'),
        otherwise: Yup.string().notRequired(),
    }),
    dob: Yup.date().when(['identificationType', 'dontHavePassport'], {
        is: (identificationType, dontHavePassport) => isPassportFlow(identificationType) && dontHavePassport,
        then: Yup.date()
            .label('VALIDATION.DOB.LABEL')
            .required('VALIDATION.DOB.REQUIRED'),
        otherwise: Yup.date().notRequired(),
    }),
    nationality: Yup.string().when(['identificationType', 'dontHavePassport'], {
        is: (identificationType, dontHavePassport) => isPassportFlow(identificationType) && dontHavePassport,
        then: Yup.string()
            .label('VALIDATION.NATIONALITY.LABEL')
            .required('VALIDATION.NATIONALITY.REQUIRED'),
        otherwise: Yup.string().notRequired(),
    }),

});

export default scheme;

