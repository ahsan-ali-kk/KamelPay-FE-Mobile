import React, { useEffect, useState} from "react";
import {Container, ViewContainer} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ProgressiveImage, CText, CLoading} from "../../uiComponents";
import Styles from "./Savings.style";
import AuthStyle from "../auth/Auth.style";
import {View} from "react-native";
import CForm from "./QrAndPinForm";
import Amount from "./Amount";
import {generateQRCode, getPayBillAmount, verifyPin} from "../../store/actions/Savings.action";

function QrAndPin(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {route: {params: data}, navigation} = props;

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            card: global.selectedCard,
            currentCountry: global.currentCountry,
            qrCode: savings.qrCode,
            generateQrCodeLoading: savings.generateQrCodeLoading,
            vendorVerifyPinLoading: savings.vendorVerifyPinLoading,
            getPayBillAmountLoading: savings.getPayBillAmountLoading,
        }
    });

    const [isAmount, setIsAmount] = useState(false);

    const headerProps = {
        // headerTitle: 'Scan / Pin',
        headerRight: true,
    };

    useEffect(() => {
        let payload = {
            typeId: data?.offer?.id.toString(),
            type: data?.type
        };
        dispatch(generateQRCode(payload))
    }, [data]);

    const checkPin = (values) => {
        let payload = {
            outletId: data?.vendor?.id,
            outletPin: values?.pin,
            type: data?.type
        };
        dispatch(verifyPin(payload, verifyPinCallBack))
    };

    const verifyPinCallBack = () => {
        setIsAmount(true)
    };

    const submitAmount = (values) => {
        let payload = {
            typeId: data?.offer?.id.toString(),
            type: data?.type,
            outletId: data?.vendor?.id,
            billAmount: values?.amount
        };
        dispatch(getPayBillAmount(payload, getPayBillAmountCallBack))
    };

    const getPayBillAmountCallBack = (res) => {
        setIsAmount(false);
        navigation.navigate('savings_overview', {
            ...data,
            amount: res
        })
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={{flexGrow: 1}}>

                <View style={Styles.savingsLogoContainer}>
                    <ProgressiveImage
                        resizeMode="contain"
                        source={require('../../assets/images/KS_Blue.png')}
                        style={Styles.savingsLogo}
                        // style={{
                        //     margin: 0,
                        //     width: 150,
                        //     height: 30,
                        // }}
                    />
                </View>

            <View style={Styles.qrAndPinContainer}>
                <View style={[Styles.qrAndPinTop]}>
                    <CText style={[Styles.qrAndPinTopTitle]}>{!reduxState?.generateQrCodeLoading ? t('RECEIPT.SCAN_ME') : null}</CText>
                    {reduxState?.generateQrCodeLoading ? <CLoading
                        style={{height: 200, position: 'relative'}}
                        loading={true} /> : <View style={Styles.qrAndPinTopImageContainer}>
                        <ProgressiveImage
                            resizeMode="contain"
                            source={{uri: reduxState?.qrCode}}
                            style={Styles.qrAndPinTopImage}/>
                    </View> }
                </View>
                <View style={[AuthStyle.separator]}>
                    <View style={AuthStyle.separatorLine}/>
                    <CText style={AuthStyle.separatorText}> {t('GLOBAL.OR')} </CText>
                    <View style={AuthStyle.separatorLine}/>
                </View>
                <View style={Styles.qrAndPinBottom}>
                    <CForm
                        submit={checkPin}
                        loading={reduxState?.vendorVerifyPinLoading}
                    />
                </View>
            </View>
            </ViewContainer>
            <Amount
                isOpen={isAmount}
                submit={submitAmount}
                loading={reduxState.getPayBillAmountLoading}
                onClose={() => setIsAmount(false)}
            />
        </Container>
    )
}

export default React.memo(QrAndPin)
