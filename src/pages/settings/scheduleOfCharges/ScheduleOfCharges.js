import React from 'react';
import {Container} from "../../../containers";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import Styles from "./ScheduleOfCharges.style";
import {MappedElement} from "../../../utils/methods";
import {CText} from "../../../uiComponents";

function ScheduleOfCharges() {

    const { t } = useTranslation();

    const reduxState = useSelector(({auth, referral, global}) => {
        return {
            user: auth.user,
            masterDetails: global.masterDetails,
            getMasterDetailLoading: global.getMasterDetailLoading,
        }
    });

    const {masterDetails, getMasterDetailLoading} = reduxState;


    const headerProps = {
        headerTitle: 'Schedule Of Charges',
        headerRight: true,
    };


    const renderTableHeader = (item, index) => {
        return (
            <View style={[
                Styles.tableInnerHeader,
                index === 0 && Styles.borderLeft,
                index === 0 ? Styles.flex_06 : Styles.flex_02,
            ]} key={index}>
                <CText style={[Styles.tableInnerHeaderText, Styles.textBold]}>{item}</CText>
            </View>
        )
    };

    const renderTableContent = (item, index) => {
        return (
            <View style={[Styles.tableInnerBodyRow, Styles.borderLeft, Styles.borderTop]} key={index}>
                <View style={[Styles.tableInnerHeader, Styles.flex_06]}>
                    <CText style={Styles.tableInnerHeaderText}>{item?.transactionType}</CText>
                </View>
                <View style={[Styles.tableInnerHeader, Styles.flex_02]}>
                    <CText style={Styles.tableInnerHeaderText}>{item?.payD}</CText>
                </View>
                <View style={[Styles.tableInnerHeader, Styles.flex_02]}>
                    <CText style={Styles.tableInnerHeaderText}>{item?.centiV}</CText>
                </View>
            </View>
        )
    };

    const renderTable = (item, index) => {
      return (
          <View style={Styles.tableContainer} key={index}>
              <View style={[Styles.tableHeader, index === 0 && Styles.borderTop]}>
                  <CText style={Styles.tableHeaderText}>{item?.title}</CText>
              </View>
              <View style={Styles.tableBody}>
                  <View style={Styles.tableInnerHeaderContainer}>
                      <MappedElement
                          data={item?.header}
                          renderElement={renderTableHeader}
                      />
                  </View>
                  <View style={Styles.tableInnerBodyContainer}>
                    <MappedElement
                          data={item?.data}
                          renderElement={renderTableContent}
                      />
                  </View>
              </View>
          </View>
      )
    };

    return (
        <Container headerProps={headerProps} edges={['left', 'right', 'bottom']}
                   scrollView={true}
                   scrollViewProps={{
                       contentContainerStyle: Styles.container,
                   }}
                   loading={getMasterDetailLoading}>

            <MappedElement
                data={masterDetails?.scheduleOfCharges || []}
                renderElement={renderTable}
            />

        </Container>
    )
}

export default React.memo(ScheduleOfCharges);
