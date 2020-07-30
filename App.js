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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Login from './src/screens/auth/Login';
import SignUp from './src/screens/auth/SignUp';
import Loading from './src/components/Loading';
import HomeScreen from './src/screens/main/Home';
import Explore from './src/screens/main/Explore';
import Chats from './src/screens/main/Chats';
import auth, {firebase} from '@react-native-firebase/auth';
import {AuthContext, AuthProvider} from './src/AuthProvider';
import AsyncStorage  from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { orangeTheme } from './src/types/color';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function AuthStack() {
  return (
    <Stack.Navigator initialRouteName={'login'}>
      <Stack.Screen
        name={'login'}
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'signup'}
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {

  return (
    <Tab.Navigator 
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'forums') {
          iconName = focused
            ? 'people-outline'
            : 'people-circle-outline';
        } else if (route.name === 'chats') {
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
      labelStyle:{fontSize:15}
    }}  >
      <Tab.Screen name={'forums'} component={HomeScreen} />
      <Tab.Screen name={'chats'} component={Chats} />
      <Tab.Screen name={'Discover'} component={Explore} />
    </Tab.Navigator>
  );
}

const Routes = () => {
  const {user, setUser} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const [initializing, setInitializing] = React.useState(true);

  const storeItem = async (user) => {
    try{
      await AsyncStorage.setItem("userData", JSON.stringify(user))
    }
    catch(error){
      console.log(error)
    }
  }

  const getItem = async () =>{
    try{
      let user = await AsyncStorage.getItem("userData");
      return user != null ? JSON.parse(user) : null;
    }
    catch(error){
      console.log(error);
    }
  }

  function onAuthStateChanged(user) {
    storeItem(user);
    setUser(user);
    if (initializing) setInitializing(false);
  }
  React.useEffect(() => {
    let userData = getItem()
    if (userData) {
      setUser(userData)
    };
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    setLoading(false);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
    </SafeAreaProvider>
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
      <Routes />
    </AuthProvider>
  );
};

export default App;
