import React from "react";
import {View} from "react-native";
import {Container} from "../../containers";
import {CText, ProgressiveImage} from "../../uiComponents";
import {useSelector} from "react-redux";
import Styles from "./AdvanceSalary.style";
import {useTranslation} from "react-i18next";
import Request from './request/Request';

function AdvanceSalary(props) {

    const { t } = useTranslation();
    const {route: { params: data }} = props;

    const reduxState = useSelector(({auth, global, advanceSalary}) => {
        return {
            data: [],
            loading: false,
            card: global.selectedCard,
            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility
        }
    });

    const headerProps = {
        headerTitle: t('PAGE_TITLE.ADVANCE_SALARY'),
        headerRight: true,
    };

    const { card, advanceSalaryDetails } = reduxState;

    if(advanceSalaryDetails?.status === "01") {
        return <Request params={data} />;
    }

    return (
        <Container
            loading={reduxState.loading}
            headerProps={headerProps}>
            {advanceSalaryDetails?.status === "03" || advanceSalaryDetails?.status === "04" ?  <View style={Styles.submittedSection}>
                <ProgressiveImage
                    style={Styles.submittedSectionVector}
                    source={require('../../assets/images/advance_salary_request_submitted.png')}
                />
                <CText style={Styles.submittedSectionTitle}>
                    {advanceSalaryDetails?.status === "03" ? t('ADVANCE_SALARY.REQUESTED_SUBMITTED_SUCCESSFULLY') : null}
                    {advanceSalaryDetails?.status === "04" ? t('GLOBAL.DUE_DATE') : null}
                </CText>
                <CText style={Styles.submittedSectionSubTitle}>
                    {advanceSalaryDetails?.notEligibleReason}
                </CText>
            </View> : null}
        </Container>
    )
}

export default React.memo(AdvanceSalary)
