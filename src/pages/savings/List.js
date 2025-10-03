import React, {Fragment, useState} from "react";
import {useSelector} from "react-redux";
import {CList, CText, ProgressiveImage} from "../../uiComponents";
import {View, TouchableOpacity} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import Styles from "./Savings.style";
import {useTranslation} from "react-i18next";
import DiscountModal from "./DiscountModal";
import {renderFlatOrPercentage} from "./Savings";

function List(props) {

    const { t } = useTranslation();

    const {navigation} = props;

    const reduxState = useSelector(({auth, savings, global}) => {
        return {
            offer: savings.vendorOffers,
            deal: savings.vendorDeals,
            details: savings.vendorDetails,
            loading: savings.getVendorDetailsLoading,
            user: auth.user,
        }
    });


    const [selectedOffer, updateSelectedOffer] = useState(null);

    const onSelect = (cat) => {
        if(cat?.code){
            updateSelectedOffer(cat)
        } else {
            navigation.navigate('savings_qr_and_pin', {
                type: props?.tab?.id,
                offer: cat,
                ...props?.route?.params,
            })
        }
    };

    const renderItem = ({item, index}) => {
        return <TouchableOpacity key={index}
                                 style={[Styles.vendorListItem, index === 0 && Styles.vendorListItemBorderNone]}
                                 onPress={() => onSelect(item)}>
            <View style={Styles.vendorListItemLogoContainer}>
                <ProgressiveImage
                    style={Styles.vendorListItemLogo}
                    source={{uri: item?.offerPhoto}}
                    fallback
                    resizeMode="cover"
                    // defaultSource={require('../../assets/images/others.png')}
                />
            </View>

            <View style={Styles.vendorListItemContent}>
                <CText style={Styles.vendorListItemSubTitle}>{item?.title}</CText>
                {Number(item?.discount) && renderFlatOrPercentage(item) ? <CText style={Styles.vendorListItemTag}>
                    {renderFlatOrPercentage(item)}
                </CText>: null}
            </View>
        </TouchableOpacity>
    };

    const getDataWithType = (type) => {
        if(type === 'OFFER') {
            return {
                data: reduxState.offer,
                emptyText: t('K_S.OFFERS_EMPTY_TITLE')
            }
        }
        if(type === 'DEAL') {
            return {
                data: reduxState.deal,
                emptyText: t('K_S.DEALS_EMPTY_TITLE')
            }
        }
    };

    return (
        <Fragment>
            <CList
                contentContainerStyle={[GlobalStyle.list, {paddingTop: 15}]}
                data={getDataWithType(props?.tab?.id).data}
                numColumns={1}
                loading={reduxState.loading}
                onRefreshLoading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/offers-placeholder.png'),
                    text: getDataWithType(props?.tab?.id).emptyText
                }}
            />
            <DiscountModal
                isOpen={selectedOffer && !!Object.keys(selectedOffer).length}
                selected={selectedOffer}
                onClose={() => updateSelectedOffer({})}
            />
        </Fragment>
    )
}

export default React.memo(List)
