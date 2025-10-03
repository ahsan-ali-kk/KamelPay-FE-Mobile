import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, View, ScrollView} from "react-native";
import {Container} from "../../containers";
import {
    checkIsAppUserOrRegisterDevice, checkIsDeviceRegistered,
    getFullName,
    getPhone, isLightUser,
    isMinimalUser,
    isShowUpdateOrBlockAppEmiratesIdAlert,
    MappedElement,
    openDialScreen
} from "../../utils/methods";
import Styles from "./Settings.style";
import {AlertView, CText, IconButton, ProgressiveImage, LanguagePicker, CLoading} from "../../uiComponents";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../store/actions/Auth.action";
import DeviceInfo from "react-native-device-info";
import {useTranslation} from "react-i18next";
import Popup from "../../uiComponents/popup/Popup";
import {subscriptionCancel} from "../../store/actions/Savings.action";
import {checkUserAndCardStatus, USER_TYPES, userVerificationPopup} from "../home/Home";
import moment from 'moment';
import UpdateEmiratesID from "../home/UpdateEmiratesID";

function Settings(props) {

    const { t } = useTranslation();

    const currentCode = DeviceInfo.getBuildNumber();
    const currentVersion = DeviceInfo.getVersion();
    const updateEmiratesIDRef  = useRef();
    const isMinimalUserCheck  = useRef(false);

    const {navigation} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            user: auth.user,
            card: global.selectedCard,
            subscriptionCancelLoading: savings.subscriptionCancelLoading,
            savingsStatus: savings.savingsStatus,
            loading: savings.subscriptionCancelLoading || auth.registerDeviceLoading || auth.getOcrTokenLoading || auth.updateEmiratesIDLoading,
            masterDetails: global.masterDetails,
        }
    });

    const headerProps = {
        headerTitle: t('SETTINGS.TITLE'),
        headerRight: true,
    };

    useEffect(() => {
        isMinimalUser(
            reduxState?.user,
            () => isMinimalUserCheck.current = true,
            () => isMinimalUserCheck.current = false,
        );
    }, [reduxState?.user])

    const unsubscribeConfirmation = () => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Warning',
            title: t('K_S.UN_SUBSCRIBE_ALERT_TITLE'),
            text: t('K_S.UN_SUBSCRIBE_ALERT_DESCRIPTION'),
            actions: [
                {
                    text: 'Unsubscribe',
                    callback: () => unsubscribe()
                },
                {
                    text: t('K_S.CONTINUE_SUBSCRIPTION'),
                    buttonText: {
                        textAlign: 'center',
                        fontSize: 12
                    },
                    callback: () => Popup.hide()
                },
            ]
        })
    };
    const unsubscribe = () => {
        Popup.hide();
        let payload = {
            type: 'SAVINGS_OFFER'
        };
        dispatch(subscriptionCancel(payload, subscriptionCancelCallBack))
    };
    const subscriptionCancelCallBack = () => {
        Popup.show({
            isVisible: true,
            imageSize: 'normal',
            type: 'Success',
            title: t('K_S.SUCCESSFULLY_UNSUBSCRIBE'),
            // text: 'If you can you resubscribe just click the Savings icon on our homepage',
            actions: [
                {
                    text: t('GLOBAL.OK'),
                    callback: () => {
                        Popup.hide();
                    }
                },
            ]
        })

    };

    let expiryEmiratesID = reduxState?.user?.expiryDate;
    let checkEmiratesIDExpiry = isShowUpdateOrBlockAppEmiratesIdAlert(expiryEmiratesID);

    const optionsMenu = [
        {
            key: 'PERSONAL_INFORMATION',
            name: t('SETTINGS.OPTIONS_ONE'),
            icon: 'personal-info',
            onPress: () => navigation.navigate('profile')
        },
        {
            key: 'PASSWORDS_AND_BIOMETRICS',
            name: t('SETTINGS.OPTIONS_TWO'),
            icon: 'lock',
            onPress: () => navigation.navigate('passwords_and_biometrics')
        },
        {
            name: t('SETTINGS.OPTIONS_FIVE'),
            icon: 'bell',
            onPress: () => navigation.navigate('Notifications')
        },
        {
            name: t('SETTINGS.OPTIONS_TEN'),
            icon: 'refresh',
            onPress: () => navigation.navigate('change_phone_number_request')
        },
        {
            name: 'Update Emirates ID',
            icon: 'timed',
            error: true,
            onPress: () => updateEmiratesIDRef?.current?.run({ type: 'GET_NEW_TOKEN' })
        },
        {
            name: 'Schedule Of Charges',
            icon: 'banktransfer',
            onPress: () => navigation.navigate('schedule_of_charges')
        },
        {
            name: 'Referral',
            icon: 'link-card',
            onPress: () => navigation.navigate('referral')
        }
        // {
        //     name: 'Update Emirates ID',
        //     icon: 'timed',
        //     error: true,
        //     onPress: () => UupdateEmiratesIDRef?.current?.run({
        //         type: 'RENEWED'
        //     })
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_SIX'),
        //     icon: 'Invite-and-Earn',
        //     // onPress: () => navigation.navigate('profile')
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_SEVEN'),
        //     icon: 'About-Application',
        //     onPress: () => navigation.navigate('about_us')
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_EIGHT'),
        //     icon: 'Points--Rewards',
        //     // onPress: () => navigation.navigate('profile')
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_NINE'),
        //     icon: 'FAQs',
        //     onPress: () => navigation.navigate('faqs')
        // },
    ];

    const generateMenuOptions = () => {

        let data = [
            {
                key: 'PERSONAL_INFORMATION',
                name: t('SETTINGS.OPTIONS_ONE'),
                icon: 'personal-info',
                onPress: () => navigation.navigate('profile')
            },
            {
                key: 'PASSWORDS_AND_BIOMETRICS',
                name: t('SETTINGS.OPTIONS_TWO'),
                icon: 'lock',
                onPress: () => navigation.navigate('passwords_and_biometrics')
            }
        ];

        if(checkIsDeviceRegistered(reduxState?.user)){
            data = [
                ...data,
                {
                    name: t('SETTINGS.OPTIONS_FIVE'),
                    icon: 'bell',
                    onPress: () => navigation.navigate('Notifications')
                }
            ]
        }

        checkIsAppUserOrRegisterDevice(
            reduxState?.user,
            () => {
                if(reduxState?.user?.status === 'ACTIVE'){
                    data = [
                        ...data,
                        ...[
                            {
                                name: t('SETTINGS.OPTIONS_TEN'),
                                icon: 'refresh',
                                onPress: () => !isMinimalUserCheck.current ? navigation.navigate('change_phone_number_request') : userVerificationPopup(t, USER_TYPES.MINIMAL_USER._id)
                            },
                            ...(isLightUser(reduxState?.user,
                                () => {
                                    return [{
                                        name: t('SETTINGS.OPTIONS_TWELVE'),
                                        icon: 'timed',
                                        error: true,
                                        onPress: () => checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
                                            if(type === 'FUNCTION') {}
                                        }, {isShowPopup: true})
                                    }]
                                },
                                () => {
                                    if(isMinimalUserCheck.current){
                                        return [{
                                            name: t('SETTINGS.OPTIONS_TWELVE'),
                                            icon: 'timed',
                                            error: true,
                                            onPress: () => checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
                                                if(type === 'FUNCTION') {}
                                            }, {isShowPopup: true})
                                        }]
                                    } else {
                                        return [{
                                            name: t('SETTINGS.OPTIONS_ELEVEN'),
                                            icon: 'timed',
                                            error: true,
                                            onPress: () => updateEmiratesIDRef?.current?.run({ type: 'GET_NEW_TOKEN' })
                                        }]
                                    }
                                },
                            )),
                            {
                                name: t('SETTINGS.OPTIONS_THIRTEEN'),
                                icon: 'banktransfer',
                                onPress: () => navigation.navigate('schedule_of_charges')
                            },
                            {
                                name: t('SETTINGS.OPTIONS_FOURTEEN'),
                                icon: 'link-card',
                                onPress: () => navigation.navigate('referral')
                            }
                        ]
                    ]
                }
            },
            () => {
                return data;
            }
        );

        // {
        //     name: 'Update Emirates ID',
        //     icon: 'timed',
        //     error: true,
        //     onPress: () => updateEmiratesIDRef?.current?.run({
        //         type: 'RENEWED'
        //     })
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_SIX'),
        //     icon: 'Invite-and-Earn',
        //     // onPress: () => navigation.navigate('profile')
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_SEVEN'),
        //     icon: 'About-Application',
        //     onPress: () => navigation.navigate('about_us')
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_EIGHT'),
        //     icon: 'Points--Rewards',
        //     // onPress: () => navigation.navigate('profile')
        // },
        // {
        //     name: t('SETTINGS.OPTIONS_NINE'),
        //     icon: 'FAQs',
        //     onPress: () => navigation.navigate('faqs')
        // },

        return data

    };

    // if(checkEmiratesIDExpiry?.showPopup){
    //     optionsMenu.push({
    //         name: 'Update Emirates ID',
    //         icon: 'timed',
    //         error: true,
    //         onPress: () => updateEmiratesIDRef?.current?.run({ type: 'GET_NEW_TOKEN' })
    //     })
    // }

    const logoutFunc = () => {
        dispatch(logout())
    };

    const renderItem = (obj, index) => {
        return obj ? (
            <TouchableOpacity key={index} style={Styles.listItem} onPress={obj.onPress}>
                <IconButton
                    buttonStyle={[Styles.listItemButton, obj?.error && Styles.errorListItemButton]}
                    buttonIconStyle={[Styles.listItemButtonIcon, obj?.error && Styles.errorListItemButtonIcon]}
                    buttonType='normal'
                    type="icon-with-background"
                    iconName={obj.icon} />
                <CText style={Styles.listItemText} numberOfLines={2}>{obj.name}</CText>
                <KamelpayIcon style={Styles.listItemRightIcon} name={"arrow-up"}/>
            </TouchableOpacity>
        ) : null
    };

    return (
        <Container headerProps={headerProps} edges={['left', 'right']}>

            <CLoading showAnimation={true} loading={reduxState?.loading}/>

            <View style={Styles.header}>
                <ProgressiveImage resizeMode="cover"
                                  source={require('../../assets/images/man_1.png')}
                                  style={Styles.headerImage}/>
                <View style={Styles.headerContent}>
                    <CText style={Styles.headerContentTitle}>
                        {getFullName(reduxState?.user) || 'NaqaD'}
                    </CText>
                    <CText style={Styles.headerContentSubTitle}>
                        {getPhone(reduxState?.user)}
                    </CText>
                </View>
            </View>
            <ScrollView contentContainerStyle={Styles.listContainer}>
              <View style={{flexGrow: 1}}>
                  <View style={Styles.list}>
                      <MappedElement
                          data={generateMenuOptions()}
                          renderElement={renderItem}
                      />
                      {checkIsAppUserOrRegisterDevice(reduxState?.user, () => {
                          return reduxState?.user?.status !== 'INACTIVE' ? renderItem(
                              {
                                  name: t('SETTINGS.OPTIONS_THREE'),
                                  icon: 'card-mgmt',
                                    ...(!reduxState.masterDetails?.hasLightUserLinkANewCard ? {
                                        onPress: () => isMinimalUserCheck ? userVerificationPopup(t, USER_TYPES.MINIMAL_USER._id) : navigation.navigate('add_card')
                                    } : {
                                        onPress: () => checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
                                            if(type === 'NAVIGATE') {
                                                navigation.navigate('add_card')
                                            }
                                        }, {routeName: 'add_card', notCheckCardStatus: true, isShowPopup: true}),
                                    })
                              }
                          ) : null
                      })}

                      {reduxState?.user?.status === 'ACTIVE' && reduxState?.savingsStatus?.status === 'SUBSCRIBED' ? renderItem(
                          {
                              key: 'UNSUBSCRIBE_KAMEL_SAVINGS_SUBSCRIPTION',
                              name: 'Unsubscribe Kamel Savings Subscription',
                              icon: 'discount',
                              onPress: () => unsubscribeConfirmation()
                          }
                      ) : null}
                      <LanguagePicker />
                  </View>

                  <AlertView
                      text={t('GLOBAL.ALERT_INFO_TEXT')}
                      type='info'
                      onPress={() => openDialScreen()}
                  />

              </View>
                <CText style={Styles.listFooterUpperText}>
                    {t('GLOBAL.VERSION')} {currentVersion} - {currentCode} |   © {moment().format('YYYY')}
                </CText>
                <View style={Styles.listFooter}>
                    <TouchableOpacity style={Styles.listItem} onPress={() => logoutFunc()}>
                        <IconButton
                            buttonStyle={Styles.listItemButton}
                            buttonIconStyle={Styles.listItemButtonIcon}
                            buttonType='normal'
                            type="icon-with-background"
                            iconName={'logout'} />
                        <CText style={Styles.listItemText} numberOfLines={1}>{t('SETTINGS.OPTIONS_FOUR')}</CText>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <UpdateEmiratesID ref={updateEmiratesIDRef} />
        </Container>
    )
}

export default React.memo(Settings);
