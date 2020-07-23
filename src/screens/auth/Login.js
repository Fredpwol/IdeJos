import React, {useState} from "react";
import { View, StyleSheet } from 'react-native';
import { H1, H2 , Container, Item, Input, Content, Text} from 'native-base';
import Button from '../../components/Button';
import { GoogleSigninButton } from '@react-native-community/google-signin';
import TextInput from '../../components/TextInput';
import style from '../../styles/formStyles'


const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const updateEmail = value => {
        setEmail(value)
        console.log(email)
    }
    const updatePassword = value => {
        setPassword(value)
        console.log(password)
    }
    return(
        <Container>
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
            <Button><Text style={style.login}>Login</Text></Button>
            <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} style={style.googlebutton} />
            </Content>
            <Text style={style.footer}>Don't have an account? <Text style={style.link} onPress={()=> navigation.navigate('signup')} >SignUp</Text></Text>
        </Container>

    )

}


export default Login;