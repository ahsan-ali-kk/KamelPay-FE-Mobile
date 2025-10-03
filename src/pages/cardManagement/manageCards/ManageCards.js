import React, {memo} from "react";
import {View, TouchableOpacity} from "react-native";
import Styles from "./ManageCards.style";
import AuthStyle from "../../auth/Auth.style";
import {ViewContainer} from "../../../containers";
import {CModal, CText, ProgressiveImage} from "../../../uiComponents";
import {foundProduct, MappedElement} from "../../../utils/methods";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {toggleCardSelectionModal, updateCard} from "../../../store/actions/Global.action";

function ManageCards() {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global}) => {
        return {
            selectedCard: global.selectedCard,
            cards: auth.user?.cards || [],
            isOpen: global.cardSelectionModalIsOpen
        }
    });

    const {cards, selectedCard, isOpen} = reduxState;

    let headerProps = {
        headerTitle: t('PAGE_TITLE.CARD_MANAGEMENT'),
        headerRight: true,
        backOnPress:() => closeModal()
    };

    const onSelect = (item, index) => {
        dispatch(updateCard(item, index));
        closeModal();
    };

    const closeModal = () => {
        dispatch(toggleCardSelectionModal(false))
    };

    return (
        <CModal isOpen={isOpen}
                close={() => headerProps?.backOnPress()}
                headerProps={headerProps}>

            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>

                <View style={[AuthStyle.titleAndText, Styles.textContent]}>
                    <CText style={AuthStyle.title}>{t('CARD_MANAGEMENT.TITLE')} </CText>
                    <CText style={AuthStyle.text}>{t('CARD_MANAGEMENT.SUB_TITLE')} </CText>
                </View>

                <View style={Styles.list}>
                    <MappedElement
                        data={cards}
                        renderElement={(card, index) => {
                            const founded = foundProduct(card?.companyProductCode);
                            let bgColor = card?.hasCustomTheme && card?.themeSettings?.colors?.primary ? card?.themeSettings?.colors?.primary : founded?.backgroundColor;
                            return (
                                <TouchableOpacity key={index}
                                                  style={[Styles.listItem, selectedCard?._id === card?._id && Styles.activeListItem]}
                                                  onPress={() => onSelect(card, index)}>
                                    <ProgressiveImage
                                        style={[Styles.listItemVector, bgColor && {backgroundColor: bgColor}]}
                                        source={require('../../../assets/images/transparent-card-vector.png')}
                                    />
                                    <View style={Styles.listItemContent}>
                                        <CText style={Styles.listItemText}>
                                            {t('CARD_MANAGEMENT.CARD_TYPE')} {'  '}<CText style={Styles.listItemTextBlack}>{founded?.type}</CText>
                                        </CText>
                                        <CText style={Styles.listItemText}>
                                            {t('CARD_MANAGEMENT.EXP_DATE')} {'  '} <CText style={Styles.listItemTextBlack}>{card?.expiry}</CText>
                                        </CText>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>

            </ViewContainer>

        </CModal>
    )
}
export default memo(ManageCards)
