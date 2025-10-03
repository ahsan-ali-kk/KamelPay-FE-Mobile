import * as Yup from 'yup';

const scheme = Yup.object().shape({
    emirateID: Yup.string()
        .label('VALIDATION.EMIRATE_ID.LABEL')
        .matches(/^\d{3}-\d{4}-\d{7}-\d{1}$/, 'VALIDATION.EMIRATE_ID.MATCH')
        .required('VALIDATION.EMIRATE_ID.REQUIRED'),
});

export default scheme;
