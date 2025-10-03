import React, {useRef, memo} from 'react';
import {Formik} from 'formik';
import Validations from './Validations';
import {View} from 'react-native';
import {AlertView, CButton, CInput, ProgressiveImage} from '../../../uiComponents';
import Styles from '../../auth/Auth.style';
import {useTranslation} from "react-i18next";

function CForm(props) {
    const { t, i18n } = useTranslation();

    const {submit, loading} = props;

    const form = useRef(null);

    return (
        <Formik
            innerRef={form}
            onSubmit={(values) => submit(values)}
            initialValues={{walletID: ""}}
            validationSchema={Validations}
        >
            {({handleChange, values, handleSubmit, errors}) => {
                return (
                    <View style={Styles.formContainer}>
                        <View style={Styles.formInnerContainer}>
                            <CInput
                                type="walletID"
                                disabled={true}
                                keyboardType={'numeric'}
                                value={values.walletID}
                                onChangeText={val => {
                                    let updated = val ? val?.trim() : ''
                                    handleChange('walletID')(updated)
                                }}
                                error={t(errors.walletID)}
                                returnKeyType="next"
                                onSubmitEditing={() => handleSubmit()}
                            />

                            <AlertView
                                viewStyle={{paddingTop: 20, paddingBottom: 20}}
                                title={t("KP_WALLET_TRANSFER.WHERE_TO_FIND_INFO.TITLE")}
                                listData={[
                                    {
                                        text: t("KP_WALLET_TRANSFER.WHERE_TO_FIND_INFO.STEP_1")
                                    },
                                    {
                                        text: t("KP_WALLET_TRANSFER.WHERE_TO_FIND_INFO.STEP_2")
                                    },
                                    {
                                        text: t("KP_WALLET_TRANSFER.WHERE_TO_FIND_INFO.STEP_3")
                                    },
                                ]}
                                // actions={[
                                //     {
                                //         text: t("KP_WALLET_TRANSFER.WHERE_TO_FIND_INFO.BUTTON_TEXT"),
                                //         buttonType: 'without_outline',
                                //         colorType: 'secondary',
                                //         buttonStyle: {
                                //             height: "auto",
                                //             paddingHorizontal: 0,
                                //         },
                                //         buttonTextStyle: {
                                //             textDecorationLine: 'underline'
                                //         },
                                //         onPress: () => navigation.navigate('Card_Management')
                                //     }
                                // ]}
                            />
                            <View style={{alignItems: 'center', marginTop: 15}}>
                                <ProgressiveImage
                                    style={{
                                        minWidth: '100%',
                                        minHeight: 200,
                                        maxWidth: '100%',
                                        maxHeight: 320,
                                    }}
                                    resizeMode={'contain'}
                                    source={require('../../../assets/images/transfer-id-flow.png')}
                                />
                            </View>
                        </View>

                        <CButton title={t('GLOBAL.NEXT')} loading={loading} onPress={() => handleSubmit()}/>

                    </View>
                );
            }}
        </Formik>
    );
}
export default memo(CForm);
