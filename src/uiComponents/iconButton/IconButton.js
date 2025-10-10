import React, {Fragment} from 'react';
import {TouchableOpacity, ActivityIndicator, View } from 'react-native';
import Styles from "./IconButton.style";
import {themes} from "../../theme/colors";
import KamlepayIcon from '../../assets/icons/KamelPayIcon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const defaultProps = {
    title: '',
    onPress: () => null,
    activeOpacity: 0.5,
    loading: false,
    disabled: false,
    loaderProps: {
        size: 20,
        color: themes['light'].colors.tertiary,
    },
};


const IconButton = props => {
    const {loading, disabled, loaderProps, activeOpacity, onPress, type,
        buttonStyle,
        iconName,
        buttonType = 'normal',
        buttonIconStyle, children, badge, materialCommunityIcons, ionicons, materialIcons} = {...defaultProps, ...props};

    let style;
    let iconStyle;

    if(type === 'icon-with-background'){
        style = Styles.buttonWithBackground;
        iconStyle = Styles.buttonWithBackgroundIcon
    } else {
        style = Styles.buttonStyle;
        iconStyle = Styles.buttonIcon
    }


    const buttonWrapper = (child) => {
        if(buttonType === 'normal') {
            return (
                <View style={[style, (disabled || loading) && {opacity: 0.5}, buttonStyle]}>
                    {child()}
                </View>
            )
        } else {
            return (
                <TouchableOpacity activeOpacity={activeOpacity}
                                  onPress={onPress}
                                  disabled={disabled || loading}
                                  style={[style, (disabled || loading) && {opacity: 0.5}, buttonStyle]}>
                    {child()}
                </TouchableOpacity>
            )
        }
    };

    return buttonWrapper(() => {
                return children ? children : (
                   <Fragment>
                       <View style={Styles.buttonContainer}>
                           {iconName ? <KamlepayIcon name={iconName} style={[iconStyle, buttonIconStyle]}/> : null}
                           {materialCommunityIcons ? <MaterialCommunityIcons name={materialCommunityIcons} style={[iconStyle, buttonIconStyle]}/> : null}
                           {ionicons ? <Ionicons name={ionicons} style={[iconStyle, buttonIconStyle]}/> : null}
                           {materialIcons ? <MaterialIcons name={materialIcons} style={[iconStyle, buttonIconStyle]}/> : null}
                           {badge ? <View style={Styles.badge}/> : null}
                           {loading ? <ActivityIndicator {...loaderProps} /> : null}
                       </View>
                   </Fragment>
                )
            });
};

export default React.memo(IconButton);
