import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {CButton, CInput} from "../../uiComponents";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {addReferral, checkUserReferral, updateReferral} from "../../store/actions/Referral.action";
import {useTranslation} from "react-i18next";
import Popup from "../../uiComponents/popup/Popup";

function ReferralCode(props) {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { inputContainerStyle, service, loading } = props;

    const [referralCode, updateReferralCode] = useState('');
    const [referralCodeError, updateReferralCodeError] = useState('');

    const reduxState = useSelector(({payBill, global, referral}) => {
        return {
            hasReferred: referral.hasReferred,
            addReferralLoading: referral.addReferralLoading,
            loading: referral.checkReferralLoading,
            card: global.selectedCard
        }
    });

    useEffect(() => {
        if(service && reduxState?.card?.referralServices?.includes(service)) {
            checkReferral(service);
        } else {
            dispatch(updateReferral())
        }
    }, [service]);

    const checkReferral = (service) => {
        dispatch(checkUserReferral({service}))
    };

    const addReferralCodeCallBack = (res) => {
        if (res?.error) {
            updateReferralCodeError(res?.data?.message);
        } else {
            dispatch(updateReferral());
            Popup.show({
                isVisible: true,
                type: 'Success',
                title: t('GLOBAL.SUCCESSFULLY'),
                ...(res?.data?.message && {
                    text: res?.data?.message || ''
                })
            })
        }
    };
    const addReferralCode = () => {
        let payload = { code: referralCode, service };
        dispatch(addReferral(payload, addReferralCodeCallBack))
    };

    if(loading || reduxState?.hasReferred) {
        return null
    }

    return (
           <CInput
                inputLabel={t('VALIDATION.REFERRAL_CODE.LABEL')}
                inputContainerStyle={inputContainerStyle}
                placeholder={t('VALIDATION.REFERRAL_CODE.PLACEHOLDER')}
                value={referralCode}
                onChangeText={val => {
                    updateReferralCodeError('');
                    updateReferralCode(val)
                }}
                editable={!(reduxState?.addReferralLoading)}
                error={referralCodeError}
                rightButton={() => {
                    return (
                        <CButton
                            buttonStyle={GlobalStyle.inputRightButton}
                            buttonText={GlobalStyle.inputRightButtonText}
                            title={(loading || reduxState?.addReferralLoading) ? '' : t('GLOBAL.APPLY')}
                            loading={loading || reduxState?.addReferralLoading}
                            onPress={() => addReferralCode()}
                            disabled={!referralCode || loading}
                        />
                    )
                }}
            />
    )
}

export default React.memo(ReferralCode)
