import { StyleSheet } from 'react-native'
import { ThemeProvider } from 'react-native-elements'

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
    backgroundColor: '#fff',
  },
  blankTitle: {
    textAlign : 'center',
    flex : 2,
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
  horizontalFlexReverse:{
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
  centerJustified:{
    alignItems : 'center'
  }
});

export {styles , theme}
