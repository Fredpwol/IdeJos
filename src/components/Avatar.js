import * as React from "react";
import { View } from "native-base";
import FastImage from 'react-native-fast-image'


const Avatar = ({size,...props}) => {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
        switch (size){
            case ("small"):
                setWidth(10);
                setHeight(0);
            case ("medium"):
                setWidth(100);
                setHeight(100);
            case ("large"):
                setWidth(500);
                setHeight(500);;
            default:
                setWidth(50);
                setHeight(50);
        }
    },[size])

    const style = {
        container:{
          marginTop:5,
    
        },
        image:{
            height,
            width,
            borderRadius:height/2
        }
    }
    return (
    <View style={style.container}>
        <FastImage style={style.image} {...props} resizeMode={FastImage.resizeMode.contain}  />
    </View>
    )
}


export default Avatar;