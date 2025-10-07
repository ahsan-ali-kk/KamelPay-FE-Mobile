import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import {SafeAreaView} from "../index";
import Styles from './TabBar.style';
import KamelPayIcon from '../../assets/icons/KamelPayIcon';
import {MappedElement} from "../../utils/methods";
import {themes} from "../../theme/colors";
import posed from "react-native-pose";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get("window").width;
const tabWidth = windowWidth / 3;
const SpotLight = posed.View({
    route0: { x: 0 },
    route1: { x: false ? -tabWidth : tabWidth },
    route2: { x: false ? -tabWidth * 2 : tabWidth * 2 },
    route3: { x: false ? -tabWidth * 3 : tabWidth * 3 }
});

export function TabBar(props) {

    const {navigation, state} = props;

    const [routes, updatedRoutes] = useState([
        {
            name: 'Home',
            key: 'home',
            icon: 'home',
            onPress: () => navigation.navigate('Home'),
            fontSize: 22
        },
        {
            name: 'Card Management',
            key: 'card_management',
            icon: 'card-mgmt',
            onPress: () => navigation.navigate('Card_Management', {selectCardModal: true}),
            fontSize: 26
        },
        // {
        //     name: 'Notifications',
        //     icon: 'notification',
        //     onPress: () => navigation.navigate('Notifications'),
        //     fontSize: 22
        // },
        {
            name: 'Settings',
            key: 'settings',
            icon: 'profile',
            onPress: () => navigation.navigate('Settings'),
            fontSize: 22
        },
    ]);

    const ShowTabBarComponents = ['home', 'card_management', 'employees', 'settings'];

    const getCurrentRouteName = (data) => {
        const routeName = data && data.routes[data.index].state
            ? data.routes[data.index].state.routes[data.routes[data.index].state.index].name
            : data ? data.routes[data.index].name : data.params?.screen || 'Home';
        return routeName
    };

    const getTabBarVisibility = (data) => {
        return ShowTabBarComponents.includes(getCurrentRouteName(data).toLowerCase()) || false;
    };


    if(!getTabBarVisibility(state)) { return null }

    const renderElement = (route, i) => {
        const isRouteActive = route?.key === getCurrentRouteName(state)?.toLowerCase();

        let iconProperties = {
            name: route.icon,
            style: [Styles.tabIcon, {
                fontSize: route?.fontSize,
                color: isRouteActive ? themes['light'].colors.secondary : themes['light'].colors.gray8
            }],
        }

        return (
            <TouchableOpacity key={i} onPress={route.onPress} style={Styles.tab}>
                {/*<View style={[Styles.rounded, {backgroundColor: tintColor}]}>*/}
                {route?.iconType === 'FontAwesome' ? <FontAwesome {...iconProperties} /> : <KamelPayIcon {...iconProperties} />}
                {/*</View>*/}
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={Styles.tabContainer}>

            <View style={Styles.absoluteFillObject}>
                <SpotLight style={[Styles.spotLight, {width: tabWidth}]}
                           pose={`route${state?.index}`}>
                    <View style={Styles.spotLightInner} />
                </SpotLight>
            </View>
            <View style={Styles.tabInnerContainer}>
                <MappedElement data={routes} renderElement={renderElement} />
            </View>

        </SafeAreaView>
    );
}

export default React.memo(TabBar)
