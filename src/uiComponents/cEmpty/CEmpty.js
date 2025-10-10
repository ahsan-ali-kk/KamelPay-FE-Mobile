import React from "react";
import { View } from "react-native";
import styles from "./CEmptyStyle";
import {ProgressiveImage, CText} from '../index';

function CEmpty({text = 'Empty', style, subText, icon, iconStyle, resizeMode}) {
    return (
        <View style={[styles.container, style]}>
            <ProgressiveImage
                style={[styles.icon, iconStyle]}
                resizeMode={resizeMode}
                source={icon ? icon : require('../../assets/images/empty.png')}/>
            {text ? <CText style={styles.text}>{text}</CText> : null}
            {subText ? <CText style={styles.subText}>{subText}</CText> : null}
        </View>
    );
}



export default React.memo(CEmpty)
