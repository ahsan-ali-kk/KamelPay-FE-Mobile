import React from "react";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container, ViewContainer} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import CreditCardUi, {
    cardNormalStatus,
    getCardIsActivatedOrStatus
} from "../../../uiComponents/creditCardUi/CreditCardUi";
import Styles from "../CardManagement.style";
import {CButton} from "../../../uiComponents";
import {changeCardStatus} from "../../../store/actions/CardManagement.action";
import {getCardById} from "../../../store/actions/Auth.action";
import {foundProduct, isLightUser} from "../../../utils/methods";
import {useTranslation} from "react-i18next";
import {USER_TYPES, userVerificationPopup} from "../../home/Home";

function CardStatus(props) {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const {route: {params: data}} = props;

    const reduxState = useSelector(({auth, cardManagement, global}) => {
        return {
            data: [],
            loading: cardManagement.changeCardStatusLoading || auth.getCardByIdLoading,
            card: global.selectedCard,
            user: auth?.user,
        }
    });


    const headerProps = {
        headerTitle: t('CARD_MANAGEMENT.CARD_STATUS'),
        headerRight: true,
    };

    const { card } = reduxState;


    const changeStatus = (payload) => {
        dispatch(changeCardStatus(payload, () => {
            dispatch(getCardById(payload))
        }))
    }

    const onChange = () => {
        let payload = {
            id: card._id
        };

        if(card?.status === cardNormalStatus[1]){
            isLightUser(reduxState?.user,
                () => {
                    userVerificationPopup(t, USER_TYPES.LIGHT_USER._id)
                },
                () => {
                    changeStatus(payload)
                })
        } else {
            changeStatus(payload)
        }
    };

    return (
        <Container
            loading={reduxState.loading}
            headerProps={headerProps}>

            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

              <View style={Styles.cardContainer}>
                  {card ? <CreditCardUi
                      card={card}
                      viewType={'info'}
                      foundCardData={foundProduct(card?.companyProductCode) || {}}
                      onPress={() => null}
                  /> : null}
              </View>
            </ViewContainer>
            <View style={GlobalStyle.listFooterButton}>
                <CButton
                    disabled={reduxState.loading}
                    colorType={card && getCardIsActivatedOrStatus(card, true)?.id === cardNormalStatus[0] ? 'danger' : 'primary'}
                    title={card && getCardIsActivatedOrStatus(card, true)?.id === cardNormalStatus[0] ?
                        t('GLOBAL.TEMP_BLOCK') : t('GLOBAL.UNBLOCK')}
                    onPress={() => onChange()}/>
            </View>
        </Container>
    )
}

export default React.memo(CardStatus)
