import {firebase}  from '@react-native-firebase/auth';

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
//   if (!firebase.apps.length) {
//     console.log('initalized');
//   }

const Firebase = firebase.apps.length === 0 ?  firebase.initializeApp(firebaseConfig) : firebase.app() ;

export default Firebase;