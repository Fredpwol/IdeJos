import React,{ useState, useEffect, useContext} from 'react';
import {Container} from 'native-base';
import {Text, Icon} from 'react-native-elements';
import {GiftedChat, Bubble, Send, InputToolbar, Composer} from 'react-native-gifted-chat';
import {View, StyleSheet, KeyboardAvoidingView, Dimensions} from 'react-native';
import {AuthContext} from '../../AuthProvider';
import {orangeTheme} from '../../types/color';
// import Firebase from '../../components/Firebase';
import firestore from '@react-native-firebase/firestore';
import UserModalScreen from '../../components/UserModalScreen';
import { userDataContext } from '../../UserDataProvider';

const ChatRoom = ({route, navigation}) => {
  const {user} = useContext(AuthContext);
  const { userData } = useContext(userDataContext)
  const [messages, setMessages] = useState([]);
  const group = route.params.group;
  const [selectedUser, setselectedUser] = useState(null)
  const [isVisible, setisVisible] = useState(false)
  const toggleVisible = () => setisVisible((isVisible) => !isVisible);


  useEffect(() => {
    const messageSnapshot = firestore()
      .collection('GROUPS')
      .doc(group._id)
      .collection('MESSAGES')
      .orderBy("createdAt","desc")
      .onSnapshot(querySnapshot => {
        firestore().collection('users')
        .doc(user.uid)
        .collection("GROUPS")
        .doc(group._id)
        .get()
        .then(snap => {
          let {latestMessage} = snap.data()
          latestMessage.unread = 0
          firestore().collection('users')
          .doc(user.uid)
          .collection("GROUPS")
          .doc(group._id)
          .set({
            latestMessage
          },{merge:true})
        })
        const messagelist = querySnapshot.docs.map( documentSnapshot => {
          const data = {
            _id:documentSnapshot.id,
            text:"",
            sent: false,
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
          borderTopColor: '#E8E8E8',
          borderTopWidth: 0,
          paddingBottom:5,
          backgroundColor:"white",

        }}
        primaryStyle={{
          backgroundColor:"transparent",
          width:Dimensions.get("window").width - 20
        }}
      />
    );
  };

  const renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor:"#f5f5f5",
        width:Dimensions.get("window").width - 20,
        borderRadius:50,
        paddingLeft:18,
        paddingVertical:16,
        marginRight:20,
      }}
     />
  )

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
    )
  }

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
          avatar:user.photoURL,
        },
        pending:true
      })

  }

  return (
    <Container>
    <UserModalScreen person={selectedUser} isVisible={isVisible} onClose={toggleVisible} />
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{_id: user.uid, name: user.displayName, avatar: user.photoURL, ...userData}}
      showAvatarForEveryMessage
      renderUsernameOnMessage
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderInputToolbar={renderInputToolbar}
      onPressAvatar={(user) => {
        toggleVisible()
        setselectedUser(user)
      } }
      renderComposer={renderComposer}
      messagesContainerStyle={{paddingBottom:20, backgroundColor:"white"}}
      bottomOffset={10}
      scrollToBottom
      maxComposerHeight={100}
      scrollToBottomComponent={renderScrolltoBottom}
    />
    </Container>
  );
};

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    width:60,
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default ChatRoom;
