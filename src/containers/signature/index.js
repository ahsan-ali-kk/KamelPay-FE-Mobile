import React, {useRef, useState} from "react";
import {View} from "react-native";
import {CModal, CText, CButton} from "../../uiComponents";
import {useTranslation} from "react-i18next";
import SignatureScreen from "react-native-signature-canvas";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {ViewContainer} from "../index";
import AuthStyles from "../../pages/auth/Auth.style";

function Signature(props) {

    const { t } = useTranslation();
    const ref = useRef();

    const { isOpen = false, close } = props;
    const [signature, setSignature] = useState(null);


    const headerProps = {
        headerTitle: t("SIGNATURE.SIGNATURE"),
        headerRight: true,
        backOnPress:() => onClose("BACK")
    };

    const onClose = (type, signature = null) => {
        close && close(type, signature);
    };

    const handleOK = (signature) => {
        setSignature(signature);
    };

    const handleSubmit = () => {
        onClose("SUBMIT", signature)
    };

    const handleClear = () => {
        setSignature(null);
        ref.current.clearSignature();
    };

    const handleConfirm = () => {
        console.log("end");
        ref.current.readSignature();
    };

    const style = `.m-signature-pad--footer {display: none; margin: 0px; height: 100%}`;


    const renderFooter = () => {
        return(
            <View style={GlobalStyle.listFooterButton}>
                <CButton title={signature ? t("GLOBAL.NEXT") : t("GLOBAL.CONFIRM")} onPress={signature ? handleSubmit : handleConfirm} />
                {signature ? <CButton type={'without_outline'} title="Clear" onPress={handleClear} /> : null}
            </View>
        )
    };

    return (
        <CModal
            isOpen={isOpen}
            headerProps={headerProps}
            close={() => onClose("BACK")}>
            <ViewContainer
                scrolled={false}
               // contentContainerStyle={AuthStyles.scrollContainer}
                style={[AuthStyles.scrollContainer, {paddingHorizontal: 0}]}
               renderFooter={() => renderFooter()}
            >
              <View style={[AuthStyles.scrollContainer, {paddingHorizontal: 30}]}>
                  <View style={[AuthStyles.titleAndText, {marginTop: 30}]}>
                      <CText style={AuthStyles.title}>
                        {/* {t("SIGNATURE.TITLE")}  */}
                        Please sign with your fingers as per Emirates ID
                        </CText>
                      <CText style={AuthStyles.text}>
                          {t("SIGNATURE.SUB_TITLE")}
                      </CText>
                  </View>
                  <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
              </View>
            </ViewContainer>

        </CModal>
    )
}

export default React.memo(Signature)
