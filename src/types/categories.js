import { Icon } from "react-native-elements";
import * as React from 'react';
import { orangeTheme, greenTheme } from "./color";

function compareFunction(first, second){
  first = first.name.toLowerCase();
  second = second.name.toLowerCase();

  let result = 0;
  if (first > second){
    result = 1
  }
  else if (second > first){
    result = -1
  }
  return result
}

const generalColor = orangeTheme;

export default  [
    {name:'General', icon:<Icon type="font-awesome-5" name="globe" size={32} color={generalColor} />},
    {name:'Education',icon:<Icon type="font-awesome-5" name="book" size={32} color={generalColor} />},
    {name:'Religion', icon:<Icon type="font-awesome-5" name="praying-hands" size={32} color={generalColor} />},
    {name:'Sport', icon:<Icon type="font-awesome-5" name="futbol" size={32} color={generalColor} />},
    {name:'Entertainment', icon:<Icon type="font-awesome-5" name="music" size={32} color={generalColor} />},
    {name:'News', icon:<Icon type="font-awesome-5" name="newspaper" size={32} color={generalColor} />},
    {name:'Technology', icon:<Icon type="font-awesome-5" name="robot" size={32} color={generalColor} />},
    {name:'Business', icon:<Icon type="font-awesome-5" name="briefcase" size={32} color={generalColor} />},
    {name:'Romance', icon:<Icon type="font-awesome-5" name="heart" size={32} color={generalColor} />},
    {name:'Gossip', icon:<Icon type="font-awesome-5" name="comments" size={32} color={generalColor} />},
    {name:'Politics', icon:<Icon type="font-awesome-5" name="landmark" size={32} color={generalColor} />},
    {name:'Science', icon:<Icon type="font-awesome-5" name="flask" size={32} color={generalColor} />},
    {name:'Arts', icon:<Icon type="font-awesome-5" name="palette" size={32} color={generalColor} />},
    {name:'Comedy', icon:<Icon type="font-awesome-5" name="theater-masks" size={32} color={generalColor} />},
    {name:"Housing", icon:<Icon type="font-awesome-5" name="home" size={32} color={generalColor} />},
    {name:"Nature", icon:<Icon type="font-awesome-5" name="tree" size={32} color={generalColor} />},
    {name:"Social Service", icon:<Icon type="font-awesome-5" name="people-arrows" size={32} color={generalColor} />},
    {name:"Food", icon:<Icon type="font-awesome-5" name="utensils" size={32} color={generalColor} />}
  ].sort(compareFunction)