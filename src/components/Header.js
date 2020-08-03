import * as React from 'react';
import Header from 'react-native-custom-header';
import {AuthContext} from '../AuthProvider';
import { Image, View, StyleSheet, Dimensions, StatusBar } from 'react-native'
import { logo } from '../images';
import Avatar from './Avatar';
import FastImage from 'react-native-fast-image'


const {width} = Dimensions.get("window")
const MainHeader = ({leftComponent}) => {
  const {user} = React.useContext(AuthContext);
 
  return (
    <View style={style.header}>
        <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} translucent />
        <Avatar size={"small"} source={{uri: user.photoURL}} />
        <FastImage source={logo} style={style.title} resizeMode={"contain"} />
        <View style={style.menu} >
            {leftComponent}
        </View>   
    </View>
  );
};
const style = StyleSheet.create({
    header:{
        height:80,
        width,
        backgroundColor:"#fff",
        top:0,
        position:"relative",
        paddingTop:20,
        paddingLeft:10,
        flexDirection:"row",
    },
    title:{
      marginLeft:80,
      width:120,
      height:60,
    },
    menu:{
      right:15,
      top:45,
      position:"absolute"
    }
})

export default MainHeader;
