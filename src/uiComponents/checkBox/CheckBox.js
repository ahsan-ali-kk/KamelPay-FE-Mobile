import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {CText} from '../index';
import Style from './CheckBox.style';
import { AntDesign } from '@react-native-vector-icons/ant-design';

const defaultProps = {
    title: '',
    onChange: () => null,
    activeOpacity: 0.5,
    value: false,
    disabled: false,
};

const CheckBox = (props) => {

    const {hideCheckBox, title, value, onChange, disabled, activeOpacity, clickAbleText, clickAbleTextFunc,
                      checkBoxTitleStyle, checkBoxTitleContainerStyle, checkBoxContainerStyle, checkBoxTitleInnerContainerStyle} = {...defaultProps, ...props};
    return (
        <TouchableOpacity style={[Style.checkBoxContainer, checkBoxContainerStyle]}
                          disabled={disabled}
                          activeOpacity={activeOpacity}
                          onPress={onChange}>
            {!hideCheckBox ? <View style={[Style.checkBoxView, value && Style.checkedBoxView]}>
                {value ? <AntDesign style={Style.checkBoxCheck} name="check"/> : null}
            </View> : null}
            <View style={[Style.checkBoxTitleContainer, checkBoxTitleContainerStyle]}>
                {title || clickAbleText ? <View style={[{flexDirection: 'row', flex: 1, flexWrap:'wrap'}, checkBoxTitleInnerContainerStyle]}>
                    {title ? <CText style={Style.checkBoxTitle}>{title}</CText> : null}
                    {clickAbleText ? <TouchableOpacity onPress={() => clickAbleTextFunc && clickAbleTextFunc()}>
                        <CText style={[Style.checkBoxTitle, Style.checkBoxSecondTitle, checkBoxTitleStyle]}>
                            {clickAbleText}
                        </CText>
                    </TouchableOpacity>: null}
                </View>: null}
            </View>
        </TouchableOpacity>
    )
};



export default memo(CheckBox);
