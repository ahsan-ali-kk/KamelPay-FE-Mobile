import React, {memo, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import Styles from "./Home.style";
import {useDispatch, useSelector} from "react-redux";
import {
    foundProduct,
    MappedElement,
    nameFirstLetter,
} from "../../utils/methods";
import {CLoading, CText} from "../../uiComponents";
import {getRemittanceBeneficiary} from "../../store/actions/Remittance.action";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import KamlepayIcon from "../../assets/icons/KamelPayIcon";
import {checkUserAndCardStatus} from "./Home";
import {convertPayload, remittanceUnavailable} from "../remittance/Remittance";

function SendMoneySection(props) {

    const { t } = useTranslation();
    const {cardBlockPopup, selectedCard} = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            data: remittance.remittanceInitialBeneficiary,
            loading: remittance.getRemittanceBeneficiaryLoading,
            card: global.selectedCard,
            user: auth.user,
            populars: global.populars,
            masterDetails: global.masterDetails
        }
    });

    const {data, loading} = reduxState;

    useEffect(() => {
        checkUserAndCardStatus(t, selectedCard, ({type}) => {
            if(type === 'FUNCTION') {
                if (selectedCard) {
                    getRemittanceBeneficiaryForHome(selectedCard);
                }
            }
        }, {
            isShowPopup: false
        })
    }, [selectedCard]);

    const getRemittanceBeneficiaryForHome = () => {
        let payload = {
            page: 1,
            limit: 10,
            transactionTypes: ["REMITTANCE"]
        };
        dispatch(getRemittanceBeneficiary(payload, 'initial'));
    };

    const navigate = (route, params) => {
        if(!reduxState?.user?.additionalInfo || !Object.keys(reduxState?.user?.additionalInfo).length) {
            navigation.navigate('user_additional_info', {routeName: 'goBack'})
        } else {
            checkUserAndCardStatus(t, selectedCard, ({type}) => {
                if(type === 'NAVIGATE') {
                    navigation.navigate(route, params)
                }
            }, {
                routeName: route,
                isShowPopup: true
            });
        }
    };

    const onPayment = (item) => {
        let payload = {};
        let inputsMod = {};
        if(item?.usersInputs) {
            item?.usersInputs.forEach(o => {
                inputsMod = {
                    ...inputsMod,
                    [o.id]: o.value
                }
            });
            payload.country = item?.bank?.countryDetails;
            payload.bank = item?.bank;
            payload.otherDetails = inputsMod;
            payload.pageType = 'BENEFICIARY_TO_SEND_MONEY';
            payload.beneficiaryAlias = item?.beneficiaryAlias;
            payload.beneficiaryId = item?._id;
            payload.transactionType = item?.transactionType;

            navigate('Send_Money', {
                screen: 'send_money_exchange_rate',
                params: payload,
                initial: false,
            })
        }
    };

    const renderSendMoneyItems = (item, index) => {
        return (
            <TouchableOpacity key={index} style={Styles.sendMoneyListItem} onPress={() => item?.onPress ? item?.onPress() : onPayment(item)}>
                {item?.icon ? <View style={Styles.sendMoneyListItemIconContainer}>
                    <KamlepayIcon name={item?.icon} style={Styles.sendMoneyListItemIcon}/>
                </View> :   <View style={Styles.sendMoneyListItemIconContainer}>
                    <CText numberOfLines={1} style={Styles.sendMoneyListItemIconText}>
                        {nameFirstLetter(item?.beneficiaryAlias)}
                    </CText>
                </View>}
                <CText numberOfLines={1} style={Styles.sendMoneyListItemTitle}>
                    {item?.beneficiaryAlias}
                </CText>
            </TouchableOpacity>
        )
    };

    const addNewBeneficiary = () => {
        checkUserAndCardStatus(t, selectedCard, ({type}) => {
            if(type === 'NAVIGATE') {
                let country = convertPayload(reduxState?.populars);
                if(country) {
                    navigation.navigate('Send_Money', {
                        screen: 'send_money_type',
                        params: {
                            pageType: 'ADD_NEW_BENEFICIARY',
                            country: country
                        },
                        initial: false,
                    })
                } else {
                    if(reduxState?.masterDetails?.accessOtherCountryInRemittance){
                        navigation.navigate('Send_Money', {
                            screen: 'send_money_countries',
                            params: {
                                pageType: 'ADD_NEW_BENEFICIARY'
                            },
                            initial: false,
                        })
                    } else {
                        remittanceUnavailable(t);
                    }
                }
            }
        }, {
            routeName: 'Send_Money',
            isShowPopup: true
        });
    };

    const viewMore = () => {
        checkUserAndCardStatus(t, selectedCard, ({type}) => {
            if(type === 'NAVIGATE') {
                navigation.navigate('Send_Money')
            }
        }, {
            routeName: 'Send_Money',
            isShowPopup: true
        })
    };

    const renderSendMoney = () => {
        const visible = foundProduct(selectedCard?.companyProductCode).type !== 'CentiV';
        return visible && data?.length ? (
            <View style={Styles.sectionContainer}>
                <View style={Styles.sectionContainerHeader}>
                    <View style={Styles.sectionContainerHeaderContent}>
                        <CText style={Styles.sectionContainerHeaderTitle}>
                            {t('SECTION_LABELS.SEND_MONEY_TO')}
                        </CText>
                    </View>
                    <TouchableOpacity style={Styles.sectionContainerHeaderButton}
                                      onPress={() => viewMore()}>
                        <CText style={Styles.sectionContainerHeaderButtonText}>
                            {t('GLOBAL.VIEW_MORE')}
                        </CText>
                        <KamlepayIcon style={Styles.sectionContainerHeaderButtonIcon} name="right-arrow"/>
                    </TouchableOpacity>
                </View>
                <View style={Styles.sectionContainerBody}>
                    {loading ? <CLoading
                        showAnimation={true}
                        transparent={true}
                        style={Styles.sectionContainerBodyLoading} loading={true}/> :<ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true} contentContainerStyle={Styles.sendMoneyList}>
                        {renderSendMoneyItems({
                            beneficiaryAlias: t('GLOBAL.NEW_BENEFICIARY'),
                            icon: 'add',
                            onPress: () => addNewBeneficiary()
                        })}
                        <MappedElement
                            data={data || []}
                            renderElement={renderSendMoneyItems}/>
                    </ScrollView>}
                </View>
            </View>
        ) : null
    };


    return renderSendMoney()
}

export default memo(SendMoneySection);
