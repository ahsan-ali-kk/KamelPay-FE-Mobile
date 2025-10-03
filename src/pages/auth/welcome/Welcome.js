import React, {useEffect, useRef, useState} from 'react';
import { View } from 'react-native';
import Swiper from 'react-native-swiper';
import Styles from './WelcomeStyle';
import {CButton, CText} from "../../../uiComponents";
import {slides} from "./Data";
import {Container, ViewContainer} from "../../../containers";
import {useTranslation} from "react-i18next";
import LottieView from 'lottie-react-native';
import {WELCOME_SCREEN} from "../../../utils/asyncStorage/Constants";
import {_setDataToAsyncStorage} from "../../../utils/asyncStorage/Functions";

const renderSlides = (slides, translation) => {
    if (slides && slides.length) {
        return slides.map((slide, index) => {
            return (
                <ViewContainer key={index} style={Styles.slide}>
                    {slide.animation ? <LottieView
                        source={slide.animation}
                        style={Styles.slideImage}
                        autoPlay loop /> : null}
                    <CText style={Styles.slideTitle}>{translation(slide.title)}</CText>
                    <CText style={Styles.slideContent}>{translation(slide.content)}</CText>
                </ViewContainer>
            );
        });
    }
    return null;
};

function Welcome(props) {

    const slider  = useRef();
    const { t } = useTranslation();
    const [currentIndex, updateCurrentIndex] = useState(0);
    const { navigation } = props;

    const skipFunc = async () => {
        await _setDataToAsyncStorage(WELCOME_SCREEN, 'hide');
        navigation.navigate('login')
    };

    const onNext = () => {
        slider?.current?.scrollTo(currentIndex+1)
    };

    return(
        <Container>
                <View style={Styles.skipHeader}>
                    <CButton
                        title={t('GLOBAL.SKIP')}
                        buttonStyle={Styles.skipHeaderButton}
                        buttonText={[Styles.globalButtonText]}
                        onPress={() => skipFunc()}
                    />
                </View>

                <Swiper
                    ref={slider}
                    style={{backgroundColor:'transparent'}}
                    showsButtons={false}
                    loop={false}
                    onIndexChanged={(index) => updateCurrentIndex(index)}
                    dotStyle={Styles.sliderDot}
                    activeDotStyle={Styles.sliderActiveDot}
                    paginationStyle={Styles.sliderDotContainer}>
                    {renderSlides(slides, t)}
                </Swiper>

                <View style={[Styles.buttonContainer, currentIndex === 2 && {
                    alignItems: 'stretch'
                }]}>
                    {currentIndex !== 2  ? <CButton title={t('GLOBAL.NEXT')}
                                                     buttonStyle={Styles.skipHeaderButton}
                                                     buttonText={[Styles.globalButtonText]}
                                                    iconStyle={Styles.iconStyle}
                                                     iconName="right-arrow"
                                                    onPress={() => onNext()}
                    /> : <CButton title={t('GLOBAL.LOGIN')}
                        onPress={() => skipFunc()}
                    />}

                </View>
        </Container>

    )
}
export default Welcome;
