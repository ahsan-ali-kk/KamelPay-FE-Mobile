import React, {useState} from "react";
import {Container} from "../../../containers";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import Styles from "./History.style";
import {formatAmount, MappedElement} from "../../../utils/methods";
import {useSelector} from "react-redux";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {CText, ProgressiveImage, CButton} from "../../../uiComponents";
import RemittanceStyles from "../../topUp/TopUp.style";
import Feather from "react-native-vector-icons/Feather";
import TrackOrder from "./TrackOrder";
import {generateInstallmentPlan} from "../helper";

function HistoryView(props) {

    const { t } = useTranslation();
    const {route: { params: data }} = props;

    const navigation  = useNavigation();

    const [isTrackOpen, setIsTrackOpen] = useState(false);

    const reduxState = useSelector(({global}) => {
        return {
            currentCountry: global.currentCountry,
        }
    });

    const headerProps = {
        headerTitle: `#${data?.transactionId}`,
        headerRight: true
    };


    const generateTransferAmountAndCharges = () => {
        let info = [];
        let obj = {
            ...(data && {...data?.meta}),
            ...(reduxState?.currentCountry && {country: reduxState?.currentCountry}),

        };
        let receiverCurrency = Object.keys(obj?.country?.currencies);

        if(obj?.hasBnpl) {
            info = [
                ...generateInstallmentPlan(t, obj, 'Name').data
            ]

        } else {
            info.push({
                Name: t('RECEIPT.AMOUNT'),
                value: formatAmount(obj?.totalAmount, receiverCurrency)
            });
            if(obj?.platformFees) {
                info.push({
                    Name: t('RECEIPT.PLATFORM_FEE'),
                    value: formatAmount(obj?.platformFees, receiverCurrency)
                });
            }
            if(obj?.processingFees) {
                info.push({
                    Name: t('RECEIPT.PROCESSING_FEES'),
                    value: formatAmount(obj?.processingFees, receiverCurrency)
                });
            }
            if(obj?.shippingFees) {
                info.push({
                    Name: 'Shipping Fees',
                    value: formatAmount(obj?.shippingFees, receiverCurrency)
                });
            }

            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.totalVat, receiverCurrency)
            });
            info.push({
                Name: t('RECEIPT.TOTAL_AMOUNT'),
                value: formatAmount(Number(data?.meta?.totalAmount) + Number(data?.meta?.totalFee) + Number(data?.meta?.totalVat), receiverCurrency),
                bold: true
            });

        }
        return info
    };
    const renderListItem = (isBold, label, value, i) => {
        return (
            <View key={i} style={RemittanceStyles.confirmInfoListItem}>
                <CText style={[RemittanceStyles.confirmInfoListItemText, isBold && Styles.fontBold]}>
                    {label}
                </CText>
                <CText style={[RemittanceStyles.confirmInfoListItemText, RemittanceStyles.textRight, isBold && Styles.fontBold]}>
                    {value}
                </CText>
            </View>
        )
    };

    const getProductVariantValues = (obj) => {
        return obj?.productDetail?.type === "WITH_VARIANTS" ? (obj?.productVariantDetail?.productVariantsValuesString) : '';
    };

    const getStatus = () => {
        return {
            PENDING: {
                _id: 'PENDING',
                text: 'Pending',
                color: '#0065FF',
                bgColor: '#e7edf6'
            },
            ACCEPTED: {
                _id: 'ACCEPTED',
                text: 'Accepted',
                color: '#66bd50',
                bgColor: '#e7f0e5',
            },
            REJECTED: {
                _id: 'REJECTED',
                text: 'Rejected',
                color: '#de4841',
                bgColor: '#f3e4e3',
            },
            EMI_REJECTED: {
                _id: 'EMI_REJECTED',
                text: 'EMI Rejected',
                color: '#de4841',
                bgColor: '#f3e4e3',
            },
            SHIPPING: {
                _id: 'SHIPPING',
                text: 'Shipping',
                color: '#f5a200',
                bgColor: '#f6eddd',
            },
            SHIPPED: {
                _id: 'SHIPPED',
                text: 'Shipped',
                color: '#ffd52a',
                bgColor: '#f6f2e1',
            },
            DELIVERED: {
                _id: 'DELIVERED',
                text: 'Delivered',
                color: '#00a45e',
                bgColor: '#ddede6',
            },
            REFUNDED: {
                _id: 'REFUNDED',
                text: 'Refunded',
                color: '#ff5630',
                bgColor: '#f6e6e2',
            }
        }
    };

    const renderProduct = (item, index) => {
        let price = item?.price;
        let statusObj = getStatus()[item.status];
        return (
            <View key={index} style={[Styles.productListItem, index === 0 && Styles.productListFirstItem]}>
                <View style={Styles.productListItemHeader}>
                    <View style={[Styles.productListItemHeaderContainer]}>
                        <Feather
                            name={'package'}
                            style={Styles.productListItemHeaderIcon}
                        />
                        <CText style={Styles.productListItemHeaderText}>
                            Shipment Tracking No. : {item?.trackingId}
                        </CText>
                    </View>
                    <View style={[Styles.listItemBodyProductStatus, {
                        backgroundColor: statusObj?.bgColor
                    }]}>
                        <CText style={[Styles.listItemBodyProductStatusText, {
                            color: statusObj?.color
                        }]}>
                            {statusObj?.text}
                        </CText>
                    </View>

                </View>
                <View style={Styles.productListItemProduct}>
                    <ProgressiveImage
                        style={Styles.productListItemProductImage}
                        source={{uri: item?.productDetail?.meta?.imageUrls[0]}}
                        resizeMode={'contain'}
                    />
                    <View style={Styles.productListItemContent}>
                        <CText style={[Styles.productListItemContentText, Styles.grayText]}>
                            {item?.categoryDetail?.name}{item?.subCategoryDetail ? `, ${item?.subCategoryDetail?.name}` : ''}
                        </CText>
                        <CText style={Styles.productListItemContentText}>
                            {item?.productDetail?.name}
                        </CText>
                        {getProductVariantValues(item) ? <CText style={Styles.productListItemContentText}>
                            {getProductVariantValues(item)}
                        </CText> : null}

                        <View style={Styles.qtyAndAmount}>
                            <CText style={[Styles.productListItemContentText, Styles.qty]}>
                                Qty : {item?.quantity}
                            </CText>
                            <CText style={[Styles.productListItemContentText, Styles.productListItemContentTextBold]}>
                                {formatAmount(price, 'AED')}
                            </CText>
                        </View>

                        {item?.trackingUrl ? <CButton
                            type={'outline'}
                            title={'Track Order'}
                            colorType={'secondary'}
                            onPress={() => setIsTrackOpen(item?.trackingUrl)}
                            buttonStyle={{
                                height: 32,
                                borderRadius: 7,
                                marginTop: 5,
                            }}
                        /> : null}

                    </View>
                </View>
            </View>
        )
    };

    const renderProducts = (data) => {
        return (
            <View style={Styles.productList}>
                <MappedElement
                    data={data?.orderProducts}
                    renderElement={renderProduct}
                />
            </View>
        )
    };

    const generateAddress = (item) => {
        return `${item?.flatUnit || ''} ${item?.buildingName || ''} ${item?.streetName || ''} ${item?.area || ''} ${item?.state || ''}`
    };

    return (
        <Container scrollView={true} headerProps={headerProps}>

            <View style={[GlobalStyle.padding_horizontal_30]}>
                {renderProducts(data)}
            </View>
            <View style={[GlobalStyle.margin_top_15, GlobalStyle.padding_horizontal_30]}>
                <CText style={RemittanceStyles.confirmInfoListHeaderText}>
                    Shipping Address
                </CText>
                <CText style={RemittanceStyles.confirmInfoListItemText}>
                    {generateAddress(data?.address)}
                </CText>

            </View>
            <View style={[GlobalStyle.margin_top_15, GlobalStyle.padding_horizontal_30]}>
                <CText style={RemittanceStyles.confirmInfoListHeaderText}>
                    Order Summery
                </CText>
                <MappedElement
                    data={generateTransferAmountAndCharges()}
                    renderElement={(obj, i) => renderListItem(obj?.bold, obj?.Name, obj?.value, i)}/>
            </View>

            <TrackOrder
                uri={isTrackOpen}
                isOpen={!!isTrackOpen}
                onClose={() => setIsTrackOpen('')}
            />

        </Container>
    )
}

export default React.memo(HistoryView)
