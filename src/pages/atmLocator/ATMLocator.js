import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {View, Dimensions, TouchableOpacity, Linking} from "react-native";
import {Container} from "../../containers";
import {CText, Dropdown, ProgressiveImage} from "../../uiComponents";
import Styles from "./ATMLocator.style";
import {useTranslation} from "react-i18next";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Locations from './data';
import {calculateKM, MappedElement} from "../../utils/methods";
import {useNavigation} from "@react-navigation/native";
import Popup from "../../uiComponents/popup/Popup";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import TopupStyle from "../topUp/TopUp.style";
import {useSelector} from "react-redux";
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import SavingsStyles from "../savings/Savings.style";

const window = Dimensions.get('window');
const { width, height }  = window;
const LATITUD_DELTA =  0.0922;
const LONGITUDE_DELTA = LATITUD_DELTA + (width / height);

function ATMLocator() {

    const { t } = useTranslation();

    const navigation  = useNavigation();

    const mapRef  = useRef(null);
    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ['14%', '50%'], []);

    const [selectCity, updateSelectedCity] = useState(Locations[0]);
    const [region, setRegion] = useState({
        latitude: 25.276987,
        longitude: 55.296249,
        latitudeDelta: LATITUD_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    const reduxState = useSelector(({global}) => {
        return {
            currentLocation: global.currentLocation,
        }
    });

    useEffect(() => {
        let city = selectCity;
        if(city) {
            if (Object.keys(reduxState?.currentLocation).length) {
                let updatedLocations = city.data.map((location) => {
                    let latLong = `${location?.latitude},${location?.longitude}`;
                    return {
                        ...location,
                        distance: Number(calculateKM(latLong, reduxState?.currentLocation))
                    }
                });
                updatedLocations.sort((a, b) => {
                    if (!a?.distance)
                        return a?.locationName.localeCompare(b?.locationName);
                    else
                        return a?.distance - b?.distance;
                });
                city.data = updatedLocations

            }
            updateSelectedCity(city)
        }
    }, [reduxState?.currentLocation, selectCity]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onChangeCity(Locations[0])
        });
        return unsubscribe;
    }, [navigation]);

    const headerProps = {
        headerTitle: t('PAGE_TITLE.ATM_LOCATOR'),
        headerRight: true,
    };

    const focus = (data) => {
        const markers = [];
        data.map((obj) => {
            markers.push({latitude: obj.latitude,longitude: obj.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01});
        });
        return markers;
    };

    const onLayout = (data) => {
        if(data?.data) {
            const region = {
                latitude: data.latitude,
                longitude: data.longitude,
                latitudeDelta: LATITUD_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };
            mapRef?.current?.animateToRegion(region);
            mapRef?.current?.fitToCoordinates(
                focus(data?.data),
                {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true
                }
            );
        }
    };

    const onChangeCity = (data) => {
        updateSelectedCity(data);
       setTimeout(() => onLayout(data), 500)
    };

    const view = (obj) => {
        Popup.show({
            isVisible: true,
            styleMainContainer: GlobalStyle.paddingHorizontal_0,
            styleContainer: GlobalStyle.bottomHalfModal,
            viewContainerStyle: GlobalStyle.bottomHalfModalContainer,
            type: 'customView',
            showClose: false,
            edges: ['top', 'left', 'right'],
            callback: () => {
                Popup.hide();
            },
            customView: () => {
                return (
                    <View style={TopupStyle.shortInfoModalContainer}>
                        <CText style={[TopupStyle.shortInfoModalText, TopupStyle.boldText]}>
                            {obj?.locationName}
                        </CText>
                        <CText style={TopupStyle.shortInfoModalText}>
                            {`${obj?.addressLine1} ${obj?.addressLine2}` || ''}
                        </CText>
                    </View>
                )
            },
            actions: [
                {
                    text: 'Get Direction',
                    callback: () => {
                        Popup.hide();
                        openMap(obj)
                    }
                },
            ]
        })
    };

    const markerClick = (obj) => {
        view(obj)
    };

    const renderMapMarker = (obj, i) => {
        const defaultMarker = require('../../assets/images/atm-locator-marker.png');
        return (
            <Marker.Animated key={i}
                             coordinate={{latitude: obj?.latitude,longitude: obj?.longitude}}
                             onPress={(e) => {e.stopPropagation();
                                 markerClick(obj)}}>
                <ProgressiveImage
                    style={Styles.markerImage}
                    source={defaultMarker}/>
            </Marker.Animated>
        )
    };

    const openMap = (item) => {
        const latitude = item?.latitude; // latitude of your desire location
        const longitude = item?.longitude; // longitude of your desire location
        const scheme = Platform.select({
            ios: "maps:0,0?q=",  // if device is ios
            android: "geo:0,0?q=", // if device is android
        });
        const latLng = `${latitude},${longitude}`;
        const label = item?.locationName;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        Linking.openURL(url);
    };

    const renderLocationItem = useCallback( (item, index) => {
        return (
            <View key={index}
                  style={[SavingsStyles.vendorListItem, index === 0 && SavingsStyles.vendorListItemBorderNone]}>
                <View style={SavingsStyles.vendorListItemContent}>
                    <CText style={SavingsStyles.vendorListItemName}>{item?.locationName}</CText>
                    <CText style={SavingsStyles.vendorListItemAddress}>
                        {`${item?.addressLine1} ${item?.addressLine2 || ''}`}
                    </CText>
                </View>
                {item?.distance ? <TouchableOpacity style={SavingsStyles.vendorListItemRightContent}
                                                    onPress={() => openMap(item)}>
                    <ProgressiveImage
                        style={SavingsStyles.vendorListItemRightContentIconImage}
                        source={require('../../assets/images/atm-locator-marker.png')}/>
                    <CText style={SavingsStyles.vendorListItemRightContentText}>
                        {item?.distance} KM
                    </CText>
                </TouchableOpacity> : null}
            </View>
        )
    });

    return (
        <Container edges={['left', 'right']} headerProps={headerProps}>
            <View style={Styles.container}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={Styles.map}
                    onLayout={onLayout}
                    initialRegion={region}
                    onRegionChangeComplete={(region) => setRegion(region)}
                    onMapLoaded={(onMapLoaded) => console.log('onMapLoaded', onMapLoaded)}
                >
                    <MappedElement data={selectCity?.data} renderElement={renderMapMarker}/>
                </MapView>
            </View>

            {selectCity?.data ? <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
            >
                <View style={Styles.dropdownContainer}>
                    <Dropdown
                        bindingKey={'title'}
                        findingKey={'key'}
                        dropdownProps={{ options: Locations }}
                        inputProps={{ value: selectCity?.title }}
                        onChange={(obj) => onChangeCity(obj)}
                    />
                </View>
                <BottomSheetScrollView contentContainerStyle={Styles.locationList}>
                    <MappedElement data={selectCity?.data} renderElement={renderLocationItem}/>
                </BottomSheetScrollView>
            </BottomSheet> : null}

        </Container>
    )
}

export default React.memo(ATMLocator)
