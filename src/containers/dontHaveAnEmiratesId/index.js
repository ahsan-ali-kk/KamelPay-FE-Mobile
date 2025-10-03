import React, {useState, forwardRef, useImperativeHandle} from 'react'
import {AlertView, CModal} from "../../uiComponents";
import {useTranslation} from "react-i18next";
import CForm from "./Form";
import {ViewContainer} from "../index";
import Styles from "../../pages/auth/Auth.style";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {getProfile, newValidateUser} from "../../store/actions/Auth.action";
import Popup from "../../uiComponents/popup/Popup";
import {setHours} from "../../utils/methods";
import {Platform} from "react-native";

const DontHaveAnEmiratesId = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isOpen, updateIsOpen] = useState(false);
    const [error, setError] = useState({});
    const {preValidationValues = null} = props;
    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.validateUserLoading,
            masterDetails: global.masterDetails,
        }
    });

    useImperativeHandle(ref, () => ({
        toggleModal(val = true) {
            updateIsOpen(val);
            setError(null);
        },
    }));

    const modalClose = (value = false) => {
        updateIsOpen(value)
    };

    const headerProps = {
        headerTitle:  t('GLOBAL.DONT_HAVE_AN_EMIRATES_ID'),
        backOnPress: () => modalClose(),
    };

    const newValidateUserCallBack = (res) => {

        if(Platform.OS === 'android') {
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: res?.error ? 'Error' : 'Success',
                title: res?.error ? t('GLOBAL.ERROR') :  t('GLOBAL.SUCCESSFULLY'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => Popup.hide()
                    },
                ]
            });
        } else {
            if(res?.error){
                setError({
                    title: t('GLOBAL.ERROR') ,
                    message: res?.data?.message,
                })
            }
        }

        if(!res?.error) {
            modalClose();
            dispatch(getProfile());
        }

    };

    const submit = (valuesObj) => {
        setError(null);
        let values = {...valuesObj};
        if(values?.cardExpiry){
            values.cardExpiry = setHours(values.cardExpiry, 'to')
        }
        const formData = new FormData();
        if(values?.selfie && Object.keys(values?.selfie).length){
            formData.append('selfie', values?.selfie);
        }
        formData.append('cardNo', values.cardNo);
        formData.append('cardExpiry', new Date(values.cardExpiry).toISOString());
        formData.append('nationality', values.nationality);
        formData.append('dob', moment(values.dob).format('YYYY-MM-DD'));
        formData.append('isLightUser', true);
        dispatch(newValidateUser(formData, newValidateUserCallBack, Platform.OS === 'ios', {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        }))
    };


    return (
        <CModal
            headerProps={headerProps}
            isOpen={isOpen}
            close={() => {
                setError(null);
                modalClose();
            }}>

            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                {error && Object.keys(error).length ? <AlertView viewStyle={{marginTop: 10, marginBottom: 10}}
                                                                 title={error?.title || ''}
                                                                 text={error?.message || ''}
                                                                 type='error' /> : null}
                <CForm
                    loading={reduxState.loading}
                    preValidationValues={preValidationValues}
                    masterDetails={reduxState.masterDetails}
                    submit={submit}
                    setError={setError}
                />

            </ViewContainer>

        </CModal>
    )
});

export default DontHaveAnEmiratesId;
