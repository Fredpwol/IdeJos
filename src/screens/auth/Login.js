/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, Alert, ToastAndroid} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {H1, H2, Container, Content, Text} from 'native-base';
import Button from '../../components/Button';
import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import TextInput from '../../components/TextInput';
import style from '../../styles/formStyles';
import {AuthContext} from '../../AuthProvider';
import OrDivider from '../../components/OrDivider';
import {Formik} from 'formik';
import * as yup from 'yup';
// import Firebase from '../../components/Firebase';

const Login = ({navigation}) => {
  const {login} = React.useContext(AuthContext);
  useEffect(() => {
    GoogleSignin.configure({
      // scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '186105528788-uhpi7cgafottefuomi944pv75jjs6ils.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      // login with credential
      const user = await firebase.auth().signInWithCredential(credential);
      const userData = user.user;
      await firestore().collection('users')
      .doc(userData.uid)
      .set({
        displayName: userData.displayName,
        about: '',
        photoURL:userData.photoURL,
        phoneNumber: ''
      })
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        ToastAndroid.show('Login Cancelled!',ToastAndroid.LONG)
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        ToastAndroid.show('Login in proccess!', ToastAndroid.LONG);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert("Error",'Play Service is not available or outdated!');
      } else {
        // some other error happened
        Alert.alert("Error",'Error Signing in!');
      }
    }
  };

  const validationSchema = yup.object().shape({
    email: yup
          .string()
          .email()
          .label('Email')
          .required(),
    password:yup
          .string()
          .label("Password")
          .required()
          .min(6)
  });

  return (
    <Container>
      <View style={style.topContainer}>
        <H1 style={style.welcome}>Welcome,</H1>
        <H2 style={{color: '#616161', marginBottom: 30}}>
          Sign in to continue!
        </H2>
      </View>
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={(values, actions) => {
          const check = (error) => {
            if (error.code == 'auth/user-not-found'){
                actions.setFieldError("email", "Invalid email address, email not found");
            }
            else if(error.code == 'auth/wrong-password'){
              actions.setFieldError("password", "Invalid Password");
            }
            else{
              actions.setFieldError("general", "Login Failed!");
            }   
            actions.setSubmitting(false);
        }
          login(values.email, values.password, check )
        }}
        validationSchema={validationSchema}>
        {(formikProp) => (
          <Content>
            <Text style={{color:"red", marginHorizontal:"35%"}}>{formikProp.errors.general}</Text>
            <TextInput
              formikProp={formikProp}
              formikKey={'email'}
              placeholder={"Email"}
              textContentType={'emailAddress'}
              keyboardType={'email-address'}
              name={"envelope"}
            />
            <TextInput
              formikProp={formikProp}
              formikKey={'password'}
              placeholder={"Password"}
              textContentType={'password'}
              name={"lock"}
            />
            
            <Text style={{bottom: 15, marginLeft: '60%'}}>
              {'Forgot Password?'}
            </Text>
              <Button onClick={formikProp.handleSubmit}>
              {formikProp.isSubmitting ? (
            <ActivityIndicator color={"#fff"} size={"large"} />
            ) : (<Text style={style.login}>Login</Text>)
              }
              </Button>
            <OrDivider />
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
            style={style.googlebutton}
          />
          </Content>
        )}
      </Formik>

      <Text style={style.footer}>
        Don't have an account?{' '}
        <Text style={style.link} onPress={() => navigation.navigate('signup')}>
          SignUp
        </Text>
      </Text>
    </Container>
  );
};

export default Login;
