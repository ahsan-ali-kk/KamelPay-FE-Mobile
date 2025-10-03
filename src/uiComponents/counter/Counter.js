import {TouchableOpacity, View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./Counter.style";
import {CText} from "../index";
import Feather from "react-native-vector-icons/Feather";
import React, {memo} from "react";

const Counter = (props) => {
    const {value = 1, min = 1, max = 3, onChange, label, counterContainerStyle, counterStyle,
        counterInnerContainerStyle,
        hideButtons,
        counterButtonStyle,
        counterButtonIconStyle,
        counterValueContainerStyle,
        counterValueStyle,
        disabled
    } = props;

    const handle = (type) => {
        if(type === 'minus') {
            let minusValue = value === min ? min : value - 1;
            onChange(minusValue);
        } else {
            let plusValue = value === max ? max : value + 1;
            onChange(plusValue);
        }
    };

    return (
        <View style={[GlobalStyle.inputContainer, Styles.counterContainer, counterContainerStyle]}>
            {label ? <CText style={[GlobalStyle.inputSubLabel, Styles.counterLabel]}>{label}</CText> : null}
            <View style={[GlobalStyle.inputInnerContainer, Styles.counterInnerContainer, counterInnerContainerStyle]}>
                <View style={[Styles.counter, counterStyle]}>
                    {hideButtons ? null : <TouchableOpacity style={[Styles.counterButton, counterButtonStyle]}
                                                            disabled={disabled}
                                                            onPress={() => handle('minus')}>
                        <Feather name={'minus'} style={[Styles.counterButtonIcon, counterButtonIconStyle]}/>
                    </TouchableOpacity>}
                    <View style={[Styles.counterValueContainer, counterValueContainerStyle]}>
                        <CText style={[Styles.counterValue, counterValueStyle]}>{value}</CText>
                    </View>
                    {hideButtons ? null : <TouchableOpacity style={[Styles.counterButton, counterButtonStyle]}
                                                            disabled={disabled}
                                                            onPress={() => handle('plus')}>
                        <Feather name={'plus'} style={[Styles.counterButtonIcon, counterButtonIconStyle]}/>
                    </TouchableOpacity>}
                </View>
            </View>
        </View>
    )
};
export default memo(Counter)
