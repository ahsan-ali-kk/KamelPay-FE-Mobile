import React, {memo, useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Styles from "./Referral.style";
import {useDispatch, useSelector} from "react-redux";
import { FormatNumberWithCommas } from "../../../utils/methods";
import {CList, CText, IconButton} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import {getUserReferral} from "../../../store/actions/Referral.action";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import TransactionStyle from "../../transactionHistory/TransactionHistory.style";
import {Container} from "../../../containers";

function ReferralTransactions(props) {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    const reduxState = useSelector(({auth, global, referral}) => {
        return {
            loading: referral.getUserReferralsLoading,
            data: referral.userReferrals,
            isLoadMore: referral.userReferralsIsLoadMore,
            isLoadMoreLoading: referral.userReferralsIsLoadMoreLoading,
            metaData: referral.userReferralsMetaData,
            totalPaid: referral.totalPaid,
            totalEarned: referral.totalEarned,
        }
    });

    const {data, loading,totalEarned, totalPaid} = reduxState;

    const get = (val = 1, text = '') => {
        let payload = {
            page: val,
            limit: limit,
            ...(text && { search: text }),
        };
        dispatch(getUserReferral(payload));
    };


    useEffect(() => {
        get(page);
    }, [page]);

    const onRefreshHandler = () => {
        setPage(1);
        get(1)
    };
    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };


    const getStatusWiseData = (status) => {
        if(status === 'TRANSACTION_COMPLETED') {
            return {
                text: 'Unpaid',
                changeStyle: false
            }
        } else if(status === 'CASHBACK_DISBURST') {
            return {
                text: 'Paid',
                changeStyle: true
            }
        } else {
            return null
        }
    };
    const renderTag = (status) => {
        return getStatusWiseData(status)?.text ? (
            <View style={[TransactionStyle.listItemTag, getStatusWiseData(status).changeStyle && TransactionStyle.listItemTagUploaded]}>
                <CText style={[TransactionStyle.listItemTagText, getStatusWiseData(status).changeStyle && TransactionStyle.listItemTagUploadedText]}>
                    {getStatusWiseData(status).text}
                </CText>
            </View>
        ) : null
    };

    const renderItems = ({item, index}) => {
        return (

            <TouchableOpacity style={[TransactionStyle.listItem, index === 0 && TransactionStyle.listItemBorderNone]}>
                <IconButton
                    type="icon-with-background"
                    buttonStyle={TransactionStyle.listItemIcon}
                    iconName={'link-card'}
                />
                <View style={[TransactionStyle.listItemContent, {alignItems: 'flex-start'}]}>
                    <CText numberOfLines={2} style={[TransactionStyle.listItemTitle, {marginBottom: 5}]}>
                        {item?.refferedUserName}
                    </CText>
                    {renderTag(item?.status)}
                </View>
                <View style={TransactionStyle.listItemRightContent}>
                    <View style={TransactionStyle.listItemAmountContainer}>
                        <FormatNumberWithCommas
                            value={item.amount}
                            styleAmount={TransactionStyle.listItemAmount}
                            numberOfLines={1}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    const renderListHeader = () => {
        return (
            <View style={[Styles.transactionCards, {marginHorizontal: -40}]}>
               <View style={Styles.transactionCard}>
                   <View style={[Styles.transactionCardContainer, Styles.transactionCardDark]}>
                       <CText style={Styles.transactionCardTitle}>Total Earn</CText>
                       <FormatNumberWithCommas
                           styleAmount={Styles.transactionCardNumber}
                           value={totalEarned ? totalEarned : 0}
                           showInStart={true}
                       />
                   </View>
               </View>
               <View style={Styles.transactionCard}>
                   <View style={Styles.transactionCardContainer}>
                       <CText style={Styles.transactionCardTitle}>Total Paid</CText>
                       <FormatNumberWithCommas
                           styleAmount={Styles.transactionCardNumber}
                           value={totalPaid ? totalPaid : 0}
                           showInStart={true}
                       />
                   </View>
               </View>
           </View>

        )
    };

    const headerProps = {
        headerTitle: 'Referral Transaction',
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps} edges={['left', 'right', 'bottom']}
                   loading={reduxState?.loading}>


            <CList
                ListHeaderComponent={() => renderListHeader()}
                style={[]}
                contentContainerStyle={[Styles.sendMoneyList, GlobalStyle.margin_horizontal_30]}
                data={data}
                loading={loading}
                loadingText={'hide'}
                renderItem={renderItems}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/3d-vector/referral-empty.png'),
                    text: "No referral user found",
                    resizeMode: 'contain'
                }}
                onRefreshLoading={loading}
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

export default memo(ReferralTransactions);
