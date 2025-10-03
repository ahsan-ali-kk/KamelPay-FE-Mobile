import * as Yup from 'yup';

const scheme = {
    password: Yup.string().required('VALIDATION.PASS_CODE.REQUIRED').length(4, 'VALIDATION.PASS_CODE.LENGTH'),
};

export default Yup.object().shape(scheme);

