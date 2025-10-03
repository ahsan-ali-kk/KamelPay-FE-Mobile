import React, {useEffect, useState} from "react";
import {Container} from "../../../containers";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {CButton, CList, IconButton, CText} from "../../../uiComponents";
import {deleteAddress, getAddresses, setSelectedAddress} from "../../../store/actions/Bnpl.action";
import Styles from "./Addresses.style";
import Popup from "../../../uiComponents/popup/Popup";

function Addresses() {

    const { t } = useTranslation();

    const navigation  = useNavigation();
    const dispatch  = useDispatch();

    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    const reduxState = useSelector(({bnpl}) => {
        return {
            loading: bnpl.getAddressesLoading || bnpl.deleteAddressLoading,
            buttonLoading: bnpl.deleteAddressLoading,
            data: bnpl.addresses,
            isLoadMore: bnpl.addressesIsLoadMore,
            isLoadMoreLoading: bnpl.addressesIsLoadMoreLoading,
            metaData: bnpl.addressesMetaData,
            selectedAddress: bnpl.selectedAddress,
        }
    });

    const headerProps = {
        headerTitle: 'Addresses',
        headerRight: true
    };

    const get = (val = 1) => {
        let payload = {
            page: val,
            limit: limit,
        };
        dispatch(getAddresses(payload));
    };

    useEffect(() => {
        get(page);
    }, [page]);

    const onRefreshHandler = () => {
        setPage(1);
        get(1);
    };

    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const onSelect = (item) => {
        dispatch(setSelectedAddress(item));
        navigation.goBack()
    };

    const deleteFunc = (obj) => {
        let payload = {
            id: obj?._id
        };
        dispatch(deleteAddress(payload, deleteAddressCallBack))
    };

    const deleteAddressCallBack = (res) => {
        if (res?.error) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: t('POPUPS.ERROR.TITLE'),
                text: res?.data?.message ,
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () => Popup.hide()
                    },
                ]
            })
        } else {
            onRefreshHandler();
            Popup.show({
                isVisible: true,
                showClose: false,
                type: 'Success',
                title:  t('GLOBAL.SUCCESSFULLY'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.OK'),
                        callback: () => {
                            Popup.hide();
                        }
                    },
                ]
            })
        }
    };

    const editFunc = (item) => {
        navigation.navigate('bnpl_add_address', {address: item, actionType: 'UPDATE'})
    };


    const generateAddress = (item) => {
        return `${item?.flatUnit || ''} ${item?.buildingName || ''} ${item?.streetName || ''} ${item?.area || ''} ${item?.state || ''}`
    };

    const renderItem = ({item, index}) => {
        return (
            <View style={[Styles.listItem, index === 0 && Styles.firstListItem]} key={index}>
                <TouchableOpacity style={Styles.listItemButton} onPress={() => onSelect(item)} activeOpacity={0.8}>
                    <View style={Styles.listItemCircle}>
                        {item?._id === reduxState?.selectedAddress?._id ? <View style={Styles.listItemActiveCircle} /> : null}
                    </View>
                    <View style={Styles.listItemContent}>
                        <CText style={[Styles.listItemText, Styles.listItemTitle]}>
                            {item?.buildingName}
                        </CText>
                        <CText style={Styles.listItemText} numberOfLines={3}>
                            {generateAddress(item)}
                        </CText>
                    </View>
                </TouchableOpacity>
                <View style={Styles.listItemActions}>
                    <IconButton
                        buttonType={''}
                        iconName={'delete'}
                        buttonStyle={Styles.listItemActionsButton}
                        buttonIconStyle={Styles.listItemActionsButtonIcon}
                        onPress={() => deleteFunc(item)}
                    />
                    <IconButton
                        buttonType={''}
                        iconName={'edit'}
                        buttonStyle={Styles.listItemActionsButton}
                        buttonIconStyle={Styles.listItemActionsButtonIcon}
                        onPress={() => editFunc(item)}
                    />
                </View>
            </View>
        )
    };

    const renderFooter = () => {
        return (
            <View style={GlobalStyle.listFooterButton}>
                <CButton
                    disabled={reduxState?.loading}
                    title={'Add Address'}
                    onPress={() => navigation.navigate('bnpl_add_address')}
                />
            </View>
        )
    };

    return (
        <Container renderFooter={renderFooter} headerProps={headerProps}>
            <CList
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/3d-vector/empty-addresses.png'),
                    text: 'No Addresses Found'
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />
        </Container>
    )
}

export default React.memo(Addresses)
