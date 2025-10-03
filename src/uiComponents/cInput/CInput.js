import React, {Fragment} from 'react';
import {View, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';
import KamelPayIcon from '../../assets/icons/KamelPayIcon';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {themes} from "../../theme/colors";
import ProgressiveImage from "../progressiveImage/ProgressiveImage";
import MaskInput from 'react-native-mask-input';
import CText from '../cText/CText';

TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
};

const CInput = React.forwardRef((props, ref) => {

    const {isShow = true, inputContainerStyle, inputInnerContainerStyle,
        inputLabel, inputLabelStyle,
        loading= false,
        inputSubLabel, inputSubLabelStyle, type,
        onPress, selectedCountry, textStyle, disabled,
        leftIconName, toggleLeftIconFunc, leftIconButtonStyle, iconStyle, inputErrorStyle, error,
        toggleRightIconFunc, rightIconButtonStyle, rightIconName, rightButton, style, value,
        countryView, countryViewLoading = false, placeholder, showCountryCurrency, prefixView} = props;

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

    const renderLeftIcon = () => {
        return (
            <TouchableOpacity activeOpacity={1}
                              onPress={toggleLeftIconFunc}
                              style={{...GlobalStyle.inputLeftIconButton, ...leftIconButtonStyle}}>
                <KamelPayIcon name={leftIconName} style={{...GlobalStyle.inputIcon, ...iconStyle}} />
            </TouchableOpacity>
        )
    };

    const renderRightIcon = () => {
        return (
            <TouchableOpacity activeOpacity={1}
                              onPress={toggleRightIconFunc}
                              style={{...GlobalStyle.inputRightIconButton, ...rightIconButtonStyle}}>
                <KamelPayIcon name={rightIconName} style={{...GlobalStyle.inputIcon, ...iconStyle}} />
            </TouchableOpacity>
        )
    };

    const renderErrorView = () => {
        return (
            <CText style={{...GlobalStyle.errorTextStyle, ...inputErrorStyle}}>
                {error}
            </CText>
        )
    };

    const renderInputView = () => {
        return (
            <MaskInput ref={ref}
                       maskChar="x"
                       autoCorrect={false}
                       placeholderTextColor={themes['light'].colors.gray4}
                       style={{...GlobalStyle.inputStyle, ...style}}
                       autoCapitalize="none"
                       value={value}
                       {...props} />
        )
    };

    const renderSelectionView = () => {
        return (
            <TouchableOpacity style={[{...GlobalStyle.inputStyle, ...style}, {justifyContent: 'center'}]}
                              onPress={!loading ? onPress : null}
                              activeOpacity={loading ? 1 : 0.5}>
                {loading ? <View style={{alignItems: 'flex-start'}}>
                    <ActivityIndicator color="#000080" size={24}/>
                </View> : <CText style={[{...GlobalStyle.inputTextStyle, ...textStyle}, !value && {color: themes['light'].colors.gray4}]}>
                    {value ? value : placeholder}
                </CText>}
            </TouchableOpacity>
        )
    };

    const renderCountryView = () => {
        return (
            <TouchableOpacity style={{...GlobalStyle.countryView, ...countryView, ...(error && GlobalStyle.errorBorder)}} disabled={disabled} onPress={onPress}>

                {countryViewLoading ? <ActivityIndicator color="#000080" size={24}/> :  <Fragment>
                    <ProgressiveImage resizeMode={'contain'} style={GlobalStyle.countryViewImage} source={{uri: selectedCountry?.flags?.png}}/>
                    {showCountryCurrency  && Object.keys(selectedCountry?.currencies)?.length ? <CText style={GlobalStyle.countryCurrencyText}>
                        {Object.keys(selectedCountry?.currencies)[0]}
                    </CText> : <CText style={GlobalStyle.countryViewText}>
                        {selectedCountry?.detail?.code}
                    </CText>}

                </Fragment>}

            </TouchableOpacity>
        )
    };

    return isShow ? (
        <View style={{...GlobalStyle.inputContainer, ...inputContainerStyle}}>
            {inputLabel ? renderLabel() : null}
            {inputSubLabel ? renderSubLabel() : null}
            <View style={{...GlobalStyle.inputInnerContainer, ...inputInnerContainerStyle, ...(error && GlobalStyle.errorBorder)}}>
                {leftIconName ? renderLeftIcon() : null}
                {selectedCountry && Object.keys(selectedCountry).length ? renderCountryView() : null}
                {prefixView ? prefixView() : null}
                {type === 'view' ? renderSelectionView() : renderInputView()}
                {rightIconName ? renderRightIcon() : null}
                {rightButton ? rightButton() : null}
            </View>
            {error ? renderErrorView() : null}
        </View>
    ) : null
});

CInput.defaultProps = {
    inputContainerStyle: {},
    inputLabelStyle: {},
    iconButtonStyle: {},
    inputInnerContainerStyle: {},
    iconStyle: {},
    inputErrorStyle: {},
    toggleIconFunc: () => null,

    toggleRightIconFunc: () => null,
    rightButton: () => null,
    rightIconButtonStyle: {},
    rightIconName: '',

    toggleLeftIconFunc: () => null,
    leftIconButtonStyle: {},
    leftIconName: '',

    inputLabel: '',
    error: '',
};

export default React.memo(CInput);
