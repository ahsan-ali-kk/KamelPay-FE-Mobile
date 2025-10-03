import React, { useEffect, useState} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CButton, CList, CText, IconButton, Receipt} from "../../uiComponents";
import {View, TouchableOpacity} from "react-native";
import {formatAmount, status} from "../../utils/methods";
import Styles from "./Savings.style";
import moment  from 'moment';
import {useTranslation} from "react-i18next";
import {getRedeemHistory} from "../../store/actions/Savings.action";

export const renderFlatOrPercentage = (item) => {
    switch (item?.discountType) {
        case "FLAT":
            return `Flat ${item?.discount} AED Off`;
        case "PERCENTAGE":
            return `${item?.discount}% Off`;

    }
};

function Savings(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {route: {params: data}, navigation} = props;

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            loading: savings.getRedeemHistoryLoading,
            data: savings.redeemHistory,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
        }
    });

    const [ticketPayload, updateTicketPayload] = useState({});
    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);


    useEffect(() => {
        get();
    }, []);


    const get = () => {
        dispatch(getRedeemHistory());
    };

    const onRefreshHandler = () => {
        // setPage(1);
        get()
    };

    const headerProps = {
        headerTitle: t('PAGE_TITLE.HISTORY'),
        headerRight: true,
    };

    const onSelect = (card) => {
        updateTicketPayload({amountInAED: card?.payableAmount, ...card})
    };

    const renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={Styles.listItem} onPress={() => onSelect(item)}>
                <IconButton
                    buttonType='normal'
                    type="icon-with-background"
                    iconName={'offers'}
                />
                <View style={Styles.listItemContent}>
                    <View style={Styles.listItemTop}>
                        <CText style={Styles.listItemTitle} numberOfLines={1}>
                            {item?.outletName}
                        </CText>
                        <View style={[Styles.listItemStatus, status[item?.status] && {backgroundColor: status[item?.status].bgColor}]}>
                            <CText style={[Styles.listItemStatusText, status[item?.status] && {color: status[item?.status].color}]}>
                                {status[item?.status]  ? t(status[item?.status].title) : ''}
                            </CText>
                        </View>
                    </View>
                    <View style={Styles.listItemBottom}>
                        <View style={Styles.listItemBottomCode}>
                            <CText style={Styles.listItemLabel}>{item?.details}</CText>
                            <CText style={Styles.listItemValue}>{renderFlatOrPercentage(item)}</CText>
                        </View>
                        <CText style={Styles.listItemDate}>{moment(item?.tranDate).format('DD/MM/YY hh:mm a')}</CText>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    const onClose = () => {
        updateTicketPayload({})
    };

    const generateReceiverDetail = (res) => {
        let info = [];

        let obj = {
            ...(res && res),
        };

        if(obj?.outletName){
            info.push({
                Name: t(`RECEIPT.VENDOR`),
                value: obj?.outletName,
            });
        }
        if(obj?.details){
            info.push({
                Name: t('RECEIPT.OFFER'),
                value: obj?.details,
            });
        }

        if(obj?.tranDate) {
            info.push({
                Name: t('GLOBAL.DATE'),
                value: moment(obj?.tranDate).format('DD MMMM, yyyy'),
            });
            info.push({
                Name: t('GLOBAL.TIME'),
                value: moment(obj?.tranDate).format('hh:mm a')
            })
        }

        return info
    };

    const generateTransferAmountAndCharges = (res) => {
        let info = [];

        let obj = {
            ...(res && res),
        };

        if(obj?.billAmount){
            info.push({
                Name: t(`RECEIPT.AMOUNT`),
                value: `${formatAmount(obj?.billAmount)} ${Object.keys(selectedCountry?.currencies)}`,
                separate: true
            });
        }

        if(obj?.discount) {
            info.push({
                Name: t(`RECEIPT.DISCOUNT`),
                value: renderFlatOrPercentage(obj) || 0
            })
        }

        info.push({
            Name: t('RECEIPT.CHARGES'),
            value: t('RECEIPT.NO_FEE'),
        });

        info.push({
            Name: t('RECEIPT.VAT'),
            value: t('RECEIPT.NO_VAT'),
        });

        return info
    };

    const generateSendToInfo = (res) => {
        return [
            ...generateReceiverDetail(res),
            ...generateTransferAmountAndCharges(res),
        ]
    };

    return (
        <Container headerProps={headerProps}>
            <CList
                style={{marginHorizontal: -30}}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/discount-placeholder.png'),
                    text: t('K_S.HISTORY_EMPTY_TITLE')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                // onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('K_S.EXPLORE')}
                         disabled={reduxState.loading}
                         onPress={() => navigation.navigate('savings_categories')}
                />
            </View>

            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={() => onClose()}
                data={ticketPayload}
                infoTitle={t('RECEIPT.INFORMATION')}
                infoUpperTitle=""
                isHistory={true}
                senTo={generateSendToInfo(ticketPayload)}
            />

        </Container>
    )
}

export default React.memo(Savings)
