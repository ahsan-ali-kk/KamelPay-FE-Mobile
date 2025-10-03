import React, {forwardRef, useImperativeHandle, useState} from "react";
import {View, PermissionsAndroid, TouchableOpacity, Platform} from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import GlobalStyle from "../../assets/stylings/GlobalStyle";
import {CListItem, CText, CModal} from "../../uiComponents";
import KamelpayIcon from "../../assets/icons/KamelPayIcon";
import {MappedElement} from "../../utils/methods";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";

const ImagePicker = forwardRef((props, ref) => {

    const { t } = useTranslation();

    const {onChange} = props;

    const [isOpen, updateIsOpen] = useState(false);
    const [selectedField, updateSelectedField] = useState('');


    useImperativeHandle(ref, () => ({
        toggleModal(type) {
            updateIsOpen(true);
            updateSelectedField(type)
        },
    }));

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };
    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                if (Number(Platform.Version) >= 33) {
                    return true;
                }
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };
    const captureImage = async (type) => {
        let options = {
            mediaType: type,
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.9,
            saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            await launchCamera(options, (response) => {
                if (response.didCancel) {
                    // alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    // alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                } else if(response?.assets && response?.assets.length) {
                    onChange(response?.assets, selectedField)
                }
            });
        }
    };
    const chooseFile = async (type) => {
        let options = {
            mediaType: type,
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.9,
            customButtons: [
                {name: 'button_id_1', title: 'CustomButton 1'},
                {name: 'button_id_2', title: 'CustomButton 2'},
            ],
        };
        await launchImageLibrary(options, (response) => {
            console.log('chooseFile Response = ', response);

            if (response.didCancel) {
                // alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            } else if(response?.assets && response?.assets.length) {
                onChange(response?.assets, selectedField)
            }
        });
    };

    const modalClose = (value = false) => {
        updateIsOpen(value)
    };

    const items = [
        {
            label: t('GLOBAL.CHOOSE_FILE'),
            onPress: () => chooseFile('photo'),
            icon: 'gallery'
        },
        {
            label: t('GLOBAL.DIRECT_LAUNCH_CAMERA'),
            onPress: () => captureImage('photo'),
            icon: 'upload-camera'
        }
    ];

    const renderItems = (item, i) => {
        return (
            <CListItem
                style={[GlobalStyle.paddingHorizontal_0, {
                    borderTopWidth: i === 0 ? 0 : 1,
                    borderBottomWidth: 0,
                    borderColor: themes['light'].colors.lighten,
                }]}
                titleStyle={{lineHeight: 24}}
                iconRadius={0}
                title={item?.label}
                onPress={() => {
                    modalClose();
                    setTimeout(() => {
                        item?.onPress()
                    }, 500)
                }}
                leftIconName={item?.icon}
            />
        )
    };

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => modalClose()}>
            <View style={GlobalStyle.centerModalCenterViewContainer}>
                <CText style={[GlobalStyle.listTitle, GlobalStyle.marginHorizontal_0, {marginTop: 0}]}>
                    {t('GLOBAL.SELECT')}
                </CText>
                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => modalClose()}>
                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                </TouchableOpacity>

                <MappedElement
                    data={items}
                    renderElement={renderItems}
                />

            </View>
        </CModal>
    )
});

export default ImagePicker;
