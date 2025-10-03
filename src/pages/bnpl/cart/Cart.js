import React, {useEffect, useState} from "react";
import {Container} from "../../../containers";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import Styles from "./Cart.style";
import {TouchableOpacity, View} from "react-native";
import {formatAmount, getPBnplFees, truncateAmount} from "../../../utils/methods";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {CButton, CText, ProgressiveImage, Counter, CList} from "../../../uiComponents";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {addProductIntoCart, getCart} from "../../../store/actions/Bnpl.action";
import _ from "lodash";

function Cart() {

    const { t } = useTranslation();

    const navigation  = useNavigation();
    const dispatch  = useDispatch();

    const [selectedItems, updateSelectedItems] = useState([]);

    const reduxState = useSelector(({bnpl, global}) => {
        return {
            loading: bnpl.getCartProductsLoading,
            data: bnpl.getCartProducts,
            card: global.selectedCard,
            bnplDetails: bnpl?.bnplEligibility,
        }
    });

    const headerProps = {
        headerTitle: 'Cart',
        headerRight: true
    };

    const get = () => {
        dispatch(getCart())
    };

    useEffect(() => {
        get()
    }, []);

    useEffect(() => {

        if(reduxState?.data?.length) {
            updateSelectedItems(reduxState?.data)
        }

    }, [reduxState?.data]);

    const updateItems = (objectId, type, newQuantity) => {
        let updatedData;
        if (type === 'QUANTITY'){
            updatedData = selectedItems.map(obj => {
                if (obj._id === objectId) {
                    return { ...obj, quantity: newQuantity };
                }
                return obj;
            });
        }
        else if(type === 'REMOVE') {
            updatedData = selectedItems.filter(obj => obj._id !== objectId);
        }

        let prevCart = updatedData?.length ? updatedData.map(obj => {
            let updatedObj = _.omit(obj, ['product', '_id']);
            return {
                ...updatedObj,
                product: obj?.product?._id,
            }
        }) : [];
        dispatch(addProductIntoCart({products: prevCart}));
        updateSelectedItems(updatedData);
    };

    const getFeeBracket = (amount) => {
        return getPBnplFees(reduxState?.bnplDetails?.feeBrackets, amount) || {NoOfInstallment: reduxState?.bnplDetails?.noOfInstallment}
    };

    const getAmount = (amount, isBnpl) => {
        if(isBnpl) {
            let feeBracket = getFeeBracket(amount);
            return truncateAmount(amount / feeBracket?.NoOfInstallment)
        } else {
            return amount
        }
    };

    const renderSelectItem = ({item, index}) => {
        let amount = item?.product?.type === 'WITHOUT_VARIANTS' ? (item?.product?.price) : (item?.product?.productVariantDetail?.price);
        let productVariantsValuesString = item?.product?.type === "WITH_VARIANTS" ?  (item?.product?.productVariantDetail?.productVariantsValuesString) : '';
        return (
            <View style={[Styles.selectedListItem, index === 0 && Styles.selectedListFirstItem]}>
                <View style={Styles.selectedListItemImageContainer}>
                    <ProgressiveImage
                        style={Styles.selectedListItemImage}
                        source={{uri: item?.product?.meta?.imageUrls[0]}}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={Styles.selectedListItemContent}>
                    <CText style={[Styles.selectedListItemText, Styles.selectedListItemTitle]}>
                        {item?.product?.name}
                    </CText>
                    <CText style={[Styles.selectedListItemText, Styles.selectedListItemCategory]}>
                        {item?.product?.category?.name}
                    </CText>
                    {productVariantsValuesString ? <CText style={[Styles.selectedListItemText, Styles.selectedListItemCategory]}>
                        {productVariantsValuesString}
                    </CText> : null}
                    <CText style={[Styles.selectedListItemText, Styles.selectedListItemAmount]}>
                        {formatAmount(getAmount(amount, item?.isBnpl), item?.product?.currency)} {item?.isBnpl ? `x ${getFeeBracket(amount)?.NoOfInstallment} Installments` : null}
                    </CText>
                </View>
                <View>
                    <TouchableOpacity
                        style={Styles.selectedListItemRemoveButton}
                        onPress={() => updateItems(item?._id, 'REMOVE')}
                    >
                        <KamelpayIcon style={Styles.selectedListItemRemoveButtonIcon} name="delete"/>
                    </TouchableOpacity>
                    <Counter
                        disabled={item?.isBnpl || reduxState?.loading}
                        onChange={(val) => updateItems(item?._id, 'QUANTITY', val)}
                        value={item?.quantity}
                        max={item?.product?.availableUnits}
                        counterInnerContainerStyle={Styles.counterInnerContainerStyle}
                        counterContainerStyle={Styles.counterContainerStyle}
                        counterStyle={Styles.counterStyle}
                        counterButtonStyle={Styles.counterButtonStyle}
                        counterButtonIconStyle={[Styles.counterButtonIconStyle, item?.isBnpl && Styles.counterDisableButtonIconStyle]}
                        counterValueContainerStyle={Styles.counterValueContainerStyle}
                        counterValueStyle={Styles.counterValueStyle}
                    />
                </View>

            </View>
        )
    };

    const checkout = () => {
        navigation.navigate('bnpl_checkout', {
            selectedItems
        })
    };

    const renderFooter = () => {
        return(
            <View style={GlobalStyle.listFooterButton}>
                <CButton
                    disabled={reduxState?.loading || !selectedItems?.length}
                    title={'Checkout'}
                    onPress={() => checkout()}
                />
            </View>
        )
    };

    return (
        <Container renderFooter={renderFooter} headerProps={headerProps}>
            <CList
                data={selectedItems}
                contentContainerStyle={Styles.container}
                renderItem={renderSelectItem}
                automaticallyAdjustContentInsets={true}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/3d-vector/empty-cart.png'),
                    text: 'Empty'
                }}
            />
        </Container>
    )
}

export default React.memo(Cart)
