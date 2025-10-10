import * as React from 'react';
import {View, ActivityIndicator} from 'react-native';
import styles from './CLoading.style';
import {themes} from "../../theme/colors";
import {CText} from "../index";
import LottieView from "lottie-react-native";
import {useTranslation} from "react-i18next";

const CLoading = ({style, loading, text,
                      theme,
                      color = theme?.['light'].colors.secondary,
                      showAnimation = false,
                      transparent = false,
                      animationStyle,
                    textStyle,
                  }) => {
    const { t } = useTranslation();

    text = text === 'hide' ? '' : text ? text : t('GLOBAL.PLEASE_WAIT');
    if(loading) {
        return (
            <View style={[styles.wrapper, transparent && {backgroundColor: 'transparent'}, style]}>
                {showAnimation ? <LottieView
                    source={require('../../assets/animations/logo-icon-animate2')}
                    style={[styles.animation, animationStyle]}
                    autoPlay loop /> : <ActivityIndicator style={styles.loading} size="large" color={color} />}
                {text ? <CText style={[styles.loadingText, textStyle]}>{text}</CText> : null}
            </View>
        );
    } else {
        return null
    }

};



export default React.memo(CLoading);
