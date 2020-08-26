import React from 'react';
import {Text, Button, Input} from 'react-native-elements';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import style from '../../styles/formStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {orangeTheme, greenTheme, defaultUri} from '../../types/color';
import {Content, Container} from 'native-base';
import Modal from 'react-native-modalbox';
import {AuthContext} from '../../AuthProvider';
import {gallery, camera} from '../../images';
import {useFixedEntry} from '../../hooks';
// import Firebase from '../../components/Firebase';
import Avatar from '../../components/Avatar';
import {pickImage, storeUploadImage} from '../../types/utils';


const AddDetail = ({navigation}) => {
  const {user, setUser, setInitialRoute} = React.useContext(AuthContext);
  const maxEntry = 130;
  const [visible, setVisible] = React.useState(false);
  const [avatar, setAvatar] = React.useState(defaultUri);
  const [loading, setLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const user = auth().currentUser;
    user
      .updateProfile({
        photoURL: avatar,
      })
      .then(() => {
        firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        photoURL:avatar
      },{merge:true})  
      })
      
  }, []);

  const [count, about, handleCount] = useFixedEntry(maxEntry);

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
      setVisible(false);
      await storeUploadImage(image, user, setUser, storeItem, (url) => {
        setLoading(false);
        setAvatar(url);
      });
    }
  };

  const preprocsses = () => {
      setTimeout(() => {
        setUser(auth().currentUser);
        storeItem(auth().currentUser)
        setInitialRoute('main');
      }, 8000);
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
    <Container style={{paddingTop: 50}}>
      <StatusBar
        translucent
        backgroundColor={'#fff'}
        barStyle={'dark-content'}
      />
      <Content>
        <View style={{marginHorizontal: '25%'}}>
          <View style={style.avatarContainer}>
            <Avatar
              source={{uri: avatar}}
              size={'large'}
              editButton
              onPressEdit={() => setVisible(true)}
            />
          </View>
          {loading ? (
            <ActivityIndicator
              color={orangeTheme}
              size={'large'}
              style={{alignSelf: 'center', top: 100, position: 'absolute'}}
            />
          ) : null}
        </View>
        <Text h3 style={{alignSelf: 'center', marginVertical: 20}}>
          Profile Image
        </Text>
        <Input
          label={'Bio'}
          leftIcon={<Icon name={'alert-circle-outline'} size={24} />}
          multiline
          containerStyle={{width: '95%', paddingLeft: '5%'}}
          inputContainerStyle={{borderColor: greenTheme}}
          labelStyle={{color: '#000'}}
          rightIcon={<Text>{count}</Text>}
          onChangeText={handleCount}
          maxLength={maxEntry}
        />
        <Button
          title={'Finish'}
          buttonStyle={{
            backgroundColor: orangeTheme,
            width: 150,
            alignSelf: 'center',
          }}
          raised
          loading={isSubmitting}
          onPress={() => submit()}
        />
      </Content>
      <Modal
        entry={'bottom'}
        backButtonClose
        isOpen={visible}
        onClosed={() => setVisible(false)}
        style={style.modalBox}>
        <View style={style.modalContainer}>
          <View>
            <Avatar
              size={'small'}
              source={gallery}
              onPress={() => getUploadImage()}
            />
            <Text style={{fontSize: 20}}>Gallery</Text>
          </View>
          <View>
            <Avatar size={'small'} source={camera} />
            <Text style={{fontSize: 20}}>Camera</Text>
          </View>
        </View>
      </Modal>
    </Container>
  );
};
const screenStyle = StyleSheet.create({
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 30,
  },
});
export default AddDetail;
