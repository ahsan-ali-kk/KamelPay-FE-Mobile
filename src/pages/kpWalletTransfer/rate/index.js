import React, {memo} from "react";
import {View} from "react-native";
import Styles from "../../auth/Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {useSelector} from "react-redux";
import {CText} from "../../../uiComponents";
import { useTranslation } from "react-i18next";
import {useNavigation} from "@react-navigation/native";

function Rate(props) {

    const { t, i18n } = useTranslation();

    const {route: {params: data}} = props;

    const navigation = useNavigation();

    const reduxState = useSelector(({global, kpWalletTransfer}) => {
        return {
            loading: kpWalletTransfer.findUserByWalletIDLoading,
            currentCountry: global.currentCountry,
            card: global.selectedCard
        }
    });

    const {currentCountry, loading} = reduxState;

    const submit = (values) => {
        navigation.navigate("kp_wallet_transfer_confirmation", {...values, ...data})
    };

    const headerProps = {
        headerTitle: ' ',
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>{t("KP_WALLET_TRANSFER.HOW_MUCH_SEND")}</CText>
                    <CText style={Styles.text}>{t("KP_WALLET_TRANSFER.ENTER_TRANSFER_AMOUNT")}</CText>
                </View>
                <CForm
                    data={data}
                    loading={loading}
                    selectedCountry={currentCountry}
                    submit={submit}
                />
            </ViewContainer>
        </Container>
    )
}
export default memo(Rate);
