/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
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
import {AuthContext, AuthProvider} from './src/AuthProvider';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {orangeTheme} from './src/types/color';
import CreateGroup from './src/screens/main/CreateGroup';
import ChatRoom from './src/screens/main/ChatRoom';

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
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Groups') {
            iconName = focused ? 'people-outline' : 'people-circle-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbox-outline' : 'chatbox-ellipses-outline';
          } else if (route.name === 'Discover') {
            iconName = 'compass-outline';
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
      }}>
      <Stack.Screen name={'Groups'} component={HomeScreen} />
      <Tab.Screen name={'Chats'} component={Chats} />
      <Tab.Screen name={'Discover'} component={Explore} />
    </Tab.Navigator>
  );
}

function MainStack() {
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
        options={({route}) => ({
          title:route.params.group.name
        })}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  const {initialRoute} = React.useContext(AuthContext);
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
    </Stack.Navigator>
  );
}

const Routes = () => {
  const {user, setUser} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const [initializing, setInitializing] = React.useState(true);

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
  React.useEffect(() => {
    getItem();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    setLoading(false);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
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
  React.useEffect(() => {
    const firebaseConfig = {
      apiKey: 'AIzaSyDBN_InRzMoqQY9oGUsBzSpDKmcB3dvrcc',
      authDomain: 'idejos-ed640.firebaseapp.com',
      databaseURL: 'https://idejos-ed640.firebaseio.com',
      projectId: 'idejos-ed640',
      storageBucket: 'idejos-ed640.appspot.com',
      messagingSenderId: '186105528788',
      appId: '1:186105528788:web:dc35187f1b45200ddfd641',
      measurementId: 'G-F4L8RNS897',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log('initalized');
    }
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Routes />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
