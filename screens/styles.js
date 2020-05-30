import { StyleSheet, Dimensions } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import Constants from 'expo-constants';

const theme = {
  colors : {
    primary : '#009688',
    secondary : '#607D8B',
    grey0 : '#757575',
    grey1 : '#BDBDBD',
    error : '#F44336',
    warning: '#FF9800'
  },
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  keyAvoContainer:{
    flex : 1,
    alignItems : 'center'
  },
  KeAvContScrollView: {
    flex:1,
    width :  Math.round(Dimensions.get('window').width)
  },
  blankTitle: {
    textAlign : 'center',
    flex : 2,
    justifyContent : 'center',
    alignItems : 'center'
  },
  scrollTitle: {
    textAlign : 'center',
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  },
  centeredBox: {
    flex:5,
    margin: 10
  },
  subtleHorizontalMargin: {
    marginHorizontal : 10
  },
  horizontalFlex:{
    flexDirection:'row'
  },
  longMainButton:{
    marginHorizontal : 10,
    marginBottom : 10
  },
  nextToButton:{
    marginTop:13
  },
  errorMessage:{
    color : theme.colors.error
  },
  secondaryText:{
    color : theme.colors.grey0
  },
  centerJustified:{
    alignItems : 'center'
  },
  screenHeader:{
    flex : 1,
    flexDirection:'row',
    alignItems : 'center',
    marginRight : 5
  },
  screenBody :{
    flex :8,
    marginTop :10
  },
  marginedText :{
    margin : 5
  }
});

export {styles , theme}
