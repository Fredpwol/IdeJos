import * as React from 'react';
import {Container, ListItem, Left, Body} from 'native-base';
import {Text} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {FlatList, View} from 'react-native';
import Avatar from '../../components/Avatar';
import { ActivityIndicator } from 'react-native-paper';


const CategoriesGroup = ({route, navigation}) => {
  const [groups, setGroups] = React.useState([]);
  const [content, setContent] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    firestore()
      .collection('GROUPS')
      .where('category', '==', route.params.name)
      .where('access', '==', 'public')
      .get()
      .then((querySnapshot) => {
        const threads = querySnapshot.docs.map((doc) => {
          const data = {
            _id: doc.id,
            ...doc.data(),
          };
          return data;
        });
        setIsLoading(false);
        if (threads.length === 0){
            setContent((<View style={{alignSelf:"center", justifyContent:"center", flex:3}}>
            <Text style={{color:"gray",}}>Nothing to show here...</Text>
        </View>))
          }
          else{
            setContent(null)
          }
        setGroups(threads);
      });
  }, []);
  return (
    <Container>
        {content}
      { isLoading ? (
      <View style={{justifyContent:"center", flex:3}}>
        <ActivityIndicator size={"large"} style={{ alignSelf:"center"}} />
      </View>
      )
        :
      (
      <FlatList
        scrollToOverflowEnabled
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={(item) => {
          return (
            <ListItem
              avatar
              style={{height:80}}
              onPress={() => navigation.navigate('groupDetails', {group:item.item})}
              >
              <Left>
                <Avatar source={{uri: item.item.photoURL}} />
              </Left>
              <Body>
                <Text style={{fontSize:18, fontWeight:"500"}}>{item.item.name}</Text>
              </Body>
            </ListItem>
          );
        }}
      />)
      }
    </Container>
  );
};
export default CategoriesGroup;
