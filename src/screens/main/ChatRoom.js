import React, {useState, useEffect, useContext, useRef} from 'react';
import {Container} from 'native-base';
import {Text, Icon} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  NativeModules,
  View,
  LayoutAnimation,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {AuthContext} from '../../AuthProvider';
import {orangeTheme, greenTheme} from '../../types/color';
// import Firebase from '../../components/Firebase';
import firestore from '@react-native-firebase/firestore';
import UserModalScreen from '../../components/UserModalScreen';
import {userDataContext} from '../../UserDataProvider';
import ChatRoomComponent from '../../components/ChatRoomComponent';

class ChatRoom extends ChatRoomComponent{

  constructor({navigation, route}){
    this.group = route.params.group
  }

  componentDidMount(){
    this.messageSnapshot = firestore()
    .collection('GROUPS')
    .doc(this.group._id)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .limit(35)
    .onSnapshot((querySnapshot) => {
      firestore()
        .collection('users')
        .doc(this.state.user.uid)
        .collection('GROUPS')
        .doc(this.group._id)
        .get()
        .then((snap) => {
          let {latestMessage} = snap.data();
          latestMessage.unread = 0;
          firestore()
            .collection('users')
            .doc(this.state.user.uid)
            .collection('GROUPS')
            .doc(this.group._id)
            .set(
              {
                latestMessage,
              },
              {merge: true},
            );
        });
      let messagelist = querySnapshot.docs.map((documentSnapshot) => {
        let data = {
          _id: documentSnapshot.id,
          text: '',
          sent: false,
          createdAt: new Date().getTime(),
          ...documentSnapshot.data(),
        };
        if(data.user){
          firestore().collection('users').doc(data.user._id).get().then(doc =>{
            data.user.avatar = doc.data().photoURL;
          })    
        }
     
        return data;
      });
      if (messagelist.length >= 35) this.setState({...this.state, load: true});
      this.setState({...this.state, lastVisible: messagelist[messagelist.length - 1].createdAt})
      this.setState({...this.state, messages: messagelist})
    });
  }

  componentWillUnmount(){
    return this.messageSnapshot()
  }


  loadEarlierMessages = async () => {
    try {
      setRefreshing(true);
      const messageSnapshot = await firestore()
        .collection('GROUPS')
        .doc(this.group._id)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .startAfter(this.state.lastVisible)
        .limit(35)
        .get();
      const messagelist = messageSnapshot.docs.map((documentSnapshot) => {
        let data = {
          _id: documentSnapshot.id,
          text: '',
          sent: false,
          createdAt: new Date().getTime(),
          ...documentSnapshot.data(),
        };
        return data;
      });
      this.setState({...this.state, lastVisible: messagelist[messagelist.length - 1].createdAt})
      this.setState({...this.state, messages: [...this.state.messages, ...messagelist]})
      this.setState({...this.state, refreshing: false})
    } catch {
      this.setState({...this.state, refreshing: false})
      ToastAndroid.show('Error while loading messages!', ToastAndroid.LONG);
    }
  };

  handleSend(newMessage = []) {
    const text = newMessage[0].text;
    firestore()
      .collection('GROUPS')
      .doc(this.group._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: this.state.user.uid,
          name: this.state.user.displayName,
          avatar: user.state.photoURL,
          ...this.state.userData,
        },
        pending: true,
      });
  }


}

export default ChatRoom;
