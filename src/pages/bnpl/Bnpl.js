import React, {Fragment, useEffect} from "react";
import {Container} from "../../containers";
import Styles from "./Bnpl.style";
import {useTranslation} from "react-i18next";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import LatestSubCategories from "./latestSubCategories/LatestSubCategories";
import {RefreshControl, TouchableOpacity, View, ActivityIndicator} from "react-native";
import Banner from "./Banner";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {CButton, CText} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {
    getCart,
    getLatestCategories,
    getLatestProducts,
} from "../../store/actions/Bnpl.action";
import LatestProducts from "./latestProducts/LatestProducts";
import {themes} from "../../theme/colors";
import LatestCategories from "./latestCategories/LatestCategories";
import {updatedSelectedCurrentPromotion} from "../../store/actions/Global.action";

function Bnpl(props) {

    const { t } = useTranslation();
    const {route: { params: data }} = props;

    const navigation  = useNavigation();
    const dispatch  = useDispatch();

    const reduxState = useSelector(({bnpl, global}) => {
        return {
            loading: bnpl.getCartProductsLoading,
            cartProducts: bnpl.getCartProducts,
            cartProductsLoading: bnpl.getCartProductsLoading,
            card: global.selectedCard,
            bnplDetails: bnpl?.bnplEligibility,
            popularsLoading: global.popularsLoading,
            selectedCurrentPromotion: global.selectedCurrentPromotion,
        }
    });

    const headerProps = {
        headerTitle: data?.bnplIsEligible ? 'Buy Now, Pay Later' : 'Marketplace',
        headerRight: true
    };

    useEffect(() => {
        _onRefresh();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            let data = reduxState?.selectedCurrentPromotion;
            if(data) {
                setTimeout(() => {
                    findAndGo(data);
                })
            }
        }, [reduxState?.selectedCurrentPromotion])
    );

    const findAndGo = (obj) => {
        if(obj?.navigate_screen) {
            dispatch(updatedSelectedCurrentPromotion({}));
            navigation.navigate(obj?.navigate_screen, {
                ...obj,
                whereToCome: 'PROMOTION'
            });
        }
    };


    const getLatestCategoriesFunc = () => {
        let payload = {
            page: 1,
            limit: 5,
        };
        dispatch(getLatestCategories(payload))
    };

    const getProducts = () => {
        let payload = {
            page: 1,
            limit: 10,
            cardId: reduxState?.card?._id,
        };
        dispatch(getLatestProducts(payload))
    };

    const _onRefresh = () => {
        getLatestCategoriesFunc();
        getProducts();
        dispatch(getCart())
    };

    const goCart = () => {
        navigation.navigate('bnpl_cart')
    };

    const viewHistory = () => {
        navigation.navigate('bnpl_history')
    };

    const fabButton = () => {
        let count = reduxState?.cartProducts?.length || 0;
        return (
            <TouchableOpacity style={[Styles.fabButton, Styles.without_safeArea]}
                              activeOpacity={0.8}
                              disabled={reduxState.cartProductsLoading}
                              onPress={() => goCart()}>

                {count ? <View style={Styles.fabButtonBadge}>
                    <CText style={Styles.fabButtonBadgeText}>{count}</CText>
                </View> : null}

                {/* {reduxState.cartProductsLoading ? <ActivityIndicator
                    color={themes['light'].colors.tertiary}
                /> : <MaterialCommunityIcons
                    style={Styles.fabButtonIcon}
                    name={'cart'}/>} */}


            </TouchableOpacity>
        )
    };


    const renderFooter = () => {
        return <Fragment>
            {fabButton()}
            <CButton title={t('GLOBAL.TRACK_HISTORY')}
                     type={'without_outline'}
                     disabled={reduxState.loading}
                     onPress={() => viewHistory()}/>
        </Fragment>
    };

    return (
        <Container
            renderFooter={renderFooter}
            scrollView={true}
            scrollViewProps={{
                contentContainerStyle: [Styles.container, GlobalStyle.padding_horizontal_30],
                refreshControl: <RefreshControl
                    refreshing={false}
                    onRefresh={_onRefresh}
                />
            }}
            headerProps={headerProps}>

            <View style={[GlobalStyle.margin_horizontal_minus_30, GlobalStyle.flex_grow_1]}>

                <Banner
                    bnplIsEligible={data?.bnplIsEligible}
                    bnplDetails={reduxState?.bnplDetails}
                />

                <LatestCategories nestedScrollEnabled={true} />

                <View style={Styles.borderLine}/>

                <LatestSubCategories nestedScrollEnabled={true} />

                <LatestProducts />

            </View>

        </Container>
    )
}

export default React.memo(Bnpl)
