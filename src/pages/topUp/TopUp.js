import React, {useCallback, useEffect, useState, Fragment} from "react";
import {TouchableOpacity, View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {Container} from "../../containers";
import {CButton, CInput, CList, CListItem, CText, HorizontalList} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {convertToSlug, MappedElement, SERVICES} from "../../utils/methods";
import {getMobileCarrierLookup, getPostpaidBillers, getTopUpBeneficiary} from "../../store/actions/TopUp.action";
import {editBeneficiary, deleteBeneficiary} from "../../store/actions/Global.action";
import {iconBaseUrl} from "../../utils/intercepter";
import { debounce } from 'lodash-es';
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";
import EditBeneficiary from "../payBill/EditBeneficiary";
import {checkAmountBiller, getSKUOfBiller} from "../../store/actions/PayBill.action";
import Popup from "../../uiComponents/popup/Popup";
import {useNavigation} from "@react-navigation/native";

function TopUp(props) {

    const navigation = useNavigation();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {route: { params: paramData }} = props;

    const headerProps = {
        headerTitle: t('MOBILE_TOPUP.TITLE'),
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [editBeneficiaryModal, updateEditBeneficiaryModal] = useState(false);
    const [selectedBeneficiary, updateSelectedBeneficiary] = useState({});
    const [selectedData, updateSelectedData] = useState({});

    const reduxState = useSelector(({auth, global, topUp, payBill}) => {
        return {
            user: auth.user,
            loading: topUp.getTopUpBeneficiaryLoading || topUp.mobileCarriersLoading || global.deleteBeneficiaryLoading || payBill.billerSkuLoading || payBill.billerCheckAmountLoading,
            data: topUp.topUpBeneficiary,
            isLoadMore: topUp.topUpBeneficiaryIsLoadMore,
            isLoadMoreLoading: topUp.topUpBeneficiaryIsLoadMoreLoading,
            metaData: topUp.topUpBeneficiaryMetaData,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
            editLoading: global.editBeneficiaryLoading,
            topBillers: topUp.topBillers,
            getTopBillers: topUp.getTopBillers,
            topupAndBillpaymentCurrentVendor: global.topupAndBillpaymentCurrentVendor,
        }
    });

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

    const get = (val = 1, text = searchText) => {
        let payload = {
            page: val,
            limit: limit,
            ...(text && { search: text }),
            transactionTypes: ["TOPUP", "BILL_PAYMENT"],
            vendor: reduxState?.topupAndBillpaymentCurrentVendor?.id
        };
        dispatch(getTopUpBeneficiary(payload));
    };

    useEffect(() => {
        dispatch(getPostpaidBillers({
                    countryCode: reduxState?.currentCountry?.cca3
        }))
    }, []);

    useEffect(() => {
        get(page);
    }, [page]);

    const onRefreshHandler = () => {
        setPage(1);
        get(1)
    };
    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const callBack = (res, payload) => {
        if(res?.billerFound) {
            navigation.navigate('mobile_topup_pay', {
                data: res?.data,
                payload,
                pageType: 'beneficiary',
                ...(paramData?.moduleType && {moduleType: paramData?.moduleType})
            })
        } else {
            navigation.navigate('mobile_topup_billers', {
                payload,
                Billers: res?.data || [],
                pageType: 'beneficiary',
                ...(paramData?.moduleType && {moduleType: paramData?.moduleType})
            })
        }
    };

    useEffect(() => {
        if(Object.keys(selectedData).length) {
            goPay();
        }
    }, [selectedData]);

    const updateIos = (IOs, valueIos) => {
        return IOs.map((obj) => {
            let found = valueIos ? valueIos.find(o => Number(o.id) === obj.IOID) : '';
            return {
                ...obj,
                value: found?.value
            }
        })
    };
    const getMobileCarrier = (item) => {
        if(item.biller?.BillerType?.includes('Postpaid')){
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
                updateSelectedData(da);
            }
        } else {
            let number = item?.usersInputs?.length && item?.usersInputs[0].value;
            if(number) {
                let payload = {
                    CountryCode: item?.biller?.CountryCode,
                    BillerID: item?.biller?.BillerID,
                    MobileNumber: `${number.replace(/\s+/g, '')}`,
                    Alias: item?.beneficiaryAlias,
                    beneficiaryId: item?._id
                };
                dispatch(getMobileCarrierLookup(payload, callBack))
            }
        }
    };
    const goPay = () => {
        const {biller, sku, io} = selectedData;

        let inputs = io.map(o => ({IOID: o.IOID, value: o.value}));

        let payload = {
            BillerID: biller?.BillerID,
            SKU: sku?.SKU,
            Inputs: inputs,
            CardId: reduxState.card._id,
            ...(selectedData?.beneficiaryId && {beneficiaryId: selectedData?.beneficiaryId})
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
                navigatePayBill({type: 'CUSTOM_AMOUNT'}, payload)
            } else {
                //just pay
                navigatePayBill({type: 'DIRECT_PAY'}, payload)
            }
        }
    };
    const checkBillDueDate = (res) => {
        let billDueDate = new Date(res?.BillDueDate).setHours(23, 59, 59);
        return selectedData?.sku?.InquiryAvailable === 1 && selectedData?.sku?.PastDuePaymentAllowed === 0 && (billDueDate <= new Date())
    };
    const checkAmountCallBack = (res, payload, errorCall = false) => {
        if (errorCall) {
            updateSelectedData({});
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
                updateSelectedData({});
                Popup.show({
                    isVisible: true,
                    type: 'Error',
                    title: t('POPUPS.BILL_PAST.TITLE'),
                    text: t('POPUPS.BILL_PAST.SUB_TITLE'),
                })
            } else {
                navigatePayBill(res, payload)
            }
        }
    };
    const navigatePayBill = (params, payload) => {
        navigation.navigate('pay_bill_pay', {
            ...selectedData,
            billInfo: params,
            payload,
            billerType: selectedData?.billerType,
            ...(paramData?.moduleType && {moduleType: paramData?.moduleType})
        })
    };

    const creatDescription = (item) => {
        let value = item?.biller?.BillerName;
        if(item.usersInputs && item.usersInputs[0] && item.usersInputs[0].value) {
            value  = `${item?.biller?.BillerName}\n+${item.usersInputs[0].value || ''}`
        }
        return value
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
        return <CListItem source={{uri: iconUrl}}
                          iconRadius={0}
                          defaultSource={require('../../assets/images/others.png')}
                          title={item?.beneficiaryAlias}
                          description={creatDescription(item)}
                          onPress={() => getMobileCarrier(item)}
                          renderActionButtons={() => renderActionButtons(item)}
        />
    };


    const getSKUOfBillerCallback = (res) => {
        let bInfo = {
            // billerType: data?._id
        };
        if(Array.isArray(res?.sku)) {
            navigation.navigate('pay_bill_biller_sku', {
                biller: res?.biller,
                billerType: res?.biller?.BillerType,
                ...bInfo,
                ...(paramData?.moduleType && {moduleType: paramData?.moduleType})
            })
        } else {
            navigation.navigate('pay_bill_biller_sku_io', {
                ...res,
                billerType: res?.biller?.BillerType,
                ...bInfo,
                ...(paramData?.moduleType && {moduleType: paramData?.moduleType})
            })
        }
    };

    const getSku = (item) => {
        dispatch(getSKUOfBiller(item, '', (res) => {
            getSKUOfBillerCallback(res, item)
        }))
    };

    const horizontalListOnPress = (item) => {
        if(item.BillerType?.includes('Mobile Prepaid') || item.BillerType?.includes('Mobile Postpaid') && item?._id === 'INTERNATIONAL' ) {
            navigation.navigate('add_mobile_topup', {
                item,
                ...(paramData?.moduleType && {moduleType: paramData?.moduleType})
            })
        } else if(item.BillerType?.includes('Mobile Postpaid')) {
            getSku(item)
        }
    };

    const sequenceData = (array = []) => {
        let sequence = ['Mobile Prepaid', 'Mobile Postpaid'];
        let sequenceData = [];
        sequence?.forEach(o => {
            let found = array?.filter(io => io?._id?.toLowerCase().includes(o.toLowerCase()));
            if(found) {
                sequenceData.push(...found)
            }
        });

        return sequenceData;
    };

    const listHeaderComponent = () => {
        return (
            <Fragment>
                <MappedElement
                    data={sequenceData(reduxState?.topBillers)}
                    renderElement={(item, index) => {
                        return(
                            <HorizontalList
                                key={index}
                                title={item?._id}
                                itemIconStyle={{ width: 32 }}
                                itemStyle={{ minWidth: 100 }}
                                data={[
                                    ...item?.Billers,
                                    {
                                        _id: 'INTERNATIONAL',
                                        BillerName: 'International',
                                        BillerType: item?._id,
                                        viewType: 'SELECTION',
                                        image: require('../../assets/images/3d-vector/international-money.png'),
                                        route: 'add_mobile_topup',

                                        initialCountryModal: true
                                    }
                                ]}
                                renderImageFunc={(val) => {
                                    if(val?.BillerName?.includes('Du')){
                                        return require('../../assets/images/du.png')
                                    } else if(val?.BillerName?.includes('Etisalat')) {
                                        return require('../../assets/images/etisalat.png')
                                    } else {
                                        return require('../../assets/images/3d-vector/international-money.png')
                                    }
                                }}
                                renderTitleFunc={(val) => {
                                   return  val ? val?.BillerName.split(' ')[0] : val
                                }}
                                style={{marginTop: index !== 0 ? 30 : 35}}
                                onPress={(item) => horizontalListOnPress(item)}
                            />
                        )
                    }}
                />
                <CText style={GlobalStyle.listTitle}>{t('SECTION_LABELS.ALL_BENEFICIARY')}</CText>
            </Fragment>
        )
    };

    return (
        <Container headerProps={headerProps}>
            <View style={GlobalStyle.listHeader}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={val => onChange( val)}
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
                style={GlobalStyle.margin_horizontal_minus_30}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-mobile-topup.png'),
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

            {paramData?.moduleType !== SERVICES.EMBEDDED_FINANCE._id ? <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('GLOBAL.HISTORY')}
                         type={'without_outline'}
                         disabled={reduxState.loading}
                         onPress={() => navigation.navigate('mobile_topup_history', {
                             moduleType: paramData?.moduleType
                         })}/>
            </View> : null}

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

export default React.memo(TopUp)
