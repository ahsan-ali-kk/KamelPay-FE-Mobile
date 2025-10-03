import React, {useEffect} from "react";
import {Container, ViewContainer} from "../../containers";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import Styles from "../auth/Auth.style";
import {View} from "react-native";
import {CButton, CText, ProgressiveImage} from "../../uiComponents";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {STATUS} from "./helper";
import {notificationsApproval} from "../../store/actions/Auth.action";
import Popup from "../../uiComponents/popup/Popup";
import {useNavigation} from "@react-navigation/native";


function NotificationsApproval(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const {route: {params: data}} = props;

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth?.notificationApprovalLoading,
        }
    });

    const {loading} = reduxState;


    useEffect(() => {

    }, []);

    const headerProps = {
        headerTitle: " ",
        headerRight: true,
    };


    const navigationReset = () => {
        Popup.hide();
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        });
    };

    const approvalCallback = (res) => {
        if(res?.error){
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: t('POPUPS.ERROR.TITLE'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () => {
                            Popup.hide()
                        }
                    }
                ]
            })
        } else {
            Popup.show({
                isVisible: true,
                showClose: false,
                type: 'Success',
                title:  t('GLOBAL.SUCCESSFULLY'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => {
                            navigationReset();
                        }
                    },
                ]
            })
        }
    };

    const confirm = (status) => {
        let payload = {
            status: status,
            token: data?.data?.token || '',
        };
        console.log('confirm', payload, data);
        dispatch(notificationsApproval(payload, approvalCallback))
    }

    const renderFooter = () => {
        return(
            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('GLOBAL.CONFIRM')} loading={loading} onPress={() => confirm(STATUS.APPROVED)}/>
                <CButton type={'without_outline'} title={t('GLOBAL.CANCEL')} onPress={() => confirm(STATUS.REJECTED)}/>
            </View>
        )
    };

    return (
        <Container headerProps={headerProps}
                   renderFooter={renderFooter}
                   loading={loading}
        >
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <View style={[Styles.titleAndText, {marginTop: 30}]}>
                    <ProgressiveImage
                        style={[{width: 82, height: 82, marginBottom: 30}]}
                        resizeMode={'contain'}
                        source={require('../../assets/images/3d-vector/wating-approval.png')}
                    />
                    <CText style={Styles.title}>{data?.title}</CText>
                    <CText style={[Styles.text, {fontSize: 14}]}>{data?.description}</CText>
                </View>
            </ViewContainer>
        </Container>
    )
}

export default React.memo(NotificationsApproval)
