import React, {Fragment} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from "./AlterView.style";
import {themes as theme} from "../../theme/colors";
import KamlepayIcon from '../../assets/icons/KamelPayIcon';
import {CButton, CLoading} from '../../uiComponents';
import {CText} from "../index";
import Style from "../popup/PopupStyle";
import {MappedElement} from "../../utils/methods";

const AlertView = props => {
    const {loading = false, title = '', text = '', subText = '', viewStyle, onPress, iconStyle, type = '', iconName,
        textStyle, showIcon = true, buttonProps, viewContentStyle, actions, buttonContainerStyle, buttonLastType,
        description, descriptionTextStyle, children, listData, disabled} = props;

    const getPropWithType = (value) => {
        switch (value) {
            case 'success':
                return {
                    icon: 'correct',
                    backgroundColor: theme['light'].colors.successLight,
                    color: theme['light'].colors.success,
                };
            case 'error':
                return {
                    icon: 'close',
                    backgroundColor: theme['light'].colors.errorLight,
                    colorType: theme['light'].colors.error,
                    color: theme['light'].colors.error,
                };
            case 'offers':
                return {
                    icon: 'offers',
                    backgroundColor: theme['light'].colors.successLight,
                    color: theme['light'].colors.success,
                };
            default:
                return {
                    icon: 'new-info',
                    backgroundColor: theme['light'].colors.secondary7,
                    color: theme['light'].colors.secondary,
                };
        }
    };
    return(
        <TouchableOpacity onPress={onPress}
                          disabled={disabled ? disabled : (buttonProps ? true : loading)}
                          style={[styles.view, {backgroundColor: getPropWithType(type).backgroundColor}, viewStyle]}>
            {loading ? <CLoading loading={true}
                                  color={getPropWithType(type).color}
                                  style={{position: 'relative'}}
                                  transparent text="hide"/> : <Fragment>
                {showIcon ? <KamlepayIcon name={iconName ? iconName : getPropWithType(type).icon}
                                          style={[styles.viewIcon, {color: getPropWithType(type).color}, iconStyle]}/> : null}
               <View style={{flex: 1}}>
                   {title ? <CText style={[styles.viewTitle, {color: getPropWithType(type).color}, textStyle]}>
                       {title}
                   </CText> : null}
                   {(text || subText || buttonProps) ? <View style={[styles.viewContent, viewContentStyle]}>
                       <CText style={[styles.viewText, {color: getPropWithType(type).color}, textStyle]}>
                           {text}
                           {subText ? <Fragment>
                               {'\n'}
                               <CText style={styles.viewTextBold}>{subText}</CText>
                           </Fragment> : null}
                       </CText>

                       {buttonProps ? <CButton
                           {...buttonProps}
                           type="outline"
                           colorType="secondary"
                           buttonStyle={[
                               styles.viewButton,
                               {
                                   borderColor: getPropWithType(type).color
                               }
                           ]}
                           buttonText={[
                               styles.viewButtonText,
                               {
                                   color: getPropWithType(type).color
                               }
                           ]}
                       /> : null}
                   </View> : null}
                   {description ? <CText style={[styles.descriptionTextStyle, {color: getPropWithType(type).color}, descriptionTextStyle]}>
                       {description}
                   </CText> : null}
                   {listData ? <View style={[styles.infoListContainer]}>
                       <MappedElement
                           data={listData}
                           renderElement={(obj, i) => {
                               return (
                                   <View key={i} style={[styles.infoListItem]}>
                                       <CText  style={[styles.descriptionTextStyle, {color: getPropWithType(type).color, marginRight: 5}]}>
                                           {i+1}.
                                       </CText>
                                       <CText key={i} style={[styles.descriptionTextStyle, {color: getPropWithType(type).color}]}>
                                           {obj?.text}
                                       </CText>
                                   </View>
                               )
                           }}
                       />
                   </View> : null}
                   {actions?.length ? <View style={[styles.buttonContainer, buttonContainerStyle]}>
                       <MappedElement
                           data={actions}
                           renderElement={(option, index) => {
                               return option?.children ? option?.children : (
                                   <CButton
                                       title={option?.text}
                                       key={index}
                                       onPress={option?.onPress}
                                       type={option?.buttonType ? option?.buttonType : actions?.length >! 0 && index === 1 ? buttonLastType || 'without_outline' : ''}
                                       buttonStyle={[styles.buttonStyle, option?.buttonStyle]}
                                       buttonText={[option?.buttonText, option?.buttonTextStyle]}
                                   />
                               )
                           }}
                       />
                   </View> : null}
               </View>
            </Fragment>}

        </TouchableOpacity>
    )
};

AlertView.defaultProps = {
    text: '',
    onPress: () => null,
    type: 'primary',
};

export default React.memo(AlertView);
