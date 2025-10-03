import React, {Fragment, useEffect} from "react";
import {CList, ProgressiveImage, CText, CButton} from "../../../uiComponents";
import Styles from "../Bnpl.style";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {View, TouchableOpacity} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {
    getLatestSubCategories,
    updateLatestSubCategory
} from "../../../store/actions/Bnpl.action";

function LatestSubCategories(props) {

    const { t } = useTranslation();
    const dispatch  = useDispatch();
    const navigation  = useNavigation();

    const reduxState = useSelector(({bnpl}) => {
        return {
            loading: bnpl.getLatestSubCategoriesLoading || bnpl.getLatestCategoriesLoading,
            data: bnpl.latestSubCategories,
            category: bnpl.selectedLatestCategory,
            selected: bnpl.selectedLatestSubCategory,
        }
    });

    const {loading, data, selected, category} = reduxState;

    const get = (item) => {
        let payload = {
            page: 1,
            limit: 10,
            category: item?._id
        };
        dispatch(getLatestSubCategories(payload))
    };

    useEffect(() => {
        if(category?._id) {
            get(category)
        }
    }, [category]);

    const navigate = (route, params) => {
        navigation.navigate(route, params)
    };

    const onSelect = (item) => {
        let payload = item?._id === selected?._id ? null : item;
        dispatch(updateLatestSubCategory(payload));
    };

    const renderItems = ({item, index}) => {
        return (
            <TouchableOpacity key={index} onPress={() => onSelect(item)}
                              style={[Styles.brandListItem, selected?._id === item?._id && Styles.selectedBrandListItem]}>
                <ProgressiveImage
                    style={Styles.brandListItemImage}
                    source={{uri: item?.meta?.imageUrl}}
                    resizeMode={'contain'}
                />
            </TouchableOpacity>
        )
    };

    if(!category) {
        return null
    }

    return (
        <Fragment>
            <View style={Styles.sectionContainer}>
                <View style={Styles.sectionContainerHeader}>
                    <CText style={Styles.sectionContainerHeaderText}>
                        Sub Categories
                    </CText>
                    <CButton
                        buttonStyle={Styles.sectionContainerHeaderButton}
                        buttonText={Styles.sectionContainerHeaderButtonText}
                        iconStyle={Styles.sectionContainerHeaderButtonIcon}
                        title={'View More'}
                        iconName={'right-arrow'}
                        onPress={() => {
                            navigation.navigate('bnpl_sub_categories', {
                                category: category
                            })
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
                            text: 'No Brands Found',
                            iconStyle: {
                                width: 42,
                                height: 42,
                            }
                        }}
                    />
                </View>
            </View>
            <View style={Styles.borderLine}/>
        </Fragment>
    )
}

export default React.memo(LatestSubCategories)
