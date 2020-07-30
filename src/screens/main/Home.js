/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Container, Text, H2 } from 'native-base';
import {AuthContext} from '../../AuthProvider';
import Header from 'react-native-custom-header';


const HomeScreen = () => {
  const {user, logout} = React.useContext(AuthContext);
  
  return (
    <Container>
        <Header 
          backgroundColor={"#fff"}
          height={60}
          isBack={true}
          title={"ideyjos"}
          titleStyle={{color:"#000"}}
          backIconColor={"#000"}
          statusBarStyle={"dark-content"}
         />
      <Text>{'welcome ' + user.displayName}</Text>
      <H2 onPress={() => logout()} style={{color: 'blue'}}>
        Logout
      </H2>
    </Container>
  );
};
export default HomeScreen;