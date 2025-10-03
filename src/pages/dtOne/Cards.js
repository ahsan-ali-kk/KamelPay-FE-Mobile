import React, {useEffect, useState} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CButton, CList, CText, ProgressiveImage} from "../../uiComponents";
import {TouchableOpacity, View} from "react-native";
import Styles from "./DtOne.style";
import {useTranslation} from "react-i18next";
import {getCards} from "../../store/actions/DtOne.action";
import {useNavigation} from "@react-navigation/native";
import Popup from "../../uiComponents/popup/Popup";
import CardAmount from "./CardAmount";

function Cards(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reduxState = useSelector(({auth, dtOne, global}) => {
        return {
            loading: dtOne.getCardsLoading,
            data: dtOne.cards,
            isLoadMore: dtOne.cardsIsLoadMore,
            isLoadMoreLoading: dtOne.cardsIsLoadMoreLoading,
            metaData: dtOne.cardsMetaData,
        }
    });

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CARDS'),
        headerRight: true,
    };

    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    useEffect(() => {
        get(page);
    }, [page]);

    const get = (val = 1) => {
        let payload = {
            page: val,
            limit: limit,
        };
        dispatch(getCards(payload));
    };

    const onRefreshHandler = () => {
        setPage(1);
    };
    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const onSelect = (item) => {
        if(item?.type === 'RANGED_VALUE_PIN_PURCHASE') {
            view(item)
        } else {
            goToOverview(item)
        }
    };

    const goToOverview = (obj) => {
        navigation.navigate('dt_one_overview', {
            card: obj,
        })
    };

    const view = (obj) => {
        Popup.show({
            isVisible: true,
            styleMainContainer: GlobalStyle.paddingHorizontal_0,
            styleContainer: GlobalStyle.bottomHalfModal,
            viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
            type: 'customView',
            showClose: true,
            edges: ['top', 'left', 'right'],
            customView: () => {
                return (
                    <CardAmount
                        data={obj}
                        close={() => Popup.hide()}
                        submit={(values) => {
                            Popup.hide();
                            goToOverview({
                                ...values,
                                ...obj
                            })
                        }}
                    />
                )
            }
        })
    };

    const renderItem = ({item, index}) => {
        return <TouchableOpacity key={index} style={Styles.category} onPress={() => onSelect(item)}>
            <View style={Styles.categoryHeader}>
                <ProgressiveImage
                    style={Styles.categoryHeaderImage}
                    source={require('../../assets/images/category-placeholder.png')}
                    resizeMode="cover"
                />
            </View>
            <View style={Styles.categoryBody}>
                <CText style={Styles.categoryBodyText}>{item?.name}</CText>
                <CText style={Styles.categoryBodySubText}>{item?.description}</CText>
            </View>
        </TouchableOpacity>
    };

    return (
        <Container headerProps={headerProps}>

            <CList
                style={{marginTop: 15, marginHorizontal: -30}}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-cards.png'),
                    text: t('EMPTY_SECTION.PURCHASE_CARD')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('GLOBAL.HISTORY')}
                         disabled={reduxState.loading}
                         onPress={() => navigation.navigate('dt_one_history')}
                />
            </View>

        </Container>
    )
}

export default React.memo(Cards)
