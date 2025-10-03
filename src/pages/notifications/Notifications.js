import React, {useEffect, useState} from "react";
import {Container} from "../../containers";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View} from "react-native";
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CList, IconButton, CText} from "../../uiComponents";
import {getNotifications} from "../../store/actions/Auth.action";
import {useDispatch, useSelector} from "react-redux";
import Styles from "./Notifications.style";
import moment from "moment";
import {useNavigation} from "@react-navigation/native";


function Notifications(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const {route: {param: data}} = props;

    const reduxState = useSelector(({auth}) => {
        return {
            loading: auth.getAllNotificationsLoading,
            data: auth.allNotifications,
            isLoadMore: auth.notificationsIsLoadMore,
            isLoadMoreLoading: auth.notificationsIsLoadMoreLoading,
            metaData: auth.notificationsMetaData,
        }
    });

    const [limit] = useState(10);
    const [page, setPage] = useState(1);

    const get = (val = 1) => {
        let payload = {
            page: val,
            limit: limit,
        };
        dispatch(getNotifications(payload));
    };

    useEffect(() => {
        get(page || 1);
    }, [page, data]);


    const onRefreshHandler = () => {
        setPage(1);
        get(1)
    };
    const onEndReached = () => {
        if (reduxState.isLoadMore && (reduxState.metaData?.totalDocuments > reduxState.data?.length)) {
            setPage(page + 1);
        }
    };

    const renderItemOnPress = (item) => {
        console.log(item);
        if(item?.meta?.actions === 'APPROVAL') {
            navigation.navigate('notificationsApproval', {
                title: item?.heading || '',
                description: item?.content || '',
                approvalId: 'xxxx'
            })
        } else if(item?.meta?.actions === 'ROUTE') {
            navigation.navigate(item?.meta?.routeName, item?.meta?.otherOptions)
        }
    };

    const renderItem = ({item}) => {
        console.log('renderItem', item);
        return(
            <TouchableOpacity
                onPress={() => renderItemOnPress(item)}
                style={[Styles.listItem, !item?.isReaded && Styles.unReadItem]}>
                <IconButton
                    buttonType='normal'
                    type="icon-with-background"
                    buttonStyle={Styles.listItemIconContainer}
                    buttonIconStyle={Styles.listItemIcon}
                    iconName={'bell'}
                />
                <View style={Styles.listItemContent}>
                    <View style={Styles.listItemContentHeader}>
                        <CText style={[Styles.listItemTitle]}>{item?.heading}</CText>
                        <CText style={[Styles.listItemDate]}>{moment(item?.createdAt).fromNow()}</CText>
                    </View>
                    <CText style={[Styles.listItemParagraph]}>{item?.content}</CText>
                </View>
            </TouchableOpacity>
        )
    };

    const headerProps = {
        headerTitle: t('PAGE_TITLE.NOTIFICATIONS'),
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>

            <CList
                style={Styles.list}
                contentContainerStyle={GlobalStyle.list}
                data={reduxState.data}
                loading={reduxState.loading}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                emptyOptions={{
                    icon: require('../../assets/images/empty-notification.png'),
                    text: t('EMPTY_SECTION.NOTIFICATION_NOT_FOUND')
                }}
                onRefreshLoading={reduxState.loading}
                onRefreshHandler={() => onRefreshHandler()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                maxToRenderPerBatch={10}
                windowSize={10}
                isShowFooter={reduxState.isLoadMoreLoading && !reduxState.isLoadMore}
            />
        </Container>
    )
}

export default React.memo(Notifications)
