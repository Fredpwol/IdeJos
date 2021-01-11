import * as React from 'react';
import {Container, Content} from 'native-base';
import {Input, Text, Avatar, Button} from 'react-native-elements';
import {
  StyleSheet,
  View,
  Picker,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useFixedEntry} from '../../hooks';
import {greenTheme, orangeTheme, defaultGroupUri} from '../../types/color';
import Icon from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import UUIDGenerator from 'react-native-uuid-generator';
import categories from '../../types/categories';
// import Firebase from '../../components/Firebase';

const CreateGroup = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [avatar, setAvatar] = React.useState(null);
  const maxEntry = 500;
  const maxName = 25;
  const [access, setAccess] = React.useState('public');
  const [count, description, handleDescriptionCount] = useFixedEntry(maxEntry);
  const [nameCount, name, handleNameCount] = useFixedEntry(maxName);
  const [category, setCategory] = React.useState('General');
  const [nameError, setNameError] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState(defaultGroupUri);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uri, setUri] = React.useState('');



  const isWhiteSpace = (str) => {
    for (var i = 0; i < str.length; i++) {
      if (str[i] !== ' ') {
        return false;
      }
    }
    return true;
  };

  //TODO: Refactor all this code to be reusable

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then((image) => {
        storeUploadImage(image);
      })
      .catch((error) => console.log(error));
  };

  const storeUploadImage = (image) => {
    setLoading(true);
    const {path} = image;
    setUri(path.replace('file://', ''));
    setAvatar({uri: path});
    setLoading(false);
  };
  // ................end here.............//

  async function submit() {
    setNameError('');
    setIsSubmitting(true);
    if (name === '') {
      setNameError('Group name is a required field!');
      return;
    } else if (isWhiteSpace(name)) {
      setNameError('Please input a valid alphanumeric character!');
      return;
    } else {
      firestore()
        .collection('GROUPS')
        .add({
          name,
          description,
          photoURL: imageUrl,
          access,
          category,
          createdAt: new Date().getTime(),
          noUsers: 0,
          latestMessage: {
            createdAt: new Date().getTime(),
            text: `Group ${name} created by ${user.displayName}`,
          },
        })
        .then( async(documentRefrence) => {
          if (uri) {
            const ref = storage().ref(
              '/profilePictures/groups/' + documentRefrence.id + 'ProfilePic',
            );
            ref
              .putFile(uri)
              .then((taskSnapshot) => {
                if (taskSnapshot.state === storage.TaskState.SUCCESS) {
                  ref.getDownloadURL().then((url) => {
                    documentRefrence.update({
                      photoURL: url,
                    });
                    firestore()
                    .collection("users")
                    .doc(user.uid)
                    .collection("GROUPS")
                    .doc(documentRefrence.id)
                    .set({
                      name,
                      photoURL:url,
                      latestMessage: {
                        createdAt: new Date().getTime(),
                        text: `Group ${name} created by ${user.displayName}`,
                      },
                    });
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                ToastAndroid.show('Image upload failed!', ToastAndroid.LONG);
              });
          }
          else{
          await firestore()
            .collection("users")
            .doc(user.uid)
            .collection("GROUPS")
            .doc(documentRefrence.id)
            .set({
              name,
              photoURL:imageUrl,
              latestMessage: {
                createdAt: new Date().getTime(),
                text: `Group ${name} created by ${user.displayName}`,
              },
            });
          }
          await documentRefrence.collection('MEMBERS').doc(user.uid).set({
            name: user.displayName,
            isAdmin: true,
          });
          await documentRefrence.collection('MESSAGES').add({
            createdAt: new Date().getTime(),
            text: `Group ${name} created by ${user.displayName}`,
            system: true,
          });

          
          navigation.goBack()
        });
    }
  }

  return (
    <Container style={style.body}>
      <Content style={{paddingTop: 60}}>
        <Avatar
          size="xlarge"
          source={avatar}
          rounded
          activeOpacity={0.5}
          icon={{name: 'camera', type: 'font-awesome', size: 40}}
          onPress={() => pickImage()}
          containerStyle={{backgroundColor: '#cccccc'}}
        />
        {loading ? (
          <ActivityIndicator
            color={orangeTheme}
            size={'large'}
            style={{top: 60, right: 280, position: 'absolute'}}
          />
        ) : null}

        <Text style={{fontSize: 15, marginTop: 10, fontWeight: 'bold'}}>
          Choose group Image
        </Text>
        <Input
          containerStyle={style.input}
          leftIcon={{name: 'people', type: 'ionicons'}}
          errorMessage={nameError}
          inputContainerStyle={{borderColor: greenTheme}}
          label={'Group Name'}
          labelStyle={{color: '#000'}}
          rightIcon={<Text>{nameCount}</Text>}
          onChangeText={handleNameCount}
          maxLength={maxName}
        />
        <Input
          label={'Description'}
          leftIcon={<Icon name={'alert-circle-outline'} size={24} />}
          multiline
          containerStyle={style.input}
          inputContainerStyle={{borderColor: greenTheme}}
          labelStyle={{color: '#000'}}
          rightIcon={<Text>{count}</Text>}
          onChangeText={handleDescriptionCount}
          maxLength={maxEntry}
        />
        <Text style={style.title}>Group Access</Text>
        <View style={style.accessBox}>
          <Text style={{fontSize: 18}}>Public</Text>
          <RadioButton
            value="public"
            color={orangeTheme}
            status={access === 'public' ? 'checked' : 'unchecked'}
            onPress={() => setAccess('public')}
          />
          <Text style={{fontSize: 18}}>Private</Text>
          <RadioButton
            value="private"
            color={orangeTheme}
            status={access === 'private' ? 'checked' : 'unchecked'}
            onPress={() => setAccess('private')}
          />
        </View>
        <Text style={style.title}>Category</Text>
        <Picker
          mode="dialog"
          style={{width: undefined, marginBottom: 60}}
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}>
          {categories.map((value, index) => (
            <Picker.Item label={value.name} value={value.name} key={index} />
          ))}
        </Picker>
        <Button
          title={'Create'}
          buttonStyle={{
            backgroundColor: orangeTheme,
            width: 300,
            alignSelf: 'center',
            marginBottom: 120,
          }}
          raised
          loading={isSubmitting}
          onPress={() => submit()}
        />
      </Content>
    </Container>
  );
};

const style = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 40,
  },
  accessBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
  },
});
export default CreateGroup;
