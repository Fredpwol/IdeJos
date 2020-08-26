import React, {useState, useEffect, useContext} from 'react';
import {Container} from 'native-base';
import {Text, Icon} from 'react-native-elements';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import {View, StyleSheet, KeyboardAvoidingView, Dimensions} from 'react-native';
import {AuthContext} from '../../AuthProvider';
import {orangeTheme} from '../../types/color';
// import Firebase from '../../components/Firebase';
import firestore from '@react-native-firebase/firestore';

const ChatRoom = ({route, navigation}) => {
  const {user} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const contact = route.params.contact;
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const messageSnapshot = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('CHATS')
      .doc(contact._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {

        const messagelist = querySnapshot.docs.map((documentSnapshot) => {
          const data = {
            _id: documentSnapshot.id,
            text: '',
            sent: false,
            createdAt: new Date().getTime(),
            ...documentSnapshot.data(),
          };
          if (user.uid !== data.user._id){
            firestore().collection('users')
            .doc(contact._id)
            .collection('CHATS')
            .doc(user.uid)
            .collection('MESSAGES')
            .doc(data._id)
            .set(
              {
                received:true
              }
              ,{merge:true}
            ).then(() => {
              firestore().collection('users')
            .doc(contact._id)
            .collection('CHATS')
            .doc(user.uid)
            .update(
              {
                "latestMessage.received": true
              }
            )
            })
            
          }
          return data;
        });
        if (messagelist.length !== 0){
          firestore()
          .collection('users')
          .doc(user.uid)
          .collection('CHATS')
          .doc(contact._id)
          .update({
            "latestMessage.unread":0
          })
          .catch(error=>{
            console.log(error)
          })
        }
        setMessages(messagelist);
        setEmpty(false)
      });
    return () => messageSnapshot();
  }, []);

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopColor: '#E8E8E8',
          borderTopWidth: 0,
          paddingBottom: 5,
          backgroundColor: 'white',
        }}
        primaryStyle={{
          backgroundColor: 'transparent',
          width: Dimensions.get('window').width - 20,
        }}
      />
    );
  };

  const renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: '#f5f5f5',
        width: Dimensions.get('window').width - 20,
        borderRadius: 50,
        paddingLeft: 18,
        paddingVertical: 16,
        marginRight: 20,
      }}
    />
  );

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
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
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </View>
    );
  };
  const renderScrolltoBottom = (props) => {
    return (
      <View style={styles.bottomComponentContainer}>
        <Icon type="font-awesome" name="angle-double-down" size={24} />
      </View>
    );
  };

  // helper method that is sends a message
  async function handleSend(newMessage = []) {
    const text = newMessage[0].text;
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('CHATS')
      .doc(contact._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
        },
        pending: true,
        source: true,
        received:false,
        unread:0
      });
  }
  function renderChatEmpty(props) {
    if (empty) return null
    return (
      <View
        style={{alignSelf: 'center', justifyContent: 'center', flex: 1, rotation:-180}}
        {...props}>
        <Icon type="font-awesome" name="comments" size={50} color={'#d5d5d5'} />
        <Text style={{fontWeight: 'bold', opacity:0.7, transform:[{rotateY:"180deg"}]}}>No Messages Sent, yet.</Text>
      </View>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{_id: user.uid, name: user.displayName, avatar: user.photoURL}}
      showAvatarForEveryMessage
      renderUsernameOnMessage
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderInputToolbar={renderInputToolbar}
      renderComposer={renderComposer}
      messagesContainerStyle={{paddingBottom: 20, backgroundColor:"white"}}
      bottomOffset={10}
      scrollToBottom
      renderChatEmpty={renderChatEmpty}
      maxComposerHeight={100}
      scrollToBottomComponent={renderScrolltoBottom}
    />
  );
};

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 60,
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ChatRoom;
