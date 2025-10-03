import * as Yup from 'yup';

const scheme = {
    buildingNo: Yup.number(),
    streetName: Yup.string().required("VALIDATION.STREET_NAME.REQUIRED"),
    streetNo: Yup.number(),
    zipCode: Yup.string()
        .required("VALIDATION.ZIP_CODE.REQUIRED")
        .matches(/^[a-zA-Z0-9_ ]*$/, 'VALIDATION.ZIP_CODE.MATCH'),
    // EIDExpiry: Yup.string().required("EID expiry date is required"),
    // EIDIssue: Yup.string().required("EID issue date is required")
};

export default Yup.object().shape(scheme);
