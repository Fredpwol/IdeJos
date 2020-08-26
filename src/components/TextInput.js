import React from 'react';
import {Input, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View} from 'react-native';
import {greenTheme} from '../types/color';

const useTextVisibility = () => {
  const [visible, setVisible] = React.useState(false);
  const name = visible ? 'eye-slash' : 'eye';
  const DisplayIcon = (
    <Icon name={name} size={24} onPress={() => setVisible(!visible)} />
  );

  return [!visible, DisplayIcon];
};

const TextInput = ({formikProp, formikKey, name, ...rest}) => {
  const [visible, DisplayIcon] = useTextVisibility();

  const style = {
    inputStyle: {
      width: '90%',
      marginLeft: '3%',
      paddingLeft: 25,
      marginBottom: 10,
    },
  };

  const borderColor =
    formikProp.touched[formikKey] && formikProp.errors[formikKey]
      ? 'red'
      : greenTheme;

  return (
    <View>
      <Input
        containerStyle={style.inputStyle}
        onChangeText={formikProp.handleChange(formikKey)}
        onBlur={formikProp.handleBlur(formikKey)}
        leftIcon={<Icon name={name} size={24} color="black" />}
        rightIcon={name === 'lock' ? DisplayIcon : null}
        secureTextEntry={name === 'lock' ? visible : false}
        errorMessage={
          formikProp.touched[formikKey] && formikProp.errors[formikKey]
        }
        inputContainerStyle={{borderColor: borderColor}}
        {...rest}
      />
      {/* <Text style={{color:"red", marginLeft:"5%", marginBottom:20}} >
          {  }
          </Text> */}
    </View>
  );
};
export default TextInput;
