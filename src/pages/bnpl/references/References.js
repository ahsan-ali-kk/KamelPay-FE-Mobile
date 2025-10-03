import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {useNavigation} from "@react-navigation/native";
import {CModal} from "../../../uiComponents";
import CForm from "./Form";

function References(props) {

    const {params, isOpen, onClose, onSubmit, bnplDetails} = props;
    const { t } = useTranslation();
    const navigation = useNavigation();

    const headerProps = {
        headerTitle: 'References Information',
        headerRight: true,
        backOnPress: () => onClose()
    };

    const reduxState = useSelector(({global, auth, advanceSalary, referral}) => {
        return {
            currentCountry: global.currentCountry,
            nationalCountry: global.nationalCountry,
            user: auth.user,
        }
    });

    const [selectedCountry, updateSelectedCountry] = useState(reduxState.nationalCountry);


    const submit = (values) => {
        let selectedCountryPrefix = `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes?.length > 1 ?  '' : selectedCountry?.idd?.suffixes[0]}`;
        let currentCountryPrefix = `${reduxState?.currentCountry?.idd?.root}${reduxState?.currentCountry?.idd?.suffixes?.length > 1 ?  '' : reduxState?.currentCountry?.idd?.suffixes[0]}`;
        let updatedValues = _.omit(values, ['firstReferencePhone', 'localFriendPhone']);
        let payload = {
            ...values,
            ...updatedValues
        };
        payload.firstReferencePhone =  `${selectedCountryPrefix.replace(/[^\w\s]/gi, '')}${values.firstReferencePhone.replace(/\s+/g, '')}`;
        payload.localFriendPhone =  `${currentCountryPrefix.replace(/[^\w\s]/gi, '')}${values.localFriendPhone.replace(/\s+/g, '')}`;
        onSubmit(payload)
    };

    return (
        <CModal
            isOpen={isOpen}
            headerProps={headerProps}
            close={onClose}>
            <CForm
                submit={submit}
                selectedCountry={selectedCountry}
                currentCountry={reduxState?.currentCountry}
                currentUserNumber={reduxState?.user?.phone}
                bnplDetails={bnplDetails}
            />
        </CModal>
    )
}

export default React.memo(References)
