import React, {useState, useEffect, useContext} from 'react';
import { FlatList, ActivityIndicator} from 'react-native';
import {
  Container,
  Text,
  H2,
  Left,
  Right,
  Content,
  ListItem as List,
  Body,
} from 'native-base';
import UserListItem from '../../components/UserListItem';
import Loading from '../../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../AuthProvider';
import { SearchBar } from 'react-native-elements';
import { orangeTheme } from '../../types/color';
import UserModalScreen from '../../components/UserModalScreen';

const Members = ({route}) => {
  const {user} = useContext(AuthContext);
  const group = route.params.group;
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setisVisble] = useState(false);
  const [lastMember, setLastMember] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const getUserData = async (userId) => {
    const user = await firestore().collection('users').doc(userId).get();
    let res = user.data();
    return res;
  };

  const toggleVisible = () => setisVisble((isVisible) => !isVisible);

  useEffect(() => {

    const fetchGroupData = async () => {
      const groupref = firestore().collection('GROUPS').doc(group._id);
      const membersData = await groupref.collection('MEMBERS')
      .orderBy("name")
        .get();
      setMembers([]);
      membersData.forEach(async (documentSnaphot,index) => {
        const tempData = await getUserData(documentSnaphot.id);

        const data = {
          _id: documentSnaphot.id,
          isAdmin: false,
          displayName: '',
          status: null,
          ...documentSnaphot.data(),
          ...tempData,
        };
        firestore()
          .doc(`status/${data._id}`)
          .get()
          .then((docSnap) => {
            if (docSnap.exists) {
              const val = docSnap.data();
              if (val.state == 'online') {
                data.status = 'Online';
              } else {
                const now = new Date();
                const seen = val.last_changed.toDate();
                let day = '';
                if (now.getDate() == seen.getDate()) {
                  day = 'today';
                } else if (now.getDate() == seen.getDate() + 1) {
                  day = 'yesterday';
                } else {
                  day = seen.toLocaleDateString();
                }
                console.log(now.toDateString());
                let hour = (seen.getUTCHours() + 1) % 24;
                let minute = seen.getUTCMinutes();
                data.status = `last seen: ${day} at ${hour}:${minute}`;
              }
            }
          });
        if (data._id == user.uid) {
          data.displayName = 'You';
          setIsAdmin(data.isAdmin);
        }
        setMembers((prevMem) => [...prevMem, data]);
        if(index == 3)setLastMember(data.name);
    });
  };
  fetchGroupData();
    console.log(members);
    setIsLoading(false);
}, []);


  // const retriveMore = async() => {
  //   setFetching(true);
  //   try{
  //     const groupref = firestore().collection('GROUPS').doc(group._id);
  //     const membersData = await groupref.collection('MEMBERS')
  //     .orderBy("name")
  //     .startAfter(lastMember)
  //     .limit(10)
  //     .get();

  //     membersData.forEach(async (documentSnaphot, index) => {
  //       const tempData = await getUserData(documentSnaphot.id);

  //       const data = {
  //         _id: documentSnaphot.id,
  //         isAdmin: false,
  //         displayName: '',
  //         status: null,
  //         ...documentSnaphot.data(),
  //         ...tempData,
  //       };
  //       firestore()
  //         .doc(`status/${data._id}`)
  //         .get()
  //         .then((docSnap) => {
  //           if (docSnap.exists) {
  //             const val = docSnap.data();
  //             if (val.state == 'online') {
  //               data.status = 'Online';
  //             } else {
  //               const now = new Date();
  //               const seen = val.last_changed.toDate();
  //               let day = '';
  //               if (now.getDate() == seen.getDate()) {
  //                 day = 'today';
  //               } else if (now.getDate() == seen.getDate() + 1) {
  //                 day = 'yesterday';
  //               } else {
  //                 day = seen.toLocaleDateString();
  //               }
  //               console.log(now.toDateString());
  //               let hour = (seen.getUTCHours() + 1) % 24;
  //               let minute = seen.getUTCMinutes();
  //               data.status = `last seen: ${day} at ${hour}:${minute}`;
  //             }
  //           }
  //         });
  //       if (data._id == user.uid) {
  //         data.displayName = 'You';
  //         setIsAdmin(data.isAdmin);
  //       }
  //       if (index == 9) setLastMember(data.name);
  //       setMembers((prevMem) => [...prevMem, data]);
  //     });
  //     setFetching(false);
  //   }
  //   catch(error){
  //     setFetching(false);
  //     console.log(error);
  //     ToastAndroid.show(error.message, ToastAndroid.LONG);
  //   }
    
  //   };


    const renderFooter = () => {
      if (fetching) return <ActivityIndicator color={orangeTheme} />;
      return null;
    };

  return (
    <Container>
      <SearchBar
      inputContainerStyle={{backgroundColor:"white"}}
      placeholder="Search Members"
      lightTheme />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          style={{marginBottom: 10}}
          data={members}
          scrollToOverflowEnabled
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item._id}
          renderItem={(item) => (
            <UserListItem
              user={item.item}
              isAdmin={isAdmin}
              onPress={() => {
                setSelectedUser(item.item);
                toggleVisible();
              }}
            />
          )}
        />
      )}
      <UserModalScreen isVisible={isVisible} onClose={toggleVisible} person={selectedUser} />
    </Container>
  );
};

export default Members;
