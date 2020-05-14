import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { ThemeProvider } from 'react-native-elements'
import {theme} from './screens/styles'

import useCachedResources from './hooks/useCachedResources'
import LoadingScreen from './screens/LoadingScreen.js'
import LoginScreen from './screens/auth/LoginScreen.js'
import RegisterScreen from './screens/auth/RegisterScreen.js'


const Stack = createStackNavigator()

export default function App(props) {
  const isLoadingComplete = useCachedResources();

  if(!isLoadingComplete){
    return null;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName="login" headerMode="None">
            <Stack.Screen name="loading" component={LoadingScreen}/>
            <Stack.Screen name="login" component={LoginScreen}/>
            <Stack.Screen name="register" component={RegisterScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  }
}
