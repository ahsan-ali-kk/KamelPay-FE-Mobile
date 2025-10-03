import React, {useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {Container, Signature} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {CButton, CText, ProgressiveImage, CInput, AlertView} from "../../uiComponents";
import {
    formatAmount,
    getPersonalLoanFees,
    MappedElement,
    openDialScreen
} from "../../utils/methods";
import {useTranslation} from "react-i18next";
import UserKYC from "../../containers/termsAndConditions/TermsAndConditions";
import Popup from "../../uiComponents/popup/Popup";
import {checkCardStatus} from "../home/Home";
import Style from "../topUp/TopUp.style";
import KeyboardView from '../../containers/KeyboardView';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import ScratchCard from "../scratchCards/ScratchCard";
import {useAppReview} from "../../hooks";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {getPersonalLoanPromoAndOffer, requestPersonalLoan, verifyPersonalLoan} from "../../store/actions/PersonalLoan.action";
import * as RNFS from "react-native-fs";
import {filterBracket, renderInstallmentCount} from "./helper";
import RepaymentSchedule from "./RepaymentSchedule";
import moment from "moment";
import CoolingOffPopup from "./CoolingOffPopup";

export const feeType = ['OneTime', 'Monthly', 'Both'];

function Overview(props) {

    const { t } = useTranslation();
    const ScratchCardRef = useRef();
    const { onReview } = useAppReview();
    const insets = useSafeAreaInsets();

    const { route: { params: data }, navigation } = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t("PAGE_TITLE.CONFIRMATION"),
        headerRight: true,
    };

    const reduxState = useSelector(({global, auth, remittance, personalLoan}) => {
        return {
            loading: personalLoan.requestLoading || personalLoan.verifyLoading || global.sendOtpLoading,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
            personalLoanEligibility: personalLoan.personalLoanEligibility,
            user: auth.user,
            currencyInfo: remittance.helloPaisaGetCurrency,
            currentLocation: global.currentLocation,
            applyPromoCodeLoading: personalLoan.applyPromoCodeLoading || personalLoan.getPersonalLoanPromoCodeAndOfferLoading,
        }
    });

    const {card, currencyInfo, currentLocation, applyPromoCodeLoading} = reduxState;

    const [userSignature, updateUserSignature] = useState(false);
    const [userApplicationForm, updateUserApplicationForm] = useState(false);
    const [userKYC, updateUserKYC] = useState(false);
    const [promo, setPromo] = useState('');
    const [promoError, setPromoError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(false);
    const [termsAndConditions, updateTermsAndConditions] = useState(false);
    const [personalLoanEligibility, setPersonalLoanEligibility] = useState({})
    const [acceptCollingPeriod, setAcceptCollingPeriod] = useState(true)

    useEffect(() => {
        let eligibleAmount = data?.selectedInstallment?.amount;
        let noInstallment = data?.selectedInstallment?.noOfInstallment;
        let feeBrackets = filterBracket(reduxState?.personalLoanEligibility?.feeBrackets, eligibleAmount, noInstallment);
        let personalLoanEligibility = {
            ...reduxState?.personalLoanEligibility,
            noOfInstallment: noInstallment,
            amount: (eligibleAmount - (feeBrackets?.maxMonthlyProcessingFee || 0)).toFixed(0),
            feeBrackets: feeBrackets?.filteredBrackets
        }
        setPersonalLoanEligibility(personalLoanEligibility)
    }, [reduxState?.personalLoanEligibility])

    const verifyTokenRequest = (token, cardId) => {
        dispatch(verifyPersonalLoan({token}, cardId, verifyPersonalLoanCallBack))
    };

    const verifyPersonalLoanCallBack = (res) => {
        if (res?.error) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: res?.data?.message || t('POPUPS.ERROR.TITLE'),
                text: t('PERSONAL_LOAN.REQUEST_FAIL_MESSAGE'),
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
        if(personalLoanEligibility){
            let personalLoanAmount = data?.amount;
            let feesObj = getPersonalLoanFees(personalLoanEligibility?.feeBrackets, personalLoanAmount);
            let totalFees = Number(feesObj?.ProcessingFeesOneTime || 0) + Number(feesObj?.PlatformFee || 0);
            let payload = {
                amount: personalLoanAmount,
                totalFee: totalFees,
                walletID: card?.walletID,
                ...(promocode && {promocode: promocode}),
                transactionType: "PERSONAL_LOAN"
            };
            dispatch(getPersonalLoanPromoAndOffer(payload, applyPromoCodeCallback));
        }
    };

    useEffect(() => {
        checkPromoCodeAndOffer(appliedPromo?.promoDetails?.promo || '')
    }, []);

    const navigationReset = () => {
        Popup.hide();
        onReview();

        navigation.reset({
            index: 0,
            routes: [{name: 'Personal_Loan'}],
        });

    };

    const contactUs = () => {
        Popup.hide();
        openDialScreen();
        navigationReset();
    };

    const renderListItem = (label, value, i, obj) => {
        return (
            <View key={i} style={Style.confirmInfoListItem}>
                <CText style={[Style.confirmInfoListItemText, obj?.isBold && Style.textBold]}>
                    {label}
                </CText>
                <CText style={[Style.confirmInfoListItemText, Style.textRight, obj?.isBold && Style.textBold]}>
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

        info.push({
            Name: t('VALIDATION.LIABILITIES.LABEL'),
            value: formatAmount(obj?.liability ? obj?.liability : "0", 'AED'),
        });

        info.push({
            Name: t('VALIDATION.EDUCATION_EXPENSE.LABEL'),
            value: formatAmount(obj?.educationExpense ? obj?.educationExpense : 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.HEALTH_CARE_EXPENSE.LABEL'),
            value: formatAmount(obj?.healthcareExpense ? obj?.healthcareExpense : 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.MAINTENANCE_SUPPORT.LABEL'),
            value: formatAmount(obj?.maintenanceSupport ? obj?.maintenanceSupport : 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.HOUSING_RENT.LABEL'),
            value: formatAmount(obj?.housingRent ? obj?.housingRent : 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.FOOD_EXPENSE.LABEL'),
            value: formatAmount(obj?.foodExpense ? obj?.foodExpense : 0, 'AED'),
        });

        info.push({
            Name: t('VALIDATION.UTILITY_COST.LABEL'),
            value: formatAmount(obj?.utilityCost ? obj?.utilityCost : 0, 'AED'),
        });

        return info
    };

    const getRepaymentSchedule = () => {
        let feeBracket = getPersonalLoanFees(personalLoanEligibility?.feeBrackets, data?.amount);
        return {
            feeBracket,
            noOfInstallment: feeBracket?.NoOfInstallment,
            amount: data?.amount,
            date: moment(),
        }
    }

    const generateTransferAmountAndCharges = () => {
        let info = [];

        let obj = {
            ...(personalLoanEligibility && personalLoanEligibility),
            ...(data && data),
            ...(reduxState?.currentCountry && {country: reduxState?.currentCountry}),
        };

        let feeBracket = getPersonalLoanFees(obj?.feeBrackets, obj?.amount);
        let receiverCurrency = Object.keys(obj?.country?.currencies);

        let totalFee = Number(feeBracket?.ProcessingFeesOneTime || 0);
        let totalVat = Number(feeBracket?.ProcessingFeesOneTimeVat || 0);

        let totalPlatformFees = Number(feeBracket?.PlatformFee || 0);
        let totalPlatformFeeVat = Number(feeBracket?.PlatformFeeVat || 0);
        let totalPlatformFeesAndVat = totalPlatformFees + totalPlatformFeeVat;

        let totalFeeMonthly = Number(feeBracket?.MonthlyProcessingFee || 0);
        // let totalFeeMonthly = Number(feeBracket?.MonthlyProcessingFee || 0);

        let financeAmount = Number(obj?.amount);
        let noOfInstallment = Number(feeBracket?.NoOfInstallment);

        let monthlyPayment = Number(financeAmount/noOfInstallment);
        let monthlyProfit = Number(totalFeeMonthly/noOfInstallment);
        let totalMonthlyPayment = Number(monthlyPayment+monthlyProfit);
        let totalPaymentDueOnSalaryDate = Number(financeAmount);
        let profit = Number(totalFeeMonthly);
        let totalPaymentDueToday = profit;

        if(feeBracket?.NoOfInstallment == 1){
            totalPaymentDueOnSalaryDate += totalPaymentDueToday;
            totalPaymentDueToday = totalFee + totalVat;
        }

        if(feeBracket?.NoOfInstallment) {
            info.push({
                Name: 'Tenure',
                value: renderInstallmentCount(feeBracket?.NoOfInstallment)
            });
        }

        if(obj?.amount) {
            info.push({
                Name: t('PERSONAL_LOAN.PERSONAL_LOAN_AMOUNT'),
                value: formatAmount(obj?.amount, 'AED')
            });
        }

        if(feeBracket?.NoOfInstallment == 1){
            info.push({
                Name: "Profit",
                value: formatAmount(profit, receiverCurrency)
            });
        }

        if(totalFee){
            info.push({
                Name: "Processing Fees + VAT",
                value: formatAmount(totalFee + totalVat, receiverCurrency)
            });
        }

        if(feeBracket?.NoOfInstallment != 1) {
            info.push({
                isBold: true,
                Name: 'Total Monthly Payment On Salary Date',
                value: formatAmount(totalMonthlyPayment || 0, receiverCurrency)
            });
        }

        if(feeBracket?.NoOfInstallment == 1) {
            info.push({
                isBold: true,
                Name: 'Total Payment Due On Salary Date',
                value: formatAmount(totalPaymentDueOnSalaryDate || 0, receiverCurrency)
            });
            if(totalPaymentDueToday){
                info.push({
                    isBold: true,
                    Name: 'Total Payment Due Today',
                    value: formatAmount(totalPaymentDueToday || 0, receiverCurrency)
                });
            }
        }

        if(appliedPromo && appliedPromo?.promoDetails?.promo){
            info.push({
                Name: t('RECEIPT.PROMO_CODE'),
                value: appliedPromo?.promoDetails?.promo
            });
        }

        if(appliedPromo?.mode && appliedPromo?.discountAmount) {
            info.push({
                Name: t(`RECEIPT.${appliedPromo?.mode}`),
                value: formatAmount((appliedPromo?.discountAmount || 0), receiverCurrency)
            })
        }

        return info
    };

    const submit = () => {
        Popup.show({
                title: "Confirmation",
                text: "I/we hereby confirm that the information contained in this application is true and complete to the best of my/our knowledge and belief.",
                actions: [
                    {
                        text: t('GLOBAL.CONFIRM'),
                        callback: () => {
                            Popup.hide();
                            updateUserKYC(true)
                        }
                    },
                ]
            })
    };

    const collingOffPeriod = () => {
        Popup.show({
            type: 'customView',
            customView: () => <CoolingOffPopup onConfirm={(value) => {
                console.log("User accepted:", value);
                Popup.hide();
                setAcceptCollingPeriod(value)
                updateUserSignature(true);
                // handle your result here
            }} />,
            actions: []
        })
    };

    const getTotalProfit = () => {

      let totalProfit = 0;

        let feeBracket = getPersonalLoanFees(personalLoanEligibility?.feeBrackets, data?.amount);

        let totalFee = Number(feeBracket?.ProcessingFeesOneTime || 0);
        let totalVat = Number(feeBracket?.ProcessingFeesOneTimeVat || 0);
        let totalPlatformFees = Number(feeBracket?.PlatformFee || 0);
        let totalPlatformFeeVat = Number(feeBracket?.PlatformFeeVat || 0);
        // let totalFeeMonthly = Number(feeBracket?.MonthlyProcessingFee || 0) + Number(feeBracket?.MonthlyProcessingFeeVat || 0);
        let totalFeeMonthly = Number(feeBracket?.MonthlyProcessingFee || 0);


        if(feeBracket?.Type === feeType[0] || feeBracket?.Type === feeType[2]) {
            totalProfit += (totalFee)
        }

        // if(totalPlatformFees || totalPlatformFeeVat) {
        //     totalProfit += (totalPlatformFees + totalPlatformFeeVat)
        // }

        if(feeBracket?.Type === feeType[1] || feeBracket?.Type === feeType[2]) {
            totalProfit += (totalFeeMonthly || 0)
        }

        return {
            noOfInstallment: feeBracket?.NoOfInstallment,
            profit: totalProfit
        }
    };

    const requestPersonalLoanFunc = (signature) => {

        checkCardStatus(t, reduxState?.card, async () => {

            const cleanedSignature = signature.replace(/^data:image\/png;base64,/, '');

            const filePath = `${RNFS.DocumentDirectoryPath}/signature_${Date.now()}.png`; // Set file path
            await RNFS.writeFile(filePath, cleanedSignature, 'base64'); // Write Base64 data as an image file

            const formData = new FormData();

            formData.append('signature', {
                uri: `file://${filePath}`,
                name: 'signature.png', // File name
                type: 'image/png', // File type
            });

            formData.append('cardId', reduxState.card._id);

            if(appliedPromo?.promoDetails?.promo){
                formData.append('promocode', appliedPromo?.promoDetails?.promo);
            }

            formData.append('coordinates', JSON.stringify([currentLocation?.longitude, currentLocation?.latitude]));
            formData.append('amount', data?.amount);
            formData.append('noOfInstallment', data?.selectedInstallment?.noOfInstallment);
            formData.append('firstReferenceFullName', data?.firstReferenceFullName);
            formData.append('firstReferencePhone', data?.firstReferencePhone);
            formData.append('firstReferenceRelation', data?.firstReferenceRelation);
            formData.append('localFriendFullName', data?.localFriendFullName);
            formData.append('localFriendPhone', data?.localFriendPhone);
            formData.append('localFriendRelation', data?.localFriendRelation);
            formData.append('type', data?.type);

            formData.append('liability', data?.anyMonthlyLiability && data?.liability ? Number(data?.liability) : 0);
            formData.append('educationExpense', data?.educationExpense ? Number(data?.educationExpense) : 0);
            formData.append('healthcareExpense', data?.healthcareExpense ? Number(data?.healthcareExpense) : 0);
            formData.append('maintenanceSupport', data?.maintenanceSupport ? Number(data?.maintenanceSupport) : 0);
            formData.append('housingRent', data?.housingRent ? Number(data?.housingRent) : 0);
            formData.append('foodExpense', data?.foodExpense ? Number(data?.foodExpense) : 0);
            formData.append('utilityCost', data?.utilityCost ? Number(data?.utilityCost) : 0);
            formData.append('isCoolingOfPeriod', acceptCollingPeriod);

            dispatch(requestPersonalLoan(formData, (response) => {
                navigation.navigate('personal_loan_otp', {
                    token: response?.data?.token,
                    cardId: reduxState?.card?._id,
                    screen: 'personal_loan_request_overview',
                    isGoBack: true,
                    ...data
                })
            }, {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
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
                    {t('PAGE_TITLE.PERSONAL_LOAN')}
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
                contentContainerStyle: {
                    flexGrow: 1
                }
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

                        {appliedPromo?.offerDetails?.title ? <AlertView viewStyle={{marginTop: 10, marginBottom: 10}}
                                                                                    text={appliedPromo?.offerDetails?.title}
                                                                                    type='offers' /> : null}

                        <RepaymentSchedule data={getRepaymentSchedule()}/>

                    {getRepaymentSchedule()?.noOfInstallment !== 1 ? <View style={Style.confirmInfoListNormalSeparator}/> : null}

                        <CText style={Style.confirmInfoListHeaderText}>
                            {t('RECEIPT.PERSONAL_LOAN_AND_CHARGES')}
                        </CText>

                        <MappedElement
                            data={generateTransferAmountAndCharges()}
                            renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i, obj)}/>

                        <CInput
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

            <UserKYC
                isOpen={userKYC}
                type={"PERSONAL_LOAN_USER_KYC"}
                close={(type) => {
                    updateUserKYC(!userKYC);
                    if(type === 'SUBMIT') {
                        updateUserApplicationForm(true);
                    }
                }}
            />
            <UserKYC
                isOpen={userApplicationForm}
                type={"PERSONAL_LOAN_APPLICATION"}
                data={{...data, ...getTotalProfit()}}
                close={(type) => {
                    updateUserApplicationForm(!userApplicationForm);
                    if(type === 'SUBMIT') {
                        updateTermsAndConditions(true);
                    } else {
                        updateUserKYC(true);
                    }
                }}
            />
            <UserKYC
                isOpen={termsAndConditions}
                type={"PERSONAL_LOAN_TERMS_AND_CONDITION"}
                close={(type) => {
                    updateTermsAndConditions(!termsAndConditions);
                    if(type === 'SUBMIT') {
                        collingOffPeriod();
                    }  else {
                        updateUserApplicationForm(true);
                    }
                }}
            />

            <Signature
                isOpen={userSignature}
                close={(type, signature) => {
                    updateUserSignature(!userSignature);
                    if(type === 'SUBMIT' && signature) {
                        requestPersonalLoanFunc(signature)
                    } else {
                        updateTermsAndConditions(true);
                    }
                }}
            />

            <ScratchCard ref={ScratchCardRef} goBack={false} close={() => navigationReset()} />

        </Container>
    )
}

export default React.memo(Overview)
