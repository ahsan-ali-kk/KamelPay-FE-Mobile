import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  I18nManager,
} from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {themes as theme} from "../../theme/colors";
import GlobalStyle from '../../assets/stylings/GlobalStyle';
import {CText} from '../index';
import {isAndroid} from "../../utils/deviceInfo";

export default class ToggleSwitch extends React.Component {
  static calculateDimensions(size) {
    switch (size) {
      case "small":
        return {
          width: 40,
          padding: 10,
          circleWidth: 15,
          circleHeight: 15,
          translateX: 22,
        };
      case "large":
        return {
          width: 70,
          padding: 20,
          circleWidth: 30,
          circleHeight: 30,
          translateX: 38,
        };
      default:
        return {
          width: 46,
          padding: 12,
          circleWidth: 18,
          circleHeight: 18,
          translateX: 26,
        };
    }
  }

  static defaultProps = {
    isOn: false,
    onColor: theme['light'].colors.secondary,
    offColor: "#CFCFCF",
    size: "medium",
    labelStyle: {},
    thumbOnStyle: {},
    thumbOffStyle: {},
    trackOnStyle: {},
    trackOffStyle: {},
    icon: null,
    disabled: false,
    animationSpeed: 300,
    useNativeDriver: true,
    circleColor: "white",
  };

  offsetX = new Animated.Value(0);
  dimensions = ToggleSwitch.calculateDimensions(this.props.size);

  createToggleSwitchStyle = () => [
    {
      justifyContent: "center",
      width: this.dimensions.width,
      borderRadius: 20,
      padding: this.dimensions.padding,
      backgroundColor: this.props.isOn
        ? this.props.onColor
        : this.props.offColor,
    },
    this.props.isOn ? this.props.trackOnStyle : this.props.trackOffStyle,
  ];

  createInsideCircleStyle = () => [
    {
      alignItems: "center",
      justifyContent: "center",
      margin: Platform.OS === "web" ? 0 : 4,
      left: Platform.OS === "web" ? 4 : 0,
      position: "absolute",
      backgroundColor: this.props.circleColor,
      transform: [{ translateX: this.offsetX }],
      width: this.dimensions.circleWidth,
      height: this.dimensions.circleHeight,
      borderRadius: this.dimensions.circleWidth / 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 1.5,
    },
    this.props.isOn ? this.props.thumbOnStyle : this.props.thumbOffStyle,
  ];

  render() {
    const {
      animationSpeed,
      useNativeDriver,
      isOn,
      onToggle,
      disabled,
      labelStyle,
      label,
      icon,
    } = this.props;

    let toValue;
    if (!I18nManager.isRTL && isOn) {
      toValue = this.dimensions.width - this.dimensions.translateX;
    } else if (I18nManager.isRTL && isOn) {
      toValue = -this.dimensions.width + this.dimensions.translateX;
    } else {
      toValue = -1;
    }

    Animated.timing(this.offsetX, {
      toValue,
      duration: animationSpeed,
      useNativeDriver: useNativeDriver,
    }).start();

    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };


    const onPress = () => {
      ReactNativeHapticFeedback.trigger("rigid", options);
      onToggle(!isOn)
    };

    return (
      <View style={styles.container} {...this.props}>
        {label ? (
          <CText style={[GlobalStyle.inputLabel, labelStyle, styles.labelStyle]}>{label}</CText>
        ) : null}
        <TouchableOpacity
          style={[this.createToggleSwitchStyle(), disabled && {
            opacity: isAndroid ? 0.5 : 0.3,
          }]}
          activeOpacity={disabled ? isAndroid ? 0.5 : 0.3 : 0.8}
          onPress={() => (disabled ? null : onPress())}
        >
          <Animated.View style={[this.createInsideCircleStyle(), disabled && {
            elevation: 0
          }]}>
            {icon}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30
  },
  labelStyle: {
    // marginHorizontal: 10,
    marginBottom: 0
  },
});
