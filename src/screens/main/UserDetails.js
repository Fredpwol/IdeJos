import * as React from 'react';
import {AuthContext} from '../../AuthProvider';
import {View, Container, Content} from 'native-base';
import Avatar from '../../components/Avatar';
import {StyleSheet, Alert, ActivityIndicator, Dimensions} from 'react-native';
import {Text, ListItem, Input, Button} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modalbox';
import {greenTheme, orangeTheme} from '../../types/color';
import {gallery, camera} from '../../images';
import AwesomeAlert from 'react-native-awesome-alerts';
import {pickImage, storeUploadImage} from '../../types/utils';
import styles from '../../styles/formStyles';
import AsyncStorage from '@react-native-community/async-storage';
import { useFixedEntry } from '../../hooks';
import ReactModal from 'react-native-modal';

const db = firestore();
export default UserDetails = () => {
  const {user, logout, setUser} = React.useContext(AuthContext);
  const [userData, setUserData] = React.useState({});
  const [inputEdit, setinputEdit] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isupdating, setIsUpdating] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [avatar, setAvatar] = React.useState(user.photoURL);
  const [title, setTitle] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [value, setValue] = React.useState('');
  const [userCount, username, handleChange] = useFixedEntry(50);
  const [aboutCount, about, handleAboutChange] = useFixedEntry(200);

  React.useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setUserData(doc.data());
      });
      
  }, []);

  const storeItem = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  const editModal = (inputTitle, editIcon, defaultValue) => {
    setTitle(inputTitle);
    setIcon(editIcon);
    setValue(defaultValue);
    setinputEdit(true);
  }

  const getUploadImage = async () => {
    const image = await pickImage();
    if (image){
      setLoading(true);
      setVisible(false);
      await storeUploadImage(image, setUser, storeItem, (url) => {
        setLoading(false);
        setAvatar(url);
      });
    }
  };

  const updateRecord = async () => {
    if(title === 'Username'){
      await auth().currentUser
      .updateProfile(
        {
          displayName: username
        }
      );
    }
      let data = {};
      switch (title) {
        case "Username":
          data.displayName = username;
          break;
        case "Bio":
          data.about = about;
          break;
        default:
          break;
      }
      await db
      .collection('users')
      .doc(user.uid)
      .update(
        data
      );
      setUser(auth().currentUser)
      storeItem(auth().currentUser)
      setIsUpdating(false);
      setinputEdit(false);
      setTitle('');
      setIcon('');
      setValue('');
  }

  return (
    <Container>
      <Content>
        <View style={style.avatarContainer}>
          <Avatar source={{uri: avatar}} size={'large'} editButton onPressEdit={() => setVisible(true)} />
        </View>
        {loading ? (
          <ActivityIndicator
            color={orangeTheme}
            size={'large'}
            style={{alignSelf: 'center', top: 100, position: 'absolute'}}
          />
        ) : null}
        <Text h3 style={{alignSelf: 'center', marginTop: -30}}>
          {user.displayName}
        </Text>
        <ListItem
          title={'Username'}
          leftIcon={
            <Icon name={'person-outline'} size={24} color={greenTheme} />
          }
          subtitle={user.displayName}
          rightIcon={{name: 'edit'}}
          bottomDivider
          topDivider
          titleStyle={style.title}
          onPress={() => editModal("Username", "person" ,user.displayName)}
        />
        <ListItem
          title={'Bio'}
          leftIcon={
            <Icon name={'alert-circle-outline'} size={24} color={greenTheme} />
          }
          subtitle={userData?.about}
          rightIcon={{name: 'edit'}}
          bottomDivider
          titleStyle={style.title}
          onPress={() => editModal("Bio", "alert-circle-outline", userData?.about)}
        />
        <ListItem
          title={'Mobile Number'}
          leftIcon={<Icon name={'call-outline'} size={24} color={greenTheme} />}
          subtitle={userData?.phoneNumber}
          rightIcon={{name: 'edit'}}
          bottomDivider
          titleStyle={style.title}
        />
         <ListItem
          title={'Email'}
          leftIcon={<Icon name={'mail-outline'} size={24} color={greenTheme} />}
          subtitle={user.email}
          bottomDivider
          titleStyle={style.title}
        />
        <ListItem
          title={'Logout'}
          onPress={() => setIsVisible(true)}
          leftIcon={<Icon name={'log-out-outline'} size={24} color={'red'} />}
          titleStyle={{fontSize: 20, color: 'red'}}
        />
        <AwesomeAlert
          show={isVisible}
          contentContainerStyle={{width: 250}}
          closeOnTouchOutside={false}
          title="Logout"
          useNativeDriver
          message="Do you want to logout?"
          closeOnHardwareBackPress={false}
          showCancelButton
          showConfirmButton
          cancelText="Cancel"
          confirmText="Logout"
          confirmButtonColor="red"
          onCancelPressed={() => {
            setIsVisible(false);
          }}
          onConfirmPressed={() => {
            logout();
          }}
        />
      </Content>
      <ReactModal
      isVisible={inputEdit}
      animationInTiming={800}
      backdropTransitionInTiming={800}
      animationIn={"fadeIn"}
      onBackButtonPress={() => setinputEdit(false)}
      onBackdropPress={() => setinputEdit(false)}
      backdropColor={"#000"}
      backdropOpacity={0.7}
      >
        <View style={style.centerItems}>
            <View style={style.inputBox} >
              <Input
              autoFocus
              multiline={title === "Username" ? false : true}
              defaultValue={value}
              label={title}
              leftIcon={(<Icon name={icon} size={20} />)}
              rightIcon={<Text>
                {title === "Username" ? userCount : title === "Bio" ? aboutCount : 0 }
                </Text>}
              onChangeText={value =>{
                switch (title) {
                  case "Username":
                    handleChange(value);
                    break;
                  case "Bio":
                    handleAboutChange(value);
                  default:
                    break;
                }
              } }
               />
               <View style={style.buttonContainer}>
               <Button
                containerStyle={style.buttonStyle} 
                title="Save"
                loading={isupdating}
                buttonStyle={{backgroundColor:orangeTheme}}
                onPress={ () => {
                  setIsUpdating(true);
                  updateRecord()
                }} />
               </View>
            </View>
        </View>

      </ReactModal>
      <Modal
        entry={'bottom'}
        backButtonClose
        isOpen={visible}
        onClosed={() => setVisible(false)}
        style={styles.modalBox}>
        <View style={styles.modalContainer}>
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

const style = StyleSheet.create({
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 20,
  },
  centerItems:{
    alignSelf:"center",
    justifyContent:"center",
    width:"95%",
    borderWidth:1,
    borderColor:"#d4d4d4",
    padding:10,
    backgroundColor:"white"
  },
  inputBox:{
    alignContent:"center",
    backgroundColor:"white",
  
  },
  buttonStyle:{
    width:100,
  },
  buttonContainer:{
    padding:8,
    flexDirection:"row-reverse"
  }
});
