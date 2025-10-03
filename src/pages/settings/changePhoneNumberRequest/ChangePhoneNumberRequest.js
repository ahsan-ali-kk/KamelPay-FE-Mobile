import React, {memo, useEffect, useRef, useState} from "react";
import {View} from "react-native";
import Styles from "../../auth/Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {
    changePhoneNumberRequestApi,
    changePhoneNumberVerifyOcrToken
} from "../../../store/actions/Auth.action";
import {CText} from "../../../uiComponents";
import { useTranslation } from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {checkUserAndCardStatus} from "../../home/Home";
import Uqudo, {TOKEN_TYPE_CONSTANTS} from "../../home/UpdateEmiratesID";
import moment from "moment";

function ChangePhoneNumberRequest() {

    const { t } = useTranslation();
    const navigation = useNavigation();
    const uqudoFlowRef = useRef();
    const [localLoading, setLocalLoading] = useState(false);

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.changePhoneNumberRequestLoading || auth.changePhoneNumberRequestVerifyLoading,
            currentCountry: global.currentCountry,
            card: global.selectedCard,
            user: auth.user,
            verificationWithOcr: global?.masterDetails?.changePhoneNumberWithOcr,
            ocrLoading: auth.getOcrTokenLoading || auth.changePhoneNumberVerifyOcrTokenLoading
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);

    useEffect(() => {
        if(reduxState.currentCountry) {
            updateSelectedCountry(reduxState.currentCountry)
        }
    }, [reduxState.currentCountry]);


    useEffect(() => {
        if(reduxState.verificationWithOcr) {
            setLocalLoading(true);
            uqudoFlowRef?.current?.run({
                type: TOKEN_TYPE_CONSTANTS.CHANGE_PHONE_NUMBER_REQUEST,
            })
        }
    }, [reduxState.verificationWithOcr]);

    const callBack = (payload, res) => {
        navigation.navigate('change_phone_number_request_otp', {
            payload,
            phone: payload?.newPhone,
            nextPayload: {
                token: res?.data?.token,
            }
        })
    };

    const submit = async (values) => {
        let perifix = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes?.length > 1 ?  '' : selectedCountry?.idd?.suffixes[0]}`;
        let payload = {
            newPhone: `${perifix.replace(/[^\w\s]/gi, '')}${values.newPhone.replace(/\s+/g, '')}`,
            cardId: reduxState?.card?._id,
        };
        if(!reduxState?.verificationWithOcr) {
            payload.emirateID = `${values.emirateID.replace(/-/g,"")}`;
            payload.dateOfBirth = moment(values.dateOfBirth).format('YYYY-MM-DD');
        }
        checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
            if(type === 'FUNCTION') {
                dispatch(changePhoneNumberRequestApi(payload, callBack))
            }
        }, {
            isShowPopup: true
        });
    };

    const confirmEidDetail = (token, type, vendor) => {
        let payload = {
            ocrToken: token,
            vendor : vendor || ''
        };
        uqudoFlowRef?.current?.clearStates();
        setLocalLoading(false);
        dispatch(changePhoneNumberVerifyOcrToken(payload, changePhoneNumberRequestVerifyApiCallBack));
    };

    const changePhoneNumberRequestVerifyApiCallBack = (res) => {
        if(res?.error){
            navigation.goBack()
        }
    };

    const uqudoOnError = (res) => {
        setLocalLoading(false);
        if(res?.error){
            navigation.goBack()
        }
    };

    const confirmEidDetailOnClose = () => {
        setLocalLoading(false);
        uqudoFlowRef?.current?.clearStates();
        navigation.goBack()
    };

    const headerProps = {
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}
                   loadingWithOverlay={reduxState.loading || reduxState.ocrLoading || localLoading}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}> {t('CHANGE_PHONE_NUMBER_REQUEST.TITLE')} </CText>
                    <CText style={Styles.text}> {t('CHANGE_PHONE_NUMBER_REQUEST.SUB_TITLE')} </CText>
                </View>

                <CForm
                    loading={reduxState.loading || reduxState?.ocrLoading}
                    submit={submit}
                    verificationWithOcr={reduxState?.verificationWithOcr}
                    selectedCountry={selectedCountry}
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
export default memo(ChangePhoneNumberRequest);
