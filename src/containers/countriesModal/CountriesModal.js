import React, {Fragment, useEffect, useState} from "react";
import {View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {useSelector} from "react-redux";
import {CInput, CList, CListItem, CText} from "../../uiComponents";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";

function CountriesModal(props) {
    const { t } = useTranslation();

    const {onSelect} = props;

    const [searchText, updateSearchText] = useState('');
    const [filteredCountry, updateFilteredCountry] = useState([]);
    const [loading, setLoading] = useState(true);

    const reduxState = useSelector(({global}) => {
        return {
            data: global.countries,
            currentCountry: global.currentCountry,
        }
    });

    useEffect(() => {
        updateFilteredCountry(reduxState.data);
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, []);

    const handleChange = (val) => {
        updateSearchText(val);
        let foundArray = [];
        if(val) {
            foundArray = reduxState.data.filter((o) =>  o?.cioc?.toLowerCase().includes(val?.toLowerCase()) || o?.name?.common.toLowerCase().includes(val?.toLowerCase()));
        } else {
            foundArray = reduxState.data
        }
        updateFilteredCountry(foundArray)
    };

    const renderItem = ({item, index}) => {
        return (
            <CListItem
                key={index}
                iconRadius={0}
                style={{paddingHorizontal: 5}}
                resizeMode="contain"
                titleStyle={GlobalStyle.countryName}
                onPress={() => onSelect(item)}
                source={{uri: item.flags.png}}
                title={item.name.common}
            />
        )
    };

    const renderListHeaderComponent = () => {
        return (
            <Fragment>
                {!searchText ? <Fragment>
                    <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0]}>
                        {t('SECTION_LABELS.CURRENT_COUNTRY')}
                    </CText>
                    <CListItem
                        style={{paddingHorizontal: 5}}
                        iconRadius={0}
                        resizeMode="contain"
                        lastItem={true}
                        onPress={() => onSelect(reduxState?.currentCountry)}
                        source={{uri: reduxState?.currentCountry?.flags?.png}}
                        titleStyle={GlobalStyle.countryName}
                        title={reduxState?.currentCountry?.name?.common}
                    />
                </Fragment>: null}
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0, {marginTop: 15}]}>
                    {t('PAGE_TITLE.SELECT_COUNTRY')}
                </CText>
            </Fragment>
        )
    }

    return (
        <View style={[GlobalStyle.fullContainer, {backgroundColor: 'transparent'}]}>
            <View style={GlobalStyle.listHeader}>
                <CInput
                    placeholder={t('GLOBAL.SEARCH')}
                    placeholderTextColor={themes['light'].colors.gray4}
                    value={searchText}
                    onChangeText={val => handleChange( val)}
                    inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                    inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                    leftIconName={'search'}
                    {...(searchText ? { rightIconName : 'close'} : null)}
                    toggleRightIconFunc={() => handleChange('')}
                    iconStyle={{color: themes['light'].colors.gray8}}
                    onSubmitEditing={() => null}
                />
            </View>
            <CList
                loading={loading}
                ListHeaderComponent={() => renderListHeaderComponent()}
                contentContainerStyle={GlobalStyle.list}
                data={filteredCountry}
                renderItem={renderItem}
                maxToRenderPerBatch={10}
                windowSize={10}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/country-not-found.png'),
                    text: t('EMPTY_SECTION.COUNTRY_NOT_FOUND')
                }}
            />
        </View>
    )
}

export default React.memo(CountriesModal)
