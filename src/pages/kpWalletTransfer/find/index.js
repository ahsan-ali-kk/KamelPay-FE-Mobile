import React, {memo, useRef, useState} from "react";
import {View} from "react-native";
import Styles from "../../auth/Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {CText} from "../../../uiComponents";
import { useTranslation } from "react-i18next";
import {findUserByWalletID} from "../../../store/actions/KPWalletTransfer.action";
import UserConfirmation from "../userConfirmation";
import {useNavigation} from "@react-navigation/native";
import Popup from "../../../uiComponents/popup/Popup";

function Send(props) {

    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const UserConfirmationRef = useRef();
    const [foundUser, setFoundUser] = useState(null);

    const reduxState = useSelector(({auth, global, kpWalletTransfer}) => {
        return {
            loading: kpWalletTransfer.findUserByWalletIDLoading,
            card: global.selectedCard
        }
    });

    const findUserByWalletIDCallback = (res) => {
        if(res?.error){
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
            });
        } else {
            setFoundUser(res?.data?.data);
            UserConfirmationRef?.current?.toggleModal(true)
        }

    }

    const submit = async (values) => {
        console.log(values);
        let payload = {
            senderWalletID: reduxState?.card?.walletID,
           receiverWalletID: values?.walletID,
        }
        dispatch(findUserByWalletID(payload, findUserByWalletIDCallback));
    };

    const headerProps = {
        headerTitle: ' ',
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>

            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <CText style={Styles.title}>{t("KP_WALLET_TRANSFER.TRANSFER_MONEY_SECURELY")}</CText>
                    <CText style={Styles.text}>{t("KP_WALLET_TRANSFER.ENTER_THE_RECIPIENTS_TRANSFER_ID")}</CText>
                </View>

                <CForm
                    loading={reduxState.loading}
                    submit={submit}
                />

                <UserConfirmation
                    ref={UserConfirmationRef}
                    data={foundUser?.receiverCard}
                    confirm={(res) => {
                        UserConfirmationRef?.current?.toggleModal(false);
                        navigation.navigate("kp_wallet_transfer_rate", {
                            ...foundUser,
                            ...res
                        });
                    }}
                    reFind={() => {
                        UserConfirmationRef?.current?.toggleModal(false);
                        setFoundUser(null);
                    }}
                />

            </ViewContainer>

        </Container>
    )
}
export default memo(Send);
