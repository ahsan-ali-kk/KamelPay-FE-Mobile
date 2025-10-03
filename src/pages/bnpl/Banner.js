import React, {Fragment} from "react";
import {ProgressiveImage, CText} from "../../uiComponents";
import Styles from "./Bnpl.style";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import {formatAmount} from "../../utils/methods";

function Banner(props) {

    const { t } = useTranslation();
    const {bnplIsEligible, bnplDetails} = props;

    return (
        <View style={Styles.bannerContainer}>
            <View style={Styles.bannerContainerOverlay}/>
            <View style={Styles.bannerContentContainer}>
                <View style={Styles.bannerContentContainerLeft}>
                    <CText style={Styles.bannerContentContainerTitle}>
                        {bnplIsEligible ? `BUY NOW,${'\n'}PAY LATER! ` : 'Marketplace'}
                    </CText>
                    {bnplIsEligible ? <Fragment>
                        <CText style={Styles.bannerContentContainerText} numberOfLines={1}>
                            You are eligible for this amount
                        </CText>
                        <CText style={[Styles.bannerContentContainerText, Styles.bannerContentContainerText2]} numberOfLines={2}>
                            {`${formatAmount(bnplDetails?.amount, 'AED')} upto ${bnplDetails?.noOfInstallment} Installments`}
                        </CText>
                    </Fragment> : <CText style={Styles.bannerContentContainerText} numberOfLines={2}>
                            Mobile purchasing made easier
                    </CText>}
                </View>
                <View style={Styles.bannerContainerImageContainer}>
                    <ProgressiveImage
                        style={Styles.bannerContainerImage}
                        source={require('../../assets/images/mobile-mockup.png')}
                        resizeMode={'contain'}
                    />
                </View>
            </View>

        </View>
    )
}

export default React.memo(Banner)
