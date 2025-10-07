import React, {forwardRef, useImperativeHandle, useLayoutEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";
import Popup from "../../uiComponents/popup/Popup";
import {ProgressiveImage} from "../../uiComponents";
import {useTranslation} from "react-i18next";
import {saveUqudoLogs, saveForgetPasswordUqudoLogs} from "../../store/actions/Global.action";
import {useDispatch, useSelector} from "react-redux";
import {DocumentBuilder, DocumentType, EnrollmentBuilder, UqudoIdSDK} from "uqudosdk-react-native";
import jwt_decode from "jwt-decode";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {themes} from "../../theme/colors";
import {openWhatsApp} from "../../utils/methods";
import {getOcrToken, getProfile, updateEmiratesID, updateUserType} from "../../store/actions/Auth.action";
import EidConfirmation from "./eidConfirmation/EidConfirmation";
import UpdateEmiratesIDController from "./UpdateEmiratesIDController";
// import {OneKycSDK} from "react-native-onekyc";
import {IDENTIFICATION_TYPE} from "../auth/signUp/helper";

export const tokenTypes = ["ACCOUNT_VERIFICATION", "RENEWED", "PORTAL_USER_VERIFICATION", "NEW_DEVICE_REGISTERED", "CHANGE_PHONE_NUMBER_REQUEST"];

export const TOKEN_TYPE_CONSTANTS = {
    ACCOUNT_VERIFICATION: "ACCOUNT_VERIFICATION",
    RENEWED: "RENEWED",
    PORTAL_USER_VERIFICATION: "PORTAL_USER_VERIFICATION",
    NEW_DEVICE_REGISTERED: "NEW_DEVICE_REGISTERED",
    CHANGE_PHONE_NUMBER_REQUEST: "CHANGE_PHONE_NUMBER_REQUEST",
    CHANGE_PASSWORD: "CHANGE_PASSWORD"
};

export const KYC_VENDORS = {
    UQUDO: 'UQUDO',
    ONE_KYC: 'ONE_KYC',
};

const UpdateEmiratesID = forwardRef((props, ref) => {

    const {error, confirm, close, uqudoSDKSuccess, uqudoSDKError} = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [uqudoToken, updateUqudoToken] = useState('');
    const [confirmEidDetailModal, updateConfirmEidDetailModal] = useState(false);
    const [eidScanInfo, updateEidScanInfo] = useState(null);
    const [type, updateType] = useState('');
    const [isLightUser, updateIsLightUser] = useState(false);
    const [isMinimalUser, updateIsMinimalUser] = useState(false);
    const [vendor, setVendor] = useState(KYC_VENDORS.UQUDO);

    const reduxState = useSelector(({auth}) => {
        return {
            isLoggedIn: auth.isLoggedIn,
            user: auth.user,
            loading: auth.getOcrTokenLoading || auth.updateEmiratesIDLoading || auth.updateUserTypeLoading
        }
    });

    useLayoutEffect(() => {
        UpdateEmiratesIDController.setModalRef(ref)
    }, [ref]);

    const runKycAgainstVendor = async (obj) => {
        if(obj?.vendor && obj?.vendor === KYC_VENDORS.ONE_KYC){
            await runOnekyc(obj?.ocrToken, obj?.uqudoUserId, obj)
        } else {
            await runUqudo(obj?.ocrToken, obj?.uqudoUserId, obj)
        }
    }

    useImperativeHandle(ref, () => ({
        run(obj) {
            if(obj?.type === 'SING_UP') {
                updateType(TOKEN_TYPE_CONSTANTS.ACCOUNT_VERIFICATION);
                setVendor(obj?.vendor);
                (async ()=> {
                    await runKycAgainstVendor(obj)
                })();
            } else if(obj?.type === 'ONBOARDING') {
                updateType(TOKEN_TYPE_CONSTANTS.ACCOUNT_VERIFICATION);
                getToken(obj?.eid, TOKEN_TYPE_CONSTANTS.ACCOUNT_VERIFICATION);

            } else if(obj?.type === 'PORTAL_USER_VERIFICATION') {

                updateType(TOKEN_TYPE_CONSTANTS.PORTAL_USER_VERIFICATION);
                getToken(reduxState?.user?.emirateID, TOKEN_TYPE_CONSTANTS.PORTAL_USER_VERIFICATION, 'EID_OPTIONAL')

            } else if(obj?.type === 'NEW_DEVICE_REGISTERED') {

                updateType(TOKEN_TYPE_CONSTANTS.NEW_DEVICE_REGISTERED);
                getToken(reduxState?.user?.emirateID, TOKEN_TYPE_CONSTANTS.NEW_DEVICE_REGISTERED)

            } else if(obj?.type === 'LIGHT_USER_VERIFICATION' || obj?.type === 'MINIMAL_USER_VERIFICATION') {

                updateIsLightUser(obj?.type === 'LIGHT_USER_VERIFICATION');
                updateIsMinimalUser(obj?.type === 'MINIMAL_USER_VERIFICATION');
                updateType(TOKEN_TYPE_CONSTANTS.ACCOUNT_VERIFICATION);
                getToken('', TOKEN_TYPE_CONSTANTS.ACCOUNT_VERIFICATION, 'EID_NOT_REQUIRED')

            }  else if(obj?.type === TOKEN_TYPE_CONSTANTS.CHANGE_PHONE_NUMBER_REQUEST) {

                updateType(obj.CHANGE_PHONE_NUMBER_REQUEST);
                getToken(reduxState?.user?.emirateID, TOKEN_TYPE_CONSTANTS.CHANGE_PHONE_NUMBER_REQUEST)

            } else if(obj?.type === TOKEN_TYPE_CONSTANTS.CHANGE_PASSWORD) {

                updateType(obj?.type);
                getToken(reduxState?.user?.emirateID, obj?.type)

            } else if(obj.type === 'FOR_TESTING_WITH_TOKEN') {

                let decoded = jwt_decode(obj?.token);

                updateEidScanInfo(decoded?.data?.documents[0]?.scan || null);
                updateUqudoToken(obj?.token);

                setTimeout(() => {
                    updateConfirmEidDetailModal(true);
                }, 400);

                uqudoSDKSuccess && uqudoSDKSuccess({
                    decoded,
                    result
                });

            } else {

                updateType(TOKEN_TYPE_CONSTANTS.RENEWED);
                if(obj?.type === 'UPDATE_EMIRATES_ID'){
                    updateEmiratesIdConfirmation()
                } else if(obj?.type === 'GET_NEW_TOKEN'){
                    getToken(reduxState?.user?.emirateID, TOKEN_TYPE_CONSTANTS.RENEWED)
                } else if(obj?.type === 'FORGOT_PASSWORD') {
                    updateType(obj?.type);
                    setVendor(obj?.vendor);
                    (async ()=> {
                        await runKycAgainstVendor(obj)
                    })();
                    // runUqudo(obj?.ocrToken, obj?.uqudoUserId, obj)
                }
            }
        },
        clearStates() {
            updateUqudoToken('');
            updateType('');
            updateConfirmEidDetailModal(false);
            updateEidScanInfo(null);
            updateIsLightUser(false);
            updateIsMinimalUser(false);
        }
    }));

    const updateEmiratesIdConfirmation = () => {
        Popup.show({
            isVisible: true,
            type: 'customView',
            customView: () => {
                return (
                    <View>
                        <ProgressiveImage
                            style={{
                                width: 250,
                                height: 250
                            }}
                            source={require('../../assets/images/update-emirates-id-vector.png')}
                        />
                    </View>
                )
            },
            title: t('POPUPS.UPDATE_EMIRATES_ID.TITLE'),
            text: t('POPUPS.UPDATE_EMIRATES_ID.SUB_TITLE'),
            actions: [
                {
                    text: t('GLOBAL.UPDATE'),
                    callback: () => {
                        Popup.hide();
                        getToken(reduxState?.user?.emirateID, TOKEN_TYPE_CONSTANTS.RENEWED);
                    }
                },
                {
                    text: t('GLOBAL.SKIP'),
                    callback: () => {
                        Popup.hide();
                    }
                },
            ]
        })
    };

    const saveUqudoLogsFunc = (token, payload, obj) => {
        if(!props?.tokenWithParams) {
            let logPayload = {
                phone: reduxState?.user?.phone,
                token,
                ...payload
            };
            dispatch(saveUqudoLogs(logPayload));
        } else {
            let logPayload = {
                "ocrToken": token,
                "token": obj?.token,
                ...payload
            };
            dispatch(saveForgetPasswordUqudoLogs(logPayload))
        }
    };

    const troubleWithVerification = () => {
        error && error({
            error: true,
            title: t('POPUPS.UPDATE_EMIRATES_ID.TITLE'),
            message: t('POPUPS.UPDATE_EMIRATES_ID.SUB_TITLE')
        });
        Popup.show({
            isVisible: true,
            styleMainContainer: GlobalStyle.paddingHorizontal_0,
            styleContainer: GlobalStyle.bottomHalfModal,
            viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
            titleStyle: GlobalStyle.bottomHalfModalTitle,
            subTitleStyle: GlobalStyle.bottomHalfModalSubTitle,
            type: 'customView',
            title: t("TROUBLE_WITH_VERIFICATION.TITLE"),
            text: t("TROUBLE_WITH_VERIFICATION.SUB_TITLE"),
            showClose: false,
            edges: ['top', 'left', 'right'],
            customView: () => {
                return (
                    <View style={GlobalStyle.bottomHalfModalLoadingView}>
                        <ActivityIndicator size="large" color={themes['light'].colors.primary} />
                    </View>
                )
            },
            actions: [
                {
                    text: t("GLOBAL.CANCEL"),
                    callback: () => Popup.hide()
                },
                {
                    text: t("GLOBAL.CONTACT_US"),
                    callback: () => {
                        Popup.hide();
                        openWhatsApp()
                    }
                }
            ]
        })
    };

    const getToken = (eid, value, dataType = '') => {

        let emirateID = eid || reduxState?.user?.emirateID;
        let docType = value || type;

        let payload = {};

        if(dataType === 'EID_OPTIONAL'){
            payload.docType = docType;
            if(emirateID) {
                payload.emirateID = emirateID;
            }
        } else if(dataType === 'EID_NOT_REQUIRED') {
            payload.docType = docType;
        } else {
            payload.docType = docType;
            payload.emirateID = emirateID;
        }

        if(Object.keys(payload).length) {
            dispatch(getOcrToken(
                payload,
                    async res => {
                        setVendor(res?.vendor);
                        if(res?.vendor === KYC_VENDORS.ONE_KYC){
                            await runOnekyc(res?.token, res?.uqudoUserId)
                        } else {
                           await runUqudo(res?.token, res?.uqudoUserId)
                        }
                    },
                    errorRes => error && error(errorRes)
            ))
        }
    };

    const runOnekyc = async (token, userId, obj) => {
        try {
            // const sdk = new OneKycSDK();
            // const enrollmentConfiguration = {
            //     token: token,
            //     doc_type: "EMIRATES_ID",
            //     scope: 'document-face-scan',
            //     // scope: 'document-scan',
            //     type: 'DETECTION',
            // };
            // // console.log('enrollmentConfiguration', enrollmentConfiguration);
            // const result = await sdk.enroll(enrollmentConfiguration);
            // // console.log('runOnekyc result', result)
            // let decoded = jwt_decode(result);

            // // console.log('decoded', decoded)

            // updateEidScanInfo(decoded || null);
            // updateUqudoToken(result);

            // setTimeout(() => {
            //     updateConfirmEidDetailModal(true);
            // }, 400);

            // uqudoSDKSuccess && uqudoSDKSuccess({
            //     decoded,
            //     result
            // });

            // saveUqudoLogsFunc(token, { data: result, vendor }, obj)

        } catch (error) {
            console.log('error', error);

            uqudoSDKError && uqudoSDKError();

            let e = JSON.parse(error?.message?.toString());

            saveUqudoLogsFunc(token, {
                error: `${e?.code || ''} ${e?.message || ''}`,
                vendor,
            }, obj);

            troubleWithVerification();

        }
    };
    const runUqudo = async (token, uqudoUserId, obj) => {
        try {
            let passport = new DocumentBuilder()
                .setDocumentType(DocumentType.UAE_ID)
                // .enableReading()
                .build();
            let enrollmentConfiguration = new EnrollmentBuilder()
                .setToken(token)
                .enableFacialRecognition()
                .add(passport)
                .setUserIdentifier(uqudoUserId)
                .build();
            const sdk = new UqudoIdSDK();
            const result = await sdk.enroll(enrollmentConfiguration);
            let decoded = jwt_decode(result?.result);

            updateEidScanInfo(decoded?.data?.documents[0]?.scan || null);
            updateUqudoToken(result.result);

            setTimeout(() => {
                updateConfirmEidDetailModal(true);
            }, 400);

            uqudoSDKSuccess && uqudoSDKSuccess({
                decoded,
                result
            });

            saveUqudoLogsFunc(token, { data: result?.result, vendor }, obj)

        } catch (error) {

            uqudoSDKError && uqudoSDKError();

            let e = JSON.parse(error?.code?.toString());

            saveUqudoLogsFunc(token, {
                error: `${e.code || ''} ${e.message || ''} ${e.task || ''}`,
                vendor,
            }, obj);

            troubleWithVerification();

        }
    };

    const reScan = () => {
        updateConfirmEidDetailModal(false);
        updateEidScanInfo(null);
        updateUqudoToken('');
        if(!props?.tokenWithParams){
            if(isLightUser || isMinimalUser){
                getToken('','', 'EID_NOT_REQUIRED');
            } else {
                getToken();
            }
        }
    };

    const confirmEidDetail = () => {
        if(type === TOKEN_TYPE_CONSTANTS.RENEWED){
            dispatch(updateEmiratesID({
                token: uqudoToken,
                docType: type,
                ...(vendor && {vendor})
            }, updateCallBack));
        } else if(isLightUser || isMinimalUser){
            dispatch(updateUserType({
                token: uqudoToken,
                docType: type,
                identificationType: IDENTIFICATION_TYPE.EMIRATES_ID._id,
                ...(vendor && {vendor})
            }, updateCallBack));

        } else {
            updateConfirmEidDetailModal(false);
            updateEidScanInfo(null);
            updateType('');
            confirm && confirm(uqudoToken, type, vendor);
        }
    };

    const updateCallBackSuccessPopup = (res) => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Success',
            title: t('GLOBAL.SUCCESSFULLY'),
            text: res?.data?.message,
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => Popup.hide()
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
            updateConfirmEidDetailModal(false);
            updateEidScanInfo(null);
            updateIsLightUser(false);
            updateIsMinimalUser(false);
            updateType('');
            updateCallBackErrorPopup(res)
        } else {
            updateConfirmEidDetailModal(false);
            updateIsLightUser(false);
            updateIsMinimalUser(false);
            updateEidScanInfo(null);
            updateType('');
            updateCallBackSuccessPopup(res);
            dispatch(getProfile())
        }
    };

    const confirmEidDetailOnClose = () => {
        updateConfirmEidDetailModal(false);
        updateIsLightUser(false);
        updateIsMinimalUser(false);
        updateEidScanInfo(null);
        updateUqudoToken('');
        updateType('');
        close && close();
    };

    return (
      <View>
          <EidConfirmation
              vendor={vendor}
              data={eidScanInfo}
              reScan={() => reScan()}
              value={confirmEidDetailModal}
              confirm={() => confirmEidDetail()}
              onClose={() => confirmEidDetailOnClose()}
              loading={reduxState?.loading}
          />
      </View>
    )
});

export default UpdateEmiratesID;
