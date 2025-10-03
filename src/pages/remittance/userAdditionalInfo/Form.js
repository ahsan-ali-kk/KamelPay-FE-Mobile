import React, {useRef} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {CButton, CInput, CText} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {ViewContainer} from "../../../containers";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";

function CForm({submit, loading, data}) {
    const { t } = useTranslation();

    const buildingNo = useRef(null);
    const streetNo = useRef(null);
    const streetName = useRef(null);
    const zipCode = useRef(null);

    return (
        <Formik
            onSubmit={(values) => submit(values)}
            initialValues={{
                buildingNo: data?.buildingNo || '',
                streetNo: data?.streetNo || '',
                streetName: data?.streetName || '',
                zipCode: data?.zipCode || '',
                // EIDIssue: '',
            }}
            validationSchema={Validations}>
            {({handleChange, values, handleSubmit, errors, setFieldValue}) => {
                return (
                    <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                        <View style={[Styles.titleAndText, {marginTop: 30}]}>
                            <CText style={Styles.title}>{t('SECTION_LABELS.UPDATE_YOUR_PROFILE')}</CText>
                            <CText style={Styles.text}>
                                {t('SECTION_LABELS.UPDATE_YOUR_PROFILE_TEXT_2')}
                            </CText>
                        </View>
                    <View style={Styles.formContainer}>

                        <View style={Styles.formInnerContainer}>

                            {/*<View style={{marginBottom: 25}}>*/}
                            {/*    <CText style={Styles.title}>Home address information</CText>*/}
                            {/*</View>*/}

                         <View style={GlobalStyle.twoInputsView}>
                             <CInput
                                 ref={buildingNo}
                                 inputLabel={t('FIELDS_LABELS.BUILDING_NUMBER')}
                                 // placeholder="Enter your building number"
                                 value={values.buildingNo}
                                 onChangeText={handleChange('buildingNo')}
                                 error={t(errors.buildingNo)}
                                 returnKeyType="next"
                                 keyboardType='numeric'
                                 inputContainerStyle={GlobalStyle.twoInputsViewContainer}
                                 onSubmitEditing={() => streetNo.current.focus()}

                             />
                             <CInput
                                 ref={streetNo}
                                 inputLabel={t('FIELDS_LABELS.STREET_NUMBER')}
                                 // placeholder="Enter your street number"
                                 value={values.streetNo}
                                 onChangeText={handleChange('streetNo')}
                                 error={t(errors.streetNo)}
                                 keyboardType='numeric'
                                 returnKeyType="next"
                                 inputContainerStyle={GlobalStyle.twoInputsViewContainer}
                                 onSubmitEditing={() => streetName.current.focus()}
                             />
                         </View>

                            <CInput
                                ref={streetName}
                                inputLabel={t('FIELDS_LABELS.STREET_NAME')}
                                // placeholder="Enter your street name"
                                value={values.streetName}
                                onChangeText={handleChange('streetName')}
                                error={t(errors.streetName)}
                                onSubmitEditing={() => zipCode.current.focus()}
                                returnKeyType="next"
                            />

                            <CInput
                                ref={zipCode}
                                inputLabel={t('FIELDS_LABELS.ZIP_CODE')}                                // placeholder="Enter zip code"
                                value={values.zipCode}
                                onChangeText={handleChange('zipCode')}
                                error={t(errors.zipCode)}
                                returnKeyType="next"
                                onSubmitEditing={() => handleSubmit()}
                            />

                        </View>

                    </View>

                        <View style={GlobalStyle.bottomView}>
                            <CButton title={t('GLOBAL.UPDATE')}
                                     loading={loading}
                                     onPress={() => handleSubmit()}/>
                        </View>

                    </ViewContainer>
                );
            }}
        </Formik>
    );
}
export default CForm;
