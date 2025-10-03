import React from "react";
import {View, ScrollView} from "react-native";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import Style from "../../topUp/TopUp.style";
import {CButton, CText, IconButton} from "../../../uiComponents";
import {formatAmount, FormatNumberWithCommas, MappedElement, openDialScreen} from "../../../utils/methods";
import {useTranslation} from "react-i18next";
import Popup from "../../../uiComponents/popup/Popup";
import {changePhoneNumberApi} from "../../../store/actions/Auth.action";

function Overview(props) {

    const { t, i18n } = useTranslation();

    const { route: { params: data}, navigation } = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.CONFIRMATION'),
        headerRight: true,
    };

    const reduxState = useSelector(({global, auth}) => {
        return {
            loading: auth.changePhoneNumberLoading,
            card: global.selectedCard,
            selectedCountry: global.currentCountry,
            user: auth.user,
        }
    });
    const {selectedCountry} = reduxState;

    const navigationReset = () => {
        Popup.hide();
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

    const renderListItem = (label, value, i) => {
        return (
            <View key={i} style={Style.confirmInfoListItem}>
                <CText style={Style.confirmInfoListItemText}>
                    {label}
                </CText>
                <CText style={[Style.confirmInfoListItemText, Style.textRight]}>
                    {value}
                </CText>
            </View>
        )
    };

    const generateReceiverDetail = () => {
        let info = [];

        let obj = {
            ...(data && data),
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
        };

        // if(obj?.payload?.oldPhone) {
        //     info.push({
        //         Name: t('VALIDATION.OLD_PHONE_NUMBER.TITLE'),
        //         value: `${obj?.payload?.oldPhone}`,
        //         separate: true
        //     });
        //     }
        if(obj?.payload?.newPhone) {
            info.push({
                Name: t('VALIDATION.NEW_PHONE_NUMBER.TITLE'),
                value: `${obj?.payload?.newPhone}`,
                separate: true
            });
        }
        if(obj?.Card) {
            info.push({
                Name: t('RECEIPT.CARD'),
                value: obj?.Card,
                separate: true
            });
        }


        return info
    };

    const generateTransferAmountAndCharges = () => {
        let info = [];

        let obj = {
            ...(data && data),
        };

        if(obj?.response?.totalAmount) {
            info.push({
                Name: t('RECEIPT.PROCESSING_FEES'),
                value: formatAmount(obj?.response?.totalAmount - obj?.response?.totalVat, Object.keys(selectedCountry?.currencies))
            });
        }

        if(obj?.response?.totalVat){
            info.push({
                Name: t('RECEIPT.VAT'),
                value: formatAmount(obj?.response?.totalVat, Object.keys(selectedCountry?.currencies))
            });
        }

        return info
    };


    const submit = () => {
        let payload = {
            token: data?.response?.token,
            // transactionId: data?.transactionId
        };
        dispatch(changePhoneNumberApi(payload, callBack))
    };

    const callBack = (res) => {
        if (res?.data?.hasError || res?.error) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: res?.data?.message || t('POPUPS.ERROR.TITLE'),
                text: t('CHANGE_PHONE_NUMBER_REQUEST.REQUEST_ERROR'),
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
                title: t('GLOBAL.SUCCESSFULLY'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => navigationReset()
                    },
                ]
            })
        }
    };

    return (
        <Container
            edges={['left', 'right']}
            SafeAreaViewStyle={Style.confirmSafeAreaViewStyle}
            headerProps={headerProps}>

            <View style={Style.confirmHeader}>
                <IconButton
                    buttonType='normal'
                    type="icon-with-background"
                    buttonStyle={Style.confirmHeaderIconContainer}
                    iconName={'refresh'}
                />
                <CText style={Style.confirmHeaderTitle}>
                    {t('CHANGE_PHONE_NUMBER_REQUEST.TITLE')}
                </CText>
            </View>

            <Container
                edges={['left', 'right', 'bottom']}
                loading={reduxState.loading}
                SafeAreaViewStyle={Style.confirmScroll}>

                <ScrollView contentContainerStyle={Style.confirmInfoScrollView}>

                    <CText style={Style.confirmInfoListHeaderText}> {t('RECEIPT.DETAILS_AND_INFORMATION')} </CText>

                    <MappedElement
                        data={generateReceiverDetail()}
                        renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                    <View style={Style.confirmInfoListNormalSeparator}/>

                    <CText style={Style.confirmInfoListHeaderText}>
                        {t('RECEIPT.AMOUNT_AND_CHARGES')}
                    </CText>

                    <MappedElement
                        data={generateTransferAmountAndCharges()}
                        renderElement={(obj, i) => renderListItem(obj?.Name, obj?.value, i)}/>

                    <View style={Style.confirmInfoListSeparator}/>

                    <View style={Style.confirmInfoListItem}>
                        <CText style={[Style.confirmInfoListItemText, Style.textBold]}>
                            {t('RECEIPT.TOTAL_AMOUNT')}
                        </CText>
                        <FormatNumberWithCommas
                            value={data?.response?.totalAmount || 0}
                            currency={Object.keys(selectedCountry?.currencies)}
                            styleAmount={[Style.confirmInfoListItemText, Style.textBold, Style.textRight, Style.primaryText]}
                            numberOfLines={1}
                        />
                    </View>

                </ScrollView>

                <View style={[Style.bottomButtonContainer, {marginTop: 0}]}>
                    <CButton buttonStyle={Style.bottomButton}
                             disabled={reduxState?.loading}
                             loading={reduxState.loading}
                             onPress={() => submit()}
                             title={t('GLOBAL.CONFIRM')}/>
                </View>
            </Container>

        </Container>
    )
}

export default React.memo(Overview)
