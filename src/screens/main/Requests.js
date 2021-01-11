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
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, {MenuItem} from 'react-native-material-menu';
import {defaultGroupUri, dividerColor} from '../../types/color';
// import {} from 'react-native-elements';
import Avatar from '../../components/Avatar';
import {View, StyleSheet, SectionList} from 'react-native';
import {userDataContext} from '../../UserDataProvider';
import {Button} from 'react-native-elements';
import { deleteRequest, cancelRequest, confirmRequest } from '../../types/utils';

function ListItemDisplay({item, section}) {
  const {user} = useContext(AuthContext)
  const [pic, setPic] = useState(null);
  const [name, setName] = useState('');
  const [uid, setUid] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      const userData = await item.userRef.get();
      const id = userData.id;
      const {photoURL, displayName} = userData.data();
      setUid(id);
      setName(displayName);
      setPic(photoURL);
    };
    console.log(section);
    fetchData();
  }, [item]);
  return (
    <ListItem avatar>
      <Left>
        <Avatar source={{uri: pic}} />
      </Left>
      <Body>
        <Text>{name}</Text>
        {section.title == 'Request Sent' ? (
          <Button
            buttonStyle={style.cancelButtonStyle}
            title="Cancel"
            onPress={async () => await cancelRequest(user.uid, uid)}
            titleStyle={{color: 'white'}}
          />
        ) : (
          <View style={{flexDirection: 'row', alignContent:"space-between"}}>
            <Button
              type="clear"
              buttonStyle={{
                ...style.cancelButtonStyle,
                backgroundColor: 'white',
              }}
              title="Confirm"
              titleStyle={{color: 'blue'}}
              onPress={async () => await confirmRequest(user.uid, uid) }
            />
            <Button
              type="clear"
              buttonStyle={style.cancelButtonStyle}
              title="Delete"
              onPress={async () => await deleteRequest(user.uid, uid)}
              titleStyle={{color: 'white'}}
            />
          </View>
        )}
      </Body>
    </ListItem>
  );
}

const Request = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const {requestSent, requestRecieved} = useContext(userDataContext);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const request = [
        {title: 'Request Sent', data: requestSent},
        {title: 'Friend Request', data: requestRecieved},
      ];
      setRequests(request)
  },[requestSent, requestRecieved])
 
  const menuRef = useRef();
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

      <SectionList
        sections={requests}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, section}) => (
          <ListItemDisplay item={item} section={section} />
        )}
        renderSectionHeader={({section: {title}}) => (
          <View style={style.divider}>
            <Text>{title}</Text>
          </View>
        )}
      />
    </Container>
  );
};
const style = StyleSheet.create({
  divider: {
    backgroundColor: dividerColor,
    height: 30,
    justifyContent: 'center',
    padding: 10,
    marginBottom:10
  },
  cancelButtonStyle: {
    marginTop: 10,
    width: 80,
    height: 30,
    backgroundColor: 'red',
  },
});
export default Request;
