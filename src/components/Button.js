import React from 'react';
import { TouchableNativeFeedback, TouchableOpacity,View, StyleSheet } from 'react-native';
import { orangeTheme } from '../types/color'

const Button = ({children, onClick}) => {
    return(
        <TouchableOpacity onPress={onClick}>
            <View style={style.container}>
                <View style={{alignSelf:"center"}}>
                    {children}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    container:{
        backgroundColor:orangeTheme,
        borderRadius:20,
        width:"90%",
        height:60,
        marginLeft:"5%",
        // paddingLeft:"40%",
        marginBottom:20,
        justifyContent:"center",
        alignContent:'center',
        shadowColor:"#000000",
        shadowOpacity:1,
        elevation:3,
    }
})

export default Button;