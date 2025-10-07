import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import Styles from "./AddCard.style";
import {CButton, CText, ProgressiveImage} from "../../../uiComponents";
import {View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {checkUserAndCardStatus, USER_TYPES, userVerificationPopup} from "../../home/Home";
import {useSelector} from "react-redux";
import {isMinimalUser} from "../../../utils/methods";

function AddNewCardView() {

    const { t } = useTranslation();
    const navigation = useNavigation();
    const isMinimalUserCheck  = useRef(false);

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            user: auth.user,
            masterDetails: global.masterDetails,
        }
    });

    useEffect(() => {
        isMinimalUser(
            reduxState?.user,
            () => isMinimalUserCheck.current = true,
            () => isMinimalUserCheck.current = false,
        );
    }, [reduxState?.user])

    return (
        <View style={Styles.addNewCardContainer}>
            <ProgressiveImage
                resizeMode="contain"
                source={require('../../../assets/images/new-card-vector.png')}
                style={Styles.addNewCardContainerVector}/>
            <CText style={Styles.addNewCardContainerTitle}>
                {t('ADD_CARD.TITLE')}
            </CText>
            <CText style={Styles.addNewCardContainerSubTitle}>
                {t('ADD_CARD.THIRD_TITLE')}
            </CText>
            <CButton
                title={t('GLOBAL.ADD')}
                type="outline"
                buttonStyle={{minWidth: 200}}
                {...(!reduxState.masterDetails?.hasLightUserLinkANewCard ? {
                    onPress: () => isMinimalUserCheck ? userVerificationPopup(t, USER_TYPES.MINIMAL_USER._id) : navigation.navigate('add_card')
                } : {
                    onPress: () => checkUserAndCardStatus(t, {}, ({type}) => {
                        if(type === 'NAVIGATE') {
                            navigation.navigate('add_card')
                        }
                    }, {routeName: 'add_card', notCheckCardStatus: true, isShowPopup: true}),
                })}
                // onPress={() => navigation.navigate('add_card')}
            />
        </View>
    )
}
export default memo(AddNewCardView);
