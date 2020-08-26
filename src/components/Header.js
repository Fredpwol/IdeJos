import * as React from 'react';
import Header from 'react-native-custom-header';
import {AuthContext} from '../AuthProvider';
import { Image, View, StyleSheet, Dimensions, StatusBar } from 'react-native'
import { logo } from '../images';
import Avatar from './Avatar';
import FastImage from 'react-native-fast-image'
import { H1 } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';


const {width} = Dimensions.get("window")
const MainHeader = ({leftComponent, rightComponent, title}) => {
  const {user} = React.useContext(AuthContext);
 
  return (
    <SafeAreaView>
    <View style={style.header}>
        <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} translucent />
        <View>
        {leftComponent}
        </View>
        <H1 style={{...style.title,fontWeight:"bold", fontFamily:"Roboto" }}>{title}</H1>
        <View style={style.menu} >
            {rightComponent}
        </View>   
    </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
    header:{
        height:60,
        width,
        backgroundColor:"#fff",
        top:0,
        position:"relative",
        paddingHorizontal:10,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    title:{
      width:120,
      height:60,
      marginTop:15
    },
    menu:{
      marginTop:15
    }
})

export default MainHeader;
