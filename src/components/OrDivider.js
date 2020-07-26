import React from "react";
import { View, Text, StyleSheet } from "react-native";


const OrDivider = () => (
    <View style={style.body}>
        <View style={style.line}>
        </View>
    <Text style={style.text}>
            Or
        </Text>
        <View style={style.line}>
        </View>
    </View>
    
)

const style = StyleSheet.create({
    body:{
        flexDirection:"row",
        justifyContent:"space-around"
    },
    line:{
        borderBottomWidth:1,
        marginBottom:10,
        width:"35%",
        alignSelf:"center",
        
    },
    text:{
        fontSize:15
    }
})

export default OrDivider;