import * as React from 'react';
import {Container, Content} from 'native-base';
import Avatar from '../../components/Avatar';
import {Text, Button} from 'react-native-elements';
import {View, StyleSheet, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../AuthProvider';

const GroupDetails = ({route, navigation}) => {
  const {group} = route.params;
  const { user } = React.useContext(AuthContext)
  const [isUser, setIsUser] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    const checkUser = async () =>{
        const doc = await firestore().collection('GROUPS').doc(group._id).collection('MEMBERS').doc(user.uid).get();
        if (doc.exists){
            setIsUser(true)     
        }
    }
    checkUser()
  }
  ,[])
  const submit = async () => {
    if (isUser) {
        navigation.navigate('GroupChat', {group})
    }
    else{
        setIsLoading(true);
        await firestore()
        .collection("users")
        .doc(user.uid)
        .collection("GROUPS")
        .doc(group._id)
        .set({
          name: group.name,
          photoURL: group.photoURL
          });

        await firestore()
            .collection('GROUPS')
            .doc(group._id)
            .collection('MEMBERS')
            .doc(user.uid)
            .set({
                name: user.displayName,
                isAdmin: false,
            })
        setIsUser(true)
        setIsLoading(false);
    }
  };
  return (
    <Container>
      <Content>
        <View style={style.avatarContainer}>
          <Avatar size={'large'} source={{uri: group.photoURL}} />
        </View>
        <Text style={style.titleStyle}>{group.name}</Text>
        <Text style={{alignSelf:"center", marginBottom:10, fontSize:18,opacity:0.8}}>{`Members: ${group.noUsers}`}</Text>
        <Text style={style.alignText}> {group.description} </Text>
        <Button
          title={isUser ? 'Enter' : 'Join'}
          type={'outline'}
          containerStyle={style.joinButton}
          buttonStyle={{borderWidth: 2}}
          loading={isLoading}
          onPress={submit}
        />
      </Content>
    </Container>
  );
};

const style = StyleSheet.create({
  titleStyle: {
    alignSelf: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
    fontSize: 25,
    opacity:0.8
  },
  avatarContainer: {
    alignSelf: 'center',
    marginVertical: 50,
  },
  alignText: {
    alignSelf: 'center',
    marginBottom: 40,
    marginHorizontal: 15,
    opacity:0.8,
    fontFamily:"Roboto"
  },
  joinButton: {
    width: 200,
    alignSelf: 'center',
  },
});

export default GroupDetails;
