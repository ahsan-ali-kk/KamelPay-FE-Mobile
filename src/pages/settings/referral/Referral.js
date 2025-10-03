import React, {useEffect} from 'react';
import {Container, ViewContainer} from "../../../containers";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import Styles from "./Referral.style";
import {ProgressiveImage, CText, IconButton, CButton} from "../../../uiComponents";
import Clipboard from '@react-native-clipboard/clipboard';
import {handleSuccess, MappedElement} from "../../../utils/methods";
import Share from "react-native-share";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";

function Referral(props) {

    const { t } = useTranslation();
    const {navigation} = props;

    const reduxState = useSelector(({auth, referral, global}) => {
        return {
            user: auth.user,
            loading: false,
            card: global.selectedCard,
            masterDetails: global.masterDetails
        }
    });

    const headerProps = {
        headerTitle: t('HOME.MAIN_OPTION_FIVE.TITLE'),
        headerRight: true,
    };

    function personalizeMessage(phoneNumber) {
        let message = reduxState?.masterDetails?.referralMessage || '';
        return message.replace(/{{phone}}/g, phoneNumber);
    }


    const copyCode = () => {
        let  text = personalizeMessage(reduxState?.user?.phone);
        Clipboard.setString(text);
        handleSuccess('Code copied!')
    };

    const share = async () => {
        let  text = personalizeMessage(reduxState?.user?.phone);
        const options = {
            title: 'NaqaD',
            url:'https://kamelpay.com/',
            message: text,
        };
        try {
            await Share.open(options);
        } catch (err) {
            console.log(err);
        }
    };

    const applicable = [
        {
            title: 'REFERRAL.REFER_A_FRIEND',
            key: 'REMITTANCE',
            vector: require('../../../assets/images/3d-vector/send-money.png'),
            resizeMode: 'contain'
        },
        {
            title: 'PAGE_TITLE.ADVANCE_SALARY',
            key: 'ADVANCE_SALARY',
            vector: require('../../../assets/images/3d-vector/advance-salary.png')
        },
        {
            title: 'PAGE_TITLE.PAY_BILLS',
            key: 'BILL_PAYMENT',
            vector: require('../../../assets/images/3d-vector/pay-bills.png')
        },
        {
            title: 'PAGE_TITLE.MOBILE_TOPUP',
            key: 'TOPUP',
            vector: require('../../../assets/images/3d-vector/topup.png')
        },
        {
            title: 'PAGE_TITLE.PRIZE_DRAW',
            key: 'LOTTERY',
            vector: require('../../../assets/images/3d-vector/prize-draw.png')
        },
        {
            title: 'PAGE_TITLE.MARKETPLACE',
            key: 'ECOMMERCE',
            vector: require('../../../assets/images/3d-vector/bnpl-3d-vector.png')
        },
    ];

    const renderApplicableListItem = (item, index) => {
        return reduxState?.card?.referralServices?.includes(item?.key) ? (
            <View style={Styles.referralApplicableListItem} key={index}>
                <ProgressiveImage
                    source={item?.vector}
                    style={Styles.referralApplicableListItemIcon}
                    resizeMode={'contain'}
                />
                <CText style={Styles.referralApplicableListItemTitle}>
                    {t(item?.title)}
                </CText>
            </View>
        ) : null
    };
    const renderApplicableList = () => {
        return (
            <View style={Styles.referralApplicableContainer}>
                <CText style={Styles.referralApplicableListTitle}>
                    {t('REFERRAL.REFERRAL_APPLICABLE_FOR')}
                </CText>
                <View style={Styles.referralApplicableList}>
                    <MappedElement
                        data={applicable}
                        renderElement={renderApplicableListItem}
                    />
                </View>
            </View>
        )
    };

    const renderFooter = () => {
        return (
            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('GLOBAL.SEE_TRANSACTIONS')}
                         onPress={() => navigation.navigate('referral_transaction')}/>
            </View>
        )
    };

    return (
        <Container headerProps={headerProps} edges={['left', 'right', 'bottom']}
                   loading={reduxState?.loading}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.container}
                           renderFooter={() => renderFooter()}>

                <View style={Styles.vectorContainer}>
                    <ProgressiveImage
                        source={require('../../../assets/images/3d-vector/referral.png')}
                        style={Styles.vector}
                    />
                </View>

                <CText style={Styles.pageTitle}>
                    {t('REFERRAL.REFER_A_FRIEND')}
                </CText>
                <CText style={Styles.pageParagraph}>
                    {t('REFERRAL.USE_CODE_FOR')}
                </CText>

                <View style={Styles.referralCodeContainer}>
                    <View style={Styles.referralCodeInnerContainer}>
                        <View style={Styles.referralCode}>
                            <CText style={Styles.referralCodeText}>
                                {reduxState?.user?.phone}
                            </CText>
                        </View>
                        <IconButton
                            buttonType=''
                            type="icon-with-background"
                            buttonStyle={Styles.referralCodeCopyButton}
                            buttonIconStyle={Styles.referralCodeCopyButtonIcon}
                            iconName={'copy'}
                            onPress={() => copyCode()}
                        />
                        <IconButton
                            buttonType=''
                            type="icon-with-background"
                            buttonStyle={Styles.referralCodeCopyButton}
                            buttonIconStyle={Styles.referralCodeCopyButtonIcon}
                            iconName={'share'}
                            onPress={() => share()}
                        />
                    </View>
                </View>

                {renderApplicableList()}

            </ViewContainer>

        </Container>
    )
}

export default React.memo(Referral);