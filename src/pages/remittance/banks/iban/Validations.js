import * as Yup from 'yup';

const scheme = Yup.object().shape({
    IBAN: Yup.string().required("VALIDATION.IBAN.REQUIRED")
        .min(10, "VALIDATION.IBAN.MIN")
        .matches(/^[a-zA-Z0-9_.-]*$/, 'VALIDATION.IBAN.MATCH'),
});

export default scheme;


