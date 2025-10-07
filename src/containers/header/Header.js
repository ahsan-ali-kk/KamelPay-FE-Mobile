import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Styles from './Header.style';
import KamelPayIcon from '../../assets/icons/KamelPayIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import {useSelector} from "react-redux";
import {openWhatsApp} from "../../utils/methods";
import {CText, IconButton, LanguagePicker, ProgressiveImage} from "../../uiComponents";
import {useTranslation} from "react-i18next";
import {SafeAreaView} from "../index";

function Header(props) {

    const { t } = useTranslation();

    const navigation = useNavigation();

    const {headerLeft, headerTitle = ' ', headerTitleElement, headerRight, backOnPress,
        hideNotification = false, hideBackButton = true, showCenterLogo = false, goBackWithRoute, isPaddingTop = true,
        showWhatsApp = true, flashIcon = false, flashIconName = '', flashOnPress = null, isLanguageChange = false, headerLeftShow = true} = props;

    const {isLoggedIn} = useSelector(({auth}) => {
        return {
            isLoggedIn: auth.isLoggedIn
        }
    });

    const renderHeaderTitle = (title) => {
        return <CText style={Styles.headerTitleStyle} numberOfLines={1}>
            {title}
        </CText>
    };

    const backPress = () => {
        if (backOnPress){
            backOnPress()
        } else {
            navigation.goBack()
        }
    };

    const backButton = () => {
        return hideBackButton ? (
            <TouchableOpacity style={Styles.headerButton} onPress={() => backPress()}>
                <AntDesign name="arrowleft" style={[Styles.headerButtonIcon,
                    {transform: [{ scaleX: false ? -1 : 1 }]}]}/>
            </TouchableOpacity>
        ) : <View style={{width: 24}}/>
    };

    const menuButton = () => {
        return (
            <TouchableOpacity style={Styles.headerButton} onPress={() => navigation.toggleDrawer()}>
                <KamelPayIcon name="menu" style={Styles.headerButtonIcon}/>
            </TouchableOpacity>
        )
    };

    const renderWhatsAppButton = () => {
        return showWhatsApp ? (
            <TouchableOpacity style={[
                Styles.headerButton,
                Styles.whatsAppCallButton,
                isLoggedIn && (hideNotification) && Styles.otherOptionsButtonSpace
            ]} onPress={() => openWhatsApp(t)}>
                <ProgressiveImage
                    style={Styles.whatsAppCallButtonImage}
                    source={require('../../assets/images/whatsapp_icon_white.png')}
                />
            </TouchableOpacity>
        ) : null
    };

    const otherOptionsButton = () => {
        return (
            <View style={Styles.otherOptions}>
                {isLanguageChange ? <LanguagePicker
                    type="button-icon"
                    isVisibleLanguage={false}
                    style={{marginLeft: -40, marginRight: 15}}
                /> : null}
                {renderWhatsAppButton()}
                {isLoggedIn && hideNotification ? <IconButton iconName="notification"/> : null}
                {(flashIcon && flashIconName) ? <IconButton materialIcons={flashIconName} onPress={flashOnPress} buttonType={'button'} /> : null}
            </View>
        )
    };

    const centerLogo = () => {
        return (
            <View style={Styles.headerLogo}>
                <ProgressiveImage style={Styles.headerLogoImage}
                                  source={require('../../assets/images/logo.png')}/>
            </View>
        )
    };

    return (
        <SafeAreaView edges={['top', 'left', 'right']}>
            <View style={Styles.headerStyle}>
                <View style={Styles.container}>
                    {headerLeftShow ? headerLeft ? menuButton() : backButton() : null}
                    {showCenterLogo ? centerLogo() : headerTitleElement ? headerTitleElement() : headerTitle ? renderHeaderTitle(headerTitle) : null}
                    {headerRight ? otherOptionsButton() : null}
                </View>
            </View>
        </SafeAreaView>
    );
}

export default React.memo(Header);
