import React, {useRef, memo, forwardRef, useImperativeHandle} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CInput, Dropdown} from '../../../../uiComponents';
import Styles from '../../../auth/Auth.style';
import {useTranslation} from "react-i18next";
import KeyboardView from "../../../../containers/KeyboardView";
import {STATES} from "../../../../utils/methods";

const CForm = forwardRef((props, ref) => {

    const { t, i18n } = useTranslation();

    const {submit, address} = props;

    const form = useRef(null);
    const flatUnit = useRef(null);
    const buildingName = useRef(null);
    const streetName = useRef(null);
    const area = useRef(null);
    const state = useRef(null);

    useImperativeHandle(ref, () => ({
        getFormValues() {
            if(form?.current?.errors && Object.keys(form?.current?.errors)?.length){
                return {
                    status: 'ERROR'
                }
            } else {
                return {
                    status: 'SUCCESS',
                    payload: form?.current?.values
                }
            }
        },
    }));

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{
                flatUnit: address?.flatUnit || "",
                buildingName: address?.buildingName || "",
                streetName: address?.streetName || "",
                area: address?.area || "",
                state: address?.state || "",
            }}
            validationSchema={Validations}
        >
            {({handleChange, values, errors}) => {
                return (

                    <View style={[Styles.formContainer, {
                        marginBottom: 0,
                    }]}>
                        <KeyboardView
                            keyboardVerticalOffset={125}
                            contentContainerStyle={{
                                paddingTop: 5,
                            }}
                        >
                        <CInput
                            ref={flatUnit}
                            inputSubLabel={t('VALIDATION.ROOM_FLAT_NUMBER.LABEL')}
                            placeholder={t('VALIDATION.ROOM_FLAT_NUMBER.PLACEHOLDER')}
                            value={values.flatUnit}
                            onChangeText={handleChange('flatUnit')}
                            error={t(errors.flatUnit)}
                            onSubmitEditing={() => buildingName.current.focus()}
                        />
                        <CInput
                            ref={buildingName}
                            inputSubLabel={t('VALIDATION.BUILDING_CAMP_NAME.LABEL')}
                            placeholder={t('VALIDATION.BUILDING_CAMP_NAME.PLACEHOLDER')}
                            value={values.buildingName}
                            onChangeText={handleChange('buildingName')}
                            error={t(errors.buildingName)}
                            onSubmitEditing={() => streetName.current.focus()}
                        />
                        <CInput
                            ref={streetName}
                            inputSubLabel={t('VALIDATION.STREET_NAME_2.LABEL')}
                            placeholder={t('VALIDATION.STREET_NAME_2.PLACEHOLDER')}
                            value={values.streetName}
                            onChangeText={handleChange('streetName')}
                            error={t(errors.streetName)}
                            onSubmitEditing={() => area.current.focus()}
                        />

                        <CInput
                            ref={area}
                            inputSubLabel={t('VALIDATION.AREA.LABEL')}
                            placeholder={t('VALIDATION.AREA.PLACEHOLDER')}
                            value={values.area}
                            onChangeText={handleChange('area')}
                            error={t(errors.area)}
                            onSubmitEditing={() => state.current.focus()}
                        />

                        <Dropdown
                            dropdownProps={{
                                options: STATES,
                                label: t('VALIDATION.EMIRATES.PLACEHOLDER')
                            }}
                            inputProps={{
                                inputSubLabel: t('VALIDATION.EMIRATES.LABEL'),
                                placeholder: t('VALIDATION.EMIRATES.PLACEHOLDER'),
                                value: values.state,
                            }}
                            onChange={(val) => handleChange('state')(val?.value)}
                            error={t(errors.state)}
                            touched={true}
                            submitCount={1}
                        />
                        </KeyboardView>
                    </View>
                );
            }}
        </Formik>
    );
});

export default memo(CForm);
