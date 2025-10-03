import PAY_BILL from "../constants/PayBill.constant";

const initialState = {
    billersLoading: false,
    billers: [],
    billerSkuLoading: false,
    billerSku: [],
    billerSkuIos: [],
    billerSkuIosLoading: false,
    billerCheckAmountLoading: false,

    processPaymentLoading: false,

    getPayBillBeneficiaryLoading: false,
    payBillBeneficiary: [],
    payBillBeneficiaryIsLoadMoreLoading: false,
    payBillBeneficiaryIsLoadMore: true,
    payBillBeneficiaryMetaData: {},

    getFeesAndVatLoading: false,
    feesAndVat: {},

    getTransactionHistoryLoading: false,
    transactionHistoryIsLoadMoreLoading: false,
    transactionHistoryIsLoadMore: true,
    transactionHistoryMetaData: {},
    transactionHistory: [],

    getSingleTransactionHistoryLoading: false,

};

export default (state = initialState, action = {}) => {
    switch (action.type) {

        case PAY_BILL.GET_PAYKII_BILLERS:
            return {...state, billersLoading: action.loading, billers: action.data };

        case PAY_BILL.GET_PAYKII_FEES_VAT:
            return {...state, getFeesAndVatLoading: action.loading, feesAndVat: action.data };

        case PAY_BILL.GET_PAYKII_BILLER_SKU:
            return {
                ...state,
                billerSkuLoading: action.loading,
                billerSku: action.sku,
                billerSkuIos: action.io,
            };

        case PAY_BILL.GET_PAYKII_BILLER_SKU_IO:
            return {
                ...state,
                billerSkuIosLoading: action.loading,
                billerSkuIos: action.data,
            };
        case PAY_BILL.PAYKII_BILLER_CHECK_AMOUNT_DETAILS:
            return {
                ...state,
                billerCheckAmountLoading: action.loading,
            };
        case PAY_BILL.PAYKII_PROCESS_PAYMENT:
            return {
                ...state,
                processPaymentLoading: action.loading,
            };

        case PAY_BILL.GET_PAY_BILL_BENEFICIARY:
            return {
                ...state,
                getPayBillBeneficiaryLoading: action.loading,
                payBillBeneficiary: action.data,
                payBillBeneficiaryMetaData: action.metaData,
                payBillBeneficiaryIsLoadMore: true,
                payBillBeneficiaryIsLoadMoreLoading: false,
            };

        case PAY_BILL.LOAD_MORE_PAY_BILL_BENEFICIARY:
            let payBillBeneficiary = [...state.payBillBeneficiary, ...action.data];
            return {
                ...state,
                payBillBeneficiaryIsLoadMoreLoading: action.loading,
                payBillBeneficiary: payBillBeneficiary,
                payBillBeneficiaryMetaData: action.metaData,
                payBillBeneficiaryIsLoadMore: payBillBeneficiary?.length < action?.metaData?.totalDocuments
            };

        case PAY_BILL.GET_TRANSACTION_HISTORY:
            return {
                ...state,
                getTransactionHistoryLoading: action.loading,
                transactionHistory: action.data,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: true,
                transactionHistoryIsLoadMoreLoading: false,
            };

        case PAY_BILL.LOAD_MORE_TRANSACTION_HISTORY:
            let transactionHistory = [...state.transactionHistory, ...action.data];
            return {
                ...state,
                transactionHistory: transactionHistory,
                transactionHistoryMetaData: action.metaData,
                transactionHistoryIsLoadMore: transactionHistory?.length < action?.metaData?.totalDocuments,
                transactionHistoryIsLoadMoreLoading: action.loading
            };

        case PAY_BILL.GET_PAY_BILL_SINGLE_TRANSACTION_HISTORY:
            return {
                ...state,
                getSingleTransactionHistoryLoading: action.loading
            };

        default:
            return state;
    }
};
