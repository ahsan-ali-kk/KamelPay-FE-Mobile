import React, {useEffect, useState, useCallback} from "react";
import {TouchableOpacity, View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CountriesModal, Container} from "../../containers";
import {CButton, CInput, CList, CListItem, CModal, CText} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {convertToSlug, SERVICES} from "../../utils/methods";
import {checkAmountBiller, getPayBillBeneficiary} from "../../store/actions/PayBill.action";
import {editBeneficiary, deleteBeneficiary, updatedSelectedCurrentPromotion} from "../../store/actions/Global.action";
import Popup from "../../uiComponents/popup/Popup";
import {iconBaseUrl} from "../../utils/intercepter";
import { debounce } from 'lodash-es';
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";
import EditBeneficiary from "./EditBeneficiary";
import {useNavigation, useFocusEffect} from "@react-navigation/native";

function PayBill(props) {
    const { t, i18n } = useTranslation();

    const { route: {params: paramsData}} = props;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reduxState = useSelector(({auth, global, payBill}) => {
        return {
            user: auth.user,
            processPaymentLoading: payBill.processPaymentLoading,
            loading: payBill.getPayBillBeneficiaryLoading || payBill.billerCheckAmountLoading || global.deleteBeneficiaryLoading,
            data: payBill.payBillBeneficiary,
            isLoadMore: payBill.payBillBeneficiaryIsLoadMore,
            isLoadMoreLoading: payBill.payBillBeneficiaryIsLoadMoreLoading,
            metaData: payBill.payBillBeneficiaryMetaData,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
            editLoading: global.editBeneficiaryLoading,
            countries: global.countries,
            selectedCurrentPromotion: global.selectedCurrentPromotion,
            topupAndBillpaymentCurrentVendor: global.topupAndBillpaymentCurrentVendor,
        }
    });

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [searchText, updateSearchText] = useState('');
    const [editBeneficiaryModal, updateEditBeneficiaryModal] = useState(false);
    const [selectedBeneficiary, updateSelectedBeneficiary] = useState({});
    const [data, updateData] = useState({});
    const [countryModalIsOpen, updateCountryModalIsOpen] = useState(false);
    const [selectedCountry, updateSelectedCountry] = useState({});

    const get = (val = 1, text = searchText) => {
        let payload = {
            page: val,
            limit: limit,
            ...(text && { search: text }),
            transactionTypes: ["BILL_PAYMENT"],
            vendor: reduxState?.topupAndBillpaymentCurrentVendor?.id
        };
        dispatch(getPayBillBeneficiary(payload));
    };

    useFocusEffect(
        React.useCallback(() => {
            let data = reduxState?.selectedCurrentPromotion;
            if(data) {
                setTimeout(() => {
                    findCountryAndGo(data);
                })

            }
        }, [reduxState?.selectedCurrentPromotion])
    );

    const findCountryAndGo = (obj) => {
        if(obj?.cca3) {
            dispatch(updatedSelectedCurrentPromotion({}));
            navigation.navigate('pay_bill_biller_types', {
                cca3: obj?.cca3,
                billerType: obj?.billerType,
                whereToCome: 'PROMOTION',
                ...(paramsData?.moduleType && {moduleType: paramsData?.moduleType})
            });
        }
    };

    useEffect(() => {
        get(page);
    }, [page]);

    useEffect(() => {
        if(Object.keys(data).length) {
            goPay();
        }
    }, [data]);

    const onRefreshHandler = () => {
        setPage(1);
        get(1)
    };
    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const creatDescription = (item) => {
        return item?.biller?.BillerName + ' - ' + item?.biller?.BillerType
    };

    const onDelete = (item) => {
        let payload = {
            id: item?._id
        };
        dispatch(deleteBeneficiary(payload, () => onRefreshHandler()))
    };

    const toggleOnEdit = (data = {}, value = false) => {
        updateSelectedBeneficiary(data);
        updateEditBeneficiaryModal(value)
    };

    const onEdit = (selected, values) => {
        let payload = {
            id: selected?._id,
            Alias: values?.Alias
        };
        dispatch(editBeneficiary(payload, () => {
            toggleOnEdit();
            onRefreshHandler()
        }))
    };

    const renderActionButtons = (item) => {
        return (
            <View style={GlobalStyle.listItemActions}>
                <TouchableOpacity style={[GlobalStyle.listItemActionButton]} onPress={() => onDelete(item)}>
                    <KamelpayIcon name="delete" style={[GlobalStyle.listItemActionButtonIcon]}/>
                </TouchableOpacity>
                <TouchableOpacity style={[GlobalStyle.listItemActionButton]} onPress={() => toggleOnEdit(item, true)}>
                    <KamelpayIcon name="edit" style={[GlobalStyle.listItemActionButtonIcon]}/>
                </TouchableOpacity>
            </View>
        )
    };

    const renderItem = ({item}) => {
        let iconUrl = `${iconBaseUrl}/${item?.biller?.CountryCode}/${convertToSlug(item?.biller?.BillerName)}.png`;
        return( <CListItem source={{uri: iconUrl}}
                           iconRadius={0}
                           defaultSource={require('../../assets/images/others.png')}
                           title={item?.beneficiaryAlias}
                           description={creatDescription(item)}
                           onPress={() => onPayment(item, iconUrl)}
                           renderActionButtons={() => renderActionButtons(item)}
        />)
    };

    const toggleCountryModal = () => {
        updateCountryModalIsOpen(!countryModalIsOpen);
        // navigation.navigate('pay_bill_biller_types', reduxState.currentCountry);
    };

    const countryOnSelect = (item) => {
        updateSelectedCountry(item);
        navigation.navigate('pay_bill_biller_types', {
            ...item,
            ...(paramsData?.moduleType && {moduleType: paramsData?.moduleType})
        });
        toggleCountryModal();
    };

    const updateIos = (IOs, valueIos) => {
        return IOs.map((obj) => {
            let found = valueIos ? valueIos.find(o => Number(o.id) === obj.IOID) : '';
            return {
                ...obj,
                value: found?.value
            }
        })
    };

    const onPayment = (item) => {
        let da = {
            biller: item?.biller,
            billerType: item?.biller?.BillerType,
            sku: item?.sku,
            io: updateIos(item?.IOs, item?.usersInputs),
            Alias: item?.beneficiaryAlias,
            beneficiaryId: item?._id,
            pageType: 'beneficiary'
        };
        if(item?.biller && item?.sku && item?.IOs && item?.usersInputs){
            updateData(da);
        }
    };

    const goPay = () => {
        const {biller, sku, io} = data;

        let inputs = io.map(o => ({IOID: o.IOID, value: o.value}));

        let payload = {
            BillerID: biller?.BillerID,
            SKU: sku?.SKU,
            Inputs: inputs,
            CardId: reduxState.card._id,
            ...(data?.beneficiaryId && {beneficiaryId: data?.beneficiaryId})
        };

        if (sku?.InquiryAvailable === 1) {
            // Partial, Excess, DueDate
            dispatch(checkAmountBiller({
                ...payload,
                type: 'SOME_CONDITIONS'
            }, checkAmountCallBack))
        } else {
            if (Number(sku?.Amount) === 0) {
                // Min Amount, Max Amount
                navigate({type: 'CUSTOM_AMOUNT'}, payload)
            } else {
                //just pay
                navigate({type: 'DIRECT_PAY'}, payload)
            }
        }
    };

    const checkBillDueDate = (res) => {
        let billDueDate = new Date(res?.BillDueDate).setHours(23, 59, 59);
        return data?.sku?.InquiryAvailable === 1 && data?.sku?.PastDuePaymentAllowed === 0 && (billDueDate <= new Date())
    };

    const checkAmountCallBack = (res, payload, errorCall = false) => {
        if (errorCall) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: t('POPUPS.INVALID_REFERENCE.TITLE'),
                text: t('POPUPS.INVALID_REFERENCE.SUB_TITLE'),
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () => Popup.hide()
                    },
                    {
                        text: t('GLOBAL.CONTACT_US'),
                        callback: () => Popup.hide()
                    }
                ]
            })
        } else {
            if (checkBillDueDate(res)) {
                Popup.show({
                    isVisible: true,
                    type: 'Error',
                    title: t('POPUPS.BILL_PAST.TITLE'),
                    text: t('POPUPS.BILL_PAST.SUB_TITLE'),
                })
            } else {
                navigate(res, payload)
            }
        }
    };
    const navigate = (params, payload) => {
        navigation.navigate('pay_bill_pay', {
            ...data,
            billInfo: params,
            payload,
            // billerIcon: data?.billerIcon,
            billerType: data?.billerType,
            ...(paramsData?.moduleType && {moduleType: paramsData?.moduleType})
        })
    };

    const searchDebounce = useCallback(
        debounce((e) => {
            try {
                get(1, e);
            } catch (error) {

            }
        }, 500),
        []
    );

    const onChange = (val) => {
        updateSearchText(val);
        searchDebounce(val)
    };

    const headerProps = {
        headerTitle: t('PAY_BILL.TITLE'),
        headerRight: true,
    };

    const listHeaderComponent = () => {
        return (
            <CText style={GlobalStyle.listTitle}>{t('SECTION_LABELS.ALL_BENEFICIARY')}</CText>
        )
    };

    return (
        <Container headerProps={headerProps}>

            <View style={GlobalStyle.listHeader}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={(val) => onChange(val)}
                    inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                    inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                    leftIconName={'search'}
                    {...(searchText ? { rightIconName : 'close'} : null)}
                    toggleRightIconFunc={() => onChange('')}
                    iconStyle={{color: themes['light'].colors.gray8}}
                    onSubmitEditing={() => null}
                />
            </View>

            <CList
                ListHeaderComponent={listHeaderComponent}
                style={{marginHorizontal: -30}}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-bills.png'),
                    text: t('EMPTY_SECTION.NO_BENEFICIARY_FOUND')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('PAY_BILL.ADD')}
                         disabled={reduxState.loading}
                         onPress={() => toggleCountryModal()}
                />
               {paramsData?.moduleType !== SERVICES.EMBEDDED_FINANCE._id ? <CButton title={t('GLOBAL.HISTORY')}
                                                                                     type={'without_outline'}
                                                                                     disabled={reduxState.loading}
                                                                                     onPress={() => navigation.navigate('pay_bill_history')}/> : null}
            </View>

            <CModal
                isOpen={countryModalIsOpen}
                close={() => toggleCountryModal()}
                headerProps={{
                    headerTitle: t('PAY_BILL.TITLE'),
                    headerRight: true,
                    backOnPress:() => toggleCountryModal()
                }}>
                <CountriesModal onSelect={(val) => countryOnSelect(val)}/>
            </CModal>

            <EditBeneficiary
                selected={selectedBeneficiary}
                isOpen={editBeneficiaryModal}
                onClose={() => toggleOnEdit()}
                loading={reduxState?.editLoading}
                submit={onEdit}
            />

        </Container>
    )
}

export default React.memo(PayBill)
