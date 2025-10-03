import React, {useCallback, useRef, useState} from "react";
import {View} from "react-native";
import {Container, ViewContainer} from "../../../../containers";
import {CButton, CInput, CText} from "../../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import { debounce } from 'lodash-es';
import {useTranslation} from "react-i18next";
import Styles from "../../../auth/Auth.style";
import Validations from "./Validations";
import {Formik} from "formik";
import {getBankOrBranch} from "../../../../store/actions/Remittance.action";
import Preview from "../preview/Preview";

function IFSCCode(props) {
    const {t} = useTranslation();
    const form = useRef(null);

    const {route: {params: data}, navigation} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.BANKS'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            apiLoading: remittance.getBankAndBranchLoading,
            bankAndBranch: remittance.bankAndBranch,
        }
    });

    const {apiLoading, bankAndBranch} = reduxState;

    const [isOpen, updateIsOpen] = useState(false);
    const [loading, updateLoading] = useState(false);

    const searchDebounce = useCallback(
        debounce((e) => {
            try {
                get(e);
            } catch (error) {

            }
        }, 500),
        []
    );

    // const onChange = (val) => {
    //     searchDebounce(val)
    // };

    const get = (val) => {
        let payload = {
            Country: data?.country.Name || data?.country.name,
            BankType: data?.type?.Value,
            BranchCode: val
        };
        dispatch(getBankOrBranch(payload, callback));
    };

    const callback = (res) => {
        if(res?.error){
            form?.current?.setFieldError('branchCode', res?.data?.message)
        } else {
            form?.current?.setFieldError('branchCode', '');
            togglePreview(true)
        }
    };

    const changeBank = () => {
        updateIsOpen(false)
    };

    const togglePreview = (value = false) => {
        updateIsOpen(value);
    };

    const confirm = () => {
        let obj = {
            ...data,
            bank: bankAndBranch
        };
        togglePreview();
        setTimeout(() => {
            // if(data?.pageType === 'ADD_NEW_BENEFICIARY') {
                navigation.replace('send_money_beneficiary_details', obj)
            // } else {
            //     navigation.replace('send_money_exchange_rate', obj)
            // }

        }, 100)
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>
                        Please enter your Branch IFSC code.
                    </CText>
                </View>

                <Formik
                    innerRef={form}
                    onSubmit={(values) => get(values?.branchCode)}
                    initialValues={{}}
                    validationSchema={Validations}
                >
                    {({handleChange, values, handleSubmit, errors}) => {
                        return (
                            <View style={Styles.formContainer}>
                                <View style={Styles.formInnerContainer}>
                                    <CInput
                                        // ref={password}
                                        inputSubLabel={t('VALIDATION.IFSC_CODE.TITLE')}
                                        placeholder={t('VALIDATION.IFSC_CODE.PLACEHOLDER')}
                                        value={values.branchCode}
                                        onChangeText={handleChange('branchCode')}
                                        error={t(errors.branchCode)}
                                        onSubmitEditing={() => handleSubmit()}
                                    />

                                </View>

                                <CButton title={t('GLOBAL.NEXT')}
                                         loading={apiLoading}
                                         onPress={() => handleSubmit()}/>
                                <CButton title={t('VALIDATION.IFSC_CODE.DONT')}
                                         type="without_outline"
                                         disabled={loading}
                                         onPress={() => navigation.goBack()}/>

                            </View>
                        );
                    }}
                </Formik>
            </ViewContainer>
            <Preview
                value={isOpen}
                data={{
                    ...data,
                    bank: bankAndBranch
                }}
                onChange={() => changeBank()}
                onConfirm={() => confirm()}
                onClose={() => changeBank()}
            />
        </Container>
    )

}

export default React.memo(IFSCCode)
