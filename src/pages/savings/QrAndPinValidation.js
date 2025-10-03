import * as Yup from 'yup';

const scheme = Yup.object().shape({
    pin: Yup.string().required('VALIDATION.PIN.REQUIRED')
        .matches(/^[0-9]*$/, 'VALIDATION.PIN.MATCH')
        .length(6, 'VALIDATION.PIN.LENGTH_6'),
});

export default scheme;
