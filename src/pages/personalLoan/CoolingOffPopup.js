import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {AlertView, CButton, CText, CToggleSwitch} from "../../uiComponents";

const CoolingOffPopup = ({ onConfirm }) => {
    const { t } = useTranslation();
    const [isAccepted, setIsAccepted] = useState(true);

    return (
        <View style={GlobalStyle.coolingOffPeriodContainer}>
            <View style={[GlobalStyle.toggleView]}>
                <CText style={[GlobalStyle.toggleViewText, GlobalStyle.boldText]}> COOLING-OFF PERIOD </CText>
                <CToggleSwitch
                    style={{}}
                    isOn={isAccepted}
                    onToggle={() => setIsAccepted(prev => !prev)}
                />
            </View>

            <CText style={[GlobalStyle.coolingOffPeriodText]}>
                Khiyar Al-Shart ‘Cooling-off Period’ is defined as a period of time after a contract is agreed during which the buyer can cancel the contract without incurring a penalty. Customers may waive the cooling-off period of complete 5 business days by signing a written waiver provided by Ajman Bank.
            </CText>

            {!isAccepted ? <AlertView
                viewStyle={{marginTop: 25}}
                type="error"
                text={"If you choose not to waive the cooling-off period, you won’t be able to apply again for the next 5 business days."}
            /> : null}

            <CButton
                buttonStyle={{marginTop: 25}}
                title={t("GLOBAL.CONFIRM")}
                onPress={() => {
                    onConfirm(isAccepted);
                }}
            />
        </View>
    );
};

export default React.memo(CoolingOffPopup);
