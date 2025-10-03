import React, {Fragment, useEffect, useState} from "react";
import {Container} from "../../containers";
import {useDispatch, useSelector} from "react-redux";
import {CText, ProgressiveImage} from "../../uiComponents";
import {View, TouchableOpacity} from "react-native";
import Styles from "./Savings.style";
import {useTranslation} from "react-i18next";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import List from "./List";
import {MappedElement} from "../../utils/methods";
import {getVendorDetails, setFavouriteVendor} from "../../store/actions/Savings.action";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


function VendorDetails(props) {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const tabs = [
        {
            label: t('K_S.OFFERS_TITLE'),
            type: "OFFER",
            id: "OFFER",
        },
        {
            label: t('K_S.DEALS_TITLE'),
            type: "DEAL",
            id: "DEAL"
        }
    ];

    const {route: {params: data}, navigation} = props;

    const [selectedTab, updateSelectedTab] = useState(tabs[0]);

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            data: savings.vendorDetails,
            loading: savings.vendorsLoading,
        }
    });

    const headerProps = {
        headerTitle: reduxState?.data?.name,
        headerRight: true,
    };

    useEffect(() => {
        get()
    }, [selectedTab]);

    const get = () => {
        let payload = {
            outletId: data?.vendor?.id,
            type: selectedTab?.id
        };
        dispatch(getVendorDetails(payload))
    };

    const setFavorite = () => {
        let payload = {
            outletId: data?.vendor?.id,
            isFavourite: reduxState?.data?.isFavourite === 0 ? 1 : 0
        };
        dispatch(setFavouriteVendor(payload));
    };

    const renderVendorDetail = () => {
        return <Fragment>
            <View style={Styles.headerView}>
                <View style={Styles.headerUpperView}>
                    <TouchableOpacity style={Styles.headerUpperViewButton} onPress={() => setFavorite()}>
                        <MaterialIcons name={reduxState?.data?.isFavourite ? 'favorite' : 'favorite-border'}
                                       style={[Styles.headerUpperViewButtonIcon,
                                           reduxState?.data?.isFavourite && Styles.headerUpperViewButtonIconActive]}/>
                    </TouchableOpacity>
                </View>
                <ProgressiveImage
                    style={Styles.headerViewImage}
                    source={{uri: reduxState?.data?.photo}}
                    fallback
                    resizeMode="cover"
                    defaultSource={require('../../assets/images/vendor-background-placeholder.png')}/>
            </View>
            <CText style={Styles.headerDescription}>
                {reduxState?.data?.description}
            </CText>
        </Fragment>
    };

    const onSelectTab = (tab) => {
        updateSelectedTab(tab)
    };

    const renderTabs = () => {
        return (
            <View style={GlobalStyle.customTabContainer}>
                <MappedElement
                    data={tabs}
                    renderElement={(tab, i) => {
                        let selected = tab.id === selectedTab?.id;
                        return (
                            <TouchableOpacity key={i}
                                              style={[GlobalStyle.customTabItem, selected && GlobalStyle.activeCustomTabItem]}
                                              onPress={() => onSelectTab(tab)}>
                                <CText style={[GlobalStyle.customTabItemText, selected && GlobalStyle.activeCustomTabItemText]}>
                                    {tab.label}
                                </CText>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    };

    return (
        <Container headerProps={headerProps}>

           {renderVendorDetail()}

            <View style={GlobalStyle.flex_1}>
                {renderTabs()}
                <View style={GlobalStyle.flex_1}>
                    <List tab={selectedTab}
                          {...props}
                          outletId={data?.payload?.outletId}/>
                </View>
            </View>

        </Container>
    )
}

export default React.memo(VendorDetails)
