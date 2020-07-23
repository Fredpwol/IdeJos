/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/auth/Login'
import SignUp from './src/screens/auth/SignUp'




const App = () => {
  const Stack = createStackNavigator()
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"login"} >
        <Stack.Screen 
        name={"login"} 
        component={Login} 
        options = {
          { headerShown:false }
        } />
        <Stack.Screen
        name={"signup"}
        component={SignUp}
        options={
          {
            headerShown:false
          }
        } />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default App;
