import {View} from 'react-native';
import React from 'react';
import {CText} from "../index";
import {themes} from "../../theme/colors";
import {isIOS} from "../../utils/deviceInfo";
import Styles from "./RangeSlider.style";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Slider from "@react-native-community/slider";

export const ErrorView = ({message}) => {
    return message ? <CText style={GlobalStyle.errorTextStyle}>{message}</CText> : null;
};
const RangeSlider = (props) => {
    const {label, labelRight, subLabel, subLabelRight, inputContainer, maximumTrackTintColor, minimumTrackTintColor, minimumValue, maximumValue, error} = props;
    return (
        <View style={[GlobalStyle.inputContainer, inputContainer, Styles.rangeSliderParentContainer]}>
            {label || labelRight ? <View style={Styles.inputLabelHeader}>
                {label ? <CText style={[GlobalStyle.inputLabel, Styles.inputLabel]}>{label}</CText> : null}
                {labelRight ? <CText style={Styles.inputLabelRight}>{labelRight}</CText> : null}
            </View> : null}
            {subLabel || subLabelRight ? <View style={Styles.inputSubLabelHeader}>
                {subLabel ? <CText style={[GlobalStyle.inputSubLabel, Styles.inputSubLabel]}>{subLabel}</CText> : null}
                {subLabelRight ? <CText style={[GlobalStyle.inputSubLabel, Styles.inputSubLabelRight]}>{subLabelRight}</CText> : null}
            </View> : null}
            {/*{subLabel ? <CText style={GlobalStyle.inputSubLabel}>{subLabel}</CText> : null}*/}
            <View style={Styles.rangeSliderContainer}>
                {minimumValue?.toString() ? <CText style={Styles.rangeSliderText}>{minimumValue.toString()}</CText> : null}
                <Slider
                    style={Styles.rangeSlider}
                    maximumTrackTintColor={maximumTrackTintColor || themes['light'].colors[isIOS? 'gray' : 'gray1']}
                    minimumTrackTintColor={minimumTrackTintColor || themes['light'].colors.secondary}
                    {...props}
                />
                {maximumValue?.toString() ? <CText style={Styles.rangeSliderText}>{maximumValue.toString()}</CText> : null}
            </View>
            <ErrorView message={error} />
        </View>
    );
};
{/*{...(!isIOS && {thumbImage : require('../../assets/images/thumb-image-2.png') })}*/}

export default RangeSlider;

