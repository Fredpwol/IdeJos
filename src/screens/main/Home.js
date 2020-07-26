import * as React from 'react';
import {Container, Text, H2} from "native-base"
import AuthContext from '../../AuthContext';


const HomeScreen = () => {
    const { user, logout } = React.useContext(AuthContext);
    return(
        <Container>
            <Text>{"welcome "+user.email}</Text>
            <H2 onPress={() => logout()} style={{color:"blue"}}>Logout</H2>
        </Container>
    )

}

export default HomeScreen