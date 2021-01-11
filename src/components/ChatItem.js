import React, {useState, useContext, useRef, useEffect} from 'react';
import {Container, Text, H2, ListItem, Body, Left, Right} from 'native-base';
import {greenTheme, orangeTheme} from '../types/color';
import {Badge} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../AuthProvider';
import {Button, StyleSheet, FlatList, View} from 'react-native';
import Avatar from './Avatar'


export default  userListItem =({item, userInfo, onPress}) => {
    const {user} = useContext(AuthContext)
    const [status, setStatus] = useState(null);
    useEffect(() => {
      if (item.latestMessage.user !== undefined){
        if (user.uid === item.latestMessage.user._id){
          if (item.latestMessage.sent){
            setStatus(<Icon name="checkmark" size={15} color={greenTheme} />)
          }
          if (item.latestMessage.received){
            setStatus(<Icon name="checkmark-done" size={15} color={greenTheme} />)
          }
        }
      }

    },[item.latestMessage])
  
    
    return (
      <ListItem
        avatar
        onPress={onPress}>
        <Left>
          <Avatar source={{uri: item.photoURL || userInfo[item._id]?.photoURL}} />
        </Left>
        <Body>
          <Text>{item.name || userInfo[item._id]?.displayName}</Text>
          <Text note>
            <Text note style={{color: orangeTheme}}>
              {item.latestMessage.text.slice(
                0,
                item.latestMessage.text.indexOf(':'),
              )}
            </Text>
            {item.latestMessage.text.slice(
              item.latestMessage.text.indexOf(':'),
            )}
          </Text>
        </Body>
        <Right>
          <View style={{flexDirection: 'row'}}>
            {status}
            <Text note>  {item.latestMessage.time}</Text>
          </View>
          {item.latestMessage.unread !== 0 &&
          item.latestMessage.unread !== undefined ? (
            <Badge status="error" value={item.latestMessage.unread} />
          ) : null}
        </Right>
      </ListItem>
    );
  
  }
  