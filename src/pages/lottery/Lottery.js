import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Container} from "../../containers";
import {CButton, CList, ProgressiveImage, CText, AlertView, Counter, CountDownTimer} from "../../uiComponents";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {getCampaigns} from "../../store/actions/Lottery.action";
import Styles from "./Lottery.style";
import {formatAmount, percentage} from "../../utils/methods";
import moment from "moment";
import {themes} from "../../theme/colors";
import {useNavigation} from "@react-navigation/native";

export const renderProgressBar = (obj) => {
    let soldValue = obj?.c_allocation - obj?.c_ATS;
    let percentageValue = percentage(obj?.c_allocation, soldValue);

    const getColorWithPercentage = (value) => {
        if(value > 66){
            return '#ff6262'
        } else if (value > 33) {
            return '#ffc700'
        } else {
            return themes['light'].colors.secondary
        }
    };

    return(
        <View style={Styles.progressBarContainer}>
            <View style={Styles.progressBar}>
                <View style={[Styles.progressBarInnerContainer,
                    {width: `${percentageValue}%`, backgroundColor: getColorWithPercentage(percentageValue)}]} />
            </View>
            <CText style={Styles.progressBarText}>
                <CText style={Styles.progressBarBoldText}>{soldValue} sold</CText> out of {obj?.c_allocation}
            </CText>
        </View>
    )
};

export const renderDrawAlert = (data, t) => {
    let text = data?.c_drawTime ? `Draw date ${moment(data?.c_drawTime).format('MMMM DD, yyyy')}`
        : `${t('PRIZE_DRAW.DRAW_DATE')} ${moment(data?.c_endTime).format('MMMM DD, yyyy')}`;
    return data?.c_endTime && text ? (
        <AlertView
            viewStyle={Styles.campaignItem2Alert}
            textStyle={Styles.campaignItem2AlertText}
            showIcon={false}
            text={text}
        />
    ) : null
};

function LotteryItem(props) {
    const {t} = useTranslation();
    const {data, goDetail, buy} = props;

    const [quantity, setQuantity] = useState(1);

    const onChangeCounter = (val) => {
        setQuantity(val)
    };

    const renderCountDown = () => {
        return data?.c_enableTimer ? (
            <View style={Styles.campaignItem2CountDown}>
                <CountDownTimer
                    format={'number'}
                    text={'CLOSING IN'}
                    containerStyle={{marginBottom: 0}}
                    timerStyle={Styles.campaignItem2CountDownText}
                    labelStyle={Styles.campaignItem2CountDownText}
                    initialValue={data?.c_secondToEnd ? data?.c_secondToEnd : 0}
                >
                    <CText style={Styles.campaignItem2CountDownText}>{t('CLOSED')}</CText>
                </CountDownTimer>
            </View>
        ) : null;
    };

    return (
        <View style={Styles.campaignItem2}>
            {renderDrawAlert(data, t)}
            <View style={Styles.campaignItem2ImageContainer}>
                {renderCountDown()}
                <ProgressiveImage
                    style={Styles.campaignItem2Image}
                    // source={{uri: data?.c_campaignImages?.campaignSliderImages?.length ? data?.c_campaignImages?.campaignSliderImages[0]?.httpsURL : ''}}
                    source={{uri: data?.c_campaignImages?.prize?.httpsURL}}
                    defaultSource={require('../../assets/images/lottery-not-found.png')}
                />
                {/*<View style={Styles.poweredBy}>*/}
                {/*    <ProgressiveImage*/}
                {/*        resizeMode={'contain'}*/}
                {/*        style={Styles.poweredByImage}*/}
                {/*        source={require('../../assets/images/poweredBy/idealz.png')}*/}
                {/*    />*/}
                {/*</View>*/}
            </View>
            <View style={Styles.campaignItem2Content}>

                <View style={Styles.campaignItem2Tag}>
                    <CText style={Styles.campaignItem2TagText}>{t('GLOBAL.JUST_LAUNCHED')}</CText>
                </View>

                <CText style={Styles.campaignItem2Title}>Win: {data?.c_prizeTitle}</CText>
                <CText style={[Styles.campaignItem2Title, Styles.campaignItem2SubTitle]}>
                    {t('GLOBAL.BY')} {data?.c_productName} {t('GLOBAL.FOR')} <CText style={Styles.campaignItem2TitlePrice}>{formatAmount(data?.c_price, data?.c_currency)}</CText>
                </CText>

                {data?.c_isTimeLimited ? null : renderProgressBar(data)}

                {goDetail ? <CButton
                    buttonStyle={{ width: '100%', marginTop: 10 }}
                    type={'outline'}
                    title={t('GLOBAL.DETAILS')}
                    onPress={() => goDetail && goDetail()}
                /> : null}

                <View style={Styles.campaignItem2CounterWithButton}>
                    <Counter
                        hideButtons={data?.c_isTimeLimited}
                        label={t('RECEIPT.QUANTITY')}
                        onChange={onChangeCounter}
                        value={quantity}
                        max={data?.c_ATS >= 5 ? 5 : data?.c_ATS }
                    />
                    <CButton
                        onPress={() => buy && buy(quantity)}
                        buttonStyle={Styles.campaignItem2CounterWithButtonLeft}
                        title={`Buy ${formatAmount(data?.c_price * quantity, data?.c_currency)}`}
                    />
                </View>

            </View>
        </View>
    )
}

function Lottery(props) {
    const {t} = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reduxState = useSelector(({auth, global, lottery}) => {
        return {
            user: auth.user,
            loading: lottery.getCampaignsLoading,
            data: lottery.campaigns,
            card: global.selectedCard,
        }
    });

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [searchText, updateSearchText] = useState('');

    const headerProps = {
        headerTitle: t('PAGE_TITLE.PRIZE_DRAW'),
        headerRight: true,
    };

    const get = (val = 1, text = searchText) => {
        let payload = {
            // page: val,
            // limit: limit,
            // ...(text && { search: text }),
        };
        dispatch(getCampaigns(payload));
    };

    useEffect(() => {
        get(page);
    }, [page]);

    const onRefreshHandler = () => {
        setPage(1);
        get(1)
    };

    const onSelect = (item) => {
        navigation.navigate('lottery_detail', item)
    };

    const buy = (item) => {
        navigation.navigate('lottery_overview', item)
    };

    const renderItem2 = ({item}) => {
        return <LotteryItem
            data={item}
            goDetail={() => onSelect(item)}
            buy={(quantity) => buy({...item, quantity})}
        />
    };

    return (
        <Container headerProps={headerProps}>
            <CList
                ListHeaderComponent={() => {
                    return (
                        <View style={Styles.poweredBy}>
                            <ProgressiveImage
                                resizeMode={'contain'}
                                style={Styles.poweredByImage}
                                source={require('../../assets/images/poweredBy/idealz.png')}
                            />
                        </View>
                    )
                }}
                contentContainerStyle={Styles.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem2}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/lottery-not-found.png'),
                    text: t('EMPTY_SECTION.LOTTERY_NOT_FOUND')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                // onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                // isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('GLOBAL.HISTORY')}
                         type={'without_outline'}
                         onPress={() => navigation.navigate('lottery_history')}
                         disabled={reduxState.loading}
                />
            </View>

        </Container>
    )
}

export default React.memo(Lottery)
