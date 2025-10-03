import React, {Fragment, useEffect, useRef, useState} from "react";
import {Container, ReferralCode} from "../../../containers";
import {CText} from "../../../uiComponents";
import Styles from "./CheckOut.style";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useDispatch, useSelector} from "react-redux";
import {CButton} from "../../../uiComponents";
import ProductStyles from "../products/Products.style";
import RemittanceStyles from "../../topUp/TopUp.style";
import {
    formatAmount,
    FormatNumberWithCommas,
    getPBnplFees,
    MappedElement,
    openDialScreen,
    SERVICES,
    truncateAmount
} from "../../../utils/methods";
import {
    getAddresses,
    getFeesAndVat,
    requestBNPL,
    updateLatestCategory, updateLatestSubCategory,
    verifyBNPL
} from "../../../store/actions/Bnpl.action";
import Popup from "../../../uiComponents/popup/Popup";
import UserKYC from "../../../containers/termsAndConditions/TermsAndConditions";
import References from "../references/References";
import ScratchCard from "../../scratchCards/ScratchCard";
import {useAppReview} from "../../../hooks";
import { findBNPLProductInCart, generateInstallmentPlan } from "../helper";

function Checkout(props) {

    const {route: { params: data }} = props;
    const {selectedItems} = data;
    const { t } = useTranslation();
    const ScratchCardRef = useRef();
    const { onReview } = useAppReview();
    const navigation  = useNavigation();
    const dispatch  = useDispatch();

    const [references, updateReferences] = useState(false);
    const [referencesInformation, updateReferencesInformation] = useState({});
    const [userKYC, updateUserKYC] = useState(false);

    const headerProps = {
        headerTitle: 'Checkout',
        headerRight: true
    };

    const reduxState = useSelector(({bnpl, global}) => {
        return {
            loading: bnpl.getCartProductsLoading,
            data: bnpl.getCartProducts,
            currentCountry: global.currentCountry,
            selectedAddress: bnpl.selectedAddress,
            addresses: bnpl.addresses,
            getAddressesLoading: bnpl.getAddressesLoading,
            card: global.selectedCard,
            getFeesAndVatLoading: bnpl.getFeesAndVatLoading || bnpl.requestLoading || bnpl.verifyLoading,
            feesAndVat: bnpl.feesAndVat,
            bnplDetails: bnpl?.bnplEligibility,
        }
    });

    useEffect(() => {
        if(!Object.keys(referencesInformation).length) {
            dispatch(getAddresses({
                page: 1,
                limit: 10
            }));
            dispatch(getFeesAndVat({
                cardId: reduxState?.card?._id,
            }))
        }

    }, []);

    useEffect(() => {
        if(data?.whereToComeFrom === 'OTP'){
            handleSubmit(data);
        }
    }, [data]);

    const getSum = (data) => {
        return Number(data?.totalAmount) + Number(data?.totalFee) + Number(data?.totalVat)
    };

    const navigate = (route, params) => {
        navigation.navigate(route, params)
    };
    const navigationReset = () => {
        dispatch(updateLatestCategory(null));
        dispatch(updateLatestSubCategory(null));
        Popup.hide();
        onReview();
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        });
    };
    const contactUs = () => {
        Popup.hide();
        openDialScreen();
        navigationReset();
    };
    const errorPopup = (message) => {
        Popup.show({
            isVisible: true,
            type: 'Error',
            title: t('POPUPS.ERROR.TITLE'),
            text: message,
            actions: [
                {
                    text: t('GLOBAL.TRY_AGAIN'),
                    callback: () => navigationReset()
                },
                {
                    text: t('GLOBAL.CONTACT_US'),
                    callback: () => contactUs()
                }
            ]
        })
    };

    const handleSubmit = (res) => {
        let payload = {
            token: res?.verifyOtpResponseToken
        };
        dispatch(verifyBNPL(payload, verifyBNPLCallBack))
    };

    const verifyBNPLCallBack = (res) => {
        if(res?.error){
            errorPopup(res?.data?.message)
        } else {
            Popup.show({
                isVisible: true,
                showClose: false,
                type: 'Success',
                title:  t('GLOBAL.SUCCESSFULLY'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => {
                            if(res?.data?.userScratchCard){
                                Popup.hide();
                                ScratchCardRef.current.toggleModal({_id: res?.data?.userScratchCard});
                            } else {
                                navigationReset()
                            }
                        }
                    },
                ]
            })
        }
    };

    // Function to check if a specific key is true in any object
    function isKeyTrue(key, arr) {
        return arr.some(obj => obj.hasOwnProperty(key) && obj[key] === true);
    }
    const placeOrder = () => {
        if(reduxState?.selectedAddress && Object.keys(reduxState?.selectedAddress).length){
            const isBnpl = isKeyTrue('isBnpl', data?.selectedItems);
            if(isBnpl){
                updateReferences(true)
            } else {
                requestBNPLFunc()
            }
        } else {
            navigate('bnpl_addresses')
        }
    };

    const requestBNPLFunc = () => {
        const isBnpl = isKeyTrue('isBnpl', data?.selectedItems);
        let payload = {
            cardId: reduxState?.card?._id,
            addressId: reduxState?.selectedAddress?._id,
            ...(isBnpl ? {
                ...referencesInformation
            }: {})
        };
        dispatch(requestBNPL(payload, requestBNPLCallBack))
    };
    const requestBNPLCallBack = (res) => {
        if(res?.error){
            updateReferencesInformation({});
            errorPopup(res?.data?.message)
        } else {
            if(!res.error) {
                navigation.replace('bnpl_otp', {
                    ...res.data,
                    overviewData: data,
                    flow: 'WITHOUT_OTP_DATA',
                    screen: 'bnpl_checkout',
                })
            }
        }
    };

    const getFooterButtonTitle = () => {
        if(reduxState?.selectedAddress && Object.keys(reduxState?.selectedAddress).length){
            return 'Place Order'
        } else {
            return 'Select Address'
        }
    };

    const renderFooter = () => {

        let foundBnpl = findBNPLProductInCart(selectedItems);
        let title = foundBnpl ? 'Amount Due Today' : t('RECEIPT.TOTAL_AMOUNT');
        let value = foundBnpl ? calculateVatAndFee(reduxState.feesAndVat) : getSum(reduxState.feesAndVat);

        return (
            <Fragment>
                <View style={GlobalStyle.listFooterButton}>
                    <View style={[RemittanceStyles.confirmInfoListItem, {paddingTop: 5}]}>
                        <CText style={[RemittanceStyles.confirmInfoListItemText, RemittanceStyles.textBold, {fontSize: 14}]}>
                            {title}
                        </CText>
                        <FormatNumberWithCommas styleAmount={[RemittanceStyles.confirmInfoListItemText,
                            RemittanceStyles.textBold, RemittanceStyles.textRight, RemittanceStyles.primaryText,
                            {fontSize: 16}]}
                            value={value}
                        />
                    </View>
                    <CButton disabled={reduxState?.loading} title={getFooterButtonTitle()} onPress={() => placeOrder()} />
                </View>
            </Fragment>
        )
    };

    const getAddress = (item) => {
        return `${item?.flatUnit || ''} ${item?.buildingName || ''} ${item?.streetName || ''} ${item?.area || ''} ${item?.state || ''}`
    };

    const renderAddressSection = () => {
        return (
            <View style={[ProductStyles.sectionContainer, ProductStyles.border_top_0, GlobalStyle.padding_vertical_10]}>
                <View style={[ProductStyles.sectionContainerHeader, Styles.sectionHeader]}>
                    <View style={Styles.sectionHeaderLeft}>
                        <CText style={ProductStyles.sectionContainerHeaderText}>
                            Delivery Address
                        </CText>
                    </View>
                    <CButton
                        title={'Change'}
                        buttonStyle={Styles.addAddressButton}
                        iconStyle={Styles.addAddressButtonIcon}
                        buttonText={Styles.addAddressButtonText}
                        onPress={() => navigate('bnpl_addresses')}
                    />
                </View>
                <View style={ProductStyles.sectionContainerBody}>
                    {reduxState?.selectedAddress && Object.keys(reduxState?.selectedAddress).length ? <View style={Styles.addressItem}>
                        <CText style={[Styles.addressItemText, Styles.addressItemTitle]}>
                            {reduxState?.selectedAddress?.buildingName}
                        </CText>
                        <CText style={[Styles.addressItemText]}>
                            {getAddress(reduxState?.selectedAddress)}
                        </CText>
                    </View> : <View style={Styles.addressItem}>
                        <CText style={[Styles.addressItemText, {textAlign:'center'}]}>
                            {'Add New Address / Change Address'}
                        </CText>
                    </View>}
                </View>
                <View style={[GlobalStyle.margin_horizontal_30, Styles.addAddressButtonContainer]}>
                    <CButton
                        title={'Add Address'}
                        rightIconName={'add'}
                        onPress={() => navigate('bnpl_add_address')}
                        buttonStyle={Styles.addAddressButton}
                        iconStyle={Styles.addAddressButtonIcon}
                        buttonText={Styles.addAddressButtonText}
                    />
                </View>
            </View>
        )
    };

    const getProductPriceWithQuantity = (item) => {
        let obj = {};
        if(item?.product?.type === "WITH_VARIANTS") {
            obj = {
                quantity: item?.quantity,
                price: item?.product?.productVariantDetail?.price,
                currency: item?.product?.productVariantDetail?.currency
            }
        } else if(item?.product?.type === "WITHOUT_VARIANTS") {
            obj = {
                quantity: item?.quantity,
                price: item?.product?.price,
                currency: item?.product?.currency
            }
        }
        return obj
    };

    const getFeeBracket = (amount) => {
        return getPBnplFees(reduxState?.bnplDetails?.feeBrackets, amount) || {NoOfInstallment: reduxState?.bnplDetails?.noOfInstallment}
    };

    const getAmount = (amount, isBnpl) => {
        if(isBnpl) {
            let feeBracket = getFeeBracket(amount);
            return truncateAmount(amount / feeBracket?.NoOfInstallment)
        } else {
            return amount
        }
    };

    const renderOrderSummeryItem = (item, index) => {
        let priceAndQuantity = getProductPriceWithQuantity(item);
        return (
            <View style={Styles.orderSummeryItem} key={index}>
                <CText style={Styles.orderSummeryItemText}>
                    {priceAndQuantity?.quantity} x {item?.product?.name}
                </CText>
                <CText style={[Styles.orderSummeryItemText, Styles.orderSummeryItemLeftText]}>
                    {formatAmount(getAmount(priceAndQuantity?.price * priceAndQuantity?.quantity, item?.isBnpl), priceAndQuantity?.currency)}
                    {item?.isBnpl ? ` x ${getFeeBracket(priceAndQuantity?.price * priceAndQuantity?.quantity)?.NoOfInstallment} Installments` : null}
                </CText>
            </View>
        )
    };

    const renderOrderSummery = () => {
        return (
            <View style={[ProductStyles.sectionContainer, GlobalStyle.padding_vertical_10, GlobalStyle.padding_bottom_30]}>
                <View style={ProductStyles.sectionContainerHeader}>
                    <CText style={ProductStyles.sectionContainerHeaderText}>
                        Order Summery
                    </CText>
                </View>
                <View style={ProductStyles.sectionContainerBody}>
                    <MappedElement
                        data={selectedItems}
                        renderElement={renderOrderSummeryItem}
                    />
                </View>
            </View>
        )
    };

    const calculateVatAndFee = (obj) => {
        return generateInstallmentPlan(t, obj).amountDueToday;
    };

    const generateTransferAmountAndCharges = () => {
        let info = [];
        let obj = {
            ...(selectedItems && {cartItems: selectedItems}),
            ...(reduxState?.currentCountry && {country: reduxState?.currentCountry}),
            ...(reduxState?.feesAndVat),
        };

        let foundBnpl = findBNPLProductInCart(obj?.cartItems);

        let receiverCurrency = Object.keys(obj?.country?.currencies);

        if(foundBnpl){
            info = [
                ...generateInstallmentPlan(t, obj, 'Name').data
            ]
        } else {

            info.push({
                // Name: t('RECEIPT.AMOUNT'),
                Name: 'Amount Due Today',
                value: formatAmount(obj?.totalAmount, receiverCurrency)
            });

            if(obj?.platformFees && Number(obj?.platformFees)) {
                info.push({
                    Name: t('RECEIPT.PLATFORM_FEE'),
                    value: formatAmount(obj?.platformFees, receiverCurrency)
                });
            }
            if(obj?.processingFees && Number(obj?.processingFees)) {
                info.push({
                    Name: t('RECEIPT.PROCESSING_FEES'),
                    value: formatAmount(obj?.processingFees, receiverCurrency)
                });
            }
            if(totalShippingFeesAndVat) {
                info.push({
                    Name: 'Shipping Fees + VAT',
                    value: formatAmount(totalShippingFeesAndVat, receiverCurrency)
                });
            }
            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.totalVat, receiverCurrency)
            });
        }

        return info
    };

    const renderListItem = (label, value, i) => {
        return (
            <View key={i} style={RemittanceStyles.confirmInfoListItem}>
                <CText style={RemittanceStyles.confirmInfoListItemText}>
                    {label}
                </CText>
                <CText style={[RemittanceStyles.confirmInfoListItemText, RemittanceStyles.textRight]}>
                    {value}
                </CText>
            </View>
        )
    };

    return (
        <Container
            renderFooter={renderFooter}
            scrollView={true}
            loading={reduxState.getFeesAndVatLoading}
            scrollViewProps={{
                contentContainerStyle: [
                    Styles.container,
                    GlobalStyle.padding_horizontal_30
                ]
            }}
            headerProps={headerProps}>

            {renderAddressSection()}

            {renderOrderSummery()}

            <ReferralCode
                inputContainerStyle={{marginBottom: 10, marginTop: 10}}
                service={isKeyTrue('isBnpl', data?.selectedItems) ? SERVICES.BNPL._id : SERVICES.ECOMMERCE._id}
            />

            <View style={[ProductStyles.sectionContainer, GlobalStyle.padding_vertical_15, GlobalStyle.padding_horizontal_30]}>
                <CText style={RemittanceStyles.confirmInfoListHeaderText}>
                    {t('RECEIPT.TRANSFER_AMOUNT_AND_CHARGES')}
                </CText>
                <MappedElement
                    data={generateTransferAmountAndCharges()}
                    renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>
            </View>

            <References
                isOpen={references}
                onClose={() => updateReferences(!references)}
                onSubmit={(res) => {
                    updateReferences(false);
                    updateReferencesInformation(res);
                    updateUserKYC(!userKYC)
                }}
                bnplDetails={reduxState.bnplDetails}
            />

            <UserKYC
                isOpen={userKYC}
                type={"BNPL_USER_KYC"}
                close={(type) => {
                    updateUserKYC(!userKYC);
                    if(type === 'SUBMIT') {
                        requestBNPLFunc()
                    }
                }}
            />

            <ScratchCard ref={ScratchCardRef} goBack={false} close={() => navigationReset()} />

        </Container>
    )
}

export default React.memo(Checkout)
