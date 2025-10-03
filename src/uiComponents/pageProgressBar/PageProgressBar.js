import React from 'react';
import {View} from "react-native";
import Styles from "./PageProgressBar.style";
import {MappedElement} from "../../utils/methods";


function PageProgressBar(props) {

    const {pages = 2, active = 1} = props;

    let pageArray = Array.from({length: pages});

    const renderItem = (obj, index) => {
        return  (
            <View style={[Styles.item, (index+1) <= active && Styles.activeItem]}/>
        )
    };

    return (
        <View style={Styles.container}>
            <MappedElement
                data={pageArray}
                renderElement={renderItem}
            />
        </View>
    )
}

export default React.memo(PageProgressBar);
