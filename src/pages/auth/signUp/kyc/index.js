import React, {useRef} from "react";
import Styles from "../../Auth.style";
import {ViewContainer, Container} from "../../../../containers";
import {useDispatch, useSelector} from "react-redux";
import CForm from "./Form";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {errorPopup, IDENTIFICATION_TYPE, SIGN_UP_CONSTANT} from "../helper";
import {userDocumentIdentification} from "../../../../store/actions/Auth.action";
import PassportScanner from "../../../../containers/passportScanner";
import Uqudo from "../../../home/UpdateEmiratesID";
import _ from "lodash";
import {CLoading} from "../../../../uiComponents";
import Popup from "../../../../uiComponents/popup/Popup";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import PhonePrompt from "../phonePrompt";
import {setHours} from "../../../../utils/methods";

function Kyc(props) {

    const { t, i18n } = useTranslation();

    const { route: { params: data } } = props;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const PassportScannerRef = useRef(null);
    const UqudoFlowRef = useRef(null);

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.userValidateLoading || auth.getOcrTokenSignupLoading || auth.userDocumentIdentificationLoading,
            currentCountry: global.currentCountry,
        }
    });

    const {loading} = reduxState;

    const next = (values) => {
        let payload = {}
        if(values.identificationType === IDENTIFICATION_TYPE.EMIRATES_ID._id) {
            payload = {...values}
        } else if(values.identificationType === IDENTIFICATION_TYPE.PASSPORT._id){
            if(values.dontHavePassport){
                let updatedValues = _.omit(values, ['dontHavePassport', 'dob'])
                payload = {
                    ...updatedValues,
                    token: data?.token,
                    dob: setHours(values.dob, 'to'),
                    identificationType: IDENTIFICATION_TYPE.MANUAL._id
                }
            } else {
                payload = {...values}
            }

        }
        dispatch(userDocumentIdentification(payload, nextCallBack));
    };

    const nextCallBack = (res, payload) => {
        if(payload?.identificationType === IDENTIFICATION_TYPE.EMIRATES_ID._id) {
            UqudoFlowRef?.current?.clearStates();
        } else if(payload?.identificationType === IDENTIFICATION_TYPE.PASSPORT._id) {
            PassportScannerRef?.current?.clearStates();
        }
        if(res?.error) {
            if(res?.data?.status){
                Popup.show({
                    isVisible: true,
                    styleMainContainer: GlobalStyle.paddingHorizontal_0,
                    styleContainer: GlobalStyle.bottomHalfModal,
                    viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
                    buttonLastType: 'fill',
                    type: 'customView',
                    showClose: true,
                    edges: ['top', 'left', 'right'],
                    customView: () => {
                        return (
                            <PhonePrompt
                                // errorMessage={res?.data?.message}
                                data={data}
                                callBack={() => {
                                    // resetState();
                                    Popup.hide();
                                }}
                            />
                        )
                    }
                })
            } else {
                errorPopup(t, res?.data?.message || "Something went wrong");
            }
        } else {
            if(res?.data?.status === SIGN_UP_CONSTANT.UNCLAIMED_USER_FOUND._id){
                // unclaimed_user_found
                navigation.navigate("enterPhone", {
                    token: res?.data?.token
                });
            }
            console.log("====userDocumentIdentification====", res);
        }
    }

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };
    //===PASSPORT FUNCTIONS===//
    const confirmPassportDetail = (obj) => {
        let payload = {
            token: obj?.token,
            ocrToken: obj?.ocrToken,
            identificationType: IDENTIFICATION_TYPE.PASSPORT._id,
        };
        console.log("Confirm Passport Detail", payload);
        next(payload);
    };
    const confirmPassportDetailOnClose = () => {
        PassportScannerRef?.current?.clearStates();
    }

    //===EMIRATES ID FUNCTIONS===//
    const confirmEidDetail = (token, type, vendor = '') => {
        let payload = {
            token: data?.token,
            ocrToken: token,
            vendor,
            identificationType: IDENTIFICATION_TYPE.EMIRATES_ID._id,
        };
        console.log("Confirm EID Detail", payload);
        next(payload);
    };
    const confirmEidDetailOnClose = () => {
        UqudoFlowRef?.current?.clearStates();
    };

    return (
        <Container headerProps={headerProps}>
            <CLoading
                showAnimation={true}
                loading={reduxState?.loading}
            />
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <CForm
                    submit={next}
                    loading={loading}
                    data={data}
                    passportScannerRef={PassportScannerRef}
                    uqudoFlowRef={UqudoFlowRef}
                />

                <PassportScanner
                    isAuth={false}
                    token={data?.token}
                    onUploadError={(error) => {
                        errorPopup(t, error?.data?.message)
                    }}
                    loading={loading}
                    confirm={confirmPassportDetail}
                    close={confirmPassportDetailOnClose}
                    ref={PassportScannerRef} />

                <Uqudo
                    ref={UqudoFlowRef}
                    confirm={confirmEidDetail}
                    close={confirmEidDetailOnClose}
                    tokenWithParams={true}
                />

            </ViewContainer>
        </Container>
    )
}
export default Kyc;
