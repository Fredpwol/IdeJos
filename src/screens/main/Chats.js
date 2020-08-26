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
import {trim} from '../../types/utils';

const Chats = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const menuRef = useRef();
  const [chats, setChats] = useState([]);
  const [content, setContent] = useState(null);
  const [userInfo, setuserInfo] = useState({});
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('CHATS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(async (querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          var data = {
            _id: documentSnapshot.id,
            name: '',
            system: false,
            latestMessage: {
              text: '',
              createdAt: new Date().getTime(),
              time: new Date().toDateString(),
              unread: 0,
            },
            ...documentSnapshot.data(),
          };
          console.log(data.latestMessage);
          data.name = trim(data.name, 25);
          let pes = '';
          if (data.latestMessage?.user) {
            pes =
              data.latestMessage.user._id === user.uid
                ? 'You: '
                : `${data.latestMessage.user.name}: `;
          }
          let sentIcon = null;
          if (data.latestMessage.sent) {
            sentIcon = <Icon name="checkmark" color="black" size={20} />;
            setStatus(sentIcon);
          }
          if (data.latestMessage.recieved) {
            sentIcon = <Icon name="checkmark-done" color="black" />;
            setStatus(sentIcon);
          }
          setStatus(sentIcon);
          // data.latestMessage.text
          if (data.latestMessage.text.length > 25) {
            let msg = pes + data.latestMessage.text;
            data.latestMessage.text =
              msg.slice(0, 26).replace(/\n/g, ' ') + '...';
          } else {
            data.latestMessage.text =
              pes + data.latestMessage.text.replace(/\n/g, ' ');
          }
          const padZero = (minute) => '0' + minute.toString();
          let today = new Date();
          let createdAt = new Date(data.latestMessage.createdAt);
          if (createdAt.getUTCDate() === today.getUTCDate()) {
            let hour = (createdAt.getUTCHours() + 1) % 24;
            let minute = createdAt.getUTCMinutes();
            if (minute < 10) {
              minute = padZero(minute);
            } else {
              minute = minute.toString();
            }
            data.latestMessage.time = hour.toString() + ':' + minute;
          } else if (createdAt.getUTCDate() == today.getUTCDate() - 1) {
            data.latestMessage.time = 'Yesterday';
          } else {
            data.latestMessage.time = createdAt.toDateString();
          }
          return data;
        });
        if (threads.length === 0) {
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
        setChats(threads);
      });
    const unsubscribeUserInfo = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('CHATS')
      .onSnapshot((snap) => {
        snap.forEach(async (doc) => {
          var id = doc.id;
          const usersnap = await firestore()
            .collection('users')
            .doc(doc.id)
            .get();
          const {displayName, photoURL} = usersnap.data();
          setuserInfo((prevInfo) => {
            let data = {...prevInfo};
            data[id] = {_id: id, displayName, photoURL};
            return data;
          });
        });
      });
    return () => [unsubscribe(), unsubscribeUserInfo()];
  }, []);

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
        renderItem={({item}) => {
          console.log('info', userInfo);

          return (
            <ListItem
              avatar
              onPress={() =>
                navigation.navigate('userChat', {contact: userInfo[item._id]})
              }>
              <Left>
                <Avatar source={{uri: userInfo[item._id]?.photoURL}} />
              </Left>
              <Body>
                <Text>{userInfo[item._id]?.displayName}</Text>
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
                  <Text note>{item.latestMessage.time}</Text>
                </View>
                {item.latestMessage.unread !== 0 &&
                item.latestMessage.unread !== undefined ? (
                  <Badge status="error" value={item.latestMessage.unread} />
                ) : null}
              </Right>
            </ListItem>
          );
        }}
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
