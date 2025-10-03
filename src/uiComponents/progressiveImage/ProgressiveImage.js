import React  from 'react';
import {ActivityIndicator}  from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import {themes} from "../../theme/colors";
const Image = createImageProgress(FastImage);

const ProgressiveImage = (props) =>  {
    return  <Image {...props}
                   LoadingIndicatorComponent={ActivityIndicator}
                   indicatorProps={{
                       size: 32,
                       borderWidth: 0,
                       color: props?.indicatorColor || themes['light'].colors.primary,
                   }}
    />
};

export default React.memo(ProgressiveImage);
