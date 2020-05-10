import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SplashScreen } from 'expo';
import { createStackNavigator } from '@react-navigation/stack'
import {firebase} from 'firebase'

import { ThemeProvider } from 'react-native-elements'
import {theme} from './screens/styles.js'

import LoadingScreen from './screens/LoadingScreen.js'
import LoginScreen from './screens/auth/LoginScreen.js'
import firebaseConf from './ApiKeys.js'

const Stack = createStackNavigator()

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();

  React.useEffect(()=>{
    async function loadResourcesAndData(){
      try {
        // load everything
        SplashScreen.preventAutoHide();
        firebase.initializeApp(firebaseConf);
      } catch (e){
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }
  },[]);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="login" headerMode="None">
          <Stack.Screen name="loading" component={LoadingScreen}/>
          <Stack.Screen name="login" component={LoginScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
