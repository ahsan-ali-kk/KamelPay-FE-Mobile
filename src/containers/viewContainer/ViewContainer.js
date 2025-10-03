import React, {PureComponent} from 'react';
import {ImageBackground, ScrollView, Animated} from 'react-native';
import styles from './ViewContainer.style';
import KeyboardView, {scrollPersistTaps} from '../KeyboardView';

export default class ViewContainer extends PureComponent {
  render() {
    const {
      style,
      children,
      source,
      resizeMode,
      scrolled,
      contentContainerStyle,
      onLayout,
      pagingEnabled,
      horizontal,
      showsHorizontalScrollIndicator,
      renderFooter,
      scrollViewProps
    } = this.props;
    if (source) {
      return (
        <ImageBackground
          source={source}
          resizeMode={resizeMode}
          style={[styles.imageViewContainer, style]}>
          {children}
        </ImageBackground>
      );
    } else {
      return (
        <Animated.View
          onLayout={onLayout}
          style={[styles.viewContainer, style]}>
          {scrolled ? (
            <KeyboardView
              keyboardVerticalOffset={125}
              contentContainerStyle={contentContainerStyle}>
              <ScrollView
                {...scrollViewProps}
                contentContainerStyle={contentContainerStyle}
                horizontal={horizontal}
                pagingEnabled={pagingEnabled}
                showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}>
                {children}
              </ScrollView>
            </KeyboardView>
          ) : (
            children
          )}
          {renderFooter && renderFooter()}
        </Animated.View>
      );
    }
  }
}
