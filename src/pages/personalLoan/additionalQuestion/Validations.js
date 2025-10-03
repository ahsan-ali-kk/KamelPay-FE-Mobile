import * as Yup from 'yup';

const scheme  = () => {
    return Yup.object().shape({
        anyMonthlyLiability: Yup.boolean(),
        liability: Yup.number().when("anyMonthlyLiability", {
                is: true,
                then: Yup.number().required('VALIDATION.LIABILITIES.REQUIRED')
                    .min(0, 'VALIDATION.LIABILITIES.MATCH')
                    .typeError('VALIDATION.LIABILITIES.MATCH')
            }),
        educationExpense: Yup.number()
            .required('VALIDATION.EDUCATION_EXPENSE.REQUIRED')
            .min(0, 'VALIDATION.EDUCATION_EXPENSE.MATCH')
            .max(100000, 'VALIDATION.EDUCATION_EXPENSE.MAX')
            .typeError('VALIDATION.EDUCATION_EXPENSE.MATCH'),
        healthcareExpense: Yup.number()
            .required('VALIDATION.HEALTH_CARE_EXPENSE.REQUIRED')
            .min(0, 'VALIDATION.HEALTH_CARE_EXPENSE.MATCH')
            .max(100000, 'VALIDATION.HEALTH_CARE_EXPENSE.MAX')
            .typeError('VALIDATION.HEALTH_CARE_EXPENSE.MATCH'),
        maintenanceSupport: Yup.number()
            .required('VALIDATION.MAINTENANCE_SUPPORT.REQUIRED')
            .min(0, 'VALIDATION.MAINTENANCE_SUPPORT.MATCH')
            .max(100000, 'VALIDATION.MAINTENANCE_SUPPORT.MAX')
            .typeError('VALIDATION.MAINTENANCE_SUPPORT.MATCH'),
        housingRent: Yup.number()
            .required('VALIDATION.HOUSING_RENT.REQUIRED')
            .min(0, 'VALIDATION.HOUSING_RENT.MATCH')
            .max(100000, 'VALIDATION.HOUSING_RENT.MAX')
            .typeError('VALIDATION.HOUSING_RENT.MATCH'),
        foodExpense: Yup.number()
            .required('VALIDATION.FOOD_EXPENSE.REQUIRED')
            .min(0, 'VALIDATION.FOOD_EXPENSE.MATCH')
            .max(100000, 'VALIDATION.FOOD_EXPENSE.MAX')
            .typeError('VALIDATION.FOOD_EXPENSE.MATCH'),
        utilityCost: Yup.number()
            .required('VALIDATION.UTILITY_COST.REQUIRED')
            .min(0, 'VALIDATION.UTILITY_COST.MATCH')
            .max(100000, 'VALIDATION.UTILITY_COST.MAX')
            .typeError('VALIDATION.UTILITY_COST.MATCH')
    })
};

export default scheme;
