import * as Yup from 'yup';

const scheme = Yup.object().shape({
    otp: Yup.string().required('Please enter your OTP.')
        .matches(/^[0-9]*$/, 'Please enter valid 6-Digit code.')
        .length(6, 'OTP has to be exactly 6 characters!')
});

export default scheme;
