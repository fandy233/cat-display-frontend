import * as yup from 'yup';

export const catValidationSchema = yup.object().shape({
    name: yup.string().required('Name is required').max(20, 'Name cannot exceed 20 characters'),
    gender: yup.string().required('Gender is required'),
    breed: yup.string().required('Breed is required').max(20, 'Breed cannot exceed 20 characters'),
    description: yup.string().max(50, 'Description cannot exceed 50 characters'),
    dateOfBirth: yup.date().nullable(), //TODO change to date format
    certificate: yup.string().oneOf(['None', 'CFA', 'TICA'], 'Invalid certificate option'),
    neuteredOrSprayed: yup.boolean(),
    microchip: yup.boolean(),
    forSale: yup.boolean(),
    grade: yup.string().nullable(),
    color: yup.string().nullable().max(20, 'color code cannot exceed 20 characters'),
    vaccination: yup
        .number()
        .nullable()
        .min(0, 'Vaccination doses must be at least 0')
        .max(3, 'Vaccination doses must be at most 3')
        .typeError('Vaccination must be a valid number'),
    price: yup
        .string()
        .nullable()
        .matches(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to two decimal places'),
});
