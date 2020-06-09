import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import firebase from 'firebase'

import { ThemeProvider } from 'react-native-elements'
import {theme} from './screens/styles'

import useCachedResources from './hooks/useCachedResources'
import useUserStorage from './hooks/useUserStorage'
import LoadingScreen from './screens/LoadingScreen.js'
import HomeScreen from './screens/home/HomeScreen.js'
import NewOrderScreen from './screens/order/NewOrderScreen.js'
import LoginScreen from './screens/auth/LoginScreen.js'
import RegisterScreen from './screens/auth/RegisterScreen.js'


const Stack = createStackNavigator()




export default function App(props) {
  const [isLoadingComplete,auth,setAuth] = useCachedResources();
  const [user, setUser] = useUserStorage({});
  const navigationRef = React.createRef();


  _userChanged = (authUser) =>{
    setUser(authUser)
    setAuth(true)
  }


  if(!isLoadingComplete){
    return null;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="login" headerMode="None">
            {auth? (
              <>
                <Stack.Screen name="home" component={HomeScreen}/>
                <Stack.Screen name="newOrder" component={NewOrderScreen}/>
              </>
            ) : (
              <>
                <Stack.Screen name="login" component={LoginScreen}/>
                <Stack.Screen name="register" >
                  {props => <RegisterScreen {...props} onUserChanged={this._userChanged.bind(this)}/>}
                </Stack.Screen>
              </>
            )}
            <Stack.Screen  name="loading" component={LoadingScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  }
}
