/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext, useRef} from 'react';
import {Container, Text, H2, Content, ListItem, Left, Right, Body} from 'native-base';
import {AuthContext} from '../../AuthProvider';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, {MenuItem} from 'react-native-material-menu';
import firestore from '@react-native-firebase/firestore';
import {defaultGroupUri, orangeTheme} from '../../types/color';
import {FlatList, TouchableNativeFeedback, ScrollView} from 'react-native-gesture-handler';
// import {} from 'react-native-elements';
import Avatar from '../../components/Avatar';
import {View, StyleSheet} from 'react-native';
import { trim } from '../../types/utils';
import { Badge } from 'react-native-elements';

const HomeScreen = ({navigation, route}) => {
  const {user, logout, setUser} = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const menuRef = useRef();
  const [content, setContent] = useState(null);

  useEffect(() => {
    setContent(null)
    const snapshot = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('GROUPS')
      .orderBy("latestMessage.createdAt","desc")
      .onSnapshot(async (querySnaphot) => {
          const threads = querySnaphot.docs.map(documentSnapshot => {
            let data = {
              _id: documentSnapshot.id,
              name: "",
              system:false,
              latestMessage:{text:"", createdAt:new Date().getTime(), time: new Date().toDateString(), unread:0},
              ...documentSnapshot.data()
            }
            data.name = trim(data.name, 35)
            let pes =""
            if (data.latestMessage?.user){
               pes = data.latestMessage.user._id === user.uid ? "You: ":  `${data.latestMessage.user.name}: `;
            }

            // data.latestMessage.text
            if(data.latestMessage.text.length > 25){
              let msg = pes + data.latestMessage.text
              data.latestMessage.text = msg.slice(0, 26).replace(/\n/g,' ') + '...';
            } 
            else{
              data.latestMessage.text = pes + data.latestMessage.text.replace(/\n/g,' ')
            }
            const padZero = (minute) => (
              "0" + minute.toString()
            )
            let today = new Date();
            let createdAt = new Date(data.latestMessage.createdAt);
            if (createdAt.getUTCDate() === today.getUTCDate()){
              let hour = (createdAt.getUTCHours()+1) % 24;
              let minute = createdAt.getUTCMinutes();
              if (minute < 10){
                minute = padZero(minute)
              }
              else{
                minute = minute.toString();
              }
              data.latestMessage.time = hour.toString() + ':' + minute;
            }
            else if (createdAt.getUTCDate() == (today.getUTCDate() - 1)){
              data.latestMessage.time = "Yesterday";
            }
            else{
              data.latestMessage.time = createdAt.toDateString();
            }
            return data
          })
          if (threads.length === 0){
            setContent((<View style={{alignSelf:"center", justifyContent:"center", flex:3}}>
            <Text style={{color:"gray",}}>Nothing to show here? join a <Text style={{color:"blue"}}>group</Text> to start</Text>
        </View>))
          }
          else{
            setContent(null)
          }
          setGroups(threads)
      })
      console.log(groups)
    return () => snapshot();
  }, []);

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
              }} >
              Create group
            </MenuItem>
            <MenuItem onPress={() => menuRef.current.hide()}>Settings</MenuItem>
          </Menu>
        }
        title={route.params?.title}
        leftComponent={
          <Avatar 
           size={"small"}
           containerStyle={{marginTop:5}}
           source={{uri: user.photoURL}} 
           onPress={() => navigation.navigate('userDetails')} />
        }
      />

          {content}
          <FlatList
            scrollToOverflowEnabled
            data={groups}
            keyExtractor={(item) => item._id}
            renderItem={({item}) =>{
            
             
             return(
              <ListItem avatar onPress={() => navigation.navigate("GroupChat",{group:item})}>
              <Left>
                <Avatar source={{ uri: item.photoURL }}  />
              </Left>
              <Body>
                <Text>{item.name}</Text>
              <Text note><Text note style={{color:orangeTheme}}>{item.latestMessage.text.slice(0,item.latestMessage.text.indexOf(':'))}</Text>{item.latestMessage.text.slice(item.latestMessage.text.indexOf(':'))}</Text>
              </Body>
              <Right>
              <Text note>{item.latestMessage.time}</Text>
              {
                item.latestMessage.unread !== 0 && item.latestMessage.unread !== undefined ? (<Badge status="error" value={item.latestMessage.unread} />) : null
              }
              
              </Right>
            </ListItem>
            )}
          }
          />
    </Container>
  );
};

const style = StyleSheet.create({
  list:{
    height:80
  },
  title:{
    fontSize:20,
  },
  sub:{
    marginTop:5
  }
})
export default HomeScreen;
