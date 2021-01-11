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
import Chats from './src/screens/main/Chats';
import auth, {firebase} from '@react-native-firebase/auth';
import {AuthContext, AuthProvider} from './src/AuthProvider';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Menu, {MenuItem} from 'react-native-material-menu';

import HomeStack from './src/screens/main/HomeStack';
import {orangeTheme} from './src/types/color';
import ChatRoom from './src/screens/main/ChatRoom';
import Firebae from './src/components/Firebase';
import Categories from './src/screens/main/Categories';
import GroupCategory from './src/screens/main/GroupCategory';
import Recommend from './src/screens/main/Recommend';
import GroupDetails from './src/screens/main/GroupDetails';
import Requests from './src/screens/main/Requests';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Avatar from './src/components/Avatar';
import Header from './src/components/Header';
import {View, TouchableNativeFeedback} from 'react-native';
import GroupInfo from './src/screens/main/GroupInfo';
import { UserDataProvider} from './src/UserDataProvider';
import {BadgeProvider, BadgeContext} from './src/BadgeCounterProvider';
import Members from './src/screens/main/Members';

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
  const {topicCounter, chatCounter, requestCounter} = useContext(BadgeContext);
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
            iconName = 'paper-plane-outline';
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
        showLabel: false,
      }}>
      <Tab.Screen
        name={'Groups'}
        component={HomeScreen}
        initialParams={{title: 'Topics'}}
        options={{tabBarBadge: topicCounter || null}}
      />
      <Tab.Screen
        name={'Chats'}
        component={Chats}
        initialParams={{title: 'Chats'}}
        options={{tabBarBadge: chatCounter || null}}
      />
      <Tab.Screen
        name={'Discover'}
        component={ExploreStack}
        initialParams={{title: 'Discover'}}
      />
      <Tab.Screen
        name={'Requests'}
        component={Requests}
        initialParams={{title: 'Requests'}}
        options={{tabBarBadge: requestCounter || null}}
      />
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

export function MainStack() {
  const menuRef = useRef();
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
          ),
          headerRight: () => {
            return (
              <Menu
                ref={menuRef}
                button={
                  <Ionicons
                    name={'ellipsis-vertical'}
                    size={24}
                    onPress={() => menuRef.current.show()}
                    style={{marginRight: 10}}
                  />
                }>
                <MenuItem
                  onPress={() => {
                    menuRef.current.hide();
                    navigation.navigate('groupInfo', {
                      group: route.params.group,
                    });
                  }}>
                  Group Info
                </MenuItem>
                <MenuItem onPress={() => menuRef.current.hide()}>
                  Mute Group
                </MenuItem>
                <MenuItem onPress={() => menuRef.current.hide()}>
                  Leave Group
                </MenuItem>
              </Menu>
            );
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

      <Stack.Screen
        name={'groupDetails'}
        component={GroupDetails}
        options={{title: 'Details'}}
      />
      <Stack.Screen
        name={'groupInfo'}
        component={GroupInfo}
        options={{
          title: 'Group Info',
          gestureEnabled: true,
          gestureDirection: 'horizontal-inverted',
          cardOverlayEnabled: true,
        }}
      />
      <Stack.Screen name="members" component={Members} options={{title:"Members"}} />
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
    if (user){
      setUser(user);
    }
    else{
      setUser(null)
    }

    if (initializing) setInitializing(false);
  }
  useEffect(() => {
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
        <BadgeProvider>
          <SafeAreaProvider>
            <Routes />
          </SafeAreaProvider>
        </BadgeProvider>
      </UserDataProvider>
    </AuthProvider>
  );
};

export default App;
