import React, {useState, useContext, useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, TouchableNativeFeedback} from 'react-native';
import {trim} from '../../types/utils';

//----------------------Componenets--------------------------//
import Avatar from '../../components/Avatar';

//-----------------------SCREENS-----------------------------//
import AddDetail from '../auth/AddDetail';
import userChatRoom from './userChatRoom';
import Explore from './Explore';
import {orangeTheme, greenTheme} from '../../types/color';
import CreateGroup from './CreateGroup';
import ChatRoom from './ChatRoom';
import {MainStack} from '../../../App';
import UserDetails from './UserDetails';
import {userDataContext, UserDataProvider} from '../../UserDataProvider';
import {AuthContext} from '../../AuthProvider';
import Contacts from './Contacts';
import {BadgeContext} from '../../BadgeCounterProvider';

const Stack = createStackNavigator();

export default function HomeStack(props) {
  const {initialRoute, user} = useContext(AuthContext);
  const {setrequestCounter, setchatCounter, settopicCounter} = useContext(
    BadgeContext,
  );
  const {
    setContacts,
    setRequestSent,
    setRequestRecieved,
    setUserData,
    setContactsDetails,
    setChats,
    setGroups,
  } = useContext(userDataContext);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('CONTACTS')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((docs) => {
          const data = {
            _id: docs.id,
            ...docs.data(),
          };
          return data;
        });
        setContacts(threads);
      });

    const sentUnsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('request_sent')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((docs) => {
          const data = {
            _id: docs.id,
            ...docs.data(),
          };
          return data;
        });
        setRequestSent(threads);
      });

    const recievedUnsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('requests_recieved')
      .onSnapshot((querySnapshot) => {
        var sum = 0;
        const threads = querySnapshot.docs.map((docs) => {
          const data = {
            _id: docs.id,
            ...docs.data(),
          };
          sum += 1;
          return data;
        });
        setrequestCounter(sum);
        setRequestRecieved(threads);
      });

    const userDataUnsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((docSnapshot) => {
        setUserData({...docSnapshot.data()});
      });

    const contactDetailUnsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('CONTACTS')
      .onSnapshot((querySnapshot) => {
        setContactsDetails([]);
        querySnapshot.docs.map(async (docs) => {
          const data = {
            _id: docs.id,
            ...docs.data(),
          };
          const snap = await data.userRef.get();
          setContactsDetails((prev) => [
            ...prev,
            {_id: docs.id, ...snap.data()},
          ]);
        });
      });

    const groupUnsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('GROUPS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(async (querySnaphot) => {
        let totalSum = 0;
        const threads = querySnaphot.docs.map((documentSnapshot) => {
          let data = {
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
          totalSum += data.latestMessage.unread;
          data.name = trim(data.name, 35);
          let pes = '';
          if (data.latestMessage?.user) {
            pes =
              data.latestMessage.user._id === user.uid
                ? 'You: '
                : `${data.latestMessage.user.name}: `;
          }

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
        settopicCounter(totalSum);
        setGroups(threads);
      });

    const chatUnsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('CHATS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(async (querySnapshot) => {
        let totalSum = 0;
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
          totalSum += data.latestMessage.unread;
          console.log(data.latestMessage);
          data.name = trim(data.name, 25);
          let pes = '';
          if (data.latestMessage?.user) {
            pes =
              data.latestMessage.user._id === user.uid
                ? 'You: '
                : `${data.latestMessage.user.name}: `;
          }

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
        setchatCounter(totalSum);
        setChats(threads);
      });

    // Fetch the current user's ID from Firebase Authentication.
    var uid = auth().currentUser.uid;

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    var userStatusDatabaseRef = database().ref('/status/' + uid);

    // We'll create two constants which we will write to
    // the Realtime database when this device is offline
    // or online.
    var isOfflineForDatabase = {
      state: 'offline',
      last_changed: database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
      state: 'online',
      last_changed: database.ServerValue.TIMESTAMP,
    };

    
    var userStatusFirestoreRef = firestore().collection('status').doc(uid);

    // Firestore uses a different server timestamp value, so we'll
    // create two more constants for Firestore state.
    var isOfflineForFirestore = {
      state: 'offline',
      last_changed: new firestore.Timestamp.now(),
    };

    var isOnlineForFirestore = {
      state: 'online',
      last_changed: new firestore.Timestamp.now(),
    };

    database()
      .ref('.info/connected')
      .on('value', function (snapshot) {
        if (snapshot.val() == false) {
          // Instead of simply returning, we'll also set Firestore's state
          // to 'offline'. This ensures that our Firestore cache is aware
          // of the switch to 'offline.'
          userStatusFirestoreRef.set(isOfflineForFirestore);
          return;
        }

        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(function () {
            userStatusDatabaseRef.set(isOnlineForDatabase);

            // We'll also add Firestore set here for when we come online.
            userStatusFirestoreRef.set(isOnlineForFirestore);
          });
      });
    return () => [
      unsubscribe(),
      sentUnsubscribe(),
      recievedUnsubscribe(),
      userDataUnsubscribe(),
      contactDetailUnsubscribe(),
      chatUnsubscribe(),
      groupUnsubscribe(),
    ];
  }, []);
  return initialRoute === 'addDetail' ? (
    <Stack.Navigator
      {...props}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'addDetail'} component={AddDetail} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'main'}>
      <Stack.Screen name={'main'} component={MainStack} />
      <Stack.Screen name={'createGroup'} component={CreateGroup} />
      <Stack.Screen
        name={'userDetails'}
        component={UserDetails}
        options={{
          headerShown: true,
          title: 'Me',
        }}
      />
      <Stack.Screen
        name="userChat"
        component={userChatRoom}
        options={({navigation, route}) => ({
          headerShown: true,
          title: route.params.contact.displayName,
          headerLeft: ({onPress}) => (
            <TouchableNativeFeedback onPress={onPress}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="arrow-back" size={24} style={{paddingTop: 5}} />
                <Avatar
                  source={{uri: route.params.contact.photoURL}}
                  style={{width: 40, height: 40, borderRadius: 20}}
                  onPress={onPress}
                />
              </View>
            </TouchableNativeFeedback>
          ),
        })}
      />
      <Stack.Screen
        name={'contacts'}
        component={Contacts}
        options={{
          headerShown: true,
          title: 'Contacts',
        }}
      />
    </Stack.Navigator>
  );
}
