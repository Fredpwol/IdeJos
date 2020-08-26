import * as React from "react";
import { View } from "native-base";
import FastImage from 'react-native-fast-image'
import { TouchableNativeFeedback, Dimensions, Image } from "react-native";
import { Icon } from "react-native-elements";
import { greenTheme } from "../types/color";


const Avatar = ({size,onPress,containerStyle,editButton,onPressEdit,...props}) => {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
            if(size == "small"){
                setWidth(50);
                setHeight(50);
            }
            else if(size == "medium"){
                setWidth(100);
                setHeight(100);
            }
            else if (size == "large"){
                setWidth(200);
                setHeight(200);
            }
            else{
                setWidth(50);
                setHeight(50);
            }
    },[size])

    const style = {
        image:{
            height,
            width,
            borderRadius:height/2
        },
        iconStyle:{
            marginLeft:Dimensions.get("window").width - (width + 50), 
            bottom: 60
        }
    }
    return (
    <View style={containerStyle} >
        <TouchableNativeFeedback onPress={onPress} >
        <FastImage style={style.image} {...props} resizeMode={FastImage.resizeMode.contain}  />
        </TouchableNativeFeedback>
        {
            editButton ? (<View style={style.iconStyle}>
                <Icon reverse  name='mode-edit' type='material' color={greenTheme} onPress={onPressEdit} />
                </View>
                ): null
        }
        
    </View>
    )
}


export default Avatar;