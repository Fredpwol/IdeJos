import * as React from 'react';
import {Container} from 'native-base';
import {Text} from 'react-native-elements';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import {View, StyleSheet} from 'react-native';
import {AuthContext} from '../../AuthProvider';
import {orangeTheme} from '../../types/color';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const ChatRoom = ({route, navigation}) => {
  const {user} = React.useContext(AuthContext);
  const [messages, setMessages] = React.useState([]);
  const group = route.params.group;

  React.useEffect(() => {
    const messageSnapshot = firestore()
      .collection('GROUPS')
      .doc(group._id)
      .collection('MESSAGES')
      .orderBy("createdAt","desc")
      .onSnapshot(querySnapshot => {
        const messagelist = querySnapshot.docs.map( documentSnapshot => {
          const data = {
            _id:documentSnapshot.id,
            text:"",
            createdAt:new Date().getTime(),
            ...documentSnapshot.data()

          }
          return data;
        })
        setMessages(messagelist);
      })
      return () => messageSnapshot()
  }, []);

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'white',
          borderTopColor: '#E8E8E8',
          borderRadius: 60,
          borderTopWidth: 2,
          padding: 6,
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={style.sendingContainer}>
          <Icon name="send" size={32} color={orangeTheme} />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: orangeTheme,
            },
            left: {
              backgroundColor: '#d4d4d4',
            },
          }}
        />
      </View>
    );
  };

  // helper method that is sends a message
  function handleSend(newMessage = []) {
    const text = newMessage[0].text;

    firestore()
     .collection("GROUPS")
     .doc(group._id)
     .collection("MESSAGES")
     .add({
       text,
       createdAt: new Date().getTime(),
       user:{
         _id: user.uid,
         name:user.displayName,
         avatar:user.photoURL
       }
     })
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{_id: user.uid, name: user.displayName, avatar: user.photoURL}}
      showUserAvatar
      alwaysShowSend
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderInputToolbar={renderInputToolbar}
    />
  );
};

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ChatRoom;
