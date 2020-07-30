/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Container, H1, H2, Content, Text } from 'native-base';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import style from '../../styles/formStyles';
import TextInput from '../../components/TextInput';
import IntlPhoneInput from 'react-native-intl-phone-input';
import Button from '../../components/Button';
import { AuthContext } from '../../AuthProvider';
import { Formik } from 'formik';
import * as yup from "yup";

const SignUp = ({ navigation }) => {
  const { register } = React.useContext(AuthContext);
  const [Verified, setVerified] = useState(false);


  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .label('Email')
      .required(),
    password: yup
      .string()
      .label("Password")
      .required()
      .min(6),
    confirmPassword: yup
      .string()
      .required()
      .label("Confirm password")
      .test("confirm-password", "Must match previous entry", function (value) {
        return this.parent.password === value
      }),
    phone: yup
      .string()
      .label("Phone Number"),
      // .test("verifyNumber", "Invalid Phone Number", () => Verified),
    username: yup
      .string()
      .required()
      .label("Username")
  });



return (
  <Container>
    <View style={style.topContainer}>
      <H1 style={style.welcome}>Create Account,</H1>
      <H2 style={{ color: '#616161', marginBottom: 30 }}>
        Sign up to get started!
        </H2>
    </View>
    <Formik
      initialValues={{ username: "", email: "", password: "", confirmPassword: "", phone: "" }}
      onSubmit={(values, actions) => {
        const {email, password, username, phone} = values;
        const check = (error) => {
          console.log(error.message)
          switch (error.code){
            case 'auth/email-already-in-use':
              actions.setFieldError("email", "Invalid email address, email already taken");
            default:
              actions.setFieldError("general", "Signup Failed!")
          }
          actions.setSubmitting(false);
          
        }
          register(email, password, username, phone, check);
      }}
      validationSchema={validationSchema} >
      {formikProps => (
        <Content>
          <TextInput
            formikKey={'username'}
            formikProp={formikProps}
            placeholder={"Username"}
            textContentType={'username'}
            name={"user"}
          />
          <TextInput
            formikProp={formikProps}
            formikKey={'email'}
            placeholder={"Email"}
            textContentType={'emailAddress'}
            keyboardType={'email-address'}
            name={"envelope"}
          />
          <TextInput
            formikKey={"password"}
            formikProp={formikProps}
            placeholder={"Password"}
            textContentType={'password'}
            name={'lock'}
          />
          <TextInput
            formikKey={"confirmPassword"}
            formikProp={formikProps}
            placeholder={"Confirm Password"}
            textContentType={'password'}
            name={'lock'}
          />
          <IntlPhoneInput
            onChangeText={(values) => {
              const {dialCode , unmaskedPhoneNumber, isVerified} = values;
              setVerified(isVerified)
              let no = dialCode + unmaskedPhoneNumber;
              console.log(no)
              formikProps.setFieldValue("phone",no);
            }}
            defaultCountry={'NG'}
            dialCodeTextStyle={{ fontSize: 20 }}
            flagStyle={{ fontSize: 20 }}
            phoneInputStyle={{ fontSize: 20 }}
            containerStyle={styles.container}
            placeholder={'Phone Number'}
          />
          <Text style={{color:"red", marginLeft:"5%", marginBottom:10}} >
          { formikProps.touched.phone && formikProps.errors.phone }
          </Text>

          <Button onClick={formikProps.handleSubmit}>
              {formikProps.isSubmitting ? (
            <ActivityIndicator color={"#fff"} size={"large"} />
            ) : (<Text style={style.login}>SignUp</Text>)
              }
              </Button>
          <Text style={style.footer}>
            {'Already have an account? '}
            <Text style={style.link} onPress={() => navigation.navigate('login')}>
              {'Login'}
            </Text>
          </Text>
        </Content>
      )}
    </Formik>

  </Container>
);
};
const styles = StyleSheet.create({
  container: {
    paddingLeft: '20%',
    width: '100%',
    alignContent: 'center',
  },
});
export default SignUp;
