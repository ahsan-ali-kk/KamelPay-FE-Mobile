import React, {useEffect} from "react";
import {CText, CButton, CEmpty, CLoading} from "../../../uiComponents";
import Styles from "../Bnpl.style";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {MappedElement} from "../../../utils/methods";
import Product from "../products/Product";
import {getLatestProducts} from "../../../store/actions/Bnpl.action";

function LatestProducts() {

    const { t } = useTranslation();

    const navigation  = useNavigation();
    const dispatch  = useDispatch();

    const reduxState = useSelector(({bnpl, global}) => {
        return {
            loading: bnpl.getLatestProductsLoading,
            data: bnpl.latestProducts,
            selectedLatestCategory: bnpl.selectedLatestCategory,
            selectedLatestSubCategory: bnpl.selectedLatestSubCategory,
            card: global.selectedCard,
        }
    });

    const {card, selectedLatestCategory, selectedLatestSubCategory} = reduxState;

    const navigate = (route, params) => {
        navigation.navigate(route, params)
    };

    const get = () => {
        let payload = {
            page: 1,
            limit: 10,
            cardId: card?._id,
            ...(selectedLatestCategory?._id && { category: selectedLatestCategory?._id }),
            ...(selectedLatestCategory?._id && selectedLatestSubCategory?._id && { subCategory: selectedLatestSubCategory?._id }),
        };
        dispatch(getLatestProducts(payload))
    };


    useEffect(() => {
        get()
    }, [selectedLatestCategory, selectedLatestSubCategory]);

    const renderItems = (item, index) => {
        return (
            <Product
                key={index}
                data={item}
                productItemStyle={{flex: 0, flexBasis: '50%'}}
                onPress={() => navigate('bnpl_product_detail', {
                    product: item
                })}
            />
        )
    };

    return (
        <View style={Styles.sectionContainer}>
            <View style={Styles.sectionContainerHeader}>
                <CText style={Styles.sectionContainerHeaderText}>
                    {selectedLatestCategory || selectedLatestSubCategory ? 'Products' : 'Latest Products'}
                </CText>
                <CButton
                    buttonStyle={Styles.sectionContainerHeaderButton}
                    buttonText={Styles.sectionContainerHeaderButtonText}
                    iconStyle={Styles.sectionContainerHeaderButtonIcon}
                    title={'View More'}
                    iconName={'right-arrow'}
                    onPress={() => {
                        navigation.navigate('bnpl_products', {
                            ...(selectedLatestCategory?._id && { category: selectedLatestCategory }),
                            ...(selectedLatestSubCategory?._id && { subCategory: selectedLatestSubCategory }),
                        })
                    }}
                />
            </View>
            <View style={[Styles.sectionContainerBody, {
                paddingHorizontal: 25
            }]}>
                <View style={[{
                    flex: 1,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                }]}>
                    <CLoading loading={reduxState?.loading}
                              text={'hide'}
                              showAnimation={true}/>
                    <MappedElement
                        data={reduxState?.data}
                        renderElement={renderItems}
                        empty={() => {
                            return (
                                <CEmpty
                                    icon={require('../../../assets/images/3d-vector/empty-products.png')}
                                    text={'No Latest Products Found'}
                                />
                            )
                        }}
                    />
                </View>
            </View>

        </View>
    )
}

export default React.memo(LatestProducts)
