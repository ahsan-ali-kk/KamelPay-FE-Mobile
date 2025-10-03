import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {CButton, CText, ProgressiveImage, CInput, AlertView} from "../../uiComponents";
import {formatAmount, getAdvanceFees, MappedElement, openDialScreen} from "../../utils/methods";
import {useTranslation} from "react-i18next";
import TermsAndConditions from "../../containers/termsAndConditions/TermsAndConditions";
import UserKYC from "../../containers/termsAndConditions/TermsAndConditions";
import Popup from "../../uiComponents/popup/Popup";
import {checkCardStatus} from "../home/Home";
import {getPromoAndOffer, requestAdvanceSalary, verifyAdvanceSalary} from "../../store/actions/AdvanceSalary.action";
import _ from 'lodash';
import Style from "../topUp/TopUp.style";
import KeyboardView from '../../containers/KeyboardView';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import ScratchCard from "../scratchCards/ScratchCard";
import {useAppReview} from "../../hooks";
import {useSafeAreaInsets} from "react-native-safe-area-context";

function Overview(props) {

    const { t } = useTranslation();
    const ScratchCardRef = useRef();
    const { onReview } = useAppReview();
    const insets = useSafeAreaInsets();

    const { route: { params: data}, navigation } = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t("PAGE_TITLE.CONFIRMATION"),
        headerRight: true,
    };

    const reduxState = useSelector(({advanceSalary, global, auth, remittance}) => {
        return {
            loading: advanceSalary.requestLoading || advanceSalary.verifyLoading || global.sendOtpLoading,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility,
            user: auth.user,
            dropDownValues: advanceSalary.dropDownValues,
            currencyInfo: remittance.helloPaisaGetCurrency,
            currentLocation: global.currentLocation,
            applyPromoCodeLoading: advanceSalary.applyPromoCodeLoading || advanceSalary.getPromoCodeAndOfferLoading,
        }
    });

    const {card, advanceSalaryDetails, currencyInfo, currentLocation, applyPromoCodeLoading} = reduxState;

    const [termsAndConditions, updateTermsAndConditions] = useState(false);
    const [userKYC, updateUserKYC] = useState(false);
    const [promo, setPromo] = useState('');
    const [promoError, setPromoError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(false);

    const verifyTokenRequest = (token, cardId) => {
        dispatch(verifyAdvanceSalary({token}, cardId, verifyAdvanceSalaryCallBack))
    };
    const verifyAdvanceSalaryCallBack = (res) => {
        if (res?.error) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: res?.data?.message || t('POPUPS.ERROR.TITLE'),
                text: t('ADVANCE_SALARY.REQUEST_FAIL_MESSAGE'),
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

    useEffect(() => {
        if(data?.token && data?.cardId){
            verifyTokenRequest(data?.token, data?.cardId)
        }
    }, [data]);

    const checkPromoCodeAndOffer = (promocode) => {
        if(advanceSalaryDetails){
            let advanceSalaryAmount = data?.advance;
            let feesObj = getAdvanceFees(advanceSalaryDetails?.feesBrackets, advanceSalaryAmount);
            let totalFees = Number(feesObj?.fees || 0) + Number(feesObj?.platformFee || 0);
            let payload = {
                amount: advanceSalaryAmount,
                totalFee: totalFees,
                walletID: card?.walletID,
                ...(promocode && {promocode: promocode}),
                transactionType: "ADVANCE_SALARY"
            };
            dispatch(getPromoAndOffer(payload, applyPromoCodeCallback));
        }
    };

    useEffect(() => {
        if(data?.module !== 'SNPL'){
            checkPromoCodeAndOffer(appliedPromo?.promoDetails?.promo || '')
        }
    }, []);

    const navigationReset = () => {
        Popup.hide();
        onReview();
        if(data?.module === 'SNPL') {
            navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
            });
        } else {
            navigation.reset({
                index: 0,
                routes: [{name: 'Advance_Salary'}],
            });
        }

    };

    const contactUs = () => {
        Popup.hide();
        openDialScreen();
        navigationReset();
    };

    const renderListItem = (label, value) => {
        return (
            <View style={Style.confirmInfoListItem}>
                <CText style={Style.confirmInfoListItemText}>
                    {label}
                </CText>
                <CText style={[Style.confirmInfoListItemText, Style.textRight]}>
                    {value}
                </CText>
            </View>
        )
    };


    const applyPromoFunc = (promocode) => {
        checkPromoCodeAndOffer(promocode);
    };

    const applyPromoCodeCallback = (res) => {
        if(!res?.error) {
            if(res?.data?.promoError) {
                setPromoError(res?.data?.promoError || '')
            }
            setAppliedPromo(res?.data)
        }
        else {
            setAppliedPromo(null)
        }
    };

    const applyPromo = () => {
        if(promo) {
            applyPromoFunc(promo)
        }
    };

    const removePromo = () => {
        applyPromoFunc('');
        setPromoError('');
        setPromo('');
    };

    const generateReceiverDetail = () => {
        let info = [];
        let obj = {
            ...(data && data),
        };

        if(obj?.firstReferenceFullName) {
            info.push({
                Name: `${obj?.firstReferenceRelation} ${t('FIELDS_LABELS.FULL_NAME')}`,
                value: obj?.firstReferenceFullName,
            });
        }
        if(obj?.firstReferencePhone) {
            info.push({
                Name: `${obj?.firstReferenceRelation} ${t('FIELDS_LABELS.PHONE_NUMBER')}`,
                value: `+${obj?.firstReferencePhone}`,
            });
        }

        if(obj?.localFriendFullName) {
            info.push({
                Name: `${obj?.localFriendRelation} ${t('FIELDS_LABELS.FULL_NAME')}`,
                value: obj?.localFriendFullName,
            });
        }
        if(obj?.localFriendPhone) {
            info.push({
                Name: `${obj?.localFriendRelation} ${t('FIELDS_LABELS.PHONE_NUMBER')}`,
                value: `+${obj?.localFriendPhone}`,
            });
        }

        return info
    };

    const getAdvanceSalaryPlatformFees = (amount) => {
        let feeBracket = getAdvanceFees(advanceSalaryDetails?.feesBrackets, amount);
        let platformFee = (feeBracket?.platformFee || 0) - (feeBracket?.platformFeeVat || 0);
        return amount ? platformFee : 0
    };
    const getAdvanceSalaryFees = (amount) => {
        let feeBracket = getAdvanceFees(advanceSalaryDetails?.feesBrackets, amount);
        let advanceSalaryFees = (feeBracket?.fees || 0) - (feeBracket?.vatAmount || 0);
        return amount ? advanceSalaryFees : 0
    };
    const getRemittanceFees = () => {
        return currencyInfo ? Number(currencyInfo?.totalFee) : 0
    };
    const getAdvanceSalaryVat = (amount) => {
        let feeBracket = getAdvanceFees(advanceSalaryDetails?.feesBrackets, amount);
        return amount ? (feeBracket?.vatAmount || 0) + (feeBracket?.platformFeeVat || 0) : 0;
    };
    const getRemittanceVat = () => {
        return currencyInfo ? Number(currencyInfo?.totalVat) : 0
    };
    const getTotalVat = (amount) => {
        return getAdvanceSalaryVat(amount) + getRemittanceVat()
    };
    const getTransferAmount = (amount) => {
        let totalFees = getRemittanceFees() + getAdvanceSalaryFees(amount) + getAdvanceSalaryPlatformFees(amount);
        let totalVat = getTotalVat(amount);
        return amount ? amount - (totalFees + totalVat) : 0;

    };

    const generateTransferAmountAndCharges = () => {
        let info = [];

        let obj = {
            ...(data && data),
            ...(reduxState?.advanceSalaryDetails && reduxState?.advanceSalaryDetails)
        };

        let feeBracket = getAdvanceFees(obj?.feesBrackets, obj?.advance);

        if(data?.module !== 'SNPL') {
            if(obj?.advance) {
                info.push({
                    Name: t('ADVANCE_SALARY.ADVANCE_AMOUNT'),
                    value: formatAmount(obj?.advance, 'AED')
                });
            }
            if(feeBracket?.platformFee) {
                info.push({
                    Name: t('RECEIPT.PLATFORM_FEE'),
                    value: formatAmount(feeBracket?.platformFee - feeBracket?.platformFeeVat, 'AED')
                });
            }
            if(feeBracket?.fees) {
                info.push({
                    Name: t('RECEIPT.PROCESSING_FEES'),
                    value: formatAmount(feeBracket?.fees - feeBracket?.vatAmount, 'AED')
                });
            }
            if(feeBracket?.vatAmount){
                info.push({
                    Name: t('RECEIPT.VAT'),
                    value: formatAmount(feeBracket?.vatAmount + feeBracket?.platformFeeVat, 'AED')
                });
            }

            if(appliedPromo && appliedPromo?.promoDetails?.promo){
                info.push({
                    Name: t('RECEIPT.PROMO_CODE'),
                    value: appliedPromo?.promoDetails?.promo
                });
            }

            // if(appliedPromo?.offerDetails?.title){
            //     info.push({
            //         Name: t('RECEIPT.OFFER'),
            //         value: appliedPromo?.offerDetails?.title
            //     });
            // }

            if(appliedPromo?.mode && appliedPromo?.discountAmount) {
                info.push({
                    Name: t(`RECEIPT.${appliedPromo?.mode}`),
                    value: `${appliedPromo?.mode === 'DISCOUNT' ? '-' : ''} ${formatAmount(appliedPromo?.discountAmount)} AED` || 0
                })
            }

        } else {
            if(obj?.advance) {
                info.push({
                    Name: t('RECEIPT.TRANSFER_AMOUNT'),
                    value: formatAmount(getTransferAmount(obj?.advance), 'AED')
                });
                info.push({
                    Name: t('RECEIPT.PLATFORM_FEE'),
                    value: formatAmount(getAdvanceSalaryPlatformFees(obj?.advance), 'AED')
                });
                info.push({
                    Name: t('RECEIPT.ADVANCE_SALARY_FESS'),
                    value: formatAmount(getAdvanceSalaryFees(obj?.advance), 'AED')
                });
                info.push({
                    Name: t('RECEIPT.REMITTANCE_CHARGERS'),
                    value: formatAmount(getRemittanceFees(obj?.advance), 'AED')
                });
                info.push({
                    Name: t('RECEIPT.VAT'),
                    value: formatAmount(getTotalVat(obj?.advance), 'AED')
                });
                info.push({
                    Name: t('RECEIPT.TOTAL_AMOUNT'),
                    value: formatAmount(obj?.advance, 'AED')
                });
            }
        }
        return info
    };

    const submit = () => {
        updateTermsAndConditions(true)
    };

    const requestAdvanceSalaryFunc = () => {
        checkCardStatus(t, reduxState?.card, () => {
            let updatedData  = _.omit(data, ['anyMonthlyLiability', 'advance', 'module']);
            let payload = {
                cardId: reduxState.card._id,
                amount: data?.advance,
                ...(appliedPromo?.promoDetails?.promo && {
                    promocode: appliedPromo?.promoDetails?.promo
                }),
                coordinates: [currentLocation?.longitude, currentLocation?.latitude],
                ...updatedData,
            };
            dispatch(requestAdvanceSalary(payload, (response) => {
                navigation.navigate('advance_salary_otp', {
                    token: response?.data?.token,
                    cardId: reduxState?.card?._id,
                    screen: 'advance_salary_request_overview',
                    ...data
                })
            }))
        });
    };

    const renderHeader = () => {
        return (
            <View style={Style.confirmHeader}>
                <ProgressiveImage style={Style.confirmHeaderImage}
                                  source={require('../../assets/images/advance_salary_request_submitted.png')}
                />
                <CText style={Style.confirmHeaderTitle}>
                    {data?.module === 'SNPL' ? t('PAGE_TITLE.SNPL') : t('PAGE_TITLE.ADVANCE_SALARY')}
                </CText>
            </View>
        )
    };

    const gteFooterBottomSpace = (val) => {
        return val ? val : 30
    };

    const renderFooter = () => {
        return (
            <View style={[Style.grayBottomButtonContainer, {paddingBottom: gteFooterBottomSpace(insets.bottom)}]}>
                <CButton buttonStyle={Style.bottomButton}
                         disabled={reduxState?.loading || applyPromoCodeLoading}
                         loading={reduxState.loading}
                         onPress={() => submit()}
                         title={t('GLOBAL.NEXT')}/>
            </View>
        )
    };

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            loading={reduxState.loading}
            headerProps={headerProps}
            scrollView={true}
            scrollViewProps={{
                contentContainerStyle: {flexGrow: 1}
            }}
        >

            <KeyboardView contentContainerStyle={{flexGrow: 1}}>
                {renderHeader()}
                <View style={Style.confirmInfoScrollView}>

                        <CText style={Style.confirmInfoListHeaderText}>
                            {t('RECEIPT.DETAILS_AND_INFORMATION')}
                        </CText>

                        <MappedElement
                            data={generateReceiverDetail()}
                            renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                        <View style={Style.confirmInfoListNormalSeparator}/>

                        {data?.module !== 'SNPL' && appliedPromo?.offerDetails?.title ? <AlertView viewStyle={{marginTop: 10, marginBottom: 10}}
                                                                                    text={appliedPromo?.offerDetails?.title}
                                                                                    type='offers' /> : null}

                        <CText style={Style.confirmInfoListHeaderText}>
                            {data?.module === 'SNPL' ? t('RECEIPT.TRANSFER_AMOUNT_AND_CHARGES') : t('RECEIPT.ADVANCE_SALARY_AND_CHARGES')}
                        </CText>

                        <MappedElement
                            data={generateTransferAmountAndCharges()}
                            renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                        <CInput
                            isShow={data?.module !== 'SNPL'}
                            inputLabel={t('FIELDS_LABELS.DISCOUNT_CODE')}
                            inputContainerStyle={{
                                marginBottom: 5,
                                marginTop: 20
                            }}
                            placeholder={t('FIELDS_LABELS.DISCOUNT_CODE_PLACEHOLDER')}
                            value={promo}
                            onChangeText={val => {
                                setPromoError('');
                                setPromo(val)
                            }}
                            editable={!applyPromoCodeLoading && !appliedPromo?.promoDetails?.promo}
                            error={promoError}
                            onBlur={() => {
                                appliedPromo?.promoDetails?.promo ? removePromo() : applyPromo()
                            }}
                            rightButton={() => {
                                return (
                                    <CButton
                                        buttonStyle={GlobalStyle.inputRightButton}
                                        buttonText={GlobalStyle.inputRightButtonText}
                                        disabled={applyPromoCodeLoading}
                                        title={applyPromoCodeLoading ? '' : appliedPromo?.promoDetails?.promo ? t('GLOBAL.REMOVE') : t('GLOBAL.APPLY')}
                                        loading={applyPromoCodeLoading}
                                        onPress={() => appliedPromo?.promoDetails?.promo ? removePromo() : applyPromo()}
                                    />
                                )
                            }}
                            onSubmitEditing={() => appliedPromo?.promoDetails?.promo ? removePromo() : applyPromo()}
                        />

                    </View>
                {renderFooter()}
            </KeyboardView>

            <TermsAndConditions
                isOpen={termsAndConditions}
                type={"ADVANCED_SALARY_TERMS_AND_CONDITION"}
                close={(type) => {
                    updateTermsAndConditions(!termsAndConditions);
                    if(type === 'SUBMIT') {
                        updateUserKYC(true);
                    }
                }}
            />

            <UserKYC
                isOpen={userKYC}
                type={"ADVANCED_SALARY_USER_KYC"}
                close={(type) => {
                    updateUserKYC(!userKYC);
                    if(type === 'SUBMIT') {
                        requestAdvanceSalaryFunc()
                    }
                }}
            />

            <ScratchCard ref={ScratchCardRef} goBack={false} close={() => navigationReset()} />

        </Container>
    )
}

export default React.memo(Overview)
