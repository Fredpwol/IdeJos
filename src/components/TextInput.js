import React from 'react';
import { Input } from 'native-base';
import { StyleSheet } from 'react-native';
import {greenTheme} from '../types/color';

const TextInput = (props) => {
    return (
        <Input {...props} style={style.inputStyle} />
    ) 
}

const style = StyleSheet.create({
    inputStyle:{
        borderColor: greenTheme,
        borderWidth:1,
        borderRadius:20,
        width:"90%",
        marginLeft:"5%",
        paddingLeft:25,
        marginBottom:30
    },
})
export default TextInput