import React, {useEffect, useRef, useState} from 'react';
import {Animated} from "react-native";

function Collapsible2(props) {

    const {children, collapsedHeight = 0, style, innerContainerStyle, collapsed, wrapper, renderBottom, isUpdate} = props;

    const ref = useRef(null);

    const [animatedHeight] = useState(new Animated.Value(collapsedHeight));

    useEffect(() => {
        if(ref) {
           setTimeout(() => {
               ref?.current?.measureLayout(ref?.current, (x, y, width, height) => {
                   if(collapsed) {
                       Animated.timing(animatedHeight, {
                           toValue: collapsedHeight,
                           duration: height+100,
                           useNativeDriver: false
                       }).start()
                   } else {
                       Animated.timing(animatedHeight, {
                           toValue: height,
                           duration: height+100,
                           useNativeDriver: false
                       }).start();
                   }
               });
           })
        }
    }, [collapsed, ref, isUpdate]);


    return(
        <Animated.View style={style}>
           <Animated.View style={[wrapper, {height: animatedHeight, overflow: 'hidden'}]}>
               <Animated.View ref={ref} style={innerContainerStyle}>
                   {children}
               </Animated.View>
           </Animated.View>
            {renderBottom && renderBottom}
        </Animated.View>
    )
}
export default Collapsible2
