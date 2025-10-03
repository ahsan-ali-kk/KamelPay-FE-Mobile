import React from "react";
import {View} from "react-native";
import {Container} from "../../containers";
import {CText, ProgressiveImage} from "../../uiComponents";
import {useSelector} from "react-redux";
import Styles from "./PersonalLoan.style";
import {useTranslation} from "react-i18next";
import Request from './request/Request';

function PersonalLoan(props) {

    const { t } = useTranslation();
    const {route: { params: data }} = props;

    const reduxState = useSelector(({auth, global, personalLoan}) => {
        return {
            data: [],
            loading: false,
            personalLoanEligibility: personalLoan.personalLoanEligibility
        }
    });

    const headerProps = {
        headerTitle: t('PAGE_TITLE.PERSONAL_LOAN'),
        headerRight: true,
    };

    const { personalLoanEligibility } = reduxState;

    if(personalLoanEligibility?.isEligible) {
        return <Request params={data} />;
    }

    return (
        <Container
            loading={reduxState.loading}
            headerProps={headerProps}>
            {personalLoanEligibility?.status === 'Pending' ? <View style={Styles.submittedSection}>
                <ProgressiveImage
                    style={Styles.submittedSectionVector}
                    source={require('../../assets/images/advance_salary_request_submitted.png')}
                />
                <CText style={Styles.submittedSectionTitle}>
                    {t('PAGE_TITLE.PERSONAL_LOAN')}
                </CText>
                <CText style={Styles.submittedSectionSubTitle}>
                    {personalLoanEligibility?.message}
                </CText>
            </View> : null}
        </Container>
    )
}

export default React.memo(PersonalLoan)
