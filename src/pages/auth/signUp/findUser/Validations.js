import * as Yup from 'yup';
import {FIND_USER_SEGMENT} from "../helper";

const scheme = () => {
    return  Yup.object().shape({
        type: Yup.string().oneOf([FIND_USER_SEGMENT[0]._id, FIND_USER_SEGMENT[1]._id]).required(),
        walletID: Yup.string().when('type', {
            is: FIND_USER_SEGMENT[0]._id,
            then: Yup.string()
                .required("VALIDATION.WALLET_ID.REQUIRED")
                .matches(/^[a-zA-Z0-9]*$/, 'VALIDATION.WALLET_ID.MATCH'),
            otherwise: Yup.string().notRequired(),
        }),
        cardNo: Yup.string().when('type', {
            is: FIND_USER_SEGMENT[1]._id,
            then: Yup.string()
                .required('VALIDATION.CARD_NUMBER.REQUIRED')
                .matches(/^[0-9]*$/, 'VALIDATION.CARD_NUMBER.MATCHES')
                .length(4, 'VALIDATION.CARD_NUMBER.LENGTH'),
            otherwise: Yup.string().notRequired(),
        }),
        cardExpiry: Yup.string().when('type', {
            is: FIND_USER_SEGMENT[1]._id,
            then: Yup.string()
                .required('VALIDATION.CARD_EXPIRY.REQUIRED'),
            otherwise: Yup.string().notRequired(),
        }),
         referralCode: Yup.string()
                .matches(/^[a-zA-Z0-9]+$/, "VALIDATION.REFERRAL_CODE.STRING_DIGIT_OR_CHARACTER"),

    })
};


export default scheme;

