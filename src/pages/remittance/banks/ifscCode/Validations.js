import * as Yup from 'yup';

const scheme = Yup.object().shape({
    branchCode: Yup.string().label('IFSC Code').required('VALIDATION.IFSC_CODE.REQUIRED'),
});

export default scheme;
