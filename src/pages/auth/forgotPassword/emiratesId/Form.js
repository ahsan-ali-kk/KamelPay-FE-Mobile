import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput} from '../../../../uiComponents';
import Styles from '../../Auth.style';
import {masks} from "../../../../utils/methods";
import {useTranslation} from "react-i18next";

function CForm({submit, loading}) {
    const { t } = useTranslation();

    const eid = useRef(null);

    return (
        <Formik
            onSubmit={(values) => submit(values)}
            initialValues={{
                // emirateID: '784-1978-4802030-7',
            }}
            validationSchema={Validations}
        >
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

                            <CInput
                                ref={eid}
                                mask={masks.eid}
                                inputSubLabel={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                placeholder={t('FIELDS_LABELS.EMIRATES_ID_PLACEHOLDER')}
                                value={values.emirateID}
                                onChangeText={handleChange('emirateID')}
                                leftIconName={'emirates-ID'}
                                error={t(errors.emirateID)}
                                returnKeyType="next"
                                onSubmitEditing={() => handleSubmit()}
                            />

                        </View>

                        <CButton title={t('GLOBAL.NEXT')} loading={loading} onPress={() => handleSubmit()}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
