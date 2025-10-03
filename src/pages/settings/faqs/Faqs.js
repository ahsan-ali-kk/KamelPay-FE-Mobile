import React from 'react';
import {View, ScrollView} from "react-native";
import {Container} from "../../../containers";
// import Styles from "./Settings.style";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";

function Faqs() {
    const { t } = useTranslation();

    const headerProps = {
        headerTitle: 'FAQs',
        headerRight: true,
    };


    return (
        <Container headerProps={headerProps}>

        </Container>
    )
}

export default React.memo(Faqs);
