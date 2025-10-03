import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions} from 'react-native';
import Styles from "./CardSelection.style";
import CreditCardUi from "../../../uiComponents/creditCardUi/CreditCardUi";
import Carousel from 'react-native-snap-carousel';
import {foundProduct, getLayoutDirection} from "../../../utils/methods";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
const windowWidth = Dimensions.get('window').width;

function CardSelection(props) {
    const { t } = useTranslation();

    const carouselRef = useRef();

    const reduxState = useSelector(({auth, global}) => {
        return {
            activeCardIndex: global.activeCardIndex,
        }
    });

    const {data, onChange, onSelect, currentSelectIndex = 0, loading} = props;

    const [cardWidth] = useState(windowWidth - 60);

    useEffect(() => {
        carouselRef?.current?.snapToItem(reduxState?.activeCardIndex)
    }, [reduxState?.activeCardIndex]);

    const _renderCardItem = ({item, index}) => {
        const foundCardData = item?.companyProductCode && foundProduct(item?.companyProductCode) ? {
            ...foundProduct(item?.companyProductCode),
            // backgroundColor: '#e91b24',
            // overlayBackgroundColor: '#e91b24',
            // companyLogo: 'https://firebasestorage.googleapis.com/v0/b/kamelpay-2a233.appspot.com/o/aljaber-exchange-logo-white.png?alt=media&token=f0d5b033-cf5d-42de-860c-d48e766b8708'
        } : {};
        return foundCardData ? (
            <View key={index} style={{alignItems:'center', justifyContent: 'flex-end', flex: 1}}>
                <CreditCardUi
                    whereToCome={'SLIDER'}
                    currentSelectIndex={currentSelectIndex}
                    cardWidth={cardWidth}
                    card={item}
                    foundCardData={foundCardData}
                    onPress={() => onSelect(item)}
                />
            </View>
        ) : null
    };

    return (
        <View style={Styles.container}>
            <Carousel
                ref={carouselRef}
                layout={"default"}
                width={windowWidth}
                data={data}
                contentContainerCustomStyle={{flexDirection: false ? 'row-reverse' : 'row'}}
                renderItem={_renderCardItem}
                sliderWidth={windowWidth}
                currentIndex={currentSelectIndex}
                currentScrollPosition={currentSelectIndex}
                itemWidth={cardWidth}
                onSnapToItem={(index) => onChange(index)}
                enableMomentum={true}
                decelerationRate={0.9}
                scrollEnabled={!loading}
                useScrollView={false}
            />
        </View>
    )
}

export default CardSelection;
