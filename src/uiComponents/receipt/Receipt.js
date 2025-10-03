import React, {Fragment, memo, useRef} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Style from './Receipt.style';
import {ProgressiveImage, CText, CModal, AlertView} from "../index";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {handleSuccess, MappedElement, savePicture} from "../../utils/methods";
import moment from "moment";
import ViewShot from "react-native-view-shot";
import * as RNFS from "react-native-fs";
import Share from 'react-native-share';
import {useTranslation} from "react-i18next";
import ScratchCard from "../../pages/scratchCards/ScratchCard";

const Receipt = React.forwardRef((props, ref) => {

    const { t, i18n } = useTranslation();

    const ScratchCardRef = useRef();
    const ref2 = useRef();

    const {isVisible = false, data, senTo, infoTitle =  t('RECEIPT.SENT_TO'), isHistory = false, refId,
        infoUpperTitle = t('RECEIPT.TOTAL_AMOUNT'),
        amountTitle = t('RECEIPT.TOTAL_AMOUNT'),
        fractionDigits = 2, isCreditPay = false } = props;

    const togglePopup = () => {
        if(data?.userScratchCard){
            props?.onClose('WITHOUT_RESET_NAVIGATION');
            ScratchCardRef.current.toggleModal({_id: data?.userScratchCard});
        } else {
            props?.onClose();
        }
    };

    const captureAndSaveScreenShot = () => {
        ref2?.current?.capture().then(async (uri) => {
            savePicture(uri).then(res => {
                if(res) {
                    handleSuccess(t('RECEIPT.S_SAVE'));
                    togglePopup()
                }
            }).catch(err => {
                console.log(err)
            })
        });
    };

    const captureAndShareScreenShot = () => {
        ref2?.current?.capture().then(async (uri) => {
            RNFS.readFile(uri, 'base64').then((res) => {
                let urlString = 'data:image/jpeg;base64,' + res;
                let options = {
                    title: '',
                    message: '',
                    url: urlString,
                    type: 'image/jpeg',
                };
                Share.open(options)
                    .then((res) => {
                        if(res) {
                            handleSuccess(t('RECEIPT.S_SHARE'));
                            togglePopup()
                        }
                    })
                    .catch((err) => {
                        err && console.log(err);
                    });
            });
        });
    };

    const renderItem = (obj, i) => {
        return (
            <View key={i} style={[Style.listItem, obj?.isTitle && Style.listItem2]}>
                <CText style={[Style.listItemText, obj?.isTitle && Style.listItemText2]}>
                    {obj.Name}
                </CText>
                <CText style={[Style.listItemText, obj?.isTitle ? Style.listItemLastText2 : Style.listItemLastText]}>
                    {obj.value}
                </CText>
            </View>
        )
    };

    return (
        <Fragment>
            <CModal isOpen={isVisible}>
                <View style={[Style.fullContainer, {marginVertical: 30}]}>
                    <View style={Style.view}>
                        <TouchableOpacity style={Style.popupHeaderButton} onPress={() => togglePopup()}>
                            <KamelpayIcon style={Style.popupHeaderButtonIcon} name="close"/>
                        </TouchableOpacity>

                        <ViewShot ref={ref2} options={{format: 'jpg', quality: 0.9}} style={Style.viewContainer}>

                            <View style={Style.popupHeader}>
                                <ProgressiveImage
                                    source={require('../../assets/images/payment-successful.png')}
                                    style={Style.popupHeaderImage}/>

                                {data?.message ? <CText style={Style.title}>{data?.message}</CText> : null}
                                <CText style={Style.amountTitle}>{amountTitle}</CText>

                                <CText style={Style.amountText}> {data?.amountInAED ? Number(data?.amountInAED).toFixed(fractionDigits) : 0} <CText>AED</CText></CText>

                            </View>

                            {isCreditPay ? <AlertView
                                // type={'success'}
                                viewStyle={{marginTop: 5}}
                                showIcon={false}
                                text={`${t("CREDIT_PAY.THANK_YOU_USING_CREDIT_PAY")}\n=> ${t("CREDIT_PAY.TOTAL_AMOUNT_PAID_TODAY")} 0.00 AED\n=> ${t("CREDIT_PAY.TOTAL_AMOUNT_DUE_ON_NEXT_SALARY")} ${data?.amountInAED ? Number(data?.amountInAED).toFixed(fractionDigits) : 0} AED`}
                            /> : null}

                            <View style={Style.list}>
                                {infoUpperTitle ? <View style={Style.listItem}>
                                    <CText style={Style.listItemText}>{infoUpperTitle}</CText>
                                    <CText style={[Style.listItemText, Style.listItemLastText, Style.secondAmount]}>
                                        {data?.Amount} <CText>{data?.Currency}</CText>
                                    </CText>
                                </View> : null}

                                {infoTitle ? <View style={Style.listHeader}>
                                    <CText style={Style.listHeaderText}>{infoTitle}</CText>
                                </View> : null}

                                {refId ? <View style={Style.listItem}>
                                    <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'column'}}>
                                        <CText style={[Style.listItemText, Style.fontBold]}>
                                            {t('RECEIPT.PAYMENT_REF_ID')} / {t('RECEIPT.CONTROL_PIN')}
                                        </CText>
                                        <ProgressiveImage
                                            source={require('../../assets/images/hellopaisa-logo.png')}
                                            style={Style.listItemImage}
                                            resizeMode={'contain'}/>
                                    </View>
                                    <CText style={[Style.listItemText, Style.listItemLastText, Style.fontBold]}>
                                        {refId}
                                    </CText>
                                </View> : null}

                                <MappedElement
                                    data={senTo}
                                    renderElement={(obj, i) => {
                                        return(
                                            <Fragment key={i}>
                                                {obj?.separate ? <View style={Style.separatorContainer}>
                                                    {/*<View style={[Style.circle, Style.circleLeft]} />*/}
                                                    {!isHistory ? <Fragment>
                                                        <View style={Style.listItem}>
                                                            <CText style={Style.listItemText}>{t('GLOBAL.DATE')}</CText>
                                                            <CText style={[Style.listItemText, Style.listItemLastText]}>
                                                                {moment().format('DD MMMM yyyy')}
                                                            </CText>
                                                        </View>
                                                        <View style={Style.listItem}>
                                                            <CText style={Style.listItemText}>{t('GLOBAL.TIME')}</CText>
                                                            <CText style={[Style.listItemText, Style.listItemLastText]}>
                                                                {moment().format('hh:mm a')}
                                                            </CText>
                                                        </View>
                                                    </Fragment> : null}
                                                    <View style={Style.confirmInfoListSeparator}/>
                                                    {/*<View style={[Style.circle, Style.circleRight]} />*/}
                                                </View> : null}
                                                {renderItem(obj, i)}
                                            </Fragment>
                                        )
                                    }}
                                />

                            </View>

                        </ViewShot>

                        <View style={Style.popupFooter}>
                            <TouchableOpacity style={Style.popupFooterButton} onPress={() => captureAndSaveScreenShot()}>
                                <KamelpayIcon style={Style.popupFooterButtonIcon} name="download"/>
                                <CText style={Style.popupFooterButtonText}>{t('GLOBAL.DOWNLOAD')}</CText>
                            </TouchableOpacity>
                            <TouchableOpacity style={Style.popupFooterButton} onPress={() => captureAndShareScreenShot()}>
                                <KamelpayIcon style={Style.popupFooterButtonIcon} name="share"/>
                                <CText style={Style.popupFooterButtonText}>{t('GLOBAL.SHARE')}</CText>
                            </TouchableOpacity>
                            {data?.trackHistory ? <TouchableOpacity style={Style.popupFooterButton} onPress={() => data?.trackHistory()}>
                                <KamelpayIcon style={Style.popupFooterButtonIcon} name="transactions"/>
                                <CText style={Style.popupFooterButtonText}>{t('GLOBAL.TRACK_HISTORY')}</CText>
                            </TouchableOpacity> : null}
                        </View>

                    </View>
                </View>
            </CModal>
            <ScratchCard ref={ScratchCardRef} goBack={false} close={() => props?.onClose ? props?.onClose() : null} />
        </Fragment>
    );
});


export default memo(Receipt);
