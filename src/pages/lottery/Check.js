import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getSingleCampaignDetails} from "../../store/actions/Lottery.action";
import Detail from "./Detail";
import {Receipt} from "../../uiComponents";
import {formatAmount} from "../../utils/methods";
import moment from "moment";

function Check(props) {

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const { route: { params: data} } = props;

    const reduxState = useSelector(({lottery}) => {
        return {
            loading: lottery.singleCampaignLoading,
            data: lottery.singleCampaign,
        }
    });

    const [ticketPayload, updateTicketPayload] = useState({});

    useEffect(() => {
        if(data?._id) {
            let payload = {
                transactionId: data?._id
            };
            dispatch(getSingleCampaignDetails(payload));
        }
    }, [data]);

    const generateReceiverDetail = (data) => {
        let info = [];

        let obj = {
            ...(data && data),
            ...(reduxState?.card?.cardType && {
                Card: reduxState?.card?.cardType,
            }),
        };

        if(obj?.campaign?.c_campaignImages?.product?.title) {
            info.push({
                Name: t('RECEIPT.PRODUCT_NAME'),
                value: obj?.campaign?.c_campaignImages?.product?.title
            })
        }

        if(obj?.campaign?.c_prizeTitle) {
            info.push({
                Name: t('RECEIPT.PRIZE'),
                value: obj?.campaign?.c_prizeTitle
            })
        }

        if(obj?.ticketNumber) {
            let string = obj?.ticketNumber.toString();
            info.push({
                Name: t('RECEIPT.TICKET_NUMBERS'),
                value: string.replaceAll(',', '\n')
            })
        }

        if(obj?.Card) {
            info.push({
                Name: t('RECEIPT.CARD'),
                value: obj?.Card
            })
        }

        if(obj?.quantity) {
            info.push({
                Name: t('RECEIPT.QUANTITY'),
                value: obj?.quantity
            })
        }

        return info
    };

    const generateTransferAmountAndCharges = (data) => {
        let info = [];

        let obj = {
            ...(data && data),
        };

        info.push({
            Name: t('RECEIPT.PURCHASE_AMOUNT'),
            value: `${formatAmount(obj?.amountInAED, obj?.Currency || 'AED')}`,
            separate: true
        });

        if(obj?.totalFee) {
        info.push({
            Name: t('RECEIPT.CHARGES'),
            value: `${formatAmount(obj?.totalFee, obj?.c_currency)}`
        });
        }

        if(obj?.totalVat) {
        info.push({
            Name: t('RECEIPT.VAT'),
            value: `${formatAmount(obj?.totalVat, obj?.c_currency)}`
        });
        }

        if(obj?.createdAt) {
            info.push({
                Name: t('GLOBAL.DATE'),
                value: moment(obj?.createdAt).format('DD MMM yyyy'),
            });
            info.push({
                Name: t('GLOBAL.TIME'),
                value: moment(obj?.createdAt).format('hh:mm a'),
            });
        }

        return info
    };

    const generateSendToInfo = (data) => {
        return [
            ...generateReceiverDetail(data),
            ...generateTransferAmountAndCharges(data),
        ]
    };

    const onClose = () => {
        updateTicketPayload({})
    };

    const viewReceipt = () => {
        updateTicketPayload(data)
    };

    return (
        <Fragment>
            <Detail
                page={'check_lottery'}
                loading={reduxState?.loading}
                data={reduxState?.data}
                viewReceipt={viewReceipt}
            />
            <Receipt
                isVisible={!!Object.keys(ticketPayload).length}
                onClose={() => onClose()}
                data={{
                    ...ticketPayload,
                    amountInAED: Number(ticketPayload?.totalAmount)
                }}
                // fractionDigits={3}
                infoUpperTitle=""
                senTo={generateSendToInfo(ticketPayload)}
                isHistory={true}
            />
        </Fragment>
    )
}

export default React.memo(Check)
