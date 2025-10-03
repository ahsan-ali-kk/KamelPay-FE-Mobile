import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Styles from "./Points.style";
import {CButton, CList, CText, IconButton} from "../../uiComponents";
import {getPointsList, getPointsStats} from "../../store/actions/Points.action";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import KamlepayIcon from "../../assets/icons/KamelPayIcon";
import {renderDateAndTime} from "../../utils/methods";
import Redeem from "./Redeem";
import {checkUserAndCardStatus} from "../home/Home";

function Points(props) {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const RedeemRef = useRef();

    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    const reduxState = useSelector(({auth, global, points}) => {
        return {
            stats: points.pointsStats,
            getStatsLoading: points.getPointsStatsLoading,
            loading: points.getPointsListLoading,
            data: points.pointsList,
            isLoadMore: points.pointsListIsLoadMore,
            isLoadMoreLoading: points.pointsListIsLoadMoreLoading,
            metaData: points.pointsListMetaData,
            masterDetails: global.masterDetails,
            getMasterDetailLoading: global.getMasterDetailLoading,
            card: global.selectedCard,
        }
    });


    const redemptionCallBack = () => {
        get();
        getStats();
    };

    const getStats = () => {
        dispatch(getPointsStats());
    };

    const get = (val = 1) => {

        let payload = {
            page: val,
            limit: limit,
        };
        dispatch(getPointsList(payload));
    };

    useEffect(() => {
        get(page);
    }, [page]);

    const onRefreshHandler = () => {
        setPage(1);
        getStats();
    };

    const onEndReached = () => {
        if (reduxState.data?.length < reduxState.metaData?.totalDocuments) {
            setPage(page + 1);
        }
    };

    const headerProps = {
        headerTitle: 'Naqad Points',
        headerRight: true,
    };

    const renderTransactionItems = ({item, index}) => {
        return (
            <TouchableOpacity style={[Styles.listItem, index === 0 && Styles.listItemBorderNone]}>
                <IconButton
                    type="icon-with-background"
                    buttonStyle={Styles.listItemIcon}
                    iconName={'transactions'}
                />
                <View style={Styles.listItemContent}>
                    <CText numberOfLines={2} style={Styles.listItemTitle}>
                        {item?.mode === 'DEBIT' ? 'Redeem Points' : 'Earned Points'}
                    </CText>
                    <CText numberOfLines={1} style={Styles.listItemDate}>
                        {renderDateAndTime(item?.createdAt)}
                    </CText>
                </View>
                <View style={Styles.listItemRightContent}>
                    <View style={Styles.listItemAmountContainer}>
                        <KamlepayIcon style={[Styles.listItemAmountIcon,
                            (item?.mode === 'D' || item?.mode === 'DEBIT') && Styles.redIcon]}
                                      name={(item?.mode === 'D' || item?.mode === 'DEBIT') ? 'caret-up' : 'caret-down'}/>
                        <CText style={Styles.listItemAmount}>{item?.points}</CText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
      return (
          <View style={GlobalStyle.listFooterButton}>
              <CButton title={'Redeem'}
                       loading={false}
                       disabled={!reduxState?.stats?.availablePoints}
                       onPress={() => {
                           checkUserAndCardStatus(t, reduxState?.card, ({type}) => {
                               if(type === 'FUNCTION') {
                                   RedeemRef?.current?.openModal()
                               }
                           }, {isShowPopup: true});
                       }}/>
          </View>
      )
    };

    const renderHeader = () => {
        return (
            <View style={Styles.transactionCards}>
                <View style={[Styles.transactionCard, Styles.transactionCardFull]}>
                    <View style={Styles.transactionCardContainer}>
                        <CText style={[Styles.transactionCardTitle, Styles.transactionCardFullTitle]}>
                            Available
                        </CText>
                        <CText style={[Styles.transactionCardNumber, Styles.transactionCardFullNumber]}>
                            {reduxState?.stats?.availablePoints || 0}
                        </CText>
                    </View>
                </View>
                <View style={Styles.transactionCard}>
                    <View style={[Styles.transactionCardContainer, Styles.transactionCardDark]}>
                        <CText style={Styles.transactionCardTitle}>Total Earned</CText>
                        <CText style={[Styles.transactionCardNumber, Styles.transactionCardFullNumber]}>
                            {reduxState?.stats?.totalEarned || 0}
                        </CText>
                    </View>
                </View>
                <View style={Styles.transactionCard}>
                    <View style={Styles.transactionCardContainer}>
                        <CText style={Styles.transactionCardTitle}>Total Redeem</CText>
                        <CText style={[Styles.transactionCardNumber, Styles.transactionCardFullNumber]}>
                            {reduxState?.stats?.totalRedeemed || 0}
                        </CText>
                    </View>
                </View>
            </View>
        )
    };

    return (
        <Container
            headerProps={headerProps}
            renderFooter={renderFooter}
        >
            <View style={Styles.innerContainer}>


                <CList
                    ListHeaderComponent={renderHeader}
                    loading={reduxState.loading}
                    contentContainerStyle={[GlobalStyle.list, Styles.list]}
                    data={reduxState.data}
                    renderItem={renderTransactionItems}
                    keyExtractor={(item, index) => index.toString()}
                    emptyOptions={{
                        icon: require('../../assets/images/3d-vector/employer/transactions-empty-2.png'),
                        text: t('EMPTY_SECTION.TRANSACTION_HISTORY')
                    }}
                    onRefreshLoading={reduxState.loading}
                    onRefreshHandler={() => onRefreshHandler()}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.1}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    scrollEventThrottle={16}
                    isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
                />

            </View>

            <Redeem ref={RedeemRef}
                    redemptionCallBack={redemptionCallBack}
            />

        </Container>
    )
}

export default Points;
