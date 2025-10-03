import React from "react";
import {TouchableOpacity, View, ScrollView} from "react-native";
import {CText, ProgressiveImage} from "../../uiComponents";
import {MappedElement} from "../../utils/methods";
import Styles from "./HorizontalList.style";

function HorizontalList(props) {

    const {data = [], onPress, title = '', renderTitleFunc, renderImageFunc, style, itemStyle, itemIconStyle, itemTextStyle, itemTitle = 'name'} = props;

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity style={[Styles.horizontalListItem, itemStyle]}
                              key={index}
                              onPress={() => onPress(item)}>
                <View style={Styles.horizontalListItemIconContainer}>
                    <ProgressiveImage
                        resizeMode="contain"
                        source={!item.image ? renderImageFunc ? renderImageFunc(item) : item.image : item.image}
                        style={[Styles.horizontalListItemIcon, itemIconStyle]}/>
                </View>
                <CText numberOfLines={2} style={[Styles.horizontalListItemTitle, itemTextStyle]}>
                    {renderTitleFunc ? renderTitleFunc(item) : item[itemTitle]}
                </CText>
            </TouchableOpacity>
        )
    };

    return (
        <View style={[Styles.horizontalList, style]}>
            {title ? <CText style={Styles.horizontalListTitle}>{title}</CText> : null}
            <ScrollView horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={Styles.horizontalListScroll}>
                <MappedElement data={data} renderElement={renderItem}/>
            </ScrollView>
        </View>
    )
}

export default React.memo(HorizontalList)
