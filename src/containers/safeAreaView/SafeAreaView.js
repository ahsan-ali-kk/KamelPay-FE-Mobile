import React, {memo} from 'react';
import { SafeAreaView as SafeAreaContext } from 'react-native-safe-area-context';
import { themes as theme } from '../../theme/colors';

const SafeAreaView = ({style, children, testID, edges = ['top', 'left', 'right'], vertical = true, ...props}) => {
    return (
        <SafeAreaContext
            style={[{backgroundColor: theme['light'].colors.backgroundColor }, style]}
            edges={edges ? edges : vertical ? ['right', 'left'] : undefined}
            testID={testID}
            {...props}>
            {children}
        </SafeAreaContext>
    )
};

export default memo(SafeAreaView);
