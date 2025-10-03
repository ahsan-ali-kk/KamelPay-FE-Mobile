import React from "react";
import {View} from "react-native";
import Styles from "../../auth/Auth.style";
import CForm from "./Form";
import {ViewContainer, Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
// import { RSA } from 'react-native-rsa-native';
import {verifyActivateCard} from "../../../store/actions/CardManagement.action";
import Popup from "../../../uiComponents/popup/Popup";
import {CText} from "../../../uiComponents";
import {getCardById} from "../../../store/actions/Auth.action";
import CreditCardUi from "../../../uiComponents/creditCardUi/CreditCardUi";
import {foundProduct} from "../../../utils/methods";
import {useTranslation} from "react-i18next";

function ActivateCard(props) {
    const { t } = useTranslation();

    const {navigation, route: {params: data}} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({global, cardManagement}) => {
        return {
            loading: cardManagement.verifyActivateCardLoading,
            card: global.selectedCard,
        }
    });

    const show = () => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Success',
            title: t('POPUPS.CARD_ACTIVATION.TITLE'),
            text: t('POPUPS.CARD_ACTIVATION.SUB_TEXT'),
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => Popup.hide()
                },
            ]
        })
    };

    const next = (values) => {
        let publicKey = `
      -----BEGIN RSA PUBLIC KEY-----
      MIICCgKCAgEAvM0pDqYC9Oyn2ikfa8sgbplR0RBCl3y1fmSN1pqMjMQ5LC/VYH2A
      MxEruJZWqwuqX45wBbSR98rIdt1UUv6V1KNJAwVy5qFir/W6v5WfgkHPowGbgE9h
      kkE5PN+OmWMw9qBSalbVaMpEaXypY8CYmSWd+TsvyQSVYpbzr5avPLOZL3D76H0J
      0Gu0yWXdZYFoJjiUxKlV/RM6FNkPpmPPc++WI/DKfzMnY/KRTMBlOG8zVGOMqhKC
      Mmcacfgn0ZwvNDKz4lczMsSFlHHMT9YWXd3kbYLub7geTJqq5LJTc2xPLvkj4PI1
      B7HesZtQir5HssEza2rYSQ7TlnTs5cBFLfjenCGRJ2h28PMXxsIdBigGk4pLAwiC
      2ZO7KsmxVg3ew439XfDSZhdaMzawfZNbjObPqRgKNW0GBieOIxQPMKzqbmyR8sDS
      SN0hzV/tg7+UHPfrsW0dPqcAHToz9dNyPRFH+eZc95G+Ed6aANq63pUFhxYtd54a
      3qMp65xQCVTd50QuwRFtLSeJqaX0JbgBmDKDi5BQ6bIKvgJVuA/TLLpJkNUiIlCk
      zDkK1/rNVDwSezH3rA0WsKrK78ERO5sUDx1r4IYLLMiszNixblVu7cRUdrxt21ys
      F5/XqYhAfofS5BNnlJM+6nIsczHz9+dD47yH8gf28b6jNSEY9a/lEd8CAwEAAQ==
      -----END RSA PUBLIC KEY-----
    `.trim();
        // RSA.encrypt(values.pin, publicKey.trim())
        //     .then(encodedMessage => {
        //         let payload = {
        //             token: data?.token,
        //             pin: encodedMessage.trim()
        //         };
        //         confirm(payload, values.pin);
        //     });
    };

    const confirm = (payload, pin) => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Warning',
            title: 'Setup app pin login ',
            text: 'Do you want to use the same PIN for Application Login ?',
            actions: [
                {
                    text: t('GLOBAL.YES'),
                    callback: () => {
                        Popup.hide();
                        submit(payload, pin)
                    }
                },
                {
                    text: t('GLOBAL.NO'),
                    callback: () => {
                        Popup.hide();
                        submit(payload)
                    }
                },
            ]
        })
    };

    const submit = (payload, pin) => {
        dispatch(verifyActivateCard(payload, pin, callback))
    };

    const callback = () => {
        show();
        getCard();
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        });
    };

    const getCard = () => {
        dispatch(getCardById({
            id: reduxState?.card?._id
        }))
    };

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CARD_ACTIVATION'),
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 0, marginBottom: 20}]}>
                    <CText style={[Styles.text, {textAlign: 'center', fontSize: 14, marginBottom: 10}]}>
                        {t('SECTION_LABELS.CARD_ACTIVATION')}
                    </CText>
                    <View style={Styles.cardContainer}>
                        {data?.card ? <CreditCardUi
                            card={data?.card}
                            viewType={'info'}
                            foundCardData={foundProduct(data?.card?.companyProductCode) || {}}
                        /> : null}
                    </View>
                </View>
                <CForm
                    loading={reduxState.loading}
                    submit={next}
                />
            </ViewContainer>
        </Container>
    )
}
export default ActivateCard;
