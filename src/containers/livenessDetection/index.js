import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState, forwardRef, useImperativeHandle, Fragment} from 'react'
import {CModal, CButton} from "../../uiComponents";
import SelfieSvg from "./SelfieSvg";
import Liveness from "./Liveness";
import {themes} from "../../theme/colors";
import {useTranslation} from "react-i18next";
import mime from "mime";

const LivenessDetection = forwardRef((props, ref) => {
    const { t } = useTranslation();

    const [isOpen, updateIsOpen] = useState(false);
    const [startFlow, updateStartFlow] = useState(false);

    useImperativeHandle(ref, () => ({
        toggleModal(val = true) {
            updateIsOpen(val);
        },
    }));

    const modalClose = (value = false) => {
        updateStartFlow(false);
        updateIsOpen(value)
    };

    const startDetection = () => updateStartFlow(true);

    const headerProps = {
        headerTitle: '',
        backOnPress: () => modalClose(),
        showCenterLogo: true
    };

    return (
        <CModal
            headerProps={headerProps}
            isOpen={isOpen} close={() => modalClose()}>
            <View style={styles.container}>
                {startFlow ? <Liveness
                        // detectionsList={['BLINK', 'NOD', 'TURN_HEAD_RIGHT', 'TURN_HEAD_LEFT', 'SMILE', 'CAPTURE']}
                        detectionsList={props?.detectionsList}
                        onTestComplete={(picture) => {
                            let newImageUri = Platform.OS === "android" ? picture?.uri : picture?.uri.replace("file://", "");
                            let updatedPicture = {
                                name: newImageUri.split("/").pop(),
                                type: mime.getType(newImageUri),
                                uri: newImageUri
                            };
                            updateStartFlow(false);
                            props?.onComplete && props?.onComplete(updatedPicture)
                        }}
                    /> :
                    <Fragment>
                        <Text style={styles.title}>{t("LIVENESS.TITLE")}</Text>
                        <View style={styles.bottomContainer}>
                            <SelfieSvg size={300} style={styles.selfieSvg} />
                            <CButton style={styles.btn}
                                     onPress={startDetection}
                                     title={t("LIVENESS.START")} />
                        </View>
                    </Fragment>

                }
            </View>
        </CModal>
    )
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25
    },
    title: {
        fontSize: 52,
        fontWeight: "bold",
        marginTop: 50,
        color: themes['light'].colors.dark,
        fontFamily: themes.font.medium,
    },
    selfieSvg: {
        position: "absolute",
        bottom: 58
    },
    bottomContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 25,
    },
    btn: {
        width: 300,
        height: 60,
        borderRadius: 5,
        justifyContent: "center",
        backgroundColor: "#334155"
    },
    btnText: {
        fontSize: 24,
        textAlign: "center",
        color: "white"
    }
});

export default LivenessDetection;
