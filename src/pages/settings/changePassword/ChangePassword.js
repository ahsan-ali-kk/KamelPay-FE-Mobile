import React, {useRef, useState} from "react";
import {View} from "react-native";
import Styles from "../../auth/Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {CText} from "../../../uiComponents";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {
    changePassword,
    getProfile,
    newDeviceRegister,
    updateEmiratesID
} from "../../../store/actions/Auth.action";
import {useTranslation} from "react-i18next";
import Popup from "../../../uiComponents/popup/Popup";
import Uqudo, {TOKEN_TYPE_CONSTANTS} from "../../home/UpdateEmiratesID";
import {isLightUser} from "../../../utils/methods";

function ChangePassword(props) {
    const { t } = useTranslation();
    const uqudoFlowRef = useRef();

    const {navigation, route: { params }} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            user: auth.user,
            loading: auth.changePasswordLoading || auth.updateEmiratesIDLoading || auth.newDeviceRegisterLoading || auth.getOcrTokenLoading,
            changePasswordWithOcr: global?.masterDetails?.changePasswordWithOcr

        }
    });

    const [savePayload, setSavePayload] = useState({});
    const [localLoading, setLocalLoading] = useState(false);

    const headerProps = {
        headerRight: true,
    };

    const submitCallback = () => {
        navigation.goBack()
    };

    const updateCallBackSuccessPopup = (res) => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Success',
            showClose: false,
            title: t('GLOBAL.SUCCESSFULLY'),
            text: res?.data?.message,
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => {
                        dispatch(getProfile());
                        Popup.hide()
                    }
                },
            ]
        })
    };
    const updateCallBackErrorPopup = (res) => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Error',
            title: t('GLOBAL.ERROR'),
            text: res?.data?.message,
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => Popup.hide()
                },
            ]
        })
    };

    const updateCallBack = (res) => {
        if(res?.error) {
            updateCallBackErrorPopup(res)
        } else {
            navigation.goBack();
            updateCallBackSuccessPopup(res);
        }
    };

    const submit = (values) => {
        let payload = _.omit(values, ['confirmPassword']);
        if(!(payload?.uqudoTokenType && payload?.vendor)) {

            let isPortalUser = reduxState?.user?.hasOwnProperty('isPortalUser') && reduxState?.user?.isPortalUser?.status;
            let isLightUser = reduxState?.user?.hasOwnProperty('isLightUser') && reduxState?.user?.isLightUser;


            if((reduxState?.changePasswordWithOcr && reduxState?.user?.status === 'ACTIVE') && !(isLightUser || isPortalUser)){
                setSavePayload(payload);
                setLocalLoading(true);
                uqudoFlowRef?.current?.run({
                    type: TOKEN_TYPE_CONSTANTS.CHANGE_PASSWORD
                });
            } else {
                dispatch(changePassword(payload, submitCallback))
            }

        } else {
            let updateEmiratesIDPayload = {
                password: payload?.newPassword,
                token: payload?.uqudoToken,
                docType: payload?.uqudoTokenType,
                vendor: payload?.vendor || ''
            };

            if(updateEmiratesIDPayload?.docType === TOKEN_TYPE_CONSTANTS.NEW_DEVICE_REGISTERED){
                //NEW_DEVICE_REGISTERED
                dispatch(newDeviceRegister(updateEmiratesIDPayload, updateCallBack));
            } else {
                //PORTAL_USER_VERIFICATION
                dispatch(updateEmiratesID(updateEmiratesIDPayload, updateCallBack));
            }
        }
    };

    const confirmEidDetail = (token, type, vendor = '') => {
        setLocalLoading(false);
        let payload = {
            ...savePayload
        };
        payload.ocrToken = token;
        payload.vendor = vendor;
        uqudoFlowRef?.current?.clearStates();
        dispatch(changePassword(payload, submitCallback));
    };


    const confirmEidDetailOnClose = () => {
        setLocalLoading(false);
        uqudoFlowRef?.current?.clearStates();
    };

    const uqudoOnError = (res) => {
        setLocalLoading(false);
    };

    return (
        <Container headerProps={headerProps}
                   loadingWithOverlay={reduxState.loading || localLoading}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>{t('GLOBAL.CHANGE_PASSWORD')}</CText>
                    <CText style={Styles.text}>
                       {t('FIELDS_LABELS.RESET_ACCOUNT_PASSWORD')}
                    </CText>
                </View>
                <CForm
                    uqudoTokenType={params?.uqudoTokenType || ''}
                    uqudoToken={params?.uqudoToken || ''}
                    loading={reduxState.loading}
                    submit={submit}
                />
            </ViewContainer>
            <Uqudo
                ref={uqudoFlowRef}
                confirm={confirmEidDetail}
                close={confirmEidDetailOnClose}
                error={uqudoOnError}
            />
        </Container>
    )
}
export default ChangePassword;
