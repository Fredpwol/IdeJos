import React, {useState, useEffect, useContext} from 'react';
import {
  Container,
  Text,
  H2,
  Left,
  Right,
  Content,
  ListItem as List,
  Body,
} from 'native-base';
import {AuthContext} from '../../AuthProvider';
import Avatar from '../../components/Avatar';
import {SearchBar, Divider, ListItem} from 'react-native-elements';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ExpandableText from '../../components/ExpandableText';
import Icon from 'react-native-vector-icons/Ionicons';
import {greenTheme, orangeTheme, dividerColor} from '../../types/color';
import UserListItem from '../../components/UserListItem';
import Loading from '../../components/Loading';
import UserModalScreen from '../../components/UserModalScreen';

const GroupInfo = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const group = route.params.group;
  const [description, setDescription] = useState('');
  const [name, setName] = useState(group.name);
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [category, setCategory] = useState('');
  const [noUsers, setnoUsers] = useState(0);
  const [tempData, setTempData] = useState({});
  const [isVisible, setisVisble] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const getUserData = async (userId) => {
      const user = await firestore().collection('users').doc(userId).get();
      let res = user.data();
      return res;
    };
    const fetchGroupData = async () => {
      const groupref = firestore().collection('GROUPS').doc(group._id);
      const data = await groupref.get();
      const {name, description, category, noUsers} = data.data();
      setName(name);
      setDescription(description);
      setCategory(category);
      setnoUsers(noUsers);
      const membersData = await groupref.collection('MEMBERS').limit(4).get();
      setMembers([]);
      membersData.forEach(async (documentSnaphot) => {
        const tempData = await getUserData(documentSnaphot.id);

        const data = {
          _id: documentSnaphot.id,
          isAdmin: false,
          displayName: '',
          ...documentSnaphot.data(),
          ...tempData,
        };
        if (data._id == user.uid) {
          data.displayName = 'You';
          setIsAdmin(data.isAdmin);
        }
        setMembers((prevMem) => [...prevMem, data]);
      });
      // var usersObj = []
      // users.forEach(item => {
      //   item.then(obj => {
      //     usersObj.push(obj)
      //   })
      // })
    };
    fetchGroupData();
    console.log(members);
    setIsLoading(false);
  }, []);

  const toggleVisible = () => setisVisble((isVisible) => !isVisible);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Content>
        <View style={style.avatarContainer}>
          <Avatar size={'large'} source={{uri: group.photoURL}} />
        </View>
        <Text style={style.titleStyle}>{name}</Text>
        <Divider style={{backgroundColor: dividerColor, height: 2}} />
        <Text style={style.labelText}>Description:</Text>
        <ExpandableText
          value={description}
          maxChar={100}
          containerStyle={style.alignText}
          buttonLabel={"Read More"}
          buttonColor={orangeTheme}
        />
        <Divider style={{backgroundColor: dividerColor, height: 20}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 15,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: orangeTheme,
            }}>
            {` ${noUsers}   Members`}
          </Text>
          <Icon name="search" size={20} color={orangeTheme} />
        </View>
        <View>
          {isAdmin ? (
            <List avatar>
              <Left>
                <Icon
                  name="add-circle-outline"
                  size={42}
                  style={{color: orangeTheme}}
                />
              </Left>
              <Body>
                <Text style={{fontSize: 20, color: orangeTheme}}>
                  Add Members
                </Text>
              </Body>
            </List>
          ) : null}

          <FlatList
            style={{marginBottom: 10}}
            data={members}
            keyExtractor={(item) => item._id}
            renderItem={(item) => (
              <UserListItem
                user={item.item}
                isAdmin={isAdmin}
                onPress={() => {
                  setSelectedUser(item.item);
                  toggleVisible();
                }}
              />
            )}
          />
          <ListItem
            title={'See More'}
            leftIcon={<Icon name={'chevron-down'} size={24} color={'grey'} />}
            titleStyle={{fontSize: 18, color: 'grey'}}
          />
          <Divider style={{backgroundColor: dividerColor, height: 20}} />
          <ListItem
            title={'Leave Group'}
            leftIcon={<Icon name={'log-out-outline'} size={24} color={'red'} />}
            titleStyle={{fontSize: 20, color: 'red'}}
          />
        </View>
        <UserModalScreen isVisible={isVisible} onPress={toggleVisible} person={selectedUser} />
      </Content>
    </Container>
  );
};

const style = StyleSheet.create({
  titleStyle: {
    alignSelf: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    fontSize: 25,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginVertical: 50,
  },
  alignText: {
    alignSelf: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  joinButton: {
    width: 200,
    alignSelf: 'center',
  },
  labelText: {
    fontWeight: 'bold',
    marginLeft: 5,
    marginTop: 5,
  },
});
export default GroupInfo;
