import React, {useState} from "react";
import {View} from "react-native";
import {CText, CToggleSwitch, ProgressiveImage} from "../../uiComponents";
import Styles from "./TermsAndConditions.style";
import {useTranslation} from "react-i18next";
import {formatAmount, splitFullName} from "../../utils/methods";
import moment from 'moment';
import GlobalStyle from "../../assets/stylings/GlobalStyle";

function PersonalFinanceApplication(props) {

    const { t } = useTranslation();

    const {personalLoanDetails, user, card, data} = props;

    const [lang, updateLang] = useState('en');

    let walletID = card?.walletID;
    let eid = user?.emirateID || '';
    let date = moment().format('DD-MM-YYYY');
    let fullName = user?.fullName || '';
    let firstName = splitFullName(user?.fullName).firstName;
    let lastName = splitFullName(user?.fullName).lastName;
    let gender = user?.gender;
    let mobileNumber = user?.phone ? `+${user?.phone}` : '';
    let cardNumber = card?.cardNumber || '';
    let reference1FullName =  data?.firstReferenceFullName || '';
    let reference1Relationship =  data?.firstReferenceRelation || '';
    let reference1ContactNumber =  data?.firstReferencePhone ? `+${data?.firstReferencePhone}` : '';

    let reference2FullName =  data?.localFriendFullName || '';
    let reference2Relationship =  data?.localFriendRelation || '';
    let reference2ContactNumber =   data?.localFriendPhone ? `+${data?.localFriendPhone}` : '';

    let employerName = user?.employerName || '';
    let dateOfJoining = moment(user?.issueDate).format('DD-MM-YYYY') || '';
    let designation = user?.occupation || '';
    let salaryIncome = formatAmount(personalLoanDetails?.averageSalary || 0, 'AED');
    let salaryIncomeFrequency = 'Monthly';
    let purposeOfFinance = 'Family Support';
    let financeAmount = formatAmount(data?.amount || 0, 'AED') || '';
    // let tenure = data?.noOfInstallment ? `${data?.noOfInstallment} ${data?.noOfInstallment > 1 ? 'Months' : 'Month'}` : '';
    let tenure = data?.noOfInstallment ? data?.noOfInstallment : '';

    let expense1 = Number(data?.educationExpense);
    let expense2 = Number(data?.healthcareExpense);
    let expense3 = Number(data?.maintenanceSupport);
    let expense4 = '-';
    let expense5 = Number(data?.housingRent);
    let expense6 = '-';
    let expense7 = Number(data?.foodExpense);
    let expense8 = '-';
    let expense9 = Number(data?.utilityCost);
    let expense10 = '-';
    let expense11 = '-';
    let expense12 = formatAmount(expense1 + expense2 + expense3 + expense5 + expense7 + expense9, "", 0.2, true);

    const renderEnglish = () => {
        return (
            <View>
                <CText style={Styles.kfcTitle}>Application Form - PERSONAL FINANCE</CText>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            APPLICANT PERSONAL DETAILS
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1, Styles.margin_bottom]}>
                                Title
                            </CText>
                            <View style={[Styles.checkBoxContainer]}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        {gender === "M" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Mr</CText>
                                </View>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox} />
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Mrs</CText>
                                </View>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        {gender === "F" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Ms</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    First Name
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {firstName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Middle Name
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    -
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Last Name
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {lastName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1, Styles.margin_bottom]}>
                                Gender
                            </CText>
                            <View style={[Styles.checkBoxContainer]}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        {gender === "M" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Male</CText>
                                </View>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        {gender === "F" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Female</CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            CONTACT DETAILS
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Mobile Number
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {mobileNumber}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            REFERENCE DETAILS
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.lightGray]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1]}>
                                Home Country Reference
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Full Name
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference1FullName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Relationship
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference1Relationship}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Contact Number
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference1ContactNumber}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.lightGray]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1]}>
                                UAE Reference
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Full Name
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference2FullName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Relationship
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference2Relationship}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Contact Number
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference2ContactNumber}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            EMPLOYMENT DETAILS
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Employer Name
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {employerName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Date of Joining
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {dateOfJoining}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Designation
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {designation}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    WPS Salary
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncome}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    Total Income
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncome}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            PERSONAL LIFESTYLE LIVING EXPENSES
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.lightGray]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Expenses
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Amount - (AED)
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Frequency Monthly/Yearly
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Average education expenses (Based on the number of dependents)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense1}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Average healthcare expenses (Based on the number of dependents)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense2}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Child & spousal maintenance & support for extended family
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense3}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Costs of maintaining services of other owned properties
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense4}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Housing (rent) and maintenance services, expenses (depends on whether you are the owner or tenant of the house)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense5}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Insurance / Takaful expenses (Cars, health, life, property)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense6}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Monthly food expenses (based on the number of dependents)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense7}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Property Taxes
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense8}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Utility, internet & mobile costs
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense9}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Wages to be paid for domestic workers
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense10}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    Any other expected costs or expenses
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense11}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical, Styles.boldText]}>
                                    Total Expenses
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense12}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            REQUESTED FINANCE DETAILS
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                Type of Finance
                            </CText>
                            <View style={[Styles.checkBoxContainer]}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>New / Fresh</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                Type of Murabaha
                            </CText>
                            <View style={[Styles.checkBoxContainer]}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Murabaha Investment</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Purpose of Finance
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {purposeOfFinance}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Finance Amount
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {financeAmount}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Tenure
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {tenure}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Profit Rate Type
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    Fixed Rate
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            REPAYMENT DETAILS/MODE OF PAYMENT
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                Customer Segment
                            </CText>
                            <View style={[Styles.checkBoxContainer]}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Salary Transfer</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                Frequency of Payment
                            </CText>
                            <View style={[Styles.checkBoxContainer]}>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>Monthly</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    WPS Card Number
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {cardNumber}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            ACKNOWLEDGMENT
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.margin_bottom_10]}>
                            <View style={[Styles.checkBoxContainer, Styles.column]}>
                                <View style={[Styles.checkBoxItem]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        I/we agree to waive my/our rights to the “cooling-off” period of five (5) business days so that my finance can immediately be processed. I understand that by waiving the “cooling-off” period, terms and conditions of the finance will be immediately binding on me/us.
                                    </CText>
                                </View>
                                <View style={Styles.checkBoxItem}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        I/we acknowledge receiving the Key Facts Statement (KFS) of this product, and have also read and understood the KFS.
                                    </CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10, Styles.border_top_none, Styles.lightGray]}>
                    <View style={[Styles.tableSectionBody]}>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_top_none, Styles.border_bottom_none]}>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    QR Code for Tariff of Charges
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: "https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Tariff%20of%20Charges"}}
                                />
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    QR Code for Privacy Policy
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: 'https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Privacy%20Policy'}}
                                />
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_bottom_none]}>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    QR Code for Key Fact Statement
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: "https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Key%20Fact%20Statement"}}
                                />
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    QR Code for Master Terms and Conditions
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: 'https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Master%20Terms%20and%20Conditions'}}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={[Styles.tableSectionHeader, Styles.darkGray]}>
                        <CText style={[Styles.tableSectionHeaderText, Styles.darkGrayContentColor, Styles.textCenter]}>
                            Customer Consent Letter to Obtain and Disclose Information
                        </CText>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>DECLARATION</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <View style={[Styles.row, Styles.margin_top]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>1)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    I/we hereby confirm that the information contained in this application is true and complete to the best of my/our knowledge and belief.
                                </CText>
                            </View>
                            <View style={Styles.row}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>2)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    I/we authorise Ajman Bank to obtain and disclose any financials, legal or credit information related to me/us for the purpose of this application. I/we agree that Ajman Bank may obtain, request, transfer and disclose any information (including the information Ajman Bank may obtain from any government or semi government authorities, local and international credit bureau, or through any other sources, whether inside or outside the United Arab Emirates) to any of its branches, subsidiaries, to any of its service providers and to any other third party selected by any of them or Ajman Bank.
                                </CText>
                            </View>
                            <View style={Styles.row}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>3)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    Ajman Bank will be entitled to use any or all of the information contained in this application for the purpose of granting me/us any finances, products or any other banking services offered by Ajman Bank or to use the information contained in this application for the purpose of assessing my credit position or liabilities. The provisions of this declaration will remain in force and may not be terminated or amended without Ajman Bank’s prior written consent.
                                </CText>
                            </View>
                            <View style={Styles.row}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>4)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    I/we understand and agree that Ajman Bank will determine, on the basis of its internal policies and procedures, my/our ability to afford
                                    the financing applied by me, given the information I have provided on my income, financial obligations and personal details in this
                                    application form and the documents I have supplied to Ajman Bank or any credit reports or other information which Ajman Bank has
                                    obtained from the Al Etihad credit bureau or any other sources.
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Identity Document Used
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {eid}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Name as per Document
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {fullName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Wallet Id
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {walletID}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    WPS Card Number
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {cardNumber}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right, {minHeight: 100}]}>

                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_top_none]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Customer Signature
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem]}>
                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    Date: {date}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>FOR OFFICIAL USE ONLY</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_bottom_none]}>
                            <View style={[Styles.infoViewItem]}>
                                <CText style={Styles.kfcParagraph}>
                                    Reference Number :
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>DECLARATION</CText>
                    </View>
                    <View style={[Styles.tableSectionBody, Styles.space]}>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_top_none, Styles.column, Styles.space]}>
                            <View style={[Styles.row, Styles.margin_top]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    I/we hereby confirm that: (a) all information contained in this application is complete, true, and accurate in all material respects; (b) I/we have
                                    read and fully understood the Key Facts Statement, Ajman Bank’s Master Terms and Conditions for Retail Customers, Ajman Bank’s Tariff of
                                    Charges and Ajman Bank’s privacy policy, available at <CText style={Styles.blue}>www.kamelpay.com</CText> or through the QR code below; and (c) I/we agree to be bound by
                                    and comply with the terms set out in Ajman Bank’s Master Terms and Conditions for Retail Customers and Ajman Bank’s privacy policy.
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            CHECKLIST
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.margin_bottom_10]}>
                            <View style={[Styles.checkBoxContainer, Styles.column, Styles.space]}>
                                <View style={[Styles.checkBoxItem, {flexWrap: 'wrap'}]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Key Fact Statement Signed
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, {flexWrap: 'wrap'}]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Acknowledge Tariff of Charges
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, {flexWrap: 'wrap'}]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Acknowledge Privacy Policy
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, {flexWrap: 'wrap'}]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Acknowledge Master Terms and Conditions
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, {flexWrap: 'wrap'}]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Waiver of Cooling-OFF period
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, {flexWrap: 'wrap'}]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Consent Form Signed
                                    </CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    };

    const renderArabic = () => {
        return (
            <View>
                <CText style={Styles.kfcTitle}>Application Form - PERSONAL FINANCE</CText>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            نموذج طلب تمويل شخصي
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1, Styles.margin_bottom]}>
                                السيد
                            </CText>
                            <View style={[Styles.checkBoxContainer, Styles.rowReverse]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        {gender === "M" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>السيد</CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}/>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>السيدة</CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        {gender === "F" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>اآلنسة</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    الاسم األول
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {firstName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    الاسم األوسط
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    -
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    الاسم العائلة
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {lastName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.flex_1, Styles.margin_bottom]}>
                                الجنس
                            </CText>
                            <View style={[Styles.checkBoxContainer, Styles.rowReverse]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        {gender === "M" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>ذكر</CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        {gender === "F" ? <View style={Styles.checkBoxFill} /> : null}
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>أنثى</CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            بيانات االتصال
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    رقم الهاتف
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {mobileNumber}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            التفاصيل المرجعية
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.lightGray]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1]}>
                                التفاصيل الوطن
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    االسم الكامل
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference1FullName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    العالقة
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference1Relationship}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    رقم االتصال
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference1ContactNumber}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.lightGray]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1]}>
                                التفاصيل االمارات
                            </CText>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    االسم الكامل
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference2FullName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    العالقة
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference2Relationship}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    رقم االتصال
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {reference2ContactNumber}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            تفاصيل الوظيفة و الراتب
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    اسم صاحب العمل
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {employerName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    تاريخ التعيين
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {dateOfJoining}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    المسمى الوظيفة
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {designation}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    راتب WPS
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncome}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                    الدخل اإلجمالي
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncome}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            نفقات نمط الحياة الشخصية
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.lightGray, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    النفقات
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    المبلغ - (درهم)
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    شهري / سنوي
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    متوسط نفقات التعليم ( ًبناعلى عدد المعالين)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense1}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    متوسط نفقات الرعاية الصحية ( ًبناعلى عدد المعالين)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense2}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    نفقة الطفل والزوجة ودعم األسرة الممتدة
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense3}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    تكاليف صيانة خدمات العقارات األخرى المملوكة
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense4}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    تكاليف خدمات السكن (اإليجار) والصيانة ( تعتمد على ما إذا كنت مالك المنزل أو مستأجره)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense5}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    مصاريف التأمين / التكافل ( السيارات - الصحة - الحياة - الممتلكات)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense6}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    نفقات الطعام الشهرية ( ًبناعلى عدد المعالين)
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense7}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    الضرائب العقارية
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense8}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    تكاليف المرافق واإلنترنت والهاتف المحمول
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense9}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    المنزلية للعمالة دفعها يجب التي األجور
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense10}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical]}>
                                    أي تكاليف أو نفقات أخرى متوقعة
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense11}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph, Styles.paddingVertical, Styles.boldText]}>
                                    إجمالي التكاليف
                                </CText>
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={Styles.kfcParagraph}>
                                    {expense12}
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {salaryIncomeFrequency}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            تفاصيل التمويل المطلوب
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                نوع التمويل
                            </CText>
                            <View style={[Styles.checkBoxContainer, Styles.rowReverse]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>جديد / حديث</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                نوع المرابحة
                            </CText>
                            <View style={[Styles.checkBoxContainer, Styles.rowReverse]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>استثمار المرابحة</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    الغرض من التمويل
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {purposeOfFinance}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    مبلغ التمويل
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {financeAmount}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    مدة التمويل
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {tenure}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    نوع معدل الربح
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    Fixed Rate
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            السداد طريقة /السداد تفاصيل
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                قسم العميل
                            </CText>
                            <View style={[Styles.checkBoxContainer, Styles.rowReverse]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>تحويل راتب</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <CText style={[Styles.kfcParagraph, Styles.boldText, Styles.flex_1, Styles.margin_bottom]}>
                                تكرار الدفعة
                            </CText>
                            <View style={[Styles.checkBoxContainer, Styles.rowReverse]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.kfcParagraph]}>شهريًا</CText>
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    رقم بطاقة WPS
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={Styles.kfcParagraph}>
                                    {cardNumber}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            إقرار
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.margin_bottom_10]}>
                            <View style={[Styles.checkBoxContainer, Styles.column]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        أوافـق / نوافـق علـى التنـازل عـن حقـي / حقنـا فـي »فتـرة السـماح باإللغاء« التـي مدتها خمسـة (5)
                                        أيــام عمــل حتــى يتمكــن المصــرف مــن المضــي قدمــا بطلــب التمويــل الخــاص بــي / بنــا علــى
                                        الفـور. أتفهـم / نتفهـم أنـه بالتنـازل عـن » فتـرة السـماح باإللغـاء«، تصبـح شـروط وأحـكام التمويـل
                                        ملزــمةــلي /لــنا عــلى الــفور
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={[Styles.checkBox, Styles.margin_left_10]}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        أقـر / نقـر باسـتالم بيـان الحقائـق األساسـية لهـذا المنتـج، وقـد قمـت / قمنـا أيـضًا بقـراءة وفهـم
                                        بـيان الحقاـئق األساـسية
                                    </CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10, Styles.border_top_none, Styles.lightGray]}>
                    <View style={[Styles.tableSectionBody]}>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_top_none, Styles.border_bottom_none]}>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    رمز االستجابة السريعة لتعرفة الرسوم
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: "https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Tariff%20of%20Charges"}}
                                />
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    رمز االستجابة السريعة لسياسة الخصوصية
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: 'https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Privacy%20Policy'}}
                                />
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_bottom_none]}>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    رمز االستجابة السريعة لبيان الحقائق األساسية
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: "https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Key%20Fact%20Statement"}}
                                />
                            </View>
                            <View style={[Styles.infoViewItem, Styles.border_right, Styles.paddingVertical, Styles.alignItemsCenter]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1, Styles.textCenter]}>
                                    رمز االستجابة السريعة للشروط واألحكام الرئيسية
                                </CText>
                                <ProgressiveImage
                                    style={{width: 100, height: 100}}
                                    source={{uri: 'https://kp-uat.s3.me-south-1.amazonaws.com/QR%20Code%20for%20Master%20Terms%20and%20Conditions'}}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={[Styles.tableSectionHeader, Styles.darkGray]}>
                        <CText style={[Styles.tableSectionHeaderText, Styles.darkGrayContentColor, Styles.textCenter]}>
                            خطاب موافقة من العميل للحصول على المعلومات واإلفصاح
                        </CText>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>إقرار</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                            <View style={[Styles.row, Styles.margin_top, Styles.rowReverse]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>1)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    أؤكــد / نؤكــد بموجــب هــذا أن المعلومــات المقدمــة فــي هــذا الطلــب صحيحــة وكاملــة علــى ـد علـي / علمـا واعتـادي / اعتقادـا
                                </CText>
                            </View>
                            <View style={[Styles.row, Styles.rowReverse]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>2)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    أفـوض / نفـوض مصـرف عجمـان بالحصـول علـى أي معلومـات ماليـة أو قانونيـة أو ائتمانيـة تتعلق بـي / بنـا واإلفصـاح عنهـا لغـرض طلـب التمويـل الشـخصي هـذا. أوافـق / نوافـق علـى أنـه يجـوز لمصـرف عجمـان الحصـول علـى أي معلومـات وطلبهـا ونقلهـا واإلفصـاح عنهـا (بمـا فـي ذلـك المعلومـات التـي قـد يحصـل عليهـا مصـرف عجمـان مـن أي جهـات حكوميـة أو شـبه حكوميـة أو مكتـب ائتمـان محلـي ودولـي أو مـن خالل أي مصـادر أخـرى سـواء داخـل دولـة اإلمـارات العربيـة المتحــدة أو خارجهــا) إلــى أي مــن فروعهــا وشــركاتها التابعــة وإلــى أي مــن مقدمــي الخدمــات لديـا وأي ـرف ثاـث يخـاره أي منـم أو مـرف عجـان
                                </CText>
                            </View>
                            <View style={[Styles.row, Styles.rowReverse]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>3)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    يحـق لمصـرف عجمـان اسـتخدام أي مـن أو جميـع المعلومـات الـواردة فـي هـذا الطلـب لغـرض
                                    منحـي/ منحنـا أي تمويـل أو منتجـات أو أي خدمـات مصرفيـة أخـرى يقدمهـا مصـرف عجمـان أو
                                    السـتخدام المعلومـات الـواردة لغـرض تقييـم وضعـي االئتمانـي أو التزاماتـي. تظـل أحـكام هـذا
                                    اإلقــرار ســاري المفعــول وال يجــوز إنهــاؤه أو تعديلــه دون موافقــة خطيــة مســبقة مــن مصــرف
                                    عجــمان.
                                </CText>
                            </View>
                            <View style={[Styles.row, Styles.rowReverse]}>
                                <View style={Styles.spaceHorizontal}>
                                    <CText style={Styles.kfcParagraph}>4)</CText>
                                </View>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    أفهــم أوافــق / نفهــم ونوافــق علــى أن يحــدد مصــرف عجمــان، بنــاًًء علــى سياســاته وإجراءاتــه
                                    الداخليــة، قدرتي/قدرتنــا علــى تحمــل تكلفــة التمويــل الــذي تقدمــت بطلبــه، وذلــك بنــاًًء علــى
                                    المعلومـات التـي قدمتهـا حـول دخلـي والتزاماتـي الماليـة ومعلوماتـي الشـخصية فـي نمـوذج
                                    الطلــب هــذا والوثائــق التــي قدمتهــا إلــى مصــرف عجمــان أو أي تقاريــر ائتمانيــة أو أي معلومــات
                                    أخــرى حصــل عليهــا مصــرف عجمــان مــن مكتــب االتحــاد للمعلومــات االئتمانيــة أو أي مصــادر
                                    أــخرى
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    وثيقة الهوية المستخدمة
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {eid}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    االسم حسب الوثيقة
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {fullName}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    معرف المحفظة
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {walletID}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem, Styles.border_left]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    رقم بطاقة WPS
                                </CText>
                            </View>
                            <View style={Styles.infoViewItem}>
                                <CText style={[Styles.kfcParagraph]}>
                                    {cardNumber}
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem,  {minHeight: 100}]}>

                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_top_none]}>
                            <View style={[Styles.infoViewItem]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    توقيع مقدم الطلب
                                </CText>
                            </View>
                        </View>
                        <View style={[Styles.tableSectionBodyItem, Styles.rowReverse]}>
                            <View style={[Styles.infoViewItem]}>
                                <CText style={[Styles.kfcParagraph]}>
                                    التاريخ: {date}
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>لالستخدام الرسمي فقط</CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_bottom_none]}>
                            <View style={[Styles.infoViewItem]}>
                                <CText style={Styles.kfcParagraph}>
                                    الرقم المرجعي :
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection, Styles.margin_bottom_10]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>إقرار</CText>
                    </View>
                    <View style={[Styles.tableSectionBody, Styles.space]}>
                        <View style={[Styles.tableSectionBodyItem, Styles.border_top_none, Styles.column, Styles.space]}>
                            <View style={[Styles.row, Styles.margin_top]}>
                                <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                    أؤكــد / نؤكــد بموجــب هــذه الوثيقــة بمــا يلــي: (أ) أن جميــع المعلومــات الــواردة فــي هــذا الطلــب كاملــة وصحيحــة ودقيقــة مــن جميــع النواحــي األساســية؛ (ب) أننــي قــرأت / قرأنــا وفهمــت / فهمنـا تمـامًا بيـان الحقائـق الرئيسـية، وشـروط وأحـكام مصـرف عجمـان الرئيسـية لعـمالء التجزئـة، وتعرفـة مصـرف عجمـان للرسـوم وسياسـة الخصوصيـة لمصـرف عجمـان المتوفـرة علـى الموقـع اإللكترونــي <CText style={Styles.blue}>www.kamelpay.com</CText> أو مــن خالل رمــز االســتجابة الســريعة أدنــاه؛ و (ج) أننــي أوافــق علـى االلتـزام واالمتثـال للشـروط المنصـوص عليهـا فـي شـروط وأحـكام مصـرف عجمـان الرئيسـية لـمالء التجزـة وسياـة الخصوصـة لمـرف عجـان
                                </CText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[Styles.tableSection]}>
                    <View style={Styles.tableSectionHeader}>
                        <CText style={Styles.tableSectionHeaderText}>
                            قائمة مرجعية
                        </CText>
                    </View>
                    <View style={Styles.tableSectionBody}>
                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space, Styles.margin_bottom_10]}>
                            <View style={[Styles.checkBoxContainer, Styles.column, Styles.space]}>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Key Fact Statement Signed
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Acknowledge Tariff of Charges
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Acknowledge Privacy Policy
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Acknowledge Master Terms and Conditions
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Waiver of Cooling-OFF period
                                    </CText>
                                </View>
                                <View style={[Styles.checkBoxItem, Styles.rowReverse]}>
                                    <View style={Styles.checkBox}>
                                        <View style={Styles.checkBoxFill} />
                                    </View>
                                    <CText style={[Styles.checkBoxText, Styles.flex_1]}>
                                        Consent Form Signed
                                    </CText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }

    return (
        <View>
            <View style={GlobalStyle.toggleView}>
                <CText style={GlobalStyle.toggleViewText}> View {lang == 'ar' ? 'English' : 'Arabic'} </CText>
                <CToggleSwitch style={{}} onToggle={() => updateLang(lang === 'ar' ? 'en' : 'ar')} isOn={lang === 'ar'} />
            </View>
            {(lang === 'ar') ? renderArabic() : renderEnglish()}
        </View>
    )
}

export default React.memo(PersonalFinanceApplication)
