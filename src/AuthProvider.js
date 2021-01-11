import React from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
// import Firebase from './components/Firebase';

export const AuthContext = React.createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = React.useState(null);
  const [initialRoute, setInitialRoute] = React.useState('main');
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        initialRoute,
        setInitialRoute,
        login: async(email, password, errorCallback) => {
          setInitialRoute("main")
          await auth()
            .signInWithEmailAndPassword(email, password)
            .then((userInfo) => {
              console.log(userInfo);
            })
            .catch((error) => errorCallback(error));
        },
        register:async(email, password, username, number, errorCallback) => {
          setInitialRoute('addDetail');
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (userInfo) => {
              userInfo.user.updateProfile({displayName:username})
              await firestore().collection('users').doc(userInfo.user.uid).set({
                phoneNumber: number,
                displayName: username,
              });
              console.log(userInfo);
            })
            .catch((error) => errorCallback(error));
        },
        logout: () => {
          try {
            auth().signOut().then(()=>{
              var userStatusFirestoreRef = firestore().collection('status').doc(user.uid);
              userStatusFirestoreRef.set({
                state: 'offline',
                last_changed: new firestore.Timestamp.now(),
              }).then(async() =>  await AsyncStorage.removeItem("userData") )
              
            })
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
