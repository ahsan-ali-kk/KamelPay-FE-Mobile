import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Style from './PopupStyle';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CButton, ProgressiveImage, CText, CModal} from "../index";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {MappedElement} from "../../utils/methods";
import ViewShot from "react-native-view-shot";
import LottieView from "lottie-react-native";

class Popup extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    static popupInstance;

    static show({...config}) {
        this.popupInstance?.start(config);
    }

    static hide() {
        this.popupInstance?.hidePopup();
    }

    state = {
        isVisible: false,
    };

    start({...config}) {
        this.setState({
            isVisible: true,
            type: config?.type,
            source: config?.source,
            title: config?.title,
            customVector: config?.customVector,
            imageSize: config?.imageSize,
            buttonLastType: config?.buttonLastType,
            text: config?.text,
            subText: config?.subText,
            showClose: config?.showClose !== false,
            actions: config?.actions || [],
            callback: config?.callback ? config.callback : this.defaultCallback(),
            timing: config?.timing,
            autoClose: config?.autoClose || false,
            styleContainer: config?.styleContainer || null,
            buttonContainerStyle: config?.buttonContainerStyle || null,
            imageStyle: config?.imageStyle || null,
            titleStyle: config?.titleStyle || null,
            subTitleStyle: config?.subTitleStyle || null,
            subTextStyle: config?.subTextStyle || null,
            styleMainContainer: config?.styleMainContainer || null,
            viewContainerStyle: config?.viewContainerStyle || null,
            customView: config?.customView || null,
        });

        if (config.autoClose && config.timing !== 0) {
            const duration = config.timing > 0 ? config.timing : 5000;
            setTimeout(() => {
                this.hidePopup();
                this.state.callback && this.state.callback();
            }, duration);
        }
    }

    hidePopup() {
        this.setState({isVisible: false});
    }

    defaultCallback() {
        return this.hidePopup();
    }

    handleImage(type) {
        switch (type) {
            case 'Success':
                return {
                    uri: require('../../assets/animations/success-animation'),
                    style: {
                        width: 250,
                        height: 250,
                        marginBottom: -50,
                        marginTop: -20,
                    }
                };
            case 'Error':
                return {
                    uri: require('../../assets/animations/error-animation'),
                    style: {
                        width: 150,
                        height: 150,
                    }
                };
            case 'Warning':
                return {
                    uri: require('../../assets/animations/warning-animation'),
                    style: {
                        width: 150,
                        height: 150,
                    }
                };
            case 'Custom':
                return this?.state?.customVector;
        }
    }

    renderImageView = () => {
        const {type, imageSize, customView, source, imageStyle} = this.state;
        if(type === 'customView'){
            return customView()
        } else if(type === 'image') {
            return  <ProgressiveImage
                resizeMode={'contain'}
                source={source}
                style={[Style.vectorImage, imageSize === 'normal' && Style.vectorImageNormal, imageStyle]}
            />
        } else if(type) {
            return <View style={Style.animationContainer}>
                <LottieView
                    source={this.handleImage(type).uri}
                    style={[Style.animation, this.handleImage(type).style]}
                    autoPlay loop />
            </View>
        } else {
            return null
        }
    };

    render(){
        const {actions, isVisible = false, title, text, subText, showClose, styleMainContainer, styleContainer, viewContainerStyle, titleStyle,
            subTitleStyle, subTextStyle, buttonLastType, callback, buttonContainerStyle} = this.state;

        return (
            <CModal isOpen={isVisible} centerView={true} centerViewStyle={styleMainContainer}>
                <TouchableOpacity activeOpacity={1}
                                  onPress={() => callback ? callback() : null}
                                  style={[GlobalStyle.fullContainer, {backgroundColor: 'transparent'}]}>

                    <View ref={(c) => (this._root = c)} style={[Style.container, styleContainer]}>
                        <ViewShot ref={this.myRef} style={Style.view}>
                            <View style={[Style.viewContainer, viewContainerStyle]}>
                                <View style={Style.popupHeader}>

                                    {showClose ? <TouchableOpacity style={Style.popupHeaderButton} onPress={() => this.hidePopup()}>
                                        <KamelpayIcon style={Style.popupHeaderButtonIcon} name="close"/>
                                    </TouchableOpacity> : null}

                                    {this.renderImageView()}

                                </View>

                                {title ? <CText style={[Style.popupTitle, !text && {marginBottom: 25}, titleStyle]}>{title}</CText> : null}
                                {text ? <CText style={[Style.popupText, subTitleStyle]}>{text}</CText> : null}
                                {subText ? <CText style={[Style.popupSubText, subTextStyle]}>{subText}</CText> : null}

                                {actions?.length ? <View style={[Style.buttonContainer, buttonContainerStyle]}>
                                    <MappedElement
                                        data={actions}
                                        renderElement={(option, index) => {
                                            return option?.children ? option?.children : (
                                                <CButton
                                                    title={option.text}
                                                    key={index}
                                                    onPress={option.callback}
                                                    type={option?.buttonType ? option?.buttonType : actions?.length >! 0 && index === 1 ? buttonLastType || 'without_outline' : ''}
                                                    buttonStyle={[Style.buttonStyle, option?.buttonStyle]}
                                                    buttonText={[option?.buttonText]}
                                                />
                                            )
                                        }}
                                    />
                                </View> : null}
                            </View>

                        {/*</ViewShot>*/}
                        </ViewShot>
                    </View>
                </TouchableOpacity>
            </CModal>
        )
    }

}


export default Popup;
