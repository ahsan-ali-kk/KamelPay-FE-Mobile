import React, {useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Container} from "../../containers";
import {CList, CText} from "../../uiComponents";
import Styles from "./ScratchCards.style";
import {formatAmount, MappedElement, readableText, renderDate} from "../../utils/methods";
import {useNavigation} from "@react-navigation/native";
import {getScratchCards} from "../../store/actions/ScratchCards.action";
import {useFocusEffect} from "@react-navigation/native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";

function ScratchCards() {
    const {t} = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const tabs = [
        {
            label: t('SCRATCH_CARDS.SCRATCHED'),
            type: "SCRATCHED",
            id: "SCRATCHED",
        },
        {
            label: t('SCRATCH_CARDS.UN_SCRATCHED'),
            type: "UNSCRATCHED",
            id: "UNSCRATCHED"
        }
    ];

    const reduxState = useSelector(({auth, global, scratchCards}) => {
        return {
            user: auth.user,
            loading: scratchCards.getScratchCardsLoading,
            data: scratchCards.scratchCards,
            isLoadMore: scratchCards.scratchCardsIsLoadMore,
            isLoadMoreLoading: scratchCards.scratchCardsIsLoadMoreLoading,
            metaData: scratchCards.scratchCardsMetaData,
            card: global.selectedCard,
        }
    });

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [searchText, updateSearchText] = useState('');
    const [selectedTab, updateSelectedTab] = useState(tabs[1]);

    const headerProps = {
        headerTitle: t('PAGE_TITLE.SCRATCH_AND_WINS'),
        headerRight: true,
    };

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            if(isActive) {
                get(1, reduxState?.card?._id);
            }

            return () => {
                isActive = false;
                setPage(1);
                updateSelectedTab(tabs[1])
            };
        }, [reduxState?.card])
    );

    useEffect(() => {
        if(selectedTab?.id){
            get(1)
        }
    }, [selectedTab]);

    const get = (val = 1, cardId) => {
        let payload = {
            cardId: cardId || reduxState?.card?._id,
            page: val,
            limit: limit,
            isScratched: selectedTab?.id === 'SCRATCHED'
        };
        dispatch(getScratchCards(payload));
    };

    const onRefreshHandler = () => {
        setPage(1);
        get(1)
    };

    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
            get(page + 1)
        }
    };

    const onSelect = (item) => {
        if(!item?.isScratched) {
            navigation.navigate('scratch_card_detail', {scratchCard: item})
        }
    };

    const renderWinnerText = (obj) => {
      switch (obj?.prizeType) {
          case 'PRODUCT':
              return `${obj?.productName}, ${obj?.productTitle}`;
          default:
              return `${formatAmount(obj?.amount, 'AED')} ${readableText(obj?.prizeType)}`;
      }
    };

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity style={[Styles.listItem]} onPress={() => onSelect(item)}>
                <View style={Styles.listItemContent}>
                    <CText style={Styles.listItemText}>
                        {t('SCRATCH_CARDS.SCRATCH_TO_WIN_PRIZE')}
                    </CText>
                    {item?.isWinner ? <CText style={Styles.listItemSubText}>
                        {t('SCRATCH_CARDS.WON')} {renderWinnerText(item?.scratchCardPrizeDetails)}
                    </CText> : item?.isScratched ? <CText style={[Styles.listItemSubText, Styles.tryAgain]}>
                        {t('SCRATCH_CARDS.TRY_AGAIN_TEXT')}
                    </CText> : null}
                    {item?.createdAt ? <CText style={Styles.listItemDate}>
                        {renderDate(item?.createdAt)}
                    </CText> : null}
                </View>
                {!item?.isScratched ? <View style={Styles.listItemTag}>
                    <CText style={Styles.listItemTagText}>
                        {t('SCRATCH_CARDS.SCRATCH_NOW')}
                    </CText>
                </View> : null}
            </TouchableOpacity>
        )
    };


    const onSelectTab = (tab) => {
        setPage(1);
        updateSelectedTab(tab);
    };
    const renderTabs = () => {
        return (
            <View style={GlobalStyle.customTabContainer}>
                <MappedElement
                    data={tabs}
                    renderElement={(tab, i) => {
                        let selected = tab.id === selectedTab?.id;
                        return (
                            <TouchableOpacity key={i}
                                              style={[GlobalStyle.customTabItem, selected && GlobalStyle.activeCustomTabItem]}
                                              onPress={() => onSelectTab(tab)}>
                                <CText style={[GlobalStyle.customTabItemText, selected && GlobalStyle.activeCustomTabItemText]}>
                                    {tab.label}
                                </CText>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    };

    return (
        <Container headerProps={headerProps}>
            {renderTabs()}
            <CList
                contentContainerStyle={Styles.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/3d-vector/scratch-card-voucher-empty.png'),
                    text: t('EMPTY_SECTION.SCRATCH_CARD_NOT_FOUND'),
                    resizeMode: 'contain',
                    iconStyle: {
                        width: 150,
                        height: 150
                    }
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

        </Container>
    )
}

export default React.memo(ScratchCards)
