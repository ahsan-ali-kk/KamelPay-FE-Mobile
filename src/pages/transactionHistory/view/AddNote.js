import React, {forwardRef, useImperativeHandle, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {CButton, CInput, CText, CModal} from "../../../uiComponents";
import {Formik} from "formik";
import GlobalStyle from "../../../assets/stylings/GlobalStyle";
import {useTranslation} from "react-i18next";
import KeyboardView from "../../../containers/KeyboardView";
import * as Yup from "yup";
import KamelpayIcon from "../../../assets/icons/KamelPayIcon";
import {useDispatch, useSelector} from "react-redux";
import {addTransactionNote, getSingleTransaction} from "../../../store/actions/TransactionHistory.action";

const Note = forwardRef((props, ref) => {

    const { t, i18n } = useTranslation();
    const { transactionId, note } = props;
    const dispatch = useDispatch();

    const reduxState = useSelector(({transactionHistory, global}) => {
        return {
            loading: transactionHistory.addTransactionNoteLoading,
            transaction: transactionHistory.transaction,
            card: global.selectedCard
        }
    });

    const {loading} = reduxState;

    const [isOpen, updateIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        toggleModal() {
            updateIsOpen(true)
        },
    }));

    const onClose = () => {
        updateIsOpen(false)
    };

    const get = () => {
        let payload = {
            cardId: reduxState?.card?._id,
            id: transactionId
        };
        dispatch(getSingleTransaction(payload))
    };

    const addTransactionNoteCallBack = () => {
        onClose();
        get();
    };

    const submit = (values) => {
        let payload = {
            note: values.note,
            id: transactionId
        };
        dispatch(addTransactionNote(payload, addTransactionNoteCallBack))
    };

    return (
        <CModal centerView={true} isOpen={isOpen} close={() => onClose()}>
            <Formik
                onSubmit={(values) => submit(values)}
                initialValues={{
                    note: note || ''
                }}
                validationSchema={Yup.object().shape({
                    note: Yup.string().required("Please enter note")
                })}>
                {({handleChange, values, handleSubmit, errors}) => {
                    return (
                        <KeyboardView contentContainerStyle={[ GlobalStyle.centerModalCenterViewContainerScroll ]}>
                            <View style={GlobalStyle.centerModalCenterViewContainer}>

                                <TouchableOpacity style={GlobalStyle.centerModalCenterViewButton} onPress={() => onClose()}>
                                    <KamelpayIcon style={GlobalStyle.centerModalCenterViewButtonIcon} name="close"/>
                                </TouchableOpacity>

                                <CText style={GlobalStyle.centerModalCenterViewTitle}>
                                    {note ? t('GLOBAL.UPDATE') : t('GLOBAL.ADD')} {t('GLOBAL.NOTE')}
                                </CText>

                                <CInput
                                    // inputSubLabel={'Note'}
                                    placeholder={t('GLOBAL.TYPE_HERE')}
                                    value={values.note}
                                    onChangeText={handleChange('note')}
                                    error={errors.note}
                                    multiline={true}
                                    inputInnerContainerStyle={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 15
                                    }}
                                    style={{
                                        minHeight: 150,
                                        flex: 1,
                                        verticalAlign: 'top',
                                        color: 'black'
                                    }}
                                    returnKeyType="next"
                                />

                                <CButton title={note ? t('GLOBAL.UPDATE') : t('GLOBAL.SUBMIT')}
                                         loading={loading}
                                         onPress={() => handleSubmit()}/>

                            </View>
                        </KeyboardView>
                    )
                }}
            </Formik>
        </CModal>
    )
});

export default React.memo(Note)
