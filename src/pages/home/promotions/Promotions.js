import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import Styles from "../Home.style";
import {useDispatch, useSelector} from "react-redux";
import {ProgressiveImage} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {SERVICES} from "../../../utils/methods";
import {checkUserAndCardStatus} from "../Home";
import {useNavigation} from "@react-navigation/native";
const windowWidth = Dimensions.get('window').width;
import Carousel from 'react-native-snap-carousel';
import {getPromotions, updatedSelectedCurrentPromotion} from "../../../store/actions/Global.action";

const LEFT_RIGHT_SPACE = 60;
const SLIDER_HEIGHT = 130;

function Promotions(props) {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const carouselRef = useRef();
    const {selectedCard, onSelect} = props;

    const reduxState = useSelector(({auth, global, advanceSalary, bnpl, personalLoan, creditPay, kpWalletTransfer}) => {
        return {
            user: auth.user,
            masterDetails: global.masterDetails,
            loading: global.getMasterDetailLoading,
            populars: global.populars,
            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility,
            bnplDetails: bnpl?.bnplEligibility,
            card: global.selectedCard,
            personalLoanEligibility: personalLoan.personalLoanEligibility,
            getPromotionsLoading: global.getPromotionsLoading,
            promotions: global.promotions,
            creditPayEligibility: creditPay.creditPayEligibility,
            checkCreditPayEligibilityLoading: creditPay.checkCreditPayEligibilityLoading,
            kpWalletTransferEligibility: kpWalletTransfer.eligibility,
            checkKpWalletTransferEligibilityLoading: kpWalletTransfer.checkEligibilityLoading,
        }
    });

    const {masterDetails, populars, loading, card, advanceSalaryDetails, bnplDetails, promotions, personalLoanEligibility, creditPayEligibility, kpWalletTransferEligibility} = reduxState;

    const [cardWidth] = useState(windowWidth - LEFT_RIGHT_SPACE);
    const [data, setData] = useState([]);
    const [stateLoading, setStateLoading] = useState(false);

    useEffect(() => {
        dispatch(getPromotions({
            isShow: true,
            cardId: selectedCard?._id
        }))
    }, [])

    useEffect(() => {
        if(promotions) {
            let filteredData = promotions?.filter((obj) => {
                if(obj?.forServices?.includes(SERVICES.ADVANCE_SALARY._id) && !checkAdvanceSalaryEligibility(advanceSalaryDetails)) return;
                if(obj?.forServices?.includes(SERVICES.ADVANCE_REMITTANCE._id) && !checkAdvanceRemittanceEligibility(advanceSalaryDetails)) return;
                if((obj?.forServices?.includes(SERVICES.ECOMMERCE._id) && obj?.forServices?.includes(SERVICES.BNPL._id)) && !checkEligibility(bnplDetails)) return;
                if(obj?.forServices?.includes(SERVICES.PERSONAL_LOAN._id) && !checkEligibility(personalLoanEligibility)) return;
                if(obj?.forServices?.includes(SERVICES.EMBEDDED_FINANCE._id) && !checkEligibility(creditPayEligibility)) return;
                if(obj?.forServices?.includes(SERVICES.KP_WALLET_TRANSFER._id) && !checkEligibility(kpWalletTransferEligibility)) return;
                return obj;
            }) || [];
            setData(filteredData)
        }
    }, [promotions])

    const navigate = (routeName, otherOptions = null) => {
        checkUserAndCardStatus(t, card, ({type}) => {
            if(type === 'NAVIGATE') {
                if(otherOptions) {
                    dispatch(updatedSelectedCurrentPromotion(otherOptions ? otherOptions : {}));
                    navigation.navigate(routeName, otherOptions ? otherOptions : {})
                } else {
                    navigation.navigate(routeName)
                }
            }
        }, {routeName, isShowPopup: true, upgradePath: "MINIMAL_TO_FULL"});
    };

    const onPressPromotion = (obj) => {
        if(obj?.routeName){
            navigate(obj?.routeName, obj?.otherOptions || {})
        } else if(obj?.otherOptions?.type?.toUpperCase() === 'FUNCTION') {
            onSelect && onSelect(obj);
        }
    };

    const checkAdvanceSalaryEligibility = (data) => {
        return data && data?.status === "01"
    };
    const checkEligibility = (data) => {
        return data && data?.isEligible
    };
    const checkAdvanceRemittanceEligibility = (data) => {
        return data && data?.status !== "02" && data?.status === "01"
    };

    // const ROUTES = [
    //     { CARD_MANAGEMENT: "Card_Management", forServices: [] },
    //     { SETTINGS: "Settings", forServices: [] },
    //     { SEND_MONEY: "Send_Money", forServices: ["REMITTANCE"] },
    //     { MOBILE_TOPUP: "Mobile_TopUp", forServices: ["TOPUP"] },
    //     { PAY_BILL: "Pay_Bill", forServices: ["BILL_PAYMENT"] },
    //     { NOTIFICATIONS: "Notifications", forServices: [] },
    //     { ADVANCE_SALARY: "Advance_Salary", forServices: ["ADVANCE_SALARY"] },
    //     { SNPL: "Snpl", forServices: ["ADVANCE_REMITTANCE"] },
    //     { ATMLOCATOR: "ATMLocator", forServices: [] },
    //     { BNPL: "BNPL", forServices: ["ECOMMERCE", "BNPL"] },
    //     { SCRATCH_CARDS: "Scratch_Cards", forServices: [] },
    //     { PERSONAL_LOAN: "Personal_Loan", forServices: [] }
    // ]

    const _renderCardItem = ({item, index}) => {
        let checkDisabled = item?.routeName ? false : item?.otherOptions?.type?.toUpperCase() !== 'FUNCTION';
        return item?.banner?.uri ? (
            <View key={index} style={{alignItems:'center'}}>
                <TouchableOpacity
                    disabled={checkDisabled}
                    onPress={() => onPressPromotion(item)}
                    style={[Styles.promotion, {
                        width: windowWidth - LEFT_RIGHT_SPACE,
                        backgroundColor: item?.banner?.backgroundColor,
                        minHeight: SLIDER_HEIGHT
                    }]}>
                    {item?.banner?.backgroundUri ? <ProgressiveImage
                        source={{uri: item?.banner?.backgroundUri}}
                        style={[Styles.promotionBackgroundLayer, {minHeight: SLIDER_HEIGHT, minWidth: 200, zIndex: 0}]}/> : null}
                    <ProgressiveImage
                        resizeMode={item?.banner?.resizeMode || 'contain'}
                        source={{uri: item?.banner?.uri}}
                        style={{minWidth: 200, minHeight: SLIDER_HEIGHT, zIndex: 1}}/>
                </TouchableOpacity>
            </View>
        ) : null;
    };

    const renderPromotions = (array) => {
        return array && array.length && !loading && !stateLoading ? (
            <View style={[Styles.sectionContainer, {borderTopWidth: 0}]}>
                <View style={[Styles.sectionContainerBody, {marginTop: 0, paddingBottom: 0}]}>
                    <View style={[Styles.promotionSlider, {marginBottom: 5}]}>
                        <Carousel
                            ref={carouselRef}
                            layout={"default"}
                            width={windowWidth}
                            data={array}
                            contentContainerCustomStyle={{flexDirection: false ? 'row-reverse' : 'row'}}
                            renderItem={_renderCardItem}
                            sliderWidth={windowWidth}
                            currentSelectIndex={1}
                            currentScrollPosition={1}
                            itemWidth={cardWidth}
                            autoplay={true}
                            loop={true}
                            enableMomentum={true}
                            decelerationRate={0.9}
                            useScrollView={false}
                        />
                    </View>
                </View>
            </View>
        ) : null
    };

    return renderPromotions(data)
}

export default Promotions;
