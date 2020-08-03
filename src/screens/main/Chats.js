import * as React from 'react';
import {Container, Text, H2} from 'native-base';
import {AuthContext} from '../../AuthProvider';
import Header from '../../components/Header';
import  Menu, {MenuItem} from "react-native-material-menu";
import Icon from "react-native-vector-icons/Ionicons";
import UUIDGenerator from 'react-native-uuid-generator'
import { Button } from 'react-native';

const Chats = ({navigation}) => {
  const {user, logout} = React.useContext(AuthContext);
  const menuRef = React.useRef()

  console.log(user)

  return (
    <Container>
         <Header
        leftComponent={
          <Menu
            ref={menuRef}
            button={
              <Icon
                name={'ellipsis-vertical'}
                size={30}
                onPress={() => menuRef.current.show()}
              />
            }>
            <MenuItem onPress={() =>{ 
              menuRef.current.hide()
              navigation.navigate("createGroup")
              }}>
              Create group
            </MenuItem>
            <MenuItem onPress={() => menuRef.current.hide()}>Settings</MenuItem>
          </Menu>
        }
      />
      <Text>{'welcome ' + user.displayName}</Text>
      <H2>Chats page!</H2>
    </Container>
  );
};
export default Chats;
