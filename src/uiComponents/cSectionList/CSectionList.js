import React from 'react';
import {SectionList, RefreshControl, View, ActivityIndicator} from 'react-native';
import {CEmpty, CLoading} from '../../uiComponents';
import styles from './CSectionList.style';
import {themes as Theme} from "../../theme/colors";

function CSectionList(props) {
    const {data, loading, contentContainerStyle, onRefreshLoading, onRefreshHandler, isShowFooter,
        onEndReached, scrollEventThrottle, onEndThreshold, emptyOptions, renderSectionHeader} = props;
    const renderFooterFunc = () => {
        if (isShowFooter) {
            return (
                <View style={styles.listFooter}>
                    <ActivityIndicator size="large" color={Theme['light'].colors.primary} />
                </View>
            );
        }
        return null;
    };
    return (
       <View style={styles.listContainer}>
          {loading ? <CLoading showAnimation={true} loading={true}/> : <SectionList
           {...props}
           sections={data}
           renderSectionHeader={renderSectionHeader}
           refreshControl={onRefreshHandler ? <RefreshControl
               color={Theme['light'].colors.primary}
               tintColor={Theme['light'].colors.primary}
               refreshing={onRefreshLoading}
               onRefresh={onRefreshHandler}
           /> : null}
           ListFooterComponent={renderFooterFunc}
           contentContainerStyle={[
               contentContainerStyle,
               {flexGrow: data && data.length ? null : 1, position: 'relative'}
           ]}
           onEndReached={onEndReached}
           onEndThreshold={onEndThreshold}
           scrollEventThrottle={scrollEventThrottle}
           keyExtractor={(item, index) => index}
           ListEmptyComponent={<CEmpty {...emptyOptions}/>}
       />}
       </View>
    );
}

CSectionList.defaultProps = {
    style: {},
    contentContainerStyle: {},
    data: [],
    loading: false,
    onRefreshLoading: false,
    onRefreshHandler: null
};


export default CSectionList;
