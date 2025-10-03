import React from "react";
import {Container} from "../../../containers";
import CForm from "./Form";
import {useDispatch, useSelector} from "react-redux";
import {saveAdditionalInfo} from "../../../store/actions/Auth.action";
import {useTranslation} from "react-i18next";

function UserAdditionalInfo(props) {
    const { t } = useTranslation();

    const {route: { params: data }, navigation} = props;

    const headerProps = {
        headerTitle: t('PAGE_TITLE.HOME_ADDRESS'),
        headerRight: true,
        hideSetting: false,
        hideLogout: false,
    };

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.saveAdditionalInfoLoading,
            user: auth.user,
        }
    });

    const callBack = () => {
        if(data?.routeName === 'goBack') {
            navigation.goBack()
        } else if(data?.routeName === 'send_money') {
            navigation.goBack()
        } else {
            navigation.navigate(data?.routeName, {
                ...(data?.pageType && {pageType: data?.pageType})
            })
        }
    };

    const next = (values) => {
        dispatch(saveAdditionalInfo(values, callBack))
    };

    return(
        <Container headerProps={headerProps}>
            <CForm
                data={data?.data}
                loading={reduxState.loading}
                submit={next}
            />
        </Container>
    )
}

export default UserAdditionalInfo
