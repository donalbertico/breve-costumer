import * as React from 'react'
import {View, SafeAreaView, ScrollView} from 'react-native'
import { Text , Button, Icon, Header,Divider, Avatar} from 'react-native-elements'

import {styles,theme} from "../styles"

import useOrderStorage from "../../hooks/useOrderStorage"

export default function PointScreen(props) {
  const [order,setOrder] = useOrderStorage();
  const orderTypeDic = {
    0 : 'express',
    1 : 'punto a punto',
    2 : 'en linea'
  }
  console.log(order);
  if(order == 'in'){
    return (
      <SafeAreaView style={styles.container}>
        <Text>{'espede'}</Text>
      </SafeAreaView>
    )
  }else{
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.screenHeader}>
          <View style={{flex:1}}>
            <Icon name="back" type="antdesign" size={28} color={theme.colors.primary}/>
          </View>
          <View style={{flex : 1}}></View>
          <View style={{flex : 4}}>
            <Text h4>{'Orden '}{orderTypeDic[order.type]}</Text>
            <Text style={styles.secondaryText}>{order.deliverer.name}</Text>
          </View>
          <View style={{flex : 1}}>
            <Avatar rounded source={{ uri:  order.deliverer.pic}}/>
          </View>
        </View>
        <Divider />
        <View style={styles.screenBody}>

        </View>
      </SafeAreaView>
    )
  }
}
