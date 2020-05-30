import * as React from 'react'
import {View, SafeAreaView, ScrollView} from 'react-native'
import { Text , Button, Icon, Header,Divider} from 'react-native-elements'

import {styles,theme} from "../styles"

import DelivererChoice from "./components/DelivererChoice"

export default function HomeScreen(props) {

  _delivererSelected = (deliverer) => {
    props.navigation.navigate('newOrder',{screen : 'orderType', params : deliverer})
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <View style={{flex : 2}}>
          <Button
            icon={{ name: "plus", type: "antdesign",color:theme.colors.secondary}}
            title="Orden" type="clear" onPress={()=>props.navigation.navigate('newOrder')} />
        </View>
        <View style={{flex:4}}></View>
        <View style={{flex:1}}>
            <Icon name="user-circle" type="font-awesome" size={28} color={theme.colors.primary}/>
        </View>
      </View>
      <Divider />
      <View style={styles.screenBody}>
        <ScrollView>
          <DelivererChoice onDelivererSelected={this._delivererSelected.bind(this)}/>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
