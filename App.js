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
import Login from './src/screens/auth/Login';
import SignUp from './src/screens/auth/SignUp'
import Loading from './src/components/Loading'
import HomeScreen from './src/screens/main/Home';
import auth, { firebase } from '@react-native-firebase/auth';
import { AuthContext, AuthProvider } from "./src/AuthProvider";
import firestore from "@react-native-firebase/firestore";

const Stack = createStackNavigator()
function AuthStack() {
  return(
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
  )
}


function HomeStack(){
  return(
  <Stack.Navigator>
    <Stack.Screen name={"home"} component={HomeScreen} />
  </Stack.Navigator>
  )
}


const Routes = () =>{
  const {user, setUser} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const [initializing, setInitializing] = React.useState(true);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setLoading(false);
  }
  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }
  
  return(
    <NavigationContainer>
         {user ? <HomeStack /> : <AuthStack />}
      </NavigationContainer>
  )
}




const App = () => {

  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyDBN_InRzMoqQY9oGUsBzSpDKmcB3dvrcc",
      authDomain: "idejos-ed640.firebaseapp.com",
      databaseURL: "https://idejos-ed640.firebaseio.com",
      projectId: "idejos-ed640",
      storageBucket: "idejos-ed640.appspot.com",
      messagingSenderId: "186105528788",
      appId: "1:186105528788:web:dc35187f1b45200ddfd641",
      measurementId: "G-F4L8RNS897"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
      console.log("initalized")
  }

  },[])

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
