import React, {memo, useEffect} from "react";
import {BackHandler, View} from "react-native";
import Styles from "../../auth/Auth.style";
import CForm from "./Form";
import {CText} from "../../../uiComponents";
import {ViewContainer, Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {registerDevice} from "../../../store/actions/Auth.action";
import DeviceInfo from 'react-native-device-info';
import {useTranslation} from "react-i18next";
import {navigationReset} from "../../../routing/Ref";
import {useNavigation} from "@react-navigation/native";
import Popup from "../../../uiComponents/popup/Popup";

function SetPin(props) {
    const { t } = useTranslation();

    const {route: { params: data }} = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.registerDeviceLoading,
        }
    });

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (!data?.isBackFalse) return false; // allow default back
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'Warning',
                title: t("POPUPS.PIN_BLOCK.TITLE"),
                text: t("POPUPS.PIN_BLOCK.SUB_TITLE"),
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => Popup.hide()
                    },
                ]
            });
            return true; // stop default
        });
        return () => sub.remove();
    }, [navigation]);


    const callBack = (message) => {
        // navigation.goBack();
        navigationReset({
            index: 0,
            routes: [{name: 'Home'}],
        });
        // navigation.replace('passwords_and_biometrics');
    };

    const next = async (values) => {
        let payload = { hash: values.pin, type: "PIN" };
        let id = await DeviceInfo.getUniqueId();
        payload.deviceId = id;
        dispatch(registerDevice(payload, callBack))
    };

    const headerProps = {
        headerRight: !data?.isBackFalse,
        headerLeftShow: !data?.isBackFalse,
        backOnPress: () => !data?.isBackFalse ? null : callBack()
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>{t('SET_PIN.TITLE')}</CText>
                    <CText style={Styles.text}>{t('SET_PIN.SUB_TITLE')}</CText>
                </View>
                <CForm
                    loading={reduxState.loading}
                    submit={next}
                />
            </ViewContainer>
        </Container>
    )
}
export default memo(SetPin);
