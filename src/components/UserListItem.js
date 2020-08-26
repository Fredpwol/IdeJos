import React, {useRef} from 'react';
import {
  Container,
  Text,
  H2,
  ListItem,
  Left,
  Right,
  Content,
  Body,
} from 'native-base';
import {View, TouchableNativeFeedback} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from './Avatar';
import {Divider} from 'react-native-elements';
import {greenTheme} from '../types/color';
import {Dimensions} from 'react-native';


const {width} = Dimensions.get('window');
const UserListItem = (props) => {
  const {user, isAdmin, onPress} = props;
  const menuRef = useRef();
  return (
      <>
        <ListItem avatar noBorder onPress={onPress}>
          <Left>
            <Avatar source={{uri: user.photoURL}} />
          </Left>
          <Body>
            <Text>{user.displayName}</Text>
          </Body>
          <Right>
            {user.isAdmin ? (
              <Text style={{color: greenTheme}}>Admin</Text>
            ) : isAdmin ? (
              <Menu
                ref={menuRef}
                button={
                  <Icon
                    name={'ellipsis-vertical'}
                    size={18}
                    onPress={() => menuRef.current.show()}
                  />
                }>
                <MenuItem
                  onPress={() => {
                    menuRef.current.hide();
                  }}>
                  Remove User
                </MenuItem>
                <MenuItem
                  onPress={() => {
                    menuRef.current.hide();
                  }}>
                  Block User
                </MenuItem>
                <MenuItem
                  onPress={() => {
                    menuRef.current.hide();
                  }}>
                  Make Admin
                </MenuItem>
              </Menu>
            ) : null}
          </Right>
        </ListItem>
        <Divider
          style={{
            backgroundColor: '#c0c0c0',
            marginTop: 10,
            marginLeft: width - (width - 50),
          }}
        />
      </>
  );
};

export default UserListItem;
