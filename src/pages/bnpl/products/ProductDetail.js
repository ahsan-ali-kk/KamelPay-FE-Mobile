import React, {useEffect, useState} from "react";
import {ProgressiveImage, CText, CButton, CLoading} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {View, Dimensions, TouchableOpacity, ScrollView} from "react-native";
import {Container} from "../../../containers";
import Swiper from "react-native-swiper";
import Styles from "./Products.style";
import {useDispatch, useSelector} from "react-redux";
import {addProductIntoCart, getProductDetail, getProductInstallmentInfo} from "../../../store/actions/Bnpl.action";
import {formatAmount, generateArrayOfString, MappedElement} from "../../../utils/methods";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import _ from "lodash";
import RenderHtml from 'react-native-render-html';
import ImageView from "react-native-image-viewing";
import Popup from "../../../uiComponents/popup/Popup";
import { findBNPLProductInCart, generateInstallmentPlan } from "../helper";

const windowWidth = Dimensions.get('window').width;

function ProductDetail(props) {

    const { t } = useTranslation();
    const {route: { params: data }} = props;
    const navigation  = useNavigation();
    const dispatch  = useDispatch();

    const reduxState = useSelector(({bnpl, global}) => {
        return {
            loading: bnpl.getProductDetailLoading || bnpl.updateCartLoading,
            product: bnpl.productDetail,
            getCartProducts: bnpl.getCartProducts,
            card: global.selectedCard,
            productInstallmentInfo: bnpl.getProductInstallmentInfo,
            productInstallmentInfoLoading: bnpl.getProductInstallmentInfoLoading,
        }
    });

    const {product, loading, card, productInstallmentInfo, productInstallmentInfoLoading} = reduxState;
    const [selectedVariants, updateSelectedVariants] = useState([]);
    const [paymentMood, updatePaymentMood] = useState('INSTALLMENT');
    const [visible, setIsVisible] = useState(false);

    const headerProps = {
        headerTitle: 'Product Detail',
        headerRight: true
    };

    const get = () => {
        let payload = {
            id: data?.product?._id,
            cardId: reduxState?.card?._id,
        };
        dispatch(getProductDetail(payload))
    };

    useEffect(() => {
        get()
    }, [data]);

    useEffect(() => {
        let check = product?.productVariants?.length === selectedVariants?.length;
        if(product?.isForBnpl && (data?.product?.type === "WITH_VARIANTS" ? check && paymentMood === 'INSTALLMENT' : paymentMood === 'INSTALLMENT')){
            let variantInfo = getProductInfoByVariant(selectedVariants);
            if(variantInfo?.isForBnpl) {
                dispatch(getProductInstallmentInfo({
                    id: data?.product?._id,
                    cardId: card?._id,
                    ...(variantInfo?._id && {
                        productVariantDetailId: variantInfo?._id
                    })
                }));
            }
        }
    }, [paymentMood, selectedVariants]);

    const setSelectedFirstVariantValues = (obj) => {
        let array = obj?.productVariants;
        let selected = [];
        array?.length && array.forEach((a) => {
            let found = a?.productVariantValues.find((o, i) => i === 0);
            if(found){
                selected.push(found)
            }
        });
        return selected
    };

    useEffect(() => {
        if(product) {
            let selected = setSelectedFirstVariantValues(product);
            if(selected){
                updateSelectedVariants(selected)
            }
        }
    }, [product]);


    const productImageSlide = (array) => {
        if (array && array.length) {
            return array.map((obj, index) => {
                return (
                    <TouchableOpacity onPress={() => setIsVisible(true)}
                                      key={index}
                                      style={Styles.productImageSlide}>
                        <ProgressiveImage
                            resizeMode={obj?.resizeMode || 'contain'}
                            source={{uri: obj}}
                            style={Styles.productImageSlideImage}/>
                    </TouchableOpacity>
                );
            });
        }
        return null;
    };

    const productImages = (array) => {
        return array?.length ? (
            <View style={Styles.productImageSlider}>
                <Swiper
                    width={windowWidth-100}
                    index={0}
                    showsButtons={false}
                    paginationStyle={Styles.sliderDotContainer}
                    dotStyle={Styles.sliderDot}
                    activeDotStyle={Styles.sliderActiveDot}
                    removeClippedSubviews={false}
                >
                    {productImageSlide(array)}
                </Swiper>
            </View>
        ) : null
    };

    const onSelectVariant = (variant) => {
        let previousSelectedVariants =  [...selectedVariants];
        let pExist = previousSelectedVariants.find((o) => o?._id === variant?._id);
        let hasVariant = previousSelectedVariants.find((o) => o?.productVariant === variant?.productVariant);
        if(previousSelectedVariants?.length){
            if(pExist) {
                previousSelectedVariants = previousSelectedVariants.filter((o) => o?._id !== variant?._id)
            } else {
                if(hasVariant){
                    previousSelectedVariants = previousSelectedVariants.filter((o) => o?._id !== hasVariant?._id)
                }
                previousSelectedVariants.push(variant);
            }
        } else {
            previousSelectedVariants.push(variant);
        }
        updateSelectedVariants(previousSelectedVariants)
    };

    const equalsCheck = (a, b) => {
        if (a.length !== b.length) {
            return false;
        }

        const sortedA = a.slice().sort();
        const sortedB = b.slice().sort();

        return sortedA.every((v, i) => v === sortedB[i]);
    };

    const getProductInfoByVariant = (array) => {
        let ids = generateArrayOfString(array);
        let found = {};
        if(product?.productVariantDetails?.length) {
            found = product?.productVariantDetails.filter(a => equalsCheck(ids, a.productVariantsValues));
        }
        return found?.length && found[0]
    };

    const getSelectedVariantById = (array, variant) => {
        if(array?.length) {
            return array.find(o => o?._id === variant?._id)
        } else {
            return null
        }
    };

    const checkStockAvailability = () => {
        let availableWithVariants = selectedVariants && getProductInfoByVariant(selectedVariants)?.availableUnits;
        let availableWithOutVariants = product?.availableUnits;
        return product?.type === "WITH_VARIANTS" ? availableWithVariants : availableWithOutVariants;
    };

    const otherInformation = () => {
        let data = [
            {
                title: 'Availability',
                ...(checkStockAvailability() > 0 ? {
                    value: 'In Stock'
                } : {
                    color: 'red',
                    value: 'Out Of Stock'
                })
            },
            {
                title: 'Category',
                value: `${product?.category?.name}${product?.category?.name ? `, ${product?.subCategory?.name}` : ''}`
            },
            {
                title: 'Model',
                value: product?.name
            },
            {
                title: 'Delivery Method',
                value: 'Courier'
            }
        ];
        return (
            <View style={[Styles.infoItemList, GlobalStyle.margin_horizontal_minus_30]}>
                <MappedElement
                    data={data}
                    renderElement={(item, i) => {

                        return (
                            <View style={Styles.infoItem} key={i}>
                                <CText style={[
                                    Styles.infoItemText,
                                    Styles.infoItemTitle,
                                    GlobalStyle.margin_horizontal_0
                                ]}>
                                    {item?.title}
                                </CText>
                                <CText style={[
                                    Styles.infoItemText,
                                    Styles.infoItemValue,
                                    item?.color && {color: item.color}
                                ]}>
                                    {item?.value}
                                </CText>
                            </View>
                        )
                    }}
                />
            </View>
        )
    };

    const removeBNPLProduct = (CB) => {
        Popup.show({
            isVisible: true,
            type: "Warning",
            title: "Are You Sure!",
            text: "Please note you can only purchase 1 'ONE' product on instalment at a time",
            actions: [
                {
                    text: t('GLOBAL.CANCEL'),
                    callback: () => Popup.hide()
                },
                {
                    text: t('GLOBAL.YES'),
                    callback: () => {
                        CB && CB();
                        Popup.hide();
                    }
                },
            ]
        })
    };
    const removeAllProductToBnpl = (CB) => {
        Popup.show({
            isVisible: true,
            type: "Warning",
            title: "Are You Sure!",
            text: "Please note you cannot combine CASH and BNPL products together.",
            actions: [
                {
                    text: t('GLOBAL.CANCEL'),
                    callback: () => Popup.hide()
                },
                {
                    text: t('GLOBAL.YES'),
                    callback: () => {
                        CB && CB();
                        Popup.hide();
                    }
                },
            ]
        })
    };

    const addProduct = () => {

        let variantInfo = getProductInfoByVariant(selectedVariants);

        let prevCart = reduxState?.getCartProducts?.length ? reduxState?.getCartProducts.map(obj => {
            let updatedObj = _.omit(obj, ['product', '_id']);
            return {
                ...updatedObj,
                product: obj?.product?._id,
            }
        }) : [];

        let foundBnpl = findBNPLProductInCart(prevCart);

        let addToCartProduct = {
            quantity: 1,
            product: data?.product?._id,
            isBnpl: product?.isForBnpl && paymentMood === 'INSTALLMENT',
            ...(variantInfo?._id && {productVariantDetail: variantInfo?._id}),
        };

        if(foundBnpl){
            removeBNPLProduct(() => addIntoCart([addToCartProduct]));
        } else {
            if(prevCart?.length && addToCartProduct?.isBnpl){
                removeAllProductToBnpl(() => addIntoCart([addToCartProduct]));
            } else {
                prevCart.push(addToCartProduct);
                addIntoCart(prevCart);
            }
        }
    };

    const addIntoCart = (array) => {
        dispatch(addProductIntoCart({
            products: array,
        }, () => {
            navigation.navigate('bnpl_cart')
        }));
    };

    const renderFooter = () => {
        let availableWithVariants = product?.productVariants?.length === selectedVariants?.length && selectedVariants && checkStockAvailability() > 0;
        let availableWithOutVariants = product && checkStockAvailability() > 0;
        let disabled = product?.type === "WITH_VARIANTS" ? !availableWithVariants : !availableWithOutVariants;
        return(
            <View style={GlobalStyle.listFooterButton}>
                <CButton title={'Add To Cart'}
                         disabled={productInstallmentInfoLoading || disabled}
                         onPress={() => addProduct()}/>
            </View>
        )
    };

    const generateTabsInstallmentOrCash = (variant) => {
        let variantInfo = getProductInfoByVariant(variant);
        let data = {
            "product": product?._id,
            "_id": "PAYMENT_MODE",
            "name": "Payment Mode",
            "productVariantValues": [
                {
                    "product": product?._id,
                    "_id": 'INSTALLMENT',
                    "value": "Installment"
                },
                {
                    "product": product?._id,
                    "_id": 'CASH',
                    "value": "Cash"
                },
            ]
        };
        return variantInfo?.isForBnpl ? [data] : []
    };

    const renderVariantHeader = (title) => {
        return (
            <View style={Styles.sectionContainerHeader}>
                <CText style={Styles.sectionContainerHeaderText}>
                    {title}
                </CText>
            </View>
        )
    };

    const renderInstallmentInformation = (info, variant) => {
        let variantInfo = getProductInfoByVariant(variant);
        let data = generateInstallmentPlan(t, info).data;
        return variantInfo?.isForBnpl ?  (
            <View style={[Styles.sectionContainer]}>
                <View style={Styles.sectionContainerHeader}>
                    <CText style={Styles.sectionContainerHeaderText}>
                        Installment Plan Information
                    </CText>
                </View>
                <View style={Styles.sectionContainerBody}>
                    {productInstallmentInfoLoading ? <CLoading loading={productInstallmentInfoLoading}
                                                               text={'hide'}
                                                               style={{height: 120, position: 'relative', marginBottom: 30}}
                                                               showAnimation={true} /> : <View style={[
                        Styles.infoItemList,
                        GlobalStyle.margin_horizontal_0,
                        GlobalStyle.margin_bottom_15]}>
                        <MappedElement
                            data={data}
                            renderElement={(item, i) => {
                                return (
                                    <View style={[Styles.infoItem, Styles.border_top_0, {
                                        paddingVertical: 10
                                    }]} key={i}>
                                        <CText style={[Styles.infoItemText, Styles.infoItemTitle, Styles.infoItemTextBold]}>
                                            {item?.title}
                                        </CText>
                                        <CText style={[Styles.infoItemText, Styles.infoItemValue]}>
                                            {item?.value}
                                        </CText>
                                    </View>
                                )
                            }}
                        />
                    </View>}
                </View>
            </View>
        ) : null
    };

    const renderVariantItem = (variant, index, found, onPress) => {
        return (
            <TouchableOpacity key={index}
                              onPress={onPress}
                              style={[
                                  Styles.productVariantButton,
                                  found && Styles.productVariantActiveButton
                              ]}>
                <CText style={[
                    Styles.productVariantButtonText,
                    found && Styles.productVariantActiveButtonText
                ]}>
                    {variant?.value}
                </CText>
            </TouchableOpacity>
        )
    };

    const getProductImages = () => {
        let array = [];
        array = product?.meta?.imageUrls?.map((o) => {
            return {
                uri: o
            }
        });
        return array
    };

    return (
        <Container
            scrollView={true}
            loading={loading}
            scrollViewProps={{
                contentContainerStyle: Styles.container,
            }}
            renderFooter={renderFooter}
            headerProps={headerProps}>

            {productImages(product?.meta?.imageUrls)}

            <View style={Styles.productTitleAndPrice}>
                <View style={Styles.productTitleContainer}>
                    <CText style={Styles.productTitle}>
                        {product?.name}
                    </CText>
                </View>
                <CText style={Styles.productPrice}>
                    {formatAmount(getProductInfoByVariant(selectedVariants)?.price || product?.price, product?.currency)}
                </CText>
            </View>

            {product?.productVariants?.length ? <MappedElement
                data={product?.productVariants}
                renderElement={(item, i) => {
                    return (
                        <View key={i} style={[Styles.sectionContainer, Styles.variantsContainer]}>
                            {renderVariantHeader(item?.name)}
                            <View style={Styles.sectionContainerBody}>
                                <ScrollView horizontal={true}
                                            contentContainerStyle={Styles.sectionContainerContainScroll}>
                                    <MappedElement
                                        data={item?.productVariantValues}
                                        renderElement={(variant, i) =>  {
                                            let found = getSelectedVariantById(selectedVariants, variant);
                                            return renderVariantItem(variant, i, found, () => onSelectVariant(variant))
                                        }}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    )
                }}
            /> : null}
            {/*{product?.isForBnpl ? <MappedElement*/}
            {/*    data={generateTabsInstallmentOrCash(selectedVariants)}*/}
            {/*    renderElement={(item, i) => {*/}
            {/*        return (*/}
            {/*            <View key={i} style={[Styles.sectionContainer, Styles.variantsContainer]}>*/}
            {/*                {renderVariantHeader(item?.name)}*/}
            {/*                <View style={Styles.sectionContainerBody}>*/}
            {/*                    <ScrollView horizontal={true}*/}
            {/*                                contentContainerStyle={Styles.sectionContainerContainScroll}>*/}
            {/*                        <MappedElement*/}
            {/*                            data={item?.productVariantValues}*/}
            {/*                            renderElement={(variant, i) => {*/}
            {/*                                let found = variant?._id === paymentMood;*/}
            {/*                                return renderVariantItem(variant, i, found, () => updatePaymentMood(variant?._id))*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </ScrollView>*/}
            {/*                </View>*/}
            {/*            </View>*/}
            {/*        )*/}
            {/*    }}*/}
            {/*/> : null}*/}

            {product?.isForBnpl && paymentMood === 'INSTALLMENT' ? renderInstallmentInformation(productInstallmentInfo, selectedVariants) : null}

            {product?.description ? <View style={[Styles.sectionContainer]}>
                {renderVariantHeader('Description')}
                <View style={Styles.sectionContainerBody}>
                    <View style={[Styles.sectionContainerContainScroll, {marginHorizontal: 0}]}>
                        <RenderHtml source={{html : product?.description}}/>
                    </View>
                </View>
            </View> : null}

            {otherInformation()}

            <ImageView
                images={getProductImages()}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />

        </Container>
    )
}

export default React.memo(ProductDetail)
