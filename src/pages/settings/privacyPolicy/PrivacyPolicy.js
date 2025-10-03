import React from 'react';
import {View, ScrollView} from "react-native";
import {Container} from "../../../containers";
// import Styles from "./Settings.style";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";

function PrivacyPolicy() {
    const { t } = useTranslation();

    const headerProps = {
        headerTitle: 'Privacy Policy',
        headerRight: true,
    };


    return (
        <Container headerProps={headerProps}>

        </Container>
    )
}

export default React.memo(PrivacyPolicy);
