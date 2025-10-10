import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated, Platform, UIManager } from "react-native";
import styles from './CSegmented.style';
import CText from "../cText/CText";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Ionicons from "@react-native-vector-icons/ionicons";
import {useTranslation} from "react-i18next";
if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const borderRadius = 8;
const leftSpaceIndicator = 5;
const rightSpaceIndicator = leftSpaceIndicator * 2;

const CSegmented = (props) => {

    const {containerStyle, data, onSelect, value, inputLabel, inputLabelStyle, inputSubLabel, inputSubLabelStyle,
        error, inputErrorStyle, disable} = props;

    const { t, i18n } = useTranslation();
    const isRTL = (typeof i18n?.dir === 'function' ? i18n.dir() === 'rtl' : I18nManager.isRTL);

    const [itemLayouts, setItemLayouts] = useState([]); // [{x, width}]
    const indicatorLeft = useRef(new Animated.Value(0)).current;
    const indicatorWidth = useRef(new Animated.Value(0)).current;
    const activeIndex = data.findIndex(item => item._id === value);

    // Update indicator position when value or itemLayouts changes
    useEffect(() => {
        if (itemLayouts.length === data.length && activeIndex !== -1) {
            const leftInset  = isRTL ? rightSpaceIndicator : leftSpaceIndicator;
            const rightInset = isRTL ? leftSpaceIndicator : rightSpaceIndicator;

            Animated.spring(indicatorLeft, {
                toValue: itemLayouts[activeIndex].x + leftInset,
                useNativeDriver: false,
            }).start();
            Animated.spring(indicatorWidth, {
                toValue: itemLayouts[activeIndex].width - (leftInset + rightInset),
                useNativeDriver: false,
            }).start();
        }
    }, [activeIndex, itemLayouts.length, isRTL]);

    const renderLabel = () => {
        return (
            <CText style={{...GlobalStyle.inputLabel, ...inputLabelStyle}}>
                {inputLabel}
            </CText>
        )
    };

    const renderSubLabel = () => {
        return (
            <CText style={{...GlobalStyle.inputSubLabel, ...inputSubLabelStyle}}>
                {inputSubLabel}
            </CText>
        )
    };

    const renderErrorView = () => {
        return (
            <CText style={{...GlobalStyle.errorTextStyle, ...inputErrorStyle}}>
                {error}
            </CText>
        )
    };

    return (
        <View style={[containerStyle]}>
            {inputLabel ? renderLabel() : null}
            {inputSubLabel ? renderSubLabel() : null}
            <View style={[styles.container,
                isRTL && { flexDirection: 'row-reverse' },
                (error && {...GlobalStyle.errorBorder, borderWidth: 1})]}>
                {itemLayouts.length === data.length && (
                    <Animated.View
                        style={[
                            styles.animatedIndicator,
                            {
                                left: indicatorLeft,
                                width: indicatorWidth,
                                borderTopLeftRadius:  isRTL ? (activeIndex === data.length - 1 ? borderRadius : 0) : (activeIndex === 0 ? borderRadius : 0),
                                borderBottomLeftRadius: isRTL ? (activeIndex === data.length - 1 ? borderRadius : 0) : (activeIndex === 0 ? borderRadius : 0),
                                borderTopRightRadius: isRTL ? (activeIndex === 0 ? borderRadius : 0) : (activeIndex === data.length - 1 ? borderRadius : 0),
                                borderBottomRightRadius: isRTL ? (activeIndex === 0 ? borderRadius : 0) : (activeIndex === data.length - 1 ? borderRadius : 0),
                            }
                        ]}
                    />
                )}

                {/* Segments */}
                {data.map((item, idx) => !item?.hide ? (
                    <TouchableOpacity
                        key={item._id ?? idx}
                        disabled={disable}
                        style={styles.itemContainer}
                        activeOpacity={0.7}
                        onPress={() => onSelect(item)}
                        onLayout={e => {
                            const layout = e.nativeEvent.layout;
                            setItemLayouts(prev => {
                                const next = [...prev];
                                next[idx] = { x: layout.x, width: layout.width };
                                return next;
                            });
                        }}
                    >
                        {item?.ioniconsName ? <Ionicons style={[
                            styles.icon,
                            item._id === value && styles.activeIcon,
                        ]} name={item?.ioniconsName}/> : null}

                        <Text
                            style={[
                                styles.text,
                                item._id === value && styles.activeText,
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {t(item.value)}
                        </Text>
                    </TouchableOpacity>
                ) : null )}
            </View>
            {error ? renderErrorView() : null}
        </View>
    );
};

export default CSegmented;
