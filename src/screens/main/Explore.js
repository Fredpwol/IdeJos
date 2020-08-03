import * as React from 'react';
import {Container, Text, H2 } from 'native-base';
import {AuthContext} from '../../AuthProvider';
import {StatusBar} from 'react-native'
import Header from '../../components/Header';

const Chats = () => {
  const {user, logout} = React.useContext(AuthContext);
  return (
    <Container>
        <Header />
      <Text>{'welcome ' + user.displayName}</Text>
      <H2>
        Explore page!
      </H2>
    </Container>
  );
};
export default Chats;