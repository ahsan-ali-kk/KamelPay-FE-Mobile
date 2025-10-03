import React, {Fragment} from 'react';
import {View, TouchableOpacity} from "react-native";
import {Container, ViewContainer} from "../../../containers";
import Styles from "./Profile.style";
import {ProgressiveImage, CText} from "../../../uiComponents";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

function Profile(props) {
    const { t } = useTranslation();

    const {navigation} = props;

    const reduxState = useSelector(({auth}) => {
        return {
            user: auth.user,
        }
    });

    const renderListItem = (title, value, last = false) => {
        return value ? (
            <View style={[Styles.listItem, last && Styles.noBorder]}>
                <CText style={Styles.listItemTitle}>{t(title)}</CText>
                <CText style={Styles.listItemValue}>{value}</CText>
            </View>
        ) : null
    };

    const updateAdditionalInfo  = () => {
        navigation.navigate('user_additional_info', {
            routeName: 'goBack',
            data: reduxState?.user?.additionalInfo
        })
    };

    const headerProps = {
        headerTitle: t('PAGE_TITLE.PROFILE'),
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>


                 <View style={Styles.userImagePContainer}>
                     <View style={Styles.userImageContainer}>
                         <ProgressiveImage resizeMode="cover"
                                           source={require('../../../assets/images/man_1.png')}
                                           style={Styles.userImage}/>
                     </View>
                 </View>

                <View style={Styles.list}>

                    {/*{renderListItem('Username', reduxState?.user?.username)}*/}
                    {renderListItem('FIELDS_LABELS.FULL_NAME', reduxState?.user?.fullName)}
                    {renderListItem('FIELDS_LABELS.EMIRATES_ID', reduxState?.user?.emirateID)}
                    {renderListItem('FIELDS_LABELS.PHONE_NUMBER', `+${reduxState?.user?.phone}`, true)}

                    <View style={Styles.listHeader}>

                        <CText style={Styles.listHeaderText}>{t('SECTION_LABELS.HOME_ADDRESS_INFORMATION')}</CText>

                        <TouchableOpacity style={Styles.listHeaderButton} onPress={() => updateAdditionalInfo()}>
                            <CText style={Styles.listHeaderButtonText}>
                                {!reduxState?.user?.additionalInfo || !Object.keys(reduxState?.user?.additionalInfo).length ? t('GLOBAL.ADD') : t('GLOBAL.UPDATE')}
                            </CText>
                        </TouchableOpacity>

                    </View>

                    {!reduxState?.user?.additionalInfo || !Object.keys(reduxState?.user?.additionalInfo).length ? null : <Fragment>

                        {renderListItem('FIELDS_LABELS.STREET_NAME', reduxState?.user?.additionalInfo?.streetName)}
                        <View style={Styles.twoListItem}>
                            {renderListItem('FIELDS_LABELS.BUILDING_NUMBER', reduxState?.user?.additionalInfo?.buildingNo)}
                            {renderListItem('FIELDS_LABELS.STREET_NUMBER', reduxState?.user?.additionalInfo?.streetNo)}
                        </View>
                        <View style={Styles.twoListItem}>
                            {renderListItem('FIELDS_LABELS.STREET_NUMBER', reduxState?.user?.additionalInfo?.zipCode, true)}
                        </View>
                    </Fragment>}
                </View>

            </ViewContainer>
        </Container>
    )
}

export default React.memo(Profile);
