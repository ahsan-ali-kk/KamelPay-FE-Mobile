import React, {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {CModal, CText, ProgressiveImage, CButton} from "../../uiComponents";
import Styles from "./TermsAndConditions.style";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {toggleSubscriptionModal} from "../../store/actions/Savings.action";
import {viewTermsAndConditions} from "../../store/actions/Global.action";
import {formatAmount, getFullName, getPhone, MappedElement} from "../../utils/methods";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import moment from "moment";
import PersonalFinanceKFS from './PersonalFinanceKFS';
import PersonalFinanceApplication from './PersonalFinanceApplication';

function TermsAndConditions(props) {

    const navigation = useNavigation();

    const { t } = useTranslation();

    const { isOpen = false, close, type, data } = props;

    const dispatch = useDispatch();

    const reduxState = useSelector(({auth, global, savings, advanceSalary, personalLoan}) => {
        return {
            termAndConditions: global.termAndConditions,
            toggleSubscription: savings.toggleSubscription,
            user: auth.user,
            card: global.selectedCard,
            advanceSalaryDetails: advanceSalary.advanceSalaryEligibility,
            personalLoanEligibility: personalLoan.personalLoanEligibility,
        }
    });

    const [disableButton, updateDisableButton] = useState(false);

    const getData = () => {
        switch (type || reduxState?.termAndConditions?.type) {
            case "SAVINGS_SUBSCRIPTION_TERMS_AND_CONDITION":
                return {
                    title: t('GLOBAL.TERMS_AND_CONDITION'),
                    callback: () => {
                        dispatch(viewTermsAndConditions({ isOpen: false }));
                        setTimeout(() => {
                            dispatch(toggleSubscriptionModal({
                                isOpen: true,
                                otp_verified: reduxState?.toggleSubscription?.otp_verified || false,
                            }));
                        }, 100)
                    },
                    questionsAndAnswer: [
                        {
                            question: 'What is KAMEL SAVINGS?',
                            answer: 'KAMEL SAVINGS  is a monthly subscription program paterned with SAVINGS to provide additional value across restaurants & pharmacies in UAE'
                        },
                        {
                            question: 'Which restaurants and pharmacies can I avail offers from?',
                            answer: 'Please visit SAVINGS website to view all restaurant and pharmacies list.'
                        },
                        {
                            question: 'What are the charges for KAMEL SAVINGS?',
                            answer: 'After a free 30 day trial, AED 3 + VAT will be applicable to avail KAMEL SAVINGS subscription'
                        },
                        {
                            question: 'How do I avail the offers?',
                            answer: 'A Simply visit a restaurant or pharmacy which is listed on SAVINGS. These restaurants and pharmacies will have a SAVINGS logo/branding present. Now open your unique QR code on the KAMELPAY app and scan at the counter during check out to avail.'
                        },
                        {
                            question: 'Are KAMEL SAVINGS offers available online?',
                            answer: 'A No, currently all offers are only available in the restaurants and pharmacies physical outlets'
                        },
                        {
                            question: 'How many times can I avail the offers and discounts?',
                            answer: 'You can avail the offers and discounts unlimited times'
                        },
                        {
                            question: 'How can I cancel my subscription?',
                            answer: 'A Simply go to App Settings and click cancel Unsubscribe Kamel Savings subscription to discontinue your subscription'
                        }
                    ]
                };
            case "REMITTANCE":
                return {
                    title: t('GLOBAL.TERMS_AND_CONDITION'),
                    callback: () => {
                        dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    section: [
                        {
                            title: 'Sending remittances',
                            points: [
                                {
                                    text: 'You can send money abroad to individuals only such as your family members and friends from the NaqaD app. You authorize Us to debit the available balance on your PayD card for the transaction amount and all applicable charges to process the remittance transaction.',
                                },
                                {
                                    text: 'Individual transaction limits and per day limits will apply which can vary and are subject to change at Kamelpay’s discretion. There could be an additional limit applied by theBeneficiary country as per local regulation which is beyond the control of Kamelpay and its partner(s). We will do our best to show you such limits at the time of transaction.',
                                },
                                {
                                    text: 'We will ask you for the complete and accurate information of the intended recipient to process the remittance payment including but not limited to beneficiary details, government-issued photo identification and mode of payment.',
                                },
                                {
                                    text: 'We and our fulfilment partner(s) are entitled to conduct due diligence as per the industry standards on the information you have provided and further validate/inquire with the intended recipient the before crediting the bank account, a mobile wallet or cash over the counter.',
                                },
                                {
                                    text: 'Your payment instruction may be revoked after it has been received by Us for compliance reasons and money could be lost or delayed in getting credited back to you.',
                                },
                                {
                                    text: 'Kamelpay aims to make sure payments arrive at their destination as quickly as possible but We are not responsible for any delays by the receiving party bank in crediting the recipient’s account or other mode of payout.',
                                },
                                {
                                    text: 'Payments made on a day which is not a business day will be deemed to have been received on the following business day',
                                },
                                {
                                    text: 'We ask all relevant information related to the payment such as transaction amount and currency, beneficiary or recipient name and payout details such as bank account, mobile wallets or cash-over-the counter'
                                },
                            ]
                        },
                        {
                            title: 'Incorrect details and consequences',
                            points: [
                                {
                                    text: 'It is your responsibility to provide accurate, complete and authentic information. We or Our partner(s) do not accept any liability for incorrect details.',
                                },
                                {
                                    text: 'Incomplete or erroneous details will lead to delays in completing the payment or may be rejected completed and money could be lost permanently. All fees paid by you to us may not be refunded to you whether the payment is processes successfully or rejected.',
                                },
                                {
                                    text: 'You must notify us immediately if you have made an incorrect or erroneous payment. You can inform Us by all available touch points on the NaqaD App.',
                                },
                                {
                                    text: 'If You provide us with incorrect details, we will make reasonable efforts to assist You in getting Your money back. However this depends on various factors and even though the recovery of funds is possible, You may not receive the full money back. We may apply additional charges for the recovery effort.',
                                },
                                {
                                    text: 'We will not honour any refund request where we can share the evidence from the beneficiary bank or agent that funds have already been disbursed or where we can provide the information that you failed to keep your NaqaD app credentials secure and confidential or you acted or tried to act fraudulently.',
                                },
                                {
                                    text: 'If we are unable to recover the funds, we will provide you with the relevant information for your records so you can use it to recover funds through your own efforts.',
                                },
                                {
                                    text: 'Payments made on a day which is not a business day will be deemed to have been received on the following business day',
                                },
                                {
                                    text: 'If an incorrect payment is made on your account as a result of our error, we shall refund the payment and any related fees. Where a payment is delayed, we will request the bank receiving the payment to value date the payment no later than the date that would have applied had it being made correctly.'
                                },
                            ]
                        },
                        {
                            title: 'Stop Payment and Refunds',
                            points: [
                                {
                                    text: 'While We will do all we can to support your stop payment request, You accept that this may not be possible and your funds may be lost and no refund is possible.',
                                },
                                {
                                    text: 'Refunds shall not apply, and we will not be liable for any losses in respect of unauthorized payments if:',
                                    points: [
                                        {
                                            text: 'You have acted fraudulently, or',
                                        },
                                        {
                                            text: 'You compromised your NaqaD app login credentials or failed to fulfil your obligations in the Agreement related to Security, Confidentiality and Privacy.',
                                        },
                                        {
                                            text: 'if you fail to dispute the transaction within 3 months of the date of the transaction.',
                                        },
                                    ]
                                },

                            ]
                        },
                        {
                            title: 'Payments Processing',
                            points: [
                                {
                                    text: 'We reserve the right to delay or refuse to make a payment, stop a payment, or delay a payment if:',
                                    points: [
                                        {
                                            text: 'We believe that processing the transaction would breach these Terms or the Agreement',
                                        },
                                        {
                                            text: 'You did not provide the required information accurately and completely to process the instruction and requires Us to seek additional information or further checks',
                                        },
                                        {
                                            text: 'You do not have sufficient funds to process the transaction',
                                        },
                                        {
                                            text: 'The transaction amount is in excess of any applicable transaction limit',
                                        },
                                        {
                                            text: 'The transaction request does not fulfil all regulatory requirements on transaction monitoring and screening',
                                        },
                                        {
                                            text: 'We are prevented from making the payment due to any Force Majeure Event',
                                        },
                                        {
                                            text: 'We are prevented by a third party from making the payment',
                                        },
                                        {
                                            text: 'we have asked you for important information and is not yet received',
                                        },
                                    ]
                                },
                                {
                                    text: 'We will contact you through secure method and on the registered details we hold against your profile to collect additional information or resolve any issue unless prevented by the competent authorities or regulations.',
                                },
                                {
                                    text: 'In case You are not reachable, we may put the payment on hold or return the funds to your account at Our discretion.',
                                },
                            ]
                        },
                        {
                            title: 'Fees and charges',
                            points: [
                                {
                                    text: 'We will clearly display the applicable foreign exchange rate and all applicable fees and charges prior to sending the transaction through the NaqaD app. You are required to confirm the transaction after reviewing the transaction details.',
                                },
                                {
                                    text: 'While We do our best to display all applicable charges; the beneficiary bank may levy and deduct additional fees from the final amount received by the Beneficiary in the account which is beyond our control.',
                                },
                                {
                                    text: 'We reserve the right to change the foreign exchange rate when the financial currency markets are not operating such as weekends and public holidays to protect Us from the market fluctuations.',
                                },
                            ]
                        }
                    ],
                };
            case "CARDHOLDER_AGREEMENT":
                return {
                    title: t('GLOBAL.TERMS_AND_CONDITION'),
                    callback: () => {
                        dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    section: [
                        {
                            title: 'PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING THE CARD OR THE APPLICATION',
                        },
                        {
                            title: 'What’s in these terms?',
                            points: [
                                {
                                    text: 'HAQ Kamel Pay Services LLC (“We”, “us” or “our”) provides corporate payments solutions. This document sets out the terms and conditions, including the Cardholder terms and conditions and Application terms and conditions (“Terms”) that apply to our application (the “Application”) and to the use of the Mastercard debit card (“the Card”) by an individual whose employer engages us (“you” or “your”). The Card is issued by Ajman Bank PJSC (the “Issuer”).',
                                },
                                {
                                    text: 'These Terms form an agreement and will apply between you and us.',
                                },
                            ]
                        },
                        {
                            title: 'Who we are and how to contact us',
                            points: [
                                {
                                    text: 'We are a limited liability company registered in the United Arab Emirates (“UAE”) with commercial license number 883755 issued by the Department of Economic Development, Government of Dubai, UAE and have our registered office at 1901, Opal Tower, Burj Khalifa Street, Business Bay, Dubai, UAE.',
                                },
                                {
                                    text: 'To contact us, please email info@kamelpay.com or phone (+971) 4 562 3700. Please note that calls may be monitored and/or recorded.',
                                },
                            ]
                        },
                        {
                            title: 'By using the Card and our Application you accept these Terms',
                            points: [
                                {
                                    text: 'By using the Card and/or our Application, you accept these Terms and agree that you comply with them. If you do not agree to these Terms, you must not use the Card or our Application. We recommend that you print a copy of these Terms for future reference.',
                                },
                                {
                                    text: 'You are also responsible for ensuring that all persons who access our Application through your internet connection are aware of these Terms and other applicable Terms, and that they comply with them.',
                                },
                            ]
                        },
                        {
                            title: 'There are other terms that may apply to you',
                            points: [
                                {
                                    text: 'By using the Card and/or our Application, you accept these Terms and agree that you comply with them. If you do not agree to these Terms, you must not use the Card or our Application. We recommend that you print a copy of these Terms for future reference.',
                                }
                            ]
                        },
                        {
                            title: 'We may make changes to these Terms',
                            points: [
                                {
                                    text: 'We amend these Terms from time to time. These Terms were most recently updated on 17 January 2022. We will publish amended Terms on the Application and our website www.kamelpay.com, and the Terms you read here are the latest version published by us.',
                                }
                            ]
                        },
                        {
                            title: 'We may transfer our rights and obligations to someone else',
                            points: [
                                {
                                    text: 'We may transfer our rights and obligations under these Terms to another organisation. We will always tell you in writing if this happens and we will ensure that the transfer will not affect your rights under the Terms.',
                                }
                            ]
                        },
                        {
                            title: 'Acts beyond our control',
                            points: [
                                {
                                    text: 'To the extent permitted by law, we will not be liable to you for any loss or damage (whether direct, indirect or consequential), nor be at fault under these Terms, for failure to observe or perform any of our obligations for any reason or cause which could not, with reasonable diligence, be controlled or prevented by us, or which were outside our reasonable control. These causes include, but are not limited to acts of God, acts of nature, acts or omissions of governments or their agencies, strikes or other industrial action, fire, flood, storm, riots, power shortages or failure, sudden and unexpected system failure or disruption by war or sabotage, and other acts or omissions of third parties.',
                                }
                            ]
                        },
                        {
                            title: 'Which country’s laws apply to these Terms and any disputes?',
                            points: [
                                {
                                    text: 'You should note that these Terms, their subject matter and their formation, are governed by the laws of the Emirate of Dubai and the Federal laws of the UAE. You and us both agree that the courts of Dubai will have exclusive jurisdiction over any disputes. This Paragraph shall not however prejudice the rights of the Issuer to bring proceedings against you in any other jurisdiction.',
                                },
                                {
                                    text: 'Any reference to “Applicable Laws and Regulations” shall be a reference to the laws of the Emirate of Dubai and the Federal laws of the UAE as are in force from time to time.'
                                }
                            ]
                        },
                        {
                            title: 'Cardholder terms and conditions',
                            points: [
                                {
                                    text: 'You understand and agree that the issuance of the Card is subject to you complying with these Terms.',
                                },
                                {
                                    text: 'You have authorised your employer, or any company that you have worked for owing money to you, to deposit your salary, compensation, commissions, incentives, expense reimbursement payments and net of authorised deductions (“Payment”) into your card account, which is the record we maintain to account for funds that are available to you through the Card (“Account”).'
                                },
                                {
                                    text: 'You understand that we may share limited information of your Account with your employer to deposit Payments into the Account'
                                },
                                {
                                    text: 'You understand that the Card is non-transferrable and that we may cancel, repossess or revoke the Card at any time without prior notice subject to the Applicable Laws and Regulations and any applicable guidelines provided to you by your employer.'
                                },
                                {
                                    text: 'You must provide all information which we reasonably require in order to comply with Applicable Laws and Regulations or laws and regulations of any other country.'
                                }
                            ]
                        },
                        {
                            title: 'Information about the Card',
                            points: [
                                {
                                    text: 'The Card is a debit card that can be used by you to make purchases or payments or carry out transactions using funds in your Account. The Card is not a credit or charge card and there is no credit line associated with the Card. Your Account is linked with the Card and carries no privileges except as stated in the Terms.',
                                },
                                {
                                    text: 'The currency of the Account and the Card is United Arab Dirhams (“AED”) and transactions in alternative currencies will be converted to AED. Conversion rates and any charges notified to you by the Issuer shall apply.'
                                },
                                {
                                    text: 'The Card will be valid for five (5) years as shown on the front of the Card. Following the expiry date, the Card will no longer work but a replacement Card may be issued at the request of your employer and the balance on your previous Card transferred to your new Card.'
                                }
                            ]
                        },
                        {
                            title: 'Setting up the Card',
                            points: [
                                {
                                    text: 'You will receive one personalised Card. After we have verified your identity documents, the PIN number for your Card will be provided to you through a secure method. You must keep this PIN number secure. The PIN number can be changed at the Issuer’s automated teller machine (“ATM”) or through the Application. You must sign the signature column on the back of the Card upon receipt of the Card before your Card is ready for use.',
                                }
                            ]
                        },
                        {
                            title: 'Using the Card',
                            points: [
                                {
                                    text: 'Payments that are transferred from your employer or any company that you have worked for owing money to you, either through the UAE Wage Protection System (“WPS”) or other approved payment systems as applicable, can be credited to your Account. You understand that you can use the Card to access funds in your Account from time to time by using an ATM, the Application (as set out in the Application terms and conditions) or at point of sale terminals at which Mastercard is accepted.',
                                },
                                {
                                    text: 'You agree that we have no obligation to monitor, review or evaluate the legality of your Card transactions. Furthermore, you acknowledge that the Card may not be used to purchase goods or services that are illegal or that a merchant is not permitted to supply and that it is your responsibility to determine the legality of each transaction.'
                                },
                                {
                                    text: 'You understand that the Card may not be accepted at such merchants which are not in compliance with the Issuer’s internal policies or Shari’a requirements as determined at the Issuer’s sole discretion. You agree not to use the Card for accessing or purchasing goods from adult or gambling locations or internet sites or for any non-Shari’a compliant activity, goods and services or for any other activities for which you are prohibited to use the Card for under Applicable Laws and Regulations or under any employer guidelines as notified to you from time to time. You understand that merchants may charge additional fees for your use of the Card to purchase goods or services and to enable us to approve transactions.'
                                },
                                {
                                    text: 'Cash withdrawals and balance enquiries can be made at ATMs with the UAE switch or Mastercard logo. Cash withdrawal and balance enquiries from the Issuer’s ATMs are free, however charges may apply to withdrawals obtained or enquiries made at alternative banks. You should note that if an ATM displays a balance for your funds in a currency other than AED, the exchange rate applied may be different to that which applies to the Card.'
                                },
                                {
                                    text: 'You are required to keep the Card and any details on the Card safe. The Card should be for personal use only and any misuse by a third party will be at your risk. You also agree to keep the mobile phone, the number for which is linked to your Account, safe as we will use this as a way to verify that you are the owner of the Card for transactional approval and other services. You are responsible for keeping the mobile number up to date in our records in case of any change to the number.'
                                }
                            ]
                        },
                        {
                            title: 'Loss, theft, damage or misuse of the Card',
                            points: [
                                {
                                    text: 'If your Card is lost, stolen, damaged or misused, you should contact our customer service centre at (+971) 4 562 3700 (please note that calls may be monitored and/or recorded). We will then assist you in blocking the Card and replacing it with a new Card. You may incur admin fees associated with the reissuing of the Card which we shall notify you of upon you requesting a new Card.',
                                },
                                {
                                    text: 'The balance in your Account when the card is lost or stolen, will be transferred to the new Card however you may be liable for transactions that you did not authorise, that were incurred before we cancelled your original Card.'
                                }
                            ]
                        },
                        {
                            title: 'Ownership of the Card',
                            points: [
                                {
                                    text: 'You should return or immediately destroy the Card when it has expired or if required by us pursuant to Paragraph 13.',
                                },
                                {
                                    text: 'You agree that we may delay, block or refuse to process any transaction, including having the right to deactivate your card, without incurring liability if we suspect that a transaction:',
                                    points: [
                                        {
                                            text: 'may breach any Applicable Laws and Regulations, or any laws and regulations in any other country;'
                                        },
                                        {
                                            text: 'involves any sanctioned person (natural, corporate and governmental) under economic and trade sanctions imposed by the United Nations, the European Union, the UAE or any country;'
                                        },
                                        {
                                            text: 'may directly or indirectly be applied for the purposes of, unlawful conduct; or'
                                        },
                                        {
                                            text: 'for any other valid and legal reasons.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Liability and Error Resolution Procedures',
                            points: [
                                {
                                    text: 'You agree that we are not liable:',
                                    points: [
                                        {
                                            text: 'for any prohibited use or misuse of the Card whatsoever;'
                                        },
                                        {
                                            text: 'for any failed transaction if you do not have sufficient funds stored in your Account to carry out a transaction, if the ATM or point of sale terminal is not working or in circumstances beyond our control that prevent the transaction;'
                                        },
                                        {
                                            text: 'for any non-acceptance of the Card;'
                                        },
                                        {
                                            text: 'if there is a discrepancy, complaint or dispute related to the goods or services purchased or leased with a Card. You must address such circumstances and settle them directly with the merchant in question. Refunds and returns are subject to the merchant’s policies or Applicable Laws and Regulations; and/or'
                                        },
                                        {
                                            text: 'if any merchant authorises an amount greater than the purchase amount to be paid on your Card.'
                                        }
                                    ]
                                },
                                {
                                    text: 'Your employer or any company that you have worked for owing money to you, is responsible for full and timely Payments in accordance with Applicable Laws and Regulations. You acknowledge and agree that any claims or discrepancies arising from the Payments shall be addressed exclusively with the employer or company that you have worked for owing money to you. You further acknowledge and agree that neither we nor the Issuer are liable in any way for any claims in respect thereof. If your employer mistakenly makes a Payment into your Account to which you are not entitled, we may deduct all or part of those funds from your Account and are not required to give you notice before these funds are removed.'
                                },
                                {
                                    text: 'The Payments made into your Account may be subject to garnishment, attachments, levies, freezing orders, court orders or other administrative or legal processes. We are required to comply with any administrative or legal requests we receive in connection with your Account. You agree to indemnify us and hold us harmless against any claims arising as a result of our compliance with any such administrative or legal requests.'
                                },
                                {
                                    text: 'To the extent permitted by law, you indemnify us against any loss or damage we may suffer due to any claim, demand or action of any kind brought against us directly or indirectly because you:',
                                    points: [
                                        {
                                            text: 'did not observe any obligations hereunder; or'
                                        },
                                        {
                                            text: 'acted negligently or fraudulently in connection with these Terms.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Return of funds from your Account',
                            points: [
                                {
                                    text: 'Any funds available in your Account may be returned to your employer:',
                                    points: [
                                        {
                                            text: 'if you have requested and received equivalent salary funds available in your Account from your employer upon termination of employment or through a cash advance in any emergency situation; or'
                                        },
                                        {
                                            text: 'if the funds in the Account were given to you by your employer for company related expenses or non-personal use.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Changes to the services',
                            points: [
                                {
                                    text: 'We may from time to time take such actions and/or make such changes as we reasonably consider to be necessary for the purpose of protecting electronic funds from misuse, fraud prevention, overcoming operational difficulties, complying with Applicable Laws and Regulations (in particular, WPS, UAE Central Bank and/or Ministry of Labour rules and regulations), or improving the efficiency and general performance of the Cards. This may include changing the daily ATM cash withdrawal limits, cancelling the Card and refunding the balance, declining to authorise transactions, suspending or restricting all or part of the operation of the Card or instructing a merchant to retain the Card.',
                                }
                            ]
                        },
                        {
                            title: 'Application Terms and Conditions',
                            points: [
                                {
                                    text: 'You understand and agree that your use of the Application is subject to you agreeing to and complying with these Terms. Should you at any time whilst using the Application, no longer agree with these Terms, you should stop using the Application and delete it immediately.',
                                },
                                {
                                    text: 'Our Application is directed to people residing in the UAE and we do not represent that content available on or through our Application is appropriate for use in other locations. You may however use the Application when travelling or abroad from time to time.'
                                }
                            ]
                        },
                        {
                            title: 'Your access to the Application',
                            points: [
                                {
                                    text: 'You are entitled to access the Application through your Apple iOS or Android personal devices including mobile phones, smart devices, tablets, laptops and computers. You will be assumed to have obtained permission to download and use the Application from the owner of the personal device that you use to access the Application, if you do not use your own.',
                                },
                                {
                                    text: 'From time to time, updates to the Application may be issued through the Apple App Store or Google Play Store. Depending on the update, you may not be able to use the Application until you have downloaded or streamed the latest version of the Application.',
                                },
                                {
                                    text: 'By using the Application, you consent to us collecting and using technical information about the personal device that you use and related software, hardware and peripherals where use of the Application is internet-based or wireless, to improve our Application and your use of it.',
                                },
                                {
                                    text: 'We are not responsible for any data usage, roaming or other charges you incur when accessing the internet through your personal or other device.',
                                },
                                {
                                    text: 'We may suspend, restrict or end your access to the Application where:',
                                    points: [
                                        {
                                            text: 'we reasonably believe that your security details have not been kept safe;'
                                        },
                                        {
                                            text: 'we reasonably suspect that your security details have been used fraudulently or without your permission;'
                                        },
                                        {
                                            text: 'you have acted in breach of any of these Terms.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'You must keep your account details safe',
                            points: [
                                {
                                    text: 'If you choose, or you are provided with, security details to access the Application, you must treat such information as confidential. You must not disclose this information to any third party. We will not be responsible if you share any of your security details to access the Application with a third party and suffer loss or damage as a result.',
                                },
                                {
                                    text: 'If you know or suspect that anyone other than you knows your security details, you must promptly notify us at info@kamelpay.com.',
                                }
                            ]
                        },
                        {
                            title: 'Services provided through the Application',
                            points: [
                                {
                                    text: 'You will have access to the following services when using the Application:',
                                    points: [
                                        {
                                            text: 'create and manage your profile;'
                                        },
                                        {
                                            text: 'set and change the PIN number for your Card;'
                                        },
                                        {
                                            text: 'track your balance and view your statements; and'
                                        },
                                        {
                                            text: 'make payments including remittances, bill payments or top-ups.'
                                        }
                                    ]
                                },
                                {
                                    text: 'You will be able to make payments through the Application that will be made using the funds in your Account. Any payments made from your Account through the Application will need to be authorised by you. Your Account balance will reflect any payments made using the Application.',
                                },
                                {
                                    text: 'We reserve the right to change the services provided through the Application.',
                                },
                                {
                                    text: 'The addition of services available on the Application, including financial and non-financial services, features and products, will be at our sole discretion.',
                                },
                                {
                                    text: 'Our Application is made available to you free of charge, however fees may be incurred by you for various services provided on the Application including, but not limited to, subscription fees, transaction fees and statement download fees. You will be notified of any fees that you will incur for such services when using the Application where fees are incurred. These fees will be deducted from your Account.',
                                }
                            ]
                        },
                        {
                            title: 'Third-party website links',
                            points: [
                                {
                                    text: 'There may be links to third-party websites on our Application; such third-party sites are not under our control and we are not responsible for and do not endorse their content or their privacy policies. You will be responsible for making your own independent judgement regarding your use of third-party sites.',
                                }
                            ]
                        },
                        {
                            title: 'No text or data mining, or web scraping',
                            points: [
                                {
                                    text: 'You shall not conduct, facilitate, authorise or permit any text or data mining or web scraping in relation to our Application or any services provided when using, or in relation to, our Application. This includes using (or permitting, authorising or attempting the use of):',
                                    points: [
                                        {
                                            text: 'any “robot”, “bot”, “spider”, “scraper” or other automated device, program, tool, algorithm, code, process or methodology to access, obtain, copy, monitor or republish any portion of the Application or any data, content, information or services accessed via the Application; and'
                                        },
                                        {
                                            text: 'any automated analytical technique aimed at analysing text and data in digital form to generate information which includes but is not limited to patterns, trends and correlations. This Paragraph shall not apply insofar as (but only to the extent that) we are unable to exclude or limit text or data mining or web scraping activity by contract under the Applicable Laws and Regulations.'
                                        }
                                    ]
                                },
                                {
                                    text: 'This Application, its content and any services provided in relation to the same are only targeted to, and intended for use by, individuals located in the UAE. You may be able to access, view or make use of this Application and any related content and services outside of the UAE, however we do not guarantee and shall not be responsible for any such use of the Application by you outside of the UAE.',
                                }
                            ]
                        },
                        {
                            title: 'Do not rely on information on this Application',
                            points: [
                                {
                                    text: 'Although we make reasonable efforts to update and ensure the accuracy of the information on our Application, we make no representations, warranties or guarantees, whether express or implied, that the content on our application is accurate, complete or up to date. If you have any concerns regarding the information set out regarding your Account, provided to you when using the Application, please call us (+971) 4 562 3700 or email info@kamelpay.com.',
                                }
                            ]
                        },
                        {
                            title: 'Our responsibility for loss or damage suffered by you',
                            points: [
                                {
                                    text: 'We do not exclude or limit in any way our liability to you where it would be unlawful to do so. This includes liability for death or personal injury caused by our negligence or the negligence of our employees, agents or subcontractors.',
                                },
                                {
                                    text: 'he Application is provided “AS IS” and “AS AVAILABLE”. We disclaim all warranties, express, implied or statutory, including the implied warranties of merchantability, fitness for purpose and non-infringement. In no way do we warrant the quality, suitability or availability of the Application or that the Application is uninterrupted or error-free. You agree that the entire risk arising out of your use of the Application remains solely with you to the maximum extent permitted under Applicable Laws and Regulations.'
                                },
                                {
                                    text: 'We expressly disclaim liability arising from the unauthorised use of your Account. In the case that you suspect unauthorised use of your Account, you agree to notify us immediately.'
                                },
                                {
                                    text: 'You agree to waive any and all rights to hold us, the Issuer and any of our approved partners responsible for any mistake or omission caused by the use of the Application and for any delays beyond our reasonable control in processing transactions.'
                                },
                                {
                                    text: 'Please note that we only provide our Application for domestic and private use. You agree not to use our Application for any commercial or business purposes, and we have no liability to you for any loss of profit, loss of business, business interruption, or loss of business opportunity.'
                                },
                                {
                                    text: 'You agree to indemnify us:',
                                    points: [
                                        {
                                            text: 'for any erroneous financial transactions performed through the Card or the Application arising out of any inaccurate information provided by you as part of processing the relevant transaction;',
                                        },
                                        {
                                            text: 'against all claims, costs, damages, expenses (including legal fees) incurred by us arising out of and/or in connection with any breach by you of any of these Terms, including any use of the Application other than in accordance with these Terms; and'
                                        },
                                        {
                                            text: 'and the Issuer, against all losses, liabilities or damages which may occur as a result of unauthorised access by any individual or party in the event of your secure information becoming known to another individual or a third party.'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'How we may use your personal information',
                            points: [
                                {
                                    text: 'We will only use your personal information as set out in our https://kamelpay.com/privacy-policy/.'
                                }
                            ]
                        },
                        {
                            title: 'We are not responsible for viruses and you must not introduce them',
                            points: [
                                {
                                    text: 'While we use reasonable efforts to ensure that the Application is free from viruses and other malicious content, we do not guarantee that our Application will be secure or free from bugs or viruses nor do we assume responsibility for any damage to, or viruses that may infect, your computer equipment or other property on account of your access to the Application.'
                                },
                                {
                                    text: 'You are responsible for configuring your information technology, computer programmes and platform to access our Application and should use your own virus protection software. We will not be liable for any loss or damage in the event that your device is compromised.'
                                },
                                {
                                    text: 'You must not misuse our Application by knowingly introducing viruses, trojans, worms, logic bombs or other material that is malicious or technologically harmful. You must not attempt to gain unauthorised access to our Application, the server on which our Application is stored or any server, computer or database connected to our Application. You must not attack our Application via a denial-of-service attack or a distributed denial-of-service attack. We will report any breaches of this Paragraph to the relevant law enforcement authorities and we will co-operate with those authorities by disclosing your identity to them. In the event of such a breach, your right to use our Application will cease immediately.'
                                }
                            ]
                        },
                        {
                            title: 'We may make changes to our Application',
                            points: [
                                {
                                    text: 'We may update and change our Application from time to time to reflect changes to our services, your needs and our business priorities, without notice to you.'
                                }
                            ]
                        },
                        {
                            title: 'We may suspend or withdraw our Application',
                            points: [
                                {
                                    text: 'We do not guarantee that our Application, or any content on it, will always be available or uninterrupted. We may suspend, withdraw or restrict the availability of all or any part of our Application for business and operational reasons at any time. We will try to give you reasonable notice of any suspension or withdrawal of the Application.'
                                }
                            ]
                        }
                    ],
                };
            case "ADVANCED_SALARY_TERMS_AND_CONDITION":
                return {
                    title: t('GLOBAL.TERMS_AND_CONDITION'),
                    callback: () => {
                        // dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    logo: require('../../assets/images/ajman-bank-logo.png'),
                    renderView: () => {
                        return (
                            <View style={{borderWidth: 1, padding: 10}}>
                                <CText style={Styles.kfcTitle}>TERMS & CONDITIONS – KAMEL PAY CARDHOLDERS SALARY ADVANCE FACILITY </CText>
                                <CText style={[Styles.warning, {marginBottom: 10}]}>
                                    Product Description:
                                </CText>
                                <View>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom_10]}>
                                        Cardholder can avail Ajman Bank- Salary Advance which is temporary advance of up to maximum 50% of one month’s net salary and can be withdrawn from the card, or utilized to cover any of Cardholder’s monthly financial obligations. This facility can be availed every month, provided full payment for the amount received is made by the month-end or next salary credit date depending in the facility date, noting that this product has been approved by the Bank Sharia supervision committee.
                                    </CText>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <View style={Styles.dot}/>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Amount, shall be paid from the following Cardholder’s salary transferred to Kamel Pay Prepaid Card.
                                        </CText>
                                    </View>
                                </View>
                                <CText style={[Styles.warning, {marginBottom: 10}]}>
                                    Terms & Conditions:
                                </CText>
                                <View style={Styles.margin_left_10}>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>1.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Salary Advance transaction is carried out in compliance with Islamic Sharia rules and principles, and it is based on Qard Al Hasan.
                                        </CText>
                                    </View>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>2.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Ajman Bank is entitled, at its absolute discretion, to accept or reject Cardholder’s application based on Bank’s defined eligibility criteria.
                                        </CText>
                                    </View>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>3.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            If the facility application is approved, it will be, as per the below mentioned details:
                                        </CText>
                                    </View>
                                    <View style={Styles.margin_left_10}>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>A.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Maximum facility amount availed by the Cardholder under this service is AED 2,500.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>B.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Salary must be transferred to the Kamel Pay Prepaid Card regularly and from a known employer
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>C.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                If Cardholder avails the facility on or before the 15th of the month, the utilized amount will be settled from Cardholder’s salary or at the end of the month, whichever comes first. If the date of availing the facility is after the 15th of the month, the utilized amount will be settled from Cardholder’s salary or at the end of the following month, whichever comes first.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>D.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Cardholder must be regular in paying his other obligations with Ajman Bank (If any)
                                            </CText>
                                        </View>
                                    </View>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>4.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Other Terms & Conditions are to be considered after executing the transaction:
                                        </CText>
                                    </View>

                                    <View style={Styles.margin_left_10}>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Utilized amount has to be paid in the due date (As elaborated earlier in the Terms & Conditions), and if Cardholder fails to pay, Ajman Bank may claim the unpaid amount through the legal procedures.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                If the Cardholder fails to pay the Utilized amount in the due date, this may affect Cardholder credit rating, which may limit the Cardholder ability to another finance in the future from Ajman Bank or other banks
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                In the event of no balance on the due date in Cardholder’s salary account Ajman Bank has the right to deduct the due amount from any other credit account with the bank.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                As mentioned in the service description, salary is the main security required to obtain this service, so the Cardholder must transfer the salary of the month following receiving the product, and in case salary is not transferred or Cardholder have been terminated from his work or left or changed his work, Cardholder’s end-of-service benefits must be transferred to his prepaid card with Kamel Pay, noting that the Ajman Bank is entitled to block the EOSB and any other amounts available in the prepaid card in order to pay any overdue amount (s)
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                The Cardholder shall have the right to have a Cooling-Off period, of 5 complete business days commencing from the time of signing the contract for the Salary Advance, hence if the Cardholder opted to terminate the contract within the cooling off period, Ajman Bank has to refund to it any related Fees and direct costs already incurred by the Cardholder. However, if the Cardholder, within the cooling off period, disposed of/acted on the subject of the contract in any manner, its right in the cooling off period will cease. For more information, please review the relevant Form issued along with the Salary Advance approval.
                                            </CText>
                                        </View>
                                    </View>
                                    </View>
                                    <CText style={Styles.kfcParagraph}>I hereby declare that I have read and understood the above-mentioned facts, and undertake to comply and observe the same.</CText>
                                </View>
                        )
                    },
                    agreeButton: true
                };
            case "ADVANCED_SALARY_USER_KYC":
                return {
                    title: "KEY FACTS STATEMENT (KFS)",
                    callback: () => {
                        // dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    logo: require('../../assets/images/ajman-bank-logo.png'),
                    agreeButtonText: 'Confirm',
                    renderView: () => {
                        return (
                            <View>
                                <CText style={Styles.kfcTitle}>KEY FACTS STATEMENT (KFS) – KAMELPAY CARDHOLDERS SALARY ADVANCE FACILITY</CText>
                                <CText style={Styles.kfcParagraph}>
                                    WARNING: Read this document carefully and sign only if you clearly understand and agree to the content of the Key Facts Statement (KFS), which is available in English and Arabic. You may also use this document to compare different Islamic Covered Drawing facility offered by other Banks. You have the right to receive Key Facts Statement from other Banks for comparison.
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
                                                    Salary advance facility is based on the Islamic concept “Qard Al Hasan”, which refers to “Interest Free Loan”. Qard Al Hasan is a contract between two parties (the Bank and the Customer) to fulfill a short-term financial need of the borrower (Customer)
                                                </CText>
                                            </View>
                                        </View>
                                        <View style={Styles.tableSectionBodyItem}>
                                            <View style={Styles.tableSectionBodyItemLeft}>
                                                <CText style={Styles.kfcParagraph}>
                                                    Islamic Finance Structure
                                                </CText>
                                            </View>
                                            <View style={Styles.tableSectionBodyItemRight}>
                                                <CText style={Styles.kfcParagraph}>
                                                    Qard Al Hasan
                                                </CText>
                                            </View>
                                        </View>
                                        <View style={Styles.tableSectionBodyItem}>
                                            <View style={Styles.tableSectionBodyItemLeft}>
                                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                                    Types of securities against which Salary Advance is granted
                                                </CText>
                                            </View>
                                            <View style={Styles.tableSectionBodyItemRight}>
                                                <CText style={Styles.kfcParagraph}>
                                                    Salary Transfer
                                                </CText>
                                            </View>
                                        </View>
                                        <View style={Styles.tableSectionBodyItem}>
                                            <View style={Styles.tableSectionBodyItemLeft}>
                                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                                    Pricing
                                                </CText>
                                            </View>
                                            <View style={Styles.tableSectionBodyItemRight}>
                                                <CText style={Styles.kfcParagraph}>
                                                    Not Applicable
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
                                                    Kamel pay card holder will get 50% of the salary amount as a Qard Al Hasan, i.e. the amount is calculated after deducting all Cardholder self-declared obligations.
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
                                                To view all our Fees and charges, you may visit our website www.ajmanbank.ae, call 800 22, or visit any of our branches to receive a copy.
                                            </CText>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none, Styles.border_bottom]}>
                                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                                    Profit Rate
                                                </CText>
                                            </View>
                                            <View style={Styles.tableSectionBodyItemRight}>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                        Not Applicable.
                                                    </CText>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                                <CText style={[Styles.kfcParagraph, Styles.boldText]}>
                                                    Fees
                                                </CText>
                                            </View>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                            <View style={[Styles.tableSectionBodyItemLeft, Styles.border_right_none]}>
                                                <CText style={Styles.kfcParagraph}>
                                                    Processing Fees
                                                </CText>
                                            </View>
                                            <View style={Styles.tableSectionBodyItemRight}>
                                                <View style={Styles.feeTable}>
                                                    <View style={[Styles.feeTableContainer]}>
                                                        <View style={Styles.feeTableHeaderContainer}>
                                                            <View style={[Styles.feeTableHeader, Styles.border_bottom, Styles.border_right]}>
                                                                <CText style={Styles.feeTableHeaderText}>
                                                                    Salary Advance Amount
                                                                </CText>
                                                            </View>
                                                            <View style={[Styles.feeTableHeader, Styles.border_bottom]}>
                                                                <CText style={Styles.feeTableHeaderText}>
                                                                    Administration Fees (Exclusive VAT)
                                                                </CText>
                                                            </View>
                                                        </View>
                                                        <View style={[{flex: 1, flexDirection: 'row'}]}>
                                                            <View style={[Styles.feeTableBody, {flex: 1}, Styles.border_right]}>
                                                                <MappedElement
                                                                    data={reduxState?.advanceSalaryDetails?.feesBrackets}
                                                                    renderElement={(obj, i) => {
                                                                        return (
                                                                            <CText key={i} style={Styles.feeTableBodyText}>
                                                                                {formatAmount(obj?.fromAmount, 'AED')} - {formatAmount(obj?.toAmount, 'AED')}
                                                                            </CText>
                                                                        )
                                                                    }}
                                                                />
                                                            </View>
                                                            <View style={[Styles.feeTableBody, {flex: 1}]}>
                                                                <MappedElement
                                                                    data={reduxState?.advanceSalaryDetails?.feesBrackets}
                                                                    renderElement={(obj, i) => {
                                                                        return (
                                                                            <CText key={i} style={Styles.feeTableBodyText}>
                                                                                {formatAmount(obj?.fees - obj?.vatAmount, 'AED')}
                                                                            </CText>
                                                                        )
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
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
                                                        All Fees mentioned above and on www.ajmanbank.ae are exclusive of Value Added Tax (VAT). A VAT of 5% shall be applicable on all Fees levied by the Bank.
                                                    </CText>
                                                </View>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                                        Ajman Bank reserves the right to revise the fees & charges and terms & conditions, including the profit calculation methodology at any time by providing sixty (60) days prior written notice to your registered contact details.
                                                    </CText>
                                                </View>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                                        If the case is delayed by the Bank, Customers retain the option to cancel the contract without cost or penalty before the funds are made available.
                                                    </CText>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={[Styles.kfcParagraph]}>
                                                <CText style={[Styles.warning]}>WARNING: </CText>
                                                If you have further clarifications or in case you are not accepting the new/modified changes, please reach the nearest branch within the specified period or call us on 800 22; otherwise, you will be liable for the changes once implemented.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <CText style={Styles.kfcParagraph}>
                                    {'\n'}
                                    Ajman Bank hereby declares that it has been licensed and authorized by the Central Bank of the UAE to carry out banking business and services. All our products and services are Shari’ah complaint and approved by our Internal Shari’ah Supervision Committee. For details on approval, kindly visit www.ajmanbank.ae.
                                    {'\n'}
                                </CText>
                                <View style={Styles.tableSection}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>YOU MUST KNOW</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                Prior to applying for Salary Advance, you should take into account any foreseeable future changes to your financial circumstances (such as retirement occurring before the end of the finance term). You should only avail the facility, if you have financial means to cope up with potential risk that may arise from changes in the economic and market conditions as well as changes in your circumstances. You may consult your independent financial advisor for advice.
                                            </CText>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                <CText style={Styles.kfcParagraphTitle}>COOLING-OFF PERIOD : </CText>
                                                Khiyar Al-Shart ‘Cooling-off Period’ is defined as a period of time after a contract is agreed during which the buyer can cancel the contract without incurring a penalty. Customers may waive the cooling-off period of complete 5 business days by signing a written waiver provided by Ajman Bank.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>APPLICATION AND APPROVAL PROCESS</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column]}>
                                            <View style={Styles.tableSectionBodyItemRight}>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                                        Kamelpay Cardholders shall request for Ajman Bank- Salary Advance which will be obtained through Kamel Pay Mobile Application only.
                                                    </CText>
                                                </View>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                                        Card holder will get 50% of the amount as a Qard Hassan, i.e. the amount is calculated after deducting all Cardholder’s self-declared obligations.
                                                    </CText>
                                                </View>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                                        Once transaction is approved, amount is provided in the Cardholder's prepaid card, so the Cardholder can withdraw the amount through ATM/POS/Remittance/ Bill payment/Any Service of Kamel Pay or Ajman Bank to use it to cover any of the Cardholder's monthly financial obligations.
                                                    </CText>
                                                </View>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                                        An administration fee shall be charged upon availing such service, and the fee is deducted from the salary prepaid card.
                                                    </CText>
                                                </View>
                                                <View style={Styles.row}>
                                                    <View style={Styles.dot}/>
                                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom, Styles.flex_1]}>
                                                        Salary Advance amount, shall be paid from the following Cardholder’s salary transferred to Kamel Pay Prepaid Card.
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
                                                    Negative rating in the Al Etihad Credit Bureau (AECB) or other Credit Information agency and the possible limitations on the ability to borrow/obtain financing in the future
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
                                                For complaints and suggestions, you may visit any of our Branches and submit in writing or verbally to our customer service officer. You can also call our Phone Banking on 800 22 and we will be happy to assist. Alternatively, you may also use our website www.ajmanbank.ae or Email address <CText style={Styles.blue}>info@ajmanbank.ae</CText>
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

                                                    </View>
                                                    <CText style={Styles.checkBoxText}>Email</CText>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                <CText style={Styles.boldText}>Note:</CText> If you wish to “Opt in”/”Opt out” of receiving marketing and promotional communications, you may call us anytime at 800 22.
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
                                                    {getFullName(reduxState.user)}
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
                                                    {reduxState?.user?.emirateID}
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
                                                    {reduxState?.user?.expiryDate ? moment(reduxState?.user?.expiryDate).format('DD/MM/YYYY') : null}
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
                                                    {getPhone(reduxState.user)}
                                                </CText>
                                            </View>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem]}>
                                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                                    Card Number
                                                </CText>
                                            </View>
                                            <View style={Styles.infoViewItem}>
                                                <CText style={Styles.infoViewItemText}>
                                                    {reduxState?.card?.cardNumber}
                                                </CText>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    },
                    agreeButton: true
                };
            case "BNPL_USER_KYC":
                return {
                    title: "Terms and Conditions",
                    callback: () => {
                        // dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    // logo: require('../../assets/images/ajman-bank-logo.png'),
                    agreeButtonText: 'Confirm',
                    renderView: () => {
                        return (
                            <View>
                                {/*<CText style={Styles.kfcTitle}>KEY FACTS STATEMENT (KFS) – KAMELPAY CARDHOLDERS SALARY ADVANCE FACILITY</CText>*/}
                                <CText style={Styles.kfcParagraph}>
                                    These Terms and Conditions constitute a legally binding agreement between you
                                    (either personally or on behalf of an entity you represent) and HAQ Kamel Pay Services
                                    ("Kamel Pay"), hereinafter referred to as "We,"or “Kamel Pay” with respect to all
                                    aspects of the Kamel Pay Services and/or your use of the Mobile App or your access
                                    to our website or mobile application related to, or linked to and through your
                                    access to and use of the Mobile App or Website. You acknowledge that you have read,
                                    understood, and agreed to be bound by these Terms and Conditions. We reserve the
                                    right, at our absolute discretion, to make changes or modifications to these Terms
                                    and Conditions at any time and for any reason.
                                    {'\n'}
                                </CText>
                                <View style={[Styles.tableSection]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Kamel Pay Services “Buy-Now-Pay-Later”</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                If you have Kamel Pay Mobile Account with us and we have approved you, you will be able to use our BNPL service to buy goods or services and make payments through Kamel Pay App with an instalment payment to be made on or before the due date communicated.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Eligibility and Validity :</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                By clicking to agree to these Terms and Conditions, you acknowledge that you have accepted these Terms and Conditions electronically.
                                                {'\n'}
                                                You hereby agree that you are the true beneficiary of the HAQ Kamel Pay Services and that you do not use Kamel Pay's Services for any money laundering or other illegal activities.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Refund of Payments:</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                Kamel Pay will remain responsible for processing the payment of any Refund as established between you and the Merchant or Merchant Platform.
                                                {'\n'}
                                                Kamel Pay shall not be liable for any Merchant or Merchant Platform’s decision regarding Refunds, as applicable between you and the Merchant or the Merchant Platform. Kamel Pay may elect, however, to play a role in facilitating such Refunds at its sole discretion, provided that such role does not imply any liability in connection with any Refund.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Confidentiality and Privacy:</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                Kamel Pay is committed to maintaining the confidentiality of credit information and data in its possession and user is hereby agree to maintain the confidentiality.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Limitation of Liability:</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                Kamel Pay is an independent service provider and is not a party to any direct arrangements between Customers and Merchants or other related third parties. Kamel Pay shall not in any way be liable for any claim or dispute attributable to Merchants and shall not be liable for any failure related to or damages caused by the Merchants' products or services' mark, reliability, adequacy, originality, availability, or legality.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>General</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                The rights and obligations of the parties stipulated in these Terms and Conditions shall be governed by and interpreted in accordance with the provisions of the laws of The United Arab Emirates.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Complaints</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                We are committed to providing an excellent standard of service to our customers. We value feedback from customers greatly because it helps us to continually improve our service. If you do not feel that you are receiving excellent customer service or that something could be improved, please do contact us at our helpline; (+971) 4 562 3700 or email us at info@kamelpay.com.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Errors</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                20.1. Where we become aware of any error or malfunction to your Kamel Pay Account, we will:
                                                {'\n'}
                                                (i) promptly return any collected amounts arising as a result of such error, as applicable;
                                                {'\n'}
                                                (ii) process and correct such errors for any affected customers within sixty (60) business days starting from the date of determining the error; and
                                                {'\n'}
                                                (iii) inform you of such error and that corrective measures have been taken.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <View style={[Styles.tableSection, Styles.border_top_none]}>
                                    <View style={Styles.tableSectionHeader}>
                                        <CText style={Styles.tableSectionHeaderText}>Entire Agreement:</CText>
                                    </View>
                                    <View style={Styles.tableSectionBody}>
                                        <View style={[Styles.tableSectionBodyItem, Styles.column, Styles.space]}>
                                            <CText style={Styles.kfcParagraph}>
                                                21.1 These Terms and Conditions, together with the Privacy Policy and any other terms agreed between you and Kamel Pay from time to time, represent the entire agreement between you and Kamel Pay.
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
                                                    {getFullName(reduxState.user)}
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
                                                    {reduxState?.user?.emirateID}
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
                                                    {reduxState?.user?.expiryDate ? moment(reduxState?.user?.expiryDate).format('DD/MM/YYYY') : null}
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
                                                    {getPhone(reduxState.user)}
                                                </CText>
                                            </View>
                                        </View>
                                        <View style={[Styles.tableSectionBodyItem]}>
                                            <View style={[Styles.infoViewItem, Styles.border_right]}>
                                                <CText style={[Styles.infoViewItemText, Styles.boldText]}>
                                                    Card Number
                                                </CText>
                                            </View>
                                            <View style={Styles.infoViewItem}>
                                                <CText style={Styles.infoViewItemText}>
                                                    {reduxState?.card?.cardNumber}
                                                </CText>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    },
                    agreeButton: true
                };
            case "PERSONAL_LOAN_USER_KYC":
                return {
                    title: "KEY FACTS STATEMENT (KFS)",
                    callback: () => {
                        // dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    logo: require('../../assets/images/ajman-bank-logo.png'),
                    agreeButtonText: 'Confirm',
                    renderView: () => {
                        return <PersonalFinanceKFS
                            card={reduxState?.card}
                            user={reduxState?.user}
                            personalLoanDetails={reduxState?.personalLoanEligibility}

                        />
                    },
                    agreeButton: true
                };
            case "PERSONAL_LOAN_APPLICATION":
                return {
                    title: "Application Form",
                    callback: () => {
                        // dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    logo: require('../../assets/images/ajman-bank-logo.png'),
                    agreeButtonText: 'Confirm',
                    renderView: () => {
                        return <PersonalFinanceApplication
                            card={reduxState?.card}
                            user={reduxState?.user}
                            data={data}
                            personalLoanDetails={reduxState?.personalLoanEligibility}

                        />
                    },
                    agreeButton: true
                };
            case "PERSONAL_LOAN_TERMS_AND_CONDITION":
                return {
                    title: t('GLOBAL.TERMS_AND_CONDITION'),
                    callback: () => {
                        // dispatch(viewTermsAndConditions({ isOpen: false }));
                    },
                    logo: require('../../assets/images/ajman-bank-logo.png'),
                    renderView: () => {
                        return (
                            <View style={{borderWidth: 1, padding: 10}}>
                                <CText style={Styles.kfcTitle}>TERMS & CONDITIONS – KAMEL PAY CARDHOLDERS PERSONAL FINANCE FACILITY</CText>
                                <CText style={[Styles.warning, {marginBottom: 10}]}>
                                    Product Description:
                                </CText>
                                <View>
                                    <CText style={[Styles.kfcParagraph, Styles.margin_bottom_10]}>
                                        Cardholder can avail Ajman Bank- Personal Finance which is temporary advance of up to maximum 2 times of his/her net salary for a tenure of 1-6 months and can be withdrawn from the card or utilized to cover any of Cardholder’s monthly financial obligations. This facility can be availed every month, provided full payment for the amount received is made by the month-end or next salary credit date depending in the facility date, noting that this product has been approved by the Bank Sharia supervision committee.
                                    </CText>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <View style={Styles.dot}/>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Amount, shall be paid from the following Cardholder’s salary transferred to Kamel Pay Prepaid Card.
                                        </CText>
                                    </View>
                                </View>
                                <CText style={[Styles.warning, {marginBottom: 10}]}>
                                    Terms & Conditions:
                                </CText>
                                <View style={Styles.margin_left_10}>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>1.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Personal Finance transaction is carried out in compliance with Islamic Sharia rules and principles, and it is based on principles of Murabaha.
                                        </CText>
                                    </View>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>2.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Ajman Bank is entitled, at its absolute discretion, to accept or reject Cardholder’s application based on Bank’s defined eligibility criteria.
                                        </CText>
                                    </View>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>3.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            If the facility application is approved, it will be, as per the below mentioned details:
                                        </CText>
                                    </View>
                                    <View style={Styles.margin_left_10}>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>A.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Maximum facility amount availed by the Cardholder under this service is AED 5,000
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>B.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Salary must be transferred to the Kamel Pay Prepaid Card regularly.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>C.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                If Cardholder avails the facility on or before the 15th of the month, the instalment amount will be settled from Cardholder’s salary or at the end of the month, whichever comes first. If the date of availing the facility is after the 15th of the month, the instalment amount will be settled from Cardholder’s salary or at the end of the following month, whichever comes first.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>D.</CText>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Cardholder must be regular in paying his other obligations with Ajman Bank (If any)
                                            </CText>
                                        </View>
                                    </View>
                                    <View style={[Styles.row, Styles.margin_bottom_10]}>
                                        <CText style={[Styles.kfcParagraph, Styles.tacListItemCount]}>4.</CText>
                                        <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                            Other Terms & Conditions are to be considered after executing the transaction:
                                        </CText>
                                    </View>

                                    <View style={Styles.margin_left_10}>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                Utilized amount has to be paid in the due date (As elaborated earlier in the Terms & Conditions), and if Cardholder fails to pay, Ajman Bank may claim the unpaid amount through the legal procedures.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                If the Cardholder fails to pay the Utilized amount in the due date, this may affect Cardholder credit rating, which may limit the Cardholder ability to another finance in the future from Ajman Bank or other banks.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                In the event of no balance on the due date in Cardholder’s salary account Ajman Bank has the right to deduct the due amount from any other credit account with the bank.
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                As mentioned in the service description, salary is the main security required to obtain this service, so the Cardholder must transfer the salary of the month following receiving the product, and in case salary is not transferred or Cardholder have been terminated from his work or left or changed his work, Cardholder’s end-of-service benefits must be transferred to his prepaid card with Kamel Pay, noting that the Ajman Bank is entitled to block the EOSB and any other amounts available in the prepaid card in order to pay any overdue amount (s)
                                            </CText>
                                        </View>
                                        <View style={[Styles.row, Styles.margin_bottom_10]}>
                                            <View style={Styles.dot}/>
                                            <CText style={[Styles.kfcParagraph, Styles.flex_1]}>
                                                The Cardholder shall have the right to have a Cooling-Off period, of 5 complete business days commencing from the time of signing the contract for the Personal Finance, hence if the Cardholder opted to terminate the contract within the cooling off period, Ajman Bank has to refund to it any related Fees and direct costs already incurred by the Cardholder. However, if the Cardholder, within the cooling off period, disposed of/acted on the subject of the contract in any manner, its right in the cooling off period will cease. For more information, please review the relevant Form issued along with the Personal Finance approval.
                                            </CText>
                                        </View>
                                    </View>
                                </View>
                                <CText style={Styles.kfcParagraph}>I hereby declare that I have read and understood the above-mentioned facts and undertake to comply and observe the same.</CText>
                            </View>
                        )
                    },
                    agreeButton: true
                };
            default: return {
                title: '',
                callback: () => {}
            }
        }
    };

    const onClose = () => {
        close ? close () : getData().callback();
    };

    const renderQuestionsAndAnswerElement = (item, index) => {
        return (
            <View style={Styles.questionsAndAnswerListItem} key={index}>
                <CText style={Styles.questionsAndAnswerListItemTitle}>
                    {index+1}. {item.question}
                </CText>
                <CText style={Styles.questionsAndAnswerListItemSubTitle}>
                    {item.answer}
                </CText>
            </View>
        )
    };

    const renderSectionElement = (item, index) => {
        return (
            <View style={Styles.sectionListItem} key={index}>
                <CText style={Styles.sectionListItemTitle}>
                    {item.title}
                </CText>
                {item?.points ? <View>
                    <MappedElement
                        data={item?.points}
                        renderElement={(point, childIndex) => {
                            const bullets = point?.showBullets === undefined;
                            return (
                                <View key={childIndex}>
                                    <CText style={[Styles.sectionListItemSubTitle, point?.bold ? Styles.boldText: null]}>
                                        {bullets ? `${childIndex+1}. ` : ''}{point?.text}
                                    </CText>
                                    {point?.points ? <MappedElement
                                        data={point?.points}
                                        renderElement={(childPoint, subChildIndex) => {
                                            const childBullets = childPoint?.showBullets === undefined;
                                            return  (
                                                <View key={subChildIndex}>
                                                    <CText style={[Styles.sectionListItemChildTitle,
                                                        childPoint?.dark ? Styles.darkText : null,
                                                        childPoint?.bold ? Styles.boldText : null,
                                                    ]}>
                                                        {childBullets ? `${subChildIndex+1}. ` : ''}{childPoint?.text}
                                                    </CText>
                                                    {childPoint?.points ? <MappedElement
                                                        data={childPoint?.points}
                                                        renderElement={(childInnerPoint, subInnerChildIndex) => {
                                                            const childInnerBullets = childInnerPoint?.showBullets === undefined;
                                                            return  (
                                                                <View key={subInnerChildIndex}>
                                                                    <CText style={[Styles.sectionListItemChildTitle, childInnerPoint?.dark ? Styles.darkText : null]}>
                                                                        {childInnerBullets ? `${subInnerChildIndex+1}. ` : ''}{childInnerPoint?.text}
                                                                    </CText>
                                                                    {childInnerPoint?.imageUrl ? <ProgressiveImage
                                                                        style={{minWidth: 70, minHeight: 70, marginTop: 10, marginHorizontal: 15}}
                                                                        resizeMode={'contain'}
                                                                        source={childInnerPoint?.imageUrl}
                                                                    /> : null}
                                                                </View>
                                                            )
                                                        }}
                                                    />: null}
                                                </View>
                                            )
                                        }}
                                    />: null}
                                </View>
                            )
                        }}
                    />
                </View> : null}
            </View>
        )
    };

    const headerProps = {
        headerTitle: getData().title,
        headerRight: true,
        backOnPress:() => close ? close (): onClose()
    };

    const submit = () => {
        close ? close('SUBMIT') : null
    };

    const handleScroll = (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height;

        // Adjust the threshold based on your preference
        const threshold = 20;

        updateDisableButton(distanceFromBottom < threshold);
    };

    return (
        <CModal
            isOpen={isOpen || reduxState?.termAndConditions?.isOpen}
            headerProps={headerProps}
            close={() => close ? close() : onClose()}>
            <ScrollView contentContainerStyle={Styles.scrollContainer} onScroll={handleScroll}>

                {getData()?.logo ?
                    <ProgressiveImage
                        style={{minWidth: 100, height: 50, marginBottom: 25}}
                        resizeMode={'contain'}
                        source={getData()?.logo}
                    />
                    : null}

                {getData()?.section?.length ? <View style={Styles.sectionList}>
                    <MappedElement
                        data={getData()?.section}
                        renderElement={renderSectionElement}
                    />
                </View> : null}

                {getData()?.questionsAndAnswer?.length ? <View style={Styles.questionsAndAnswerList}>
                    <MappedElement
                        data={getData()?.questionsAndAnswer}
                        renderElement={renderQuestionsAndAnswerElement}
                    />
                </View> : null}

                {getData()?.renderView ? getData()?.renderView() : null}

            </ScrollView>

            {getData()?.agreeButton ? <View style={[GlobalStyle.bottomButtonContainer, {}]}>
                <CButton title={getData()?.agreeButtonText || t('GLOBAL.AGREE_TEXT')}
                         onPress={() => submit()}
                         disabled={!disableButton}
                         buttonStyle={GlobalStyle.bottomButton}
                />
            </View> : null}
        </CModal>
    )
}

export default React.memo(TermsAndConditions)
