import React, {useEffect, useState} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {CInput, CList, CText, ProgressiveImage} from "../../uiComponents";
import {View, TouchableOpacity} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./Savings.style";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";
import {getVendorDetails, getVendors, toggleSubscriptionModal} from "../../store/actions/Savings.action";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SubscribeModal from "./SubscribeModal";
import {calculateKM} from "../../utils/methods";

function Vendors(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {route: {params: data}, navigation} = props;

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            data: savings.vendors,
            loading: savings.vendorsLoading || savings.getVendorDetailsLoading,
            populars: global.populars,
            card: global.selectedCard,
            currentLocation: global.currentLocation,
            savingsStatus: savings?.savingsStatus
        }
    });
    const [searchText, updateSearchText] = useState('');
    const [filteredVendors, updateFilteredVendors] = useState([]);

    const get = () => {
        let payload = {
            categoryId: data?.category?.id,
            subCategoryId: data?.subCategory?.id,
        };
        dispatch(getVendors(payload))
    };

    useEffect(() => {
        updateSearchText('');
        get();
    }, []);

    const onRefreshHandler = () => {
        get();
    };

    useEffect(() => {
        if(reduxState.data){
            let array = reduxState.data || [];
            if(Object.keys(reduxState?.currentLocation).length && array?.length) {
               let updatedArray = reduxState.data.map((vendor) => {
                   return {
                       ...vendor,
                       ...(vendor?.latLng && {distance : Number(calculateKM(vendor?.latLng, reduxState?.currentLocation))})
                   }
                });
                array = updatedArray.sort((a, b) => {
                    if(!a?.distance)
                        return a?.name.localeCompare(b?.name);
                    else
                        return a?.distance - b?.distance;
                });
            }
            updateFilteredVendors(array)
        }
    }, [reduxState.data]);

    const headerProps = {
        headerTitle: data?.pageTitle,
        headerRight: true,
    };

    const handleChange = (val) => {
        let foundArray = [];
        if(val) {
            foundArray = reduxState.data?.length ? reduxState.data.filter((o) =>  o?.name?.toLowerCase().includes(val?.toLowerCase())) : null;
        } else {
            foundArray = reduxState.data
        }
        updateFilteredVendors(foundArray)
    };

    const onChange = (val) => {
        updateSearchText(val);
        handleChange(val)
    };

    const onSelect = (item) => {
        if(reduxState?.savingsStatus?.viewSubscriptionModal && reduxState?.savingsStatus?.subscriptionId) {
            dispatch(toggleSubscriptionModal({
                isOpen: true,
                otp_verified: false,
            }))
        } else {
            let payload = {
                outletId: item?.id.toString(),
                type: 'OFFER'
            };
            dispatch(getVendorDetails(payload, vendorDetailsCallback, item))
        }
    };

    const vendorDetailsCallback = (res, payload, vendor) => {
        navigation.navigate('savings_vendor_details', {
                category: data?.category,
                subCategory: data?.subCategory,
                vendor
            })
    };

    const renderItem = ({item, index}) => {
        return <TouchableOpacity key={index}
                                 style={[Styles.vendorListItem, index === 0 && Styles.vendorListItemBorderNone]}
                                 onPress={() => onSelect(item)}>
            <View style={Styles.vendorListItemLogoContainer}>
                <ProgressiveImage
                    style={Styles.vendorListItemLogo}
                    source={{uri: item?.logo}}
                    fallback
                    resizeMode="contain"
                    // defaultSource={require('../../assets/images/others.png')}
                />
            </View>
            <View style={Styles.vendorListItemContent}>
                <CText style={Styles.vendorListItemName}>{item?.name}</CText>
                <CText style={Styles.vendorListItemAddress}>{item?.address}</CText>
            </View>
            {item?.distance ? <View style={Styles.vendorListItemRightContent}>
                <SimpleLineIcons name="location-pin" style={Styles.vendorListItemRightContentIcon}/>
                    <CText style={Styles.vendorListItemRightContentText}>
                        {item?.distance} KM
                    </CText>
            </View> : null}
        </TouchableOpacity>
    };

    const listHeaderComponent = () => {
        return (
            <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0]}>{t('K_S.CHOOSE_VENDOR')}</CText>
        )
    };

    return (
        <Container headerProps={headerProps}>
            <View style={GlobalStyle.listHeader}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={val => onChange(val)}
                    inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                    inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                    leftIconName={'search'}
                    {...(searchText ? { rightIconName : 'close'} : null)}
                    toggleRightIconFunc={() => onChange('')}
                    iconStyle={{color: themes['light'].colors.gray8}}
                    onSubmitEditing={() => null}
                />
            </View>
            {/*<CText style={GlobalStyle.listTitle}>Choose Vendor</CText>*/}
            <CList
                ListHeaderComponent={listHeaderComponent}
                contentContainerStyle={[GlobalStyle.list, Styles.vendorList]}
                data={filteredVendors}
                numColumns={1}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                emptyOptions={{
                    icon: require('../../assets/images/vendors-empty-placeholder.png'),
                    text: t('K_S.VENDORS_NOT_FOUND')
                }}
            />

            <SubscribeModal />

        </Container>
    )
}

export default React.memo(Vendors)
