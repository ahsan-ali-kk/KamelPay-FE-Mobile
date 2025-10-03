import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { CLoading, CModal, CText } from "../../../uiComponents";
import { useTranslation } from "react-i18next";
import { WebView } from "react-native-webview";
import { ScrollView, TouchableOpacity } from "react-native";
import Style from "../../../uiComponents/dateFilter/DateFilter.style";
import { MappedElement } from "../../../utils/methods";

const PdfViewerScreen = (props) => {
    const { uri } = props;
    return (
        <WebView
            key={uri}
            scalesPageToFit={false}
            source={{ uri }}
            originWhitelist={['*']}
            startInLoadingState={true}
            renderLoading={() => (
                <CLoading loading={true} showAnimation={true} />
            )}
            onShouldStartLoadWithRequest={(request) => {
                return request.url === uri;
            }}
        />
    );
};

const Documents = forwardRef((props, ref) => {

    const { t } = useTranslation();

    const { close, data } = props;

    const [isOpen, updateIsOpen] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [PDFs, setPDFs] = useState([]);


    useImperativeHandle(ref, () => ({
        toggleModal(type) {
            updateIsOpen(true);
        },
    }));

    useEffect(() => {
        let files = [];
        if (data?.agencyAgreementPdf) {
            files.push({
                key: 'Agency Agreement',
                label: 'Agency Agreement',
                value: data?.agencyAgreementPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.agencyAgreementPdf)}`,
            })
        }

        if (data?.applicationFormPdf) {
            files.push({
                key: 'applicationFormPdf',
                label: 'Application Form',
                value: data?.applicationFormPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.applicationFormPdf)}`,
            })
        }

        if (data?.kfsPdf) {
            files.push({
                key: 'kfsPdf',
                label: 'Key Fact Statement',
                value: data?.kfsPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.kfsPdf)}`,
            })
        }

        if (data?.masterAgreementPdf) {
            files.push({
                key: 'masterAgreementPdf',
                label: 'Master Agreement',
                value: data?.masterAgreementPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.masterAgreementPdf)}`,
            })
        }

        if (data?.termAndConditionPdf) {
            files.push({
                key: 'termAndConditionPdf',
                label: 'Term And Condition',
                value: data?.termAndConditionPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.termAndConditionPdf)}`,
            })
        }

        if (data?.approvalPdf) {
            files.push({
                key: 'approvalPdf',
                label: 'Approval',
                value: data?.approvalPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.approvalPdf)}`,
            })
        }

        if (data?.rejectionPdf) {
            files.push({
                key: 'rejectionPdf',
                label: 'Rejection',
                value: data?.rejectionPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.rejectionPdf)}`,
            })
        }

        if (data?.actualRepaymentSchedulePdf || data?.tentativeRepaymentSchedulePdf) {
            let repaymentSchedule = data?.actualRepaymentSchedulePdf || data?.tentativeRepaymentSchedulePdf
            files.push({
                key: 'repaymentSchedule',
                label: 'Repayment Schedule',
                value: repaymentSchedule,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(repaymentSchedule)}`,
            })
        }

        if (data?.creditSummaryPdf) {
            files.push({
                key: 'creditSummeryPdf',
                label: 'Credit Summery',
                value: data?.creditSummaryPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.creditSummaryPdf)}`,
            })
        }

        if (data?.financialStatementPdf) {
            files.push({
                key: 'financialStatementPdf',
                label: 'Financial Statement',
                value: data?.financialStatementPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.financialStatementPdf)}`,
            })
        }

        if (data?.dmccDocPdf) {
            files.push({
                key: 'dmccDocPdf',
                label: 'DMCC Document',
                value: data?.dmccDocPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.dmccDocPdf)}`,
            })
        }

        if (data?.dmccMurabahaPurchaseOfferPdf) {
            files.push({
                key: 'dmccMurabahaPurchaseOfferPdf',
                label: 'DMCC Murabaha Purchase Offer',
                value: data?.dmccMurabahaPurchaseOfferPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.dmccMurabahaPurchaseOfferPdf)}`,
            })
        }
        if (data?.dmccPromiseToPurchasePdf) {
            files.push({
                key: 'dmccdmccPromiseToPurchasePdfDocPdf',
                label: 'DMCC Promise To Purchase',
                value: data?.dmccPromiseToPurchasePdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.dmccPromiseToPurchasePdf)}`,
            })
        }
        if (data?.dmccPurchaseOfferDocumentPdf) {
            files.push({
                key: 'dmccPurchaseOfferDocumentPdf',
                label: 'DMCC Purchase Offer Document',
                value: data?.dmccPurchaseOfferDocumentPdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.dmccPurchaseOfferDocumentPdf)}`,
            })
        }
        if (data?.dmccTTIHoldingCertificatePdf) {
            files.push({
                key: 'dmccTTIHoldingCertificatePdf',
                label: 'DMCC TTI - Holding certificate',
                value: data?.dmccTTIHoldingCertificatePdf,
                view: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(data?.dmccTTIHoldingCertificatePdf)}`,
            })
        }

        setPDFs(files)

        if (files?.length) {
            setSelectedPDF(files[0])
        }
    }, [data])

    const modalClose = (value = false) => {
        updateIsOpen(value)
    };

    const headerProps = {
        headerTitle: "Documents",
        headerRight: true,
        backOnPress: () => close ? close() : modalClose()
    };

    const onSelectFilter = (item) => {
        setSelectedPDF(item);
    };

    const renderFilterItem = (item, index) => {
        return (
            <TouchableOpacity key={index}
                style={[Style.filterTag, item.key === selectedPDF?.key && Style.activeFilterTag]}
                onPress={() => onSelectFilter(item)}>
                <CText style={[Style.filterTagText, item.key === selectedPDF?.key && Style.activeFilterTagText]}>
                    {item.label}
                </CText>
            </TouchableOpacity>
        )
    };

    return (
        <CModal
            headerProps={headerProps}
            isOpen={isOpen} close={() => modalClose()}>

            <ScrollView horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={[Style.filterContainer, { marginBottom: 15 }]}
                contentContainerStyle={Style.filterScrollContainer}>
                <MappedElement data={PDFs} renderElement={renderFilterItem} />
            </ScrollView>

            {selectedPDF?.view ? <PdfViewerScreen uri={selectedPDF?.view} /> : null}

        </CModal>
    )
});

export default Documents;
