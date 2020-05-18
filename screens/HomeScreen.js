import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {View} from 'react-native'
import { Input, Text , Button} from 'react-native-elements'

import {styles} from "./styles"
import useUserStorage from '../hooks/useUserStorage'

export default function HomeScreen(props){
  const [user,setUser] = useUserStorage();

  return (
    <View style={styles.container}>
      <View style={styles.blankTitle}>
        <Text h4>{user.name}</Text>
        <Text h4>Bienvenido a Breve Breve  </Text>
      </View>
    </View>
  )
}
