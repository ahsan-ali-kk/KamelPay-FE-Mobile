import * as React from 'react';
import {useNavigationContainerRef} from "@react-navigation/native";

export const navigationRef = null;
// export let navigationRef = null;

export function navigate(name, params) {
    if (navigationRef && navigationRef.isReady()) {
        if(navigationRef.getCurrentRoute().name !== name) {
            navigationRef.navigate(name, params);
        }
    }
}

export function navigationReset(obj) {
    if (navigationRef && navigationRef.isReady()) {
        if(navigationRef.getCurrentRoute().name !== obj.routes[0].name) {
            navigationRef?.current?.reset(obj);
        }
    }
}
