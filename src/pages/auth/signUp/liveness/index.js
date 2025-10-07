import React, {useEffect, useRef} from "react";
import Styles from "../../Auth.style";
import {ViewContainer, Container, LivenessDetection} from "../../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {StackActions, useNavigation} from "@react-navigation/native";
import {errorPopup, ScanBox} from "../helper";
import {userLivness} from "../../../../store/actions/Auth.action";
import {CLoading, CText} from "../../../../uiComponents";
import {BackHandler, View} from "react-native";

function Liveness(props) {

    const { t, i18n } = useTranslation();

    const { route: { params: data } } = props;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const LivenessDetectionFlowRef = useRef(null);

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.userLivenessLoading,
            livenessChecks: global?.applicationVersions?.livenessChecks || global.masterDetails?.livenessChecks || [],
        }
    });

    const {loading, livenessChecks} = reduxState;

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            resetNavigation();
            return true
        });
        return () => sub.remove();
    }, [navigation]);

    const resetNavigation = () => {
        navigation.reset({
            index: 0,
            routes: [{name: 'login'}],
        });
    }

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
        backOnPress: () => resetNavigation(),
    };

    const nextCallback = (res) => {
        if(res?.error) {
            errorPopup(t, res?.data?.message || "Something went wrong");
        } else {
            navigation.dispatch(StackActions.replace('enterPhone', { token: res?.data?.token }));
        }
        console.log("====userLiveness====", res);
    }

    const next = (picture) => {
        const formData = new FormData();

        formData.append("selfie", picture);
        formData.append("token", data?.token);

        dispatch(userLivness(formData, nextCallback, {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        }))
    };

    return (
        <Container headerProps={headerProps}>
            <CLoading
                showAnimation={true}
                loading={reduxState?.loading}
            />
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>
                        {t('SIGN_UP.LIVENESS_TITLE')}
                    </CText>
                    <CText style={Styles.text}>
                        {t('SIGN_UP.LIVENESS_SUB_TITLE')}
                    </CText>
                </View>

                <ScanBox
                    loading={loading}
                    type={"LIVENESS"}
                    title={t('TAKE_SELFIE.TITLE')}
                    description={t('TAKE_SELFIE.SUB_TITLE')}
                    onPress={() => LivenessDetectionFlowRef?.current?.toggleModal(true)}
                />

                <LivenessDetection
                    ref={LivenessDetectionFlowRef}
                    detectionsList={livenessChecks || []}
                    onComplete={(picture) => {
                        // picture: your selfie/liveness output (uri/base64/metadata)
                        if (picture && Object.keys(picture).length) {
                            LivenessDetectionFlowRef?.current?.toggleModal(false);
                            next(picture)
                        }
                    }}
                />

            </ViewContainer>
        </Container>
    )
}
export default Liveness;
