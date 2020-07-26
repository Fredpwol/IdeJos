import React, { useState, useEffect } from 'react';
import { Container, H1, H2, Content, Text } from 'native-base';
import { View, StyleSheet } from 'react-native';
import style from '../../styles/formStyles';
import TextInput from '../../components/TextInput';
import IntlPhoneInput from 'react-native-intl-phone-input';
import Button from '../../components/Button';
import AuthContext from '../../AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';


const SignUp = ({navigation}) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = React.useContext(AuthContext);

    const updateEmail = value => {
        setEmail(value)
        console.log(email)
    }
    const updatePassword = value => {
        setPassword(value)
        console.log(password)
    }
    const updatePhone = ({dialCode, unmaskedPhoneNumber, phoneNumber, isVerified}) => {
        setPhone(unmaskedPhoneNumber)
        console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified);
    }
    const updateUser = value => {
        setUsername(value)
        console.log(username)
    }



    
    return(
        <Container>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={{color:"#ffffff"}}
          />
             <View style={style.topContainer}>
                <H1 style={style.welcome}>Create Account,</H1>
                <H2 style={{color:"#616161", marginBottom:30}}>Sign up to get started!</H2> 
            </View>
            <Content>
            <TextInput 
            placeholder='Username'   
            onChangeText={updateUser}
            textContentType={"username"} 
            value={username}
             />
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

            <IntlPhoneInput 
            onChangeText={updatePhone} 
            defaultCountry={"NG"}
            dialCodeTextStyle={{fontSize:20}} 
            flagStyle={{fontSize:20}}
            phoneInputStyle={{fontSize:20}} 
            containerStyle={styles.container}
            placeholder={"Phone Number"} />

            <Button onClick={() => {
                setIsLoading(true) 
                register(email, password, username, phone)
                }}>
                <Text style={style.login}>Sign Up</Text>
            </Button>
            <Text style={style.footer}>
                {"Already have an account? "} 
                <Text style={style.link} onPress={()=> navigation.navigate('login')} >
                    {"Login"}
                </Text>
            </Text>
            </Content>
        </Container>
    )
}
const styles = StyleSheet.create({
    container:{
        paddingLeft:"20%",
        width:"100%",
        alignContent:"center"
    }
})
export default SignUp;