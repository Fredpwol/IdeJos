import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Container } from 'native-base';
import { AuthContext } from '../../AuthProvider';
import { userDataContext } from '../../UserDataProvider';
import UserListItem from '../../components/UserListItem';
import Loading from '../../components/Loading';

export default function Contacts({navigation}){
    const { user } = useContext(AuthContext)
    const { contacts } = useContext(userDataContext);
    const [userContacts, setuserContacts] = useState([]);
    useEffect(
        () => {
        setuserContacts([])
        contacts.forEach(async (element) => {
            const {_id , userRef} = element;
            const userData = await userRef.get()
            const {photoURL, displayName} = userData.data()
            setuserContacts( prevUsers => [...prevUsers, {_id, photoURL, displayName} ])
        });
        }
        ,[])
    
    return (
        <Container>
            {userContacts.length == 0 ?
            (<Loading />)
            :
            (
                <FlatList
                data={userContacts}
                keyExtractor={(item, index) => item._id}
                renderItem={({item}) => (
                    <UserListItem user={item} onPress={() => navigation.navigate('userChat', {contact:item})} />
                )} />
            )
            }
           
        </Container>
    )
}