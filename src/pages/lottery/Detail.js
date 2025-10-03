import React, {useState} from "react";
import {View, TouchableOpacity, ScrollView, Dimensions} from "react-native";
import {useTranslation} from "react-i18next";
import {Container} from "../../containers";
import {
    CButton,
    ProgressiveImage,
    CText,
    AlertView,
    IconButton,
    Video,
    CModal,
    Counter,
    CountDownTimer
} from "../../uiComponents";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./Lottery.style";
import {formatAmount, MappedElement} from "../../utils/methods";
import Carousel from "react-native-snap-carousel";
import {renderDrawAlert, renderProgressBar} from "./Lottery";
import {useNavigation} from "@react-navigation/native";
const windowWidth = Dimensions.get('window').width;

function Detail(props) {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const [quantity, setQuantity] = useState(1);

    const tabs = [
        {
            label: t('PRIZE_DRAW.PRIZE_DETAILS'),
            type: "PRIZE",
            id: "PRIZE",
        },
        {
            label: t('PRIZE_DRAW.PRODUCT_DETAILS'),
            type: "PRODUCT",
            id: "PRODUCT"
        }
    ];

    const {route, data: propsData, loading = false, page = '', viewReceipt = null} = props;

    const data = route?.params || propsData;

    const [selectedTab, updateSelectedTab] = useState(tabs[0]);
    const [liveModalIsOpen, updateLiveModalIsOpen] = useState(false);

    const headerProps = {
        headerTitle: t('PAGE_TITLE.PRIZE_DRAW'),
        headerRight: true,
    };

    const onSelectTab = (tab) => {
        updateSelectedTab(tab)
    };

    const onChangeCounter = (val) => {
        setQuantity(val)
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
    const renderImageSection = (item) => {
        let productImage = selectedTab.id === 'PRIZE' ? item?.c_campaignImages?.campaignSliderImages : [item?.c_campaignImages?.product];
        return productImage?.length ? (
            <View style={Styles.detailImageSection}>
                <Carousel
                    removeClippedSubviews={false}
                    data={productImage}
                    width={windowWidth}
                    sliderWidth={windowWidth - 60}
                    itemWidth={windowWidth - 60}
                    renderItem={({item, index}) => (
                        <ProgressiveImage
                            key={index}
                            style={[Styles.detailImageSectionImage]}
                            resizeMode={'cover'}
                            source={{uri: item?.httpsURL}}
                        />
                    )}
                    currentSelectIndex={0}
                    currentScrollPosition={0}
                />
                {renderCountDown()}
            </View>
        ) : null
    };

    const renderProductDetail = (item) => {
        return <View style={Styles.tabContainer}>
            <CText style={[Styles.campaignItem2Title]}>{item?.c_productName}</CText>
            <CText style={[Styles.campaignItem2Title, Styles.campaignItem2SubTitle, Styles.detailSubTitle]}>
                <CText style={Styles.campaignItem2TitlePrice}>{formatAmount(item?.c_price, item?.c_currency)}</CText>
            </CText>
            <CText style={[Styles.campaignItemSubTitle, Styles.detailSubTitle]}>
                {item?.c_baseDescription}
            </CText>
        </View>
    };

    const renderWinnerListItem = (obj, i, data) => {
        return (
            <View key={i} style={[Styles.winnerListItem, i === 0 && Styles.noTopBorder]}>
               <IconButton
                    buttonType='normal'
                    type="icon-with-background"
                    iconName={'savings'}
                />
                <View style={Styles.winnerListItemContent}>
                    <CText style={[Styles.winnerListItemText, Styles.winnerListItemTitle]}>
                        {data?.length <= 1 ? obj?.winnerName && obj?.winnerTicketNumber ? t('GLOBAL.CONGRATULATIONS') : t('GLOBAL.WINNER_NOT_ANNOUNCED')
                            : `${t('GLOBAL.WINNER')} ${i+1}`}
                    </CText>
                    {obj?.winnerName ? <CText style={[Styles.winnerListItemText, Styles.winnerListItemName]}>
                        {obj?.winnerName} on winning {obj?.prizeTitle}
                    </CText> : data?.length <= 1 ? null : <CText style={[Styles.winnerListItemText, Styles.winnerListItemName]}>
                        {t('GLOBAL.WINNER_NOT_ANNOUNCED')}
                    </CText>}
                    {obj?.winnerTicketNumber ? <CText style={[Styles.winnerListItemText, Styles.winnerListItemTicketNumber]}>
                        {t('GLOBAL.TICKET_NO')} : {obj?.winnerTicketNumber}
                    </CText> : null}
                </View>
            </View>
        )
    };
    const renderWinnerList = (data = []) => {
        return (
            <View style={Styles.winnerList}>
                <View style={Styles.winnerListHeader}>
                    <CText style={Styles.winnerListHeaderTitle}>{t('GLOBAL.WINNERS')}</CText>
                </View>
                <MappedElement
                    data={data}
                    renderElement={renderWinnerListItem}
                />
            </View>
        )
    };

    const renderPrizeDetail = (item) => {
        return <View style={Styles.tabContainer}>
            <CText style={[Styles.campaignItem2Title, Styles.detailTitle]}>{t('GLOBAL.WIN')}: {item?.c_prizeTitle}</CText>
            <CText style={[Styles.campaignItem2Title, Styles.campaignItem2SubTitle, Styles.detailSubTitle]}>
                {t('GLOBAL.BY')} {item?.c_productName} {t('GLOBAL.FOR')} <CText style={Styles.campaignItem2TitlePrice}>{formatAmount(item?.c_price, item?.c_currency)}</CText>
            </CText>
            <CText style={[Styles.campaignItemSubTitle, Styles.detailSubTitle]}>
                {item?.c_description}
            </CText>
            {item?.c_isEnded ? renderWinnerList(item?.c_multiWinnerPrizeMapping): null}
        </View>
    };

    const toggleLiveModal = (val) => {
        updateLiveModalIsOpen(val || !liveModalIsOpen)
    };

    const renderCountDown = () => {
        return data?.c_enableTimer ? (
            <View style={[Styles.campaignItem2CountDown]}>
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
        <Container loading={loading} headerProps={headerProps}>
            <View style={GlobalStyle.flex_1}>
                {renderTabs()}
                <ScrollView contentContainerStyle={Styles.detailContainer}>
                    {renderDrawAlert(data, t)}
                    {data?.c_drawVideo ? <AlertView
                        viewStyle={{
                            marginTop: 10,
                            marginBottom: 0,
                            alignItems: 'center',
                            height: 'auto'
                        }}
                        text={t('GLOBAL.WATCH_LIVE_DRAW')}
                        type='error'
                        iconName={'alerts'}
                        buttonProps={{
                            title: t('GLOBAL.WATCH'),
                            onPress: () => toggleLiveModal()
                        }}
                    /> : null}
                    {renderImageSection(data)}
                    <View style={Styles.detailInnerContainer}>
                        <View style={Styles.campaignItem2Tag}>
                            <CText style={Styles.campaignItem2TagText}>{t('GLOBAL.JUST_LAUNCHED')}</CText>
                        </View>
                    </View>
                    {selectedTab.id === 'PRIZE' ? renderPrizeDetail(data) : renderProductDetail(data)}
                </ScrollView>
                {data?.c_isTimeLimited ? null : !data?.c_isEnded ? <View style={{paddingHorizontal: 30, paddingTop: 10}}>
                    {renderProgressBar(data)}
                </View> : null}
                <View style={[GlobalStyle.twoInputsView, Styles.tabBottomFooter, {
                    alignItems: 'flex-end',
                    marginTop: 15
                }]}>
                    {page !== 'check_lottery' ? <Counter
                        label={t('RECEIPT.QUANTITY')}
                        onChange={onChangeCounter}
                        hideButtons={data?.c_isTimeLimited}
                        value={quantity}
                        max={data?.c_ATS >= 5 ? 5 : data?.c_ATS }
                        counterContainerStyle={[GlobalStyle.twoInputsViewContainer, {flex: 0}]}
                    /> : null}
                    <CButton
                        buttonStyle={GlobalStyle.twoInputsViewContainer}
                        title={page !== 'check_lottery' ? `${t('GLOBAL.BUY')} ${formatAmount((quantity * Number(data?.c_price) || 0), data?.c_currency)}` : t('RECEIPT.VIEW_RECEIPT')}
                        onPress={() =>
                            page !== 'check_lottery' ?
                            navigation.navigate('lottery_overview', {
                                ...data,
                                quantity
                            })
                                : viewReceipt && viewReceipt()
                        }
                    />
                </View>
            </View>


            <CModal isOpen={liveModalIsOpen} close={() => toggleLiveModal()}
                    headerProps={{
                        headerTitle: t('PRIZE_DRAW.LIVE_DRAW'),
                        headerRight: true,
                        backOnPress:() => toggleLiveModal()
                    }}>
                {data?.c_drawVideo ?  <View>
                    <Video
                        source={{ uri: data?.c_drawVideo }}
                        videoWrapper={Styles.videoWrapper}
                        style={Styles.video}
                        disableTimer={false}
                        disableSeekbar={false}
                        disableFullscreen={false}
                        disablePlayPause={false}
                        showOnStart={true}
                        thumbnail={{ uri: data?.c_drawVideo }}
                    />
                </View> : null}

            </CModal>

        </Container>
    )
}

export default React.memo(Detail)
