import React from "react";
import {CList, ProgressiveImage, CText, CButton} from "../../../uiComponents";
import Styles from "../Bnpl.style";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {View, TouchableOpacity} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {updateLatestCategory, updateLatestSubCategory} from "../../../store/actions/Bnpl.action";

function LatestCategories(props) {

    const { t } = useTranslation();

    const dispatch  = useDispatch();
    const navigation  = useNavigation();

    const reduxState = useSelector(({bnpl}) => {
        return {
            loading: bnpl.getLatestCategoriesLoading,
            data: bnpl.latestCategories,
            selectedCategory: bnpl.selectedLatestCategory,
        }
    });

    const {loading, data, selectedCategory} = reduxState;

    const onSelect = (item) => {
        let payload = item?._id === selectedCategory?._id ? null : item;
        dispatch(updateLatestCategory(payload));
        dispatch(updateLatestSubCategory(null))
    };


    const renderItems = ({item, index}) => {
        return (
            <TouchableOpacity key={index}
                              onPress={() => onSelect(item)}
                              style={[Styles.brandListItem, selectedCategory?._id === item?._id && Styles.selectedBrandListItem]}>
                <ProgressiveImage
                    style={Styles.brandListItemImage}
                    source={{uri: item?.meta?.imageUrl}}
                    resizeMode={'contain'}
                />
            </TouchableOpacity>
        )
    };

    return (
        <View style={Styles.sectionContainer}>
            <View style={Styles.sectionContainerHeader}>
                <CText style={Styles.sectionContainerHeaderText}>
                    Categories
                </CText>
                <CButton
                    buttonStyle={Styles.sectionContainerHeaderButton}
                    buttonText={Styles.sectionContainerHeaderButtonText}
                    iconStyle={Styles.sectionContainerHeaderButtonIcon}
                    title={'View More'}
                    iconName={'right-arrow'}
                    onPress={() => {
                        navigation.navigate('bnpl_categories')
                    }}
                />
            </View>
            <View style={[Styles.sectionContainerBody, Styles.brandListMainContainer]}>
                <CList
                    loadingText={'hide'}
                    listContainerStyle={{minHeight: 80, marginBottom: 30}}
                    nestedScrollEnabled={props?.nestedScrollEnabled}
                    style={Styles.brandList}
                    contentContainerStyle={Styles.brandListContainer}
                    data={data}
                    loading={loading}
                    renderItem={renderItems}
                    horizontal={true}
                    automaticallyAdjustContentInsets={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    emptyOptions={{
                        icon: require('../../../assets/images/3d-vector/empty-categories.png'),
                        text: 'No Latest Categories Found',
                        iconStyle: {
                            width: 42,
                            height: 42,
                        }
                    }}
                />
            </View>

        </View>
    )
}

export default React.memo(LatestCategories)
