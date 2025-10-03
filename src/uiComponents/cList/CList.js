import React from 'react';
import {FlatList, RefreshControl, View, ActivityIndicator} from 'react-native';
import {CEmpty, CLoading} from '../../uiComponents';
import styles from './CListStyle';
import {themes as Theme} from "../../theme/colors";

function CList(props) {
    const {data, loading, contentContainerStyle, onRefreshLoading, onRefreshHandler, isShowFooter, onEndReached,
        scrollEventThrottle, onEndThreshold, emptyOptions, numColumns, listContainerStyle, loadingStyle, loadingText} = props;
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
       <View style={[styles.listContainer, listContainerStyle]}>
          {loading ? <CLoading style={loadingStyle}
                               transparent={true}
                               text={loadingText}
                               showAnimation={true}
                               loading={true}/> : <FlatList
           {...props}
           data={data}
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
           numColumns={numColumns}
       />}
       </View>
    );
}

CList.defaultProps = {
    style: {},
    contentContainerStyle: {},
    data: [],
    loading: false,
    onRefreshLoading: false,
    onRefreshHandler: null
};


export default CList;
