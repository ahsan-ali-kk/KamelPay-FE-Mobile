import React, {memo, useRef} from 'react';
import {Animated, View, Platform, TouchableOpacity} from 'react-native';
import Styles from './Container.style';
import {CText, IconButton, ProgressiveImage, CLoading, LanguagePicker} from "../../uiComponents";
import {Header, SafeAreaView, ViewContainer} from "../../containers";
import {
    checkIsAppUserOrRegisterDevice,
    checkIsDeviceRegistered,
    getFullName,
    getPhone,
    getTimeMessage
} from "../../utils/methods";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import Popup from "../../uiComponents/popup/Popup";

export const HEADER_HEIGHT = 100;

export const StarCustomer = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const reduxState = useSelector(({auth, global}) => ({
        user: auth.user,
        masterDetails: global.masterDetails,
        getMasterDetailsLoading: global.getMasterDetailLoading
    }));

    const {user, masterDetails, getMasterDetailsLoading} = reduxState;

    const showPopup = (data) => {
        Popup.show({
            isVisible: true,
            type: 'customView',
            customView: () => {
                return (
                    <View style={{marginBottom: 30}}>
                        <ProgressiveImage
                            style={{
                                width: 200,
                                height: 150
                            }}
                            source={require('./../../assets/images/3d-vector/star-customer-vector.png')}
                        />
                    </View>
                )
            },
            ...data
        })
    };

    const tapToView = () => {
        let data = {};
        if(user?.isSuperStar){
            data = {
                title: t('NAQAD_STAR_USER.LONG_TITLE'),
                text: masterDetails?.superStarText,
                actions: [
                    {
                        text: t('GLOBAL.CANCEL'),
                        callback: () => {
                            Popup.hide();
                        }
                    },
                ]
            }
        } else {
            data = {
                title: t('NAQAD_STAR_USER.LONG_SECOND_TITLE'),
                text: masterDetails?.nonSuperStarText,
                actions: [
                    {
                        text: t('GLOBAL.CLICK_NOW'),
                        callback: () => {
                            navigation.navigate('Settings', {
                                screen: 'referral',
                                initial: false,
                            });
                            Popup.hide();
                        }
                    },
                ]
            }
        }
        showPopup(data)
    };

    const renderTitle = (val) => val ? t('NAQAD_STAR_USER.SHORT_TITLE') : t('NAQAD_STAR_USER.SHORT_SECOND_TITLE');

    return !getMasterDetailsLoading && (user?.isSuperStar ? masterDetails?.superStarText : masterDetails?.nonSuperStarText) ? (
        <TouchableOpacity onPress={() => tapToView()}
                          activeOpacity={0.7}
                          style={[Styles.starUser, !user?.isSuperStar && Styles.nonStarUser]}>
            <ProgressiveImage style={Styles.starUserIcon}
                              resizeMode={'contain'}
                              source={require('../../assets/images/star-customer-icon.png')}/>
           <View style={Styles.starUserTextContent}>
               <CText style={Styles.starUserText}>
                   {renderTitle(user?.isSuperStar)}
               </CText>
               <CText style={[Styles.starUserText, Styles.underLineText]}>
                   ({t('NAQAD_STAR_USER.TAP_TO_VIEW')})
               </CText>
           </View>
        </TouchableOpacity>
    ) : null
};
export const AnimatedHeader = ({ elevation, titleTranslateY, opacity, headerProps }) => {
    const { t } = useTranslation();

    const {headerTitle = ''} = headerProps;

    const reduxState = useSelector(({auth, global}) => ({
        user: auth.user,
        unreadNotificationCount: auth.unreadNotificationCount,
        masterDetails: global.masterDetails
    }));

    const {user, unreadNotificationCount} = reduxState;

    const navigation = useNavigation();

    return (

        <Animated.View style={[Styles.homeHeader, {
            shadowOpacity: opacity,
            elevation: elevation,
        }]}>
           <View style={Styles.homeHeaderContainer}>
               <View style={Styles.homeHeaderContent}>
                   <CText style={[Styles.homeHeaderContentSubTitle, { transform: [{translateY: titleTranslateY}] }]}>
                       {headerTitle ? getFullName(user) : ` ${t("GLOBAL.HI")}, ${t(getTimeMessage())}`}
                   </CText>
                   <CText style={Styles.homeHeaderContentTitle} numberOfLines={1}>
                       {headerTitle ? headerTitle : getFullName(user) || getPhone(user)}
                   </CText>
               </View>
               <Animated.View style={[Styles.homeHeaderButtons]}>
                   {checkIsDeviceRegistered(user) ? <IconButton
                       badge={unreadNotificationCount > 0}
                       buttonType={'button'}
                       onPress={() => navigation.navigate('Notifications')}
                       iconName="bell"/> : null}
                   <LanguagePicker type="button-icon" />
               </Animated.View>
           </View>

            {checkIsAppUserOrRegisterDevice(user, () => {
                return <StarCustomer />
            })}

        </Animated.View>
    )

};

function Container(props) {

    const scrollY = useRef(new Animated.Value(0)).current;

    const {children, headerProps = {}, customHeader, scrollView = false, scrollViewProps,
        edges = [], style, SafeAreaViewStyle, loading, renderFooter, loadingMarginTop, loadingWithOverlay} = props;

    const renderHeader = () => {
        if(Object.keys(headerProps).length) {
            return <Header {...headerProps} />
        } else {
            return null
        }
    };
    const getEdges = () => {
        if(Object.keys(headerProps).length) {
            return edges?.length ? edges : ['left', 'right', 'bottom']
        } else {
            return edges?.length ? edges : ['top', 'left', 'right', 'bottom']
        }
    };

    const titleTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT*2],
        outputRange: [0, 0, -HEADER_HEIGHT-30],
        extrapolate: 'clamp',
    });

    const containContainerTranslateYOutputRange = Platform.OS === 'ios' ? -60 : -45;

    const actionsTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, -40],
        extrapolate: 'clamp',
    });

    const containContainerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, containContainerTranslateYOutputRange],
        extrapolate: 'clamp',
    });
    const opacity = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, 0.2],
        extrapolate: 'clamp',
    });
    const elevation = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, 6],
        extrapolate: 'clamp',
    });

    return(
        <ViewContainer style={[Styles.background, style]}>
            <ProgressiveImage style={Styles.backgroundVector}
                              source={require('../../assets/images/background-vector-logo.png')}/>

            {renderHeader()}

            <SafeAreaView edges={getEdges()} style={[Styles.backgroundContainer, SafeAreaViewStyle]}>
                {loadingWithOverlay ? <CLoading loading={loadingWithOverlay} /> : null}

                {loading ? <CLoading showAnimation={true}
                                     transparent={true}
                                     style={{marginTop: loadingMarginTop ? loadingMarginTop : -HEADER_HEIGHT}}
                                     loading={loading}/> : <Animated.View style={{flex: 1, marginTop: containContainerTranslateY, backgroundColor: 'transparent'}}>
                    {customHeader ? <AnimatedHeader
                        titleTranslateY={titleTranslateY}
                        actionsTranslateY={actionsTranslateY}
                        opacity={opacity}
                        headerProps={headerProps}
                        elevation={elevation}
                    /> : null}

                    {scrollView ? <Animated.ScrollView {...scrollViewProps}
                                                       scrollEventThrottle={16}
                                                       onScroll={customHeader ? Animated.event(
                                                           [{nativeEvent: {contentOffset: {y: scrollY}}}],
                                                           {useNativeDriver: false},
                                                       ) : null}>
                        {children}
                    </Animated.ScrollView> : children}
                </Animated.View>}
                {!loading && renderFooter && renderFooter()}
            </SafeAreaView>

        </ViewContainer>
    )
}
export default memo(Container);
