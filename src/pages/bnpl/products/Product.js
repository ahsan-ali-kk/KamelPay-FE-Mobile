import React from "react";
import {ProgressiveImage, CText} from "../../../uiComponents";
import Styles from "../Bnpl.style";
import {useTranslation} from "react-i18next";
import {View, TouchableOpacity} from "react-native";
import {formatAmount, getPBnplFees} from "../../../utils/methods";
import {useSelector} from "react-redux";

function Product(props) {

    const {data, productItemStyle} = props;
    const { t } = useTranslation();

    const {bnplDetails} = useSelector(({bnpl}) => {
        return {
            bnplDetails: bnpl?.bnplEligibility,
        }
    });

    const getFeeBracket = (amount) => {
        return getPBnplFees(bnplDetails?.feeBrackets, amount) || {NoOfInstallment: bnplDetails?.noOfInstallment}
    };

    const isEligibleForInstallment = (amount) => {
        if(bnplDetails?.isEligible && data?.isForBnpl && amount) {
            let feeBracket = getFeeBracket(amount);
            return feeBracket?.NoOfInstallment
        }
    };

    return (
        <TouchableOpacity style={[Styles.productItem, productItemStyle]}
                          activeOpacity={0.8}
                          onPress={props?.onPress}>
            <View style={Styles.productItemContainer}>
                <View style={Styles.productItemHeader}>
                    <ProgressiveImage
                        style={Styles.productItemHeaderImage}
                        source={{uri: data?.meta?.imageUrls[0]}}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={Styles.productItemBody}>
                    {data?.name ? <CText style={[Styles.productItemText, Styles.productItemBodyTitle]}>
                        {data?.name}
                    </CText> : null}
                    {data?.price ? <CText style={[Styles.productItemText, Styles.productItemBodyTitle]}>
                        {formatAmount(data?.price, data?.currency)}
                    </CText> : null}
                    {isEligibleForInstallment(data?.price) ? <CText style={[Styles.productItemText, Styles.productItemBodyAmount]}>
                        {isEligibleForInstallment(data?.price)} Installments
                    </CText> : null}
                </View>
                {/*<View style={Styles.productItemFooter}>*/}
                {/*    <CText style={[Styles.productItemText, Styles.productItemFooterText]}>*/}
                {/*        150.00 / Month*/}
                {/*    </CText>*/}
                {/*    <MaterialCommunityIcons*/}
                {/*        style={Styles.productItemFooterIcon}*/}
                {/*        name={'cart'}/>*/}
                {/*</View>*/}
            </View>

        </TouchableOpacity>
    )
}

export default React.memo(Product)
