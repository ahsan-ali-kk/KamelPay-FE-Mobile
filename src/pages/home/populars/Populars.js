import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {View, ScrollView, TouchableOpacity, Dimensions, RefreshControl} from "react-native";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {getPopularsData} from "../../../store/actions/Global.action";
import Styles from "./Populars.style";
import CText from "../../../uiComponents/cText/CText";
import {convertToSlug, FormatNumberWithCommas, MappedElement, SERVICES} from "../../../utils/methods";
import {IconButton, ProgressiveImage} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {checkUserAndCardStatus} from "../Home";
const windowWidth = Dimensions.get('window').width;

function Scroller(props) {
    const { t } = useTranslation();

    const {dataArray, dataItem, selectedCard, navigation, nationalityCountry, index, user} = props;
    const [leftButton, updateLeftButton] = useState(false);

    useEffect(() => {
        let contentLengthWidth = dataArray?.length*150;
        updateLeftButton(contentLengthWidth > windowWidth);
    }, [windowWidth]);

    const scrollRef = useRef();
    const renderInnerChildSection = (data, parentItem) => {
        return <MappedElement data={data}
                              renderElement={(item, i) => renderInnerChildSectionItem(item, i, parentItem)}/>
    };
    const onClick = (parentItem, item) => {

        let  otherOptions = {};
        let route = parentItem?.route || item?.route;
        let country = nationalityCountry;
        if(route?.nestedName === 'send_money_banks') {
            otherOptions = {
                screen: route?.nestedName,
                params: {
                    country: country,
                    type: item
                },
                initial: false,
            }
        }
        if(route?.nestedName === 'add_mobile_topup') {
            otherOptions = {
                screen: route?.nestedName,
                params: {
                    country: country,
                    initialCountryModal: false
                },
                initial: false,
            }
        }
        else if(route?.nestedName === 'send_money_bank_branches') {
            otherOptions = {
                screen: route?.nestedName,
                params: {
                    country: country,
                    bank: item,
                    type: {
                        Value: item?.BankType,
                        Name: item?.BankTypeName
                    },
                    goBackWithRoute: 'Send_Money'
                },
                initial: false,
            }
        }
        else if(route?.nestedName === 'pay_bill_billers') {
            otherOptions = {
                screen: route?.nestedName,
                params: {
                    Billers: parentItem?.data,
                    _id: parentItem?.title,
                    selectedSKU: item
                },
                initial: false,
            }
        }

        if(!user?.additionalInfo || !Object.keys(user?.additionalInfo).length){
            navigation.navigate('user_additional_info', {routeName: 'goBack'})
        } else {
            navigate(route?.name, otherOptions);
        }
    };

    const navigate = (routeName, otherOptions = null) => {
        checkUserAndCardStatus(t, selectedCard, ({type}) => {
            if(type === 'NAVIGATE') {
                if (otherOptions) {
                    navigation.navigate(routeName, otherOptions ? otherOptions : {})
                } else {
                    navigation.navigate(routeName)
                }
            }
        }, {
            routeName, isShowPopup: true
        });
    };

    const renderInnerChildSectionItem = (item, index, parentItem) => {
        const icons = {
            BankAccount: 'bank-icon',
            COTC: 'cashpickup',
            'Mobile Wallet': 'mobile-wallet',
            MobileRecharge: 'mobile-recharge',
            SendMoney: 'send-money',
        };
        return item && Object.keys(item).length ? (
            <TouchableOpacity key={index}
                              onPress={() => onClick(parentItem, item)}
                              style={[Styles.innerChildItem, index === 0 && {borderLeftWidth: 0}]}>
                <View style={Styles.innerChildItemAvatar}>
                    <IconButton
                        buttonType='normal'
                        type="icon-with-background"
                        iconName={parentItem?.icon ? parentItem?.icon : icons[item?.Value]}
                    />
                </View>
                <CText style={Styles.innerChildItemText} numberOfLines={2}>
                    {item[parentItem?.titleKey]}
                </CText>
            </TouchableOpacity>

        ) : null
    };

    const onScroll = useCallback((e) => {
        let borderLength = dataArray?.length*1;
        let contentLengthWidth = dataArray?.length*150+borderLength;
        if(contentLengthWidth > windowWidth){
            let isEnd = e.nativeEvent.contentOffset.x + e.nativeEvent.layoutMeasurement.width;
            updateLeftButton(isEnd !== e?.nativeEvent?.contentSize?.width)
        }
    });

    return (
        <Fragment>
            <View key={index} style={[Styles.innerSection, index === 0 && {borderTopWidth: 0}]}>
                <View style={Styles.innerSectionHeader}>
                    {dataItem.title ? <CText style={Styles.innerSectionHeaderText}>{dataItem.title}</CText> : null}
                    {leftButton ? <CText style={Styles.innerSectionHeaderLeftText}>
                        {t('SECTION_LABELS.SCROLL_RIGHT_TO_SEE_MORE')}
                    </CText> : null}
                </View>
                <View style={Styles.innerSectionBody}>
                    <ScrollView horizontal={true}
                                ref={scrollRef}
                                onScroll={(e) => onScroll(e)}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={Styles.innerSectionBodyScroll}>
                        {renderInnerChildSection(dataArray, dataItem)}
                    </ScrollView>
                </View>
            </View>
        </Fragment>
    )
}

function Populars(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {navigation} = props;

    const [populars, setPopulars] = useState([]);

    const onRefresh = React.useCallback(() => {
        get()
    }, []);
    const reduxState = useSelector(({auth, global}) => {
        return {
            data: global.populars,
            loading: global.popularsLoading,
            user: auth.user,
            selectedCard: global.selectedCard,
        }
    });

    const {selectedCard, data} = reduxState;

    const get = () => {
        let payload = {
            cardId: selectedCard?._id
        };
        dispatch(getPopularsData(payload))
    };

    const checkSingleServicesAvailable = (key) => {
        return selectedCard ? selectedCard?.services?.includes(key) : false
    };

    useEffect(() => {
        let sortedData = [];

        sortedData.push({
            titleKey: 'name',
            data: [
                (checkSingleServicesAvailable(SERVICES.TOPUP._id) && {
                    name: 'Mobile Topup',
                    Value: 'MobileRecharge',
                    route: {
                        // icon: 'mobile-recharge',
                        name: 'Mobile_TopUp',
                        nestedName: 'add_mobile_topup',
                    },
                }),
                (checkSingleServicesAvailable(SERVICES.REMITTANCE._id) ? {
                    name: 'My Beneficiaries',
                    Value: 'SendMoney',
                    route: {
                        name: 'Send_Money',
                    },
                } : {})
            ]
        });

        if(checkSingleServicesAvailable(SERVICES.REMITTANCE._id) && data?.bankTypes?.length) {
            sortedData.push({
                title: 'Send Money',
                titleKey: 'Name',
                route: {
                    name: 'Send_Money',
                    nestedName: 'send_money_banks'
                },
                data: data?.bankTypes
            })
        }
        if(checkSingleServicesAvailable(SERVICES.REMITTANCE._id) && data?.banks?.length) {
            sortedData.push({
                title: 'Shortcut To Popular Banks',
                icon: 'mobile-wallet',
                titleKey: 'BankName',
                route: {
                    name: 'Send_Money',
                    nestedName: 'send_money_bank_branches'
                },
                data: data?.banks
            })
        }
        if(checkSingleServicesAvailable(SERVICES.BILL_PAYMENT._id) && data?.billerTypes?.length) {
            let billers  = data?.billerTypes.map((biller) => {
                let icon = convertToSlug(biller?._id, '-');
                return {
                    title: biller?._id,
                    icon: icon === 'government' ? 'goverment' : icon,
                    titleKey: 'BillerName',
                    data: biller?.Billers,
                    route: {
                        name: 'Pay_Bill',
                        nestedName: 'pay_bill_billers'
                    },
                }
            });
            const sequence = ['mobile', 'utility'];
            let sequenceData = [];
            sequence.forEach(o => {
                let found = billers.filter(io => io?.title?.toLowerCase().includes(o.toLowerCase()));
                if(found) {
                    sequenceData.push(...found)
                }
            });
            let array3 = [...new Set([...sequenceData,...billers])];
            sortedData.push(...array3)
        }

        setPopulars(sortedData)
    }, [data]);

    const headerProps = {
        headerTitle: t('PAGE_TITLE.MY_COUNTRY'),
        headerRight: true,
    };

    const renderInnerSection = (array) => {
        return <MappedElement data={array}
                              renderElement={(item, i) => {
                                  return(
                                      <Scroller
                                          key={i}
                                          index={i}
                                          dataItem={item}
                                          dataArray={item?.data}
                                          user={reduxState?.user}
                                          selectedCard={selectedCard}
                                          navigation={navigation}
                                          nationalityCountry={data?.nationalityCountry}
                                      />
                                  )}
                              }/>
    };

    const renderCountyView = () => {
        let country = data?.nationalityCountry;
        return country ? (
            <View style={Styles.countryView}>
                <View style={Styles.countryFlagContainer}>
                    <ProgressiveImage
                        source={{uri: country?.flagPng}}
                        fallback
                        defaultSource={require('../../../assets/images/others.png')}
                        style={Styles.countryFlag} />
                </View>
                <CText style={Styles.countryTitle}>{country?.name}</CText>
                <CText style={Styles.countrySubTitle}>
                    {t('SECTION_LABELS.SEND_MONEY_OR_PAY_BILLS')}
                </CText>
            </View>
        ) : null
    };

    const renderTodayRateView = () => {
        let country = data?.nationalityCountry;
        let singleAmountUnit = data?.singleAmountUnit;
        return country && singleAmountUnit ? (
            <View style={Styles.rateView}>
                <View style={Styles.rateViewLeft}>
                    {/*<CText>Today Rate</CText>*/}
                    <CText style={Styles.rateViewLeftTitle}>
                        Today {t('SEND_MONEY.EXCHANGE_RATE')}
                    </CText>
                    <CText>
                        <FormatNumberWithCommas
                            value={'1'}
                            currency={'AED'}
                            styleAmount={Styles.rateViewLeftText}
                            numberOfLines={1}
                        />
                        <CText style={Styles.rateViewLeftText}>= </CText>
                        <FormatNumberWithCommas
                            truncatedValue={singleAmountUnit || 0}
                            currency={country?.currency}
                            styleAmount={Styles.rateViewLeftText}
                            numberOfLines={1}
                        />
                    </CText>
                </View>
                <ProgressiveImage
                    source={require('../../../assets/images/exchange-rate.png')}
                    style={Styles.rateViewIcon} />

            </View>
        ) : null
    };

    return (
        <Container
            scrollView={true}
            scrollViewProps={{
                contentContainerStyle: { paddingBottom: 25 },
                refreshControl: <RefreshControl
                    refreshing={false}
                    onRefresh={onRefresh}
                />

            }}
            loading={reduxState.loading}
            headerProps={headerProps}>

            {renderCountyView()}
            {checkSingleServicesAvailable(SERVICES.REMITTANCE._id) && renderTodayRateView()}

            <View style={Styles.section}>
                <View style={Styles.sectionBody}>
                    {renderInnerSection(populars)}
                </View>
            </View>

        </Container>
    )
}

export default React.memo(Populars)
