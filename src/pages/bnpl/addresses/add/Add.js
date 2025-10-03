import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Container} from "../../../../containers";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {Dimensions, View} from "react-native";
import {ProgressiveImage, IconButton, CLoading, CButton} from "../../../../uiComponents";
import Styles from "../Addresses.style";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import GlobalStyle from "../../../../assets/stylings/GlobalStyle";
import CForm from "./Form";
import {addAddress, getAddresses, updateAddress} from "../../../../store/actions/Bnpl.action";
import Popup from "../../../../uiComponents/popup/Popup";

const window = Dimensions.get('window');
const { width, height }  = window;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function AddAddress(props) {

    const { t } = useTranslation();

    const navigation  = useNavigation();
    const dispatch  = useDispatch();
    const {route: { params: data }} = props;

    const mapRef  = useRef(null);
    const formRef  = useRef(null);
    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => [80, '80%'], []);

    const [mapLoading, setMapLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: 25.276987,
        longitude: 55.296249,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    const [currentUserLocation, setCurrentUserLocation] = useState([25.276987, 55.296249]);
    const [sheetIndex, setSheetIndex] = useState(0);

    const reduxState = useSelector(({global, bnpl}) => {
        return {
            currentLocation: global.currentLocation,
            loading: bnpl.addAddressLoading || bnpl.updateAddressLoading
        }
    });

    useEffect(() => {
        if(!mapLoading && !data?.address?.location?.coordinates){
            getOneTimeLocation()
        }
        if(data?.address?.location?.coordinates?.length) {
            onRegionChange({
                latitude: data?.address?.location?.coordinates[0],
                longitude: data?.address?.location?.coordinates[1],
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            })
        }
    }, [mapLoading]);

    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                //getting the Longitude from the location json
                // const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLongitude = position?.coords?.longitude;
                //getting the Latitude from the location json
                // const currentLatitude = JSON.stringify(position.coords.latitude);
                const currentLatitude = position?.coords?.latitude;
                let region = {
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                };
                //Setting Longitude and Latitude state
                setRegion(region);
                setCurrentUserLocation([currentLongitude, currentLatitude]);
                mapRef.current?.animateToRegion(region);
            },
            (error) => {
                console.log('error', error)
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    const onRegionChange = (region) => {
        setRegion(region);
        setCurrentUserLocation([region?.latitude, region?.longitude]);
    };

    const renderMapMarker = () => {
        const defaultMarker = require('../../../../assets/images/atm-locator-marker.png');
        return (
            <View style={Styles.mapMarkerFixedContainer}>
                <ProgressiveImage
                    style={Styles.markerImage}
                    source={defaultMarker}/>
            </View>
        )
    };

    const renderCurrentLocationButton = () => {
        return (
            <View style={Styles.locationButtonContainer}>

                <IconButton
                    buttonType={''}
                    iconName={'gps-location'}
                    buttonStyle={Styles.fabButton}
                    buttonIconStyle={Styles.fabButtonIcon}
                    onPress={() => getOneTimeLocation()}
                />
            </View>
        )
    };

    const headerProps = {
        headerTitle: sheetIndex === 0 ? 'Select Location' : 'Add Address Information',
        headerRight: true,
        ...(sheetIndex === 1 && {backOnPress: () => handleSnapPress(0)})
    };

    // callbacks
    const handleSnapPress = useCallback((index) => {
        bottomSheetRef.current?.snapToIndex(index);
    }, []);

    const addAddressFlow = () => {
        if(sheetIndex === 0) {
            handleSnapPress(1)
        } else {
            if(formRef?.current?.getFormValues()?.status === 'SUCCESS'){
                let payload;
                if(data?.actionType === 'UPDATE' && data?.address) {
                    payload = {
                        ...formRef?.current?.getFormValues()?.payload,
                        location: currentUserLocation,
                        id: data?.address?._id
                    };
                    dispatch(updateAddress(payload, addAddressCallBack))
                } else {
                    payload = {
                        ...formRef?.current?.getFormValues()?.payload,
                        location: currentUserLocation
                    };
                    dispatch(addAddress(payload, addAddressCallBack))
                }
            }
        }
    };

    const addAddressCallBack = (res) => {
        if (res?.error) {
            Popup.show({
                isVisible: true,
                type: 'Error',
                title: t('POPUPS.ERROR.TITLE'),
                text: res?.data?.message,
                actions: [
                    {
                        text: t('GLOBAL.TRY_AGAIN'),
                        callback: () => Popup.hide()
                    },
                ]
            })
        } else {
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
                            dispatch(getAddresses({
                                page: 1,
                                limit: 10
                            }));
                            navigation.goBack()
                        }
                    },
                ]
            })
        }
    };

    const renderFooter = () => {
        return (
            <View style={GlobalStyle.listFooterButton}>
                <CButton
                    loading={reduxState?.loading}
                    onPress={() => addAddressFlow()}
                    title={sheetIndex === 1 ? 'Save and continue ' : 'Apply changes'}
                />
            </View>
        )
    };

    return (
        <Container
            SafeAreaViewStyle={{backgroundColor: 'white'}}
            renderFooter={renderFooter}
            edges={['bottom', 'left', 'right']}
            headerProps={headerProps}>

            <View style={[Styles.container, {marginBottom: 80}]}>
                {!mapLoading ? renderMapMarker() : null}

                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={Styles.map}
                    initialRegion={region}
                    paddingAdjustmentBehavior="never"
                    onRegionChangeComplete={(region) => onRegionChange(region)}
                    onMapLoaded={(onMapLoaded) => {
                        setMapLoading(false);
                    }}
                />

                {renderCurrentLocationButton()}

                <CLoading showAnimation={true} style={{ zIndex: 5 }} loading={mapLoading} />

            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                onChange={(index) => setSheetIndex(index)}
            >
                <BottomSheetScrollView contentContainerStyle={Styles.formContainer}>

                    <CForm ref={formRef} address={data?.address}/>

                </BottomSheetScrollView>
            </BottomSheet>

        </Container>
    )
}

export default React.memo(AddAddress)
