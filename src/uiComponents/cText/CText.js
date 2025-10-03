import React  from 'react';
import {Text, Animated, NativeModules, Platform} from 'react-native';

Text.defaultProps = {
    ...(Text.defaultProps || {}),
    allowFontScaling: false,
};

const CText = (props) => {
    return <Animated.Text
        allowFontScaling={false}
        {...props}
        style={[
            props.style,
            Platform.OS === 'ios' && NativeModules.I18nManager?.isRTL && {lineHeight: 0}
        ]}>
        {props.children}
    </Animated.Text>
};

export default React.memo(CText);
