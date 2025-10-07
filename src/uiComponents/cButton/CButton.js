import React, {Fragment} from 'react';
import {TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import styles from "./CButton.style";
import {themes} from "../../theme/colors";
import KamlepayIcon from '../../assets/icons/KamelPayIcon';

const CButton = props => {
    const {title, children, loading, disabled, loaderProps, buttonText, activeOpacity, onPress, buttonStyle, theme,
        colorType, type, iconType = 'custom', iconName, rightIconName, iconStyle} = props;

    let backgroundColor = colorType;
    let borderColor = colorType;
    let textColor = colorType;

    if(type === 'without_outline') {
        backgroundColor = 'tertiary'
    } else if(type === 'outline') {
        backgroundColor = 'tertiary'
    } else {
        textColor = 'tertiary'
    }
    return(
        <TouchableOpacity activeOpacity={activeOpacity}
                          onPress={onPress}
                          disabled={disabled || loading}
                          style={[
                              styles.buttonStyle,
                              {
                                  backgroundColor: type === 'without_outline' ? 'transparent' : themes['light'].colors[backgroundColor],
                                  borderColor: type === 'without_outline' ? 'transparent' : themes['light'].colors[borderColor]
                              },
                              (disabled || loading) && {opacity: 0.5},
                              buttonStyle
                          ]}>

            {title ? <Fragment>

                {iconType === 'custom' && rightIconName ?
                    <KamlepayIcon name={rightIconName}
                                  style={[styles.buttonIcon, styles.buttonRightIcon, {color: themes['light'].colors[textColor]}, iconStyle]}/>
                    : null}

                <Animated.Text style={[styles.buttonText, {color: themes['light'].colors[textColor]}, buttonText]}>
                    {title}
                </Animated.Text>

                {iconType === 'custom' && iconName ?
                    <KamlepayIcon name={iconName}
                                  style={[styles.buttonIcon, {color: themes['light'].colors[textColor]}, iconStyle]}/>
                                  : null}

            </Fragment> : children }

            {loading ? <ActivityIndicator
                                          {...loaderProps}
                                          color={themes['light'].colors[textColor]}
                                          style={{marginLeft: 10}}/> : null}
        </TouchableOpacity>
    )
};


CButton.defaultProps = {
    title: '',
    onPress: () => null,
    colorType: 'primary',
    type: 'normal',
    activeOpacity: 0.5,
    loading: false,
    disabled: false,
    loaderProps: {
        size: 20,
        color: themes['light'].colors.tertiary,
    },
};

export default React.memo(CButton);
