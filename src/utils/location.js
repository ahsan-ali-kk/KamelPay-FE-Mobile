import React, { useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import { updateCurrentLocation } from "../store/actions/Global.action";
import { useDispatch, useSelector } from "react-redux";
import { Platform } from "react-native";
import { requestMultiple, PERMISSIONS, RESULTS } from "react-native-permissions";

function Location() {
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');

    const reduxState = useSelector(({ global }) => ({
        currentLocation: global.currentLocation,
    }));

    const getLocationPermissions = async () => {
        const permissions = Platform.select({
            android: [
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            ],
            ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
        });

        const granted = await requestMultiple(permissions);

        // Check if any permission is granted
        if (
            granted[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED ||
            granted[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED ||
            granted[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED
        ) {
            setStatus(RESULTS.GRANTED);
            await getOneTimeLocation(granted[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED);
        } else {
            setStatus(RESULTS.DENIED);
            // console.warn("Location permission denied");
        }
    };

    const getOneTimeLocation = async (isApproximate) => {
        console.log("Fetching location...");
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                console.log("Position:", position, { latitude, longitude, accuracy });

                dispatch(
                    updateCurrentLocation({
                        latitude,
                        longitude,
                        accuracy,
                        type: isApproximate ? "approximate" : "precise",
                    })
                );

                if (isApproximate) {
                    console.log("Using Approximate Location");
                } else {
                    console.log("Using Precise Location");
                }
            },
            (error) => {
                console.error("Error fetching location:", error);
            },
            {
                enableHighAccuracy: !isApproximate, // Use precise location if not approximate
                timeout: 15000,
                maximumAge: 0,
                forceRequestLocation: true,
                showLocationDialog: true,
            }
        );
    };

    useEffect(() => {
        (async () => {
            if(status === RESULTS.GRANTED && !reduxState.currentLocation){
                await getOneTimeLocation()
            }
        })()
    }, [reduxState.currentLocation]);

    useEffect(() => {
        (async () => {
            await getLocationPermissions();
        })();
    }, []);

    return null;
}

export default Location;
