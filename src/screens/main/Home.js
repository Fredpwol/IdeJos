/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Container, Text, H2, Content} from 'native-base';
import {AuthContext} from '../../AuthProvider';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, {MenuItem} from 'react-native-material-menu';
import firestore from '@react-native-firebase/firestore';
import {defaultGroupUri} from '../../types/color';
import {FlatList, TouchableNativeFeedback, ScrollView} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';
import Avatar from '../../components/Avatar';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

const HomeScreen = ({navigation, route}) => {
  const {user, logout, setUser} = React.useContext(AuthContext);
  const [groups, setGroups] = React.useState([]);
  const menuRef = React.useRef();
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    if (groups.length !== 0){
      setGroups([])
      setContent(null)
    }
   
    const snapshot = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('GROUPS')
      .onSnapshot(async (querySnaphot) => {
       querySnaphot.forEach((documentSnapshot) => {
          documentSnapshot.data()
          .groupRef
          .get()
          .then(groupDocumentSnapshot => {
            const data = {
              _id: documentSnapshot.id,
              name: '',
              photoURL: defaultGroupUri,
              ...groupDocumentSnapshot.data()
            };
            setGroups(prevGroups => [...prevGroups, data])
        })
      })
        
      });
      // console.log(groups)
      //   if (groups.length === 0){
      //     setContent((<View style={{paddingVertical:"60%", paddingHorizontal:"10%"}}>
      //     <Text style={{color:"gray",}}>Nothing to show here? join a <Text style={{color:"blue"}}>group</Text> to start</Text>
      // </View>))
      //   }
      //   else{
      //     setContent(null)
      //   }
    return () => snapshot();
  }, []);

  return (
    <Container>
      <Header
        leftComponent={
          <Menu
            ref={menuRef}
            button={
              <Icon
                name={'ellipsis-vertical'}
                size={30}
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
      />

          {content}
          <FlatList
            scrollToOverflowEnabled
            data={groups}
            keyExtractor={(item) => item._id}
            renderItem={(item) => (
              <TouchableNativeFeedback onPress={()=> navigation.navigate("GroupChat",{group:item.item})}>
                <ListItem
                leftAvatar={{source: {uri: item.item.photoURL}, size:50}}
                title={item.item.name}
                containerStyle={style.list}
                titleStyle={style.title}
                subtitle={item.item.latestMessage.text}
                
              />
              </TouchableNativeFeedback>
              
            )}
          />
    </Container>
  );
};

const style = StyleSheet.create({
  list:{
    height:80
  },
  title:{
    fontSize:20
  }
})
export default HomeScreen;
