import React, {useCallback, useEffect, useState, Fragment} from "react";
import {View, TouchableOpacity} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {Container} from "../../containers";
import {CButton, CInput, CList, CListItem, CText} from "../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {getRemittanceBeneficiary} from "../../store/actions/Remittance.action";
import {editBeneficiary, deleteBeneficiary} from "../../store/actions/Global.action";
import { debounce } from 'lodash-es';
import KamelpayIcon  from '../../assets/icons/KamelPayIcon';
import {themes} from "../../theme/colors";
import EditBeneficiary from "../payBill/EditBeneficiary";
import {useTranslation} from "react-i18next";
import {showNumberInBank} from "./remittanceBeneficiaryDetails/Form";
import {getCountryByKey} from "../../utils/methods";
import BeneficiaryNumberUpdate from "./BeneficiaryNumberUpdate";
import Popup from "../../uiComponents/popup/Popup";

export const wallets = ['JazzCash', 'Jazz Cash', 'Easy Paisa'];
export const phWallets = ['GCASH G XCHANGE INC'];

export const convertPayload = (data) => {
    let country = data?.nationalityCountry;
    let payload;
    if(data?.nationalityCountry && data?.singleAmountUnit) {
        payload = {
            singleAmountUnit: data?.singleAmountUnit,
            CCA2: country?.cca2,
            CCA3: country?.cca3,
            CIOC: country?.cioc,
            Currency: country?.currency,
            FlagPng: country?.flagPng,
            FlagSvg: country?.flagSvg,
            Name: country?.name,
        };
    }
    return payload;
};

export const remittanceUnavailable = (t) => {
    Popup.show({
        isVisible: true,
        imageSize: 'normal',
        type: 'Error',
        title: t('POPUPS.REMITTANCE_UNAVAILABLE.TITLE'),
        text: t('POPUPS.REMITTANCE_UNAVAILABLE.SUB_TITLE'),
        actions: [
            {
                text: t('GLOBAL.CANCEL'),
                callback: () => Popup.hide()
            },
        ]
    })
};



function Remittance(props) {
    const { t } = useTranslation();

    const {navigation, route: { params: data }} = props;

    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: data?.module ? t('PAGE_TITLE.SNPL') : t('PAGE_TITLE.SEND_MONEY'),
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');

    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [editBeneficiaryModal, updateEditBeneficiaryModal] = useState(false);
    const [selectedBeneficiary, updateSelectedBeneficiary] = useState({});
    const [beneficiaryNumberUpdate, updateBeneficiaryNumberUpdate] = useState(null);

    const reduxState = useSelector(({auth, global, remittance}) => {
        return {
            user: auth.user,
            loading: remittance.getRemittanceBeneficiaryLoading || global.deleteBeneficiaryLoading,
            data: remittance.remittanceBeneficiary,
            isLoadMore: remittance.remittanceBeneficiaryIsLoadMore,
            isLoadMoreLoading: remittance.remittanceBeneficiaryIsLoadMoreLoading,
            metaData: remittance.remittanceBeneficiaryMetaData,
            card: global.selectedCard,
            currentCountry: global.currentCountry,
            editLoading: global.editBeneficiaryLoading,
            populars: global.populars,
            countries: global.countries,
            masterDetails: global.masterDetails
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
            transactionTypes: ["REMITTANCE"]
        };
        dispatch(getRemittanceBeneficiary(payload));
    };

    const getInitial = () => {
        let payload = {
            page: 1,
            limit: 10,
            transactionTypes: ["REMITTANCE"]
        };
        dispatch(getRemittanceBeneficiary(payload, 'initial'));
    };

    useEffect(() => {
        if(!reduxState?.user?.additionalInfo || !Object.keys(reduxState?.user?.additionalInfo).length){
            navigation.navigate('user_additional_info', {routeName: 'goBack'})
        }
        get(page);
    }, [page]);

    const onRefreshHandler = () => {
        setPage(1);
        get(1);
        getInitial()
    };

    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const checkNumberIsDummy = (item) => {
        let check = showNumberInBank(item?.bank?.BankType, item?.bank?.countryDetails);
        if(check) {
            let findUserNumber = item?.usersInputs?.find(o => o?.id === 'BeneficiaryMSISDN')?.value;
            let country = getCountryByKey(reduxState?.countries, item?.bank?.countryDetails?.CCA2);
            let dummuyNumberPerifix = country?.detail?.code;
            let dummuyNumber = `${dummuyNumberPerifix.replace(/[^\w\s]/gi, '')}00000000000`;
            return !findUserNumber || findUserNumber === dummuyNumber
        } else {
            return false
        }
    };

    const onPayment = (item) => {
        if(!reduxState?.user?.additionalInfo || !Object.keys(reduxState?.user?.additionalInfo).length){
            navigation.navigate('user_additional_info', {routeName: 'goBack'})
        } else {
            let payload = {};
            let inputsMod = {};
            if(item?.usersInputs) {
                item?.usersInputs.forEach(o => {
                    inputsMod = {
                        ...inputsMod,
                        [o.id]: o.value
                    }
                });
                payload.country = item?.bank?.countryDetails;
                payload.bank = item?.bank;
                payload.otherDetails = inputsMod;
                payload.pageType = 'BENEFICIARY_TO_SEND_MONEY';
                payload.beneficiaryAlias = item?.beneficiaryAlias;
                payload.beneficiaryId = item?._id;
                payload.transactionType = item?.transactionType;
                payload.beneficiaryObj = item;

                if(checkNumberIsDummy(item)) {
                    updateBeneficiaryNumberUpdate(payload)
                } else {
                    navigation.navigate('send_money_exchange_rate', payload)
                }

            }
        }
    };

    const numberUpdateOnSubmit = (values) => {
        let payload = {...beneficiaryNumberUpdate};
        payload.otherDetails.BeneficiaryMSISDN = values.BeneficiaryMSISDN;
        navigation.navigate('send_money_exchange_rate', {...beneficiaryNumberUpdate, ...values});
        updateBeneficiaryNumberUpdate(null)
    };

    const creatDescription = (item) => {
        return `${item?.bank?.Country}\n${item?.bank?.BankName || ''}`
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
        return data?.module !== 'SNPL' ? (
            <View style={GlobalStyle.listItemActions}>
                <TouchableOpacity style={[GlobalStyle.listItemActionButton]} onPress={() => onDelete(item)}>
                    <KamelpayIcon name="delete" style={[GlobalStyle.listItemActionButtonIcon]}/>
                </TouchableOpacity>
                <TouchableOpacity style={[GlobalStyle.listItemActionButton]} onPress={() => toggleOnEdit(item, true)}>
                    <KamelpayIcon name="edit" style={[GlobalStyle.listItemActionButtonIcon]}/>
                </TouchableOpacity>
            </View>
        ) : null
    };

    const renderItem = ({item}) => {
        return <CListItem localSource={'avatar'}
                          iconRadius={0}
                          title={item?.beneficiaryAlias}
                          description={creatDescription(item)}
                          onPress={() => onPayment(item)}
                          renderActionButtons={() => renderActionButtons(item)}
        />
    };

    const sendMoney = () => {
        if(!reduxState?.user?.additionalInfo || !Object.keys(reduxState?.user?.additionalInfo).length){
            navigation.navigate('user_additional_info', {routeName: 'goBack'})
        } else {
           let country = convertPayload(reduxState?.populars);
            if(country) {
                navigation.navigate('send_money_type', {
                        country: country
                })
            } else {
                if(reduxState?.masterDetails?.accessOtherCountryInRemittance){
                    navigation.navigate('send_money_countries')
                } else {
                    remittanceUnavailable(t);
                }
            }
        }
    };

    const viewHistory = () => {
      navigation.navigate('send_money_history')
    };

    const addNewBeneficiary = () => {
        if(!reduxState?.user?.additionalInfo || !Object.keys(reduxState?.user?.additionalInfo).length){
            navigation.navigate('user_additional_info', {
                routeName: 'goBack',
                pageType:'ADD_NEW_BENEFICIARY'
            })
        } else {
            let country = convertPayload(reduxState?.populars);
            if(country) {
                navigation.navigate('send_money_type', {
                    country: country,
                    pageType:'ADD_NEW_BENEFICIARY'
                })
            }
            else {
                if(reduxState?.masterDetails?.accessOtherCountryInRemittance) {
                    navigation.navigate('send_money_countries', {
                        pageType: 'ADD_NEW_BENEFICIARY'
                    })
                } else {
                    remittanceUnavailable(t);
                }
            }
        }
    };

    const renderListHeaderComponent = () => {
        return (
            <Fragment>
                <View style={[GlobalStyle.listHeaderButtonContainer, { marginHorizontal: 0 }]}>
                    <TouchableOpacity
                        onPress={() => addNewBeneficiary()}
                        style={[GlobalStyle.listHeaderButton, GlobalStyle.listHeaderButtonSecondary]}>
                        <KamelpayIcon name="add"
                                      style={[GlobalStyle.listHeaderButtonIcon, GlobalStyle.listHeaderButtonSecondaryColor]}/>
                        <CText style={[GlobalStyle.listHeaderButtonText, GlobalStyle.listHeaderButtonSecondaryColor]}>
                            {t('GLOBAL.ADD_RECEIVER_ACCOUNT')}
                        </CText>
                    </TouchableOpacity>
                </View>
                <CText style={GlobalStyle.listTitle}>{t('GLOBAL.ALL_RECEIVER_ACCOUNT')}</CText>
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

                {/*<View style={GlobalStyle.listHeaderButtonContainer}>*/}
                {/*    <TouchableOpacity*/}
                {/*        onPress={() => addNewBeneficiary()}*/}
                {/*        style={GlobalStyle.listHeaderButton}>*/}
                {/*        <KamelpayIcon name="add" style={GlobalStyle.listHeaderButtonIcon}/>*/}
                {/*        <CText style={GlobalStyle.listHeaderButtonText}>{t('SECTION_LABELS.ADD_NEW_BENEFICIARY')}</CText>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}

            </View>

            <CList
                ListHeaderComponent={renderListHeaderComponent}
                style={GlobalStyle.margin_horizontal_minus_30}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-beneficiary.png'),
                    text: t('EMPTY_SECTION.NO_RECEIVER_ACCOUNT_FOUND')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />

            {data?.module !== 'SNPL' ? <View style={GlobalStyle.listFooterButton}>
                <CButton title={t('PAGE_TITLE.SEND_MONEY')}
                         disabled={reduxState.loading}
                         onPress={() => sendMoney()}/>
                <CButton title={t('GLOBAL.TRACK_HISTORY')}
                         type={'without_outline'}
                         disabled={reduxState.loading}
                         onPress={() => viewHistory()}/>
            </View> : null}

            <EditBeneficiary
                selected={selectedBeneficiary}
                isOpen={editBeneficiaryModal}
                onClose={() => toggleOnEdit()}
                loading={reduxState?.editLoading}
                submit={onEdit}
            />

            <BeneficiaryNumberUpdate
                isOpen={!!(beneficiaryNumberUpdate)}
                country={beneficiaryNumberUpdate?.country}
                submit={(values) => numberUpdateOnSubmit(values)}
                onClose={() => updateBeneficiaryNumberUpdate(null)}
            />

        </Container>
    )
}

export default React.memo(Remittance)
