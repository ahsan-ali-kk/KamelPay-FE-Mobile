import React, {forwardRef, useImperativeHandle, useState} from "react";
import {CModal, CText, WebView} from "../../uiComponents";
import {useSelector} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";

const Turnstile = forwardRef((props, ref) => {

    const { t } = useTranslation();

    const {onChange} = props;
    const [isOpen, updateIsOpen] = useState(false);
    const [payload, updatePayload] = useState(false);
    const [type, updateType] = useState('');

    const reduxState = useSelector(({global}) => {
        return {
            data: global.applicationVersions,
            loading: global.getApplicationVersionsLoading
        }
    });

    useImperativeHandle(ref, () => ({
        toggleModal(value, payload, type = '') {
            updateIsOpen(value);
            updatePayload(payload || null);
            updateType(type);
        },
    }));


    const {data} = reduxState;

    const handleMessage = (event) => {
        const token = event.nativeEvent.data;
        onChange && onChange(token, payload, type);
        updateIsOpen(false);
        updatePayload(null);
        updateType('');
    };

    const handleClose = () => {
        updateIsOpen(false);
        updatePayload(null);
        updateType('');
    };

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => updateIsOpen(false)}>
            <View style={GlobalStyle.centerModalCenterViewContainer}>
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0, {marginTop: 0}]}>
                    Verification
                </CText>
                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => updateIsOpen(false)}>
                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                </TouchableOpacity>
                <View style={{marginTop: 15, minHeight: 100}}>
                    <WebView
                        loadingText={'hide'}
                        originWhitelist={['*']}
                        onMessage={handleMessage}
                        scalesPageToFit={false}
                        mixedContentMode="compatibility"
                        onShouldStartLoadWithRequest={(event) => event.mainDocumentURL === data?.baseUrl}
                        androidHardwareAccelerationDisabled={true}
                        source={{
                            baseUrl: `${data?.baseUrl}`,
                            html: `<!DOCTYPE html> <html>
                                      <head>
                                      <meta name="viewport" content="width=device-width, initial-scale=1">
                                       <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_turnstileCb" async defer></script>
                                      </head>
                                      <body>
                                         <div id="myWidget" style="text-align: center;"></div>
                                         <script>
                                            // This function is called when the Turnstile script is loaded and ready to be used.
                                            // The function name matches the "onload=..." parameter.
                                            function _turnstileCb() {
                                                    turnstile.render('#myWidget', {
                                                    sitekey: '0x4AAAAAAAI1BuKosLXAsGsh',
                                                    // sitekey: '2x00000000000000000000AB',
                                                    // sitekey: '3x00000000000000000000FF',
                                                      callback: (token) => {
                                                        // Success callback, which sets the token into a separate store slice.
                                                        window.ReactNativeWebView.postMessage(token);
                                                      },
                                                });
                                            }
                                         </script>
                                      </body>
                                    </html>`,
                        }}
                    />
                </View>
            </View>
        </CModal>
    );
});

export default Turnstile
