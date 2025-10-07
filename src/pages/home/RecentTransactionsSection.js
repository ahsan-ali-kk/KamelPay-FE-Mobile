import React, {memo} from 'react';
import {View} from 'react-native';
import Styles from "./Home.style";
import {useSelector} from "react-redux";
import {CText, CButton} from "../../uiComponents";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {checkUserAndCardStatus} from "./Home";

function RecentTransactionsSection(props) {

    const { t } = useTranslation();
    const {style} = props;
    const navigation = useNavigation();

    const reduxState = useSelector(({auth, global, transactionHistory, userSubscriptions}) => {
        return {
            data: transactionHistory.initialData,
            loading: transactionHistory.loading,
            card: global.selectedCard,
            user: auth.user,
        }
    });

    const {card} = reduxState;

    const viewMore = () => {
        checkUserAndCardStatus(t, card, ({type}) => {
            if(type === 'NAVIGATE') {
                navigation.navigate('Card_Management', {
                    screen: 'transaction_history',
                    initial: false,
                    params: {
                        selected: 'TODAY'
                    }
                })
            }
        }, {routeName: "Card_Management", isShowPopup: true, notCheckCardStatus: true, upgradePath: "MINIMAL_TO_FULL"});
    };

    const renderTransaction = () => {
        return (
            <View style={[Styles.sectionContainer, style]}>
                <View style={Styles.sectionContainerHeader}>
                    <View style={Styles.sectionContainerHeaderContent}>
                        <CText style={Styles.sectionContainerHeaderTitle}>
                            {t('SECTION_LABELS.RECENT_TRANSACTIONS')}
                        </CText>
                    </View>
                    <CButton
                        title={t('GLOBAL.GET')}
                        colorType={'secondary'}
                        onPress={() => viewMore()}
                        buttonStyle={{minWidth: 100}}
                    />
                </View>
                <View style={Styles.sectionContainerBody}/>
            </View>
        )
    };


    return renderTransaction()
}

export default memo(RecentTransactionsSection);
