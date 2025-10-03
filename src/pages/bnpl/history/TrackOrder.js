import React from "react";
import {CModal, WebView} from "../../../uiComponents";
import {useTranslation} from "react-i18next";

function TrackOrder(props) {

    const { t } = useTranslation();
    const {isOpen, onClose, uri} = props;

    const headerProps = {
        headerTitle: "History",
        headerRight: true,
        backOnPress: () => onClose()
    };

    return (
        <CModal
            isOpen={isOpen}
            headerProps={headerProps}
            close={() => onClose()}>

            <WebView
                scalesPageToFit={false}
                source={{uri: uri}}
            />

        </CModal>
    )
}

export default React.memo(TrackOrder)
