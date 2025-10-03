import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {View} from "react-native";
import CForm from "./Form";
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import {AlertView, CText} from "../../../../uiComponents";
import {userContactLog} from "../../../../store/actions/Auth.action";
import {CONTACT_PREFERENCES, openWhatsApp} from "../helper";
import {openDialScreen} from "../../../../utils/methods";

function PhonePrompt(props) {

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const {callBack, data, errorMessage} = props;

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.userContactLogLoading,
            currentCountry: global.currentCountry,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.currentCountry);

    const userContactLogCallBack = (res, payload) => {
        if(payload?.callbackType === CONTACT_PREFERENCES[1]._id){
            openWhatsApp(t, {
                phoneNumber: `+${payload.phone}`,
            });
        }
        callBack && callBack(res);
    };

    const submit = (values) => {
        let perifix = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes?.length > 1 ?  '' : selectedCountry?.idd?.suffixes[0]}`;
        let payload = _.omit(values, ['phone']);
        payload.phone =  `${perifix.replace(/[^\w\s]/gi, '')}${values.phone.replace(/\s+/g, '')}`;
        payload = {
            ...payload,
            ...(data?.payload ? data?.payload : data)
        }
        dispatch(userContactLog(payload, userContactLogCallBack));
    };

    const contactUs = () => {
        callBack && callBack({});
        openDialScreen();
    };

    return (
        <View style={[GlobalStyle.shortInfoModalContainer, {marginBottom: 0}]}>

            <CText style={GlobalStyle.shortInfoModalTitle}>
                {t('SIGN_UP.WE_COULD_NOT_FIND.TITLE')}
            </CText>
            {errorMessage ? <AlertView
                viewStyle={{marginTop: 15, marginBottom: -5}}
                type={"error"}
                text={errorMessage}
            /> : null}
            <CText style={GlobalStyle.shortInfoModalText}>
                {t('SIGN_UP.WE_COULD_NOT_FIND.SUB_TITLE')}
            </CText>
            <View style={GlobalStyle.shortInfoModalContainerBody}>
                <CForm
                    loading={reduxState.loading}
                    submit={submit}
                    selectedCountry={selectedCountry}
                    contactUs={contactUs}
                />
            </View>
        </View>
    )
}
export default PhonePrompt;
