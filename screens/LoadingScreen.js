import React from 'react'
import {View, } from 'react-native'
import { Input, Text , Button} from 'react-native-elements'

import {styles} from "./styles"

export default function LoadingScreen(props) {

  return (
    <View style={styles.blankTitle}>
      <Text h4>Loading....</Text>
    </View>
  )
}
