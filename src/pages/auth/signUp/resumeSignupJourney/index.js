import React, {useState, memo, useEffect} from 'react';
import {AlertView} from '../../../../uiComponents';
import {useTranslation} from "react-i18next";
import {
    getValueIntoAsyncStorage,
    removeItemIntoAsyncStorage
} from "../../../../utils/asyncStorage/Functions";
import {DRAFT_SIGNUP_ID} from "../../../../utils/asyncStorage/Constants";
import {resumeSignupJourney} from "../../../../store/actions/Auth.action";
import {errorPopup, JOURNEY_BEGIN, ROUTES_AGAINST_STATUS} from "../helper";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";

function ResumeSignupJourney(props) {
    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        (async () => {
            let obj = await getValueIntoAsyncStorage(DRAFT_SIGNUP_ID);
            if(obj && Object.keys(obj).length){
                setUserData(JSON.parse(obj));
            }
        })()
    }, [navigation]);

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.resumeSignupJourneyLoading,
        }
    });

    const startNew = async () => {
        await removeItemIntoAsyncStorage(DRAFT_SIGNUP_ID);
        setUserData(null);
        navigation.navigate("findUser", {
            journeyBegin: JOURNEY_BEGIN.NEW._id
        });
    }

    const continueSetupCallback = (res) => {
        if(res?.error){
            errorPopup(t, res?.data?.message || "Something went wrong");
        } else {
            let routeName = res?.data?.status ? ROUTES_AGAINST_STATUS[res?.data?.status]?.routeName : ''
            if(routeName){
                navigation.navigate(routeName, {
                    token: res?.data?.token
                });
            }

        }
    }

    const continueSetup = (payload) => {
        dispatch(resumeSignupJourney(payload, continueSetupCallback));
    };

    return userData && Object.keys(userData).length ? (
        <AlertView
            disabled={true}
            // loading={reduxState.loading}
            title={t('SIGN_UP.RESUME_JOURNEY.TITLE') + ' 👋'}
            text={t('SIGN_UP.RESUME_JOURNEY.SUB_TITLE')}
            description={t('SIGN_UP.RESUME_JOURNEY.DESCRIPTION')}
            viewContentStyle={{
                marginTop: 5
            }}
            buttonContainerStyle={{
                // backgroundColor: 'green',
                marginTop: 10,
                width: '100%',
                marginHorizontal: -5
            }}
            actions={[
                {
                    text: t('SIGN_UP.RESUME_JOURNEY.START_NEW'),
                    buttonType: 'outline',
                    buttonStyle: {
                        height: "auto",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        marginHorizontal: 5
                    },
                    onPress: () => startNew()
                },
                {
                    text:  t('SIGN_UP.RESUME_JOURNEY.CONTINUE'),
                    buttonType: 'button',
                    buttonStyle: {
                        height: "auto",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        marginHorizontal: 5
                    },
                    loading: reduxState.loading,
                    onPress: () => continueSetup(userData)
                }
            ]}
        />
    ) : null;
}
export default memo(ResumeSignupJourney);
