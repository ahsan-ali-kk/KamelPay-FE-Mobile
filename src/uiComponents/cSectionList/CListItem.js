import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {ProgressiveImage, CText} from '../../uiComponents';
import Styles from "./CSectionList.style";


const defaultProps = {
    title: '',
    item: {}
};

function CListItem(props) {
    const {onPress, source, title, localSource, numberOfLines = 2, iconRadius = 26, resizeMode = 'cover', defaultSource, lastItem = false, description} = {...defaultProps, ...props};
    return (
        <TouchableOpacity style={[Styles.listItem, lastItem && Styles.lastListItem]} onPress={onPress}>
            {localSource ?  <View style={[Styles.listItemIcon, {borderRadius: iconRadius}]}>
                <Image
                    source={localSource}
                    resizeMode={resizeMode}
                    style={[Styles.listItemIconImage]}/>
            </View> : source ? <View style={[Styles.listItemIcon, {borderRadius: iconRadius}]}>
                <ProgressiveImage
                    source={source}
                    resizeMode={resizeMode}
                    fallback
                    defaultSource={defaultSource}
                    style={[Styles.listItemIconImage]}/>
            </View> : null}
            <View style={Styles.listItemContent}>
                <CText style={Styles.listItemText} numberOfLines={numberOfLines}>{title}</CText>
                {description ? <CText style={Styles.listItemSubText} numberOfLines={numberOfLines}>{description}</CText> : null}
            </View>
        </TouchableOpacity>
    )

}


export default CListItem;
