import React, {Fragment, useEffect, useState} from "react";
import {View, TouchableOpacity} from "react-native";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {Container} from "../../../containers";
import {CInput, CList, CText, IconButton, ProgressiveImage} from "../../../uiComponents";
import {useDispatch, useSelector} from "react-redux";
import {getBillersByCountry} from "../../../store/actions/PayBill.action";
import {themes} from "../../../theme/colors";
import PayBill from "./PayBill.style";
import {convertToSlug} from "../../../utils/methods";
import {useTranslation} from "react-i18next";

function BillerTypes(props) {
    const { t, i18n } = useTranslation();

    const {navigation, route: {params: data}} = props;
    const dispatch = useDispatch();

    const headerProps = {
        headerTitle: t('PAY_BILL.PAY_YOUR_BILL'),
        headerRight: true,
    };

    const [searchText, updateSearchText] = useState('');
    const [filteredCountry, updateFilteredCountry] = useState([]);

    const callback = ( array ) => {
        if(data?.billerType && data?.whereToCome === 'PROMOTION'){
            let findBillerWithType = array?.find(o => o?._id === data?.billerType);
            gotoBiller(findBillerWithType)
        }
        updateFilteredCountry(array)
    };

    useEffect(() => {
        dispatch(getBillersByCountry({
            countryCode: data?.cca3
        }, callback))
    }, []);

    const reduxState = useSelector(({payBill}) => {
        return {
            data: payBill.billers,
            loading: payBill.billersLoading,
        }
    });

    const handleChange = (val) => {
        updateSearchText(val);
        let foundArray = [];
        if(val) {
            foundArray = reduxState.data.filter((o) => o?._id.toLowerCase().includes(val?.toLowerCase()));
        } else {
            foundArray = reduxState.data
        }
        updateFilteredCountry(foundArray)
    };

    const gotoBiller = (item) => {
        navigation.navigate('pay_bill_billers', {
            ...item,
            ...(data?.moduleType && {moduleType: data?.moduleType})
        })
    };

    const renderItem = ({item, index}) => {
        let iconUrl = `https://kp-statics.s3.me-south-1.amazonaws.com/biller-icons-v2/${convertToSlug(item._id)}.png`;
        return (
            <TouchableOpacity key={index} style={PayBill.billingListItem} onPress={() => gotoBiller(item)}>
                <IconButton
                    type="icon-with-background"
                    buttonStyle={PayBill.billingListItemIconContainer}
                >
                    <ProgressiveImage style={PayBill.billingListItemIcon}
                                      source={{uri: iconUrl}}
                                      fallback
                                      defaultSource={require('../../../assets/images/others.png')}
                    />
                </IconButton>
                <CText style={PayBill.billingListItemText}>{item?._id}</CText>
            </TouchableOpacity>
        );
    };

    const renderListHeaderComponent = () => {
        return (
            <Fragment>
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0, {marginBottom: 15}]}>
                    {t('PAY_BILL.SELECT_BILL_TYPE')}
                </CText>
            </Fragment>
        )
    };

    return (
        <Container headerProps={headerProps}>

        <View style={[GlobalStyle.listHeader]}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={val => handleChange( val)}
                    inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                    inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                    leftIconName={'search'}
                    iconStyle={{color: themes['light'].colors.gray8}}
                    onSubmitEditing={() => null}
                />

            </View>

            <CList
                numColumns={2}
                ListHeaderComponent={renderListHeaderComponent}
                contentContainerStyle={PayBill.billingList}
                data={filteredCountry}
                loading={reduxState.loading || reduxState.billerSkuLoading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../../assets/images/empty-bills.png'),
                    text: t('PAY_BILL.BILLERS_NOT_FOUND')
                }}
            />

        </Container>
    )
}

export default React.memo(BillerTypes)
