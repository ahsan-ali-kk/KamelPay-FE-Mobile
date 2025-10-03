import React, {useEffect} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {AlertView, CButton, CEmpty, CText, HorizontalList, ProgressiveImage} from "../../uiComponents";
import {View, TouchableOpacity, Dimensions, ScrollView, RefreshControl} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./Savings.style";
import {useTranslation} from "react-i18next";
import {getCategories, subscriptionCreate, toggleSubscriptionModal} from "../../store/actions/Savings.action";
import Carousel from "react-native-snap-carousel";
import {formatAmount, MappedElement, openDialScreen} from "../../utils/methods";
import _ from "lodash";
import moment from 'moment';
import Popup from "../../uiComponents/popup/Popup";
import {checkUserAndCardStatus} from "../home/Home";
import SubscribeModal from "./SubscribeModal";

const windowWidth = Dimensions.get('window').width;


export const checkSubscribedOrActiveUser = (t, data, callBack) => {
    if(data && data?.isUserSubscribed){
        if(data && data?.userActiveSubscribe) {
            callBack && callBack()
        } else {
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'Warning',
                title: t('POPUPS.INSUFFICIENT_BALANCE.TITLE'),
                text: t('POPUPS.INSUFFICIENT_BALANCE.SUB_TITLE'),
                actions: [
                    {
                        text: t('GLOBAL.CANCEL'),
                        callback: () => Popup.hide()
                    },
                ]
            })
        }
    } else {
        callBack && callBack()
    }
};

function Categories(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {route: {params: data}, navigation} = props;

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            categories: savings.categories,
            popularSubCategories: savings.popularSubCategories,
            categoriesBanners: savings.categoriesBanners,
            profileInfo: savings.profileInfo,
            loading: savings.categoriesLoading || savings.savingsStatusLoading,
            user: auth.user,
            card: global.selectedCard,
            populars: global.populars,
            savingsStatus: savings.savingsStatus,
        }
    });

    const get = () => {
        dispatch(getCategories())
    };

    useEffect(() => {
        get()
    }, []);

    const onRefreshHandler = () => {
        get()
    };

    const headerProps = {
        headerTitle: t('K_S.TITLE'),
        headerRight: true,
    };

    const onSelect = (cat) => {
        checkSubscribedOrActiveUser(t, reduxState?.savingsStatus,() => {
            navigation.navigate('savings_sub_categories', {
                pageTitle: cat?.categoryName,
                category: cat
            })
        })
    };

    const renderItem = (item, index) => {
        return <TouchableOpacity key={index} style={Styles.category} onPress={() => onSelect(item)}>
            <View style={Styles.categoryHeader}>
                <ProgressiveImage
                    style={Styles.categoryHeaderImage}
                    source={{uri: item?.logo}}
                    fallback
                    resizeMode="contain"
                    // defaultSource={require('../../assets/images/others.png')}
                />
            </View>
            <View style={Styles.categoryBody}>
                <CText style={Styles.categoryBodyText}>{item?.categoryName}</CText>
            </View>
        </TouchableOpacity>
    };

    const renderCategories = () => {
        return (
            <View style={Styles.categoryList}>
                <MappedElement
                    data={reduxState?.categories}
                    renderElement={renderItem}
                    empty={() => <CEmpty
                       icon={require('../../assets/images/categories-placeholder.png')}
                       text={t('K_S.EMPTY_SECTION_TITLE')}
                    />}

                />
            </View>
        )
    };

    const renderSlides = ({item, index}) => {
        return (
            <View style={Styles.bannerContainerSlide} key={index}>
                <ProgressiveImage
                    style={Styles.bannerContainerImage}
                    source={{uri: item?.bannerImage}}
                    fallback
                    resizeMode="cover"
                    defaultSource={require('../../assets/images/category-placeholder.png')}/>
            </View>
        )
    };

    const renderCategoriesBanners = () => {
        return reduxState?.categoriesBanners?.length ?  (
            <View style={Styles.bannerContainer}>
                <Carousel
                    data={reduxState?.categoriesBanners}
                    sliderWidth={windowWidth}

                    itemWidth={windowWidth - 60}
                    renderItem={renderSlides}

                    currentSelectIndex={1}
                    currentScrollPosition={1}
                    enableMomentum={true}
                    decelerationRate={0.9}
                />
            </View>
        ) : null
    };

    const renderSubscriptionBanner = () => {
        return (
            <View>
                <TouchableOpacity style={Styles.subscriptionBannerContainer} onPress={() => onSubscribe()}>
                    <ProgressiveImage
                        resizeMode="contain"
                        style={Styles.subscriptionBannerTopLeftVector}
                        source={require('../../assets/images/savings_banner/top-left_vector.png')}
                    />
                    <ProgressiveImage
                        resizeMode="contain"
                        style={Styles.subscriptionBannerBottomRightVector}
                        source={require('../../assets/images/savings_banner/bottom_right_vector.png')}
                    />
                    <View style={Styles.subscriptionBannerContent}>
                        <CText style={Styles.subscriptionBannerTitle}>
                            {t('K_S.SUBSCRIBE_SECTION_TITLE')}
                        </CText>
                        <CText style={Styles.subscriptionBannerSubTitle}> {t('K_S.SUBSCRIBE_SECTION_SUB_TITLE')} </CText>
                        <View style={Styles.subscriptionBannerButtonStyle}>
                            <CText style={Styles.subscriptionBannerButtonTextStyle}>
                                {t('K_S.SUBSCRIBE_SECTION_BUTTON')}
                            </CText>
                        </View>
                    </View>

                    <View>
                        <ProgressiveImage
                            resizeMode="contain"
                            style={Styles.subscriptionBannerVector}
                            source={require('../../assets/images/savings_banner/mobile_screen.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    const onSubscribe = () => {
        if(reduxState?.savingsStatus?.subscriptionId){
            dispatch(toggleSubscriptionModal({
                isOpen: true,
                otp_verified: false,
            }))
        }
    };

    const renderYourSavings = () => {
        return (
            <View style={Styles.savingContainer}>
                <ProgressiveImage
                    resizeMode="contain"
                    style={Styles.subscriptionBannerTopLeftVector}
                    source={require('../../assets/images/savings_banner/top-left_vector.png')}
                />
                <ProgressiveImage
                    resizeMode="contain"
                    style={[Styles.subscriptionBannerBottomRightVector, {
                        width: 200,
                        height: 50,
                        position: 'absolute',
                        right: -3,
                        bottom: 0
                    }]}
                    source={require('../../assets/images/savings_banner/bottom_right_vector.png')}
                />
                <View style={Styles.savingContainerContent}>
                    <CText style={Styles.savingContainerTitle}>{t('K_S.WALLET_SECTION_TITLE')}</CText>
                    <CText style={Styles.savingContainerAmount}>
                        {formatAmount(reduxState?.profileInfo?.totalSavings, 'AED')}
                    </CText>
                </View>
                <View>
                    <ProgressiveImage
                        style={Styles.savingContainerVector}
                        source={require('../../assets/images/your-savings.png')}
                    />
                </View>
            </View>
        );
    };

    const getPopularData = () => {
        let data = [];
        if(reduxState?.popularSubCategories?.length) {
            reduxState?.popularSubCategories.forEach((o) => {
                let subCategory = _.omit(o, ['category']);
                data.push({
                    ...o,
                    route: 'savings_vendors',
                    params: {
                        pageTitle: o?.name,
                        category: o?.category,
                        subCategory,
                    },
                })
            })
        }
        return data;
    };

    const horizontalListOnPress = (item) => {
        if(item.route) {
            checkSubscribedOrActiveUser(t, reduxState?.savingsStatus,() => {
                navigation.navigate(item.route, item?.params || {})
            });
        }
    };

    const reSubscribe = () => {
        Popup.hide();
        checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
            if(type === 'FUNCTION') {
                let payload = {
                    subscription: reduxState?.savingsStatus?.subscriptionId,
                    card: reduxState?.card?._id,
                    reSubscribe: true
                };
                dispatch(subscriptionCreate(payload, subscriptionCreateCallBack))
            }
        }, {
            isShowPopup: true
        });
    };

    const subscriptionCreateCallBack = (res) => {
        setTimeout(() => {
            if(res?.error){
                Popup.show({
                    isVisible: true,
                    type: 'Error',
                    title: t('GLOBAL.ERROR'),
                    text: res?.data?.message,
                    actions: [
                        {
                            text: t('GLOBAL.TRY_AGAIN'),
                            callback: () => Popup.hide()
                        },
                        {
                            text: t('GLOBAL.CONTACT_US'),
                            callback: () => {
                                Popup.hide();
                            }
                        }
                    ]
                })
            } else {
                Popup.show({
                    isVisible: true,
                    type: 'Success',
                    title: t('GLOBAL.SUCCESS'),
                    text: res?.data?.message,
                    actions: [
                        {
                            text: t('GLOBAL.OK'),
                            callback: () => Popup.hide()
                        }
                    ]
                })
            }
        }, 100)
    };

    const reSubscribeAlert = () => {
        Popup.show({
            isVisible: true,
            type: 'Warning',
            title: t('K_S.RE_SUBSCRIBE_ALERT_TITLE'),
            text: t('K_S.RE_SUBSCRIBE_ALERT_DESCRIPTION'),
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => reSubscribe()
                },
                {
                    text: t('GLOBAL.CANCEL'),
                    callback: () => {
                        Popup.hide();
                        openDialScreen();
                    }
                }
            ]
        })
    };

    const renderSavingsSubscriptionRemaining = () => {
        if(reduxState?.savingsStatus?.isSubscriptionRemaining && reduxState?.savingsStatus?.savingsEndDate){
            return <AlertView
                showIcon={false}
                viewStyle={{marginTop: 15}}
                buttonProps={{
                    title: t('K_S.RE_SUBSCRIBE'),
                    onPress: () => reSubscribeAlert()
                }}
                text={t('K_S.SUBSCRIPTION_EXPIRE_TITLE')}
                subText={`${moment(reduxState?.savingsStatus?.savingsEndDate).format('DD MMM YYYY')}`}
            />
        }
        return null;
    };

    return (
        <Container headerProps={headerProps} loading={reduxState.loading}>
            <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshHandler}/>}
                        contentContainerStyle={Styles.categoriesScrollContainer}>

                {reduxState?.savingsStatus?.isUserSubscribed ? renderYourSavings() : renderSubscriptionBanner()}

                {renderSavingsSubscriptionRemaining()}

                {getPopularData().length ? <HorizontalList title={t('K_S.POPULAR_SUB_CATEGORIES')}
                                                           style={Styles.popularCategoryList}
                                                           data={getPopularData()}
                                                           itemTextStyle={Styles.categoryBodyText}
                                                           onPress={(item) => horizontalListOnPress(item)}
                /> : null}

                <CText style={[GlobalStyle.listTitle, Styles.categoryListTitle]}>
                   {t('K_S.MAIN_PAGE_TITLE')}
                </CText>

                {renderCategories()}

            </ScrollView>

            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('K_S.VIEW_HISTORY')}
                         disabled={reduxState.loading}
                         onPress={() => navigation.navigate('savings_history')}
                />
                <CButton title={t('K_S.VIEW_FAVOURITES')}
                         type="without_outline"
                         disabled={reduxState.loading}
                         onPress={() => navigation.navigate('savings_favourites')}
                />
            </View>

            <SubscribeModal />

        </Container>
    )
}

export default React.memo(Categories)
