/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  Container,
  Text,
  H2,
  Content,
  ListItem,
  Left,
  Right,
  Body,
} from 'native-base';
import {AuthContext} from '../../AuthProvider';
import {BadgeContext} from '../../BadgeCounterProvider';
import {userDataContext} from '../../UserDataProvider';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, {MenuItem} from 'react-native-material-menu';
import firestore from '@react-native-firebase/firestore';
import {defaultGroupUri, orangeTheme} from '../../types/color';
import {
  FlatList,
  TouchableNativeFeedback,
  ScrollView,
} from 'react-native-gesture-handler';
// import {} from 'react-native-elements';
import Avatar from '../../components/Avatar';
import {View, StyleSheet} from 'react-native';
import {trim} from '../../types/utils';
import {Badge} from 'react-native-elements';
import ChatItem from '../../components/ChatItem';

const HomeScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const {settopicCounter} = useContext(BadgeContext);
  const {groups} = useContext(userDataContext);
  const [, setGroups] = useState([]);
  const menuRef = useRef();
  const [content, setContent] = useState(null);

  useEffect(() => {
    setContent(null);
    // if (groups.length === 0) {
    //   setContent(
    //     <View style={{alignSelf: 'center', justifyContent: 'center', flex: 3}}>
    //       <Text style={{color: 'gray'}}>
    //         Nothing to show here? join a{' '}
    //         <Text style={{color: 'blue'}}>group</Text> to start
    //       </Text>
    //     </View>,
    //   );
    // } else {
    //   setContent(null);
    // }
    console.log(groups);
  }, [groups]);

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
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => {
          return (
            <ChatItem
              item={item}
              onPress={() => navigation.navigate('GroupChat', {group: item})} />
          );
        }}
      />
    </Container>
  );
};

const style = StyleSheet.create({
  list: {
    height: 80,
  },
  title: {
    fontSize: 20,
  },
  sub: {
    marginTop: 5,
  },
});
export default HomeScreen;
