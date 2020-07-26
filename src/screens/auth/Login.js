import React, {useState, useEffect} from "react";
import { View, StyleSheet } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import { H1, H2 , Container, Item, Input, Content, Text} from 'native-base';
import Button from '../../components/Button';
import { GoogleSigninButton, GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import TextInput from '../../components/TextInput';
import style from '../../styles/formStyles';
import AuthContext from '../../AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import OrDivider from '../../components/OrDivider';



const Login = ({navigation}) => {

    const { login } = React.useContext(AuthContext)
    useEffect(() =>{
        GoogleSignin.configure({
            // scopes: [], // what API you want to access on behalf of the user, default is email and profile
            webClientId: '186105528788-uhpi7cgafottefuomi944pv75jjs6ils.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            // hostedDomain: '', // specifies a hosted domain restriction
            // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            // accountName: '', // [Android] specifies an account name on the device that should be used
            // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
          });
    },[])


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateEmail = value => {
        setEmail(value)
        console.log(email)
    }
    const updatePassword = value => {
        setPassword(value)
        console.log(password)
    }

    signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const { accessToken, idToken } = await GoogleSignin.signIn();
          const credential = firebase.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
          )
          // login with credential
          await firebase.auth().signInWithCredential(credential)
        } catch (error) {
            console.log(error)
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            alert("Login Cancelled!")
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            alert("Login in proccess!")
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            alert("Play Service is not available or outdated!")
          } else {
            // some other error happened
            alert("Error Signing in!")
          }
        }
      };

    


    return(
        <Container>
          <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={{color:"#ffffff"}}
          />
            <View style={style.topContainer}>
                <H1 style={style.welcome}>Welcome,</H1>
                <H2 style={{color:"#616161", marginBottom:30}}>Sign in to continue!</H2> 
            </View>
            <Content>
            <TextInput 
            placeholder='Email'  
            textContentType={"emailAddress"} 
            onChangeText={updateEmail} 
            value={email}
            keyboardType={"email-address"} />
            <TextInput 
            placeholder='Password' 
            secureTextEntry 
            textContentType={"password"}
            onChangeText={updatePassword}
            value={password} />
            <Text style={{bottom:15, marginLeft:"60%"}}>{"Forgot Password?"}</Text>
            <Button onClick={() => {
              setIsLoading(true);
              login(email, password)
              // setIsLoading(false)
              }}>
                <Text style={style.login}>Login</Text>
                </Button>
                <OrDivider />
            <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
                style={style.googlebutton} />
            </Content>
            <Text style={style.footer}>Don't have an account? <Text style={style.link} onPress={()=> navigation.navigate('signup')} >SignUp</Text></Text>
        </Container>
      )


}


export default Login;