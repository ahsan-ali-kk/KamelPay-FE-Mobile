import React, {Fragment, useRef} from "react";
import {View} from "react-native";
import {useTranslation} from "react-i18next";
import {Container} from "../../containers";
import {CButton, ProgressiveImage, CText} from "../../uiComponents";
import ScratchCard from "./ScratchCard";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./ScratchCards.style";
import {formatAmount, MappedElement, readableText} from "../../utils/methods";

function ScratchCardDetail(props) {

    const {t} = useTranslation();
    const ScratchCardRef = useRef();
    const {route: { params: data }} = props;
    const {scratchCard} = data;


    const headerProps = {
        headerTitle: t('PAGE_TITLE.SCRATCH_AND_WIN_DETAIL'),
        headerRight: true,
    };

    const redeem = (item) => {
        ScratchCardRef.current.toggleModal(item)
    };

    const renderFooter = () => {
        return !scratchCard?.isScratched ? (
            <View style={GlobalStyle.listFooterButton}>
                <CButton
                    title={t('SCRATCH_CARDS.SCRATCH_NOW')}
                    onPress={()=> redeem(scratchCard)}
                />
            </View>
        ) : null
    };


    const renderPrizeText = (obj) => {
        switch (obj?.prizeType) {
            case 'PRODUCT':
                return `${obj?.productName}, ${obj?.productTitle}`;
            default:
                return `${formatAmount(obj?.amount, 'AED')} ${readableText(obj?.prizeType)}`;
        }
    };

    const renderPrizeItem = (item) => {
        return (
            <View style={Styles.prizeListItem}>
                <View style={Styles.prizeListItemContainer}>
                    <ProgressiveImage
                        style={Styles.scratchCardContentContainerIcon}
                        {
                            ...item?.productImage ? {
                                source: {uri: item?.productImage},
                                style: Styles.prizeListItemIcon
                            } : {
                                source: require('../../assets/images/3d-vector/coin.png'),
                                style: Styles.prizeListItemIcon
                            }
                        }
                    />
                    <CText style={Styles.prizeListItemText}>
                        {renderPrizeText(item)}
                    </CText>
                </View>
            </View>
        )
    };

    const getHeaderObj = (obj) => {
          if(obj?.isScratched) {
              if(obj?.isWinner) {
                  return (
                      <Fragment>
                          <ProgressiveImage
                              style={Styles.scratchCardContentContainerIcon}
                              {
                                  ...obj?.scratchCardPrizeDetails?.productImage ? {
                                      source: {uri: obj?.scratchCardPrizeDetails?.productImage},
                                      style: Styles.scratchCardContentContainerProductImage
                                  } : {
                                      source: require('../../assets/images/3d-vector/coin.png'),
                                      style: Styles.scratchCardContentContainerIcon
                                  }
                              }
                          />
                          <CText style={[Styles.detailPageHeaderText, Styles.success]}>
                              {t('SCRATCH_CARDS.YOU_WON')}
                          </CText>
                          <CText style={[Styles.detailPageHeaderText, Styles.success]}>
                             {renderPrizeText(obj?.scratchCardPrizeDetails)}
                          </CText>
                      </Fragment>
                  );
              }
              else {
                  return (
                      <Fragment>
                          <ProgressiveImage
                              resizeMode={'contain'}
                              style={Styles.detailPageHeaderImage}
                              source={require('../../assets/images/3d-vector/try-again.png')}
                          />
                          <CText style={[Styles.detailPageHeaderText, Styles.tryAgain]}>
                              {t('SCRATCH_CARDS.TRY_AGAIN_TEXT')}
                          </CText>
                      </Fragment>
                  )
              }
          } else {
              return (
                  <Fragment>
                      <ProgressiveImage
                          resizeMode={'contain'}
                          style={Styles.detailPageHeaderImage}
                          source={require('../../assets/images/3d-vector/trophy.png')}
                      />
                      <CText style={Styles.detailPageHeaderText}>
                          {t('SCRATCH_CARDS.SCRATCH_NOW_READY_TO_WIN')}
                      </CText>
                  </Fragment>
              )
          }
    };


    return (
        <Container headerProps={headerProps}
                   renderFooter={renderFooter}
                   scrollView={true}
                   {...(scratchCard?.isScratched && {
                       scrollViewProps: {
                           contentContainerStyle: {
                               flexGrow: 1,
                               justifyContent: 'center',
                           },
                       }
                   })}
        >

            <View style={Styles.container}>
                <View style={Styles.detailPageHeader}>
                    {getHeaderObj(scratchCard)}
                </View>
                {!scratchCard?.isScratched ? <View style={Styles.prizeListContainer}>
                    <View style={Styles.prizeList}>
                        <MappedElement
                            data={scratchCard?.scratchCardPrizes}
                            renderElement={renderPrizeItem}
                        />
                    </View>
                </View> : null}
            </View>


            <ScratchCard ref={ScratchCardRef}/>

        </Container>
    )
}

export default React.memo(ScratchCardDetail)
