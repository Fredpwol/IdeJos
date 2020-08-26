import * as React from 'react';
import {Container, Text, H2 } from 'native-base';
import {AuthContext} from '../../AuthProvider';
import {StatusBar} from 'react-native'
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import Menu, {MenuItem} from 'react-native-material-menu';
import Avatar from '../../components/Avatar';
import { SearchBar } from 'react-native-elements';
// import Firebase from '../../components/Firebase';

const Chats = ({ navigation, route}) => {
  const {user, logout} = React.useContext(AuthContext);
  const menuRef = React.useRef();
  return (
    <Container>
        <Header
        rightComponent={
          <Icon name="search-outline" size={24} />
        }
        title={route.params?.title}
        leftComponent={
          <Avatar 
           size={"small"}
           containerStyle={{marginTop:5}}
           source={{uri: user.photoURL}} 
           onPress={() => navigation.navigate('userDetails')}
           round
            />
        }
      />
      {/* <SearchBar
      placeholder="Search"
      lightTheme
      round
      containerStyle={{backgroundColor:"white", borderTopColor:"white", borderBottomColor:"white"}}
      inputContainerStyle={{backgroundColor:"#d4d4d4"}}
      /> */}
      <Text>{'welcome ' + user.displayName}</Text>
      <H2>
        Explore page!
      </H2>
    </Container>
  );
};
export default Chats;