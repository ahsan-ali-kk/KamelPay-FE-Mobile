import * as Yup from 'yup';

const scheme  = (isLightUser) => Yup.object().shape({
    cardNo: Yup.string()
        .required('VALIDATION.ADD_CARD_LAST_FOUR_DIGIT.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.ADD_CARD_LAST_FOUR_DIGIT.MATCH')
        .min(4, 'VALIDATION.ADD_CARD_LAST_FOUR_DIGIT.MIN'),
    cardExpiry: Yup.string()
        .required('VALIDATION.CARD_EXPIRY.REQUIRED'),
    ...(isLightUser && {
        emirateID: Yup.string()
            .label('VALIDATION.EMIRATE_ID.LABEL')
            .matches(/^\d{3}-\d{4}-\d{7}-\d{1}$/, 'VALIDATION.EMIRATE_ID.MATCH')
            // .nullable()
            // .test('required-if-passport-empty', "VALIDATION.EMIRATES_AND_PASSPORT", function (value) {
            //     const { passport } = this.options.parent;
            //     if (!value && !passport) return false;
            //     return true;
            // })
        ,
        passport: Yup.string()
            .label('VALIDATION.PASSPORT.NUMBER_LABEL')
            .required("VALIDATION.PASSPORT.NUMBER_REQUIRED")
            .matches(/^[a-zA-Z0-9]{6,9}$/, 'VALIDATION.PASSPORT.NUMBER_MATCH')
            // .nullable()
            // .test('required-if-emirateID-empty', "VALIDATION.EMIRATES_AND_PASSPORT", function (value) {
            //     const { emirateID } = this.options.parent;
            //     if (!value && !emirateID) return false;
            //     return true;
            // }),
    })
});


export default scheme;
