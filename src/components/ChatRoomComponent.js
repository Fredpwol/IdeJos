import React, {Component} from 'react';
import {Container} from 'native-base';
import {Text, Icon} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Composer,
  Actions,
} from 'react-native-gifted-chat';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
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
import {AuthContext} from '../AuthProvider';
import {orangeTheme, greenTheme} from '../types/color';
// import Firebase from '../../components/Firebase';
import firestore from '@react-native-firebase/firestore';
import UserModalScreen from './UserModalScreen';
import {userDataContext} from '../UserDataProvider';

class ChatRoomComponent extends Component {
  constructor(props) {
    super();
    const { UIManager } = NativeModules;
    this.state = {
      messages: props.messages,
      isVisible: false,
      load: false,
      user: null,
      userData: null,
      lastVisible: null,
      emojiVisible: false,
      refreshing: false,
      selectedUser: null,
      text: null,
    };
    UIManager.setLayoutAnimationEnabledExperimental && 
    UIManager.setLayoutAnimationEnabledExperimental(true);

  }

  handleSend = () => null;
  loadEarlierMessages = () => null;

  renderActions = ({props}) => (
    <Actions
      {...props}
      icon={() => (
        <Icon
          type="font-awesome"
          name="smile-o"
          size={25}
          color={orangeTheme}
          onPress={() => {
            LayoutAnimation.spring();
            Keyboard.dismiss();
            this.setState({...this.state, emojiVisible: !this.state.emojiVisible});
          }}
        />
      )}
    />
  );

  renderInputToolbar = (props) => {
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

  renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: '#f5f5f5',
        width: Dimensions.get('window').width - 20,
        borderRadius: 50,
        paddingHorizontal: 35,
        marginRight: 20,
      }}
    />
  );

  renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <Icon name="send" size={32} color={orangeTheme} />
        </View>
      </Send>
    );
  };

  renderTicks = (message) => {
    if (message.user._id === user.uid) {
      if (message.sent) {
        return (
          <Ionicons
            name="checkmark"
            color="white"
            style={{marginHorizontal: 10}}
          />
        );
      }
      if (message.received) {
        return (
          <Ionicons
            name="checkmark-done"
            color="white"
            style={{marginHorizontal: 10}}
          />
        );
      }
    }
  };

  renderBubble = (props) => {
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: orangeTheme,
              zIndex: 15,
              borderStartWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#c0c0c0',
            },
            left: {
              backgroundColor: '#f5f5f5',
              zIndex: 15,
              borderStartWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#c0c0c0',
            },
          }}
          renderTicks={renderTicks}
        />
      </View>
    );
  };
  renderScrolltoBottom = (props) => {
    return (
      <View style={styles.bottomComponentContainer}>
        <Icon type="font-awesome" name="angle-double-down" size={24} />
      </View>
    );
  };

  toggleVisible = () => setisVisible((isVisible) => !isVisible);

  render() {
    return (
      <AuthContext.Consumer>
        {(auth) => (
          <userDataContext.Consumer>
            {(userData) => {
              this.setState({
                ...this.state,
                user: auth.user,
                userData: userData.userData,
              });
              return (
                <Container>
                  <UserModalScreen
                    person={this.state.selectedUser}
                    isVisible={this.state.isVisible}
                    onClose={this.state.toggleVisible}
                  />
                  <GiftedChat
                    ref={this.chatlist}
                    messages={this.state.messages}
                    onSend={(newMessage) => this.handleSend(newMessage)}
                    loadEarlier={this.state.load}
                    isLoadingEarlier={this.state.refreshing}
                    text={this.state.text}
                    onLoadEarlier={this.loadEarlierMessages}
                    user={{
                      _id: user.uid,
                      name: user.displayName,
                      avatar: user.photoURL,
                    }}
                    showAvatarForEveryMessage
                    renderUsernameOnMessage
                    renderBubble={this.renderBubble}
                    renderSend={this.renderSend}
                    renderInputToolbar={this.renderInputToolbar}
                    onPressAvatar={(user) => {
                      this.toggleVisible();
                      this.setState({...this.state, selectedUser: user});
                    }}
                    renderComposer={this.renderComposer}
                    messagesContainerStyle={{
                      paddingBottom: 20,
                      backgroundColor: 'white',
                    }}
                    bottomOffset={10}
                    scrollToBottom
                    isAnimated
                    textInputProps={{onFocus: () => this.setState({...this.state, emojiVisible: false})}}
                    onInputTextChanged={(value) => this.setState({...this.state, text: value})}
                    renderActions={this.renderActions}
                    maxComposerHeight={100}
                    keyboardShouldPersistTaps="handled"
                    scrollToBottomComponent={this.renderScrolltoBottom}
                  />
                  {this.state.emojiVisible ? (
                    <View style={{height: 300, marginTop: 20}}>
                      <EmojiSelector
                        columns={12}
                        showSearchBar={false}
                        theme={orangeTheme}
                        category={Categories.emotion}
                        onEmojiSelected={(emoji) =>
                          this.setState({...this.state, text: this.state.text + emoji})
                        }
                      />
                      {text !== '' ? (
                        <Ionicons
                          name="backspace-outline"
                          color={orangeTheme}
                          onPress={() =>
                            this.setState({...this.state, text: this.state.text.slice(0, this.state.text.length-1) })
                          }
                          size={35}
                          style={{right: 10, bottom: 10, position: 'absolute'}}
                        />
                      ) : null}
                    </View>
                  ) : null}
                </Container>
              );
            }}
          </userDataContext.Consumer>
        )}
      </AuthContext.Consumer>
    );
  }
}

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
export default ChatRoomComponent;
