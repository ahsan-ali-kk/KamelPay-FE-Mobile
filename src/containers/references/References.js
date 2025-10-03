import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState} from 'react';
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetBackdrop,
    useBottomSheetSpringConfigs,
    useBottomSheetModal
} from '@gorhom/bottom-sheet';
import {TouchableOpacity, View} from "react-native";
import {CText} from "../../uiComponents";
import {MappedElement} from "../../utils/methods";
import Styles from "./References.style";

const References = forwardRef((props, ref) => {
    const { data, openIndex, onChange, title, subTitle } = props;
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['1%', '50%'], []);
    const [backdropPressBehavior, setBackdropPressBehavior] = useState('collapse');
    const { dismiss, dismissAll } = useBottomSheetModal();

    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
    });

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        open: () => bottomSheetRef.current?.expand(),
        close: () => bottomSheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop {...props} pressBehavior={backdropPressBehavior} />
        ),
        [backdropPressBehavior]
    );

    const onSelect = (obj) => {
        onChange(obj);
        handleClosePress();
    };

    const renderReferenceItem = useCallback((item, index) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => onSelect(item)}
                style={[
                    Styles.reference,
                    index === 0 && Styles.referenceBorderNone,
                ]}
            >
                <View style={Styles.referenceContent}>
                    <CText style={Styles.referenceContentText}>
                        {item?.firstReferenceFullName || item?.localFriendFullName || ''}
                    </CText>
                    <CText style={Styles.referenceContentSubText}>
                        {item?.firstReferencePhone || item?.localFriendPhone || ''}
                    </CText>
                </View>
            </TouchableOpacity>
        );
    }, []);

    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    const onChangeSheet = (index) => {
        if (index === 0) {
            onSelect(null);
        }
    };

    return data && data?.length ? (
        <BottomSheet
            ref={bottomSheetRef}
            animationConfigs={animationConfigs}
            snapPoints={snapPoints}
            index={openIndex}
            backdropComponent={renderBackdrop}
            onDismiss={dismissAll}
            onChange={onChangeSheet}
        >
            <BottomSheetScrollView contentContainerStyle={Styles.references}>
                <View style={Styles.referencesHeader}>
                    <CText style={Styles.referencesHeaderTitle}>{title}</CText>
                    {subTitle ? <CText style={Styles.referencesHeaderSubTitle}>{subTitle}</CText> : null}
                </View>
                <MappedElement data={data} renderElement={renderReferenceItem} />
            </BottomSheetScrollView>
        </BottomSheet>
    ) : null;
});

export default References;
