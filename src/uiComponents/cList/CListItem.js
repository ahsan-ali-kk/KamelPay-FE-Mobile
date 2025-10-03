import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {ProgressiveImage, CText} from '../../uiComponents';
import Styles from "./CListStyle";
import KamelPayIcon from "../../assets/icons/KamelPayIcon";
import {nameFirstLetter} from "../../utils/methods";

function CListItem(props) {
    const {style, titleStyle, listImageContainer, listImage, onPress, source, title, localSource, numberOfLines = 2,
        iconRadius = 26, resizeMode = 'cover', defaultSource, lastItem = false, description, renderActionButtons,
        children, rightIconName, leftIconName, avatarText, avatarStyle, avatarTextStyle, avatarBadge, avatarBadgeStyle, subTitleStyle} = props;
    return (
        <TouchableOpacity style={[Styles.listItem, style, lastItem && Styles.lastListItem]} onPress={onPress}>
            {leftIconName ? <KamelPayIcon style={Styles.listItemLeftIcon} name={leftIconName}/> : null}
            {localSource === 'avatar' ? <View style={[Styles.avatar, avatarStyle]}>
                <CText numberOfLines={1} style={[Styles.avatarText, avatarTextStyle]}>
                    {avatarText ? avatarText : nameFirstLetter(title)}
                </CText>
                {avatarBadge ? <View style={avatarBadgeStyle}/> : null}
            </View> : localSource ?  <View style={[Styles.listItemIcon, listImageContainer, {borderRadius: iconRadius}]}>
                <Image
                    source={localSource}
                    resizeMode={resizeMode}
                    style={[Styles.listItemIconImage, listImage]}/>
            </View> : source ? <View style={[Styles.listItemIcon, listImageContainer, {borderRadius: iconRadius}]}>
                <ProgressiveImage
                    source={source}
                    resizeMode={resizeMode}
                    fallback
                    defaultSource={defaultSource}
                    style={[Styles.listItemIconImage, listImage]}/>
            </View> : null}
            <View style={Styles.listItemContent}>
                {title ? <CText style={[Styles.listItemText, titleStyle]} numberOfLines={numberOfLines}>{title}</CText> : null}
                {description ? <CText style={[Styles.listItemSubText, subTitleStyle]} numberOfLines={numberOfLines}>{description}</CText> : null}
                {children}
            </View>
            {rightIconName ? <KamelPayIcon style={Styles.listItemRightIcon} name={rightIconName}/> : null}
            {renderActionButtons && renderActionButtons()}
        </TouchableOpacity>
    )
}

CListItem.defaultProps = {
    title: '',
    item: {}
};

export default CListItem;
