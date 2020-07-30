import React from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = React.createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = React.useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password, errorCallback) => {
          await auth()
            .signInWithEmailAndPassword(email, password)
            .then((userInfo) => {
              console.log(userInfo);
            })
            .catch((error) => errorCallback(error));
        },
        register: async (email, password, username, number, errorCallback) => {
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userInfo) => {
              userInfo.user.updateProfile({displayName:username})
              firestore().collection('users').doc(userInfo.user.uid).set({
                phoneNumber: number,
                displayName: username,
              });
              console.log(userInfo);
            })
            .catch((error) => errorCallback(error));
        },
        logout: async () => {
          try {
            await auth().signOut();
            await AsyncStorage.removeItem("userData")
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
