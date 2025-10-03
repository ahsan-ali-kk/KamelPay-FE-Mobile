import React, {Fragment, useState} from "react";
import {View} from "react-native";
import {CText, CToggleSwitch} from "../../uiComponents";
import Styles from "./TermsAndConditions.style";
import {useTranslation} from "react-i18next";
import {formatAmount, getFullName, getPhone, MappedElement} from "../../utils/methods";
import moment from "moment";
import GlobalStyle from "../../assets/stylings/GlobalStyle";

function PersonalFinanceKFS(props) {

    const { t } = useTranslation();

    const {personalLoanDetails, user, card} = props;
    const [lang, updateLang] = useState('en');

    const feesBrackets = personalLoanDetails?.KFSBrackets || [];

    const renderEnglishKFS = () => {
        return (
            <View>
                <CText style={Styles.kfcTitle}>KEY FACTS STATEMENT (KFS) - PERSONAL FINANCE</CText>
                <CText style={Styles.kfcParagraph}>
                    <CText style={[Styles.warning]}>WARNING:</CText> Read this document carefully and sign only if you clearly understand and agree to the content of the Key Fact Statement (KFS), which is available in English and Arabic. You may also use this document to compare different Personal Finance products offered by other Banks. You have the right to receive KFS from other Banks for comparison
                    {'\n'}
                </CText>
                <View style={Styles.tableSection}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>PRODUCT INFORMATION</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={Styles.tableSectionBodyItem}>
                            <View style={Styles.tableSectionBodyItemLeft}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    Product Definition
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    Personal Finance is a facility granted to customers for access to cash, which the customer may require for purposes like Education, personal expenses, marriage, travel etc. The customer will make the repayments in installments for the defined tenure.
                                </CText>
                            </View>
                        </View>
                        <View style={Styles.tableSectionBodyItem}>
                            <View style={Styles.tableSectionBodyItemLeft}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    Islamic Finance Structure
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom_10]}>
                                    Personal Finance facility extended to customers is based on the Islamic Finance Structure of “Murabaha” and “Service Ijarah”. “Murabaha” is one of the most commonly used modes of financing by Islamic Bank and financial institutions. Murabaha refers to a commercial transaction which involves the buy and sale of goods that has been promised to be purchased by an ultimate buyer with an added profit margin. The added profit margin could be mentioned in the form of a fixed lump sum or a percentage of the price of the goods.
                                </CText>
                                <CText style={Styles.kfcParagraph}>
                                    Under Service Ijarah transaction, the bank will purchase the service as requested by the customer and allow the customer, the right to use it and the benefit of the service for a pre-determined period of time and in return the customer will pay a pre-determined agreed rent.
                                </CText>
                            </View>
                        </View>
                        <View style={Styles.tableSectionBodyItem}>
                            <View style={Styles.tableSectionBodyItemLeft}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    Types of Personal Finance
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        Personal Finance Standard
                                    </CText>
                                </View>
                            </View>
                        </View>
                        <View style={Styles.tableSectionBodyItem}>
                            <View style={Styles.tableSectionBodyItemLeft}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    Profit rate
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    Fixed Rate
                                </CText>
                            </View>
                        </View>
                        <View style={Styles.tableSectionBodyItem}>
                            <View style={Styles.tableSectionBodyItemLeft}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    Calculation Methodology
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    Reducing Balance methodology. As per this methodology the principal portion is reduced from the total outstanding and the profit is calculated on the reduced outstanding amount and not the original finance amount.
                                </CText>
                            </View>
                        </View>
                        <View style={Styles.tableSectionBodyItem}>
                            <View style={Styles.tableSectionBodyItemLeft}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    Installment Frequency
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    Monthly
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>FEES & CHARGES</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                To view all our Fees and charges, you may visit our website <CText style={Styles.blue}>www.ajmanbank.ae</CText>, call <CText style={Styles.boldText}>045623700</CText>, or visit any of our branches to receive a copy.
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.border_bottom, Styles.darkGray]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.lightGrayContentColor]}>
                                    Profit Rate
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        Profit computation methodology: (Principal outstanding x profit rate/365) x no.of days in the month
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        Profit will accrue on daily basis. All profit calculation is determined and calculated by Ajman Bank with reference to the no.of days elapsed and the total no.of days in the year.
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        Normally the calculation is based on a 365-day year basis
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        Please visit <CText style={Styles.blue}>www.ajmanbank.ae</CText> for installment computation
                                    </CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.lightGray]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    <CText style={Styles.boldText}>Note:</CText> Bank will not charge any additional profit on accrued profit on any Credit product granted to Customers.
                                </CText>
                            </View>
                        </View>
                        <Fragment>
                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        Other Fees & Charges
                                    </CText>
                                </View>
                            </View>

                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                    <CText style={Styles.kfcParagraph}>
                                        Processing Fees and Profit
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <View style={[Styles.feeTable]}>
                                        <View style={[Styles.feeTableContainer]}>
                                            <View style={Styles.feeTableHeaderContainer}>
                                                <View style={[Styles.feeTableHeader, Styles.border_bottom]}>
                                                    <CText style={Styles.feeTableHeaderText}>
                                                        Tenor (in months)
                                                    </CText>
                                                </View>
                                            </View>

                                            <MappedElement
                                                data={feesBrackets}
                                                renderElement={(obj, i) => {
                                                    return (
                                                        <View key={i} style={[Styles.feeTable, {borderWidth: 0}, i !== 0 && {borderTopWidth: 1}]}>
                                                            <View style={[Styles.feeTableContainer]}>
                                                                <View style={Styles.feeTableHeaderContainer}>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            {obj?.tenor}
                                                                        </CText>
                                                                    </View>
                                                                </View>
                                                                <View style={Styles.feeTableHeaderContainer}>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom, Styles.border_right]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            Slab Amount
                                                                        </CText>
                                                                    </View>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom, Styles.border_right]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            Processing Fees in AED
                                                                        </CText>
                                                                    </View>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            Profit in AED
                                                                        </CText>
                                                                    </View>
                                                                </View>
                                                                <View style={[{flex: 1, flexDirection: 'row'}]}>
                                                                    <View style={[Styles.feeTableBody, {flex: 1}, Styles.border_right]}>
                                                                        <MappedElement
                                                                            data={obj?.data}
                                                                            renderElement={(obj, i) => {
                                                                                return (
                                                                                    <CText key={i} style={Styles.feeTableBodyText}>
                                                                                        {formatAmount(obj?.fromAmount, '')} - {formatAmount(obj?.toAmount, '')}
                                                                                    </CText>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    <View style={[Styles.feeTableBody, {flex: 1}, Styles.border_right]}>
                                                                        <MappedElement
                                                                            data={obj?.data}
                                                                            renderElement={(obj, i) => {
                                                                                return (
                                                                                    <CText key={i} style={Styles.feeTableBodyText}>
                                                                                        {formatAmount(obj?.processingFees, '')}
                                                                                    </CText>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    <View style={[Styles.feeTableBody, {flex: 1}]}>
                                                                        <MappedElement
                                                                            data={obj?.data}
                                                                            renderElement={(obj, i) => {
                                                                                return (
                                                                                    <CText key={i} style={Styles.feeTableBodyText}>
                                                                                        {formatAmount(obj?.profit, '')}
                                                                                    </CText>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                }}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Fragment>
                        <Fragment>
                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        Early Settlement
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1]}>
                                    <CText style={Styles.kfcParagraph}>
                                        Early Settlement Fee Customers have the option of shifting their personal finance facility to any other bank at any point of time, by paying the early settlement charges. The early settlement fee is charged during the settlement process. The fee can either be deposited in the account or can be charged against the settlement manager’s cheque for buyout cases
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        1% of the Outstanding, up to a max of AED 100
                                    </CText>
                                </View>
                            </View>
                        </Fragment>
                        <Fragment>
                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        Example
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1]}>
                                    <CText style={Styles.kfcParagraph}>
                                        (a) Current Principal Outstanding
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        2000 AED
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1]}>
                                    <CText style={Styles.kfcParagraph}>
                                        (b) Accrued profit until Liability letter issuance/settlement date
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        100 AED
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1]}>
                                    <CText style={Styles.kfcParagraph}>
                                        (c) Past due amounts (Principal or/and Profit)
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        0 AED
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1]}>
                                    <CText style={Styles.kfcParagraph}>
                                        (d) Early Settlement charge (1% of principal outstanding or max 100 AED whichever is lesser)
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        20 AED
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1]}>
                                    <CText style={Styles.kfcParagraph}>
                                        (e) VAT on Early Settlement Fee (5%)
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        1 AED
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        Total Amount (a) + (b) + (c) + (d) + (e)
                                    </CText>
                                </View>
                                <View style={[Styles.tableSectionBodyItemRight, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        2,121 AED
                                    </CText>
                                </View>
                            </View>
                        </Fragment>
                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    DISCLAIMERS:
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        All Fees mentioned above and on <CText style={Styles.blue}>www.ajmanbank.ae</CText> are exclusive of Value Added Tax (VAT). A VAT of 5% shall be applicable on all Fees levied by the Bank
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        Ajman Bank reserves the right to revise the fees & charges and terms & conditions, including the profit calculation methodology at any time by providing sixty (60) days prior written notice to your registered contact details
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        If the case is delayed by the Bank, Customers retain the option to cancel the contract without cost or penalty before the funds are made available
                                    </CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.lightGray]}>
                            <CText style={[Styles.kfcParagraph]}>
                                <CText style={[Styles.warning]}>WARNING: </CText>
                                If you have further clarifications or in case you are not accepting the new/modified changes, please reach the nearest branch within the specified period or call us on <CText style={Styles.boldText}>045623700</CText>; otherwise, you will be liable for the changes once implemented.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={Styles.tableSection}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>YOU MUST KNOW</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                Prior to applying for Personal Finance facility, you should take into account any foreseeable future changes to your financial circumstances (such as retirement occurring before the end of the finance term). You should only avail the finance, if you have financial means to cope up with potential risk that may arise from changes in the economic and market conditions as well as changes in your circumstances. You may consult your independent financial advisor for advice
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.lightGray, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                <CText style={Styles.kfcParagraphTitle}>COOLING-OFF PERIOD : </CText>
                                Khiyar Al-Shart ‘Cooling-off Period’ is defined as a period of time after a contract is agreed during which the buyer can cancel the contract without incurring a penalty. Customers may waive the cooling-off period of complete 5 business days by signing a written waiver provided by Ajman Bank.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>FINANCE APPLICATION AND APPROVAL PROCESS</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        Customers shall provide Ajman Bank with duly filled application form along with identification documents (Passport, Visa, Emirates ID etc.) and income proof (Salary certificate, Statement of account, Audited financials etc.). Ajman Bank reserves the right to ask for more documentation as deemed applicable
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        The application is submitted for further review within the Central Bank UAE regulations and Ajman Bank’s policy. For example: Checking the Debt Service Ratio (max. 50%), Al Etihad Credit Bureau (AECB), Income and Lifestyle expenditures etc. Once the assessment is completed and decision is taken, the customers are informed regarding whether the finance application is approved or rejected
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        For approved cases, a pre-approval letter will be issued. For rejected cases, customers will be provided a written notice communicating the rejection reason
                                    </CText>
                                </View>
                                <View style={Styles.row}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        For delayed cases, customers will be provided a written notification mentioning the reason and the date by which the finance can be released. Customers retain the option to cancel the contract without cost or penalty before the finance is booked
                                    </CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>KEY OBLIGATIONS</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph]}>
                                <CText style={[Styles.warning]}>WARNING : </CText>
                                In the event of a Customer’s failure to meet Ajman Bank’s terms and conditions before and during the relationship, the bank may initiate appropriate action as deemed necessary as a consequence of non-repayment or non-fulfillment of signed terms and conditions. The actions taken may include the following:
                            </CText>
                            <View style={[Styles.row, Styles.margin_top]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>a)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    Negative rating in the Al Etihad Credit Bureau (AECB) or other Credit Information agency and the possible limitations on the ability to obtain financing in the future
                                </CText>
                            </View>
                            <View style={Styles.row}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>b)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    Legal Proceedings via Court
                                </CText>
                            </View>
                            <View style={Styles.row}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>c)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    Collection measures including presenting security cheques for clearing and claim on guarantees
                                </CText>
                            </View>
                            <CText style={[Styles.kfcParagraph]}>
                                In case additional securities in terms of pledge collaterals, guarantors, post-dated cheques etc. are obtained, these securities can be utilized or be enforced in case of any default in payment or non-fulfillment of any terms and conditions of facility offer letter or any other signed contract.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>COMPLAINTS & SUGGESTIONS</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                For complaints and suggestions, you may visit any of our Branches and submit in writing or verbally to our Customer service officer. You can also call our Phone Banking on <CText style={Styles.boldText}>045623700</CText> and we will be happy to assist. Alternatively, you may also use our website <CText style={Styles.blue}>www.ajmanbank.ae</CText> or Email address <CText style={Styles.blue}>support@kamelpay.com</CText>
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>IMPORTANT NOTE FOR THE CUSTOMER AND THE BANK</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                This Key Facts Statement must be duly signed by the Bank representative and the Customer, prior to availing the financial product and/or service. A duplicate copy of the signed documents will be provided for your information and records at any point of time during the relationship and/or based on your request.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            MARKETING AND PROMOTIONAL - COMMUNICATION
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.row, Styles.alignItems_flexStart]}>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                I agree to receive promotional/marketing/product communication from Ajman bank
                            </CText>
                            <View style={Styles.checkBoxContainer}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={Styles.checkBoxText}>Yes</CText>
                                </View>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>

                                    </View>
                                    <CText style={Styles.checkBoxText}>No</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.border_top_none, Styles.row, Styles.alignItems_flexStart]}>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                Preferred mode of communication (if Yes)
                            </CText>
                            <View style={Styles.checkBoxContainer}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={Styles.checkBoxText}>SMS</CText>
                                </View>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={Styles.checkBoxText}>Email</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                <CText style={Styles.boldText}>Note:</CText> If you wish to “Opt in”/”Opt out” of receiving marketing and promotional communications, you may call us anytime at <CText style={Styles.boldText}>045623700</CText>.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            ACKNOWLEDGEMENT AND SIGNATURE
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                I hereby acknowledge that I have read, understood, and agree to the content of this Key Facts Statement
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    Customer Name
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {getFullName(user)}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    Emirates ID
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {user?.emirateID}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    Emirates ID Expiry
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {user?.expiryDate ? moment(user?.expiryDate).format('DD/MM/YYYY') : null}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    Date
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {moment().format('DD/MM/YYYY')}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    Mobile Number
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {getPhone(user)}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    WPS Payroll Card Number
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {card?.cardNumber}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    Wallet ID
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {card?.walletID}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    Customer Digital Signature
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, {minHeight: 100}]}>
                                <CText style={Styles.infoViewItemText}>

                                </CText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    };
    const renderArabicKFS = () => {
        return (
            <View>
                <CText style={Styles.kfcTitle}>KEY FACTS STATEMENT (KFS) - PERSONAL FINANCE</CText>
                <CText style={Styles.kfcParagraph}>
                    <CText style={[Styles.warning]}>تحذيـر:</CText> يرجى قراءة هذا املستند بعناية والتوقيع عليه فقط إذا كنت تفهم وتوافق بوضوح على محتواه. يتوفر بيان الحقائق األساسية ا استخدام هذا املستند للمقارنة بين منتجات التمويل الشخص ي املقدمة من البنوك األخرى. باللغتين العربية واإلنجليزية. يمكنك أيضً لديكالحق فيالحصول علىبيان الحقائق األساسية من البنوك األخرى للمقارنة.
                    {'\n'}
                </CText>
                <View style={Styles.tableSection}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>معلومات املنتج</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.rowReverseTableSectionBodyItemLeft]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    تعريف املنتج
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    التمويــل الشــخصي هــو أحــد التســهيلات التــي ت ُ منــح للعــملاء وتتيــح لهــم الحصــول علــى المــال نقــداً، وهــو مــا قــد يحتاجــه العميــل لأغــراض تتعلــق بالتعليــم، والمصاريــف الشــخصية، والــزواج، والســفر.. إلــخ. يســدد العميــل المبلــغ علــى شــكل أقســاط خلال المــدة المحــددة
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.rowReverseTableSectionBodyItemLeft]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    هيكل التمويل الإسلامي
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom_10]}>
                                    يُقدم التمويل الشخص ي للعملاء استنادً ا إلى هيكل التمويل الإسلامي وفقً ا لأسلوبي "المرابحة"
                                    من البنوك والمؤسسات المستخدمة و"إجارة الخدمات". تعد المرابحة إحدى أكثر طرق التمويل المالية الإسلامية، حيث تعتمد على عملية بيع وشراء السلع التي يلتزم المشتري النهائي بشرائها، مع                                </CText>
                                <CText style={Styles.kfcParagraph}>
                                    إضافة هامش ربح متفق عليه مسبقً ا، سواء كان هذا الهامش مبلغًا مقطوعً ا أو نسبة مئوية من العميل، ومن ثم يمنح التي يطلبها البنك الخدمة يشتري أما في إجارة الخدمات، سعر السلعة. إيجار متفق مقابل دفعوذلك العميل حق استخدامها والاستفادة منها لفترة زمنية محددة مسبقً ا، عليه.
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.rowReverseTableSectionBodyItemLeft]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    أنواع التمويل الشخصي
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={Styles.row}>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        التمويل الشخص ي التقليدي
                                    </CText>
                                    <View style={Styles.dot}/>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.rowReverseTableSectionBodyItemLeft]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    نسبة الربح
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    نسبة ثابتة
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.rowReverseTableSectionBodyItemLeft]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    منهجية الحساب
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    يعتمد احتساب الربح على منهجية الرصيد المتناقص، حيث يتم خصم الجزء المسدد من أصل المبلغ المستحق، ويتم احتساب الربح على الرصيد المتبقي وليس على مبلغ التمويل الأصلي.
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.rowReverseTableSectionBodyItemLeft]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    تواتر الإ قساط
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <CText style={Styles.kfcParagraph}>
                                    شهر يًا
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>الرسوم والعموالات</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                  ملعرفة جميع الرسوم والعموالت، يمكنك زيارة موقعنا اإللكتروني  <CText style={Styles.blue}>www.ajmanbank.ae</CText>, أو االتصال على، <CText style={Styles.boldText}>045623700</CText>  أو زيارة أحد فروعنا للحصول علىنسخةمن الرسوم والعموالت.
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.border_bottom, Styles.darkGray]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.lightGrayContentColor]}>
                                    نسبة الربح
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        طريقة حساب الربح:  (الرصيد املتبقي × معدل الربح /365) × عدد الإ يام في الشهر
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        يتم احتساب الربح على أساس يومي. دديحدويحتسب ُ بنك عجمان جميع ألإرباح بالإستنادإلى عدداألإيام املنقضيةوإجمالي عدداألإيام في السنة
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        ًعادة ما يتم احتساب األرباح على أساس 365 يومًا في السنة
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                        يرجى ً يوم زيارة موقع <CText style={Styles.blue}>www.ajmanbank.ae</CText>  ملعرفة طريقة احتساب األقساط.
                                    </CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.lightGray]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    <CText style={Styles.boldText}>مالحظة:</CText>  لن يفرض البنك أي ربح إضافي علي الأرباح المستحقة علي منتج ائتماني ممنوح للعملاء.
                                </CText>
                            </View>
                        </View>
                        <Fragment>
                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        رسوم وعموالت أخرى
                                    </CText>
                                </View>
                            </View>

                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                    <CText style={Styles.kfcParagraph}>
                                        رسوم املعالجةوالربح
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <View style={[Styles.feeTable]}>
                                        <View style={[Styles.feeTableContainer]}>
                                            <View style={Styles.feeTableHeaderContainer}>
                                                <View style={[Styles.feeTableHeader, Styles.border_bottom]}>
                                                    <CText style={Styles.feeTableHeaderText}>
                                                        Tenor (in months)
                                                    </CText>
                                                </View>
                                            </View>

                                            <MappedElement
                                                data={feesBrackets}
                                                renderElement={(obj, i) => {
                                                    return (
                                                        <View key={i} style={[Styles.feeTable, {borderWidth: 0}, i !== 0 && {borderTopWidth: 1}]}>
                                                            <View style={[Styles.feeTableContainer]}>
                                                                <View style={Styles.feeTableHeaderContainer}>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            {obj?.tenor}
                                                                        </CText>
                                                                    </View>
                                                                </View>
                                                                <View style={Styles.feeTableHeaderContainer}>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom, Styles.border_right]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            شريحة املبلغ
                                                                        </CText>
                                                                    </View>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom, Styles.border_right]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            رسوم املعالجة (بالدرهم اإلماراتي)
                                                                        </CText>
                                                                    </View>
                                                                    <View style={[Styles.feeTableHeader, Styles.border_bottom]}>
                                                                        <CText style={Styles.feeTableHeaderText}>
                                                                            الربح (بالدرهم اإلماراتي)
                                                                        </CText>
                                                                    </View>
                                                                </View>
                                                                <View style={[{flex: 1, flexDirection: 'row'}]}>
                                                                    <View style={[Styles.feeTableBody, {flex: 1}, Styles.border_right]}>
                                                                        <MappedElement
                                                                            data={obj?.data}
                                                                            renderElement={(obj, i) => {
                                                                                return (
                                                                                    <CText key={i} style={Styles.feeTableBodyText}>
                                                                                        {formatAmount(obj?.fromAmount, '')} - {formatAmount(obj?.toAmount, '')}
                                                                                    </CText>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    <View style={[Styles.feeTableBody, {flex: 1}, Styles.border_right]}>
                                                                        <MappedElement
                                                                            data={obj?.data}
                                                                            renderElement={(obj, i) => {
                                                                                return (
                                                                                    <CText key={i} style={Styles.feeTableBodyText}>
                                                                                        {formatAmount(obj?.processingFees, '')}
                                                                                    </CText>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    <View style={[Styles.feeTableBody, {flex: 1}]}>
                                                                        <MappedElement
                                                                            data={obj?.data}
                                                                            renderElement={(obj, i) => {
                                                                                return (
                                                                                    <CText key={i} style={Styles.feeTableBodyText}>
                                                                                        {formatAmount(obj?.profit, '')}
                                                                                    </CText>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                }}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Fragment>
                        <Fragment>
                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        التسوية املبكرة
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.rowReverseTableSectionBodyItemLeft]}>
                                    <CText style={Styles.kfcParagraph}>
                                        يحق للعمالء تحويل تسهيالت التمويل الشخص ي الخاصة بهم إلى أي بنك آخر في أي وقت، وذلك من خالل سداد رسوم التسوية املبكرة. يتم خصم هذه الرسوم أثناء عملية التسوية، ويمكن دفعها من خالل اإليداع في عد إلتمام ُ الحساب أو خصمها من الشيك امل عملية الشراء من البنك الجديد.
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        رسوم التسوية املبكرة: نسبة %1 من الرصيد املستحق، بحد أقص ى 100 درهم إماراتي.
                                    </CText>
                                </View>
                            </View>
                        </Fragment>
                        <Fragment>
                            <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.lightGray, Styles.rowReverse]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        مثال
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.rowReverseTableSectionBodyItemLeft]}>
                                    <CText style={Styles.kfcParagraph}>
                                        أ. الرصيد الحالي املتبقي من أصل التمويل
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        2000 درهم إماراتي
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.rowReverseTableSectionBodyItemLeft]}>
                                    <CText style={Styles.kfcParagraph}>
                                        ب. الربح املستحق حتى تاريخ إصدار خطاب املخالصة/ تاريخ التسوية
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        100 درهم إماراتي
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.rowReverseTableSectionBodyItemLeft]}>
                                    <CText style={Styles.kfcParagraph}>
                                        ج. املبالغ املتأخرة (سواء من أصل التمويل أو الربح)
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        0 درهم إماراتي
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.rowReverseTableSectionBodyItemLeft]}>
                                    <CText style={Styles.kfcParagraph}>
                                        د. رسوم التسوية املبكرة – %1 من الرصيد املتبقي من أصل التمويل أو بحد أقص ى 100 درهم إماراتي، أيهما أقل
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        20 درهم إماراتي
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.rowReverseTableSectionBodyItemLeft]}>
                                    <CText style={Styles.kfcParagraph}>
                                        ه. ضريبة القيمة املضافة على رسوم التسوية املبكرة – %5 من قيمة الرسوم
                                    </CText>
                                </View>
                                <View style={Styles.tableSectionBodyItemRight}>
                                    <CText style={Styles.kfcParagraph}>
                                        1 درهم إماراتي
                                    </CText>
                                </View>
                            </View>
                            <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                                <View style={[Styles.tableSectionBodyItemLeft, Styles.flex_1, Styles.lightGray, Styles.rowReverseTableSectionBodyItemLeft]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        املبلغ اإل جمالي: (أ) + (ب) + (ج) + (ه)
                                    </CText>
                                </View>
                                <View style={[Styles.tableSectionBodyItemRight, Styles.lightGray]}>
                                    <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                        2,121 درهم إماراتي
                                    </CText>
                                </View>
                            </View>
                        </Fragment>
                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    إخالءاملسؤولية:
                                </CText>
                            </View>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        جميع الرسوم املذكورة أعاله وعلى موقع <CText style={Styles.blue}>www.ajmanbank.ae</CText> ال تشمل ضريبة القيمة املضافة. يتم تطبيق ضريبة القيمة املضافة بنسبة %5 على جميع الرسوم التي يفرضها البنك.
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        يحتفظ بنك عجمان بالحق في تعديل الرسوم والعموالت والشروط واألحكام، بما في ذلك منهجية احتساب الربح، في أي وقت، مع ً تقديم إشعار خطي مسبق قبل (60) يومًا إلىتفاصيل االتصال املسجلةلديك.
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        في حالةتأخر البنك فيتنفيذ الطلب، يحق للعميل إلغاءالعقد دون أي تكاليف أو غراماتقبل توفيراألموال.
                                    </CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.lightGray]}>
                            <CText style={[Styles.kfcParagraph]}>
                                <CText style={[Styles.warning]}>تحذير : </CText>
                                إذاكنت بحاجةإلى أي توضيحات إضافيةأولم تكن موافقا على التغييرات الجديدة أواملعدلة، يرجى زيارة أقرب فرع خالا ل الفترة املحددة أو االتصال بنا على <CText style={Styles.boldText}>045623700</CText>; إو إلا فستتحمل امل سؤولية عن قبول التغييرات بمجردتنفيذها
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={Styles.tableSection}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}> مايجب أن تعلمه </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>قبل التقدم بطلب للحصول على تمويلشخص ي، عليك أن تأخذ في االعتبار أي تغييرات مستقبليةمتوقعةفيوضعك املالي (مثل التقاعد الذي قد يحدث قبل انتهاء مدة التمويل). يجب عليك االستفادة من التمويل فقط إذا كنت تملك القدرة املالية على تحمل املخاطر املحتملة الناتجة عن التغيرات االقتصاديةوظروف السوق، باإلضافة إلى أي تغييرات في ظروفك الشخصية. يمكنك استشارة مستشارك املالياملستقل للحصول علىاملشورة</CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.lightGray, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                <CText style={Styles.kfcParagraphTitle}>فترة التراجع ("خيار الشرط )":</CText> تعرف فترة التراجع "خيار الشرط" بأنها الفترة التي تلي إبرام العقد والتي يمكن للعميل خاللها إلغاء العقد دون دفعأي غرامات. يمكن للعمالء التنازل عن فترة التراجعالتي تمتد 5 أيام عمل كاملةمن خالل توقيعتنازل خطي يتم توفيره من قبل بنك عجمان.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            عملية تقديم طلب التمويل واملو افقة عليه
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                            <View style={Styles.tableSectionBodyItemRight}>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        يتعين على العمالء تقديم نموذج الطلب املكتمل إلى بنك عجمان، مرفق بوثائق الهويةجواز السفر التأشيرة و بطاقة الهوية اإلماراتية، إلخ( وإثبات الدخل (شهادة راتب و كشف حساب بنكي و قوائم مالية مدققة، إلخ). يحتفظ بنك عجمان بالحق في طلب مستندات إضافية إذا لزم األمر.
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        يتم تقديم الطلب للمراجعةوفق ألنظمةاملصرفاملركزي لدولةاإلمارات العربيةاملتحدةوسياسةبنك عجمان، بما فيذلك التحقق من نسبة عبء املديونية (بحد أقص ى %50)، وسجل االتحادللمعلوماتاالئتمانية،ومستوى الدخل ونمط اإلنفاق املعيش
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        بعد استكمال التقييم واتخاذ القرار، يتم إبالغ العمالء بحالة طلب التمويل سواء باملوافقة أو الرفض.
                                    </CText>
                                </View>
                                <View style={[Styles.row, Styles.rowReverse]}>
                                    <View style={Styles.dot}/>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                        في حال املوافقة، يتم إصدار خطابموافقةمبدئية، أما في حالةالرفض،فسيتم تزويد العمالء بإشعاركتابي يوضح سببالرفض.
                                        - - في حالةالتأخيرفي اتخاذالقرار، سيتم إرسال إشعاركتابي يوضح سبب التأخيروالتاريخ املتوقع إلصدارالتمويل.كما يحق للعمالء
                                        إلغاءالعقد دون أي تكلفةأو غرامةقبلصرفالتمويل.
                                    </CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>االلتزامات الرئيسية</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph]}>
                                <CText style={[Styles.warning]}>تحذير: </CText>
                                في حالة عدم التزام العميل بشروط وأحكام بنك عجمان قبل وأثناء العالقة التعاقدية، يحق للبنك اتخاذ اإلجراءات املناسبة نتيجةلعدم السدادأو عدم االمتثال للشروطاملتفق عليها
                            </CText>
                            <CText style={[Styles.kfcParagraph]}>
                                تشمل اإلجراءات التي قد يتم اتخاذها ما يلي:
                            </CText>
                            <View style={[Styles.row, Styles.margin_top, Styles.rowReverse]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>أ)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    تقييم سلبي في شركة االتحاد للمعلومات االئتمانية أو أي وكالةمعلومات ائتمانيةأخرى، مما قد يؤدي إلى قيود على الحصول على تمويل مستقبلي.
                                </CText>
                            </View>
                            <View style={[Styles.row, Styles.rowReverse]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>ب)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    إجراءات قانونية من خالل املحاكم.
                                </CText>
                            </View>
                            <View style={[Styles.row, Styles.rowReverse]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>ت)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    إجراءاتتحصيل الديون،والتيقد تشمل تقديم شيكاتضمان للتحصيل واملطالبة بالضمانات.
                                </CText>
                            </View>
                            <CText style={[Styles.kfcParagraph]}>
                                في حالة تقديم ضمانات إضافية مثل الرهن و الكفالء و الشيكات املؤجلة، وغيرهم ، يحق للبنك استخدامها أو تنفيذها في حالة التخلف عن السدادأو عدم االمتثال ألي من شروطوأحكام خطابعرضالتمويل أوأي عقد موقعآخر.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>الشكاوى واملقترحات</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                للشكاوى واملقترحات، يمكنك زيارة أي من فروعناوتقديم شكواك كتابيًا أو شفهيًا إلىموظف خدمة العمالء. كما يمكنك االتصال بخدمة الهاتف املصرفي على <CText style={Styles.boldText}>045623700</CText> وسنكون سعداء بمساعدتك. بدالاً من ذلك، يمكنك أيضًا استخدام موقعنا اإللكتروني <CText style={Styles.blue}>www.ajmanbank.ae</CText> أوإرسال بريد إلكتروني إلى .<CText style={Styles.blue}>support@kamelpay.com</CText>
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>مالحظة هامة للعميل والبنك </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                يوقع كًالا ممثل البنك والعميل بيانالحقائق األساسيةقبل الحصول على املنتج أو الخدمة املالية. يتم توفيرنسخةمكررةمن املستندات املوقعةللعميل لالطالع عليهاواالحتفاظبها فيأي وقتخالل العالقةالتعاقدية، أوبناءً على طلبه.
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            التسويق والترويج - االتصاالت
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.row, Styles.alignItems_flexStart]}>
                            <View style={Styles.checkBoxContainer}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={Styles.checkBoxText}>نعم</CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>

                                    </View>
                                    <CText style={Styles.checkBoxText}>ال</CText>
                                </View>
                            </View>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                أوافق علىاستالم اتصاالت ترويجية/ تسويقية/ خاصةباملنتجاتمن بنكعجمان:
                            </CText>

                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.border_top_none, Styles.row, Styles.alignItems_flexStart]}>
                            <View style={Styles.checkBoxContainer}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={Styles.checkBoxText}>البريد اإللكتروني</CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={Styles.checkBoxText}>الرسائل النصيةالقصيرة</CText>
                                </View>
                            </View>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                طريقة االتصال املفضلة (في حال املوافقة):
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                <CText style={Styles.boldText}>مالحظة:</CText>
                                  : إذا كنت ترغب في "االشتراك" أو "إلغاء االشتراك" في استالم االتصاالت التسويقية والترويجية، يمكنك االتصال بنا في أي وقت على<CText style={Styles.boldText}>045623700</CText>
                            </CText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.tableSection, Styles.border_top_none]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            اإلقرار والتوقيع
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={Styles.kfcParagraph}>
                                أقر بموجبهأننيقرأتوفهمتوأوافق علىمحتوى بيان الحقائق األساسية.
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    اسم العميل
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {getFullName(user)}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    رقم الهويةاإلماراتية
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {user?.emirateID}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    تاريخ انتهاءصالحيةالهويةاإلماراتية
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {user?.expiryDate ? moment(user?.expiryDate).format('DD/MM/YYYY') : null}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    التاريخ
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {moment().format('DD/MM/YYYY')}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    رقم الجوال
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {getPhone(user)}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    رقم بطاقةدفعالرواتب
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {card?.cardNumber}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    رقم املحفظةاإللكترونية
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.infoViewItemText}>
                                    {card?.walletID}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                    التوقيع الرقمي للعميل
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, {minHeight: 100}]}>
                                <CText style={Styles.infoViewItemText}>

                                </CText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    };

    return (
        <View>

            <View style={GlobalStyle.toggleView}>
                <CText style={GlobalStyle.toggleViewText}> View {lang == 'ar' ? 'English' : 'Arabic'} </CText>
                <CToggleSwitch style={{}} onToggle={() => updateLang(lang === 'ar' ? 'en' : 'ar')} isOn={lang === 'ar'} />
            </View>

            {(lang === 'ar') ? renderArabicKFS() : renderEnglishKFS()}
        </View>
    )

}

export default React.memo(PersonalFinanceKFS)
