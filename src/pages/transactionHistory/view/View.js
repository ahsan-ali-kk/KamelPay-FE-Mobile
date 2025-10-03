import React, {useEffect, useRef} from "react";
import {View, Platform} from "react-native";
import {Container, ImagePicker} from "../../../containers";
import {IconButton, ProgressiveImage, CText, CButton} from "../../../uiComponents";
import {useTranslation} from "react-i18next";
import Styles from "../TransactionHistory.style";
import {FormatNumberWithCommas} from "../../../utils/methods";
import KamlepayIcon from "../../../assets/icons/KamelPayIcon";
import {renderTime} from "../TransactionHistory";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useDispatch, useSelector} from "react-redux";
import {getSingleTransaction, uploadReceipt} from "../../../store/actions/TransactionHistory.action";
import Note from "./AddNote";


function TransactionView(props) {

    const { t } = useTranslation();
    const ImagePickerRef = useRef();
    const NoteRef = useRef();
    const dispatch = useDispatch();
    const { route: {params: data} } = props;

    const reduxState = useSelector(({transactionHistory, global}) => {
        return {
            loading: transactionHistory.uploadReceiptLoading || transactionHistory.getSingleTransactionLoading,
            transaction: transactionHistory.transaction,
            card: global.selectedCard
        }
    });

    useEffect(() => {
        if(data?._id){
            get();
        }
    },[data]);

    const headerProps = {
        headerTitle: t('GLOBAL.TRANSACTION'),
        headerRight: true,
    };

    const get = () => {
        let payload = {
            cardId: reduxState?.card?._id,
            id: data?._id
        };
        dispatch(getSingleTransaction(payload))
    };

    const uploadReceiptCallBack = () => {
        get();
    };

    const upload = (res) => {
        const formData = new FormData();
        formData.append("slip", {
            name: res?.fileName,
            type: res?.type,
            uri: Platform.OS === "android" ? res?.uri : res?.uri.replace("file://", "")
        });
        formData.append("id", data?._id);
        dispatch(uploadReceipt(formData, uploadReceiptCallBack))
    };

    console.log('data', data);

    return (
        <Container headerProps={headerProps}
                   scrollView={true}
                   loading={reduxState?.loading}
                   scrollViewProps={{
                       contentContainerStyle: {
                           flexGrow: 1
                       }
                   }}
        >
            <View style={Styles.viewContainer}>

                <View style={Styles.viewInnerContainer}>

                    <View style={Styles.viewHeader}>
                        <IconButton
                            type="icon-with-background"
                            buttonStyle={Styles.viewHeaderIcon}
                            iconName={'transactions'}
                        />
                       <View style={Styles.viewHeaderContent}>
                           <CText style={Styles.viewHeaderText}>{reduxState?.transaction?.description}</CText>
                           <CText style={Styles.viewHeaderSubText}>
                               {reduxState?.transaction?.time ? renderTime(reduxState?.transaction?.time) : ''}
                           </CText>
                       </View>
                    </View>

                    <View style={[Styles.section, {justifyContent: 'center'}]}>
                        <CText style={Styles.sectionHeading}>{t('GLOBAL.AMOUNT')}</CText>
                        <View style={Styles.viewAmount}>
                            <KamlepayIcon style={[
                                Styles.listItemAmountIcon,
                                Styles.viewAmountIcon,
                                data?.mode === 'DEBIT' && Styles.redIcon]}
                                          name={data?.mode === 'DEBIT' ? 'caret-up' : 'caret-down'}/>
                            <FormatNumberWithCommas
                                value={reduxState?.transaction?.amount}
                                styleAmount={Styles.viewAmountText}
                                numberOfLines={1}
                            />
                        </View>
                    </View>

                    <View style={[Styles.section, {justifyContent: 'center'}]}>
                        <CText style={Styles.sectionHeading}>{t('GLOBAL.REMAINING_BALANCE')}</CText>
                        <View style={Styles.viewAmount}>
                            <FormatNumberWithCommas
                                value={reduxState?.transaction?.availableBalance || 0}
                                styleAmount={[Styles.viewAmountText, Styles.remainingBalanceItemAmount, Styles.viewSmallAmountText]}
                                numberOfLines={1}
                            />
                        </View>
                    </View>

                    {reduxState?.transaction?.note?.length ? <View style={Styles.section}>
                        <CText style={Styles.sectionHeading}>{t('GLOBAL.NOTE')}</CText>
                        <CText style={Styles.sectionText}>{reduxState?.transaction?.note}</CText>
                    </View> : null}

                    <View style={Styles.receiptSection}>
                        <ProgressiveImage
                            style={Styles.receiptSectionImage}
                            source={{uri: reduxState?.transaction?.depositSlip}}
                            resizeMode={'contain'}
                        />
                    </View>

                </View>

                <View style={GlobalStyle.twoInputsView}>
                    <CButton
                        type={'outline'}
                        buttonStyle={GlobalStyle.twoInputsViewContainer}
                        onPress={() => NoteRef.current.toggleModal()}
                        title={`${reduxState?.transaction?.note ? t('GLOBAL.UPDATE') : t('GLOBAL.ADD')} Note`}
                    />
                    <CButton
                        loading={reduxState?.loading}
                        buttonStyle={GlobalStyle.twoInputsViewContainer}
                        onPress={() => ImagePickerRef.current.toggleModal()}
                        title={`${reduxState?.transaction?.depositSlip ? t('GLOBAL.UPDATE') : t('GLOBAL.ADD')} Receipt`}
                    />
                </View>

            </View>
            <Note
                ref={NoteRef}
                transactionId={data?._id}
                note={reduxState?.transaction?.note}
            />
            <ImagePicker ref={ImagePickerRef} onChange={(res) => upload(res[0])}/>
        </Container>
    )
}

export default TransactionView;
