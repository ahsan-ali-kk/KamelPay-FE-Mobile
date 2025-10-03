import React, {useState} from "react";
import { WebView } from 'react-native-webview';
import {ViewContainer} from "../../containers";
import {CLoading} from "../index";

function WebViewComponent(props) {

    const {source, scalesPageToFit, loadingText} = props;
    const [isLoading, updateIsLoading] = useState(true);

    return (
        <ViewContainer>
            <CLoading showAnimation={true}
                      text={loadingText}
                      loading={isLoading}/>
            <WebView source={source}
                     scalesPageToFit={scalesPageToFit}
                     onLoad={() => updateIsLoading(false)}
                     {...props}
            />
        </ViewContainer>
    )
}

export default React.memo(WebViewComponent)
