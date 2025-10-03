import React from 'react';
import {View, ScrollView, TouchableOpacity} from "react-native";
import {Container} from "../../../containers";
import {ProgressiveImage, CText, IconButton} from "../../../uiComponents";
import Styles from "../Settings.style";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {MappedElement} from "../../../utils/methods";
import {useTranslation} from "react-i18next";

function AboutUs() {
    const { t } = useTranslation();

    const headerProps = {
        headerTitle: 'About Us',
        headerRight: true,
    };


    const mainFocus = [
        {
            icon: 'send-money',
            title: 'Send Remittance',
            text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit'
        },
        {
            icon: 'utility-bill',
            title: 'Pay Bills',
            text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit'
        },
        {
            icon: 'mobile-recharge',
            title: 'Mobile Top up',
            text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit'
        }
    ]

    return (
        <Container headerProps={headerProps}>
            <ScrollView contentContainerStyle={Styles.listContainer}>

                <View style={Styles.headerVector}>
                    <ProgressiveImage
                        style={Styles.headerVectorImage}
                        source={require('../../../assets/images/about-us.png')}/>
                </View>

                <CText style={Styles.heading}>About NaqaD</CText>

                <CText style={Styles.paragraph}>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure
                    dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla
                    facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril
                    delenit augue duis dolore te feugait nulla facilisi.
                    {'\n'}
                    {'\n'}
                    Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt
                    ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci
                    tation ullamcorper
                </CText>

                <CText style={Styles.heading}>Our Main Focus</CText>


                <MappedElement
                    data={mainFocus}
                    renderElement={(obj, i) => {
                        return (
                            <View key={i} style={Styles.mainFocusListItem}>
                                <IconButton
                                    buttonType='normal'
                                    type="icon-with-background"
                                    iconName={obj.icon} />
                                <View style={Styles.mainFocusListItemContent}>
                                    <CText style={Styles.mainFocusListItemContentTitle}>
                                        {obj.title}
                                    </CText>
                                    <CText style={Styles.mainFocusListItemContentText}>
                                        {obj.text}
                                    </CText>
                                </View>
                            </View>
                        )
                    }}
                />



            </ScrollView>
        </Container>
    )
}

export default React.memo(AboutUs);
