import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {defaultUri} from './color';

export const pickImage = async () => {
  try {
    const image = await ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      compressImageQuality: 0.7,
    });
    return image;
  } catch (error) {
    console.log(error);
  }
};

export const cancelRequest = async (userUid, sentUid) => {
  console.log(userUid, sentUid);
  await firestore()
    .collection('users')
    .doc(userUid)
    .collection('request_sent')
    .doc(sentUid)
    .delete();
  await firestore()
    .collection('users')
    .doc(sentUid)
    .collection('requests_recieved')
    .doc(userUid)
    .delete();
};

export const deleteRequest = async (userUid, sentUid) => {
  await firestore()
    .collection('users')
    .doc(userUid)
    .collection('requests_recieved')
    .doc(sentUid)
    .delete();
  await firestore()
    .collection('users')
    .doc(sentUid)
    .collection('request_sent')
    .doc(userUid)
    .delete();
};

export const confirmRequest = async (userUid, sentUid) => {
  await deleteRequest(userUid, sentUid);
  const userRef = firestore().collection('users').doc(userUid);
  const sentRef = firestore().collection('users').doc(sentUid);
  await userRef.collection('CONTACTS').doc(sentUid).set({
    userRef: sentRef,
  });
  await sentRef.collection('CONTACTS').doc(userUid).set({
    userRef,
  });
};

export const storeUploadImage = (image, setUser, storeItem, callback) => {
  const id = new Date().getTime().toString();
  const user = auth().currentUser;
  const {path, mime} = image;
  let ext = mime.slice(mime.indexOf('/') + 1);
  if (ext === 'jpeg') ext = 'jpg';
  const fileName = '/profilePictures/' + user.uid + id + 'profilePic.' + ext;
  const uri = path.replace('file://', '');
  const ref = storage().ref(fileName);

  ref.putFile(uri).then(async (taskSnapshot) => {
    if (taskSnapshot.state === storage.TaskState.SUCCESS) {
      ref.getDownloadURL().then(async (url) => {
        const userData = firestore().collection('users').doc(user.uid);

        const userRef = await userData.get();

        const data = {imagePath: '', photoURL: '', ...userRef.data()};
        if (data.imagePath !== '' && data.photoURL !== defaultUri) {
          const prevRef = storage().ref(data.imagePath);

          await prevRef.delete();
        }

        await firestore().collection('users').doc(user.uid).set(
          {
            imagePath: fileName,
            photoURL: url,
          },
          {merge: true},
        );
        await user.updateProfile({
          photoURL: url,
        });

        setUser(auth().currentUser);
        storeItem(auth().currentUser);
        callback(url);
      });
    }
  });
};

export function trim(word, length){
  if (word.length <= length){
    return word;
  }
  var temp_word = word.slice(0, length) + "...";
  return temp_word;
}