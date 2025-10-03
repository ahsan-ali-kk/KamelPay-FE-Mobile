import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {useTranslation} from "react-i18next";
import {CModal, CText, CButton, ProgressiveImage, CLoading} from "../../uiComponents";
import Styles from "./ScratchCards.style";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import { ScratchCard as ScratchCardModule } from 'rn-scratch-card';
import {useDispatch, useSelector} from "react-redux";
import {scratchACard} from "../../store/actions/ScratchCards.action";
import {formatAmount, readableText} from "../../utils/methods";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import ConfettiCannon from "react-native-confetti-cannon";
import {useNavigation} from "@react-navigation/native";

const ScratchCard = forwardRef((props, ref) => {

    const { t, i18n } = useTranslation();
    const { goBack = true, close } = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const explosionRef = useRef();
    const [isOpen, updateIsOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [response, setResponse] = useState(null);

    const reduxState = useSelector(({auth, global, scratchCards}) => {
        return {
            user: auth.user,
            loading: scratchCards?.scratchACardLoading,
            card: global.selectedCard,
        }
    });

    const {loading} = reduxState;

    useImperativeHandle(ref, () => ({
        toggleModal(item = null) {
            updateIsOpen(true);
            setSelectedCard(item);
        },
    }));

    const modalClose = (value = false) => {
        if(!loading) {
            if(response && goBack){
                navigation.goBack();
            } else {
                close && close()
            }
            updateIsOpen(value);
            setResponse(null);
            setSelectedCard(null);


        }
    };

    const scratchACardCallBack = (val) => {
        if(val?.isWinner){
            explosionRef?.current?.start();
        }
        setResponse(val);
    };

    const scratchComplete = () => {
        let payload = {
            id: selectedCard?._id
        };
        dispatch(scratchACard(payload, scratchACardCallBack));
    };

    const handleScratch = (val) => {
        if(val > 30 && !loading){
            scratchComplete()
        }
    };

    const tryAgainView = () => {
        return (
            <View style={Styles.scratchCardContentContainer}>
                <ProgressiveImage
                    source={require('../../assets/images/3d-vector/try-again.png')}
                    style={Styles.scratchCardContentContainerIcon}
                />
                <CText style={Styles.scratchCardContentContainerText}>
                    {response?.message}
                </CText>
            </View>
        )
    };

    const renderWinnerText = (obj) => {
        switch (obj?.prizeType) {
            case 'PRODUCT':
                return `${obj?.productName}, ${obj?.productTitle}`;
            default:
                return `${formatAmount(obj?.amount, 'AED')} ${readableText(obj?.prizeType)}`;
        }
    };

    const winnerView = () => {
        return (
            <View style={Styles.scratchCardContentContainer}>
                <ProgressiveImage
                    style={Styles.scratchCardContentContainerIcon}
                    {
                        ...response?.scratchCardPrize?.productImage ? {
                            source: {uri: response?.scratchCardPrize?.productImage},
                            style: Styles.scratchCardContentContainerProductImage
                        } : {
                            source: require('../../assets/images/3d-vector/coin.png'),
                            style: Styles.scratchCardContentContainerIcon
                        }
                    }
                />
                <CText style={Styles.scratchCardContentContainerText}>
                    {response?.message}
                </CText>
                <CText style={Styles.scratchCardContentContainerText}>
                    {renderWinnerText(response?.scratchCardPrize)}
                </CText>
            </View>
        )
    };

    const renderScratchView = () => {
        const scratchCardProps = {
            source: require('../../assets/images/scratchForegroundScreen.png'),
            brushWidth: 50,
            onScratch: handleScratch,
            style: {
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                position: 'relative',
                zIndex: 2
            },
        };

        return <ScratchCardModule {...scratchCardProps} />
    };

    const renderCloseButton = () => {
        return <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => modalClose()}>
            <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
        </TouchableOpacity>
    };

    return (
        <CModal centerView={true}
                scrollEnabled={!!response}
                isOpen={isOpen} close={() => modalClose()}>

            <View style={GlobalStyle.centerModalCenterViewContainer}>

                {renderCloseButton()}

                <View style={[Styles.scratchCardContainer, !response && Styles.maxHeight_300]}>
                    <View style={Styles.scratchCardBackgroundContainer}>
                        {loading ? <CLoading
                            showAnimation={true}
                            loading={true}/> : response ? response?.isWinner ? winnerView() : tryAgainView() : <ProgressiveImage
                            source={require('../../assets/images/3d-vector/coin.png')}
                            style={Styles.scratchCardBackgroundImage}
                        />}
                    </View>
                    {!loading && !response ? renderScratchView() : null}
                </View>

                <CButton
                    buttonStyle={{marginTop: 60}}
                    title={response ? t('GLOBAL.CLOSE') : t('GLOBAL.REDEEM')}
                    disabled={loading}
                    onPress={() => response ? modalClose() : scratchComplete()}
                />

            </View>
            <ConfettiCannon count={200}
                            autoStart={false}
                            ref={explosionRef}
                            origin={{x: 0, y: 0}}  />

        </CModal>
    )
});

export default React.memo(ScratchCard)
