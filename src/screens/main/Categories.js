import * as React from 'react';
import {Container, Content} from 'native-base';
import {Text, Icon, ListItem} from 'react-native-elements';
import { AuthContext } from '../../AuthProvider';
import categories from '../../types/categories';

const Categories = ({navigation}) => {
    const {user} = React.useContext(AuthContext)
  return (
    <Container>
      <Content>
      {categories.map((item, index) => (
        <ListItem
        key={index}
        title={item.name}
        leftIcon={item.icon}
        bottomDivider
        containerStyle={{height:80}}
        onPress={() => navigation.navigate('groupCategory', {name: item.name})}
        chevron
         />
      ))}
      </Content>
    </Container>
  );
};
export default Categories;
