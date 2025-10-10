import React, {Fragment, useCallback, useState} from 'react';
import {TouchableOpacity, View, ActivityIndicator, Platform} from 'react-native';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Styles from "./DateTimePickerStyle";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from "moment";
import {themes as theme} from "../../theme/colors";
import CText from "../cText/CText";
import MonthPicker from "react-native-month-year-picker";
import {CModal} from "../index";

export const ErrorView = ({message}) => {
    return message ? <CText style={GlobalStyle.errorTextStyle}>{message}</CText> : null;
};




const defaultProps = {
    label: '',
    value: '',
    placeHolder: 'Tap to select',
    error: '',
    activeOpacity: 0.5,
    isVisible: false,
    loading: false,
    disabled: false,
    onChange: () => null
};

function DateTimePicker(props) {

    const {isShow = true, type, inputContainer, isVisible, value, error, onChange, placeHolder, label, activeOpacity,
                            loading, disabled, minimumDate, maximumDate = null, mode = 'date', subLabel, textStyle,
                            inputLabelStyle, displayFormat = 'MM-DD-YYYY'} = {...defaultProps, ...props}

    // const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChangeInner = (selectedDate) => {
        onChange(selectedDate);
        setShow(false)
    };

    const toggle = () => {
        setShow(!show)
    };

    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || value;
            setShow(false);
            onChange(selectedDate);
        },
        [value, show],
    );


    const renderMonthPicker = () => {
        return show ? <MonthPicker
            onChange={onValueChange}
            value={value ? value : new Date()}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
        /> : null
    };

    const renderMonthAndYearPickerModal = () => {
        return  Platform.OS === 'ios' ? (
            <CModal centerView={true}
                    centerViewStyle={{paddingHorizontal: 0}}
                    isOpen={show} close={useCallback}>
                {renderMonthPicker()}
            </CModal>
        ) : show ? renderMonthPicker() : null
    };

    return isShow ? (
        <Fragment>
            <View style={[GlobalStyle.inputContainer, inputContainer]}>
                {label ? <CText style={[GlobalStyle.inputLabel, inputLabelStyle]}> {label} </CText> : null}
                {subLabel ? <CText style={GlobalStyle.inputSubLabel}> {subLabel} </CText> : null}
                <TouchableOpacity
                    disabled={disabled}
                    style={[GlobalStyle.inputInnerContainer, Styles.selectContainer, (error && GlobalStyle.errorBorder)]}
                                  activeOpacity={activeOpacity}
                                  onPress={() => toggle()}>
                    {loading ? <ActivityIndicator style={Styles.buttonLoading}/> :
                        <View style={GlobalStyle.inputIconButton}>
                            <Ionicons name="md-calendar-outline" style={GlobalStyle.inputIcon}/>
                        </View>}
                    <CText style={[Styles.selectButtonText,
                        {fontSize: 11},
                        textStyle,
                        !value && {color: theme['light'].colors.primaryLighten}]}>
                        {value ? moment(value).format(displayFormat) : placeHolder}
                    </CText>
                </TouchableOpacity>
                <ErrorView message={error} />
            </View>
            {type === 'MONTH_AND_YEAR' ?
                renderMonthAndYearPickerModal()
             : <DateTimePickerModal
                    testID="dateTimePicker"
                    isVisible={isVisible || show}
                    mode={mode}
                    date={value ? value : new Date()}
                    onConfirm={onChangeInner}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    onCancel={() => toggle()}
                    isDarkModeEnabled={false}
                />}
        </Fragment>
    ) : null;
}


export default DateTimePicker;
