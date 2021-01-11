import React from 'react';
import {Text, Button, Input, Avatar} from 'react-native-elements';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import style from '../../styles/formStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  orangeTheme,
  greenTheme,
  defaultUri,
  dividerColor,
} from '../../types/color';
import {Content, Container} from 'native-base';
import Modal from 'react-native-modalbox';
import {AuthContext} from '../../AuthProvider';
import ReactModal from 'react-native-modal';
import {gallery, camera} from '../../images';
import {useFixedEntry} from '../../hooks';
// import Firebase from '../../components/Firebase';
import {pickImage, storeUploadImage} from '../../types/utils';
import {SafeAreaView} from 'react-native-safe-area-context';

const AddDetail = ({navigation}) => {
  const {user, setUser, setInitialRoute} = React.useContext(AuthContext);
  const maxEntry = 130;
  const [avatar, setAvatar] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [about, setAbout] = React.useState("");

  React.useEffect(() => {
    const user = auth().currentUser;
    user
      .updateProfile({
        photoURL: avatar,
      })
      .then(() => {
        firestore().collection('users').doc(user.uid).set(
          {
            photoURL: avatar,
          },
          {merge: true},
        );
      });
  }, []);


  const storeItem = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  const getUploadImage = async () => {
    const image = await pickImage();
    if (image) {
      setLoading(true);
      try{
        await storeUploadImage(image, setUser, storeItem, (url) => {
          setLoading(false);
          setAvatar({uri:url});
        });
      }
      catch(error){
        setLoading(false);
        ToastAndroid.show("Image upload failed!", ToastAndroid.LONG);
      }
      
    }
  };

  const preprocsses = () => {
    setTimeout(() => {
      setUser(auth().currentUser);
      storeItem(auth().currentUser);
      setInitialRoute('main');
    }, 4000);
  };
  const submit = () => {
    setIsSubmitting(true);
    firestore()
      .collection('users')
      .doc(user.uid)
      .set({about}, {merge: true})
      .then(() => {
        preprocsses();
      });
  };

  return (
    <Container>
      <SafeAreaView>
        <StatusBar
          translucent
          backgroundColor={'#fff'}
          barStyle={'dark-content'}
        />
        <View style={{marginTop:30, flexDirection:"row"}}>
        <Avatar
          size="large"
          rounded
          icon={{name: 'camera', type: 'font-awesome'}}
          source={avatar}
          onPress={() => getUploadImage()}
          activeOpacity={0.7}
          overlayContainerStyle={{backgroundColor: dividerColor}}
          containerStyle={{marginLeft: 10}}
        />
        <Input
       label='Bio'
       multiline
       leftIcon={
         (<Icon name={'alert-circle-outline'} size={24} color={greenTheme} />)
       }
       rightIcon={{name:"smile-o", type:"font-awesome"}}
        containerStyle={{width:Dimensions.get("window").width - 100}}
        maxLength={200}
        onChangeText={(text) => setAbout(text)} />
        </View>
      </SafeAreaView>
      <Avatar
       rounded
       size="medium"
       icon={{name:"check"}}
       containerStyle={{right:10, bottom:10, position:"absolute"}}
       overlayContainerStyle={{backgroundColor:greenTheme}}
       onPress={submit} />
       <ReactModal
       isVisible={loading}>
         <View style={{alignSelf:"center", justifyContent:"center"}}>
           <View style={screenStyle.box}>
              <ActivityIndicator size="large" color={orangeTheme} />
           </View>
         </View>
       </ReactModal>
    </Container>
  );
};
const screenStyle = StyleSheet.create({
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 30,
  },
  box:{
    backgroundColor:"white"
  }
});
export default AddDetail;
