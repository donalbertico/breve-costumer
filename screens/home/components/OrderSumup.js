import * as React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {Text, Icon, Avatar,Divider,Card} from 'react-native-elements'


import {styles, theme} from "../../styles"

function title(){
  return (
    <View>
      <Text h3>{orderTypeDic[order]}</Text>
      <View style={styles.horizontalFlex}>
        <Text>{order.deliverer.name}</Text>
        <Avatar rounded source={{ uri: oder.deliverer.pic}}/>
      </View>
    </View>

  )
}

export default function OrderSumup(props){
  const order = props.order
  console.log(order);
  const orderTypeDic = {
    0 : 'express',
    1 : 'punto a punto',
    2 : 'en linea'
  }

  return (
    <View>
      <Card>
        <Text h3>Orden {orderTypeDic[order.type]}</Text>
        <View style={styles.horizontalFlex}>
          <Text>{order.deliverer.name}</Text>
          <Avatar rounded source={{ uri: order.deliverer.pic}}/>
        </View>
        <Divider/>
      </Card>
    </View>
  )
}
