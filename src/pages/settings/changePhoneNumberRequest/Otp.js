import React, {memo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalOtp} from "../../index";
import _ from "lodash";
import {changePhoneNumberRequestVerifyApi} from "../../../store/actions/Auth.action";

function ChangePhoneNumberOTP(props) {

    const { route: { params: data}, navigation } = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.changePhoneNumberRequestVerifyLoading,
        }
    });

    const verify = (values) => {
        let payload = {
            otp: values.otp,
            ...data?.nextPayload,
        };
        dispatch(changePhoneNumberRequestVerifyApi(payload, callBack));
    };

    const callBack = (res) => {
        if(res?.data) {
            let obj = _.omit(data, ['nextPayload']);
            navigation.replace('change_phone_number_request_overview', {
                payload: obj?.payload,
                response: res?.data,
                // transactionId: data?.nextPayload?.transactionId
            })
        }
    };

    return (
        <GlobalOtp
            {...props}
            loading={reduxState?.loading}
            verify={verify}
            reSendShow={false}
        />
    )
}
export default memo(ChangePhoneNumberOTP);
