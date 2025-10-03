import * as Yup from 'yup';

const scheme = Yup.object().shape({
    flatUnit: Yup.string().label('VALIDATION.ROOM_FLAT_NUMBER.LABEL').required('VALIDATION.ROOM_FLAT_NUMBER.REQUIRED'),
    buildingName: Yup.string().label('VALIDATION.BUILDING_CAMP_NAME.LABEL').required('VALIDATION.BUILDING_CAMP_NAME.REQUIRED'),
    streetName: Yup.string().label('VALIDATION.STREET_NAME_2.LABEL').required('VALIDATION.STREET_NAME_2.REQUIRED'),
    area: Yup.string().label('VALIDATION.AREA.LABEL').required('VALIDATION.AREA.REQUIRED'),
    state: Yup.string().label('VALIDATION.EMIRATES.LABEL').required('VALIDATION.EMIRATES.REQUIRED'),
});

export default scheme;
