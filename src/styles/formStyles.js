import {StyleSheet, Dimensions} from 'react-native';
import {greenTheme, orangeTheme} from '../types/color';

const {width, height} = Dimensions.get('window');
export default style = StyleSheet.create({
  modalBox: {
    overflow: 'hidden',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height,
    width,
  },
  modalContainer: {
    flexDirection: 'row',
    height: 200,
    width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 80,
    bottom: 0,
    paddingTop: 30,
    position: 'absolute',
    backgroundColor: '#fff',
  },
  welcome: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 32,
  },
  topContainer: {
    marginTop: '20%',
    paddingLeft: 10,
  },
  login: {
    color: '#ffffff',
    fontSize: 20,
  },
  googlebutton: {
    width: '90%',
    height: 60,
    marginLeft: '5%',
    borderRadius: 20,
  },
  footer: {
    alignSelf: 'center',
    paddingBottom: 30,
  },
  link: {
    fontWeight: 'bold',
    color: greenTheme,
  },
  centerContent: {
    flex: 1,
    alignContent: 'center',
    paddingTop: '10%',
  },
});
