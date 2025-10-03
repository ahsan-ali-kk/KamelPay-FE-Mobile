import * as Yup from 'yup';

const scheme = ({maxAmount}) => Yup.object().shape({
    amount: Yup.number()
        .label('VALIDATION.TRANSFER_AMOUNT.LABEL')
        .required('VALIDATION.TRANSFER_AMOUNT.REQUIRED')
        .min(1, 'VALIDATION.TRANSFER_AMOUNT.MIN')
        .max(maxAmount, `VALIDATION.TRANSFER_AMOUNT.MAX`)
});

export default scheme;
