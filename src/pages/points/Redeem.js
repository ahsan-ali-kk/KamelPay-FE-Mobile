import React, {forwardRef, useImperativeHandle, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {CButton, CInput, CText, CModal} from "../../uiComponents";
import {Formik} from "formik";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KeyboardView from "../../containers/KeyboardView";
import * as Yup from "yup";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {useDispatch, useSelector} from "react-redux";
import {redeemPoints} from "../../store/actions/Points.action";
import Popup from "../../uiComponents/popup/Popup";
import {openDialScreen} from "../../utils/methods";

const Redeem = forwardRef((props, ref) => {

    const {t} = useTranslation();
    const dispatch = useDispatch();

    const [isOpen, updateIsOpen] = useState(false);

    const reduxState = useSelector(({auth, global, points}) => {
        return {
            card: global.selectedCard,
            masterDetails: global.masterDetails,
            getMasterDetailLoading: global.getMasterDetailLoading,
            stats: points.pointsStats,
            getStatsLoading: points.getPointsStatsLoading,
            loading: points.redeemPointsLoading,
        }
    });

    const {card, masterDetails, getMasterDetailLoading, stats, getStatsLoading, loading} = reduxState;

    useImperativeHandle(ref, () => ({
        openModal(type) {
            updateIsOpen(true);
        },
    }));

    const toggleModal = () => {
        updateIsOpen(!isOpen);
    };


    const contactUs = () => {
        Popup.hide();
        openDialScreen();
    };

    const redeemPointsCallBack = (res) => {
        if(res?.error){
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: res?.message || t('POPUPS.ERROR.TITLE'),
                text: t('POPUPS.ERROR.SUB_TITLE'),
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () =>  Popup.hide()
                    },
                    {
                        text: t('GLOBAL.CONTACT_US'),
                        callback: () => contactUs()
                    }
                ]
            })
        } else {
            Popup.show({
                isVisible: true,
                showClose: false,
                type: 'Success',
                title: t('GLOBAL.SUCCESSFULLY'),
                text: res?.message,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => Popup.hide()
                    },
                ]
            });
            toggleModal();
            props?.redemptionCallBack && props?.redemptionCallBack();
        }
    };

    const submit = (values) => {
        let payload = {
            points: values?.points,
            cardId: card?._id
        };
        console.log('payload', payload);
        dispatch(redeemPoints(payload, redeemPointsCallBack))
    };

    const minimumNaqadPointWithdrawal = masterDetails?.minimumNaqadPointWithdrawal;
    const maximumNaqadPointWithdrawal = stats?.availablePoints;

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => toggleModal()}>
            <Formik
                onSubmit={(values) => submit(values)}
                initialValues={{}}
                validationSchema={Yup.object().shape({
                    points: Yup.number().required('Please enter points')
                        .typeError('VALIDATION.ONLY_DIGITS')
                        .min(minimumNaqadPointWithdrawal, `Minimum points redemption is ${minimumNaqadPointWithdrawal}.`)
                        .max(maximumNaqadPointWithdrawal, `Maximum points redemption is ${maximumNaqadPointWithdrawal}.`)
                })}>
                {({handleChange, values, handleSubmit, errors}) => {
                    return (
                        <KeyboardView contentContainerStyle={[GlobalStyle.centerModalCenterViewContainerScroll]}>
                            <View style={GlobalStyle.centerModalCenterViewContainer}>

                                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton}
                                                  onPress={() => toggleModal()}>
                                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                                </TouchableOpacity>

                                <CText style={GlobalStyle.centerModalCenterViewTitle}>
                                    Redeem Points
                                </CText>

                                <CInput
                                    // inputSubLabel={t('FIELDS_LABELS.BENEFICIARY_NAME')}
                                    placeholder={'Enter Points'}
                                    value={values.points}
                                    // leftIconName={'profile'}
                                    onChangeText={handleChange('points')}
                                    error={t(errors.points)}
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                    disabled={loading}
                                />

                                <CButton title={'Redeem'}
                                         loading={loading}
                                         onPress={() => handleSubmit()}/>

                            </View>
                        </KeyboardView>
                    )
                }}
            </Formik>
        </CModal>
    )

});

export default React.memo(Redeem)
