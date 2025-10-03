import React, {useEffect, useState} from "react";
import {View, TouchableOpacity, Dimensions} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {CModal, ProgressiveImage, CText, CButton} from "../../../uiComponents";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {MappedElement} from "../../../utils/methods";
import {useSelector} from "react-redux";
import {checkUserAndCardStatus} from "../Home";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {_setDataToAsyncStorage, getValueIntoAsyncStorage} from "../../../utils/asyncStorage/Functions";
import {CURRENT_PROMOTION_INDEX} from "../../../utils/asyncStorage/Constants";
import Carousel from "react-native-snap-carousel";
import {cardNormalStatus, getCardIsActivatedOrStatus} from "../../../uiComponents/creditCardUi/CreditCardUi";
const windowWidth = Dimensions.get('window').width;

const PromotionsModal = (props) => {

    const { t } = useTranslation();
    const navigation  = useNavigation();

    const {} = props;

    const reduxState = useSelector(({auth, global}) => {
        return {
            user: auth.user,
            toggleBiometricModalIsOpen: auth.toggleBiometricModalIsOpen,
            masterDetails: global.masterDetails,
            getMasterDetailLoading: global.getMasterDetailLoading,
            card: global.selectedCard,
            isLoggedIn: auth.isLoggedIn,
            populars: global.populars,
        }
    });
    const {card, isLoggedIn, populars, masterDetails, user, toggleBiometricModalIsOpen} = reduxState;

    const [data, updateData] = useState([]);
    const [activePromotionsIndex, updateActivePromotionsIndex] = useState();
    const [isOpen, isOpenUpdate] = useState(false);
    const [isDisplay, isDisplayUpdate] = useState(true);

    useEffect(() => {
        if(!toggleBiometricModalIsOpen && card && Object.keys(card)?.length && getCardIsActivatedOrStatus(card, true)?.id === cardNormalStatus[0]) {
            if (isDisplay && user?.status === 'ACTIVE' && masterDetails?.promotionsModal?.length && (populars && Object.keys(populars).length)) {
                let activePromotions = masterDetails?.promotionsModal?.filter(o => isShowPromotionByChecks(o));
                if (!!activePromotions?.length) {
                    (async () => {
                        let initialIndex = 1;
                        let getIndexInStorage = await getValueIntoAsyncStorage(CURRENT_PROMOTION_INDEX);
                        getIndexInStorage = getIndexInStorage ? Number(getIndexInStorage) : 1;
                        if (!activePromotionsIndex) {
                            if (getIndexInStorage) {
                                let currentIndex = getIndexInStorage + 1;
                                if (getIndexInStorage >= activePromotions?.length) {
                                    updateActivePromotionsIndex(initialIndex);
                                    await _setDataToAsyncStorage(CURRENT_PROMOTION_INDEX, initialIndex.toString());
                                } else {
                                    updateActivePromotionsIndex(currentIndex);
                                    await _setDataToAsyncStorage(CURRENT_PROMOTION_INDEX, (currentIndex).toString());
                                }
                            } else {
                                updateActivePromotionsIndex(initialIndex);
                                await _setDataToAsyncStorage(CURRENT_PROMOTION_INDEX, initialIndex.toString());
                            }
                            isDisplayUpdate(false)
                        }
                    })();

                    if (!data?.length) {
                        updateData(activePromotions);
                    }

                    if (isLoggedIn && isOpen !== !!(activePromotions?.length)) {
                        isOpenUpdate(!!(activePromotions?.length) || false)
                    }
                }
            }
        }
    }, [user, masterDetails, populars, toggleBiometricModalIsOpen]);

    const constants = ['COMPANY_ID', 'NATIONALITY', 'ADVANCE_SALARY_ELIGIBILITY', 'SEND_MONEY_OFFER', 'SERVICES'];

    const generateChecks = (o) => {
        let array = [];
        if(o?.companyId?.length) array.push(constants[0]);
        if(o?.nationalities?.length) array.push(constants[1]);
        if(o.advanceSalaryEligibility) array.push(constants[2]);
        if(o?.sendMoneyOffer) array.push(constants[3]);
        if(o?.services) array.push(constants[4]);
        return array
    };
    const checkCompany = (companyId, user) => {
        return (companyId && user?.companyId) && companyId === user?.companyId
    };
    const checkSendMoneyOffer = (data) => {
        return !!(data?.offer && Object.keys(data?.offer).length)
    };
    const checkAdvanceSalaryEligibility = (data) => {
        return data && data?.advanceSalaryDetails?.status === "01"
    };
    const checkNationality = (nationalities = [], data) => {
        return (nationalities?.length && data?.nationality) ? nationalities?.includes(data?.nationality) : false
    };

    const checkServices = (services = [], data) => {
        return (services?.length && data?.services?.length) ? data?.services?.every(val => services.includes(val)) : false
    };

    const isShowPromotionByChecks = (o) => {

        let checks = generateChecks(o);

        //SERVICES
        // if(JSON.stringify(checks) === JSON.stringify([constants[4]])){
        //     return o?.isShow && checkServices(card?.services, o?.services)
        // }

        if(o?.isShow && checkServices(card?.services, o)) {

            //COMPANY_ID
            if(JSON.stringify(checks) === JSON.stringify([constants[0]])){
                return o?.isShow && checkCompany(o?.companyId, user)
            }
            //COMPANY_ID + NATIONALITY
            else if(JSON.stringify(checks) === JSON.stringify([constants[0], constants[1]])){
                return o?.isShow && checkCompany(o?.companyId, user) && checkNationality(o?.nationalities, user)
            }
            //COMPANY_ID + ADVANCE_SALARY_ELIGIBILITY
            else if(JSON.stringify(checks) === JSON.stringify([constants[0], constants[2]])){
                return o?.isShow && checkCompany(o?.companyId, user) && checkAdvanceSalaryEligibility(populars)
            }
            //COMPANY_ID + SEND_MONEY_OFFER
            else if(JSON.stringify(checks) === JSON.stringify([constants[0], constants[3]])){
                return o?.isShow && checkCompany(o?.companyId, user) && checkSendMoneyOffer(populars)
            }
            //COMPANY_ID + NATIONALITY + ADVANCE_SALARY_ELIGIBILITY
            else if(JSON.stringify(checks) === JSON.stringify([constants[0], constants[1], constants[2]])){
                return o?.isShow && checkCompany(o?.companyId, user) && checkNationality(o?.nationalities, user) && checkAdvanceSalaryEligibility(populars)
            }
            //COMPANY_ID + NATIONALITY + SEND_MONEY_OFFER
            else if(JSON.stringify(checks) === JSON.stringify([constants[0], constants[1], constants[3]])){
                return o?.isShow && checkCompany(o?.companyId, user) && checkNationality(o?.nationalities, user) && checkSendMoneyOffer(populars)
            }

            //NATIONALITY
            else if(JSON.stringify(checks) === JSON.stringify([constants[1]])){
                return o?.isShow && checkNationality(o?.nationalities, user)
            }
            //NATIONALITY + ADVANCE_SALARY_ELIGIBILITY
            else if(JSON.stringify(checks) === JSON.stringify([constants[1], constants[2]])){
                return o?.isShow && checkNationality(o?.nationalities, user) && checkAdvanceSalaryEligibility(populars)
            }
            //NATIONALITY + SEND_MONEY_OFFER
            else if(JSON.stringify(checks) === JSON.stringify([constants[1], constants[3]])){
                return o?.isShow && checkNationality(o?.nationalities, user) && checkSendMoneyOffer(populars)
            }

            //ADVANCE_SALARY_ELIGIBILITY
            else if(JSON.stringify(checks) === JSON.stringify([constants[2]])){
                return o?.isShow && checkAdvanceSalaryEligibility(populars)
            }

            //SEND_MONEY_OFFER
            else if(JSON.stringify(checks) === JSON.stringify([constants[3]])){
                return o?.isShow && checkSendMoneyOffer(populars)
            }

            //ADVANCE_SALARY_ELIGIBILITY + SEND_MONEY_OFFER
            else if(JSON.stringify(checks) === JSON.stringify([constants[2], constants[3]])){
                return o?.isShow && checkAdvanceSalaryEligibility(populars) && checkSendMoneyOffer(populars)
            }

            else {
                return o?.isShow
            }

        } else {
            return false
        }

    };


    const toggleModal = () => isOpenUpdate(!isOpen);

    const findObjByIndex = (array, currentIndex = 1) => {
        if(array?.length) {
            let found = array?.find((o, i) => {
                let index = i+1;
                return index === currentIndex
            });
            return found
        }
    };

    let currentActivePromotion = findObjByIndex(data, activePromotionsIndex);

    const navigate = (routeName, otherOptions = null) => {
        checkUserAndCardStatus(t, card, ({type}) => {
            if(type === 'NAVIGATE') {
                if(otherOptions) {
                    navigation.navigate(routeName, otherOptions ? otherOptions : {})
                } else {
                    navigation.navigate(routeName)
                }
            }

        }, {
            routeName,
            isShowPopup: true
        });
    };

    const onPressPromotion = (obj) => {
        if(obj?.routeName){
            isOpenUpdate(false);
            navigate(obj?.routeName, obj?.otherOptions || {});
        } else {
            isOpenUpdate(false)
        }
    };

    const renderPromotionsButtons = (button, index) => {
        return (
            <CButton key={index}
                     type={button?.type || index === 1 ? 'outline' : ''}
                     title={button?.title}
                     buttonStyle={GlobalStyle.twoInputsViewContainer}
                     onPress={() => onPressPromotion(button)}/>
        )
    };

    const renderImageSection = (array) => {
        return array?.length ? (
            <View style={[GlobalStyle.promotionModalContainerHeader,
                !!(currentActivePromotion?.title || currentActivePromotion?.paragraph || currentActivePromotion?.buttons?.length) && {marginBottom: 0}]}>
                {array?.length > 1 ? <Carousel
                    layout={'default'}
                    data={array}
                    width={windowWidth-60}
                    sliderWidth={windowWidth-60}
                    itemWidth={windowWidth-60}
                    renderItem={({item, index}) => (
                        <ProgressiveImage
                            key={index}
                            style={GlobalStyle.promotionModalContainerHeaderImage}
                            resizeMode={'cover'}
                            source={{uri: item?.uri}}
                        />
                    )}
                    currentSelectIndex={0}
                    currentScrollPosition={0}
                /> : <TouchableOpacity
                    activeOpacity={Object.keys(array[0]).length > 1 ? 0.7 : 1}
                    onPress={() => Object.keys(array[0]).length > 1 && onPressPromotion(array[0])}>
                    <ProgressiveImage
                        style={GlobalStyle.promotionModalContainerHeaderImage}
                        resizeMode={'cover'}
                        source={{uri: array[0]?.uri}}
                    />
                </TouchableOpacity>}

            </View>
        ) : null
    };

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => toggleModal()}>
            <View style={[GlobalStyle.centerModalCenterViewBody]}>
                <View style={[GlobalStyle.centerModalCenterViewContainer, {overflow: 'hidden'}]}>
                    <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton}
                                      onPress={() => toggleModal()}>
                        <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                    </TouchableOpacity>
                    {currentActivePromotion ? <View style={[GlobalStyle.promotionModalContainer]}>
                        {currentActivePromotion?.banners?.length ? renderImageSection(currentActivePromotion?.banners) : null}

                        {currentActivePromotion?.title || currentActivePromotion?.paragraph ? <View style={GlobalStyle.promotionModalContainerBody}>

                            {currentActivePromotion?.title ? <CText style={GlobalStyle.promotionModalContainerBodyTitle}>
                                {currentActivePromotion?.title}
                            </CText> : null}
                            {currentActivePromotion?.paragraph ? <CText style={GlobalStyle.promotionModalContainerBodyParagraph}>
                                {currentActivePromotion?.paragraph}
                            </CText> : null}

                        </View> : null}


                        {currentActivePromotion?.buttons?.length ? <View style={GlobalStyle.promotionModalContainerFooter}>
                            <View style={GlobalStyle.twoInputsView}>
                                {currentActivePromotion?.buttons?.length ? <MappedElement
                                    data={currentActivePromotion?.buttons}
                                    renderElement={renderPromotionsButtons}
                                /> : null}
                            </View>
                        </View> : null }

                    </View> : null}

                </View>
            </View>
        </CModal>
    );
};

export default PromotionsModal;
