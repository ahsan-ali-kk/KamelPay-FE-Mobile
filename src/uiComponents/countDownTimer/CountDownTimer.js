import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import {CText} from '../index';
import Styles from './CountDownTimer.style';
import events from "../../utils/events";

function CountDownTimer(props) {

    const {text = 'Request a new code in', initialValue = 60, children, restart, format = '', containerStyle, timerStyle, labelStyle} = props;
    const [time, setTime] = React.useState(initialValue);
    const timerRef = React.useRef(time);

    var timerInterval;

    const start = (value) => {
        timerInterval = setInterval(() => {
            value -= 1;
            if (value < 0) {
                clearInterval(timerInterval);
            } else {
                setTime(value);
            }
        }, 1000);
    };

    useEffect(() => {
        let e = events.addEventListener("restartOTPTimer", (res) => {
            clearInterval(timerInterval);
            start(initialValue);
        });
        return () => {
            events.removeListener('restartOTPTimer', e);
        }
    }, []);

    useEffect(() => {
        start(initialValue);
        return () => {
            clearInterval(timerInterval);
        };
    }, []);

    function secondsToDhms(seconds) {
        seconds = Number(seconds);
        let d = Math.floor(seconds / (3600 * 24));
        let h = Math.floor((seconds % (3600 * 24)) / 3600);
        let m = Math.floor((seconds % 3600) / 60);
        let s = Math.floor(seconds % 60);
        if(format === 'number'){
            // Calculate the hours, minutes, and seconds
            let hours = Math.floor(seconds / 3600);
            let minutes = Math.floor((seconds % 3600) / 60);
            let remainingSeconds = seconds % 60;

            // Format the time as a string
            return hours.toString().padStart(2, '0') + ':' +
                minutes.toString().padStart(2, '0') + ':' +
                remainingSeconds.toString().padStart(2, '0');
        } else {
            let dDisplay = d > 0 ? d + 'Day' : '';
            let hDisplay = h > 0 ? h + 'hour' : '';
            let mDisplay = m > 0 ? m + ' minute ' : '';
            let sDisplay = s > 0 ? s + ' seconds ' : '';
            return dDisplay + hDisplay + mDisplay + sDisplay;
        }
    }

    return <View style={[Styles.timeContainer, containerStyle]}>
        {time ? <View style={Styles.timeInnerContainer}>
            {text ? <CText style={[Styles.timeContainerText, labelStyle]}> {text} </CText> : null}
            <CText style={[Styles.timeContainerText, Styles.timeContainerTextBlue, timerStyle]}>
                {secondsToDhms(time)}
            </CText>
        </View> : children}
    </View>
}

export default memo(CountDownTimer)
