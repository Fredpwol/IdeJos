import React, {useState, useContext, useRef, useEffect} from 'react';
import {Container, Text, H2, ListItem, Body, Left, Right} from 'native-base';
import {Badge} from 'react-native-elements';
import {AuthContext} from '../../AuthProvider';
import Header from '../../components/Header';
import Menu, {MenuItem} from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, StyleSheet, FlatList, View} from 'react-native';
import Avatar from '../../components/Avatar';
import {FAB} from 'react-native-paper';
import {greenTheme, orangeTheme} from '../../types/color';
import firestore from '@react-native-firebase/firestore';
import {BadgeContext} from '../../BadgeCounterProvider';
import {userDataContext} from '../../UserDataProvider';
import {trim} from '../../types/utils';
import ChatItem from '../../components/ChatItem';



const Chats = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const {contactsDetails, chats, userInfo, setUserInfo} = useContext(userDataContext);
  const menuRef = useRef();
  const [content, setContent] = useState(null);

  useEffect(() => {
    chats.forEach(data => {
      setUserInfo((prevInfo) => {
        let currData = {...prevInfo};
  
        currData[data._id] = contactsDetails.filter(
          (item) => data._id == item._id,
        )[0];
        return currData;
      });
    })
    
    if (chats.length === 0) {
      setContent(
        <View
          style={{alignSelf: 'center', justifyContent: 'center', flex: 3}}>
          <Text style={{color: 'gray'}}>
            Recent chats will appear here!
          </Text>
        </View>,
      );
    } else {
      setContent(null);
    }
  }, [chats, contactsDetails]);

  return (
    <Container>
      <Header
        rightComponent={
          <Menu
            ref={menuRef}
            button={
              <Icon
                name={'ellipsis-vertical'}
                size={25}
                onPress={() => menuRef.current.show()}
              />
            }>
            <MenuItem
              onPress={() => {
                menuRef.current.hide();
                navigation.navigate('createGroup');
              }}>
              Create group
            </MenuItem>
            <MenuItem onPress={() => menuRef.current.hide()}>Settings</MenuItem>
          </Menu>
        }
        title={route.params?.title}
        leftComponent={
          <Avatar
            size={'small'}
            containerStyle={{marginTop: 5}}
            source={{uri: user.photoURL}}
            onPress={() => navigation.navigate('userDetails')}
          />
        }
      />


      {content}
      <FlatList
        scrollToOverflowEnabled
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (<ChatItem item={item} userInfo={userInfo} onPress={()=> navigation.navigate('userChat', {contact: userInfo[item._id]})
        } />) }
      />
      <FAB
        icon="account"
        color="white"
        style={styles.fab}
        onPress={() => navigation.navigate('contacts')}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 5,
    backgroundColor: greenTheme,
  },
});
export default Chats;
