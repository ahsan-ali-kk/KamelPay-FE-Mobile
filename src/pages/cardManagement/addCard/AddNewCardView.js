import React, {memo} from "react";
import {useTranslation} from "react-i18next";
import Styles from "./AddCard.style";
import {CButton, CText, ProgressiveImage} from "../../../uiComponents";
import {View} from "react-native";
import {useNavigation} from "@react-navigation/native";

function AddNewCardView() {

    const { t } = useTranslation();
    const navigation = useNavigation();

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
                onPress={() => navigation.navigate('add_card')}
            />
        </View>
    )
}
export default memo(AddNewCardView);
