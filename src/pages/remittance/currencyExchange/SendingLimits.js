import React from "react";
import {TouchableOpacity, View} from "react-native";
import {CText, CModal} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import Styles from "./CurrencyExchange.style";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";

function SendingLimits(props) {
    const { t, i18n } = useTranslation();

    const {onClose, isOpen} = props;

    return (
        <CModal centerView={true}
                isOpen={isOpen} close={() => onClose()}>
            <View style={[ GlobalStyle.centerModalCenterViewContainerScroll, {marginVertical: 30} ]}>
                <View style={GlobalStyle.centerModalCenterViewContainer}>

                    <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => onClose()}>
                        <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                    </TouchableOpacity>

                    <CText style={GlobalStyle.centerModalCenterViewTitle}>
                        Receiving Limits as per JazzCash and EasyPaisa accounts
                    </CText>

                    <CText style={Styles.sendingLimitContainerSubTitle}>
                        Please note when sending money to JazzCash or EasyPaisa make sure the receiver has enough receiving limits
                    </CText>

                    <View style={Styles.sendingLimitContainer}>
                        <CText style={Styles.sendingLimitContainerTitle}>EasyPaisa</CText>
                        <View style={Styles.sendingLimitContainerList}>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={Styles.sendingLimitContainerListItemTitle}>
                                    Level 0
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemTitle}>
                                    Level 1
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemTitle}>
                                    Asaan Digital Account
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={[Styles.sendingLimitContainerListItemTitle, {flex: 0}]}>
                                    Daily
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 25,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 50,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 1,000,000
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={[Styles.sendingLimitContainerListItemTitle, {flex: 0}]}>
                                    Monthly
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 50,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 200,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 1,000,000
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={[Styles.sendingLimitContainerListItemTitle, {flex: 0}]}>
                                    Yearly
                                </CText>
                            </View>
                            <View style={[Styles.sendingLimitContainerListItem, Styles.borderNone]}>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 200,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 2,400,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 12,000,000
                                </CText>
                            </View>

                        </View>
                    </View>
                    <View style={Styles.sendingLimitContainer}>
                        <CText style={Styles.sendingLimitContainerTitle}>JazzCash</CText>
                        <View style={Styles.sendingLimitContainerList}>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={Styles.sendingLimitContainerListItemTitle}>
                                    Level 0
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemTitle}>
                                    Level 1
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemTitle}>
                                    Level 2
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={[Styles.sendingLimitContainerListItemTitle, {flex: 0}]}>
                                    Daily
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 25,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 50,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 400,000
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={[Styles.sendingLimitContainerListItemTitle, {flex: 0}]}>
                                    Monthly
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 50,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 200,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 500,000
                                </CText>
                            </View>
                            <View style={Styles.sendingLimitContainerListItem}>
                                <CText style={[Styles.sendingLimitContainerListItemTitle, {flex: 0}]}>
                                    Yearly
                                </CText>
                            </View>
                            <View style={[Styles.sendingLimitContainerListItem, Styles.borderNone]}>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 200,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 1,200,000
                                </CText>
                                <CText style={Styles.sendingLimitContainerListItemValue}>
                                    Rs. 6,000,000
                                </CText>
                            </View>
                        </View>
                    </View>

           </View>
           </View>
        </CModal>
    )
}

export default React.memo(SendingLimits)
