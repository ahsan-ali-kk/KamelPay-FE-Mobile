import React from "react";
import Styles from "../../Auth.style";
import { themes } from '../../../../theme/colors';
import CForm from "./Form";
import {ViewContainer, Container} from "../../../../containers";
import {useSelector} from "react-redux";

function CardConfirmation(props) {

    const {theme, navigation} = props;

    const reduxState = useSelector(({auth, global}) => {
        return {
            loading: auth.userValidateLoading,
            currentCountry: global.currentCountry,
        }
    });

    const next = (values) => {
        navigation.navigate('userCreation', values)
    };

    const headerProps = {
        showCenterLogo: true,
        headerRight: true,
    };

    return (
        <Container headerProps={headerProps}>
            <ViewContainer scrolled={true} contentContainerStyle={Styles.scrollContainer}>
                <CForm
                    theme={themes[theme]}
                    loading={reduxState.loading}
                    submit={next}
                    loginRoute={() =>  navigation.navigate('login')}
                />
            </ViewContainer>
        </Container>
    )
}
export default CardConfirmation;
