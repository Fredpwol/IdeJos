import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, FlatList} from 'react-native';
import {Text, Container} from 'native-base';
import {AuthContext} from '../../AuthProvider';
import {userDataContext} from '../../UserDataProvider';
import UserListItem from '../../components/UserListItem';
import Loading from '../../components/Loading';

export default function Contacts({navigation}) {
  const {user} = useContext(AuthContext);
  const {contacts, contactsDetails} = useContext(userDataContext);
  const [userContacts, setuserContacts] = useState([]);

  return (
    <Container>
      <FlatList
        data={contactsDetails}
        keyExtractor={(item, index) => item._id}
        renderItem={({item}) => (
          <UserListItem
            user={item}
            onPress={() => navigation.navigate('userChat', {contact: item})}
          />
        )}
      />
    </Container>
  );
}
