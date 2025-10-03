import React, {useEffect, useState, useCallback} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CButton, CInput, CList, CListItem} from "../../uiComponents";
import {themes} from "../../theme/colors";
import {View, TouchableOpacity} from "react-native";
import {debounce} from "lodash";
import {
    kpWalletTransferDeleteBeneficiary,
    kpWalletTransferEditBeneficiary,
    getKpWalletTransferBeneficiary,
    findUserByWalletID
} from "../../store/actions/KPWalletTransfer.action";
import KamelpayIcon  from '../../assets/icons/KamelPayIcon';
import EditBeneficiary from "../payBill/EditBeneficiary";
import Popup from "../../uiComponents/popup/Popup";
import {SERVICES} from "../../utils/methods";

function KPWalletTransfer(props) {
    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reduxState = useSelector(({auth, global, kpWalletTransfer}) => {
        return {
            user: auth.user,
            loading: kpWalletTransfer.findUserByWalletIDLoading || kpWalletTransfer.getKpWalletTransferBeneficiaryLoading || kpWalletTransfer.deleteBeneficiaryLoading,
            data: kpWalletTransfer.kpWalletTransferBeneficiary,
            isLoadMore: kpWalletTransfer.kpWalletTransferBeneficiaryIsLoadMore,
            isLoadMoreLoading: kpWalletTransfer.kpWalletTransferBeneficiaryIsLoadMoreLoading,
            metaData: kpWalletTransfer.kpWalletTransferBeneficiaryMetaData,
            card: global.selectedCard,
            editLoading: kpWalletTransfer.editBeneficiaryLoading,
        }
    });

    const [searchText, updateSearchText] = useState('');
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [editBeneficiaryModal, updateEditBeneficiaryModal] = useState(false);
    const [selectedBeneficiary, updateSelectedBeneficiary] = useState({});

    useEffect(() => {
        get(page);
    }, [page]);

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
            transactionTypes: [SERVICES.KP_WALLET_TRANSFER._id]
        };
        dispatch(getKpWalletTransferBeneficiary(payload));
    };

    const onRefreshHandler = () => {
        setPage(1);
        get(1);
    };

    const onEndReached = () => {
        if (reduxState?.isLoadMore && (reduxState?.metaData?.totalDocuments > reduxState?.data?.length)) {
            setPage(page + 1);
        }
    };

    const viewHistory = () => {
        navigation.navigate('kp_wallet_transfer_history')
    };

    const send = () => {
        navigation.navigate('kp_wallet_transfer_find')
    };

 const onDelete = (item) => {
        let payload = {
            id: item?._id
        };
        dispatch(kpWalletTransferDeleteBeneficiary(payload, () => onRefreshHandler()))
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
        dispatch(kpWalletTransferEditBeneficiary(payload, () => {
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

    const findUserByWalletIDCallback = (res, obj) => {
        if(res?.error){
            Popup.show({
                isVisible: true,
                imageSize: 'normal',
                type: 'Error',
                title: t('GLOBAL.ERROR'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => Popup.hide()
                    },
                ]
            });
        } else {
            navigation.navigate("kp_wallet_transfer_rate", {
                ...res?.data?.data,
                beneficiaryId: obj?.beneficiaryId,
                beneficiaryAlias: obj?.beneficiaryAlias,
            });
        }

    }

    const findUserByWalletIDFunc = async (values) => {
        console.log(values);
        let payload = {
            senderWalletID: reduxState?.card?.walletID,
            receiverWalletID: values?.beneficiaryAccountNo,
            beneficiaryId: values?._id,
            beneficiaryAlias: values?.beneficiaryAlias,
        }
        dispatch(findUserByWalletID(payload, findUserByWalletIDCallback));
    };

    const renderItem = ({item}) => {
        return <CListItem localSource={'avatar'}
                          iconRadius={0}
                          title={item?.beneficiaryAlias}
                          description={item?.beneficiaryAccountNo}
                          onPress={() => findUserByWalletIDFunc(item)}
                          renderActionButtons={() => renderActionButtons(item)}
        />
    };

    const headerProps = {
        headerTitle: t("PAGE_TITLE.KP_WALLET_TRANSFER"),
        headerRight: true,
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
                style={GlobalStyle.margin_horizontal_minus_30}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState?.data}
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

            <View style={GlobalStyle.listFooterButton}>
                <CButton title={t("KP_WALLET_TRANSFER.NEW_TRANSFER")}
                         disabled={reduxState.loading}
                         onPress={() => send()}/>
                <CButton title={t('GLOBAL.TRACK_HISTORY')}
                         type={'without_outline'}
                         disabled={reduxState.loading}
                         onPress={() => viewHistory()}/>
            </View>

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

export default React.memo(KPWalletTransfer);
