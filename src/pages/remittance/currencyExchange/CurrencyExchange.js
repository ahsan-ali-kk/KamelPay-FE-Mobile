import React, {useCallback, useEffect, useRef, useState} from "react";
import {Container} from "../../../containers";
import {useDispatch, useSelector} from "react-redux";
import {gethelloPaisaCurrencyRate} from "../../../store/actions/Remittance.action";
import CForm from "./Form";
import { debounce } from 'lodash-es';
import {useTranslation} from "react-i18next";
import SendingLimits from "./SendingLimits";
import {wallets} from "../Remittance";
import BeneficiaryConfirmation from "./beneficiaryConfirmation";
import {useNavigation} from "@react-navigation/native";

function CurrencyExchange(props) {
    const { t } = useTranslation();
    const beneficiaryConfirmationRef = useRef(null);
    const {route: { params: data }} = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const headerProps = {
        headerTitle: t('PAGE_TITLE.EXCHANGE_RATES'),
        headerRight: true,
    };

    const reduxState = useSelector(({remittance, global}) => {
        return {
            data: remittance.helloPaisaGetCurrency,
            card: global.selectedCard
        }
    });

    const [limitModal, toggleLimitModal] = useState(false);

    useEffect(() => {
        if(data?.module !== "SNPL") {
            get(1, 'RECEIVER')
        }
    }, []);

    useEffect(() => {
        if(data){
            const {bank = {}} = data;
            if(wallets?.includes(bank?.BankName)) {
                toggleLimitModal(true)
            }
        }
    }, []);

    const onSubmit = (item) => {

        let payload = {
            Amount : item?.amountInAED,
            ...data,
            ...(!reduxState?.data.promoError && item?.promo && {Promocode: item?.promo}),
        };

        if(data?.module === 'SNPL') {
            navigation.navigate('advance_salary', {
                advance: payload?.Amount,
                beneficiaryId: payload?.beneficiaryId,
            })
        } else {
            beneficiaryConfirmationRef?.current?.toggleModal(true, payload)
        }
        // if(data?.pageType === 'BENEFICIARY_TO_SEND_MONEY'){
        // } else {
        //     navigation.navigate('send_money_beneficiary_details', payload)
        // }

    };

    const get = (amount, type, promo) => {
        let payload = {
            BankId: data?.bank?._id,
            Amount: amount,
            Type: type,
            IsOfferEligible: data?.module !== "SNPL",
            walletID: reduxState?.card?.walletID,
            ...(promo && {Promocode: promo})
        };
        dispatch(gethelloPaisaCurrencyRate(payload));
    };

    const applyPromo = (item) => {
        get(item?.receiver,'RECEIVER',  item?.promo)
    };

    const searchDebounce = useCallback(debounce((e, type, promo) => {
        try {
            get(e, type, promo);
        } catch (error) {

        }
    }, 1500), []);

    return (
        <Container
            loading={false}
            headerProps={headerProps}>

            <CForm
                submit={onSubmit}
                applyPromo={applyPromo}
                onChange={searchDebounce}
                onChangeWithoutDebounce={get}
                data={data}
                module={data?.module || ''}
            />

            <SendingLimits
                isOpen={limitModal}
                onClose={() => toggleLimitModal(!limitModal)}
            />

            <BeneficiaryConfirmation
                ref={beneficiaryConfirmationRef}
                onClose={() => {
                   navigation.goBack()
                }}
                onConfirm={(payload) => {
                    navigation.navigate('send_money_confirmation', payload)
                }}
            />

        </Container>
    )
}

export default React.memo(CurrencyExchange)
