import * as Yup from 'yup';

const scheme  = () => Yup.object().shape({
    walletID: Yup.string()
        .required("VALIDATION.TRANSFER_ID.REQUIRED")
        .matches(/^[a-zA-Z0-9]*$/, 'VALIDATION.TRANSFER_ID.MATCH'),
});

export default scheme;
