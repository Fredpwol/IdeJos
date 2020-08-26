/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useContext, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './src/screens/auth/Login';
import SignUp from './src/screens/auth/SignUp';
import Loading from './src/components/Loading';
import HomeScreen from './src/screens/main/Home';
import Explore from './src/screens/main/Explore';
import Chats from './src/screens/main/Chats';
import AddDetail from './src/screens/auth/AddDetail';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {AuthContext, AuthProvider} from './src/AuthProvider';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Menu, {MenuItem} from 'react-native-material-menu';

import userChatRoom from './src/screens/main/userChatRoom';
import {orangeTheme} from './src/types/color';
import CreateGroup from './src/screens/main/CreateGroup';
import ChatRoom from './src/screens/main/ChatRoom';
import UserDetails from './src/screens/main/UserDetails';
import Firebae from './src/components/Firebase';
import Categories from './src/screens/main/Categories';
import GroupCategory from './src/screens/main/GroupCategory';
import Recommend from './src/screens/main/Recommend';
import GroupDetails from './src/screens/main/GroupDetails';
import Requests from './src/screens/main/Requests';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FastImage from 'react-native-fast-image';
import Avatar from './src/components/Avatar';
import Header from './src/components/Header';
import {View, TouchableNativeFeedback} from 'react-native';
import GroupInfo from './src/screens/main/GroupInfo';
import { userDataContext, UserDataProvider } from './src/UserDataProvider';
import Contacts from './src/screens/main/Contacts';

const topTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName={'login'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'login'} component={Login} />
      <Stack.Screen name={'signup'} component={SignUp} />
    </Stack.Navigator>
  );
}

function GroupStack() {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Groups') {
            iconName = 'people-outline';
          } else if (route.name === 'Chats') {
            iconName = 'chatbox-outline';
          } else if (route.name === 'Discover') {
            iconName = 'compass-outline';
          } else if (route.name === 'Requests') {
            iconName = 'paper-plane';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: orangeTheme,
        inactiveTintColor: 'gray',
        labelStyle: {fontSize: 15},
        style: {height: 60},
        showLabel:false,
      }}>
      <Tab.Screen name={'Groups'} component={HomeScreen} initialParams={{title:"Topics"}} />
      <Tab.Screen name={'Chats'} component={Chats} initialParams={{title:"Chats"}} />
      <Tab.Screen name={'Discover'} component={ExploreStack} initialParams={{title:"Discover"}} />
      <Tab.Screen name={'Requests'} component={Requests} initialParams={{title:"Requests"}} />
    </Tab.Navigator>
  );
}

function ExploreStack({route}) {
  const {user} = useContext(AuthContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: ({navigation}) => (
            <Header
              rightComponent={<Ionicons name="search-outline" size={24} />}
              title={route.params?.title}
              leftComponent={
                <Avatar
                  size={'small'}
                  containerStyle={{marginTop: 5}}
                  source={{uri: user.photoURL}}
                  onPress={() => navigation.navigate('userDetails')}
                  round
                />
              }
            />
          ),
        }}
        name="explore"
        component={ExploreTabs}
      />
    </Stack.Navigator>
  );
}

function ExploreTabs() {
  return (
    <topTab.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: orangeTheme,
        },
      }}>
      <topTab.Screen name="categories" component={Categories} />
      <topTab.Screen name="recommended" component={Recommend} />
    </topTab.Navigator>
  );
}

function MainStack() {
  const menuRef = useRef()
  return (
    <Stack.Navigator initialRouteName={'Groups'}>
      <Stack.Screen
        name={'Groups'}
        component={GroupStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'GroupChat'}
        component={ChatRoom}
        options={({route, navigation}) => ({
          title: route.params.group.name,
          headerLeft: ({onPress}) => (
            <TouchableNativeFeedback onPress={onPress}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="arrow-back" size={24} style={{paddingTop: 5}} />
                <Avatar
                  source={{uri: route.params.group.photoURL}}
                  style={{width: 40, height: 40, borderRadius: 20}}
                  onPress={onPress}
                />
              </View>
            </TouchableNativeFeedback>
          ),headerRight:() => {

            return (
              <Menu
            ref={menuRef}
            button={
              <Ionicons
                name={'ellipsis-vertical'}
                size={24}
                onPress={() => menuRef.current.show()}
                style={{marginRight:10}}
              />
            }
            
            >
            <MenuItem
              onPress={() => {
                menuRef.current.hide();
                navigation.navigate('groupInfo', {group:route.params.group});
              }} >
              Group Info
            </MenuItem>
            <MenuItem onPress={() => menuRef.current.hide()}>Mute Group</MenuItem>
            <MenuItem onPress={() => menuRef.current.hide()}>Leave Group</MenuItem>
          </Menu>
            )
          },
        })}
      />
      <Stack.Screen
        name={'groupCategory'}
        component={GroupCategory}
        options={({route}) => ({
          title: route.params?.name ? route.params.name : 'Catgories',
        })}
      />
      
      <Stack.Screen name={'groupDetails'} component={GroupDetails} options={{title:"Details"}} />
      <Stack.Screen name={"groupInfo"} component={GroupInfo} options={
        {
          title:"Group Info", 
          gestureEnabled:true,
          gestureDirection:"horizontal-inverted",
          cardOverlayEnabled: true,
          }} />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  const {initialRoute, user} = useContext(AuthContext);
  const {setContacts, setRequestSent, setRequestRecieved, setUserData} = useContext(userDataContext)
  useEffect(()=>{
    const unsubscribe = firestore().collection("users")
      .doc(user.uid)
      .collection('CONTACTS')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(docs => {
        const data = {
          _id : docs.id,
          ...docs.data()
        }
        return data;
        })
        setContacts(threads)
      })
      const sentUnsubscribe = firestore().collection("users")
      .doc(user.uid)
      .collection('request_sent')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(docs => {
        const data = {
          _id : docs.id,
          ...docs.data()
        }
        return data;
        })
        setRequestSent(threads)
      })
      const recievedUnsubscribe = firestore().collection("users")
      .doc(user.uid)
      .collection('requests_recieved')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(docs => {
        const data = {
          _id : docs.id,
          ...docs.data()
        }
        return data;
        })
        setRequestRecieved(threads)
      })
      const userDataUnsubscribe = firestore().collection("users")
      .doc(user.uid)
      .onSnapshot(docSnapshot => {
          setUserData({...docSnapshot.data()})
        })
    return () => [unsubscribe(), sentUnsubscribe(), recievedUnsubscribe(), userDataUnsubscribe()]
  },[])
  return initialRoute === 'addDetail' ? (
    <Stack.Navigator
      {...props}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'addDetail'} component={AddDetail} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'main'}>
      <Stack.Screen name={'main'} component={MainStack} />
      <Stack.Screen name={'createGroup'} component={CreateGroup} />
      <Stack.Screen
        name={'userDetails'}
        component={UserDetails}
        options={{
          headerShown: true,
          title: 'Me',
        }}
      />
      <Stack.Screen 
      name="userChat" 
      component={userChatRoom} 
      options={({navigation, route}) => (
        {
          headerShown:true,
          title:route.params.contact.displayName,
          headerLeft: ({onPress}) => (
            <TouchableNativeFeedback onPress={onPress}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="arrow-back" size={24} style={{paddingTop: 5}} />
                <Avatar
                  source={{uri: route.params.contact.photoURL}}
                  style={{width: 40, height: 40, borderRadius: 20}}
                  onPress={onPress}
                />
              </View>
            </TouchableNativeFeedback>
          )
        }
      )} />
      <Stack.Screen 
      name={'contacts'}
      component={Contacts}
      options={{
        headerShown:true,
        title:"Contacts"
      }} />
    </Stack.Navigator>
  );
}

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const storeItem = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = async () => {
    try {
      let user = await AsyncStorage.getItem('userData');
      if (user) {
        setUser(JSON.parse(user));
      }
    } catch (error) {
      console.log(error);
    }
  };


  function onAuthStateChanged(user) {
    setUser(user);
    storeItem(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    getItem();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    setLoading(false);
    return subscriber; // unsubscribe on unmount
  }, []);


  
  // if (initializing) return null;
  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UserDataProvider>
        <SafeAreaProvider>
          <Routes />
        </SafeAreaProvider>
      </UserDataProvider>
    </AuthProvider>
  );
};

export default App;
