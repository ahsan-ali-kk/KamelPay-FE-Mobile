import React, {Fragment, useEffect, useState} from "react";
import {View, TouchableOpacity, ScrollView} from "react-native";
import {MappedElement} from "../../utils/methods";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CListItem, CText, CModal, CInput} from "../../uiComponents";
import {themes} from "../../theme/colors";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {useTranslation} from "react-i18next";

const Dropdown = (props) => {

    const {t} = useTranslation();

    const {dropdownProps = {}, inputProps, onChange, bindingKey = 'label', findingKey = 'value',
            displayValue = '', error, touched, submitCount, onBlur, searchIdKey = '_id', searchNameKey = 'name', onPressFunc} = props;

    const {showCloseButton = true, options = [], headerProps, modalViewContentContainerStyle,
        modalContentContainerStyle, showSearch} = dropdownProps;

    const [isOpen, isOpenUpdate] = useState(false);
    const [selected, updateSelected] = useState({});
    const [searchText, updateSearchText] = useState('');
    const [filteredData, updateFilteredData] = useState(options);


    useEffect(() => {

        if(inputProps?.value && options){
            let found = options.find((o) => o[findingKey] ? o[findingKey] === inputProps?.value : null);
            updateSelected(found)
        }

    }, [inputProps]);

    const onSelect = (item) => {
        onChange && onChange(item);
        toggleModal();
        onBlur && setTimeout(() => onBlur());
    };

    const renderItem = (item, index) => (
        <CListItem
            key={index}
            style={[GlobalStyle.paddingHorizontal_0, {
                borderTopWidth: index === 0 ? 0 : 1,
                borderBottomWidth: 0,
                borderColor: themes['light'].colors.lighten,
            }]}
            iconRadius={0}
            title={item[bindingKey] || ''}
            onPress={() => onSelect(item)}
            {...(selected === item[bindingKey] ? {rightIconName: 'right-arrow'} : {})}
        />
    );

    const toggleModal = () => {
        isOpenUpdate(!isOpen)
    };

    const renderModalTitle = () => {
        return dropdownProps?.label ? (
            <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0, {marginTop: 20, fontSize: 16}]}>
                {dropdownProps?.label}
            </CText>
        ) : null
    };

    const renderModalCloseButton = () => {
        return showCloseButton ? (
            <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton}
                              onPress={() => toggleModal()}>
                <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
            </TouchableOpacity>
        ) : null
    };

    const searchOnChange = (val) => {
        updateSearchText(val);
        let foundArray = [];
        if(val && options) {
            foundArray = options.filter((o) => o[searchIdKey]?.toLowerCase().includes(val?.toLowerCase()) || o[searchNameKey]?.toLowerCase().includes(val?.toLowerCase()));
        } else {
            foundArray = options
        }
        updateFilteredData(foundArray)
    };

    const renderModalSearch = () => {
        return showSearch ? (
            <View>
                <View style={GlobalStyle.listHeader}>
                    <CInput
                        placeholder={t('GLOBAL.SEARCH')}
                        placeholderTextColor={themes['light'].colors.gray4}
                        value={searchText}
                        onChangeText={val => searchOnChange( val)}
                        inputContainerStyle={GlobalStyle.listHeaderInputContainer}
                        inputInnerContainerStyle={GlobalStyle.listHeaderInputInnerContainer}
                        leftIconName={'search'}
                        {...(searchText && { rightIconName : 'close'})}
                        toggleRightIconFunc={() => searchOnChange('')}
                        iconStyle={{color: themes['light'].colors.gray8}}
                        onSubmitEditing={() => null}
                    />
                </View>
            </View>
        ) : null
    };

    return (
        <Fragment>
            <CModal
                {...(headerProps && {
                    headerProps: {
                        ...headerProps,
                        backOnPress: () => toggleModal()
                    },
                })}
                centerView={!headerProps}
                isOpen={isOpen}
                close={() => toggleModal()}>

                <View style={GlobalStyle.centerModalCenterViewBody}>

                    <View style={[GlobalStyle.centerModalCenterViewContainer, modalViewContentContainerStyle]}>

                        {renderModalTitle()}

                        {renderModalCloseButton()}

                        {renderModalSearch()}

                        <ScrollView contentContainerStyle={modalContentContainerStyle}>
                            <MappedElement data={showSearch ? filteredData : options} renderElement={renderItem} />
                        </ScrollView>
                    </View>

                </View>

            </CModal>

            <CInput
                type="view"
                onPress={() => onPressFunc ? onPressFunc() : toggleModal()}
                toggleRightIconFunc={() => onPressFunc ? onPressFunc() : toggleModal()}
                rightIconName="arrow-down"
                {...inputProps}
                value={displayValue === 'selected' ? selected && Object.keys(selected).length && selected[bindingKey] ? selected[bindingKey] : inputProps?.value :  inputProps?.value}
                {...(submitCount && {error: submitCount ? error : touched && error})}
            />

        </Fragment>

    );
};

export default Dropdown;
