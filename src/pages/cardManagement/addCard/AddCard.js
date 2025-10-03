import React, {memo} from "react";
import CForm from "./Form";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {linkAnotherCard} from "../../../store/actions/CardManagement.action";
import {getProfile} from "../../../store/actions/Auth.action";
import {useTranslation} from "react-i18next";
import {setHours} from "../../../utils/methods";

function AddCard(props) {

    const { t } = useTranslation();

    const {route: {params: data}, navigation} = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global, cardManagement}) => {
        return {
            loading: cardManagement.linkCardLoading,
            user: auth.user,
        }
    });


    const callBack = () => {
        dispatch(getProfile());
        navigation.goBack();
    };

    const submit = (values) => {
        let payload = {
            ...values
        }
        if(payload?.cardExpiry){
            payload.cardExpiry = setHours(payload.cardExpiry, 'to')
        }
        if(payload.emirateID){
            payload.emirateID = `${values.emirateID.replace(/-/g,"")}`;
        }
        dispatch(linkAnotherCard(payload, callBack))
    };

    const headerProps = {
        headerTitle: t('PAGE_TITLE.LINK_NEW_CARD'),
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>

                <CForm loading={reduxState.loading}
                       submit={submit}
                       isLightUser={reduxState.user?.isLightUser}
                />

        </Container>
    )
}
export default memo(AddCard);
