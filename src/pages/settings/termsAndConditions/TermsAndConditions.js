import React from 'react';
import {View, ScrollView} from "react-native";
import {Container} from "../../../containers";
// import Styles from "./Settings.style";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";

function TermsAndConditions() {
    const { t } = useTranslation();

    const headerProps = {
        headerTitle: 'Terms & Conditions',
        headerRight: true,
    };


    return (
        <Container headerProps={headerProps}>

        </Container>
    )
}

export default React.memo(TermsAndConditions);
