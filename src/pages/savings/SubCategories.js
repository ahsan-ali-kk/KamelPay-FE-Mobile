import React, {useEffect} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {CEmpty, CLoading, CText, ProgressiveImage} from "../../uiComponents";
import {View, TouchableOpacity, RefreshControl, ScrollView} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./Savings.style";
import {useTranslation} from "react-i18next";
import {getSubCategories} from "../../store/actions/Savings.action";
import {MappedElement} from "../../utils/methods";

function SubCategories(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {route: {params: data}, navigation} = props;
    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            subCategories: savings.subCategories,
            loading: savings.subCategoriesLoading,
        }
    });

    const get = () => {
        let payload = {
            categoryId: data?.category?.id,
        };
        dispatch(getSubCategories(payload))
    };

    useEffect(() => {
        get()
    }, []);

    const onRefreshHandler = () => {
        get()
    };

    const headerProps = {
        headerTitle:  data?.pageTitle,
        headerRight: true,
    };

    const onSelect = (subCat) => {
        navigation.navigate('savings_vendors', {
            pageTitle: subCat?.subCategoryName,
            category: data?.category,
            subCategory: subCat
        })
    };

    const renderItem = (item, index) => {
        return <TouchableOpacity key={index} style={Styles.category} onPress={() => onSelect(item)}>
            <View style={Styles.categoryHeader}>
                <ProgressiveImage
                    style={Styles.categoryHeaderImage}
                    source={{uri: item?.logo}}
                    fallback
                    resizeMode="contain"
                    // defaultSource={require('../../assets/images/others.png')}
                />
            </View>
            <View style={Styles.categoryBody}>
                <CText style={Styles.categoryBodyText}>{item?.subCategoryName}</CText>
            </View>
        </TouchableOpacity>
    };

    const renderCategories = () => {
        return (
            <View style={Styles.categoryList}>
                <MappedElement
                    data={reduxState?.subCategories}
                    renderElement={renderItem}
                    empty={() => <CEmpty
                        icon={require('../../assets/images/categories-placeholder.png')}
                        text={t('K_S.SUB_CATEGORIES')}
                    />}

                />
            </View>
        )
    };

    return (
        <Container headerProps={headerProps} loading={reduxState?.loading}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={onRefreshHandler}
                />
            }
            contentContainerStyle={Styles.categoriesScrollContainer}>
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0]}>
                    {t('K_S.CHOOSE_SUB_CATEGORY')}
                </CText>
                {renderCategories()}
            </ScrollView>
        </Container>
    )
}

export default React.memo(SubCategories)
