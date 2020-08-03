import React from 'react';
import {Text, Button, Avatar, Input} from 'react-native-elements';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import style from '../../styles/formStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {orangeTheme, greenTheme, defaultUri} from '../../types/color';
import {Content, Container} from 'native-base';
import Modal from 'react-native-modalbox';
import {AuthContext} from '../../AuthProvider';
import {gallery, camera} from '../../images';
import { useFixedEntry } from '../../hooks'

const {width, height} = Dimensions.get('window');

const AddDetail = ({navigation}) => {
  const {user, setUser, setInitialRoute} = React.useContext(AuthContext);
  const maxEntry = 130;
  const [visible, setVisible] = React.useState(false);
  const [avatar, setAvatar] = React.useState(defaultUri);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const user = auth().currentUser;
    user
      .updateProfile({
        photoURL: avatar,
      })
      .then(() => {
        setUser(user);
        storeItem(user);
      });
  }, []);

  const [count, about, handleCount] = useFixedEntry(maxEntry)
  

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then((image) => {
        setVisible(false);
        storeUploadImage(image);
      })
      .catch((error) => console.log(error));
  };

  const storeItem = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  const storeUploadImage = (image) => {
    setLoading(true);
    const {path} = image;
    const fileName = user.uid + 'profilePic.';
    const uri = path.replace('file://', '');
    const ref = storage().ref('/profilePictures/' + fileName);

    ref.putFile(uri).then((taskSnapshot) => {
      if (taskSnapshot.state === storage.TaskState.SUCCESS) {
        ref.getDownloadURL().then((url) => {
          user
            .updateProfile({
              photoURL: url,
            })
            .then(() => {
              setUser(user);
              storeItem(user);
            });
          setAvatar(url);
          setLoading(false);
        });
      }
    });
  };

  const submit = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set({about}, {merge: true})
      .then(setInitialRoute('main'));
  };

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor={'#fff'}
        barStyle={'dark-content'}
      />
      <View style={style.centerContent}>
        <Content>
          <View style={{marginHorizontal: '25%'}}>
            <Avatar
              size="large"
              rounded
              source={{
                uri: avatar,
              }}
              showAccessory
              containerStyle={{width: 220, height: 220, marginBottom: 50}}
              overlayContainerStyle={{
                borderRadius: 110,
                borderColor: greenTheme,
                borderWidth: 2,
              }}
              accessory={{
                name: 'mode-edit',
                type: 'material',
                size: 30,
                color: greenTheme,
                reverse: true,
                underlayColor: '#fff',
              }}
              onPress={() => setVisible(true)}
              onAccessoryPress={() => setVisible(true)}
            />
            {loading ? (
            <ActivityIndicator
              color={orangeTheme}
              size={'large'}
              style={{bottom: 200, right: 75, position: 'absolute'}}
            />)
            : null}
            <Text h3 style={{marginBottom: 20}}>
              Profile Image
            </Text>
          </View>

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
            onPress={() => submit()}
          />
        </Content>
        <Modal
          entry={'bottom'}
          backButtonClose
          isOpen={visible}
          onClosed={() => setVisible(false)}
          style={screenStyle.modalBox}>
          <View style={screenStyle.container}>
            <View>
              <Avatar
                size={'large'}
                source={gallery}
                onPress={() => pickImage()}
              />
              <Text style={{fontSize:20}}>Gallery</Text>
            </View>
            <View>
              <Avatar size={'large'} source={camera} />
              <Text style={{fontSize:20}}>Camera</Text>
            </View>
          </View>
        </Modal>
      </View>
    </Container>
  );
};
const screenStyle = StyleSheet.create({
  modalBox: {
    overflow: 'hidden',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height,
    width,
  },
  container: {
    flexDirection: 'row',
    height:150,
    width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignContent: 'center',
    justifyContent:"space-between",
    paddingHorizontal:80,
    bottom: 0,
    paddingTop: 30,
    position: 'absolute',
    backgroundColor: '#fff',
  },
});
export default AddDetail;
