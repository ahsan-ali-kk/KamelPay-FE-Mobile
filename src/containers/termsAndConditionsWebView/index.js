import React, {forwardRef, useImperativeHandle, useState} from "react";
import {CModal, WebView} from "../../uiComponents";

const TermsAndConditionsWebView = forwardRef((props, ref) => {

    const {title} = props;
    const [source, setSource] = useState(null);

    const [isOpen, updateIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        toggleModal(val) {
            updateIsOpen(true);
            setSource(val)
        },
    }));

    const onClose = () => {
        updateIsOpen(false);
        setSource(null)
    };

    const headerProps = {
        headerTitle: title || ' ',
        headerRight: true,
        backOnPress:() => onClose()
    };

    return (
        <CModal isOpen={isOpen} headerProps={headerProps} close={() => onClose()}>

            <WebView
                scalesPageToFit={false}
                source={source}
            />

        </CModal>
    )

});

export default TermsAndConditionsWebView;
