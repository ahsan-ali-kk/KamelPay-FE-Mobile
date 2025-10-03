import React from "react";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Form from "./Form";
import {checkPersonalFinancePreEligibility} from "../../../store/actions/PersonalLoan.action";
import Popup from "../../../uiComponents/popup/Popup";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {View} from "react-native";
import TopupStyle from "../../topUp/TopUp.style";
import TenuresSelection from "../tenuresSelection/TenuresSelection";
import Styles from "../PersonalLoan.style";
import {CText, ProgressiveImage} from "../../../uiComponents";

function AdditionalQuestion(props) {

    const {route: {params: requestPayload}} = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PERSONAL_LOAN.REQUEST_PAGE_TITLE'),
        headerRight: true,
    };

    const reduxState = useSelector(({auth, global,  personalLoan}) => {
        return {
            loading: personalLoan.requestLoading || global.sendOtpLoading,
            checkPreEligibilityLoading: personalLoan?.checkPreEligibilityLoading,
            card: global.selectedCard,
            user: auth.user,
            currentCountry: global.currentCountry,
            personalLoanEligibility: personalLoan.personalLoanEligibility,
        }
    });

    const { personalLoanEligibility } = reduxState;

    const checkPersonalFinancePreEligibilityCallBack = (res, values, feeBrackets) => {
        if (!res?.isEligible) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: res?.message || t('POPUPS.ERROR.TITLE'),
                text: t('ADVANCE_SALARY.REQUEST_FAIL_MESSAGE'),
                actions: [
                    {
                        text: t('GLOBAL.CANCEL'),
                        callback: () => Popup.hide()
                    }
                ]
            })
        } else {
            Popup.show({
                isVisible: true,
                styleMainContainer: GlobalStyle.paddingHorizontal_0,
                styleContainer: GlobalStyle.bottomHalfModal,
                viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
                type: 'customView',
                showClose: false,
                edges: ['top', 'left', 'right'],
                customView: () => {
                    return (
                        <View style={[TopupStyle.shortInfoModalContainer, {alignItems: 'stretch'}]}>
                            <TenuresSelection
                                amount={res?.eligibleAmount}
                                tenure={res?.brackets || []}
                                nextPayloadObj={values}
                                feeBrackets={feeBrackets}
                            />
                        </View>
                    )
                },
                actions: [
                    {
                        text: t('GLOBAL.CLOSE'),
                        callback: () => Popup.hide()
                    }
                ]
            });
        }
    };

    const submit = (values) => {
        let lifeStyleExpense = Number(values?.educationExpense || 0);
        lifeStyleExpense += Number(values?.foodExpense || 0);
        lifeStyleExpense += Number(values?.healthcareExpense || 0);
        lifeStyleExpense += Number(values?.housingRent || 0);
        lifeStyleExpense += Number(values?.maintenanceSupport || 0);
        lifeStyleExpense += Number(values?.utilityCost || 0);

        let monthlyLiability = Number(values?.liability || 0);
        let averageSalary = Number(reduxState?.personalLoanEligibility?.averageSalary || 0);
        let personalLoanAmount = Number(reduxState?.personalLoanEligibility?.amount || 0);

        let feeBrackets = reduxState?.personalLoanEligibility?.feeBrackets || []

        dispatch(checkPersonalFinancePreEligibility({
            monthlyLiability,
            lifeStyleExpense,
            amount: personalLoanAmount,
            averageSalary: averageSalary,
            feeBrackets
        }, (res) => checkPersonalFinancePreEligibilityCallBack(res, values, feeBrackets)))
    };

    return (
        <Container loading={reduxState.loading} headerProps={headerProps}>
            {personalLoanEligibility?.status === 'Pending' ? <View style={Styles.submittedSection}>
                <ProgressiveImage
                    style={Styles.submittedSectionVector}
                    source={require('../../../assets/images/advance_salary_request_submitted.png')}
                />
                <CText style={Styles.submittedSectionTitle}>
                    {t('PAGE_TITLE.PERSONAL_LOAN')}
                </CText>
                <CText style={Styles.submittedSectionSubTitle}>
                    {personalLoanEligibility?.message}
                </CText>
            </View> :   <Form
                submit={submit}
                loading={reduxState.loading || reduxState.checkPreEligibilityLoading}
                currentCountry={reduxState?.currentCountry}
            />}
        </Container>
    )
}

export default React.memo(AdditionalQuestion)
