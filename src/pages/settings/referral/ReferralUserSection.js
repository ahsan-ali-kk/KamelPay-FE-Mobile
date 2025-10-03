import React, {memo, useEffect, useState} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import Styles from "../../home/Home.style";
import {useDispatch, useSelector} from "react-redux";
import {
    formatAmount,
    nameFirstLetter,
} from "../../../utils/methods";
import {CList, CText} from "../../../uiComponents";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {getUserReferral} from "../../../store/actions/Referral.action";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";

function ReferralUserSection(props) {

    const { t } = useTranslation();

    const {cardBlockPopup, selectedCard} = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    const reduxState = useSelector(({auth, global, referral}) => {
        return {
            card: global.selectedCard,
            user: auth.user,

            loading: referral.getUserReferralsLoading,
            data: referral.userReferrals,
            isLoadMore: referral.userReferralsIsLoadMore,
            isLoadMoreLoading: referral.userReferralsIsLoadMoreLoading,
            metaData: referral.userReferralsMetaData,
        }
    });

    const {data, loading} = reduxState;

    // useEffect(() => {
    //     get();
    // }, []);

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

    const renderSendMoneyItems = ({item, index}) => {
        return (
            <TouchableOpacity key={index} style={Styles.sendMoneyListItem}>
               <View style={Styles.sendMoneyListItemIconContainer}>
                    <CText numberOfLines={1} style={Styles.sendMoneyListItemIconText}>
                        {nameFirstLetter(item?.refferedUserName)}
                    </CText>
                </View>
                <CText numberOfLines={1} style={Styles.sendMoneyListItemTitle}>
                    {item?.refferedUserName}
                </CText>
                <CText numberOfLines={1} style={Styles.sendMoneyListItemAmount}>
                    {formatAmount(item?.amount, 'AED')}
                </CText>

            </TouchableOpacity>
        )
    };


    const render = () => {
        return (
            <View style={[Styles.sectionContainer, {borderTopWidth: 0, flexGrow: 1}]}>
                <View style={[Styles.sectionContainerHeader, GlobalStyle.margin_horizontal_minus_30]}>
                    <View style={Styles.sectionContainerHeaderContent}>
                        <CText style={Styles.sectionContainerHeaderTitle}>
                            {/*{t('SECTION_LABELS.SEND_MONEY_TO')}*/}
                            {'Referral Beneficiaries'}
                        </CText>
                    </View>
                </View>
                <View style={Styles.sectionContainerBody}>

                    <CList
                        loadingStyle={{position: 'relative', height: 180}}
                        style={[GlobalStyle.margin_horizontal_minus_30, {marginHorizontal: -30}]}
                        contentContainerStyle={Styles.sendMoneyList}
                        data={reduxState.data}
                        horizontal={true}
                        loading={loading}
                        loadingText={'hide'}
                        renderItem={renderSendMoneyItems}
                        keyExtractor={(item, index) => index.toString()}
                        emptyOptions={{
                            icon: require('../../../assets/images/3d-vector/referral-empty.png'),
                            // text: t('EMPTY_SECTION.NO_BENEFICIARY_FOUND')
                            text: "No referral user found",
                            resizeMode: 'contain'
                        }}
                        // onRefreshLoading={reduxState.loading}
                        onRefreshHandler={() => onRefreshHandler()}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
                    />

                    {/*{loading ? <CLoading*/}
                    {/*    showAnimation={true}*/}
                    {/*    transparent={true}*/}
                    {/*    style={Styles.sectionContainerBodyLoading} loading={true}/> :<ScrollView*/}
                    {/*    showsHorizontalScrollIndicator={false}*/}
                    {/*    horizontal={true} contentContainerStyle={Styles.sendMoneyList}>*/}
                    {/*    <MappedElement*/}
                    {/*        data={data || []}*/}
                    {/*        renderElement={renderSendMoneyItems}/>*/}
                    {/*</ScrollView>}*/}
                </View>
            </View>
        )
    };


    return render()
}

export default memo(ReferralUserSection);
