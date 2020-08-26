import React, {useContext, useEffect, useState, useMemo} from 'react';
import Modal from 'react-native-modal';
import {Text, Content} from 'native-base';
import {greenTheme, orangeTheme, dividerColor} from '../types/color';
import {View, StyleSheet, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Divider, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from './Avatar';
import {AuthContext} from '../AuthProvider';
import { userDataContext } from '../UserDataProvider';
import { cancelRequest } from '../types/utils';

export default function UserModalScreen({person, isVisible, onClose}) {
  const { user} = useContext(AuthContext);
  const { contacts, checkUser, checkSent, requestSent } = useContext(userDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null)
  
  const inContact = useMemo(() => {
      if(selectedUser){
        return checkUser(selectedUser._id)
      }
      
  } ,[selectedUser, requestSent])
  const inSent = useMemo(() => {
    if(selectedUser){
      return checkSent(selectedUser._id)
    }      
  } ,[selectedUser, requestSent])
  console.log(person)
  useEffect(() => setSelectedUser(person), [person]);

  const sendRequest = async () => {
    setIsLoading(true)
    await firestore().collection('users')
     .doc(selectedUser._id) 
     .collection('requests_recieved')
     .doc(user.uid)
     .set({
       userRef: firestore().collection('users').doc(user.uid)
     })
    await firestore().collection('users')
     .doc(user.uid)
     .collection('request_sent')
     .doc(selectedUser._id)
     .set(
       {
         userRef: firestore().collection('users').doc(selectedUser._id)
       }
     )
     setIsLoading(false)
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      useNativeDriver
      animationIn={'zoomIn'}
      propagateSwipe>
      <View style={style.centerContent}>
        <View style={style.userContainer}>
          {selectedUser ? (
            <Content>
              <View style={style.headerItem}>
                <Text style={{fontWeight: 'bold'}}>User Info</Text>
                <Icon name="close-outline" size={30} color="red" onPress={onClose} />
              </View>
              <View style={style.viewItem}>
                <Avatar source={{uri: selectedUser.photoURL || selectedUser.avatar}} size={'medium'} />
                <View style={{margin: 20}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 25,
                      marginBottom: 2,
                    }}>
                    {selectedUser.displayName || selectedUser.name}
                  </Text>
                  <Text style={{color: 'grey', fontSize: 13}}>last seen</Text>
                  {!inContact && selectedUser._id !== user.uid ? 
                   !inSent ? (
                    <Button
                      buttonStyle={{borderRadius:18, borderWidth:1}}
                      type="outline"
                      icon={<Icon name="paper-plane" size={15} color="blue" />}
                      titleStyle={{fontSize: 14, marginLeft: 5}}
                      title="Send request"
                      onPress={() => sendRequest()}
                      loading={isLoading}
                    />
                  ) :
                  (
                    <View style={{flexDirection:"row"}}>
                      <Button
                      type="clear"
                      titleStyle={{fontSize: 14, marginLeft: 5}}
                      title="Pending..."
                      disabled
                      disabledTitleStyle={{color:"grey"}}
                    />
                    <Button
                      type="clear"
                      titleStyle={{fontSize: 14, marginLeft: 5, color:"red"}}
                      title="Cancel"
                      onPress={()=> cancelRequest(user.uid, selectedUser._id)}
                    />
                    </View>
                  ) 
                   : null}
                </View>
              </View>
              <Divider style={{backgroundColor: dividerColor, height: 1}} />
              {selectedUser.about ? (
                <ListItem
                  title={'Bio'}
                  leftIcon={
                    <Icon
                      name={'alert-circle-outline'}
                      size={24}
                      color={greenTheme}
                    />
                  }
                  subtitle={selectedUser.about}
                />
              ) : null}
              {selectedUser.phoneNumber ? (
                <ListItem
                  title={'Mobile Number'}
                  leftIcon={
                    <Icon name={'call-outline'} size={24} color={greenTheme} />
                  }
                  subtitle={selectedUser.phoneNumber}
                  subtitleStyle={style.subtitle}
                />
              ) : null}
              <ListItem
                title={'Location'}
                leftIcon={
                  <Icon
                    name={'location-outline'}
                    size={24}
                    color={greenTheme}
                  />
                }
                subtitle={'everywhere'}
                subtitleStyle={style.subtitle}
              />
            </Content>
          ) : (
            <Text>No User Found?</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
const style = StyleSheet.create({
  centerContent: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '95%',
  },
  userContainer: {
    backgroundColor: 'white',
    borderRadius:20,
    padding: 20,
    height: Dimensions.get('window').height * 0.8,
  },
  headerItem: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent:"space-between"
  },
  viewItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 12,
  },
});
