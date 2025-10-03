import React from 'react';
import {Modal, ScrollView, View} from 'react-native';
import {Container} from "../../containers";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {themes} from "../../theme/colors";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";
import KeyboardView from "../../containers/KeyboardView";
import {initialWindowMetrics, SafeAreaProvider} from "react-native-safe-area-context";

function CModal(props) {
    const { isOpen = false, children, headerProps, close, transparent = true, centerView = false,
        animationType = 'fade', centerViewStyle, scrollEnabled = true, scrollView = false, scrollViewProps, edges, renderFooter, loadingWithOverlay=false } = props;
    return (
        <Modal animationType={animationType}
               transparent={transparent}
               visible={isOpen}
               onRequestClose={close}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            {headerProps ? <Container headerProps={headerProps}
                                      edges={edges}
                                      loadingWithOverlay={loadingWithOverlay}
                                      scrollView={scrollView}
                                      scrollViewProps={scrollViewProps}
                                      renderFooter={renderFooter}
            >
                {children}
            </Container> : <SafeAreaInsetsContext.Consumer>
                {(insets) => <View style={centerView ? [GlobalStyle.centerModalCenterView, centerViewStyle] : {flex: 1, backgroundColor: themes['light'].colors.overlay}}>
                    <ScrollView showsVerticalScrollIndicator={false}
                                scrollEnabled={scrollEnabled}
                                contentContainerStyle={[GlobalStyle.centerModalCenterViewContainerScroll, {paddingTop: insets.top, backgorundColor: 'red'}]}>
                        <KeyboardView
                            scrollEnabled={scrollEnabled}
                            contentContainerStyle={GlobalStyle.centerModalCenterViewContainerScroll}
                            keyboardVerticalOffset={150}
                        >
                        {children}
                        </KeyboardView>
                    </ScrollView>
                </View>}
            </SafeAreaInsetsContext.Consumer>}
            </SafeAreaProvider>
        </Modal>
    );
}

export default React.memo(CModal);
